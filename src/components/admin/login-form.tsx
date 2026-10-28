"use client";

import { useActionState, useState } from "react";
import { AlertCircle, Eye, EyeOff, LockKeyhole } from "lucide-react";
import { loginAction } from "@/app/actions/auth";
import { IDLE_ACTION_STATE } from "@/types/action-state";
import { Button } from "@/components/ui/button";
import { FormField } from "@/components/ui/form-field";
import { Input } from "@/components/ui/input";

export function LoginForm({
  next,
  demo,
  demoEmail,
  demoPassword,
}: {
  next: string;
  demo: boolean;
  demoEmail?: string;
  demoPassword?: string;
}) {
  const [state, formAction, pending] = useActionState(loginAction, IDLE_ACTION_STATE);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  return (
    <form action={formAction} className="mt-8">
      <input type="hidden" name="next" value={next} />

      {state.status === "error" && state.message ? (
        <div
          role="alert"
          className="mb-5 flex items-start gap-2.5 rounded-sm border border-error/20 bg-error/5 px-4 py-3 text-xs leading-relaxed text-error"
        >
          <AlertCircle className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
          {state.message}
        </div>
      ) : null}

      <div className="space-y-5">
        <FormField id="email" label="Email" required error={state.fields?.email?.[0]}>
          <Input
            id="email"
            name="email"
            type="email"
            autoComplete="username"
            inputMode="email"
            placeholder="nama@email.com"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            aria-invalid={Boolean(state.fields?.email)}
            aria-describedby={state.fields?.email ? "email-error" : undefined}
            required
          />
        </FormField>

        <FormField id="password" label="Password" required error={state.fields?.password?.[0]}>
          <div className="relative">
            <Input
              id="password"
              name="password"
              type={showPassword ? "text" : "password"}
              autoComplete="current-password"
              placeholder="Minimal 8 karakter"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              aria-invalid={Boolean(state.fields?.password)}
              aria-describedby={state.fields?.password ? "password-error" : undefined}
              className="pr-12"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword((visible) => !visible)}
              className="absolute right-1 top-1/2 flex size-10 -translate-y-1/2 items-center justify-center rounded-full text-text-secondary transition-colors hover:bg-surface-muted hover:text-text-primary"
              aria-label={showPassword ? "Sembunyikan password" : "Tampilkan password"}
            >
              {showPassword ? (
                <EyeOff className="size-4" aria-hidden="true" />
              ) : (
                <Eye className="size-4" aria-hidden="true" />
              )}
            </button>
          </div>
        </FormField>
      </div>

      <Button type="submit" size="lg" fullWidth loading={pending} className="mt-6">
        <LockKeyhole className="size-4" aria-hidden="true" />
        Masuk
      </Button>

      {demo && demoEmail && demoPassword ? (
        <div className="mt-6 rounded-sm border border-border bg-surface-muted/55 p-4">
          <div className="flex items-center justify-between gap-3">
            <p className="type-mono text-[9px] uppercase tracking-[0.12em] text-primary">
              Mode demo lokal
            </p>
            <button
              type="button"
              onClick={() => {
                setEmail(demoEmail);
                setPassword(demoPassword);
              }}
              className="text-[11px] font-bold text-primary underline underline-offset-4"
            >
              Isi otomatis
            </button>
          </div>
          <div className="mt-3 space-y-1.5 font-mono text-[10px] text-text-secondary">
            <p>
              <span className="text-text-primary">Email:</span> {demoEmail}
            </p>
            <p>
              <span className="text-text-primary">Password:</span> {demoPassword}
            </p>
          </div>
            <p className="mt-3 text-[10px] leading-relaxed text-text-secondary">
              Kredensial ini hanya muncul saat mode demo aktif. Jangan aktifkan di produksi.
            </p>
        </div>
      ) : null}

    </form>
  );
}
