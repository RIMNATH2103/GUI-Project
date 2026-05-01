<template>
  <div class="min-h-screen flex flex-col">
    <NavBar />
    <main class="flex-grow container mx-auto px-4 py-8">
      <router-view />
    </main>
    <footer class="bg-white shadow-inner py-6 mt-auto">
      <div class="container mx-auto text-center text-gray-500 text-sm">
        &copy; 2026 Mini Project E-Commerce. Built with Vue 3 & Tailwind.
      </div>
    </footer>
  </div>
</template>

<script setup lang="ts">
import NavBar from './components/NavBar.vue';
</script>
