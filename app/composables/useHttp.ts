import type { FetchResponse, SearchParameters } from 'ofetch'
export interface ResOptions<T> {
  data: T
  code: number
  message: string
  success: boolean
}

const handleError = <T>(response: FetchResponse<ResOptions<T>> & FetchResponse<ResponseType>) => {
  const toast = useToast()
  const err = (text: string) => {
    const msg = text ?? response?._data?.message
    // 请确保 message 已正确导入，以下代码示例使用 message 输出错误
    toast.add({ title: '请求错误', description: msg, color: 'warning' })
  }
  if (!response._data) {
    err('请求超时，服务器无响应！')
    return
  }
  // const userStore = useUserStore()
  const handleMap: { [key: number]: () => void } = {
    404: () => err('服务器资源不存在'),
    500: () => err('服务器内部错误'),
    403: () => {
      //   useLStorage.removeSysLoginToken()
      //   useLStorage.removeSeeting()
      err('登录状态已过期，请重新登录')
      navigateTo('/login')
    },
    401: () => {
      //    useLStorage.removeSysLoginToken()
      //   useLStorage.removeSeeting()
      err('登录状态已过期，请重新登录')
      // userStore.clearUserInfo()
      // TODO 跳转实际登录页
      navigateTo('/login')
    },
  }
  // 先获取处理函数
  const handler = handleMap[response.status];
  // 检查并调用
  if (handler) {
    handler();
  } else {
    err('未知错误！');
  }
}

// // get方法传递数组形式参数
const paramsSerializer = (params?: SearchParameters) => {
  if (!params)
    return

  const query = JSON.parse(JSON.stringify(params))
  Object.entries(query).forEach(([key, val]) => {
    if (typeof val === 'object' && Array.isArray(val) && val !== null) {
      query[`${key}[]`] = toRaw(val).map((v: any) => JSON.stringify(v))
      delete query[key]
    }
  })
  return query
}

const fetch = $fetch.create({
  // 请求拦截器
  onRequest({ request, options }) {
const toast = useToast()
    // get方法传递数组形式参数
    // options.params = paramsSerializer(options.params)
    if (options.method === 'GET' && options.params) {
      options.query = { ...options.params?.params }
    }

    // 添加baseURL,nuxt3环境变量要从useRuntimeConfig里面取
    // const { public: { apiBase } } = useRuntimeConfig()
    let url = 'https://vip.anjuke.com'
    options.baseURL = url
    // options.credentials = 'include'

    // 当请求地址包含 /api/auth/login 或 /api/sysUser/register 时不检查 sysToken
    const requestUrl = request as string
    const { select58Ck } = useStore()
  let acc58Token = select58Ck.value
    console.log(requestUrl, acc58Token);

    
    if (!acc58Token) {
      console.log('参数错位');
      
      toast.add({ title: '参数错误', description: '没有58', color: 'warning' })
      return
    }
  },
  // 响应拦截
  onResponse({ response }) {
    // if (response.headers.get('content-disposition') && response.status === 200)
    //   return response
    // // 在这里判断错误
    // if (response._data.code !== 200) {
    //   handleError(response)
    //   return Promise.reject(response._data)
    // }
    // 成功返回
    return response._data
  },
  // 错误处理
  onResponseError({ response }) {
    handleError(response)
    return Promise.reject(response?._data ?? null)
  },
})

// 自动导出
export const useHttp = {
  get: <T>(url: string, params?: any) => {
    return fetch<T>(url, { method: 'get', params })
  },

  post: <T>(url: string, body?: any) => {
    return fetch<T>(url, { method: 'post', body })
  },

  put: <T>(url: string, body?: any) => {
    return fetch<T>(url, { method: 'put', body })
  },

  delete: <T>(url: string, body?: any) => {
    return fetch<T>(url, { method: 'delete', body })
  },
}
