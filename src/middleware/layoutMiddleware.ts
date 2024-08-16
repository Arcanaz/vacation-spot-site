// middleware/layoutMiddleware.ts
//Since ejs-mate doesnt work with ts, we make our own
import { Request, Response, NextFunction } from 'express';

export function layoutMiddleware(req: Request, res: Response, next: NextFunction) {
    res.locals.layout = 'layout/boilerplate'; // Set the layout template
    next();
}
