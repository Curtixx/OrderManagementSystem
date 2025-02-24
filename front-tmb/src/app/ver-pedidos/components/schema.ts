import { z } from "zod";

export const formSchema = z.object({
    client: z.string().min(2, {
        message: "O nome do cliente deve ter pelo menos 2 caracteres.",
    }),
    product: z.string().min(1, {
        message: "Por favor selecione um produto.",
    }),
    value: z.preprocess((a: any) => {
        if (!a) {
            return a;
        }
        const rawValue = a.replace(/\D/g, "");
        return Number(rawValue) / 100;
    }, z.number().min(0.01, {
        message: "O valor deve ser maior que zero.",
    }).nonnegative()),
})