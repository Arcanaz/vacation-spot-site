import express, {ErrorRequestHandler, Request, Response, NextFunction} from 'express';

// Create a custom declaration file to augment the Session interface
declare module 'express-session' {
    interface SessionData {
        returnTo?: string;
    }
}

const isLoggedIn = (req: Request, res: Response, next: NextFunction) => {
    if(!req.isAuthenticated()) { //this comes from passport
        // console.log(req.path, req.originalUrl)
        req.session.returnTo = req.originalUrl //modified code
        req.flash('error', 'You must be signed in');
        return res.redirect('/login');
    }
    next();
}

// const isLoggedIn = (req: Request, res: Response, next: NextFunction) => {
//     if (!req.isAuthenticated()) {
//         req.session.returnTo = req.originalUrl;
//         req.session.save((err) => {
//             if (err) return next(err); // Handle save error if needed
//             req.flash('error', 'You must be signed in');
//             return res.redirect('/login');
//         });
//     } else {
//         next();
//     }
// };


export default isLoggedIn;
