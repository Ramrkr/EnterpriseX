import { useMutation, useQueries, useQuery, useQueryClient } from "@tanstack/react-query";
import { Customer } from "../components/models";
import { API } from "./service";

export function useCustomers()
{
    return useQuery<Customer[]>({
        queryKey:['customers'],
        queryFn:async ()=>
        {
            const response = await API.get('/customers');
            return response.data;
        }
    })
}

export function useAddCustomer()
{
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn:async (customer:Omit<Customer,'id'>)=>
        {
            const response = await API.post('/customers',customer);
            return response.data;
        },
        onSuccess:()=>
        {
            queryClient.invalidateQueries({queryKey:['customers']});
        }
    })
}

export function useUpdateCustomer()
{
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn:async ({id,customer}:{id:string,customer:Omit<Customer,'id'>})=>
        {
            const response = await API.put(`/customers/${id}`,customer);
            return response.data;
        },
        onSuccess:()=>
        {
            queryClient.invalidateQueries({queryKey:['customers']});
        }
    })
}

export function useDeleteCustomer()
{
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn:async (id:string)=>
        {
            await API.delete(`/customers/${id}`);
        },
        onSuccess:()=>
        {
            queryClient.invalidateQueries({queryKey:['customers']})
        }
    })
}