// src/auth/dto/auth.dto.ts
export class SignUpDto {
  email: string;
  accountId: string;
  password: string;
  nickname: string;
}

export class SignInDto {
  accountId: string;
  password: string;
}