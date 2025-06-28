<template>
  <section class="bg-white py-12 border-t">
    <div class="container mx-auto px-4">
      <h2 class="text-2xl font-bold text-gray-900 mb-8 text-center">{{ title }}</h2>
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        <div v-for="advantage in advantages" :key="advantage.title" class="flex flex-col items-center text-center">
          <div class="w-12 h-12 flex items-center justify-center rounded-full bg-blue-100 mb-4">
            <component :is="advantage.icon" class="w-6 h-6 text-blue-600" />
          </div>
          <h4 class="font-semibold text-base mb-1">{{ advantage.title }}</h4>
          <p class="text-gray-500 text-sm">{{ advantage.desc }}</p>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
interface Advantage {
  title: string;
  desc: string;
  icon: any; // 使用any类型表示组件
}

defineProps<{
  title: string;
  advantages: Advantage[];
}>();
</script> 