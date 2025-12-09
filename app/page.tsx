import { createClient } from "@/lib/supabase/server";
import { Button } from "@/components/ui/button";
import { redirect } from "next/navigation";
import Link from "next/link";
import { BookOpen, Library, Users, TrendingUp } from "lucide-react";

export default async function Home() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user) {
    redirect("/dashboard");
  }

  return (
    <div className="min-h-screen bg-zinc-50 font-sans dark:bg-black">
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-16">
        <nav className="flex items-center justify-between pb-16">
          <div className="flex items-center space-x-2">
            <BookOpen className="h-8 w-8 text-zinc-900 dark:text-zinc-100" />
            <span className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">
              Koinon
            </span>
          </div>
          <div className="space-x-4">
            <Button variant="outline" asChild>
              <Link href="/login">Sign In</Link>
            </Button>
            <Button asChild>
              <Link href="/signup">Get Started</Link>
            </Button>
          </div>
        </nav>

        <div className="mx-auto max-w-4xl text-center">
          <h1 className="mb-6 text-5xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100 md:text-6xl">
            Organize Your Reading Collection
          </h1>
          <p className="mb-8 text-xl text-zinc-600 dark:text-zinc-400">
            Track your books, manage your reading list, and discover new titles
            all in one place.
          </p>
          <div className="flex items-center justify-center gap-4">
            <Button size="lg" asChild>
              <Link href="/signup">Start Reading</Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link href="/login">Sign In</Link>
            </Button>
          </div>
        </div>

        {/* Features Section */}
        <div className="mx-auto mt-24 grid max-w-6xl gap-8 md:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-lg border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
            <Library className="mb-4 h-12 w-12 text-zinc-900 dark:text-zinc-100" />
            <h3 className="mb-2 text-lg font-semibold text-zinc-900 dark:text-zinc-100">
              Organize Collection
            </h3>
            <p className="text-zinc-600 dark:text-zinc-400">
              Keep track of all your books in one organized digital library.
            </p>
          </div>
          <div className="rounded-lg border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
            <BookOpen className="mb-4 h-12 w-12 text-zinc-900 dark:text-zinc-100" />
            <h3 className="mb-2 text-lg font-semibold text-zinc-900 dark:text-zinc-100">
              Track Progress
            </h3>
            <p className="text-zinc-600 dark:text-zinc-400">
              Monitor your reading progress and set personal reading goals.
            </p>
          </div>
          <div className="rounded-lg border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
            <Users className="mb-4 h-12 w-12 text-zinc-900 dark:text-zinc-100" />
            <h3 className="mb-2 text-lg font-semibold text-zinc-900 dark:text-zinc-100">
              Share Reviews
            </h3>
            <p className="text-zinc-600 dark:text-zinc-400">
              Write reviews and share your thoughts with fellow readers.
            </p>
          </div>
          <div className="rounded-lg border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
            <TrendingUp className="mb-4 h-12 w-12 text-zinc-900 dark:text-zinc-100" />
            <h3 className="mb-2 text-lg font-semibold text-zinc-900 dark:text-zinc-100">
              Discover Books
            </h3>
            <p className="text-zinc-600 dark:text-zinc-400">
              Find new books based on your reading preferences and history.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
