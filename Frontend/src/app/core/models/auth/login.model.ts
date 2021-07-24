export class LoginModel {
  constructor(
    public email: string,
    public password: string) {
  }
}

export class ResetPasswordRequest {
  constructor(
    public email: string,
    public returnUrl: string
  ) { }
}

export class ResetPasswordComplete {
  constructor(
    public email: string,
    public password: string,
    public confirmPassword: string,
    public token: string
  ) { }
}