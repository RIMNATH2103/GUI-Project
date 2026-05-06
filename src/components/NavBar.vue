<template>
  <nav class="bg-white dark:bg-gray-800 shadow-md sticky top-0 z-50 transition-colors duration-300">
    <div class="container mx-auto px-4 py-4 flex justify-between items-center">
      <router-link to="/" class="text-2xl font-bold text-indigo-600 dark:text-indigo-400 tracking-tight transition-all duration-300">
        {{ t('title') }}
      </router-link>
      <div class="flex items-center space-x-6">
        <router-link to="/" class="text-gray-600 dark:text-gray-300 font-medium hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
          <span class="transition-all duration-300">{{ t('home') }}</span>
        </router-link>
        
        <!-- Language Switcher -->
        <div class="relative group">
          <button class="flex items-center space-x-1 text-gray-600 dark:text-gray-300 font-medium hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors py-2">
            <span>{{ availableLanguages.find(l => l.code === currentLanguage)?.flag }}</span>
            <span class="uppercase">{{ currentLanguage }}</span>
            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
            </svg>
          </button>
          
          <div class="absolute right-0 mt-0 w-32 bg-white dark:bg-gray-800 rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-50 overflow-hidden border border-gray-100 dark:border-gray-700">
            <button 
              v-for="lang in availableLanguages" 
              :key="lang.code"
              @click="setLanguage(lang.code)"
              class="w-full text-left px-4 py-2 text-sm hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center space-x-2 transition-colors"
              :class="currentLanguage === lang.code ? 'text-indigo-600 dark:text-indigo-400 font-bold bg-indigo-50 dark:bg-indigo-900/30' : 'text-gray-700 dark:text-gray-300'"
            >
              <span>{{ lang.flag }}</span>
              <span>{{ lang.name }}</span>
            </button>
          </div>
        </div>
        
        <!-- User Greeting -->
        <div v-if="isLoggedIn && user" class="text-gray-600 dark:text-gray-300 font-medium hidden md:block transition-all duration-300">
          {{ t('hi') }}, {{ user.firstName }}
        </div>

        <button 
          @click="toggleDarkMode" 
          class="p-2 rounded-full text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700 transition-colors"
          aria-label="Toggle Dark Mode"
        >
          <!-- Sun icon for dark mode -->
          <svg v-if="isDark" xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
          </svg>
          <!-- Moon icon for light mode -->
          <svg v-else xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
          </svg>
        </button>
        
        <!-- Auth Buttons -->
        <button v-if="isLoggedIn" @click="handleLogout" class="text-red-500 hover:text-red-600 dark:text-red-400 dark:hover:text-red-300 font-medium transition-colors">
          <span class="transition-all duration-300">{{ t('logout') }}</span>
        </button>
        <button v-else @click="isLoginModalOpen = true" class="text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 font-medium transition-colors">
          <span class="transition-all duration-300">{{ t('login') }}</span>
        </button>

        <button class="bg-indigo-600 text-white px-5 py-2 rounded-lg font-medium hover:bg-indigo-700 transition shadow-sm flex items-center space-x-1">
          <span class="transition-all duration-300">{{ t('cart') }}</span>
          <span>(0)</span>
        </button>
      </div>
    </div>
  </nav>

  <!-- Login Modal -->
  <LoginModal :is-open="isLoginModalOpen" @close="isLoginModalOpen = false" />
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useAuth } from '../composables/useAuth';
import { useLanguage } from '../composables/useLanguage';
import LoginModal from './LoginModal.vue';

const router = useRouter();
const { user, isLoggedIn, logout } = useAuth();
const { t, currentLanguage, availableLanguages, setLanguage } = useLanguage();
const isLoginModalOpen = ref(false);

const isDark = ref(false);

const toggleDarkMode = () => {
  isDark.value = !isDark.value;
  if (isDark.value) {
    document.documentElement.classList.add('dark');
    localStorage.setItem('theme', 'dark');
  } else {
    document.documentElement.classList.remove('dark');
    localStorage.setItem('theme', 'light');
  }
};

const handleLogout = () => {
  logout();
  // Redirect to home if on a protected route (or just to be safe)
  router.push('/');
};

onMounted(() => {
  // Check local storage or system preference
  if (localStorage.theme === 'dark' || (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
    isDark.value = true;
    document.documentElement.classList.add('dark');
  } else {
    isDark.value = false;
    document.documentElement.classList.remove('dark');
  }
});
</script>
