import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Product } from "../components/models";
import { API } from "./service";

export function useProducts()
{
    return useQuery<Product[]>({
        queryKey:['products'],
        queryFn: async()=>{
            const response = await API.get('/products');
            return response.data;
        }
    });
}

export function useAddProduct()
{
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (product:Omit<Product,'id'>) =>
        {
            const response = await API.post('/products',product);
            return response.data;
        },
        onSuccess: ()=>
        {
            queryClient.invalidateQueries({queryKey:['products']});
        }
    })
}

export function useUpdateProduct()
{
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async({id,product}:{id:string,product:Product})=>
        {
            const response = await API.put(`/products/${id}`,product);
            return response.data;
        },
        onSuccess: ()=>
        {
            queryClient.invalidateQueries({queryKey:['products']});
        }
    })
}

export function useDeleteProduct()
{
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn:async (id:string) =>
        {
            await API.delete(`/products/${id}`);
        },
        onSuccess:()=>
        {
            queryClient.invalidateQueries({queryKey:['products']});
        }
    })
}

export function useRestockProducts()
{
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn:async ({id,qty}:{id:string,qty:Product['stock']}) =>
        {
            await API.put(`/products/${id}/restock`,{qty});
        },
        onSuccess:()=>
        {
            queryClient.invalidateQueries({queryKey:['products']});
        }
    })
}