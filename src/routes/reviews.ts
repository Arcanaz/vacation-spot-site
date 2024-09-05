import express, { Request, Response, NextFunction } from 'express';
import Campground from '../models/campground'; // Adjust the path if necessary
import Review from '../models/review'; // Adjust the path if necessary
import { asyncHandler } from '../utils/CatchAsync'; // Adjust the path if necessary
import { ExpressError } from '../utils/ExpressErrors'; // Adjust the path if necessary

const router = express.Router();

// Route for adding a review to a campground
router.post('/:id/reviews', asyncHandler(async (req: Request, res: Response) => {
    const campground = await Campground.findById(req.params.id);
    if (!campground) {
        return res.status(404).json({ message: 'Campground not found' });
    }
    const review = new Review(req.body.review);
    await review.save();
    campground.reviews.push(review._id); // Push the ObjectId, not the whole document
    await campground.save();
    req.flash('success', 'Successfully created a review!!')
    res.redirect(`/campgrounds/${campground._id}`);
}));

// Route for deleting a review from a campground
router.delete('/:id/reviews/:reviewId', asyncHandler(async (req: Request, res: Response) => {
    const { id, reviewId } = req.params;
    await Campground.findByIdAndUpdate(id, { $pull: { reviews: reviewId } }); // Mongoose $pull allows you to pull from array
    await Review.findByIdAndDelete(reviewId);
    req.flash('success', 'Successfully deleted review')
    res.redirect(`/campgrounds/${id}`);
}));

export default router;
