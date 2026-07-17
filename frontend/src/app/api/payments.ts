import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { API } from "./service";
import { PaymentRecord } from "../components/models";

export function usePayments()
{
    return useQuery<Record<string,PaymentRecord>>({
        queryKey:['payments'],
        queryFn:async ()=>
        {
            const response = await API.get('/payments');
            return response.data;
        }
    })
}

export function useAddPayment()
{
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (payment:PaymentRecord)=>
        {
            const response = await API.post('/payments',payment)
        },
        onSuccess:()=>
        {
            queryClient.invalidateQueries({queryKey:['payments']})
        }
    })
}

export function useUpdatePayment()
{
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn:async ({id,paymentRecord}:{id:string,paymentRecord:PaymentRecord})=>
        {
            const response = await API.put(`/payments/${id}`,paymentRecord);
            return response.data;
        },
        onSuccess:()=>
        {
            queryClient.invalidateQueries({queryKey:['payments']});
            queryClient.invalidateQueries({queryKey:['orders']});
        }
    })
}

export function useDeletePayment()
{
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (id:string)=>
        {
            const response = await API.delete(`/payments/${id}`);
            return response.data;
        },
        onSuccess:()=>
        {
            queryClient.invalidateQueries({queryKey:['payments']});
        }
    })
}