<template>
  <div class="bg-white dark:bg-gray-800 rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden group flex flex-col h-full border border-gray-100 dark:border-gray-700">
    <div class="relative pt-[100%] overflow-hidden bg-gray-50 dark:bg-gray-800">
      <img 
        :src="product.thumbnail" 
        :alt="product.title" 
        class="absolute top-0 left-0 w-full h-full object-contain p-6 group-hover:scale-105 transition-transform duration-500"
      />
      <div v-if="product.discountPercentage > 0" class="absolute top-3 right-3 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-md">
        -{{ Math.round(product.discountPercentage) }}%
      </div>
    </div>
    
    <div class="p-5 flex flex-col flex-grow">
      <span class="text-xs text-indigo-500 dark:text-indigo-400 font-bold uppercase tracking-wider mb-2">{{ product.category }}</span>
      <h3 class="text-lg font-bold text-gray-900 dark:text-white mb-2 line-clamp-1" :title="product.title">{{ product.title }}</h3>
      <p class="text-gray-500 dark:text-gray-400 text-sm mb-4 line-clamp-2 flex-grow">{{ product.description }}</p>
      
      <div class="flex items-center justify-between mt-auto pt-4 border-t border-gray-100 dark:border-gray-700">
        <div class="flex flex-col">
          <span class="text-xl font-extrabold text-gray-900 dark:text-white">${{ product.price }}</span>
          <div class="flex items-center mt-1">
            <span class="text-yellow-400 text-sm">★</span>
            <span class="text-xs font-medium text-gray-600 dark:text-gray-400 ml-1">{{ product.rating }}</span>
          </div>
        </div>
        
        <router-link 
          :to="`/product/${product.id}`" 
          class="bg-gray-900 dark:bg-gray-700 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-indigo-600 dark:hover:bg-indigo-500 transition-colors"
        >
          Details
        </router-link>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Product } from '../types';

defineProps<{ product: Product }>();
</script>
