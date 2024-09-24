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

router.route('/login')
    .get(renderLogin)
    .post(passport.authenticate('local', { failureFlash: true, failureRedirect: '/login' }), login)


    
router.get('/logout', logout); 

export default router; 




//WAS BEFORE
//router.get('/register', renderRegister)

// router.post('/register', asyncHandler(register));

// //Above on top in register, with req.body. the request adds method auutomatically with passport that is login and logout.


// router.get('/login', renderLogin)

// router.post('/login', passport.authenticate('local', { failureFlash: true, failureRedirect: '/login' }), login);

