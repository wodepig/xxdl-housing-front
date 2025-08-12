<script setup lang="ts">
const props = withDefaults(defineProps<{
  count?: number,
  ids?: string[],
  id?: string,
}>(), {
  count: 0,
  id: '',
  ids: () => []
})
const emits = defineEmits(['onSubmit'])
const open = ref(false)
const  onSubmitHandle =()=> {
  emits('onSubmit')
  open.value = false
}
</script>

<template>
  <UModal
    v-model:open="open"
    :title="`删除 ${count} 条记录?`"
    :description="`确定删除 ${count} 条记录吗？ 此操作不可恢复`"
  >
    <slot />

    <template #body>
      <div class="flex justify-end gap-2">
        <UButton
          label="取消"
          color="neutral"
          variant="subtle"
          @click="open = false"
        />
        <UButton
          label="确认"
          color="error"
          variant="solid"
          loading-auto
          @click="onSubmitHandle"
        />
      </div>
    </template>
  </UModal>
</template>