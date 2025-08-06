export interface UserFormData {
    name: string;
    email: string;
    password: string;
}

export interface User {
    id: number;
    name: string;
    email: string;
    createdAt: string;
}

export interface ApiErrorResponse {
    message: string;
}
