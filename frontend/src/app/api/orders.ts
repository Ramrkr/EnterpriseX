import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Order } from "../components/models";
import { api } from "../components/utility";
import { API } from "./service";
import { useDispatch } from "react-redux";
import { setSelectedOrder } from "../redux/slices/orderSlice";

// READ
export function useOrders()
{
    return useQuery<Order[]>({
        queryKey:['orders'],
        queryFn: ()=> api<Order[]>('/orders',{
            method:'GET'
        })
    });
}

//CREATE
export function useAddOrder()
{
    const queryClient = useQueryClient();
    const dispatch = useDispatch();
    return useMutation({
        mutationFn:async (newOrder:Omit<Order,"id">)=>{
            const response =  await API.post('/orders',newOrder);
            return response.data;
        },
        onSuccess:(createdOrder)=>{
            dispatch(setSelectedOrder(createdOrder));
            queryClient.invalidateQueries({queryKey:['orders']});
        }
    })
}

//Update the existing order
export function useUpdateExistingOrder()
{
    const queryClient = useQueryClient();
    return useMutation({
     mutationFn:async (updatedOrder:Order)=>{
        const response =await API.put(`/orders/${updatedOrder.id}`,updatedOrder);
        return response.data;
     },onSuccess:()=>
        {
            queryClient.invalidateQueries({queryKey:['orders']})
        }
    })
}

//UPDATE Status
export function useUpdateOrderStatus()
{
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn:({id,status}:{id:string;status:Order["status"]})=>
            api<Order[]>(`/orders/${id}/status`,{
                method:'PATCH',
                body:JSON.stringify({status})
            }),
        onSuccess:()=>{
            queryClient.invalidateQueries({queryKey:['orders']});
        }
    });
}

//DELETE
export function useDeleteOrders()
{
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn:(id:Order["id"])=>api<Order>(`/orders/${id}`, {
            method: 'DELETE'
        }),
        onSuccess:()=>
        {
            queryClient.invalidateQueries({queryKey:['orders']});
        }
    })
}