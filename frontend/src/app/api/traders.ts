import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Trader } from "../components/models";
import { API } from "./service";

export function useTraders()
{
    return useQuery<Trader[]>({
        queryKey:['traders'],
        queryFn: async ()=>
            {
                const response = await API.get('/traders');
                return response.data;
            }
    })
}

export function useAddTraders()
{
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (trader:Trader)=>
        {
            const response = await API.post('/traders',trader)
            return response.data;
        },
        onSuccess: ()=>
        {
            queryClient.invalidateQueries({queryKey:['traders']});
        }
    })
}

export function useUpdateTrader()
{
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async ({id,trader}:{id:string;trader:Trader})=>
        {
            const response = await API.put(`/traders/${id}`,trader);
            return response.data;
        },
        onSuccess:()=>
        {
            queryClient.invalidateQueries({queryKey:['traders']});
        }
    })
}

export function useDeleteTrader()
{
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (id:string)=> await API.delete(`/traders/${id}`), 
        onSuccess:()=>
        {
            queryClient.invalidateQueries({queryKey:['traders']});
        }
    })
}