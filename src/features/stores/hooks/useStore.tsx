import { api } from "@/lib/axios";
import type { Store } from "@/types";
import { useQuery } from "@tanstack/react-query";
  

export const useGetMyStore = () => {
  return useQuery({
    // 1. UNIQUE KEY: We add storeId here. 
    // If we don't, React Query will think Store A and Store B are the same data.
    queryKey: ['store'], 
    
    queryFn: async (): Promise<Store[]> => {
      // 2. DYNAMIC URL: We inject the ID into the request path
      // Example: GET /store/123
      const { data } = await api.get(`/public/store`); 
      return data.result;
    },

  

    retry: false,
    staleTime: 1000 * 60 * 60, 
  });
};


 