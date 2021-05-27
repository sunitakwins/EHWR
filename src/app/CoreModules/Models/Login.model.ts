export class Login {
  // public email: string;
  // public password: string;
  // public returnUrl: string;

  constructor(public UserName: string,public password: string, public returnUrl: string){

  }
}

export class Logout{
  // constructor(public userName: string )
  constructor(public userId: number, public actionPerformedBy: string )
  {

  }
}
