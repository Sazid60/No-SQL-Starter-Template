/* eslint-disable no-console */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextFunction, Request, Response } from "express"
import { envVars } from "../config/env";

type AsyncHandler = (req: Request, res: Response, next: NextFunction) => Promise<void>

export const catchAsync = (fn: AsyncHandler) => (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch((err: any) => {
        if (envVars.NODE_ENV === "development") {
            console.log(err);
        }
        next(err)
    })
}

// steps
/**
 * catch async receives the request response function
 * returns a function and the return function receives req: Request, res: Response, next: NextFunction as function parameter and these are coming from catchAsync received function
 * As the return function just resolves promises so void return is said in type 
 * Promise.resolve(fn(req, res, next)) these are coming from parameter of the return function
 * This avoids needing try/catch in every route handler and lets Express handle errors globally.
 * 
 * */