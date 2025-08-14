<script setup lang="ts">
const { $trpc } = useNuxtApp()
import { nextTick } from 'vue'
import type { TimelineItem } from '@nuxt/ui'
import dayjs from 'dayjs'
const toast = useToast()
const loading = ref(true)
const items = ref<TimelineItem[]>([
  {
    date: dayjs().format('YYYY-MM-DD HH:mm:ss'),
    title: '选择账号',
    description: '左侧列表中选择账号',
    icon: 'i-lucide-rocket'
  }, {
    date: dayjs().format('YYYY-MM-DD HH:mm:ss'),
    title: '房源刷新',
    description: '点击"刷新全部"按钮, 刷新全部房源信息',
    icon: 'i-lucide:arrow-down-to-line'
  },

  {
    date: dayjs().format('YYYY-MM-DD HH:mm:ss'),
    title: '开始刷新',
    description: '程序会自动执行, 无需手动操作',
    icon: 'i-lucide:arrow-down-to-line'
  },
  {
    date: dayjs().format('YYYY-MM-DD HH:mm:ss'),
    title: '刷新完成',
    description: '刷新完成, 此处会显示刷新结果',
    icon: 'i-lucide:circle-check-big'
  }])
const active = ref(0)
const timelineRef = ref<HTMLElement | null>(null)

// 滚动到指定索引项的位置
const jump2index = async (index: number) => {
  await nextTick()
  if (timelineRef.value) {
    const height = timelineRef.value.scrollHeight / items.value.length
    const indexJump = Math.max(0, (index - 1))
    timelineRef.value.scrollTop = height * indexJump

  }
}
// 执行刷新操作
const refreshHandle = async () => {
  toast.add({
    title: '开始刷新...',
  })
  // loading.value = true
  for (let index = 0; index < items.value.length; index++) {
    await jump2index(index)
    const item = items.value[index]
    if (!item) continue
    item.icon = 'i-lucide:loader'
    await $trpc.anjuke.autoUpdate.query({
      cateId: item.cateId.toString(),
      houseId: item.unityInfoId.toString(),
    })
    await sleep(500)
    item.date = dayjs().format('YYYY-MM-DD HH:mm:ss')

    item.icon = 'i-lucide:check'

    active.value = active.value + 1
  }
}

// 获取所有的房源列表
const getAllHouseList = async () => {
  const res = await $trpc.anjuke.allHouseList.query()
  items.value = []
  active.value = 0
  res.forEach(item => {
    items.value.push({
      date: dayjs().format('YYYY-MM-DD HH:mm:ss'),
      title: item.title,
      value: item.unityInfoId,
      cateId: item.cateId,
      unityInfoId: item.unityInfoId,
      description: item.communityName,
      icon: 'i-lucide:chevron-right'
    })
  })
  toast.add({
    title: '获取房源成功: 共' + items.value.length + '条数据',
  })
}
// 刷新全部
const refreshAll = async () => {
  await getAllHouseList()
  await refreshHandle()
}
const addNes = async () => {
  // items.value?[0].icon = 'i-lucide:loader'
  // await sleep(200)
  // items.value[0].icon = 'i-lucide:arrow-down-to-line'
  items.value.push({
    date: dayjs().format('YYYY-MM-DD HH:mm:ss'),
    title: 'Development Sprint',
    description: 'Frontend and backend development. Implemented core features and integrated with APIs.',
    icon: 'i-lucide-code'
  })
  await nextTick()

  if (timelineRef.value) {
    timelineRef.value.scrollTop = timelineRef.value.scrollHeight
  }
  // active.value = items.value.length
}


onMounted(() => {
  //   items.value.push(
  // )
  // setInterval(() => {
  //   active.value = (active.value + 1) % items.value.length
  // }, 1000)
})

</script>

<template>
  <div class="flex flex-col gap-1.5 h-full p-2">
 <div class="flex gap-1.5   top-2 left-2 right-2 z-50 bg-background p-2 rounded-lg shadow-sm">
      <!-- <UButton @click="addNes">添加</UButton> -->
      <UTooltip text="刷新全部房源信息">
        <UButton loading-auto @click="refreshAll" :delay-duration="0">刷新全部</UButton>
        <!-- <UButton @click="getAllHouseList" :delay-duration="0">获取全部房源</UButton> -->
        <!-- <UButton @click="refreshHandle" :delay-duration="0">执行刷新</UButton> -->
      </UTooltip>
      <UTooltip text="刷新已上架的房源信息">
        <UButton>刷新已上架(未开发)</UButton>
      </UTooltip>
    </div>

    <div ref="timelineRef" style="overflow: auto; min-height: 0; flex-grow: 1;">
      <UTimeline :loading="loading" :default-value="active" :items="items" class="w-96">
      </UTimeline>
    </div>
  </div>

</template>
