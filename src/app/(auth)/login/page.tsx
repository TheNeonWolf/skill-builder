import { Loader2 } from "lucide-react";
import { Suspense } from "react";

import LoginForm from "@/components/auth/LoginForm";

export default function LoginPage() {
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
      <LoginForm />
    </Suspense>
  );
}