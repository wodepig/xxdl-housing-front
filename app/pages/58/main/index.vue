<template>
  <div class="relative  h-full  w-full">
    <UDashboardGroup class=" absolute " storage-key="main-dashboard">
      <!-- 左侧账号列表 -->
      <UDashboardPanel :min-size="5" :default-size="15" :max-size="40" :ui="{ root: 'min-h-0  overflow-auto' }" resizable>
        <SimpleList />
      </UDashboardPanel>
      <!-- 内容区 -->
      <UDashboardPanel id="inbox-2" :ui="{ root: 'min-h-0' }">
        <UTabs :items="tabItems" class="flex h-full" :ui="{content:'flex-1 overflow-auto'}">
          <template #refresh="{ item }">
            <div class="h-[500px]">

              <RefreshHouse/>
            </div>
          </template>
          <template #house="{ item }">
            <!-- <div class="flex-1"> -->

              <HouseList />
            <!-- </div> -->
          </template>
        </UTabs>

      </UDashboardPanel>
    </UDashboardGroup>
  </div>

</template>

<script setup lang="ts">
import type { TabsItem } from '@nuxt/ui'
import SimpleList from '../account/simple-list.vue';
import { default as HouseList }   from '../house/index.vue'
import { default as RefreshHouse } from '../house/refresh.vue'
const tabItems = ref<TabsItem[]>([
  {
    label: '自动刷新',
    icon: 'i-lucide:refresh-ccw',
    slot: 'refresh' as const
  },
  {
    label: '房源列表',
    icon: 'i-lucide:list-ordered',
    slot: 'house' as const
  },
  {
    label: 'todo',
    icon: 'i-lucide:clipboard-list',
    slot: 'todo' as const
  },
])




</script>
