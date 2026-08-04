import Link from "next/link";
import { Flame } from "lucide-react";

export default function Navbar() {
    return (
        <header className="border-b border-white/10">
            <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">
                <Link href="/" className="flex items-center gap-2">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-500">
                        <Flame size={22} />
                    </div>

                    <span className="text-xl font-bold">
                        Skill<span className="text-violet-400">Builder</span>
                    </span>         
                </Link>

                <div className="flex items-center gap-3">
                    <Link
                        href="/login"
                        className="rounded-lg px-4 py-2 text-sm font-medium text-slate-300 transition hover:bg-white/10 hover:text-white"
                    >
                        Log in
                    </Link>

                    <Link
                        href="/register"
                        className="rounded-lg bg-violet-500 px-4 py-2 text-sm font-semibold transition hover:bg-violet-400"
                    >
                        Get started
                    </Link>
                </div>
            </nav>
        </header>
    );
}