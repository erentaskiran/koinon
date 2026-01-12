import { createClient } from "@/lib/supabase/server";
import { ShelfView } from "@/components/shelf/shelf-view";

export default async function ShelfPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Fetch user_books - no need to join with books table anymore
  const { data: userBooks } = await supabase
    .from("user_books")
    .select("*")
    .eq("user_id", user?.id);

  return <ShelfView books={userBooks || []} />;
}
