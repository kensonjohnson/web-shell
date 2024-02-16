import { Request, Response } from "express";

export function helloController(_req: Request, res: Response) {
  res.json({ serverMessage: getHello() });
}

export function getHello() {
  return "Hello World!";
}
