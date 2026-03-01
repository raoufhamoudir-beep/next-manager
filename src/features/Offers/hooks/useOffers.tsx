import { api } from "@/lib/axios";
import type {  PlanOffer } from "@/types";
import { useMutation, useQuery } from "@tanstack/react-query";
import toast from "react-hot-toast";


export const useGetOffer = () => {
  return useQuery({
    // 1. UNIQUE KEY: We add storeId here. 
    // If we don't, React Query will think Store A and Store B are the same data.
    queryKey: ['offer'], 
    
    queryFn: async (): Promise<PlanOffer[]> => {
      // 2. DYNAMIC URL: We inject the ID into the request path
      // Example: GET /store/123
      const { data } = await api.get(`/public/offer`); 
      return data.result;
    },

  

    retry: false,
    staleTime: 1000 * 60 * 60, 
  });
};


export const useOfferDelete = () => {
const {refetch} = useGetOffer();
   return useMutation({
    mutationFn: async (id: string) => {    
    const res = await api.delete(`/public/offer/${id}`);
       return res.data;
    },
    onSuccess: () => {
      toast.success("Store created successfully!");
      
      // Optional: Refresh a list of stores if you have one
      // queryClient.invalidateQueries({ queryKey: ['stores'] });

      refetch();
    },
    onError: (error: any) => {
      const msg = error?.response?.data?.message || "Something went wrong";
      toast.error(msg);
    },
  });
};


export const useOfferupdate = () => {
const {refetch} = useGetOffer();
   return useMutation({
mutationFn: async ({ id, data }: { id: string; data: any } ) => {    
    const res = await api.put(`/public/offer/${id}`, data);
       return res.data;
    },
    onSuccess: () => {
      toast.success("Store created successfully!");
      
      // Optional: Refresh a list of stores if you have one
      // queryClient.invalidateQueries({ queryKey: ['stores'] });

      refetch();
    },
    onError: (error: any) => {
      const msg = error?.response?.data?.message || "Something went wrong";
      toast.error(msg);
    },
  });
};