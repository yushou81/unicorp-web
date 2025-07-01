<template>
  <section class="relative py-16 md:py-24 overflow-hidden">
    <div class="container mx-auto flex flex-col md:flex-row items-center gap-10 px-4">
      <div class="flex-1 text-center md:text-left">
        <h1 class="text-4xl md:text-5xl font-extrabold text-gray-900 mb-4 leading-tight">
          {{ title }}
        </h1>
        <p class="text-lg md:text-xl text-gray-600 mb-8 max-w-xl">
          {{ description }}
        </p>
        <router-link :to="ctaLink">
          <button class="px-8 py-3 rounded-lg bg-blue-600 text-white font-bold text-lg shadow hover:bg-blue-700 transition">
            {{ ctaText }}
          </button>
        </router-link>
      </div>
      <div class="flex-1 flex justify-center">
        <img :src="imageUrl" :alt="imageAlt" class="w-80 md:w-[28rem] drop-shadow-xl" />
      </div>
    </div>
    
    <!-- 装饰元素 -->
    <div class="hidden md:block absolute -top-24 -right-24 w-96 h-96 bg-blue-200 rounded-full opacity-20 blur-3xl"></div>
    <div class="hidden md:block absolute -bottom-32 -left-32 w-96 h-96 bg-indigo-300 rounded-full opacity-20 blur-3xl"></div>
  </section>
</template>

<script setup lang="ts">
defineProps<{
  title: string;
  description: string;
  ctaText: string;
  ctaLink: string;
  imageUrl: string;
  imageAlt: string;
}>();
</script> 