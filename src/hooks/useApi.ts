import useSWR from 'swr';

const fetcher = async (url: string) => {
  const res = await fetch(url);
  if (!res.ok) throw new Error('Failed to fetch');
  return res.json();
};

// Global SWR config for caching
export const swrConfig = {
  revalidateOnFocus: false,
  revalidateOnReconnect: false,
  dedupingInterval: 60000, // 1 minute
  errorRetryCount: 2,
};

export function useSettings() {
  const { data, error, isLoading } = useSWR('/api/settings', fetcher, swrConfig);
  return { settings: data, isLoading, error };
}

export function useProducts() {
  const { data, error, isLoading, mutate } = useSWR('/api/products', fetcher, swrConfig);
  return { products: data || [], isLoading, error, mutate };
}

export function useServices() {
  const { data, error, isLoading, mutate } = useSWR('/api/services', fetcher, swrConfig);
  return { services: data || [], isLoading, error, mutate };
}

export function usePrintingItems() {
  const { data, error, isLoading, mutate } = useSWR('/api/printing-items', fetcher, swrConfig);
  return { printingItems: data || [], isLoading, error, mutate };
}

export function useBlogPosts() {
  const { data, error, isLoading, mutate } = useSWR('/api/blog/posts', fetcher, swrConfig);
  return { posts: data || [], isLoading, error, mutate };
}

export function useBlogPost(slug: string | undefined) {
  const { data, error, isLoading } = useSWR(
    slug ? `/api/blog/posts/${slug}` : null, 
    fetcher, 
    swrConfig
  );
  return { post: data, isLoading, error };
}

export function useBlogCategories() {
  const { data, error, isLoading } = useSWR('/api/blog/categories', fetcher, swrConfig);
  return { categories: data || [], isLoading, error };
}

export function useEnquiries() {
  const { data, error, isLoading, mutate } = useSWR('/api/enquiries', fetcher, swrConfig);
  return { enquiries: data || [], isLoading, error, mutate };
}
