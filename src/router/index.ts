import { createRouter, createWebHistory } from 'vue-router';
import HomeView from '../views/HomeView.vue';
import ProductDetailView from '../views/ProductDetailView.vue';
import { useAuth } from '../composables/useAuth';

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView
    },
    {
      path: '/product/:id',
      name: 'product-detail',
      component: ProductDetailView,
      meta: { requiresAuth: true }
    }
  ],
  scrollBehavior() {
    return { top: 0 };
  }
});

router.beforeEach((to, _from, next) => {
  const { isLoggedIn } = useAuth();
  
  if (to.meta.requiresAuth && !isLoggedIn.value) {
    // Ideally we could open the login modal here via an event bus or state,
    // but for simplicity, we redirect to home. The user can then click Login.
    // Optionally, we could have a dedicated login route.
    next('/');
  } else {
    next();
  }
});

export default router;
