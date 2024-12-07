import express, {ErrorRequestHandler, Request, Response, NextFunction} from 'express';
const router = express.Router(); //router is called this way and not import {router} from 'express' because router is a part of default export, not named export.
import User from '../models/user';
import {asyncHandler} from '../utils/CatchAsync';
import passport from 'passport';
import session from 'express-session';
import flash from 'connect-flash';
import users, {renderRegister, register, renderLogin, login, logout} from '../controllers/users'



router.route('/register')
    .get(renderRegister)
    .post(asyncHandler(register))

// router.route('/login')
//     .get(renderLogin)
//     .post(passport.authenticate('local', { failureFlash: true, failureRedirect: '/login' }), login)

//Finally works to keep sessions. don't know how, but req.ression.returnTo works now. Though apparently its a security risk!!!!!!!!!!!!!
//https://stackoverflow.com/questions/74947210/passport-authenticate-middleware-removing-all-the-session-keys
//It was apparently passport.authenticate that was deleting sessions this whole time
router.route('/login')
    .get(renderLogin)
    .post((req, res, next) => {
        const returnTo = req.session.returnTo; // Store it before authentication
        passport.authenticate('local', { failureFlash: true, failureRedirect: '/login' })(req, res, (err: Error) => {
            if (err) { return next(err); }

            // Restore returnTo in session
            req.session.returnTo = returnTo;
            next();
        });
    }, login);



    
router.get('/logout', logout); 

export default router; 




//WAS BEFORE
//router.get('/register', renderRegister)

// router.post('/register', asyncHandler(register));

// //Above on top in register, with req.body. the request adds method auutomatically with passport that is login and logout.


// router.get('/login', renderLogin)

// router.post('/login', passport.authenticate('local', { failureFlash: true, failureRedirect: '/login' }), login);

