<template>
  <section class="container mx-auto px-4 py-12">
    <h2 class="text-2xl font-bold text-gray-900 mb-8 text-center">{{ title }}</h2>
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
      <div 
        v-for="feature in features" 
        :key="feature.title" 
        class="bg-white rounded-xl shadow hover:shadow-lg transition p-6 flex flex-col items-center text-center group cursor-pointer"
      >
        <div :class="`w-14 h-14 flex items-center justify-center rounded-full mb-4 text-white text-2xl ${feature.bg}`">
          <component :is="feature.icon" class="w-8 h-8" />
        </div>
        <h3 class="font-semibold text-lg mb-2">{{ feature.title }}</h3>
        <p class="text-gray-500 text-sm">{{ feature.desc }}</p>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { Component } from 'vue'

interface Feature {
  title: string;
  desc: string;
  icon: Component;
  bg: string;
}

defineProps<{
  title: string;
  features: Feature[];
}>();
</script> 