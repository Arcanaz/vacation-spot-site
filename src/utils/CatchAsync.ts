import { Request, Response, NextFunction } from 'express';

export const asyncHandler = (func: (req: Request, res: Response, next: NextFunction) => Promise<any>) => {
    return (req: Request, res: Response, next: NextFunction) => {
        func(req, res, next).catch(next);
    };
};
