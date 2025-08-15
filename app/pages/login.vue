
<template>
    <UContainer>
    <UTabs v-model='active' variant="link" :content="true" :items="items" class="w-full" >
      <template #login="{item}">
              <p class="text-muted mb-4">
      </p>

      <UForm :state="state" class="flex flex-col gap-4">
        <UFormField label="用户名" name="username">
          <UInput v-model="state.username" class="w-full" />
        </UFormField>
        <UFormField label="密码" name="password">
          <UInput v-model="state.password" class="w-full" />
        </UFormField>

        <UButton loading-auto @click="signInWithPhone" label="登陆" type="submit" variant="soft" class="self-end" />
      </UForm>
      </template>
            <template #register="{item}">
       <UForm :state="state" :schema="schema" class="flex flex-col gap-4">
        <UFormField label="用户名" name="username" required >
          <UInput v-model="state.username"  required class="w-full" />
        </UFormField>
        <UFormField label="密码" name="password" required >
          <UInput v-model="state.password"  required class="w-full" />
        </UFormField>
        <UFormField label="确认密码" name="confirmPassword" required >
          <UInput v-model="state.confirmPassword" required class="w-full" />
        </UFormField>

        <UButton loading-auto @click="handleSubmit" label="注册" type="submit" variant="soft" class="self-end" />
      </UForm>
      </template>
    </UTabs>
  </UContainer>
  <!-- <div>
    <button @click="signInWithOtp">
      Sign In with E-Mail
    </button>
    <input
      v-model="email"
      type="email"
    />
    
  </div> -->
</template>

<script setup lang="ts">
const { $trpc } = useNuxtApp()
const { loggedIn, user, session, fetch, clear, openInPopup } = useUserSession()
import * as z from 'zod'
const toast = useToast()
const active = ref('login')

import type { TabsItem } from '@nuxt/ui'
definePageMeta({
  layout: 'blank'
})
const schema = z.object({
  phone: z.string().min(1, '手机号不能为空').max(20, '手机号不能超过20个字符'),
  password: z.string().min(1, '密码不能为空').max(20, '密码不能超过20个字符'),
  confirmPassword: z.string().optional(),
})
const items = ref<TabsItem[]>([
  {
    label: '登录',
    value: 'login',
    icon: 'i-lucide-user',
    content: '登录',
    slot: 'login' as const
  },
  {
    label: '注册',
    value: 'register',
    icon: 'i-lucide-lock',
    content: '',
    slot: 'register' as const
  }
])
const state = reactive({
  username: '',
  password: '',
  currentPassword: '',
  newPassword: '',
  confirmPassword: ''
})

const email = ref('')

const signInWithPhone = async () => {

  await $trpc.sysUser.login.mutate({
    username: state.username,
    password: state.password
  })
    console.log('执行到这里了');
  
  await fetch();
    console.log('开始跳转');
   await  navigateTo('/redirect');

}
const handleSubmit = async ()=>{
  if(state.password !== state.confirmPassword){
    toast.add({
      title: '两次密码不一致',
      color: 'warning'
    })
    return
  }
  await $trpc.sysUser.register.mutate({
    username: state.username,
    password: state.password
  })
  toast.add({title:'注册成功, 请登陆'})
  active.value = 'login'
}
</script>