<template>
  <div class="flex flex-col justify-start h-full  w-full">
    <!-- 搜索 -->
    <div class="flex justify-between  gpa-1.5">
      <div class="flex gap-1.5">
        <div class="flex justify-center gap-1.5">
          <UInput v-model="pagination.bt" placeholder="输入标题" />
        </div>
        <div class="flex items-end">
          <UButton @click="refreshTable()">查询</UButton>
          <!-- <UButton @click="communityListRefresh()">小区列表</UButton> -->
        </div>
      </div>
      <div class="flex gap-1.5">
        <USelect v-model="selectValue" :items="selectItems"></USelect>
        <UDropdownMenu :items="items()" :content="{ align: 'end' }">
          <UButton label="列设置" color="neutral" variant="outline" trailing-icon="i-lucide-chevron-down" />
        </UDropdownMenu>
      </div>
    </div>
    <!-- 表格 -->
    <!-- <div class="flex-1 overflow-auto space-y-2"> -->
      <UTable ref="table" sticky class="flex-1" 
      :getRowId="(row: HouseDataInfo) => row.unityInfoId + ''"
        v-model:column-visibility="columnVisibility" :loading="tablePending" loading-color="primary" :columns="columns"
        :data="tablePending ? [] : tableData?.infos">
        <template #title-cell="{ row }">
          <div class="flex items-center gap-2">
            <div class="flex w-[100px] bg-amber-100">
              <img :src="row.original.picUrl" class="w-full h-full object-cover">

            </div>
            <div class="flex flex-col">
              <UPopover mode="hover">
                <div class="flex text-base text-pretty text-highlighted">{{ row.original.title.substring(0, 10) }}...
                </div>
                <template #content>
                  <div class="felx gap-2 m-1 overflow-auto">


                    <div class="">
                      标题: {{ row.original.title }}
                    </div>
                    <div class="">
                      编号:{{ row.original.unityInfoId }}
                    </div>
                  </div>
                </template>
              </UPopover mode="hover" class="w-full">
              <div class="flex">
                {{ row.original.communityName }},{{ row.original.area }}平,{{ row.original.shi }}室{{ row.original.ting
                }}厅,{{
                  row.original.floor }}层,{{ row.original.price }}元/月
              </div>
              <div class="flex">

                <div class="text-green-600">已编辑
                  {{ row.original.leftTime }}天
                </div>

              </div>
            </div>
          </div>
        </template>
      </UTable>
    
    <!-- </div> -->
 <!-- 分页 -->
  <div class="gap-1.5 flex justify-end items-center">
        <div class="flex items-center">
          共{{ tableData?.recordCount || 0 }}条
        </div>
        <USelect @change="() => { refreshTable() }" v-model="pagination.pageSize" :items="pageSizeItems" />
        <UPagination @click="refreshTable" v-model:page="pagination.pageIndex" :items-per-page="pagination.pageSize"
          :total="tableData?.recordCount" />
      </div>
  </div>
</template>

<script lang="ts" setup>
import { upperFirst } from 'scule'

import type { TableColumn } from '@nuxt/ui'
import type { Account58 } from '~~/shared/types/schema'
import { useApi } from '~/composables/useApi'
const toast = useToast()
const table = useTemplateRef('table')
const UButton = resolveComponent('UButton')
const UCheckbox = resolveComponent('UCheckbox')
const { $trpc } = useNuxtApp()
const saveForm = ref({
  cateId: '11',
  houseId: '',
})
const { data: tableData, pending: tablePending, refresh: refreshTable } = useAsyncData(() => $trpc.anjuke.houseList.query(pagination.value))
const { data: communityData, pending: communityPending, refresh: communityListRefresh } = useAsyncData(() => $trpc.anjuke.communityList.query())
// const { data: url58, pending: savePending, refresh: saveRefresh } = useAsyncData(() => $trpc.anjuke.autoUpdate.query({
//   cateId: saveForm.value.cateId,
//   houseId: saveForm.value.houseId,
// }))
const { refresh: reCheck } = useAsyncData(() => $trpc.account58.check.query(testCk.value))
const selectValue = ref('all')
const testCk = ref('18354058751')
onMounted(() => {
  refreshTable()
})

// 1. 存储跨页选中的行 ID（核心：独立于表格的状态）
const selectedIds = ref<string[]>([]);

const pageSizeItems: number[] = [2, 5, 10, 15]


