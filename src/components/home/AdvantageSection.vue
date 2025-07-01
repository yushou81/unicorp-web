<template>
  <section class="py-16 bg-white">
    <div class="container mx-auto px-4">
      <div class="mb-12 text-center">
        <h2 class="text-3xl font-bold text-gray-900 mb-3">{{ title }}</h2>
        <div class="w-20 h-1.5 bg-blue-600 mx-auto rounded-full"></div>
      </div>
      
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        <div 
          v-for="advantage in advantages" 
          :key="advantage.title" 
          class="p-6 rounded-xl flex flex-col items-center text-center group hover:-translate-y-1 transition-all duration-300"
        >
          <div class="w-16 h-16 flex items-center justify-center rounded-full bg-blue-100 mb-5 shadow-md shadow-blue-100">
            <component :is="advantage.icon" class="w-7 h-7 text-blue-600" />
          </div>
          <h4 class="font-bold text-xl mb-3 text-gray-800">{{ advantage.title }}</h4>
          <p class="text-gray-600">{{ advantage.desc }}</p>
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