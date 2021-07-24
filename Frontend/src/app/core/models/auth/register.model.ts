export class User {
  constructor(
    public email: string = '',
    public userName: string = '',
    public password: string = '',
    public pw: string = '',

    public id: string | null = "",
    public phone: string = "",
    public address: string = "",
    public isActive: boolean = true,
    public note: string = "",

  ) { }
}
