"use client"

import { FileText, PlusCircle } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

export default function NavBar() {
  const pathname = usePathname()

  return (
    <div>
      <nav className="flex h-16 items-center border-b bg-background px-4">
        <div className="flex space-x-4">
          <Link href="/criar-pedido">
            <Button
              variant="ghost"
              className={cn("flex items-center gap-2", pathname === "/criar-pedido" && "bg-muted font-semibold")}
            >
              <PlusCircle className="h-4 w-4" />
              Criar Pedido
            </Button>
          </Link>
          <Link href="/ver-pedidos">
            <Button
              variant="ghost"
              className={cn("flex items-center gap-2", pathname === "/ver-pedidos" && "bg-muted font-semibold")}
            >
              <FileText className="h-4 w-4" />
              Ver Pedidos
            </Button>
          </Link>
        </div>
      </nav>
    </div>
  )
}