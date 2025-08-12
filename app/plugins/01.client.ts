import { createTRPCNuxtClient , httpBatchLink, httpLink } from 'trpc-nuxt/client'

import type { AppRouter } from '~~/server/trpc/routers'
import type{ TRPCLink   } from '@trpc/client'
import {  retryLink   } from '@trpc/client'
import { observable } from '@trpc/server/observable';
/**
 * 重试机制
 * trpc对于500错误会自动重试, 所以需要在trpc的后端路由抛出400错误
 */
const retry = retryLink({
      retry(opts) {
        if (
          opts.error.data &&
          opts.error.data.code !== 'INTERNAL_SERVER_ERROR'
        ) {
          // Don't retry on non-500s
          return false;
        }
        if (opts.op.type !== 'query') {
          // Only retry queries
          return false;
        }
        // Retry up to 1 times
        return opts.attempts <= 0;
      },
      // Double every attempt, with max of 30 seconds (starting at 1 second)
      retryDelayMs: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
    })
// 异常处理
const customLink: TRPCLink<AppRouter> = () => {
  const toast = useToast()
  // here we just got initialized in the app - this happens once per app
  // useful for storing cache for instance
  return ({ next, op }) => {
    // this is when passing the result to the next link
    // each link needs to return an observable which propagates results
    return observable((observer) => {
      // console.log('performing operation:', op);
      const unsubscribe = next(op).subscribe({
        next(value) {
          // console.log('we received value', value);
          observer.next(value);
        },
        error(err) {
          // console.log('we received error', err);
          // observer.error(err);
          toast.add({
            title: err.data?.httpStatus +  '错误',
            description: err.message || '发生未知错误',
            color: 'error',
          })
            observer.error(err)
        },
        complete() {
          observer.complete();
        },
      });
      return unsubscribe;
    });
  };
};

const getHeader = ()=>{
  return {
    'agent-user-name':  useStore().selectAgentUserName.value,
    'agent-user-id':  useStore().selectAgentId.value,
  }
}
console.log('process.env.TRPC_SERVER_URL ',process.env.TRPC_SERVER_URL );

export default defineNuxtPlugin(() => {
  const trpc = createTRPCNuxtClient<AppRouter>({
    links: [retry,customLink,httpLink({ 
      url: useRuntimeConfig().public.TRPC_SERVER_URL + '/api/trpc',
      fetch(url, options){
        return fetch(url,{
          ...options,
          credentials: 'include'
        })
      } 
    }),],
  })
  return {
    provide: {
      trpc,
    },
  }
})