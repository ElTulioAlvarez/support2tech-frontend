export type User = {
  id: string;
  email?: string | null;
  nombre?: string | null;
  rol?: "admin" | "tecnico";
  telefono?: string | null;
  estado?: string;
};