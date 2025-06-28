<template>
  <section class="relative flex-1 flex items-center justify-center py-16 md:py-24">
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
    <div class="absolute left-0 right-0 bottom-0 h-16 bg-gradient-to-t from-white/80 to-transparent pointer-events-none" />
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