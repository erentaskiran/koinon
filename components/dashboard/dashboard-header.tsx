"use client";

import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { BookOpen, LogOut, User, Settings } from "lucide-react";
import { toast } from "sonner";
import { createClient } from "@/lib/supabase/client";
import Link from "next/link";

interface DashboardHeaderProps {
  userEmail: string | undefined;
}

export function DashboardHeader({ userEmail }: DashboardHeaderProps) {
  const router = useRouter();
  const supabase = createClient();

  const handleSignOut = async () => {
    try {
      await supabase.auth.signOut();
      toast.success("Signed out successfully");
      router.push("/");
      router.refresh();
    } catch (error) {
      toast.error("Failed to sign out");
    }
  };

  return (
    <header className="border-b border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900">
      <div className="container mx-auto flex items-center justify-between px-4 py-4">
        <Link href="/dashboard" className="flex items-center space-x-2">
          <BookOpen className="h-6 w-6 text-zinc-900 dark:text-zinc-100" />
          <span className="text-xl font-bold text-zinc-900 dark:text-zinc-100">
            Koinon
          </span>
        </Link>
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2 text-sm text-zinc-600 dark:text-zinc-400">
            <User className="h-4 w-4" />
            <span>{userEmail}</span>
          </div>
          <Button variant="ghost" size="sm" asChild>
            <Link href="/dashboard/settings">
              <Settings className="mr-2 h-4 w-4" />
              Settings
            </Link>
          </Button>
          <Button variant="outline" size="sm" onClick={handleSignOut}>
            <LogOut className="mr-2 h-4 w-4" />
            Sign Out
          </Button>
        </div>
      </div>
    </header>
  );
}
