<template>
  <div class="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm mb-8 transition-colors duration-300 border border-indigo-100 dark:border-indigo-900/30 relative overflow-hidden">
    
    <!-- Header -->
    <div class="flex items-center space-x-3 mb-4">
      <div class="bg-indigo-100 dark:bg-indigo-900/50 p-2 rounded-lg text-indigo-600 dark:text-indigo-400">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      </div>
      <div>
        <h2 class="text-lg font-bold text-gray-900 dark:text-white">{{ t('visual_search') }}</h2>
        <p class="text-sm text-gray-500 dark:text-gray-400">{{ t('upload_image_find') }}</p>
      </div>
    </div>

    <!-- Upload Area / Preview -->
    <div class="mt-4">
      <!-- Error Message -->
      <div v-if="error" class="mb-4 p-3 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-lg text-sm flex items-center">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
          <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clip-rule="evenodd" />
        </svg>
        {{ error }}
      </div>

      <!-- Before Upload: Dropzone -->
      <label v-if="!selectedImage" class="flex justify-center w-full h-32 px-4 transition bg-white dark:bg-gray-800 border-2 border-gray-300 dark:border-gray-600 border-dashed rounded-xl appearance-none cursor-pointer hover:border-indigo-400 dark:hover:border-indigo-500 focus:outline-none">
        <span class="flex items-center space-x-2">
          <svg xmlns="http://www.w3.org/2000/svg" class="w-6 h-6 text-gray-600 dark:text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
          </svg>
          <span class="font-medium text-gray-600 dark:text-gray-400">
            {{ t('drop_image') }}<span class="text-indigo-600 dark:text-indigo-400 underline">{{ t('browse') }}</span>
          </span>
        </span>
        <input type="file" accept="image/*" class="hidden" @change="handleFileUpload">
      </label>

      <!-- After Upload: Preview & Actions -->
      <div v-else class="relative flex flex-col md:flex-row items-center gap-6 p-4 border border-gray-200 dark:border-gray-700 rounded-xl bg-gray-50 dark:bg-gray-800/50">
        
        <!-- Image Preview -->
        <div class="relative w-32 h-32 flex-shrink-0 rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700 shadow-sm bg-white dark:bg-gray-900">
          <img :src="selectedImage" alt="Preview" class="w-full h-full object-cover" />
          
          <!-- Processing Overlay -->
          <div v-if="isProcessing" class="absolute inset-0 bg-gray-900/50 backdrop-blur-sm flex items-center justify-center">
            <div class="animate-spin rounded-full h-8 w-8 border-2 border-white border-t-indigo-500"></div>
          </div>
        </div>

        <!-- Info & Actions -->
        <div class="flex-1 text-center md:text-left">
          <h3 class="text-md font-semibold text-gray-800 dark:text-gray-200 mb-1">
            {{ isProcessing ? t('analyzing_image') : t('image_ready') }}
          </h3>
          <p class="text-sm text-gray-500 dark:text-gray-400 mb-4">
            {{ isProcessing ? t('extracting_keywords') : t('use_image_find') }}
          </p>
          
          <div class="flex flex-wrap justify-center md:justify-start gap-3">
            <button 
              @click="reset" 
              :disabled="isProcessing"
              class="px-4 py-2 text-sm font-medium text-gray-600 dark:text-gray-300 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-600 disabled:opacity-50 transition-colors"
            >
              {{ t('clear_image') }}
            </button>
            <label 
              class="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 cursor-pointer transition-colors"
              :class="{ 'opacity-50 cursor-not-allowed': isProcessing }"
            >
              {{ t('upload_another') }}
              <input type="file" accept="image/*" class="hidden" @change="handleFileUpload" :disabled="isProcessing">
            </label>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useImageSearch } from '../composables/useImageSearch';
import { useLanguage } from '../composables/useLanguage';

const { t } = useLanguage();

const emit = defineEmits<{
  (e: 'search', keyword: string): void;
  (e: 'clear'): void;
}>();

const { selectedImage, isProcessing, error, processImage, clearImage } = useImageSearch();

const handleFileUpload = async (event: Event) => {
  const target = event.target as HTMLInputElement;
  const file = target.files?.[0];
  
  if (!file) return;

  try {
    const keyword = await processImage(file);
    if (keyword) {
      emit('search', keyword);
    }
  } catch (err) {
    console.error('Image processing failed', err);
  } finally {
    // Reset the input so the same file can be selected again if needed
    target.value = '';
  }
};

const reset = () => {
  clearImage();
  emit('clear');
};
</script>
