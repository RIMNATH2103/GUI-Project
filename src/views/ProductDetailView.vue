<template>
  <div>
    <div v-if="loading" class="flex justify-center items-center py-32">
      <div class="animate-spin rounded-full h-12 w-12 border-4 border-indigo-100 border-t-indigo-600"></div>
    </div>
    
    <div v-else-if="error" class="bg-red-50 text-red-600 p-8 rounded-xl text-center shadow-sm max-w-2xl mx-auto mt-10">
      <p class="font-medium text-lg">{{ error }}</p>
      <button @click="$router.push('/')" class="mt-6 px-6 py-2 bg-gray-900 text-white rounded-lg font-medium hover:bg-gray-800 transition">
        {{ t('back_to_home') }}
      </button>
    </div>
    
    <div v-else-if="product" class="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden transition-colors duration-300">
      <!-- Breadcrumb -->
      <div class="bg-gray-50 dark:bg-gray-800/50 px-6 py-4 border-b border-gray-100 dark:border-gray-700 flex items-center text-sm">
        <router-link to="/" class="text-indigo-600 font-medium hover:underline">{{ t('home') }}</router-link>
        <span class="mx-3 text-gray-400">/</span>
        <span class="text-gray-500 capitalize font-medium">{{ product.category }}</span>
        <span class="mx-3 text-gray-400">/</span>
        <span class="text-gray-900 dark:text-white font-medium truncate">{{ product.title }}</span>
      </div>

      <div class="flex flex-col md:flex-row">
        <!-- Image Gallery -->
        <div class="md:w-1/2 p-8 bg-white dark:bg-gray-800 flex flex-col items-center border-r border-gray-100 dark:border-gray-700">
          <img 
            :src="activeImage || product.thumbnail" 
            :alt="product.title" 
            class="w-full max-w-md h-auto object-contain rounded-xl p-4 mb-6 aspect-square bg-gray-50 dark:bg-gray-700"
          />
          <div class="flex gap-4 overflow-x-auto w-full pb-2 justify-center">
            <button 
              v-for="(img, idx) in product.images" 
              :key="idx"
              @click="activeImage = img"
              class="w-20 h-20 flex-shrink-0 rounded-xl overflow-hidden border-2 transition-all p-1 bg-gray-50 dark:bg-gray-700"
              :class="activeImage === img ? 'border-indigo-600 dark:border-indigo-400' : 'border-transparent hover:border-gray-300 dark:hover:border-gray-500'"
            >
              <img :src="img" class="w-full h-full object-contain rounded-lg" />
            </button>
          </div>
        </div>
        
        <!-- Product Information -->
        <div class="md:w-1/2 p-8 lg:p-12 bg-gray-50/30 dark:bg-gray-800/30">
          <div class="mb-6">
            <span class="text-indigo-600 font-bold tracking-wider uppercase text-sm mb-2 block">{{ product.brand || product.category }}</span>
            <h1 class="text-3xl lg:text-4xl font-extrabold text-gray-900 dark:text-white mb-3">{{ product.title }}</h1>
          </div>
          
          <div class="flex items-center mb-6">
            <div class="flex items-center bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 px-3 py-1.5 rounded-lg shadow-sm">
              <span class="text-yellow-400 text-lg mr-1">★</span>
              <span class="font-bold text-gray-900 dark:text-white">{{ product.rating }}</span>
            </div>
            <span class="text-green-600 dark:text-green-400 font-medium text-sm ml-4 bg-green-50 dark:bg-green-900/30 px-3 py-1.5 rounded-lg">
              {{ product.stock }} {{ t('in_stock') }}
            </span>
          </div>
          
          <p class="text-gray-600 dark:text-gray-300 text-lg leading-relaxed mb-8">{{ product.description }}</p>
          
          <div class="flex items-end mb-10 pb-10 border-b border-gray-200 dark:border-gray-700">
            <span class="text-4xl font-extrabold text-gray-900 dark:text-white">${{ product.price }}</span>
            <span v-if="product.discountPercentage > 0" class="ml-4 text-xl text-gray-400 line-through mb-1">
              ${{ Math.round(product.price / (1 - product.discountPercentage / 100)) }}
            </span>
            <span v-if="product.discountPercentage > 0" class="ml-3 text-sm font-bold text-red-600 dark:text-red-400 mb-2 bg-red-50 dark:bg-red-900/30 px-2 py-1 rounded-md">
              {{ product.discountPercentage }}% {{ t('off') }}
            </span>
          </div>
          
          <div class="flex gap-4">
            <button class="flex-1 bg-indigo-600 text-white py-4 rounded-xl font-bold text-lg hover:bg-indigo-700 hover:shadow-lg transition-all active:scale-95 flex justify-center items-center gap-2">
              {{ t('add_to_cart') }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import type { Product } from '../types';
import { fetchProductById } from '../services/api';
import { useLanguage } from '../composables/useLanguage';

const { t } = useLanguage();

const route = useRoute();
const product = ref<Product | null>(null);
const loading = ref(true);
const error = ref<string | null>(null);
const activeImage = ref<string>('');

onMounted(async () => {
  const id = route.params.id as string;
  try {
    loading.value = true;
    product.value = await fetchProductById(id);
    if (product.value.images && product.value.images.length > 0) {
      activeImage.value = product.value.images[0];
    }
  } catch (err) {
    error.value = err instanceof Error ? err.message : 'Failed to load product details';
  } finally {
    loading.value = false;
  }
});
</script>
