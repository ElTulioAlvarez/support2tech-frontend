import { useEffect, useMemo, useState } from "react";
import { AppShell } from "../../layouts/AppShell";
import { apiClient } from "../../../infrastructure/http/apiClient";

type UserRole = "admin" | "tecnico";
type UserStatus = "activo" | "inactivo";

type UserItem = {
  id: string;
  email: string;
  nombre: string | null;
  telefono: string | null;
  rol: UserRole;
  estado: UserStatus;
  createdAt: string | null;
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

type UserForm = {
  email: string;
  password: string;
  nombre: string;
  telefono: string;
  rol: UserRole;
  estado: UserStatus;
};

const INITIAL_FORM: UserForm = {
  email: "",
  password: "",
  nombre: "",
  telefono: "",
  rol: "tecnico",
  estado: "activo",
};

export function UsersCrudPage() {
  const [items, setItems] = useState<UserItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const [query, setQuery] = useState("");
  const [estadoFilter, setEstadoFilter] = useState("");
  const [rolFilter, setRolFilter] = useState("");

  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<UserItem | null>(null);
  const [form, setForm] = useState<UserForm>(INITIAL_FORM);

  const [error, setError] = useState<string | null>(null);

  const pageTitle = useMemo(() => {
    return editing ? "Editar usuario" : "Nuevo usuario";
  }, [editing]);

  const stats = useMemo(() => {
    const total = items.length;
    const admins = items.filter((item) => item.rol === "admin").length;
    const tecnicos = items.filter((item) => item.rol === "tecnico").length;
    const inactivos = items.filter((item) => item.estado === "inactivo").length;

    return { total, admins, tecnicos, inactivos };
  }, [items]);

  async function loadUsers() {
    try {
      setLoading(true);
      setError(null);

      const params = new URLSearchParams();
      params.set("page", "1");
      params.set("pageSize", "50");

      if (query.trim()) params.set("q", query.trim());
      if (estadoFilter) params.set("estado", estadoFilter);
      if (rolFilter) params.set("rol", rolFilter);

      const res = await apiClient.request<PaginatedResponse<UserItem>>(
        `/api/users?${params.toString()}`,
        { autoLogoutOn401: true }
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

  function openEdit(item: UserItem) {
    setEditing(item);
    setForm({
      email: item.email ?? "",
      password: "",
      nombre: item.nombre ?? "",
      telefono: item.telefono ?? "",
      rol: item.rol,
      estado: item.estado,
    });
    setOpen(true);
  }

  function closeModal() {
    setOpen(false);
    setEditing(null);
    setForm(INITIAL_FORM);
  }

  function updateForm<K extends keyof UserForm>(key: K, value: UserForm[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  async function submitForm(e: React.FormEvent) {
    e.preventDefault();

    try {
      setSaving(true);
      setError(null);

      if (editing) {
        const payload = {
          nombre: form.nombre.trim() || null,
          telefono: form.telefono.trim() || null,
          rol: form.rol,
          estado: form.estado,
        };

        await apiClient.request<OkResponse<UserItem>>(`/api/users/${editing.id}`, {
          method: "PATCH",
          body: JSON.stringify(payload),
          autoLogoutOn401: true,
        });
      } else {
        const payload = {
          email: form.email.trim().toLowerCase(),
          password: form.password.trim(),
          nombre: form.nombre.trim() || null,
          telefono: form.telefono.trim() || null,
          rol: form.rol,
          estado: form.estado,
        };

        if (!payload.email) {
          throw new Error("El email es requerido");
        }

        if (!payload.password) {
          throw new Error("La contraseña es requerida");
        }

        await apiClient.request<OkResponse<UserItem>>("/api/users", {
          method: "POST",
          body: JSON.stringify(payload),
          autoLogoutOn401: true,
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
    const ok = window.confirm(
      "¿Seguro que quieres desactivar este usuario? Ya no podrá operar mientras esté inactivo."
    );
    if (!ok) return;

    try {
      setDeletingId(id);
      setError(null);

      await apiClient.request<OkResponse<{ deleted: true; id: string }>>(`/api/users/${id}`, {
        method: "DELETE",
        autoLogoutOn401: true,
      });

      await loadUsers();
    } catch (e: any) {
      setError(e?.message ?? "No se pudo desactivar el usuario");
    } finally {
      setDeletingId(null);
    }
  }

  return (
    <AppShell title="Usuarios" role="admin">
      <div className="space-y-5 lg:space-y-6">
        <section className="relative overflow-hidden rounded-[28px] border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.04),rgba(255,255,255,0.02))] p-5 shadow-[0_18px_50px_rgba(0,0,0,0.30)] sm:p-6">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(219,151,0,0.12),transparent_30%)]" />
          <div className="relative flex flex-col gap-5">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
              <div>
                <div className="text-[11px] uppercase tracking-[0.22em] text-[#db9700]">
                  Administración
                </div>
                <h2 className="mt-2 text-2xl font-semibold tracking-[0.01em] text-white sm:text-[30px]">
                  Gestión de usuarios
                </h2>
                <p className="mt-2 max-w-2xl text-sm leading-6 text-white/58">
                  Administra cuentas, roles y estado operativo del sistema desde una vista
                  optimizada para móvil y escritorio.
                </p>
              </div>

              <button
                type="button"
                onClick={openCreate}
                className="inline-flex h-12 items-center justify-center rounded-2xl border border-[#db9700]/20 bg-[#db9700] px-5 text-sm font-semibold text-black transition hover:bg-[#efaa0b] active:scale-[0.99]"
              >
                Nuevo usuario
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
              <StatCard label="Usuarios" value={stats.total} />
              <StatCard label="Admins" value={stats.admins} />
              <StatCard label="Técnicos" value={stats.tecnicos} />
              <StatCard label="Inactivos" value={stats.inactivos} />
            </div>
          </div>
        </section>

        <section className="rounded-[28px] border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.03),rgba(255,255,255,0.015))] p-4 shadow-[0_14px_34px_rgba(0,0,0,0.24)] sm:p-5">
          <div className="mb-4 flex items-center justify-between gap-3">
            <div>
              <div className="text-[11px] uppercase tracking-[0.18em] text-[#db9700]">
                Filtros
              </div>
              <div className="mt-1 text-sm text-white/58">
                Busca por email, nombre, teléfono o identificador.
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-4">
            <FieldBlock label="Buscar">
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Email, nombre, teléfono o ID"
                className="h-12 w-full rounded-2xl border border-white/10 bg-[rgba(255,255,255,0.03)] px-4 text-sm text-white outline-none transition placeholder:text-white/28 focus:border-[#db9700]/45 focus:bg-[rgba(255,255,255,0.05)]"
              />
            </FieldBlock>

            <FieldBlock label="Rol">
              <select
                value={rolFilter}
                onChange={(e) => setRolFilter(e.target.value)}
                className="h-12 w-full rounded-2xl border border-white/10 bg-[rgba(255,255,255,0.03)] px-4 text-sm text-white outline-none transition focus:border-[#db9700]/45 focus:bg-[rgba(255,255,255,0.05)]"
              >
                <option value="">Todos</option>
                <option value="admin">Admin</option>
                <option value="tecnico">Técnico</option>
              </select>
            </FieldBlock>

            <FieldBlock label="Estado">
              <select
                value={estadoFilter}
                onChange={(e) => setEstadoFilter(e.target.value)}
                className="h-12 w-full rounded-2xl border border-white/10 bg-[rgba(255,255,255,0.03)] px-4 text-sm text-white outline-none transition focus:border-[#db9700]/45 focus:bg-[rgba(255,255,255,0.05)]"
              >
                <option value="">Todos</option>
                <option value="activo">Activo</option>
                <option value="inactivo">Inactivo</option>
              </select>
            </FieldBlock>

            <div className="flex items-end">
              <button
                type="button"
                onClick={loadUsers}
                className="h-12 w-full rounded-2xl border border-white/10 bg-[rgba(255,255,255,0.04)] px-4 text-sm font-medium text-white transition hover:border-[#db9700]/35 hover:bg-[rgba(219,151,0,0.08)]"
              >
                Aplicar filtros
              </button>
            </div>
          </div>
        </section>

        {error && (
          <div className="rounded-2xl border border-red-500/25 bg-red-500/10 px-4 py-3 text-sm text-red-200">
            {error}
          </div>
        )}

        <section className="space-y-4 lg:space-y-0">
          <div className="rounded-[28px] border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.03),rgba(255,255,255,0.015))] shadow-[0_14px_34px_rgba(0,0,0,0.24)]">
            <div className="flex items-center justify-between border-b border-white/10 px-5 py-4 sm:px-6">
              <div>
                <div className="text-sm font-semibold text-white">Usuarios registrados</div>
                <div className="mt-1 text-xs text-white/45">
                  Vista premium en móvil y tabla completa en escritorio.
                </div>
              </div>

              <div className="rounded-full border border-white/10 bg-[rgba(255,255,255,0.03)] px-3 py-1 text-xs text-white/55">
                {items.length} resultados
              </div>
            </div>

            {loading ? (
              <div className="px-5 py-10 text-sm text-white/55 sm:px-6">
                Cargando usuarios...
              </div>
            ) : items.length === 0 ? (
              <div className="px-5 py-10 text-sm text-white/55 sm:px-6">
                No hay usuarios para mostrar.
              </div>
            ) : (
              <>
                <div className="space-y-3 p-3 sm:p-4 lg:hidden">
                  {items.map((item) => (
                    <article
                      key={item.id}
                      className="overflow-hidden rounded-[24px] border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.035),rgba(255,255,255,0.015))] shadow-[0_10px_26px_rgba(0,0,0,0.22)]"
                    >
                      <div className="border-b border-white/10 px-4 py-4">
                        <div className="flex items-start justify-between gap-3">
                          <div className="min-w-0">
                            <div className="truncate text-base font-semibold text-white">
                              {item.nombre?.trim() || "Sin nombre"}
                            </div>
                            <div className="mt-1 truncate text-sm text-white/58">{item.email || "-"}</div>
                          </div>

                          <div className="shrink-0">
                            <RoleBadge role={item.rol} />
                          </div>
                        </div>
                      </div>

                      <div className="space-y-3 px-4 py-4">
                        <InfoRow label="Estado">
                          <StatusBadge status={item.estado} />
                        </InfoRow>

                        <InfoRow label="Teléfono">
                          <span className="text-sm text-white">{item.telefono ?? "-"}</span>
                        </InfoRow>

                        <InfoRow label="ID">
                          <span className="block max-w-[180px] truncate text-sm text-white/65">
                            {item.id}
                          </span>
                        </InfoRow>
                      </div>

                      <div className="grid grid-cols-2 gap-2 border-t border-white/10 px-4 py-4">
                        <button
                          type="button"
                          onClick={() => openEdit(item)}
                          className="h-11 rounded-2xl border border-white/10 bg-[rgba(255,255,255,0.04)] px-4 text-sm font-medium text-white transition hover:border-[#db9700]/35 hover:bg-[rgba(219,151,0,0.08)]"
                        >
                          Editar
                        </button>

                        <button
                          type="button"
                          onClick={() => removeUser(item.id)}
                          disabled={deletingId === item.id}
                          className="h-11 rounded-2xl border border-red-500/20 bg-red-500/10 px-4 text-sm font-medium text-red-200 transition hover:bg-red-500/15 disabled:opacity-60"
                        >
                          {deletingId === item.id ? "Desactivando..." : "Desactivar"}
                        </button>
                      </div>
                    </article>
                  ))}
                </div>

                <div className="hidden overflow-x-auto lg:block">
                  <table className="min-w-full text-left">
                    <thead className="bg-black/20 text-[11px] uppercase tracking-[0.16em] text-white/38">
                      <tr>
                        <th className="px-6 py-4">ID</th>
                        <th className="px-6 py-4">Email</th>
                        <th className="px-6 py-4">Nombre</th>
                        <th className="px-6 py-4">Teléfono</th>
                        <th className="px-6 py-4">Rol</th>
                        <th className="px-6 py-4">Estado</th>
                        <th className="px-6 py-4 text-right">Acciones</th>
                      </tr>
                    </thead>
                    <tbody>
                      {items.map((item) => (
                        <tr
                          key={item.id}
                          className="border-t border-white/10 transition hover:bg-[rgba(219,151,0,0.035)]"
                        >
                          <td className="px-6 py-4 text-sm text-white/70">{item.id}</td>
                          <td className="px-6 py-4 text-sm text-white">{item.email || "-"}</td>
                          <td className="px-6 py-4 text-sm text-white">{item.nombre ?? "-"}</td>
                          <td className="px-6 py-4 text-sm text-white/75">{item.telefono ?? "-"}</td>
                          <td className="px-6 py-4">
                            <RoleBadge role={item.rol} />
                          </td>
                          <td className="px-6 py-4">
                            <StatusBadge status={item.estado} />
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex justify-end gap-2">
                              <button
                                type="button"
                                onClick={() => openEdit(item)}
                                className="rounded-2xl border border-white/10 bg-[rgba(255,255,255,0.04)] px-4 py-2.5 text-sm text-white transition hover:border-[#db9700]/35 hover:bg-[rgba(219,151,0,0.08)]"
                              >
                                Editar
                              </button>

                              <button
                                type="button"
                                onClick={() => removeUser(item.id)}
                                disabled={deletingId === item.id}
                                className="rounded-2xl border border-red-500/20 bg-red-500/10 px-4 py-2.5 text-sm text-red-200 transition hover:bg-red-500/15 disabled:opacity-60"
                              >
                                {deletingId === item.id ? "Desactivando..." : "Desactivar"}
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </>
            )}
          </div>
        </section>
      </div>

      {open && (
        <div className="fixed inset-0 z-[70] bg-black/75 backdrop-blur-[3px]">
          <div className="flex min-h-full items-end justify-center lg:items-center">
            <div className="w-full max-w-2xl overflow-hidden rounded-t-[30px] border border-white/10 bg-[#0b0b0b] shadow-[0_30px_80px_rgba(0,0,0,0.75)] lg:rounded-[30px]">
              <div className="border-b border-white/10 px-5 py-4 sm:px-6 sm:py-5">
                <div className="mx-auto mb-3 h-1.5 w-14 rounded-full bg-white/12 lg:hidden" />
                <div className="text-[11px] uppercase tracking-[0.22em] text-[#db9700]">
                  Usuarios
                </div>
                <div className="mt-2 flex items-start justify-between gap-4">
                  <div>
                    <h3 className="text-xl font-semibold text-white sm:text-2xl">{pageTitle}</h3>
                    <p className="mt-1 text-sm text-white/52">
                      {editing
                        ? "Actualiza la información operativa del usuario."
                        : "Registra una nueva cuenta para el sistema."}
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={closeModal}
                    className="inline-flex h-10 w-10 items-center justify-center rounded-2xl border border-white/10 bg-[rgba(255,255,255,0.04)] text-white/75 transition hover:border-[#db9700]/35 hover:text-white"
                    aria-label="Cerrar"
                  >
                    <CloseIcon />
                  </button>
                </div>
              </div>

              <form onSubmit={submitForm} className="max-h-[85dvh] overflow-y-auto">
                <div className="space-y-4 px-5 py-5 sm:px-6 sm:py-6">
                  <FieldBlock label="Email">
                    <input
                      type="email"
                      value={form.email}
                      onChange={(e) => updateForm("email", e.target.value)}
                      disabled={!!editing}
                      placeholder="usuario@dominio.com"
                      className="h-12 w-full rounded-2xl border border-white/10 bg-[rgba(255,255,255,0.03)] px-4 text-sm text-white outline-none transition placeholder:text-white/28 focus:border-[#db9700]/45 focus:bg-[rgba(255,255,255,0.05)] disabled:opacity-60"
                    />
                  </FieldBlock>

                  {editing && (
                    <p className="-mt-1 text-xs leading-5 text-white/40">
                      El email no se edita desde este formulario. Para eso conviene usar un flujo
                      separado.
                    </p>
                  )}

                  {!editing && (
                    <FieldBlock label="Contraseña">
                      <input
                        type="password"
                        value={form.password}
                        onChange={(e) => updateForm("password", e.target.value)}
                        placeholder="Mínimo 6 caracteres"
                        className="h-12 w-full rounded-2xl border border-white/10 bg-[rgba(255,255,255,0.03)] px-4 text-sm text-white outline-none transition placeholder:text-white/28 focus:border-[#db9700]/45 focus:bg-[rgba(255,255,255,0.05)]"
                      />
                    </FieldBlock>
                  )}

                  <FieldBlock label="Nombre">
                    <input
                      value={form.nombre}
                      onChange={(e) => updateForm("nombre", e.target.value)}
                      placeholder="Nombre completo"
                      className="h-12 w-full rounded-2xl border border-white/10 bg-[rgba(255,255,255,0.03)] px-4 text-sm text-white outline-none transition placeholder:text-white/28 focus:border-[#db9700]/45 focus:bg-[rgba(255,255,255,0.05)]"
                    />
                  </FieldBlock>

                  <FieldBlock label="Teléfono">
                    <input
                      value={form.telefono}
                      onChange={(e) => updateForm("telefono", e.target.value)}
                      placeholder="443..."
                      className="h-12 w-full rounded-2xl border border-white/10 bg-[rgba(255,255,255,0.03)] px-4 text-sm text-white outline-none transition placeholder:text-white/28 focus:border-[#db9700]/45 focus:bg-[rgba(255,255,255,0.05)]"
                    />
                  </FieldBlock>

                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <FieldBlock label="Rol">
                      <select
                        value={form.rol}
                        onChange={(e) => updateForm("rol", e.target.value as UserRole)}
                        className="h-12 w-full rounded-2xl border border-white/10 bg-[rgba(255,255,255,0.03)] px-4 text-sm text-white outline-none transition focus:border-[#db9700]/45 focus:bg-[rgba(255,255,255,0.05)]"
                      >
                        <option value="admin">Admin</option>
                        <option value="tecnico">Técnico</option>
                      </select>
                    </FieldBlock>

                    <FieldBlock label="Estado">
                      <select
                        value={form.estado}
                        onChange={(e) => updateForm("estado", e.target.value as UserStatus)}
                        className="h-12 w-full rounded-2xl border border-white/10 bg-[rgba(255,255,255,0.03)] px-4 text-sm text-white outline-none transition focus:border-[#db9700]/45 focus:bg-[rgba(255,255,255,0.05)]"
                      >
                        <option value="activo">Activo</option>
                        <option value="inactivo">Inactivo</option>
                      </select>
                    </FieldBlock>
                  </div>
                </div>

                <div className="sticky bottom-0 border-t border-white/10 bg-[#0b0b0b]/95 px-5 py-4 backdrop-blur sm:px-6">
                  <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
                    <button
                      type="button"
                      onClick={closeModal}
                      className="h-12 rounded-2xl border border-white/10 bg-[rgba(255,255,255,0.04)] px-5 text-sm font-medium text-white transition hover:border-white/20 hover:bg-[rgba(255,255,255,0.06)]"
                    >
                      Cancelar
                    </button>

                    <button
                      type="submit"
                      disabled={saving}
                      className="h-12 rounded-2xl border border-[#db9700]/20 bg-[#db9700] px-5 text-sm font-semibold text-black transition hover:bg-[#efaa0b] disabled:opacity-70"
                    >
                      {saving ? "Guardando..." : editing ? "Guardar cambios" : "Crear usuario"}
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </AppShell>
  );
}

function FieldBlock(props: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="mb-2 block text-sm font-medium text-white/72">{props.label}</label>
      {props.children}
    </div>
  );
}

function StatCard(props: { label: string; value: number }) {
  return (
    <div className="rounded-[22px] border border-white/10 bg-[rgba(255,255,255,0.03)] px-4 py-4">
      <div className="text-[11px] uppercase tracking-[0.16em] text-white/38">{props.label}</div>
      <div className="mt-2 text-2xl font-semibold text-white">{props.value}</div>
    </div>
  );
}

function InfoRow(props: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between gap-4">
      <span className="text-xs uppercase tracking-[0.12em] text-white/35">{props.label}</span>
      <div className="text-right">{props.children}</div>
    </div>
  );
}

function RoleBadge({ role }: { role: UserRole }) {
  return (
    <span
      className={[
        "inline-flex rounded-full px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.08em]",
        role === "admin"
          ? "border border-sky-500/20 bg-sky-500/10 text-sky-300"
          : "border border-violet-500/20 bg-violet-500/10 text-violet-300",
      ].join(" ")}
    >
      {role}
    </span>
  );
}

function StatusBadge({ status }: { status: UserStatus }) {
  return (
    <span
      className={[
        "inline-flex rounded-full px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.08em]",
        status === "activo"
          ? "border border-emerald-500/20 bg-emerald-500/10 text-emerald-300"
          : "border border-white/10 bg-white/5 text-white/70",
      ].join(" ")}
    >
      {status}
    </span>
  );
}

function CloseIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5 fill-none stroke-current stroke-[1.8]">
      <path d="M6 6l12 12M18 6L6 18" strokeLinecap="round" />
    </svg>
  );
}