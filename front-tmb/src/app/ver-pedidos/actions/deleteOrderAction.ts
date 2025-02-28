"use server"

export async function deleteOrder(id: string) {
    const req = await fetch(`http://api-oms-tmb:8080/orders/${id}`, {
        method: "DELETE",
    });

    if (!req.ok) {
        return false
    }

    return true
}