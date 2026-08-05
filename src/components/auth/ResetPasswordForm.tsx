"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import {
  CheckCircle2,
  Eye,
  EyeOff,
  Loader2,
  LockKeyhole,
} from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";

import {
  resetPasswordFormSchema,
  type ResetPasswordFormInput,
} from "@/lib/validations/auth";
import type { ApiResponse } from "@/types/api";

export default function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const token = searchParams.get("token") ?? "";

  const [serverError, setServerError] = useState("");
  const [resetSuccessful, setResetSuccessful] =
    useState(false);
  const [showNewPassword, setShowNewPassword] =
    useState(false);
  const [
    showConfirmNewPassword,
    setShowConfirmNewPassword,
  ] = useState(false);

  const {
    register,
    handleSubmit,
    setError,
    formState: {
      errors,
      isSubmitting,
    },
  } = useForm<ResetPasswordFormInput>({
          resolver: zodResolver(resetPasswordFormSchema),
          defaultValues: {
              newPassword: "",
              confirmNewPassword: "",
          },
      });

  const onSubmit = async (
    data: ResetPasswordFormInput
  ) => {
    setServerError("");

    if (!token) {
      setServerError(
        "This password-reset link is missing its token."
      );
      return;
    }

    try {
      const response = await fetch(
        "/api/auth/reset-password",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            token,
            ...data,
          }),
        }
      );

      const result =
        (await response.json()) as ApiResponse;

      if (!response.ok || !result.success) {
        if (result.errors) {
          const newPasswordError =
            result.errors.newPassword?.[0];

          const confirmPasswordError =
            result.errors.confirmNewPassword?.[0];

          if (newPasswordError) {
            setError("newPassword", {
              type: "server",
              message: newPasswordError,
            });
          }

          if (confirmPasswordError) {
            setError("confirmNewPassword", {
              type: "server",
              message: confirmPasswordError,
            });
          }
        }

        setServerError(
          result.message ||
            "Unable to reset your password."
        );

        return;
      }

      setResetSuccessful(true);

      setTimeout(() => {
        router.push("/login?passwordReset=true");
      }, 1500);
    } catch {
      setServerError(
        "Unable to connect to SkillBuilder. Please try again."
      );
    }
  };

  if (!token) {
    return (
      <div className="text-center">
        <div className="mx-auto flex size-14 items-center justify-center rounded-full bg-red-400/10 text-red-300">
          <LockKeyhole size={26} />
        </div>

        <h1 className="mt-5 text-2xl font-bold">
          Invalid reset link
        </h1>

        <p className="mt-3 text-sm leading-6 text-slate-400">
          This link does not contain a password-reset token.
          Request a new reset email and try again.
        </p>

        <Link
          href="/forgot-password"
          className="mt-6 inline-block font-semibold text-violet-400 transition hover:text-violet-300"
        >
          Request another link
        </Link>
      </div>
    );
  }

  if (resetSuccessful) {
    return (
      <div className="text-center">
        <div className="mx-auto flex size-14 items-center justify-center rounded-full bg-emerald-400/10 text-emerald-300">
          <CheckCircle2 size={28} />
        </div>

        <h1 className="mt-5 text-2xl font-bold">
          Password updated
        </h1>

        <p className="mt-3 text-sm text-slate-400">
          Your password was changed successfully. Redirecting
          you to login...
        </p>

        <Loader2
          size={22}
          className="mx-auto mt-6 animate-spin text-violet-400"
        />
      </div>
    );
  }

  return (
    <>
      <div className="text-center">
        <div className="mx-auto flex size-14 items-center justify-center rounded-full bg-violet-400/10 text-violet-300">
          <LockKeyhole size={26} />
        </div>

        <h1 className="mt-5 text-2xl font-bold sm:text-3xl">
          Create a new password
        </h1>

        <p className="mt-2 text-sm leading-6 text-slate-400">
          Choose a strong password you haven&apos;t used for
          this account before.
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
            htmlFor="newPassword"
            className="mb-2 block text-sm font-medium text-slate-200"
          >
            New password
          </label>

          <div className="relative">
            <input
              id="newPassword"
              type={
                showNewPassword ? "text" : "password"
              }
              autoComplete="new-password"
              placeholder="At least 8 characters"
              disabled={isSubmitting}
              {...register("newPassword")}
              className="w-full rounded-xl border border-white/10 bg-slate-950/70 px-4 py-3 pr-12 text-white outline-none transition placeholder:text-slate-600 focus:border-violet-400 focus:ring-2 focus:ring-violet-400/20 disabled:cursor-not-allowed disabled:opacity-60"
            />

            <button
              type="button"
              onClick={() =>
                setShowNewPassword((current) => !current)
              }
              disabled={isSubmitting}
              className="absolute right-3 top-1/2 -translate-y-1/2 rounded-lg p-1.5 text-slate-400 transition hover:bg-white/10 hover:text-white disabled:opacity-60"
              aria-label={
                showNewPassword
                  ? "Hide new password"
                  : "Show new password"
              }
            >
              {showNewPassword ? (
                <EyeOff size={18} />
              ) : (
                <Eye size={18} />
              )}
            </button>
          </div>

          {errors.newPassword && (
            <p className="mt-2 text-sm text-red-400">
              {errors.newPassword.message}
            </p>
          )}
        </div>

        <div>
          <label
            htmlFor="confirmNewPassword"
            className="mb-2 block text-sm font-medium text-slate-200"
          >
            Confirm new password
          </label>

          <div className="relative">
            <input
              id="confirmNewPassword"
              type={
                showConfirmNewPassword
                  ? "text"
                  : "password"
              }
              autoComplete="new-password"
              placeholder="Enter your new password again"
              disabled={isSubmitting}
              {...register("confirmNewPassword")}
              className="w-full rounded-xl border border-white/10 bg-slate-950/70 px-4 py-3 pr-12 text-white outline-none transition placeholder:text-slate-600 focus:border-violet-400 focus:ring-2 focus:ring-violet-400/20 disabled:cursor-not-allowed disabled:opacity-60"
            />

            <button
              type="button"
              onClick={() =>
                setShowConfirmNewPassword(
                  (current) => !current
                )
              }
              disabled={isSubmitting}
              className="absolute right-3 top-1/2 -translate-y-1/2 rounded-lg p-1.5 text-slate-400 transition hover:bg-white/10 hover:text-white disabled:opacity-60"
              aria-label={
                showConfirmNewPassword
                  ? "Hide confirmed password"
                  : "Show confirmed password"
              }
            >
              {showConfirmNewPassword ? (
                <EyeOff size={18} />
              ) : (
                <Eye size={18} />
              )}
            </button>
          </div>

          {errors.confirmNewPassword && (
            <p className="mt-2 text-sm text-red-400">
              {errors.confirmNewPassword.message}
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
              Updating password...
            </>
          ) : (
            <>
              <LockKeyhole size={18} />
              Reset password
            </>
          )}
        </button>
      </form>
    </>
  );
}