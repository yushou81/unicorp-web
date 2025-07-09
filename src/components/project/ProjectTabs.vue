<template>
  <div class="bg-white rounded-lg shadow-sm mb-6 overflow-hidden">
    <div class="flex overflow-x-auto scrollbar-hide">
      <button
        v-for="tab in tabs"
        :key="tab"
        @click="$emit('change', tab)"
        :class="[
          'px-6 py-3 text-sm font-medium whitespace-nowrap',
          activeTab === tab 
            ? 'text-blue-600 border-b-2 border-blue-600'
            : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
        ]"
      >
        {{ tab }}
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps({
  tabs: {
    type: Array,
    required: true
  },
  activeTab: {
    type: String,
    required: true
  }
});

defineEmits(['change']);
</script>

<style scoped>
.scrollbar-hide {
  -ms-overflow-style: none;  /* IE and Edge */
  scrollbar-width: none;  /* Firefox */
}

.scrollbar-hide::-webkit-scrollbar {
  display: none;  /* Chrome, Safari and Opera */
}
</style> 