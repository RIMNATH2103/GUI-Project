<template>
  <div>
    <!-- Loading State -->
    <div v-if="loading" class="flex justify-center items-center py-24">
      <div class="animate-spin rounded-full h-12 w-12 border-4 border-indigo-100 border-t-indigo-600"></div>
    </div>
    
    <!-- Error State -->
    <div v-else-if="error" class="bg-red-50 text-red-600 p-8 rounded-xl text-center shadow-sm">
      <p class="font-medium text-lg">{{ error }}</p>
      <button @click="$emit('retry')" class="mt-4 px-6 py-2 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition">
        Try Again
      </button>
    </div>
    
    <!-- Empty State -->
    <div v-else-if="products.length === 0" class="text-center py-24 bg-white rounded-xl shadow-sm border border-gray-100">
      <p class="text-gray-500 text-lg font-medium">No products found matching your search criteria.</p>
    </div>
    
    <!-- Product Grid -->
    <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
      <ProductCard 
        v-for="product in products" 
        :key="product.id" 
        :product="product" 
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Product } from '../types';
import ProductCard from './ProductCard.vue';

defineProps<{
  products: Product[];
  loading: boolean;
  error: string | null;
}>();

defineEmits<{ (e: 'retry'): void }>();
</script>
