import { useEffect, useMemo, useState } from "react";
import { AppShell } from "../../layouts/AppShell";
import { apiClient } from "../../../infrastructure/http/apiClient";

type Technician = {
  id: string;
  nombre: string | null;
  telefono: string | null;
  estado: string;
  createdAt: string | null;
  pendingTasks: number;
};

type PaginatedResponse<T> = {
  ok: true;
  items: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
};

type OkResponse<T> = {
  ok: true;
  data: T;
};

type TechnicianForm = {
  id: string;
  nombre: string;
  telefono: string;
  estado: string;
};

const INITIAL_FORM: TechnicianForm = {
  id: "",
  nombre: "",
  telefono: "",
  estado: "activo",
};

export function UsersCrudPage() {
  const [items, setItems] = useState<Technician[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const [query, setQuery] = useState("");
  const [estadoFilter, setEstadoFilter] = useState("");

  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Technician | null>(null);
  const [form, setForm] = useState<TechnicianForm>(INITIAL_FORM);

  const [error, setError] = useState<string | null>(null);

  const pageTitle = useMemo(() => {
    return editing ? "Editar usuario" : "Nuevo usuario";
  }, [editing]);

  async function loadUsers() {
    try {
      setLoading(true);
      setError(null);

      const params = new URLSearchParams();
      params.set("page", "1");
      params.set("pageSize", "50");

      if (query.trim()) params.set("q", query.trim());
      if (estadoFilter) params.set("estado", estadoFilter);

      const res = await apiClient.request<PaginatedResponse<Technician>>(
        `/api/technicians?${params.toString()}`
      );

      setItems(res.items);
    } catch (e: any) {
      setError(e?.message ?? "No se pudieron cargar los usuarios");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadUsers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function openCreate() {
    setEditing(null);
    setForm(INITIAL_FORM);
    setOpen(true);
  }

  function openEdit(item: Technician) {
    setEditing(item);
    setForm({
      id: item.id,
      nombre: item.nombre ?? "",
      telefono: item.telefono ?? "",
      estado: item.estado ?? "activo",
    });
    setOpen(true);
  }

  function closeModal() {
    setOpen(false);
    setEditing(null);
    setForm(INITIAL_FORM);
  }

  function updateForm<K extends keyof TechnicianForm>(key: K, value: TechnicianForm[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  async function submitForm(e: React.FormEvent) {
    e.preventDefault();

    try {
      setSaving(true);
      setError(null);

      const payload = {
        ...(editing ? {} : { id: form.id.trim() }),
        nombre: form.nombre.trim() || null,
        telefono: form.telefono.trim() || null,
        estado: form.estado,
      };

      if (editing) {
        await apiClient.request<OkResponse<Technician>>(`/api/technicians/${editing.id}`, {
          method: "PATCH",
          body: JSON.stringify(payload),
        });
      } else {
        if (!form.id.trim()) {
          throw new Error("El ID del usuario es requerido");
        }

        await apiClient.request<OkResponse<Technician>>("/api/technicians", {
          method: "POST",
          body: JSON.stringify(payload),
        });
      }

      closeModal();
      await loadUsers();
    } catch (e: any) {
      setError(e?.message ?? "No se pudo guardar el usuario");
    } finally {
      setSaving(false);
    }
  }

  async function removeUser(id: string) {
    const ok = window.confirm("¿Seguro que quieres eliminar este usuario?");
    if (!ok) return;

    try {
      setDeletingId(id);
      setError(null);

      await apiClient.request<OkResponse<{ deleted: true; id: string }>>(`/api/technicians/${id}`, {
        method: "DELETE",
      });

      await loadUsers();
    } catch (e: any) {
      setError(e?.message ?? "No se pudo eliminar el usuario");
    } finally {
      setDeletingId(null);
    }
  }

  return (
    <AppShell title="Usuarios" role="admin">
      <div className="space-y-6">
        <div className="rounded-3xl border border-white/10 bg-[#101010] p-6">
          <div className="flex flex-col gap-4 xl:flex-row xl:items-end xl:justify-between">
            <div>
              <div className="text-sm uppercase tracking-[0.16em] text-[#db9700]">
                Administración
              </div>
              <h2 className="mt-2 text-2xl font-semibold text-white">
                CRUD de usuarios
              </h2>
              <p className="mt-2 max-w-3xl text-sm text-white/65">
                Esta pantalla está acoplada al backend actual vía{" "}
                <span className="font-medium text-white">/api/technicians</span>.
                Administra perfiles técnicos del sistema.
              </p>
            </div>

            <button
              type="button"
              onClick={openCreate}
              className="inline-flex h-12 items-center justify-center rounded-2xl bg-[#db9000] px-5 text-sm font-semibold text-black transition hover:bg-[#c98200]"
            >
              Nuevo usuario
            </button>
          </div>
        </div>

        <div className="rounded-3xl border border-white/10 bg-[#101010] p-5">
          <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
            <div>
              <label className="mb-2 block text-sm text-white/70">Buscar</label>
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="ID, nombre o teléfono"
                className="w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-white outline-none transition focus:border-[#db9700]/50"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm text-white/70">Estado</label>
              <select
                value={estadoFilter}
                onChange={(e) => setEstadoFilter(e.target.value)}
                className="w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-white outline-none transition focus:border-[#db9700]/50"
              >
                <option value="">Todos</option>
                <option value="activo">Activo</option>
                <option value="inactivo">Inactivo</option>
              </select>
            </div>

            <div className="flex items-end">
              <button
                type="button"
                onClick={loadUsers}
                className="h-12 w-full rounded-2xl border border-white/10 bg-[#151515] px-4 text-sm font-medium text-white transition hover:border-[#db9700]/35 hover:bg-[#1a1a1a]"
              >
                Aplicar filtros
              </button>
            </div>
          </div>
        </div>

        {error && (
          <div className="rounded-2xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-200">
            {error}
          </div>
        )}

        <div className="rounded-3xl border border-white/10 bg-[#101010] p-0 overflow-hidden">
          <div className="border-b border-white/10 px-5 py-4">
            <div className="text-sm font-medium text-white/80">Usuarios registrados</div>
          </div>

          {loading ? (
            <div className="px-5 py-8 text-sm text-white/55">Cargando usuarios...</div>
          ) : items.length === 0 ? (
            <div className="px-5 py-8 text-sm text-white/55">No hay usuarios para mostrar.</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full text-left">
                <thead className="bg-black/20 text-xs uppercase tracking-[0.12em] text-white/45">
                  <tr>
                    <th className="px-5 py-4">ID</th>
                    <th className="px-5 py-4">Nombre</th>
                    <th className="px-5 py-4">Teléfono</th>
                    <th className="px-5 py-4">Estado</th>
                    <th className="px-5 py-4">Tareas pendientes</th>
                    <th className="px-5 py-4 text-right">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {items.map((item) => (
                    <tr key={item.id} className="border-t border-white/10">
                      <td className="px-5 py-4 text-sm text-white">{item.id}</td>
                      <td className="px-5 py-4 text-sm text-white">{item.nombre ?? "-"}</td>
                      <td className="px-5 py-4 text-sm text-white/80">{item.telefono ?? "-"}</td>
                      <td className="px-5 py-4">
                        <span
                          className={[
                            "rounded-full px-2.5 py-1 text-xs font-semibold uppercase tracking-[0.08em]",
                            item.estado === "activo"
                              ? "border border-emerald-500/20 bg-emerald-500/10 text-emerald-300"
                              : "border border-white/10 bg-white/5 text-white/70",
                          ].join(" ")}
                        >
                          {item.estado}
                        </span>
                      </td>
                      <td className="px-5 py-4 text-sm text-white">{item.pendingTasks}</td>
                      <td className="px-5 py-4">
                        <div className="flex justify-end gap-2">
                          <button
                            type="button"
                            onClick={() => openEdit(item)}
                            className="rounded-xl border border-white/10 bg-[#161616] px-3 py-2 text-sm text-white transition hover:border-[#db9700]/35"
                          >
                            Editar
                          </button>

                          <button
                            type="button"
                            onClick={() => removeUser(item.id)}
                            disabled={deletingId === item.id}
                            className="rounded-xl border border-red-500/20 bg-red-500/10 px-3 py-2 text-sm text-red-200 transition hover:bg-red-500/15 disabled:opacity-60"
                          >
                            {deletingId === item.id ? "Eliminando..." : "Eliminar"}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {open && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/75 px-4">
          <div className="w-full max-w-xl rounded-3xl border border-white/10 bg-[#0d0d0d] shadow-2xl shadow-black">
            <div className="border-b border-white/10 px-6 py-5">
              <div className="text-sm uppercase tracking-[0.16em] text-[#db9700]">
                Usuarios
              </div>
              <h3 className="mt-2 text-xl font-semibold text-white">{pageTitle}</h3>
            </div>

            <form onSubmit={submitForm} className="space-y-4 px-6 py-5">
              <div>
                <label className="mb-2 block text-sm text-white/70">ID del usuario</label>
                <input
                  value={form.id}
                  onChange={(e) => updateForm("id", e.target.value)}
                  disabled={!!editing}
                  placeholder="UUID o ID existente en auth"
                  className="w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-white outline-none transition focus:border-[#db9700]/50 disabled:opacity-60"
                />
                {!editing && (
                  <p className="mt-2 text-xs text-white/45">
                    Este ID debe existir previamente en el sistema de autenticación.
                  </p>
                )}
              </div>

              <div>
                <label className="mb-2 block text-sm text-white/70">Nombre</label>
                <input
                  value={form.nombre}
                  onChange={(e) => updateForm("nombre", e.target.value)}
                  placeholder="Nombre completo"
                  className="w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-white outline-none transition focus:border-[#db9700]/50"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm text-white/70">Teléfono</label>
                <input
                  value={form.telefono}
                  onChange={(e) => updateForm("telefono", e.target.value)}
                  placeholder="443..."
                  className="w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-white outline-none transition focus:border-[#db9700]/50"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm text-white/70">Estado</label>
                <select
                  value={form.estado}
                  onChange={(e) => updateForm("estado", e.target.value)}
                  className="w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-white outline-none transition focus:border-[#db9700]/50"
                >
                  <option value="activo">Activo</option>
                  <option value="inactivo">Inactivo</option>
                </select>
              </div>

              <div className="flex flex-col-reverse gap-3 pt-2 sm:flex-row sm:justify-end">
                <button
                  type="button"
                  onClick={closeModal}
                  className="h-12 rounded-2xl border border-white/10 bg-[#151515] px-5 text-sm font-medium text-white transition hover:border-white/20"
                >
                  Cancelar
                </button>

                <button
                  type="submit"
                  disabled={saving}
                  className="h-12 rounded-2xl bg-[#db9000] px-5 text-sm font-semibold text-black transition hover:bg-[#c98200] disabled:opacity-70"
                >
                  {saving ? "Guardando..." : editing ? "Guardar cambios" : "Crear usuario"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </AppShell>
  );
}