import { prisma } from "@/lib/prisma";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { UserRole } from "@prisma/client";

async function getUsers() {
  const users = await prisma.userMetadata.findMany({
    orderBy: {
      createdAt: "desc",
    },
  });

  return users;
}

const roleLabels: Record<UserRole, string> = {
  SUPER_ADMIN: "Super Admin",
  ADMIN: "Administrador",
  CUSTOMER: "Cliente",
};

const roleColors: Record<UserRole, string> = {
  SUPER_ADMIN: "bg-purple-100 text-purple-800 border-purple-300",
  ADMIN: "bg-blue-100 text-blue-800 border-blue-300",
  CUSTOMER: "bg-gray-100 text-gray-800 border-gray-300",
};

function formatDate(date: Date) {
  return new Date(date).toLocaleDateString("es-CO", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default async function UsersPage() {
  const users = await getUsers();

  const adminUsers = users.filter(
    (u) => u.role === "SUPER_ADMIN" || u.role === "ADMIN",
  );
  const customerUsers = users.filter((u) => u.role === "CUSTOMER");

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-serif font-semibold text-foreground">
          Usuarios
        </h1>
        <p className="text-sm text-muted-foreground font-sans mt-1">
          Gestiona los usuarios y sus roles de acceso
        </p>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card className="border-[hsl(var(--beige-400))]">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium font-sans">
              Total Usuarios
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold font-serif">{users.length}</div>
          </CardContent>
        </Card>
        <Card className="border-[hsl(var(--beige-400))]">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium font-sans">
              Administradores
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold font-serif">
              {adminUsers.length}
            </div>
          </CardContent>
        </Card>
        <Card className="border-[hsl(var(--beige-400))]">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium font-sans">
              Clientes
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold font-serif">
              {customerUsers.length}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Users Table */}
      <Card className="border-[hsl(var(--beige-400))]">
        <CardHeader>
          <CardTitle className="font-serif">Lista de Usuarios</CardTitle>
          <CardDescription className="font-sans">
            Usuarios registrados en el sistema
          </CardDescription>
        </CardHeader>
        <CardContent>
          {users.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground font-sans">
                No hay usuarios registrados
              </p>
            </div>
          ) : (
            <div className="border border-[hsl(var(--beige-400))] rounded-lg overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow className="bg-[hsl(var(--beige-100))]">
                    <TableHead className="font-sans font-semibold">
                      ID de Clerk
                    </TableHead>
                    <TableHead className="font-sans font-semibold">
                      Rol
                    </TableHead>
                    <TableHead className="font-sans font-semibold">
                      Fecha de Registro
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {users.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell className="font-sans font-mono text-sm">
                        {user.clerkId}
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant="outline"
                          className={`font-sans ${roleColors[user.role]}`}
                        >
                          {roleLabels[user.role]}
                        </Badge>
                      </TableCell>
                      <TableCell className="font-sans text-sm">
                        {formatDate(user.createdAt)}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Info Card */}
      <Card className="border-[hsl(var(--beige-400))] bg-[hsl(var(--beige-100))]">
        <CardHeader>
          <CardTitle className="font-serif text-base">
            Gestión de Roles
          </CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-muted-foreground font-sans space-y-2">
          <p>
            Los roles de usuario se gestionan automáticamente a través de Clerk.
          </p>
          <p>
            Para cambiar el rol de un usuario, actualiza su metadata en el
            dashboard de Clerk.
          </p>
          <div className="mt-4 space-y-1">
            <p className="font-medium text-foreground">Roles disponibles:</p>
            <ul className="list-disc list-inside space-y-1 pl-2">
              <li>
                <strong>SUPER_ADMIN:</strong> Acceso completo al sistema
              </li>
              <li>
                <strong>ADMIN:</strong> Gestión de productos y pedidos
              </li>
              <li>
                <strong>CUSTOMER:</strong> Usuario estándar de la tienda
              </li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
