<template>
  <nav class="bg-white shadow-md sticky top-0 z-50">
    <div class="container mx-auto px-4 py-4 flex justify-between items-center">
      <router-link to="/" class="text-2xl font-bold text-indigo-600 tracking-tight">
        ShopMini
      </router-link>
      <div class="flex items-center space-x-6">
        <router-link to="/" class="text-gray-600 font-medium hover:text-indigo-600 transition-colors">
          Home
        </router-link>
        <button class="bg-indigo-600 text-white px-5 py-2 rounded-lg font-medium hover:bg-indigo-700 transition shadow-sm">
          Cart (0)
        </button>
      </div>
    </div>
  </nav>
</template>
