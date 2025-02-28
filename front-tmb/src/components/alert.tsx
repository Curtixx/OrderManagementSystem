"use client"

import { deleteOrder } from "@/app/ver-pedidos/actions/deleteOrderAction"
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { useRouter } from "next/navigation";
import { toast } from "sonner";

interface AlertProps {
    id: string,
    title: string,
    description: string,
    icon: React.ReactNode,
    action: string,
}

export function Alert({ id, title, description, icon, action }: AlertProps) {
    const router = useRouter();

    const handleAction = () => {
        if (action === "Delete") {
            deleteOrder(id);
            router.refresh();
            toast.success("Pedido excluido com sucesso!");
        }
    }
    return (
        <div>
            <AlertDialog>
                <AlertDialogTrigger asChild>
                    {icon}
                </AlertDialogTrigger>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>{title}</AlertDialogTitle>
                        <AlertDialogDescription>
                            {description}
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancelar</AlertDialogCancel>
                        <AlertDialogAction onClick={handleAction}>Continuar</AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    )
}
