export interface Profile {
    id: string;
    login_id: string;
    name: string;
    email: string;
    image: string;
    description?: string;
    poetic_name: string;
    story: string;
    episode: string;
    isAdmin: boolean;
    like: boolean;
    dislike: boolean;
    created_at: string;
    updated_at: string;
}