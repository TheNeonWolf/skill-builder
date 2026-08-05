import { Loader2 } from "lucide-react";
import { Suspense } from "react";

import ResetPasswordForm from "@/components/auth/ResetPasswordForm";

export default function ResetPasswordPage() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center py-12">
          <Loader2
            size={28}
            className="animate-spin text-violet-400"
          />
        </div>
      }
    >
      <ResetPasswordForm />
    </Suspense>
  );
}