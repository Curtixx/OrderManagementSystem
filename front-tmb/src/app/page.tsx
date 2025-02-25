import Link from "next/link";

export default function Home() {
  return (
    <div>
      <div className="flex flex-col justify-center w-full items-center mt-10">
        <h1 className="text-2xl md:text-4xl text-center font-bold">Sistema de Gestão de Pedidos</h1>
        <div className="flex gap-4">
          <Link href={"/criar-pedido"} className="text-blue-600 hover:underline">
            Clique aqui para criar um pedido
          </Link>
          /
          <Link href={"/ver-pedidos"} className="text-blue-600 hover:underline">
            Clique aqui para ver os pedidos
          </Link>
        </div>
      </div>
    </div>
  );
}
