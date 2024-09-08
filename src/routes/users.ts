import express, {ErrorRequestHandler, Request, Response, NextFunction} from 'express';
const router = express.Router(); //router is called this way and not import {router} from 'express' because router is a part of default export, not named export.
import User from '../models/user';
import {asyncHandler} from '../utils/CatchAsync';
import passport from 'passport';
import session from 'express-session';
import flash from 'connect-flash';


router.get('/register', (req: Request, res: Response) => {
    res.render('users/register', { title: 'Register' });
})

router.post('/register', asyncHandler(async (req: Request, res: Response, next:NextFunction) => {
    try {
        const { email, username, password } = req.body;
        const user = new User({ email, username });
        const registeredUser = await User.register(user, password);
        req.login(registeredUser, err => { //if register, make sesson and automatically stay logged in, and not have to go to /login
            if (err) return next(err); //if error, for some reason, return error. thats why we need next:NextFunction. We also need => because await doesnt work here because passport doesnt support it here. That's why we do a callback.
            req.flash('success', `Hello ${registeredUser.username}. Welcome to Yelp Camp`);
            res.redirect('/campgrounds');
        })
        
    } catch (e) {
        // Check if e is an instance of Error
        if (e instanceof Error) {
            req.flash('error', e.message);
        } else {
            req.flash('error', 'An unknown error occurred');
        }
        res.redirect('register');
    }
}));

//Above on top in register, with req.body. the request adds method auutomatically with passport that is login and logout.


router.get('/login', (req: Request, res: Response) => {
    res.render('users/login', {title: 'login'});

})

router.post('/login', passport.authenticate('local', {failureFlash: true, failureRedirect: '/login'}), (req: Request, res: Response) => { //authenticate here doesnt work on register user, because we have to register user first, thats why we need that callback function in /register
    req.flash('success', 'welcome back');
    const redirectUrl = req.session.returnTo || '/campgrounds' //checked isLoggedIn
    delete req.session.returnTo; //Deletes this from session cause you dont need it
    res.redirect(redirectUrl);
})

router.get('/logout', (req:Request, res:Response, next:NextFunction) => {
    req.logout(function (err) {
        if (err) {
            return next(err);
        }
        req.flash('success', 'Goodbye!');
        res.redirect('/campgrounds');
    });
}); 

export default router; 
