"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowRight, Eye, EyeOff, Loader2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import {
  registerSchema,
  type RegisterInput,
} from "@/lib/validations/auth";
import type { ApiResponse } from "@/types/api";

type RegisteredUser = {
  id: string;
  name: string;
  email: string;
};

export default function RegisterPage() {
  const router = useRouter();

  const [serverError, setServerError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const {
    register,
    handleSubmit,
    setError,
    formState: {
      errors,
      isSubmitting,
    },
  } = useForm<RegisterInput>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = async (data: RegisterInput) => {
    setServerError("");

    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      const result =
        (await response.json()) as ApiResponse<RegisteredUser>;

      if (!response.ok || !result.success) {
        if (result.errors) {
            const registerFields: Array<keyof RegisterInput> = [
                "name",
                "email",
                "password",
                "confirmPassword",
                ];
            Object.entries(result.errors).forEach(
                ([field, messages]) => {
                    const message = messages?.[0];

                    if (
                        message &&
                        registerFields.includes(field as keyof RegisterInput)
                    ) {
                        setError(
                            field as keyof RegisterInput,
                                {
                                    type: "server",
                                    message,
                                }
                        );
                    }
                }
          );
        }

        setServerError(
          result.message || "Unable to create your account."
        );

        return;
      }

      router.push("/login?registered=true");
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
          Create your account
        </h1>

        <p className="mt-2 text-sm leading-6 text-slate-400">
          Start building a personalized path toward your
          career goals.
        </p>
      </div>

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
            htmlFor="name"
            className="mb-2 block text-sm font-medium text-slate-200"
          >
            Name
          </label>

          <input
            id="name"
            type="text"
            autoComplete="name"
            placeholder="John Doe"
            disabled={isSubmitting}
            {...register("name")}
            className="w-full rounded-xl border border-white/10 bg-slate-950/70 px-4 py-3 text-white outline-none transition placeholder:text-slate-600 focus:border-violet-400 focus:ring-2 focus:ring-violet-400/20 disabled:cursor-not-allowed disabled:opacity-60"
          />

          {errors.name && (
            <p className="mt-2 text-sm text-red-400">
              {errors.name.message}
            </p>
          )}
        </div>

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
          <label
            htmlFor="password"
            className="mb-2 block text-sm font-medium text-slate-200"
          >
            Password
          </label>

          <div className="relative">
            <input
              id="password"
              type={showPassword ? "text" : "password"}
              autoComplete="new-password"
              placeholder="At least 8 characters"
              disabled={isSubmitting}
              {...register("password")}
              className="w-full rounded-xl border border-white/10 bg-slate-950/70 px-4 py-3 pr-12 text-white outline-none transition placeholder:text-slate-600 focus:border-violet-400 focus:ring-2 focus:ring-violet-400/20 disabled:cursor-not-allowed disabled:opacity-60"
            />

            <button
              type="button"
              onClick={() =>
                setShowPassword((current) => !current)
              }
              className="absolute right-3 top-1/2 -translate-y-1/2 rounded-lg p-1.5 text-slate-400 transition hover:bg-white/10 hover:text-white"
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

        <div>
          <label
            htmlFor="confirmPassword"
            className="mb-2 block text-sm font-medium text-slate-200"
          >
            Confirm password
          </label>

          <div className="relative">
            <input
              id="confirmPassword"
              type={
                showConfirmPassword ? "text" : "password"
              }
              autoComplete="new-password"
              placeholder="Enter your password again"
              disabled={isSubmitting}
              {...register("confirmPassword")}
              className="w-full rounded-xl border border-white/10 bg-slate-950/70 px-4 py-3 pr-12 text-white outline-none transition placeholder:text-slate-600 focus:border-violet-400 focus:ring-2 focus:ring-violet-400/20 disabled:cursor-not-allowed disabled:opacity-60"
            />

            <button
              type="button"
              onClick={() =>
                setShowConfirmPassword(
                  (current) => !current
                )
              }
              className="absolute right-3 top-1/2 -translate-y-1/2 rounded-lg p-1.5 text-slate-400 transition hover:bg-white/10 hover:text-white"
              aria-label={
                showConfirmPassword
                  ? "Hide confirmed password"
                  : "Show confirmed password"
              }
            >
              {showConfirmPassword ? (
                <EyeOff size={18} />
              ) : (
                <Eye size={18} />
              )}
            </button>
          </div>

          {errors.confirmPassword && (
            <p className="mt-2 text-sm text-red-400">
              {errors.confirmPassword.message}
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
              Creating account...
            </>
          ) : (
            <>
              Create account
              <ArrowRight size={18} />
            </>
          )}
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-slate-400">
        Already have an account?{" "}
        <Link
          href="/login"
          className="font-semibold text-violet-400 transition hover:text-violet-300"
        >
          Log in
        </Link>
      </p>
    </>
  );
}