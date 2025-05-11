import { Request } from 'express';

export interface IUser {
  username:  string;
  firstname: string;
  lastname:  string;
  email:     string;
  password:  string
}

export interface RegisterBody {
  username:  string;
  firstname: string;
  lastname:  string;
  email:     string;
  password:  string
}

export interface LoginBody {
  username:    string;
  password: string;
}

export interface AuthRequest extends Request {
  user?: {
    _id: string;
    username:  string;
    firstname: string;
    lastname:  string;
    email:     string
  };
}