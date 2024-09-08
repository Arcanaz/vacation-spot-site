import express, { Request, Response, NextFunction } from 'express';
import Campground from '../models/campground'; // Adjust the path if necessary
import { asyncHandler } from '../utils/CatchAsync'; // Adjust the path if necessary
import { ExpressError } from '../utils/ExpressErrors'; // Adjust the path if necessary
import isLoggedIn from '../middleware/isLoggedIn';

// Define the interface for Campground input data
interface CampgroundInput {
    title: string;
    price: string;
    description: string;
    location: string;
}

// Define a type for the campground data used in responses
interface CampgroundData {
    _id: string;
    title: string;
    price: string;
    description: string;
    location: string;
}

const router = express.Router();

// Route for displaying all campgrounds
router.get('/', asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const page = parseInt(req.query.page as string, 10) || 1; // Get page number from query, default to 1
    const limit = parseInt(req.query.limit as string, 10) || 10; // Get limit from query, default to 10

    // Fetch campgrounds with pagination
    const campgrounds = await Campground.find({})
        .skip((page - 1) * limit) // Skip previous pages
        .limit(limit); // Limit the number of items per page

    const totalCampgrounds = await Campground.countDocuments({}); // Get total count of documents

    res.render('campgrounds/index', {
        campgrounds,
        title: 'Campgrounds',
        currentPage: page,
        totalPages: Math.ceil(totalCampgrounds / limit) // Calculate total number of pages
    });
}));

// Route for displaying form to create a new campground
router.get('/new', isLoggedIn, asyncHandler(async (req: Request, res: Response) => {
    res.render('campgrounds/new', { title: 'Create New Campground' });
}));

// Route for creating a new campground
//isLoggedIn here, even if user shouldn't even be on the post route, but just extra protection. Maybe against something like Hoppscotch or Postman
router.post('/', isLoggedIn, asyncHandler(async (req: Request, res: Response) => { 
    const campgroundInput: CampgroundInput = req.body.campground;
    const campground = new Campground(campgroundInput);
    await campground.save();
    req.flash('success', 'Successfully made a new campground');
    res.redirect(`/campgrounds/${campground._id}`);
}));

// Route for displaying a specific campground
router.get('/:id', asyncHandler(async (req: Request, res: Response) => {
    const campground = await Campground.findById(req.params.id).populate('reviews').exec();
    if (campground) {
        res.render('campgrounds/show', { campground, title: 'Campground Details' });
    } else {
        req.flash('error', 'Campground cannot be found')
        return res.redirect('/campgrounds')
        // res.status(404).send('Campground not found');
    }
}));

// Route for displaying form to edit a campground
router.get('/:id/edit', isLoggedIn, asyncHandler(async (req: Request, res: Response) => {
    const campground = await Campground.findById(req.params.id);
    if (campground) {
        res.render('campgrounds/edit', { campground, title: 'Edit Campground' });
    } else {
        req.flash('error', 'Campground cannot be found')
        return res.redirect('/campgrounds')
        // res.status(404).send('Campground edit cannot be found');
    }
}));

// Route for updating a campground
router.put('/:id', isLoggedIn, asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const updatedCampground = await Campground.findByIdAndUpdate(id, req.body.campground, { new: true });
    
    if (updatedCampground) {
        req.flash('success', 'Successfully updated campground')
        res.redirect(`/campgrounds/${updatedCampground._id}`);
    } else {
        res.status(404).send('Campground not found');
    }
}));

// Route for deleting a campground
router.delete('/:id', isLoggedIn, asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    await Campground.findByIdAndDelete(id);
    req.flash('success', 'Successfully deleted campground')
    res.redirect('/campgrounds');
}));

export default router;
