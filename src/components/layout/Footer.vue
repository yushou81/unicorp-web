<template>
  <footer class="bg-white border-t py-6 mt-8 text-center text-gray-500 text-sm">
    {{ copyright }} | {{ contactInfo }}
  </footer>
</template>

<script setup lang="ts">
defineProps<{
  copyright: string;
  contactInfo: string;
}>();
</script> 