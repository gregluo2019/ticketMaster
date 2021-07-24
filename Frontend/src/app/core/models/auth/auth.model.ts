export class AuthModel {
  constructor(
    public token: string,
    public userId: string,
    public userName: string,
    public email: string,
    public isLoggedIn: boolean,
    public isAdmin: boolean,
    public isManager: boolean,
    public isActive: boolean,
  ) { }
}
