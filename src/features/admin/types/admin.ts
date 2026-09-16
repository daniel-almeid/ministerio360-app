export type AdminUser = {
    user_id: string;
    email: string;
    created_at_user: string;
    church_id: string | null;
    church_name: string | null;
    created_at_church: string | null;
    plan_slug: string;
    subscription_active: boolean;
};