import express, { Request, Response, NextFunction } from 'express';
import Campground from '../models/campground'; 
import Review from '../models/review'; 


export const createReview = async (req: Request, res: Response) => {
    const campground = await Campground.findById(req.params.id);
    if (!campground) {
        return res.status(404).json({ message: 'Campground not found' });
    }

    if (!req.user || !req.user._id) { //we do this because req.user may exist, but be undefined or null, but then req.user._id doesnt exist so causes runtime error.
        req.flash('error', 'You must be logged in to create a review');
        return res.redirect('/login');
    }

    const review = new Review(req.body.review);
    review.author = req.user._id;
    await review.save();
    campground.reviews.push(review._id); // Push the ObjectId, not the whole document
    await campground.save();
    req.flash('success', 'Successfully created a review!!');
    res.redirect(`/campgrounds/${campground._id}`);

}

export const deleteReview = async (req: Request, res: Response) => {
    const { id, reviewId } = req.params;
    await Campground.findByIdAndUpdate(id, { $pull: { reviews: reviewId } }); // Mongoose $pull allows you to pull from array
    await Review.findByIdAndDelete(reviewId);
    req.flash('success', 'Successfully deleted review')
    res.redirect(`/campgrounds/${id}`);
}

export default {
    createReview,
    deleteReview
}