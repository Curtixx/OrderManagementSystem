"use client"

import { Button } from "@/components/ui/button"
import { useForm, SubmitHandler } from "react-hook-form"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Pencil } from "lucide-react"
import { formSchema } from "@/app/ver-pedidos/components/schema"
import { z } from "zod"
import { updateOrder } from "@/app/ver-pedidos/updateOrderAction"
import { toast } from "sonner"
import { zodResolver } from "@hookform/resolvers/zod"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { convertValue } from "@/utils/convertValue"

interface ModalEditProps {
    id: string,
    client: string,
    product: string,
    value: number,
}

type Data = z.infer<typeof formSchema>

export function ModalEdit({ id, client, product, value }: ModalEditProps) {
    const router = useRouter();
    const [showModal, setShowModal] = useState(false);

    const { handleSubmit, setValue, reset, register } = useForm<Data>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            client: client,
            product: product,
            value: convertValue(String(value)),
        },
    })

    const handleUpdate: SubmitHandler<Data> = async (data) => {
        const res = await updateOrder(id, data);

        if (res) {
            reset();
            router.refresh();
            toast.success("Pedido editado com sucesso!");
            setShowModal(false);
        }
    }

    useEffect(() => {
        setValue("client", client);
        setValue("product", product);
        setValue("value", value);
    }, [client, product, value, setValue]);

    return (
        <Dialog open={showModal} onOpenChange={setShowModal}>
            <DialogTrigger asChild>
                <Pencil className="h-4 w-4 text-yellow-400" />
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Editar Pedido</DialogTitle>
                    <DialogDescription>
                        Aqui você pode editar o pedido: {id}.
                    </DialogDescription>
                </DialogHeader>
                <form action="" id="formEdit" onSubmit={(e) => handleSubmit(handleUpdate)(e)}>
                    <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="name" className="text-right">
                                Cliente
                            </Label>
                            <Input id="client" {...register("client")} defaultValue={client} className="col-span-3" />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="username" className="text-right">
                                Produto
                            </Label>
                            <Input id="product" {...register("product")} defaultValue={product} className="col-span-3" />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="username" className="text-right">
                                Valor
                            </Label>
                            <Input placeholder="Digite o valor"
                                {...register("value")}
                                defaultValue={convertValue(String(value))}
                                className="col-span-3"
                                onChange={(e) => {
                                    const formatted = convertValue(e.target.value);
                                    e.target.value = formatted;
                                }}
                            />
                        </div>
                    </div>
                </form>
                <DialogFooter>
                    <Button type="submit" form="formEdit">Editar</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
