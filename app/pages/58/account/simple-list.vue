<template>
  <div class="absolute h-full flex flex-col">
    <!-- 搜索 -->
    <div class="flex justify-start gap-1.5">
      <div class="flex items-center gap-0.5">
        <UInput class="w-[150px]" type="search" placeholder="请输入用户名" v-model="pagination.userName" />
        <!-- <UInput type="search" placeholder="请输入备注" v-model="pagination.remark" /> -->
        <UButton @click="refresh()" loading-auto>查询</UButton>
        <UButton @click="test()" loading-auto>测试</UButton>

        <UButton  icon="i-lucide:plus" color="primary" variant="outline" @click="openFormModal()">新增</UButton>
      </div>

    </div>
    <!-- 展示 -->
    <div class="flex-1 overflow-auto">


      <div v-for="item in data?.data"
        :class="useStore().selectAgentUserName.value === item.phone ? 'shadow-[inset_0_0_0_2px_rgba(34,197,94,1)]' : ''"
        class="flex py-4 group relative hover:shadow-[inset_0_0_0_2px_rgba(34,197,94,1)]">
        <UUser class="" :key="item.id" :name="item.userName || ''" :description="item.remark || ''" size="xl" :avatar="{
          src: item.avatarUrl || '',
          icon: 'i-lucide-image'
        }" />
        <div class="absolute right-5 group-hover:opacity-0" v-if="useStore().selectAgentUserName.value === item.phone">
          <UButton icon="i-lucide:square-check-big" color="primary" size="sm"></UButton>
        </div>

        <div
          class="absolute right-0 flex gap-0.5 items-center pl-2 opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 ease-in-out">
          <!-- <div class="hidden hover:block"> -->

          <UButton color="primary" variant="outline" size="sm" @click="handleSelect(item.phone || '', item.id)">选中</UButton>
          <UButton color="info" variant="outline" size="sm" @click="openFormModal(item)">编辑</UButton>
          <DeleteModal :id="item.id" @onSubmit="deleteRow(item.id)" :count="1">
            <UButton label="删除" color="error" variant="outline">
            </UButton>
          </DeleteModal>

          <!-- <UButton color="error" variant="outline" size="sm">删除</UButton> -->
          <!-- </div> -->

        </div>
      </div>
    </div>
    <div class="">
      <!-- 分页 -->
      <UPagination @click="refresh" v-model:page="pagination.page" :items-per-page="pagination.pageSize"
        :total="data?.total" size="sm" />
    </div>
  </div>
  <!-- 新增或修改 -->
  <FormModal ref="formModalRef" @onSubmit="refreshOnModal"></FormModal>
</template>

<script lang="ts" setup>
const supabase = useSupabaseClient()
const toast = useToast()
import FormModal from './components/form-modal.vue'
import DeleteModal from './components/delete-modal.vue'
const { $trpc } = useNuxtApp()
const formModalRef = ref<InstanceType<typeof FormModal> | null>()
const { data, pending, refresh } = useAsyncData(() => $trpc.account58.page.query(pagination.value))
const pagination = ref({
  page: 1,
  pageSize: 10,
  userName: '',
  remark: ''
})

const test = ()=>{
console.log('process.env.TRPC_SERVER_URL ',process.env.TRPC_SERVER_URL );
console.log('process.env.TRPC_SERVER_URL ',useRuntimeConfig().public.TRPC_SERVER_URL );
console.log('process.env.DB_PASSWORD! ',process.env.DB_PASSWORD! );
}
const openFormModal = (pojo: Account58 | null = null) => {
  if(data?.value?.total === 2){
    toast.add({ title: '超过限制, 请先删除账号', color: 'warning' })
    return
  }
  formModalRef.value?.openModal(pojo)
}
const handleSelect = (phone: string, id: string) => {
  if (!phone) {
    toast.add({ title: '请选择一个手机号', color: 'warning' })
    return
  }
  useStore().selectAgentUserName.value = phone
  useStore().selectAgentId.value = id
  toast.add({ title: '选中成功' })
}
const deleteRow = (id: string) => {
  const ids = [id]
  $trpc.account58.delete.mutate(ids)
  toast.add({ title: '删除成功' })
  refreshOnModal()
}
const refreshOnModal = () => {
  refresh()
}

onMounted(() => {
  refresh()
})
</script>

<style></style>