import { Alert } from "@/components/alert";
import { ModalEdit } from "@/components/modal-edit";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { convertValue, formatDate } from "@/utils/convertValue";

import { Trash2 } from "lucide-react"
import { getAllOrders } from "./getAllOrders";

interface OrdersParams {
    id: string;
    product: string;
    client: string;
    value: number,
    status: string,
    created_at: string
}

export default async function VerPedido() {

    const orders: OrdersParams[] = await getAllOrders();

    return (
        <div className="container mx-auto py-10">
            <Card className="xl:col-span-3">
                <CardHeader className="flex">
                    <h3 className="text-lg font-medium">Pedidos</h3>
                </CardHeader>
                <CardContent className="flex flex-col">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="w-[350px]">ID</TableHead>
                                <TableHead>Produto</TableHead>
                                <TableHead>Cliente</TableHead>
                                <TableHead>Valor</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead>Criado em</TableHead>
                                <TableHead></TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {orders.map((order) => (
                                <TableRow key={order.id}>
                                    <TableCell className="font-medium">{order.id}</TableCell>
                                    <TableCell className="font-medium uppercase">{order.product}</TableCell>
                                    <TableCell className="font-medium">{order.client}</TableCell>
                                    <TableCell>{convertValue(String(order.value.toFixed(2)))}</TableCell>
                                    <TableCell>{order.status}</TableCell>
                                    <TableCell>{formatDate(order.created_at)}</TableCell>
                                    <TableCell>
                                        <div className="flex gap-2">
                                            <Alert
                                                id={order.id}
                                                title="Excluir Pedido"
                                                description="Ao realizar essa ação o pedido será excluido e não poderá ser recuperado"
                                                icon={<Trash2 className="h-4 w-4 text-red-400" />}
                                                action="Delete"
                                            />
                                            <ModalEdit 
                                                id={order.id}
                                                product={order.product}
                                                client={order.client}
                                                value={order.value}
                                            />
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    );
}
