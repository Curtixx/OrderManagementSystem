"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { createOrder } from "./actions/createOrderAction"
import { toast } from "sonner"
import { convertValue } from "@/utils/convertValue"

const formSchema = z.object({
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

export default function CriarPedido() {
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            client: "",
            product: "",
            value: 0
        },
    })

    async function onSubmit(values: z.infer<typeof formSchema>) {
        const res = await createOrder(values);

        if (res) {
            form.reset();
            toast.success("Pedido criado com sucesso!");
        }
    }

    return (
        <div className="container mx-auto py-10">
            <Card>
                <CardHeader>
                    <CardTitle>Criar Novo Pedido</CardTitle>
                    <CardDescription>Preencha os dados abaixo para criar um novo pedido.</CardDescription>
                </CardHeader>
                <CardContent>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                            <FormField
                                control={form.control}
                                name="client"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Nome do Cliente</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Digite o nome do cliente" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="product"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Produto</FormLabel>
                                        <Input placeholder="Digite o nome do produto" {...field} />
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="value"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Valor</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Digite o valor" {...field}
                                                value={convertValue(String(field.value))}
                                                onChange={(e) => {
                                                    const formatted = convertValue(e.target.value);
                                                    field.onChange(formatted.replace(/\D/g, ""));
                                                }}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <Button type="submit" className="w-full">
                                Criar Pedido
                            </Button>
                        </form>
                    </Form>
                </CardContent>
            </Card>
        </div>
    )
}

