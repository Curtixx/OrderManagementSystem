"use server"

export async function getAllOrders() {
    const req = await fetch('http://api-oms-tmb:8080/orders', {
        method: "GET",
    });

    if (!req.ok) {
        return false
    }

    return req.json()
}