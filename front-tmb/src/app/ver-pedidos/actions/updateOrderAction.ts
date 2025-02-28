"use server"

import { z } from "zod"
import { formSchema } from "./components/schema"

type Data = z.infer<typeof formSchema>
export async function updateOrder(id: string, data: Data) {
    console.log(data)
    const req = await fetch(`http://api-oms-tmb:8080/orders/${id}`, {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
        
    });

    if (!req.ok) {
        return false
    }

    return true}