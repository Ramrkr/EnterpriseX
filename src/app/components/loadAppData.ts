import { useEffect, useState } from "react";
import { Customer, Order, PaymentRecord, Product, Trader } from "./models";
import { api } from "./utility";

export function loadAppData()
{
    const[traders,setTraders] = useState<Trader[]>([]);
    const[orders,setOrders] = useState<Order[]>([]);
    const[products,setProducts] = useState<Product[]>([]);
    const[customers,setCustomers] = useState<Customer[]>([]);
    const[payments,setPayments] = useState<Record<string,PaymentRecord>>({});

    useEffect(()=>
        {
            async function loadData() {
                try{
                    const [tradersData,ordersData,productsData,customersData,paymentsData]=await Promise.all(
                        [
                        api<Trader[]>('/traders'),
                        api<Order[]>('/orders'),
                        api<Product[]>('/products'),
                        api<Customer[]>('/customers'),
                        api<Record<string,PaymentRecord>>('/payments')
                        ]
                    )

                    setTraders(tradersData || []);
                    setOrders(ordersData || []);
                    setProducts(productsData || []);
                    setCustomers(customersData || []);
                    setPayments(paymentsData || {});
                }
                catch(error)
                {
                    console.log(error);
                    
                }
            }
        loadData();
        },[]);

        return {traders,products,orders,customers,payments};

}