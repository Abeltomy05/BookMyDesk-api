import { Request, Response } from "express";

export interface IChatController{
   createSession(req:Request, res: Response): Promise<void>;
   getChats(req:Request, res: Response): Promise<void>;
   getMessages(req:Request, res: Response): Promise<void>;
}