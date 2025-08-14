<template>
  <div class="flex flex-col flex-1 w-full">
    <div class="flex justify-between gpa-1.5">
      <div class="flex gap-1.5">
        <div class="flex justify-center gap-1.5">
          <UInput type="search" placeholder="请输入用户名" v-model="pagination.userName" />
          <UInput type="search" placeholder="请输入备注" v-model="pagination.remark" />
        </div>
        <div class="flex items-end">
          <UButton @click="refreshTable()">查询</UButton>
        </div>
      </div>
      <div class="flex gap-1.5">
        <UButton icon="i-lucide:plus" color="primary" variant="outline" @click="openFormModal()">新增</UButton>
        <DeleteModal :ids="selectedIds" @onSubmit="deleteRow" :count="selectedIds.length">
          <UButton label="删除" :disabled="selectedIds.length === 0" icon="i-lucide:trash-2" color="error"
            variant="outline">
            <template #trailing>
              <UKbd>{{ selectedIds.length }}</UKbd>
            </template>
          </UButton>
        </DeleteModal>
        <USelect v-model="selectValue" :items="selectItems"></USelect>
        <UDropdownMenu :items="items()" :content="{ align: 'end' }">
          <UButton label="列设置" color="neutral" variant="outline" trailing-icon="i-lucide-chevron-down" />
        </UDropdownMenu>
      </div>
    </div>
    <div class="space-y-2">
      <UTable ref="table" :getRowId="(row: Account58) => row.id" v-model:column-visibility="columnVisibility"
        :loading="tablePending" loading-color="primary" :columns="columns" :data="tablePending ? [] : tableData?.data">
      </UTable>
      <div class="flex gap-1.5 justify-end">
        <div class="flex items-center">
          共{{ tableData?.total || 0 }}条
        </div>
        <USelect @change="() => { refreshTable() }" v-model="pagination.pageSize" :items="pageSizeItems" />
        <UPagination @click="refreshTable" v-model:page="pagination.page" :items-per-page="pagination.pageSize"
          :total="tableData?.total" />
      </div>
    </div>
    <!-- 新增或修改 -->
    <FormModal ref="formModalRef" @onSubmit="refreshOnModal"></FormModal>
  </div>
</template>

<script lang="ts" setup>
import { upperFirst } from 'scule'
import FormModal from './components/form-modal.vue'
import DeleteModal from './components/delete-modal.vue'
import type { TableColumn } from '@nuxt/ui'
import type { Account58 } from '~~/shared/types/schema'
const toast = useToast()
const table = useTemplateRef('table')
const UButton = resolveComponent('UButton')
const UCheckbox = resolveComponent('UCheckbox')
const { $trpc } = useNuxtApp()
const { data: tableData, pending: tablePending, refresh: refreshTable } = useAsyncData(() => $trpc.account58.page.query(pagination.value))
const formModalRef = ref<InstanceType<typeof FormModal> | null>()
const selectValue = ref('all')
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
  const currentPageIds = table?.value?.tableApi.getRowModel().rows.map(row => row.original.id) || []
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
  page: 1,
  pageSize: 2,
  userName: '',
  remark: ''
})

const openFormModal = (pojo: Account58 | null = null) => {
  formModalRef.value?.openModal(pojo)
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
const columns: TableColumn<Account58>[] = [
  {
    id: 'select',
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
    header: '用户名',
    accessorKey: 'userName',
  },
  {
    header: '密码',
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
          onClick: () => {
            openFormModal(row.original)
          }
        },
        {
          default: () => '编辑'
        }
      )
    }

  }
]
</script>

<style></style>