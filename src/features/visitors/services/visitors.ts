import { supabase } from "../../../lib/supabase";
import type { Visitor } from "../types/visitors";

export async function getVisitors(archived = false): Promise<Visitor[]> {
  const { data, error } = await supabase
    .from("visitors")
    .select("*")
    .eq("archived", archived)
    .order("visit_date", { ascending: false });

  if (error) throw error;
  return (data ?? []) as Visitor[];
}

export async function upsertVisitor(
  payload: Partial<Visitor>,
  id?: string
): Promise<void> {
  if (id) {
    const { error } = await supabase.from("visitors").update(payload).eq("id", id);
    if (error) throw error;
    return;
  }

  const { error } = await supabase.from("visitors").insert(payload);
  if (error) throw error;
}

export async function setVisitorArchived(id: string, archived: boolean): Promise<void> {
  const { error } = await supabase.from("visitors").update({ archived }).eq("id", id);
  if (error) throw error;
}

export async function setVisitorFollowupStatus(id: string, status: string): Promise<void> {
  const { error } = await supabase
    .from("visitors")
    .update({ followup_status: status })
    .eq("id", id);
  if (error) throw error;
}
