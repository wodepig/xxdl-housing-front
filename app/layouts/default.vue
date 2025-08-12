<template>
  <div>
    <UBanner id="example1" title="欢迎使用" close />
   <UDashboardGroup unit="rem">
    
  <UDashboardSidebar :open="true" collapsible resizable :ui="{ footer: 'border-t border-default' }">
    <template #header="{ collapsed }">
      <!-- <TeamsMenu :collapsed="collapsed"></TeamsMenu> -->
      58工具
      <!-- <LogoPro :collapsed="collapsed" class="h-5 w-auto shrink-0" /> -->
    </template>

    <template #default="{ collapsed }">
      <UButton
        :label="collapsed ? undefined : 'Search...'"
        icon="i-lucide-search"
        color="neutral"
        variant="outline"
        block
        :square="collapsed"
      >
        <template v-if="!collapsed" #trailing>
          <!-- <div class="flex items-center gap-0.5 ms-auto">
            <UKbd value="meta" variant="subtle" />
            <UKbd value="K" variant="subtle" />
          </div> -->
        </template>
      </UButton>

      <UNavigationMenu
        :default-value="menuName"
        :collapsed="collapsed"
        :items="items[0]"
        orientation="vertical"
      />

      <UNavigationMenu
        :collapsed="collapsed"
        :items="items[1]"
        orientation="vertical"
        class="mt-auto"
      />
    </template>

    <template #footer="{ collapsed }">
      <UButton
      @click="signOut"
        :label="collapsed ? '退出' : '退出'"
        color="neutral"
        variant="ghost"
        class="w-full"
        :block="collapsed"
      />
    </template>
  </UDashboardSidebar>
  <UDashboardPanel>
    <template #header>
      <!-- <div></div> -->
      <UDashboardNavbar :ui="{ right: 'gap-3' }" title="房屋管理" icon="i-lucide-house">
        <template #leading>
          <UDashboardSidebarCollapse/>
          <!-- <UButton @click="openSideBar">打开</UButton> -->
        </template>
        <template #right>
<CheckUpdate/>
          <UTooltip arrow :delay-duration="1" text="新消息">
            <UChip text="1" color="error">
              <UButton color="neutral" variant="ghost" icon="i-foundation-megaphone" ></UButton>
            </UChip>
              
          </UTooltip>
        </template>
      </UDashboardNavbar>
      <!-- <UDashboardToolbar /> -->
    </template>
    <template #body>
      <slot />
     </template>
  </UDashboardPanel>
  
  </UDashboardGroup>
  </div>
</template>

<script lang="ts" setup>
import CheckUpdate from '~/components/CheckUpdate.vue'
import type { NavigationMenuItem } from '@nuxt/ui'
const route = useRoute()
const layoutSidebarOpen = ref(false)
const toast = useToast()
let menuName = ref('主页')
const open = ref(false)
const supabase = useSupabaseClient()
const signOut =async ()=>{
  const {error} = await supabase.auth.signOut({})
  toast.add({title:'退出成功'})
  navigateTo('/login')
}
const openSideBar  = ()=>{
  console.log('触发了');
  
  layoutSidebarOpen.value = !layoutSidebarOpen.value
  console.log(layoutSidebarOpen.value);
  
}
const items: NavigationMenuItem[][] = [[{
  label: '房源刷新',
  icon: 'i-lucide:refresh-cw',
  to: '/58/main'
},]]
const itemsOld: NavigationMenuItem[][] = [[{
  label: '主页',
  icon: 'i-lucide-house',
  to: '/58/account/simple-list'
},
{
  label: '房源刷新',
  icon: 'i-lucide:refresh-cw',
  to: '/58/main'
},{
  label: '账号管理',
  icon: 'i-lucide-users',
  to: '/58/account/list'
}
, {
  label: '房源管理',
  icon: 'i-lucide-list',
  badge: '0',
  to: '/58/house'
}, {
  label: '更新记录',
  icon: 'i-lucide-refresh-ccw-dot'
},{
  label: '个人信息',
  badge: '4',
  icon: 'i-lucide:user',
  to: '/userinfo'
},
 {
  label: 'Settings',
  icon: 'i-lucide-settings',
  defaultOpen: true,
  children: [{
    label: 'General'
  }, {
    label: 'Members'
  }, {
    label: 'Notifications'
  }]
}], [{
  label: 'Feedback',
  icon: 'i-lucide-message-circle',
  to: 'https://github.com/nuxt-ui-pro/dashboard',
  target: '_blank'
}, {
  label: 'Help & Support',
  icon: 'i-lucide-info',
  to: 'https://github.com/nuxt/ui-pro',
  target: '_blank'
}]]
const cards = ref([
  {
    title: 'Icons',
    description: 'Nuxt UI integrates with Nuxt Icon to access over 200,000+ icons from Iconify.',
    icon: 'i-lucide-smile',
    to: '/getting-started/icons'
  },
  {
    title: 'Fonts',
    description: 'Nuxt UI integrates with Nuxt Fonts to provide plug-and-play font optimization.',
    icon: 'i-lucide-a-large-small',
    to: '/getting-started/fonts'
  },
  {
    title: 'Color Mode',
    description: 'Nuxt UI integrates with Nuxt Color Mode to switch between light and dark.',
    icon: 'i-lucide-sun-moon',
    to: '/getting-started/color-mode',
    class: 'text-red-500'
  }
])
</script>

<style>
/* 自定义 CSS 类，设置图标大小为 20x20 */

/* 假设 Nuxt UI Pro 中图标有特定的类名，这里可能需要根据实际情况调整 */
.UNavigationMenu .i-lucide {
  width: 20px;
  height: 20px;
}
</style>