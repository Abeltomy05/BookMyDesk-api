import { NextFunction, Request, Response } from "express";

export interface IChatController{
   createSession(req:Request, res: Response, next: NextFunction): Promise<void>;
   getChats(req:Request, res: Response, next: NextFunction): Promise<void>;
   getMessages(req:Request, res: Response, next: NextFunction): Promise<void>;
   clearChat(req:Request, res: Response, next: NextFunction): Promise<void>;
}