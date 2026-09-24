import { useState } from 'react';
import { useNavigate } from 'react-router';
import {
  ArrowRight,
  Check,
  Eye,
  EyeOff,
  Layers3,
  LockKeyhole,
  Mail,
  MessageSquare,
  Sparkles,
  Users,
} from 'lucide-react';

export default function Login() {
  // Controla únicamente la visibilidad del campo de contraseña.
  const [mostrarClave, setMostrarClave] = useState(false);
  // Coincide con la selección de repositorios en vite.config.ts.
  const esDemo = import.meta.env.VITE_DATA_SOURCE !== 'api';
  const navigate = useNavigate();

  // El acceso actual navega al CRM; no hay autenticación conectada todavía.
  function entrarAlDashboard() {
    navigate('/dashboard');
  }

  return (
    <main className="grid min-h-dvh bg-background text-foreground lg:grid-cols-2">
      {/* Hero: grafito y coral, independiente del tema del formulario. */}
      <section
        className="dark-main relative isolate flex flex-col overflow-hidden px-6 py-8 sm:px-12 lg:min-h-dvh lg:px-14 lg:py-10 xl:px-20"
        aria-labelledby="login-hero"
      >
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -left-32 top-1/3 -z-10 h-96 w-96 rounded-full border border-accent/15"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -left-48 top-1/3 -z-10 h-128 w-lg rounded-full border border-accent/10"
        />

        <div className="flex items-center gap-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent text-on-accent">
            <Layers3 size={21} aria-hidden="true" />
          </span>
          <span className="text-lg font-semibold tracking-tight">
            evolution
            <span className="ml-2 text-xs font-normal tracking-widest text-muted">
              CRM
            </span>
          </span>
        </div>

        <div className="mx-auto w-full max-w-lg flex-1 py-12 lg:flex lg:flex-col lg:justify-center lg:py-16">
          <p className="mb-5 flex items-center gap-2 text-xs font-medium uppercase tracking-[0.18em] text-accent">
            <Sparkles size={15} aria-hidden="true" /> Menos ruido. Más conexión.
          </p>
          <h1
            id="login-hero"
            className="max-w-md text-4xl leading-[1.08] font-extrabold tracking-tight sm:text-5xl xl:text-6xl"
          >
            Las buenas relaciones{' '}
            <span className="text-accent">empiezan aquí.</span>
          </h1>
          <p className="mt-6 max-w-sm text-sm leading-7 text-muted">
            Un espacio para conocer a tus clientes, dar continuidad a cada
            conversación y convertir los pendientes en próximos pasos.
          </p>

          {/* Composición decorativa del CRM: no representa datos reales. */}
          <div
            aria-hidden="true"
            className="relative mt-10 hidden pb-6 pr-5 sm:block"
          >
            <div className="rounded-2xl border border-border bg-panel p-5 shadow-xl shadow-black/10">
              <div className="mb-6 flex items-center justify-between">
                <span className="text-xs font-medium">Todo conectado</span>
                <span className="flex items-center gap-1.5 text-[10px] text-accent">
                  <span className="h-1.5 w-1.5 rounded-full bg-accent" /> Tu
                  espacio, en orden
                </span>
              </div>
              <div className="flex items-center gap-3">
                <span className="flex h-11 w-11 items-center justify-center rounded-full bg-accent-soft text-sm font-semibold text-accent">
                  CR
                </span>
                <div>
                  <p className="text-sm font-medium">Camila Rojas</p>
                  <p className="mt-1 text-xs text-muted">
                    Una relación que sigue creciendo
                  </p>
                </div>
              </div>
              <div className="ml-5 mt-4 space-y-4 border-l border-border py-1 pl-8">
                <div className="flex items-center gap-3">
                  <MessageSquare size={15} className="text-accent" />
                  <p className="text-xs text-muted">
                    Una conversación con contexto
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <Check size={15} className="text-accent" />
                  <p className="text-xs text-muted">Un próximo paso definido</p>
                </div>
              </div>
            </div>
            <div className="absolute right-0 bottom-0 flex items-center gap-3 rounded-xl border border-border bg-background px-4 py-3 shadow-lg shadow-black/10">
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-accent-soft text-accent">
                <Users size={16} />
              </span>
              <span className="text-xs font-medium">
                Personas antes que números.
              </span>
            </div>
          </div>
        </div>
        <p className="text-xs text-muted">
          Clientes · Conversaciones · Próximos pasos
        </p>
      </section>

      {/* Formulario: vainilla y jade; sin conexión de autenticación. */}
      <section
        className="flex flex-col px-6 py-10 sm:px-12 lg:px-14 xl:px-20"
        aria-labelledby="login-titulo"
      >
        <div className="mx-auto flex w-full max-w-md flex-1 flex-col justify-center py-6 lg:py-12">
          <span className="mb-7 flex h-12 w-12 items-center justify-center rounded-2xl border border-border bg-panel text-accent">
            <LockKeyhole size={22} aria-hidden="true" />
          </span>
          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.18em] text-accent">
            Qué bueno tenerte aquí
          </p>
          <h2
            id="login-titulo"
            className="text-3xl font-extrabold tracking-tight sm:text-4xl"
          >
            {esDemo ? 'Explora CRM Evolution' : 'Inicia sesión'}
          </h2>
          <p className="mt-3 text-sm leading-6 text-muted">
            {esDemo
              ? 'Conoce un espacio para organizar clientes, conversaciones y tareas.'
              : 'Retoma tus conversaciones y sigue construyendo relaciones.'}
          </p>

          {/* Acceso directo a la demo o formulario de la versión API. */}
          {esDemo ? (
            <div className="mt-8 space-y-5">
              <div className="rounded-2xl border border-border bg-accent-soft p-5">
                <p className="text-sm font-semibold text-accent">
                  Estás en la versión demo
                </p>
                <p className="mt-2 text-sm leading-6 text-foreground">
                  Puedes acceder directamente y explorar el CRM con datos de
                  ejemplo. No necesitas una cuenta, correo ni contraseña.
                </p>
              </div>
              <button
                type="button"
                onClick={entrarAlDashboard}
                className="flex w-full items-center justify-center gap-3 rounded-xl bg-accent px-4 py-3.5 text-sm font-semibold text-on-accent transition-colors hover:bg-accent/90"
              >
                Entrar a la demo <ArrowRight size={18} aria-hidden="true" />
              </button>
            </div>
          ) : (
            <>
              {/* Acceso con proveedor de correo, aún no conectado. */}
              <button
                type="button"
                aria-disabled="true"
                aria-describedby="gmail-aviso"
                className="mt-8 flex w-full cursor-default items-center justify-center gap-3 rounded-xl border border-border bg-panel px-4 py-3.5 text-sm font-medium"
              >
                <Mail size={19} className="text-accent" aria-hidden="true" />{' '}
                Continuar con Gmail
              </button>
              <p
                id="gmail-aviso"
                className="mt-2 text-center text-xs text-muted"
              >
                Próximamente
              </p>

              <div className="my-6 flex items-center gap-4" aria-hidden="true">
                <span className="h-px flex-1 bg-border" />
                <span className="text-xs text-muted">o usa tu correo</span>
                <span className="h-px flex-1 bg-border" />
              </div>

              {/* Campos de acceso de la versión API. */}
              <form
                className="space-y-5"
                onSubmit={(event) => {
                  event.preventDefault();
                  entrarAlDashboard();
                }}
              >
                <div>
                  <label
                    htmlFor="login-email"
                    className="mb-2 block text-sm font-medium"
                  >
                    Correo electrónico
                  </label>
                  <div className="flex items-center gap-3 rounded-xl border border-border bg-panel px-4 focus-within:border-accent focus-within:ring-1 focus-within:ring-accent">
                    <Mail
                      size={18}
                      className="shrink-0 text-muted"
                      aria-hidden="true"
                    />
                    <input
                      id="login-email"
                      name="email"
                      type="email"
                      autoComplete="username"
                      required
                      placeholder="tu@empresa.com"
                      className="min-w-0 flex-1 bg-transparent py-3.5 text-sm outline-none placeholder:text-muted"
                    />
                  </div>
                </div>
                <div>
                  <label
                    htmlFor="login-password"
                    className="mb-2 block text-sm font-medium"
                  >
                    Contraseña
                  </label>
                  <div className="flex items-center gap-3 rounded-xl border border-border bg-panel px-4 focus-within:border-accent focus-within:ring-1 focus-within:ring-accent">
                    <LockKeyhole
                      size={18}
                      className="shrink-0 text-muted"
                      aria-hidden="true"
                    />
                    <input
                      id="login-password"
                      name="password"
                      type={mostrarClave ? 'text' : 'password'}
                      autoComplete="current-password"
                      required
                      placeholder="Tu contraseña"
                      className="min-w-0 flex-1 bg-transparent py-3.5 text-sm outline-none placeholder:text-muted"
                    />
                    <button
                      type="button"
                      onClick={() => setMostrarClave((actual) => !actual)}
                      aria-label={
                        mostrarClave
                          ? 'Ocultar contraseña'
                          : 'Mostrar contraseña'
                      }
                      aria-controls="login-password"
                      aria-pressed={mostrarClave}
                      className="-mr-2 flex h-10 w-10 shrink-0 items-center justify-center rounded-lg text-muted hover:bg-subtle hover:text-foreground"
                    >
                      {mostrarClave ? (
                        <EyeOff size={18} aria-hidden="true" />
                      ) : (
                        <Eye size={18} aria-hidden="true" />
                      )}
                    </button>
                  </div>
                </div>
                <button
                  type="submit"
                  className="flex w-full items-center justify-center gap-3 rounded-xl bg-accent px-4 py-3.5 text-sm font-semibold text-on-accent transition-colors hover:bg-accent/90"
                >
                  Iniciar sesión <ArrowRight size={18} aria-hidden="true" />
                </button>
              </form>
            </>
          )}
        </div>
        <p className="mx-auto max-w-md text-center text-xs leading-5 text-muted">
          Un lugar para cuidar cada relación.
        </p>
      </section>
    </main>
  );
}
