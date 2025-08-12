<template>

  <UModal v-on:after:enter="afterEnter" v-on:after:leave="afterLeave" :title="state?.id ? '编辑' : '新增'" :ui="{ footer: 'justify-end' }" v-model:open="open">
    <template #body>
        <UTabs :items="tabItems" class="flex h-full" :ui="{content:'flex-1 overflow-auto'}">
          <template #qr="{ item }">
            <!-- <div class="h-[500px]"> -->
              <div class="flex flex-col">
                  <div>
 <!-- <UInput v-model="qrCodeUrl">二维码</UInput> -->
<!-- <UInput v-model="qrCodeInfo.contentToken">contentToken</UInput>  -->
 <!-- <UInput v-model="qrCodeInfo.subject">subject</UInput>  -->
              <UButton @click="getQrCode">刷新二维码</UButton>
              <!-- <UButton @click="startKeepContent">登陆检查</UButton> -->
              <!-- <UButton @click="getJjrAuthTicket">getJjrAuthTicket</UButton> -->
                  </div>
                  <div>
                         <img :src="`/api/proxy-image?url=${encodeURIComponent(qrCodeInfo.url)}`" alt="二维码" class="w-[200px] h-[200px]">
      
                    <UProgress inverted v-model="qrCodeInfo.now" :max="qrCodeInfo.max" />
                <div class="flex justify-end">

                  <span >{{qrCodeInfo.now}}秒后刷新</span>
                </div>
                  </div>
              </div>
             
            <!-- </div> -->
          </template>
          <template #handle="{ item }">
   <UForm ref="form" :schema="schema" :state="state" @submit="onSubmit" class='space-y-6'>
        <UFormField label="用户名" name="userName" required>
          <UInput v-model="state.userName" />
        </UFormField>
        <UFormField label="密码" name="password" required>
          <UInput v-model="state.password" />
        </UFormField>        
        <UFormField label="备注" name="remark">
          <UInput v-model="state.remark" />
        </UFormField>
        <UFormField label="Cookie" name="cookie" required>
          <UTextarea v-model="state.cookie" placeholder="登陆后的cookie" />
        </UFormField>
      </UForm>
          </template>
        </UTabs>
      
    </template>
    <template #footer>
      <UButton label="关闭" color="neutral" variant="outline" @click="closeMoadl" />
      <UButton label="提交" color="primary" loading-auto type="submit" @click="form?.submit()" />
    </template>
  </UModal>
</template>

<script lang="ts" setup>
import type { FormSubmitEvent,TabsItem } from '@nuxt/ui'
import * as z from 'zod'
import type { Account58 } from '#shared/types/schema'
const { $trpc } = useNuxtApp()
const toast = useToast()
// 定义定时器ID的类型（setInterval返回的是NodeJS.Timeout类型）
let secondTimeId:any = null
let keepTimeId:any = null
let  keepLock = ref(false)
let minuteTimeId:any = null
const qrCodeInfo = ref({
  url: '',
  clientId: '',
  passportTraceRandom: '',
  contentToken: '',
  jjrAuthTicket: '',
  subject: '',
  max: 180,
  now: 180,
  
})
const form = useTemplateRef('form')
const emit = defineEmits(['onSubmit'])
const schema = z.object({
  id: z.string().optional(),
  remark: z.string().optional(),
  userName: z.string().min(1, '用户名不能为空').max(20, '用户名不能超过20个字符'),
  password: z.string().min(1, '密码不能为空').max(20, '密码不能超过20个字符'),
  cookie: z.string().min(1, 'Cookie不能为空').max(5000, 'Cookie不能超过5000个字符'),
})
type Schema = z.output<typeof schema>
const state = reactive<Partial<Schema>>({
  id: '',
  userName: '',
  remark: '',
  password: '',
  cookie: ''
})
const tabItems = ref<TabsItem[]>([
  {
    label: '扫码登陆',
    slot: 'qr' as const
  },
  {
    label: '手动登陆',
    slot: 'handle' as const
  }
])


const open = ref(false)

const getJjrAuthTicket = async ()=>{
  const res = await $trpc.anjuke.scanlogin.query(qrCodeInfo.value.contentToken)
  
}
// 检查登陆状态
const startKeepContent = async ()=>{
  if(!qrCodeInfo.value.clientId){
    toast.add({title: '请先获取二维码',color:'warning'})
    return
  }
    if(keepTimeId) {
    clearInterval(keepTimeId)
  }
  keepContent()
  keepTimeId = setInterval(() => {
    keepContent()
  }, 5000)
}
const keepContent = async()=>{
  if(keepLock.value){
    return
  }
  keepLock.value = true
  const res = await $trpc.anjuke.scanLoginNew.query({
    clientId: qrCodeInfo.value.clientId,
    passportTraceRandom: qrCodeInfo.value.passportTraceRandom
  })
keepLock.value = false

  if(res.status){
     toast.add({title: '登陆成功'})
  closeMoadl()
  emit('onSubmit')

}else{
 toast.add({title: res.msg})
 if(res.msg == '请确认登陆'){
  startKeepContent()
 }
}
}

/**
 * 获取登陆二维码
 */
const getQrCode = async () => {
  // 清楚keep的数据
  keepLock.value = false
    if(secondTimeId != null) {
    clearInterval(secondTimeId)
  }
  const qrCode = await $trpc.anjuke.getQrCode.query()
  qrCodeInfo.value.url = qrCode.imgUrl as string
  qrCodeInfo.value.clientId = qrCode.clientId as string
  qrCodeInfo.value.passportTraceRandom = qrCode.passportTraceRandom as string
  qrCodeInfo.value.now = 180
  // 定时刷新
  if(secondTimeId != null) {
    clearInterval(secondTimeId)
  }
  secondTimeId = setInterval(() => {
    qrCodeInfo.value.now = qrCodeInfo.value.now -1
  }, 1000)
}

const onSubmit = async (event: FormSubmitEvent<Schema>) => {
  if (state.id) {
    // 强制断言 id 存在（确保你确实检查过）
    const dataWithId = event.data as { id: string } & z.infer<typeof schema>;
    await $trpc.account58.update.mutate(dataWithId)
  }else{
  await $trpc.account58.add.mutate(event.data)
  }
  toast.add({title: '提交成功'})
  closeMoadl()
  emit('onSubmit')
}
const closeMoadl = () => {
  open.value = false
}
const openModal = async (pojo: Account58 | null) => {
  state.id = pojo?.id || ''
  state.userName = pojo?.userName || ''
  state.remark = pojo?.remark || ''
  state.password = pojo?.password || ''
  state.cookie = pojo?.cookie || ''
  open.value = true
  // 初始化
  await getQrCode()
   startKeepContent()
}
// 在关闭弹窗后
const afterLeave = () =>{
  
  clearTime()
}
// 弹窗打开后
const afterEnter =()=>{
  
 if(minuteTimeId != null) {
    clearInterval(minuteTimeId)
  }
  console.log('记得取消注释');
  
  //  getQrCode()
  // minuteTimeId = setInterval( () => {
  //    getQrCode()
  // }, 60000)
}
// 清除定时器
const clearTime = () =>{
  keepLock.value = false
  
      if(keepTimeId) {
        console.log('清除keepTimeId',keepTimeId);
    clearInterval(keepTimeId)
  }
    if(secondTimeId != null) {
      
    clearInterval(secondTimeId)
  }
    if(minuteTimeId != null) {
    clearInterval(minuteTimeId)
  }

}
defineExpose({
  openModal
})


</script>

<style>
</style>