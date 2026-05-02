import { ref, computed } from 'vue';
import type { User, LoginRequest } from '../types';
import { authService } from '../services/auth';

// Global state
const user = ref<User | null>(null);

// Initialize from localStorage
const storedUser = localStorage.getItem('user');
if (storedUser) {
  try {
    user.value = JSON.parse(storedUser);
  } catch (e) {
    console.error('Failed to parse user from local storage', e);
    localStorage.removeItem('user');
  }
}

export function useAuth() {
  const isLoggedIn = computed(() => user.value !== null);
  const loading = ref(false);
  const error = ref<string | null>(null);

  const login = async (credentials: LoginRequest) => {
    loading.value = true;
    error.value = null;
    try {
      const response = await authService.login(credentials);
      user.value = response;
      localStorage.setItem('user', JSON.stringify(response));
      // Optionally store token separately if needed
      // localStorage.setItem('token', response.token);
      return true;
    } catch (err: any) {
      error.value = err.message || 'Login failed. Please try again.';
      return false;
    } finally {
      loading.value = false;
    }
  };

  const logout = () => {
    user.value = null;
    localStorage.removeItem('user');
    // localStorage.removeItem('token');
  };

  return {
    user,
    isLoggedIn,
    loading,
    error,
    login,
    logout,
  };
}
