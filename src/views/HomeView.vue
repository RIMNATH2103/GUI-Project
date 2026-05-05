<template>
  <div>
    <div class="mb-8">
      <h1 class="text-3xl font-extrabold text-gray-900 dark:text-white">Discover Products</h1>
      <p class="text-gray-500 dark:text-gray-400 mt-2">Find exactly what you're looking for from our collection.</p>
    </div>
    
    <ImageSearch 
      @search="handleImageSearch"
      @clear="handleImageClear"
    />
    
    <FilterBar 
      :categories="categories"
      v-model:searchQuery="searchQuery"
      v-model:selectedCategory="selectedCategory"
    />
    
    <ProductList 
      :products="products"
      :loading="loading"
      :error="error"
      @retry="loadProducts"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue';
import type { Product, Category } from '../types';
import { fetchProducts, fetchCategories, fetchProductsByCategory, searchProducts } from '../services/api';
import FilterBar from '../components/FilterBar.vue';
import ProductList from '../components/ProductList.vue';
import ImageSearch from '../components/ImageSearch.vue';

const products = ref<Product[]>([]);
const categories = ref<Category[]>([]);
const loading = ref(true);
const error = ref<string | null>(null);

const searchQuery = ref('');
const selectedCategory = ref('');
let searchTimeout: ReturnType<typeof setTimeout>;

const loadInitialData = async () => {
  try {
    categories.value = await fetchCategories();
  } catch (err) {
    console.error('Failed to load categories', err);
  }
  await loadProducts();
};

const handleImageSearch = (keyword: string) => {
  searchQuery.value = keyword;
  selectedCategory.value = '';
};

const handleImageClear = () => {
  searchQuery.value = '';
};

const loadProducts = async () => {
  loading.value = true;
  error.value = null;
  
  try {
    let data;
    if (searchQuery.value.trim()) {
      data = await searchProducts(searchQuery.value.trim());
    } else if (selectedCategory.value) {
      data = await fetchProductsByCategory(selectedCategory.value);
    } else {
      data = await fetchProducts();
    }
    products.value = data.products;
  } catch (err) {
    error.value = err instanceof Error ? err.message : 'An error occurred fetching products.';
  } finally {
    loading.value = false;
  }
};

// Reset search if category is selected
watch(selectedCategory, () => {
  searchQuery.value = '';
  loadProducts();
});

// Reset category and debounce API calls if search is typed
watch(searchQuery, (newVal) => {
  if (newVal) selectedCategory.value = '';
  
  clearTimeout(searchTimeout);
  searchTimeout = setTimeout(() => {
    loadProducts();
  }, 500); // Wait 500ms before triggering API request
});

onMounted(() => {
  loadInitialData();
});
</script>
