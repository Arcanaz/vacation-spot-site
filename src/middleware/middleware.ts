import express, {ErrorRequestHandler, Request, Response, NextFunction} from 'express';
import Campground from '../models/campground';
import Review from '../models/review';
import {ExpressError} from '../utils/ExpressErrors'//I don't think my code needs this, but professor used it for something. I think for Joi validate ones i never finished

//NEVER DID JOI PACKAGE MIDDLEWARE. OOOPS

// Create a custom declaration file to augment the Session interface
declare module 'express-session' {
    interface SessionData {
        returnTo?: string;
    }
}



// const isLoggedIn = (req: Request, res: Response, next: NextFunction) => {
//     if (!req.isAuthenticated()) {
//         console.log('Original URL:', req.originalUrl); // Debugging
//         req.session.returnTo = req.originalUrl;
//         //save here
//         console.log('Set returnTo:', req.session.returnTo); // Debugging
//         req.flash('error', 'You must be signed in');
//         return res.redirect('/login');
//     }
//     next();
// };

const isLoggedIn = (req: Request, res: Response, next: NextFunction) => {
    if (!req.isAuthenticated()) {
        console.log('Original URL:', req.originalUrl); // Debugging
        req.session.returnTo = req.originalUrl;
        
        req.session.save((err) => {
            if (err) {
                console.error('Error saving session:', err);
                return next(err);
            }
            console.log('Set returnTo:', req.session.returnTo); // Debugging
            req.flash('error', 'You must be signed in');
            return res.redirect('/login');
        });
    } else {
        next();
    }
};




const isAuthor = async(req: Request, res: Response, next: NextFunction) => { //permission middleware only to actual author
    const { id } = req.params;
        // Type guard to check if req.user is defined
    //This is to protect if for some reason a user that isnt the creator of campground accesses edit, then other user cant change campground
    if (!req.user) {
        req.flash('error', 'You must be signed in to perform this action.');
        return res.redirect('/login');
    }
    
    const campground = await Campground.findById(id);
    
    if (!campground) {
        req.flash('error', 'Campground not found');
        return res.redirect('/campgrounds');
    }
    //Above is user protection for editing campground
    
    // Ensure req.user._id is defined and compare it with campground.author
    if (!campground.author.equals(req.user._id)) {
        req.flash('error', 'You do not have permission to do that.');
        return res.redirect(`/campgrounds/${id}`);
    }

    next();
}


const isReviewAuthor = async (req: Request, res: Response, next: NextFunction) => {
    const { id, reviewId } = req.params;

    if (!req.user) {
        req.flash('error', 'You must be signed in to perform this action.');
        return res.redirect('/login');
    }
    
    const review = await Review.findById(reviewId);
    
    // If the review doesn't exist
    if (!review) {
        req.flash('error', 'Review not found'); // Fix this flash message
        return res.redirect(`/campgrounds/${id}`); // Correctly redirect to the campground page
    }
    
    // Ensure the review author matches the logged-in user
    if (!review.author.equals(req.user._id)) {
        req.flash('error', 'You do not have permission to do that.'); // Permission error message
        return res.redirect(`/campgrounds/${id}`); // Redirect to the campground, not the review
    }

    // If all checks pass, proceed
    next();
};



// const middlewares = {
//     isLoggedIn,
//     isAuthor
// };

// export default middlewares;
//Can also export like this if you start adding a bunch of middleware so only want to export one thing
//Ex: import middleware from '../middleware' << one thing, instead of import {isLoggedIn, isAuthor, isThis, isThat, thisWhen, whyWhat, blahBlah}




export { isLoggedIn, isAuthor, isReviewAuthor };

