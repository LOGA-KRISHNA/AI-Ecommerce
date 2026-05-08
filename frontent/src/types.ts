export interface THttpArgs{
    url:string;
    options?:{
        method?:string,
        body?:string,
        headers?:any
    };
}


export interface TAuthState {
  token: string | null;
  isAuthenticated: boolean;
}