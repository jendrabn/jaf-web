export interface UserTypes {
  id: number;
  name: string;
  email: string;
  phone?: string;
  sex?: 1 | 2;
  birth_date?: string;
  avatar?: string;
}

export interface UserReqTypes {
  name: string;
  email: string;
  phone?: string;
  sex?: 1 | 2;
  birth_date?: string;
  avatar?: BinaryType;
}

export interface PasswordReqTypes {
  current_password: string;
  password: string;
  password_confirmation: string;
}
