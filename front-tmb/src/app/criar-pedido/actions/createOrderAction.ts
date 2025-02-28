"use server"

interface OrdersParams {
    client: string;
    product: string;
    value: string|number;
}

export async function createOrder({ client, product, value }: OrdersParams) {
    const req = await fetch('http://api-oms-tmb:8080/orders', {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ 
            client,
            product,
            value,
            status: "Pendente",
        }),
        
    });

    if (!req.ok) {
        return false
    }

    return true
}