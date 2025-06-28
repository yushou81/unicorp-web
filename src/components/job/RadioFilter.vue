<template>
  <div class="space-y-2">
    <label 
      v-for="option in options" 
      :key="option.value"
      class="flex items-center space-x-2 cursor-pointer hover:text-blue-600"
    >
      <input 
        type="radio" 
        :name="name" 
        class="text-blue-600" 
        :value="option.value" 
        :checked="modelValue === option.value"
        @change="$emit('update:modelValue', option.value)" 
      />
      <span>{{ option.label }}</span>
    </label>
  </div>
</template>

<script setup lang="ts">
interface RadioOption {
  value: string;
  label: string;
}

defineProps({
  name: {
    type: String,
    required: true
  },
  options: {
    type: Array as () => RadioOption[],
    required: true
  },
  modelValue: {
    type: String,
    default: ''
  }
})

defineEmits(['update:modelValue'])
</script> 