// 7. 处理全选框切换（头部复选框）
const handleSelectAll = (checked: boolean) => {
  // 拿到所有的id
  table?.value?.tableApi.toggleAllPageRowsSelected(checked)
  // 当前页的id
  const currentPageIds = table?.value?.tableApi.getRowModel().rows.map(row => row.original.unityInfoId) || []
  if (checked) {
    // const currentPageIds = table?.value?.tableApi.getSelectedRowModel().rows.map(row => row.original.id)
    // 选中当前页所有行：添加当前页的所有ID
    // const currentPageIds = currentPageRows.value.map(row => row.id);
    const unPushIds = currentPageIds?.filter(id => !selectedIds.value.includes(id));
    selectedIds.value = [...selectedIds.value, ...unPushIds];
  } else {
    // 取消当前页所有行：移除当前页的所有ID
    // const currentPageIds = currentPageRows.value.map(row => row.id);
    selectedIds.value = selectedIds.value.filter(id => !currentPageIds.includes(id));
  }
};
// 处理行复选框切换
const handleRowSelect = (row: any, checked: boolean) => {
  row.toggleSelected(!!checked)
  const rowId = row.original.id
  if (checked) {
    // 选中：添加 ID（去重）
    if (!selectedIds.value.includes(rowId)) {
      selectedIds.value = [...selectedIds.value, rowId];
    }
  } else {
    // 取消选中：移除 ID
    selectedIds.value = selectedIds.value.filter(id => id !== rowId);
  }
};
const selectItems = ref([
  {
    label: '全部',
    value: 'all'
  }
])
const pagination = ref({
  pageIndex: 1,
  pageSize: 10,
  bt: '',
  userName: '',
  remark: ''
})

const refreshHandle = async (pojo: HouseDataInfo | null = null) => {
  if (!pojo) {
    return
  }
  if (pojo.unityInfoId) {
    saveForm.value.houseId = pojo.unityInfoId.toString()
  }
  pojo.loading = true
  await $trpc.anjuke.autoUpdate.query({
    cateId: pojo.cateId.toString(),
    houseId: pojo.unityInfoId.toString(),
  })
  useToast().add({ title: '刷新成功' })
  pojo.loading = false
}

const columnVisibility = ref({
  id: false
})


const items = () => {
  return table?.value?.tableApi?.getAllColumns()
    .filter((column) => column.getCanHide())
    .filter((column) => column.columnDef.id !== 'select')
    .map((column) => ({
      label: column.columnDef.header as string,
      type: 'checkbox' as const,
      checked: column.getIsVisible(),
      onUpdateChecked(checked: boolean) {
        table?.value?.tableApi?.getColumn(column.id)?.toggleVisibility(!!checked)
      },
      onSelect(e?: Event) {
        e?.preventDefault()
      }
    }))
}
const deleteRow = () => {
  const ids = selectedIds.value
  $trpc.account58.delete.mutate(ids)
  selectedIds.value = selectedIds.value.filter(id => !ids.includes(id));
  toast.add({ title: '删除成功' })
  refreshOnModal()
}
const refreshOnModal = () => {
  refreshTable()
}
const columns: TableColumn<HouseDataInfo>[] = [
  {
    id: 'select',
    size: 50,
    header: ({ table }) =>
      h(UCheckbox, {
        // 头部复选框状态：全选/部分选中/未选中
        modelValue: table.getIsSomePageRowsSelected()
          ? 'indeterminate'
          : table.getIsAllPageRowsSelected(),
        'onUpdate:modelValue': (value: boolean | 'indeterminate') => {
          // 点击时：如果是 indeterminate，视为选中当前页所有行
          handleSelectAll(value !== false);
        },
        'aria-label': '全选'
      }),
    cell: ({ row }) =>
      h(UCheckbox, {
        // 行复选框状态：基于 selectedIds 判断（跨页记住）
        modelValue: row.getIsSelected(),
        'onUpdate:modelValue': (value: boolean | 'indeterminate') => {
          handleRowSelect(row, value === true);
        },
        'aria-label': `选择行`
      })
  },
  {
    header: '标题',
    accessorKey: 'title',
    meta: {
      class: {
        td: 'whitespace-normal w-[400px]',
      }
    }
  },
  {
    header: '其他',
    accessorKey: 'password',
    cell: ({ row }) => {
      return row.getValue('password')
    }
  },
  {
    header: '备注',
    accessorKey: 'remark',
  },
  {
    id: 'acions',
    header: '操作',
    cell: ({ row }) => {

      return h(
        UButton,
        {
          color: 'primary',
          variant: 'outline',
          loading: row.original.loading,
          onClick: async () => {
            await refreshHandle(row.original)
          }
        },
        {
          default: () => '刷新'
        }
      )
    }

  }
]
</script>

<style></style>