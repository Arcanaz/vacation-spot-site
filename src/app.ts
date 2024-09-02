import express, {ErrorRequestHandler, Request, Response, NextFunction} from 'express';
// import bodyParser from 'body-parser';
import path from 'path'
import mongoose from 'mongoose'; //mongoose initializing starts
import Campground from './models/campground';
import methodOverride from 'method-override';
import ejsLayouts from 'express-ejs-layouts';
import {asyncHandler} from './utils/CatchAsync';
import {ExpressError} from './utils/ExpressErrors'
import Joi from 'joi'; //havent use this. This is for erro handling
import Review from './models/review';


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

interface CustomError extends Error {
    statusCode?: number;
    message: string;
}


const connectDB = async (): Promise<void> => {
    try {
        await mongoose.connect('mongodb://localhost:27017/yelp-camp', {
            // You can specify additional options here if needed
        });
        console.log('Database connected');
    } catch (error) {
        console.error('Connection error:', error);
        process.exit(1); // Exit the process if connection fails
    }
}; //mongoose initializing ends

// export default connectDB;
connectDB();


const app = express();

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '../views'));

app.use(express.urlencoded({extended: true}))
app.use(methodOverride('_method'));

// app.use(bodyParser.urlencoded({ extended: true }));


app.use(ejsLayouts);
app.set('layout', 'layout/boilerplate');

app.use((err: ErrorRequestHandler, req: Request, res: Response, next: NextFunction) => {
    console.log('Error');
    res.status(500).send('ERROR');
    next(err);
})




app.get('/', (req: Request, res: Response) => {
    res.render('home', { title: 'Home' });
});



app.get('/test', (req: Request, res: Response) => {
    res.render('test', { title: 'Test Page' });
});




app.get('/campgrounds', asyncHandler(async (req: Request, res: Response): Promise<void> => {
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




app.get('/campgrounds/new', asyncHandler(async (req: Request, res: Response) => {
    res.render('campgrounds/new', { title: 'Create New Campground' });
}));




app.post('/campgrounds', asyncHandler (async (req: Request, res: Response) => {
    const campgrounds = new Campground(req.body.campground);
    await campgrounds.save();
    res.redirect(`/campgrounds/${campgrounds._id}`)
}));

app.get('/campgrounds/:id', asyncHandler(async (req: Request, res: Response) => {
    // if(!req.body.campground) throw new ExpressError('Invalid campground data', 400);
    // I dont even think I need the code above. This is server side protection, so cant make new campground with stuff like HoppScotch, but maybe my typescript already prevents it.
    const campground = await Campground.findById(req.params.id).populate('reviews').exec();
    // console.log(campground);
    if (campground) {
        res.render('campgrounds/show', {campground, title: 'CampgroundID'});
    } else {
        res.status(404).send('Campground not found');
    }
}));

app.post('/campgrounds/:id/reviews', asyncHandler(async (req: Request, res: Response) => {
    // console.log(req.body);
    const campground = await Campground.findById(req.params.id);
    if (!campground) {
        return res.status(404).json({ message: 'Campground not found' });
    }
    const review = new Review(req.body.review);
    await review.save();
    campground.reviews.push(review._id); // Push the ObjectId, not the whole document
    // campground.reviews.push(review._id as mongoose.Types.ObjectId);
    await campground.save();
    res.redirect(`/campgrounds/${campground._id}`)
}));



app.get('/campgrounds/:id/edit', asyncHandler (async (req: Request, res: Response) => {
    const campground = await Campground.findById(req.params.id);
    if (campground) {
        res.render('campgrounds/edit', {campground, title: 'Edit'})
    } else {
        res.status(404).send('Campground edit cannot be found');
    } 
}));

app.put('/campgrounds/:id', asyncHandler (async (req: Request, res: Response) => {
    const { id } = req.params;
    const updatedCampground = await Campground.findByIdAndUpdate(id, req.body.campground, { new: true });
    
    if (updatedCampground) {
        res.redirect(`/campgrounds/${updatedCampground._id}`);
    } else {
        res.status(404).send('Campground not found');
    }
    
}));

app.delete('/campgrounds/:id', asyncHandler (async (req: Request, res: Response) => {
    const {id} = req.params;
    await Campground.findByIdAndDelete(id);
    res.redirect('/campgrounds')
}));

app.delete('/campgrounds/:id/reviews/:reviewId', asyncHandler (async (req: Request, res: Response) => {
    const { id, reviewId} = req.params;
    Campground.findByIdAndUpdate(id, {$pull: {reviews: reviewId }}) //Mongoose $pull allows you to pull from array instead of everything
    await Review.findByIdAndDelete(req.params.reviewId);
    res.redirect(`/campgrounds/${id}`)
}))









app.use('*', (req: Request, res: Response, next: NextFunction) => {
    next(new ExpressError('Page not found', 404))
})



// I think this sends stuff to console, not for people to see
app.use((err: ExpressError, req: Request, res: Response, next: NextFunction) => {
    const {statusCode = 500} = err;
    if(!err.message) err.message = 'Oh no Something went wrong' //dont know if this works, but this is an error for something besides page not found
    res.status(statusCode).render('error', {title: 'Error Occured'})
});



app.listen(3000, () => {
    console.log('Serving on port 3000')
});