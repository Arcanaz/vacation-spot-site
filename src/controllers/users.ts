// import { render } from 'ejs'; //wtf is this
import User from '../models/user';
import express, {ErrorRequestHandler, Request, Response, NextFunction} from 'express';


export const renderRegister = (req: Request, res: Response) => {
    res.render('users/register', { title: 'Register' });
}

export const register = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { email, username, password } = req.body;
        // Create a new user instance
        const user = new User({ email, username });
        
        // Register the user with the given password
        User.register(user, password, (err, registeredUser) => {
            if (err) {
                req.flash('error', err.message);
                return res.redirect('/register');
            }

            // Log the user in and handle errors
            req.login(registeredUser, (err) => {
                if (err) return next(err);
                
                req.flash('success', `Hello ${registeredUser.username}. Welcome to Yelp Camp`);
                res.redirect('/campgrounds');
            });
        });
        
    } catch (e) {
        // Check if e is an instance of Error
        if (e instanceof Error) {
            req.flash('error', e.message);
        } else {
            req.flash('error', 'An unknown error occurred');
        }
        res.redirect('/register');
    }
}

export const renderLogin = (req: Request, res: Response) => {
    res.render('users/login', {title: 'login'});

}

export const login = (req: Request, res: Response, next: NextFunction) => {
    req.flash('success', 'welcome back');
    // console.log('Before everything:', req.session.returnTo);
    // console.log('Before saving session:', req.session);
    
    const redirectUrl = req.session.returnTo || '/campgrounds';
    console.log('Redirecting to:', redirectUrl);

    if (req.session.returnTo) {
        delete req.session.returnTo;
    }

    req.session.save((err) => {
        if (err) {
            console.error('Error saving session after login:', err);
            return next(err);
        }
        console.log('After saving session:', req.session); // Debugging
        res.redirect(redirectUrl);
    });
}

export const logout = (req:Request, res:Response, next:NextFunction) => {
    req.logout(function (err) {
        if (err) {
            return next(err);
        }
        req.flash('success', 'Goodbye!');
        res.redirect('/campgrounds');
    });
}

export default {
    renderRegister,
    register,
    renderLogin,
    login
}