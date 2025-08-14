<template>
  <UContainer>
    
  </UContainer>
</template>

<script lang="ts" setup>
definePageMeta({
  layout: 'blank'
})
import { ref } from 'vue'

const phone = ref('')
const password = ref('')
const code = ref('')
const isGettingCode = ref(false)
const countdown = ref(60)

const getCode = () => {
  // 触发获取验证码方法
  isGettingCode.value = true
  const timer = setInterval(() => {
    if (countdown.value > 0) {
      countdown.value--
    } else {
      clearInterval(timer)
      isGettingCode.value = false
      countdown.value = 60
    }
  }, 1000)
}

const handleSubmit = () => {
  // 处理注册逻辑
  console.log('注册信息:', {
    phone: phone.value,
    password: password.value,
    code: code.value
  })
}
</script>

<style scoped>
/* 可以在这里添加自定义样式 */
</style>