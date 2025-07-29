import { Response } from "express";

interface TMeta {
    page: number;
    limit: number;
    totalPage: number;
    total: number
}

interface TResponse<T> {
    statusCode: number;
    success: boolean;
    message: string;
    data: T;
    meta?: TMeta
}

// this T will be automatically inferred from received  data 
export const sendResponse = <T>(res: Response, data: TResponse<T>) => {
    res.status(data.statusCode).json({
        statusCode: data.statusCode,
        success: data.success,
        message: data.message,
        meta: data.meta,
        data: data.data
    })
}