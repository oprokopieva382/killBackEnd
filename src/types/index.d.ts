import { UserViewModel } from "../models/UserViewModel";
import { Request } from "express";
declare global {
  namespace Express {
    export interface Request {
      userId: string | null;
      user: UserViewModel;
    }
  }
}
