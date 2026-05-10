import { ChatRoom } from "@/components/chat-room";
import { createClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

interface ServerMessage {
  id: string;
  role: "user" | "assistant" | "system";
  content: string;
  created_at: string;
}

export default async function ChatPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  let initial: ServerMessage[] = [];
  let aliadoName = "Aliado";

  if (user) {
    const { data: profile } = await supabase
      .from("user_profile")
      .select("aliado_name")
      .eq("user_id", user.id)
      .maybeSingle();
    if (profile?.aliado_name) aliadoName = profile.aliado_name;

    const { data: rows } = await supabase
      .from("chat_messages")
      .select("id, role, content, created_at")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .limit(50);

    initial = ((rows ?? []) as ServerMessage[]).reverse();
  }

  return (
    <div className="mx-auto flex h-[calc(100dvh-200px)] max-w-[820px] flex-col md:h-[calc(100dvh-150px)]">
      <ChatRoom initialMessages={initial} aliadoName={aliadoName} />
    </div>
  );
}
