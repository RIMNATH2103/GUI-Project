<template>
  <div class="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-sm mb-8 flex flex-col md:flex-row gap-4 items-center justify-between transition-colors duration-300">
    <div class="w-full md:w-1/2">
      <input 
        type="text" 
        :value="searchQuery"
        @input="$emit('update:searchQuery', ($event.target as HTMLInputElement).value)"
        :placeholder="t('search_placeholder')" 
        class="w-full px-4 py-3 border border-gray-200 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition bg-transparent dark:text-white dark:placeholder-gray-400"
      />
    </div>
    
    <div class="w-full md:w-auto flex items-center space-x-3">
      <label class="text-gray-600 dark:text-gray-300 font-medium whitespace-nowrap">{{ t('category_label') }}</label>
      <select 
        :value="selectedCategory"
        @change="$emit('update:selectedCategory', ($event.target as HTMLSelectElement).value)"
        class="w-full md:w-48 px-4 py-3 border border-gray-200 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none bg-white dark:bg-gray-800 dark:text-white cursor-pointer transition-colors"
      >
        <option value="">{{ t('all_categories') }}</option>
        <option v-for="cat in categories" :key="cat.slug" :value="cat.slug">
          {{ cat.name }}
        </option>
      </select>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Category } from '../types';
import { useLanguage } from '../composables/useLanguage';

const { t } = useLanguage();

defineProps<{
  categories: Category[];
  searchQuery: string;
  selectedCategory: string;
}>();

defineEmits<{
  (e: 'update:searchQuery', value: string): void;
  (e: 'update:selectedCategory', value: string): void;
}>();
</script>
