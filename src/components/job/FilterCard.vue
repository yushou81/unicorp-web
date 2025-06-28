<template>
  <Card class="overflow-hidden">
    <CardHeader class="bg-gray-50 border-b px-4 py-3">
      <CardTitle class="text-lg font-bold">{{ title }}</CardTitle>
    </CardHeader>
    <CardContent class="p-4">
      <slot></slot>
    </CardContent>
  </Card>
</template>

<script setup lang="ts">
import Card from '@/components/ui/Card.vue'
import CardHeader from '@/components/ui/CardHeader.vue'
import CardTitle from '@/components/ui/CardTitle.vue'
import CardContent from '@/components/ui/CardContent.vue'

defineProps({
  title: {
    type: String,
    required: true
  }
})
</script> 