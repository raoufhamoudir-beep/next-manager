import { api } from "@/lib/axios";
import type {  User } from "@/types";
import { useMutation, useQuery } from "@tanstack/react-query";
 

export const useGetMyUsers = () => {
  return useQuery({
    // 1. UNIQUE KEY: We add storeId here. 
    // If we don't, React Query will think Store A and Store B are the same data.
    queryKey: ['user'], 
    
    queryFn: async (): Promise<User[]> => {
      // 2. DYNAMIC URL: We inject the ID into the request path
      // Example: GET /store/123
      const { data } = await api.get(`/users`); 
      return data.result;
    },

  

    retry: false,
    staleTime: 1000 * 60 * 60, 
  });
};


export const useUserDelete = () => {
const {refetch} = useGetMyUsers();
   return useMutation({
    mutationFn: async (id: string) => {    
    const res = await api.delete(`/users/${id}`);
       return res.data;
    },
    onSuccess: () => {
       
      // Optional: Refresh a list of stores if you have one
      // queryClient.invalidateQueries({ queryKey: ['stores'] });

      refetch();
    },
    onError: (error: any) => {
      const msg = error?.response?.data?.message || "Something went wrong";
      console.log(msg);
      
    },
  });
};


export const useUserupdate = () => {
const {refetch} = useGetMyUsers();
   return useMutation({
mutationFn: async ({ id, data }: { id: string; data: any } ) => {    
    const res = await api.put(`/users/${id}`, data);
       return res.data;
    },
    onSuccess: () => {
       
      // Optional: Refresh a list of stores if you have one
      // queryClient.invalidateQueries({ queryKey: ['stores'] });

      refetch();
    },
    onError: (error: any) => {
      const msg = error?.response?.data?.message || "Something went wrong";
      console.log(msg);
    },
  });
};


 