// Модель класса Пользователь
export class User {
  public id: number;
  public name: string;
  public role: string;
  public login: string;
  public password: string;
  constructor(
    id: number,
    name: string,
    role: string,
    login: string,
    password: string
  ) {
    this.id = id;
    this.name = name;
    this.role = role;
    this.login = login;
    this.password = password;
  }
}


