export interface UserTypes {
  id: number;
  name: string;
  email: string;
  phone?: string | null;
  sex?: 1 | 2 | null;
  birth_date?: string | null;
  avatar: string;
}

export interface UserReqTypes {
  name?: string;
  email?: string;
  phone?: string;
  sex?: 1 | 2;
  birth_date?: string;
  avatar?: string | BinaryType;
}

export interface PasswordReqTypes {
  current_password: string;
  password: string;
  password_confirmation: string;
}
