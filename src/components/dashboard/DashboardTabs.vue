<template>
  <div class="flex border-b bg-transparent overflow-x-auto">
    <button
      v-for="tab in tabs"
      :key="tab.value"
      :class="[
        'relative px-6 py-3 whitespace-nowrap font-semibold transition-all duration-150 outline-none bg-transparent',
        activeTab === tab.value
          ? 'text-blue-600 after:absolute after:left-0 after:right-0 after:bottom-0 after:h-1 after:bg-blue-600 after:rounded-t-lg after:content-[\'\'] after:block'
          : 'text-gray-500 hover:text-blue-600 after:absolute after:left-1/2 after:-translate-x-1/2 after:bottom-0 after:h-1 after:w-8 after:bg-blue-100 after:rounded-t-lg after:content-[\'\'] after:opacity-0 hover:after:opacity-100'
      ]"
      @click="() => handleTabClick(tab.value)"
      style="background: none; border: none;"
    >
      {{ tab.label }}
    </button>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  tabs: { label: string, value: string }[],
  activeTab: string
}>()
const emit = defineEmits<{
  (e: 'change', value: string): void
}>()
function handleTabClick(tabValue: string) {
  // 输出调试信息
  console.log('[DashboardTabs] tab clicked:', tabValue)
  console.log('[DashboardTabs] typeof activeTab:', typeof props.activeTab, 'activeTab:', props.activeTab)
  emit('change', tabValue)
}
</script> 