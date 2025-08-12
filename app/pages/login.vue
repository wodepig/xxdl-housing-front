
<template>
    <UContainer>
    <UTabs v-model='active' variant="link" :content="true" :items="items" class="w-full" >
      <template #login="{item}">
              <p class="text-muted mb-4">
      </p>

      <UForm :state="state" class="flex flex-col gap-4">
        <UFormField label="手机号" name="phone">
          <UInput v-model="state.phone" class="w-full" />
        </UFormField>
        <UFormField label="密码" name="password">
          <UInput v-model="state.password" class="w-full" />
        </UFormField>

        <UButton loading-auto @click="signInWithPhone" label="登陆" type="submit" variant="soft" class="self-end" />
      </UForm>
      </template>
            <template #register="{item}">
       <UForm :state="state" :schema="schema" class="flex flex-col gap-4">
        <UFormField label="手机号" name="phone" required >
          <UInput v-model="state.phone"  required class="w-full" />
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

import * as z from 'zod'
const toast = useToast()
const active = ref('login')
const signInWithOtp = async () => {
  const { data, error } = await supabase.auth.signInWithOtp({
    email: email.value,
    options: {
      emailRedirectTo: 'http://localhost:3000',
    },
  })
  if (error) {
    toast.add({
      title: error.message,
      color: 'warning'
    })
  }
}
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
  phone: '',
  password: '',
  name: 'Benjamin Canac',
  username: 'benjamincanac',
  currentPassword: '',
  newPassword: '',
  confirmPassword: ''
})
const supabase = useSupabaseClient()
const email = ref('')

const signInWithPhone = async () => {
  const {data, error } = await supabase.auth.signInWithPassword({
    phone: state.phone,
    password: state.password
  })
  if(data.user){
    toast.add({title:'登录成功'})
    navigateTo('/')
  }
  if (error){
        toast.add({
      title: '登陆失败',
      description: error.message,
      color: 'warning'
    })
  } 
}
const handleSubmit = async ()=>{
  if(state.password !== state.confirmPassword){
    toast.add({
      title: '两次密码不一致',
      color: 'warning'
    })
    return
  }
  let {data,error} = await supabase.auth.signUp({
    phone: state.phone,
    password: state.password,
    options:{
      data: {
        platform:'58'
      }
    }
  })
  if(error){
    toast.add({
      title: error.message,
      color: 'warning'
    })
    return
  }
  toast.add({title:'注册成功, 请登陆'})
  active.value = 'login'
  console.log(data,error);
}
</script>