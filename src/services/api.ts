import type { ProductsResponse, Product, Category } from '../types';

const API_BASE_URL = 'https://dummyjson.com';

export const fetchProducts = async (): Promise<ProductsResponse> => {
  const response = await fetch(`${API_BASE_URL}/products`);
  if (!response.ok) throw new Error('Failed to fetch products');
  return response.json();
};

export const fetchProductById = async (id: string | number): Promise<Product> => {
  const response = await fetch(`${API_BASE_URL}/products/${id}`);
  if (!response.ok) throw new Error('Failed to fetch product details');
  return response.json();
};

export const fetchCategories = async (): Promise<Category[]> => {
  const response = await fetch(`${API_BASE_URL}/products/categories`);
  if (!response.ok) throw new Error('Failed to fetch categories');
  return response.json();
};

export const fetchProductsByCategory = async (category: string): Promise<ProductsResponse> => {
  const response = await fetch(`${API_BASE_URL}/products/category/${category}`);
  if (!response.ok) throw new Error(`Failed to fetch category ${category}`);
  return response.json();
};

export const searchProducts = async (query: string): Promise<ProductsResponse> => {
  const response = await fetch(`${API_BASE_URL}/products/search?q=${query}`);
  if (!response.ok) throw new Error('Failed to search products');
  return response.json();
};
