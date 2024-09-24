import express, { Request, Response, NextFunction } from 'express';
import Campground from '../models/campground'; // Adjust the path if necessary
import Review from '../models/review'; // Adjust the path if necessary
import { asyncHandler } from '../utils/CatchAsync'; // Adjust the path if necessary
import { ExpressError } from '../utils/ExpressErrors'; // Adjust the path if necessary
import { isLoggedIn, isReviewAuthor} from '../middleware/middleware';

import reviews, {createReview, deleteReview} from '../controllers/reviews';

const router = express.Router();



router.post('/:id/reviews', isLoggedIn, asyncHandler(createReview));



// Route for deleting a review from a campground
router.delete('/:id/reviews/:reviewId', isLoggedIn, isReviewAuthor, asyncHandler(deleteReview));

export default router;
