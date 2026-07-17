import { useCustomers } from "../api/customers";
import { useOrders } from "../api/orders";
import { usePayments } from "../api/payments";
import { useProducts } from "../api/products";
import { useTraders } from "../api/traders";

export function useAppData()
{
    const {data:traders=[]} = useTraders();
    const {data:orders=[]} = useOrders();
    const {data:customers=[]} = useCustomers();
    const {data:products=[]} = useProducts();
    const {data:payments={}} = usePayments();

    return {traders,orders,customers,products,payments}
    
}