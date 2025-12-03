// src/services/userService.ts
import { supabase } from "@/integrations/supabase/client";

export type DashboardUserType = "Admin" | "Vendedor" | "Cliente";

export interface DashboardUser {
    id: string;
    name: string;
    email: string;
    type: DashboardUserType;
    status: "Ativo" | "Inativo";
    createdAt: string;
    ultimoAcesso: string;
}

export async function fetchDashboardUsers(): Promise<DashboardUser[]> {
    const { data, error } = await supabase
        .from("profiles")
        .select(`
    id,
    username,
    full_name,
    email,
    created_at,
    user_roles ( role )
  `)
        .order("created_at", { ascending: false });


    if (error) {
        console.error("Erro ao buscar usuários:", error);
        throw error;
    }

    const mapped: DashboardUser[] = (data ?? []).map((row: any) => {
        const roles = row.user_roles ?? [];
        const mainRole = roles[0]?.role ?? "user";

        let type: DashboardUserType;
        if (mainRole === "admin") type = "Admin";
        else if (mainRole === "seller") type = "Vendedor";
        else type = "Cliente";

        const name = row.full_name || row.username || "Usuário sem nome";

        const email =
            row.email ||
            (typeof row.username === "string" && row.username.includes("@")
                ? row.username
                : "");

        return {
            id: row.id,
            name,
            email,
            type,
            status: "Ativo",
            createdAt: row.created_at,
            ultimoAcesso: new Date(row.created_at).toLocaleDateString("pt-BR"),
        };
    });

    return mapped;
}
