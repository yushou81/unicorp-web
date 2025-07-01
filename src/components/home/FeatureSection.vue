<template>
  <section class="py-16 bg-gray-50">
    <div class="container mx-auto px-4">
      <div class="mb-12 text-center">
        <h2 class="text-3xl font-bold text-gray-900 mb-3">{{ title }}</h2>
        <div class="w-20 h-1.5 bg-blue-600 mx-auto rounded-full"></div>
      </div>
      
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div 
          v-for="feature in features" 
          :key="feature.title" 
          class="bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-300 p-6 flex flex-col items-center text-center group border border-gray-100 hover:border-blue-100 hover:-translate-y-1"
        >
          <div :class="`w-16 h-16 flex items-center justify-center rounded-full mb-5 text-white ${feature.bg}`">
            <component :is="feature.icon" class="w-8 h-8" />
          </div>
          <h3 class="font-bold text-xl mb-3 text-gray-800">{{ feature.title }}</h3>
          <p class="text-gray-600">{{ feature.desc }}</p>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
interface Feature {
  title: string;
  desc: string;
  icon: any; // 使用any类型表示组件
  bg: string;
}

defineProps<{
  title: string;
  features: Feature[];
}>();
</script> 