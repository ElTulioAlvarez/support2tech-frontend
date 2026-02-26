import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../app/providers/AuthProvider";
import logo from "../../assets/b2park-logo.png";

export function LoginPage() {
  const nav = useNavigate();
  const { login } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPwd, setShowPwd] = useState(false);

  const [err, setErr] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const emailTrim = useMemo(() => email.trim(), [email]);

  const canSubmit = useMemo(() => {
    if (!emailTrim) return false;
    if (!password) return false;
    if (!emailTrim.includes("@") || !emailTrim.includes(".")) return false;
    return true;
  }, [emailTrim, password]);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!canSubmit || loading) return;

    setErr(null);
    setLoading(true);
    try {
      await login(emailTrim, password);
      nav("/", { replace: true });
    } catch (e: any) {
      setErr(e?.message ?? "No se pudo iniciar sesión");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="relative w-screen min-h-[100dvh] text-white">
      {/* Fondo */}
      <div className="fixed inset-0 -z-10 bg-[#07090D] overflow-hidden">
        <div className="absolute -top-40 left-1/2 h-[520px] w-[520px] -translate-x-1/2 rounded-full bg-[#F59E0B]/16 blur-[90px]" />
        <div className="absolute top-24 -left-40 h-[520px] w-[520px] rounded-full bg-white/4 blur-[90px]" />

        <div
          className="absolute inset-0 opacity-[0.08]"
          style={{
            backgroundImage:
              "linear-gradient(to right, rgba(255,255,255,0.35) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.35) 1px, transparent 1px)",
            backgroundSize: "40px 40px",
          }}
        />

        <div className="absolute inset-0 bg-gradient-to-b from-black/0 via-black/20 to-black/60" />
      </div>

      <div className="mx-auto flex min-h-[100dvh] w-full max-w-6xl items-center justify-center px-4 py-10">
        <div className="grid w-full grid-cols-1 gap-6 lg:grid-cols-[1fr_420px] lg:items-stretch">
          {/* Panel izquierdo (desktop) */}
          <div className="hidden lg:flex flex-col justify-between overflow-hidden rounded-3xl border border-white/10 bg-white/[0.03] p-10">
            {/* Accent bar */}
            <div className="h-[3px] w-full rounded-full bg-gradient-to-r from-[#F59E0B]/90 via-[#F59E0B]/35 to-transparent" />

            {/* ✅ Logo centrado + que abarque el panel */}
            <div className="mt-10 flex w-full items-center justify-center">
              <div className="w-full rounded-2xl border border-white/10 bg-black/25 px-10 py-10 shadow-xl shadow-black/40">
                <div className="flex w-full items-center justify-center">
                  <img
                    src={logo}
                    alt="B2Park"
                    className="h-28 w-auto select-none"
                    draggable={false}
                  />
                </div>
              </div>
            </div>

            <div className="text-xs text-white/40">
              © {new Date().getFullYear()} B2Park — Parking to Business
            </div>
          </div>

          {/* Login */}
          <div className="flex items-center justify-center">
            <div className="w-full max-w-md">
              {/* Logo móvil */}
              <div className="lg:hidden mb-6 flex items-center justify-center">
                <div className="w-full rounded-3xl border border-white/10 bg-white/[0.03] p-5">
                  <div className="h-[3px] w-full rounded-full bg-gradient-to-r from-[#F59E0B]/90 via-[#F59E0B]/35 to-transparent" />

                  <div className="mt-5 flex items-center justify-center">
                    <div className="rounded-2xl border border-white/10 bg-black/25 px-7 py-5 shadow-xl shadow-black/40">
                      <img
                        src={logo}
                        alt="B2Park"
                        className="h-16 w-auto select-none"
                        draggable={false}
                      />
                    </div>
                  </div>
                </div>
              </div>

              <form
                onSubmit={onSubmit}
                className="rounded-3xl border border-white/10 bg-white/[0.04] p-6 sm:p-8 shadow-2xl shadow-black/40"
              >
                <div className="space-y-1">
                  <h2 className="text-2xl font-semibold tracking-tight">
                    Iniciar sesión
                  </h2>
                </div>

                <div className="mt-7 space-y-4">
                  <div className="space-y-2">
                    <div className="relative">
                      <input
                        className="w-full rounded-xl border border-white/10 bg-black/30 px-4 py-3 text-white placeholder:text-white/30 outline-none transition focus:border-[#F59E0B]/50 focus:ring-2 focus:ring-[#F59E0B]/20"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        autoComplete="email"
                        placeholder="nombre@empresa.com"
                        inputMode="email"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm text-white/80">Contraseña</label>
                    <div className="relative">
                      <input
                        className="w-full rounded-xl border border-white/10 bg-black/30 px-4 py-3 pr-16 text-white placeholder:text-white/30 outline-none transition focus:border-[#F59E0B]/50 focus:ring-2 focus:ring-[#F59E0B]/20"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        type={showPwd ? "text" : "password"}
                        autoComplete="current-password"
                        placeholder="••••••••"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPwd((v) => !v)}
                        className="absolute inset-y-0 right-2 my-2 rounded-lg border border-white/10 bg-white/[0.06] px-3 text-xs text-white/80 transition hover:bg-white/[0.10]"
                        aria-label={
                          showPwd ? "Ocultar contraseña" : "Mostrar contraseña"
                        }
                      >
                        {showPwd ? "Ocultar" : "Ver"}
                      </button>
                    </div>
                  </div>

                  {err && (
                    <div className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-200">
                      {err}
                    </div>
                  )}

                  <button
                    className="group relative w-full overflow-hidden rounded-xl bg-[#db9000] px-4 py-3 font-semibold text-black transition hover:bg-[#c98200] disabled:cursor-not-allowed disabled:opacity-60"
                    disabled={!canSubmit || loading}
                    type="submit"
                  >
                    <span className="relative z-10">
                      {loading ? "Entrando..." : "Entrar"}
                    </span>
                    <span className="absolute inset-0 opacity-0 transition group-hover:opacity-100">
                      <span className="absolute -left-20 top-0 h-full w-40 rotate-12 bg-white/25 blur-md" />
                    </span>
                  </button>

                  <div className="flex items-center justify-between pt-2">
                    <span className="text-xs text-white/40">
                      Acceso restringido por rol.
                    </span>
                    <span className="text-xs text-white/40">
                      Soporte: TI / Admin
                    </span>
                  </div>
                </div>
              </form>

              <div className="mt-6 text-center text-xs text-white/30 lg:hidden">
                © {new Date().getFullYear()} B2Park — Parking to Business
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
