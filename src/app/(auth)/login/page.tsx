"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import {
  ArrowRight,
  CheckCircle2,
  Eye,
  EyeOff,
  Loader2,
} from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";

import {
  loginSchema,
  type LoginInput,
} from "@/lib/validations/auth";
import type { ApiResponse } from "@/types/api";

type LoggedInUser = {
  id: string;
  name: string;
  email: string;
  globalXp: number;
  activeCareerProfileId: string | null;
};

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const registered = searchParams.get("registered") === "true";
  const passwordReset =
    searchParams.get("passwordReset") === "true";

  const [serverError, setServerError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    setError,
    formState: {
      errors,
      isSubmitting,
    },
  } = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: LoginInput) => {
    setServerError("");

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      const result =
        (await response.json()) as ApiResponse<LoggedInUser>;

      if (!response.ok || !result.success) {
        if (result.errors) {
          const loginFields: Array<keyof LoginInput> = [
            "email",
            "password",
          ];

          Object.entries(result.errors).forEach(
            ([field, messages]) => {
              const message = messages?.[0];

              if (
                message &&
                loginFields.includes(field as keyof LoginInput)
              ) {
                setError(field as keyof LoginInput, {
                  type: "server",
                  message,
                });
              }
            }
          );
        }

        setServerError(
          result.message || "Unable to log in."
        );

        return;
      }

      if (!result.user) {
        setServerError(
          "Login succeeded, but the user data was missing."
        );
        return;
      }

      if (result.user.activeCareerProfileId) {
        router.push("/dashboard");
      } else {
        router.push("/onboarding");
      }

      router.refresh();
    } catch {
      setServerError(
        "Unable to connect to SkillBuilder. Please try again."
      );
    }
  };

  return (
    <>
      <div className="text-center">
        <h1 className="text-2xl font-bold sm:text-3xl">
          Welcome back
        </h1>

        <p className="mt-2 text-sm leading-6 text-slate-400">
          Log in to continue building your career path.
        </p>
      </div>

      {registered && (
        <div
          role="status"
          className="mt-6 flex items-start gap-3 rounded-xl border border-emerald-400/20 bg-emerald-400/10 px-4 py-3 text-sm text-emerald-300"
        >
          <CheckCircle2
            size={18}
            className="mt-0.5 shrink-0"
          />

          <p>
            Your account was created successfully. You can
            now log in.
          </p>
        </div>
      )}

      {passwordReset && (
        <div
          role="status"
          className="mt-6 flex items-start gap-3 rounded-xl border border-emerald-400/20 bg-emerald-400/10 px-4 py-3 text-sm text-emerald-300"
        >
          <CheckCircle2
            size={18}
            className="mt-0.5 shrink-0"
          />

          <p>
            Your password was reset successfully. Log in
            using your new password.
          </p>
        </div>
      )}

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="mt-8 space-y-5"
        noValidate
      >
        {serverError && (
          <div
            role="alert"
            className="rounded-xl border border-red-400/20 bg-red-400/10 px-4 py-3 text-sm text-red-300"
          >
            {serverError}
          </div>
        )}

        <div>
          <label
            htmlFor="email"
            className="mb-2 block text-sm font-medium text-slate-200"
          >
            Email
          </label>

          <input
            id="email"
            type="email"
            autoComplete="email"
            placeholder="john@example.com"
            disabled={isSubmitting}
            {...register("email")}
            className="w-full rounded-xl border border-white/10 bg-slate-950/70 px-4 py-3 text-white outline-none transition placeholder:text-slate-600 focus:border-violet-400 focus:ring-2 focus:ring-violet-400/20 disabled:cursor-not-allowed disabled:opacity-60"
          />

          {errors.email && (
            <p className="mt-2 text-sm text-red-400">
              {errors.email.message}
            </p>
          )}
        </div>

        <div>
          <div className="mb-2 flex items-center justify-between gap-4">
            <label
              htmlFor="password"
              className="text-sm font-medium text-slate-200"
            >
              Password
            </label>

            <Link
              href="/forgot-password"
              className="text-sm font-medium text-violet-400 transition hover:text-violet-300"
            >
              Forgot password?
            </Link>
          </div>

          <div className="relative">
            <input
              id="password"
              type={showPassword ? "text" : "password"}
              autoComplete="current-password"
              placeholder="Enter your password"
              disabled={isSubmitting}
              {...register("password")}
              className="w-full rounded-xl border border-white/10 bg-slate-950/70 px-4 py-3 pr-12 text-white outline-none transition placeholder:text-slate-600 focus:border-violet-400 focus:ring-2 focus:ring-violet-400/20 disabled:cursor-not-allowed disabled:opacity-60"
            />

            <button
              type="button"
              onClick={() =>
                setShowPassword((current) => !current)
              }
              disabled={isSubmitting}
              className="absolute right-3 top-1/2 -translate-y-1/2 rounded-lg p-1.5 text-slate-400 transition hover:bg-white/10 hover:text-white disabled:cursor-not-allowed disabled:opacity-60"
              aria-label={
                showPassword
                  ? "Hide password"
                  : "Show password"
              }
            >
              {showPassword ? (
                <EyeOff size={18} />
              ) : (
                <Eye size={18} />
              )}
            </button>
          </div>

          {errors.password && (
            <p className="mt-2 text-sm text-red-400">
              {errors.password.message}
            </p>
          )}
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-violet-500 px-5 py-3 font-semibold text-white transition hover:bg-violet-400 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isSubmitting ? (
            <>
              <Loader2
                size={18}
                className="animate-spin"
              />
              Logging in...
            </>
          ) : (
            <>
              Log in
              <ArrowRight size={18} />
            </>
          )}
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-slate-400">
        Don&apos;t have an account?{" "}
        <Link
          href="/register"
          className="font-semibold text-violet-400 transition hover:text-violet-300"
        >
          Create an account
        </Link>
      </p>
    </>
  );
}