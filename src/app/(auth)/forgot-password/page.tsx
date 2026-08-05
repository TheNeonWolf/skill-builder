"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  ArrowLeft,
  CheckCircle2,
  Loader2,
  Mail,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { useForm } from "react-hook-form";
import {
  forgotPasswordSchema,
  type ForgotPasswordInput,
} from "@/lib/validations/auth";
import type { ApiResponse } from "@/types/api";

export default function ForgotPasswordPage() {
  const [serverError, setServerError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const {
    register,
    handleSubmit,
    setError,
    formState: {
      errors,
      isSubmitting,
    },
  } = useForm<ForgotPasswordInput>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: "",
    },
  });

  const onSubmit = async (data: ForgotPasswordInput) => {
    setServerError("");
    setSuccessMessage("");

    try {
      const response = await fetch(
        "/api/auth/forgot-password",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        }
      );

      const result =
        (await response.json()) as ApiResponse;

      if (!response.ok || !result.success) {
        const emailError = result.errors?.email?.[0];

        if (emailError) {
          setError("email", {
            type: "server",
            message: emailError,
          });
        }

        setServerError(
          result.message ||
            "Unable to send the password-reset email."
        );

        return;
      }

      setSuccessMessage(
        result.message ??
          "If an account exists for that email, a reset link has been sent."
      );
    } catch {
      setServerError(
        "Unable to connect to SkillBuilder. Please try again."
      );
    }
  };

  if (successMessage) {
    return (
      <div className="text-center">
        <div className="mx-auto flex size-14 items-center justify-center rounded-full bg-emerald-400/10 text-emerald-300">
          <CheckCircle2 size={28} />
        </div>

        <h1 className="mt-5 text-2xl font-bold sm:text-3xl">
          Check your inbox
        </h1>

        <p className="mt-3 text-sm leading-6 text-slate-400">
          {successMessage}
        </p>

        <p className="mt-3 text-sm leading-6 text-slate-500">
          During development, the email will appear inside
          your Mailtrap inbox.
        </p>

        <button
          type="button"
          onClick={() => setSuccessMessage("")}
          className="mt-6 text-sm font-semibold text-violet-400 transition hover:text-violet-300"
        >
          Try another email
        </button>

        <Link
          href="/login"
          className="mt-6 flex items-center justify-center gap-2 text-sm font-medium text-slate-400 transition hover:text-white"
        >
          <ArrowLeft size={16} />
          Back to login
        </Link>
      </div>
    );
  }

  return (
    <>
      <div className="text-center">
        <div className="mx-auto flex size-14 items-center justify-center rounded-full bg-violet-400/10 text-violet-300">
          <Mail size={26} />
        </div>

        <h1 className="mt-5 text-2xl font-bold sm:text-3xl">
          Forgot your password?
        </h1>

        <p className="mt-2 text-sm leading-6 text-slate-400">
          Enter your email and we&apos;ll send you a secure
          password-reset link.
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
            htmlFor="email"
            className="mb-2 block text-sm font-medium text-slate-200"
          >
            Email address
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
              Sending reset link...
            </>
          ) : (
            <>
              <Mail size={18} />
              Send reset link
            </>
          )}
        </button>
      </form>

      <Link
        href="/login"
        className="mt-6 flex items-center justify-center gap-2 text-sm font-medium text-slate-400 transition hover:text-white"
      >
        <ArrowLeft size={16} />
        Back to login
      </Link>
    </>
  );
}