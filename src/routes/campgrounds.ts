import express, { Request, Response, NextFunction } from 'express';
import Campground from '../models/campground'; // Adjust the path if necessary
import { asyncHandler } from '../utils/CatchAsync'; // Adjust the path if necessary
import { ExpressError } from '../utils/ExpressErrors'; // Adjust the path if necessary
import {isLoggedIn, isAuthor} from '../middleware/middleware';
import mongoose from 'mongoose'; //need this for mongoose declare global interface below
import path from 'path';
import campgrounds, {
    index,
    renderNewCampgroundsForm,
    createCampground,
    showCampground,
    renderEdit,
    updateCampground,
    deleteCampground
} from '../controllers/campgrounds';

import multer from 'multer';
const upload = multer({ dest: path.join(__dirname, 'temp_uploads') });
// console.log(`HERE!!!!!!!!!!!!!!!!!!!!${__dirname}`); //location of your saved images. change this eventually. we dont want multer doing this


// import {storage} from '../cloudinary'
// import multer, {StorageEngine} from 'multer'; // Import multer correctly
// const upload = multer({ storage }); // Use the storage configuration XXXX THIS SHIT WAS MAKING DUPLICATES, multer was double uploading
//UNCOMMENT

// import {storage} from '../cloudinary'
// import multer, {StorageEngine} from 'multer'; // Import multer correctly
// const upload = multer({ storage }); // Use the storage configuration

// const multer  = require('multer') //multer used for to properly parse multipart/form-data images uploaded
// const upload = multer({ dest: 'uploads/' }) //only for testing purposes. This saves stuff locally. Don't be a retard and use AWS or Cloudinary

//This is custom version of const upload = multer({ dest: 'uploads/' })
// Define storage engine
// const storage: StorageEngine = multer.diskStorage({
//     destination: (req: Request, file: Express.Multer.File, cb: (error: Error | null, destination: string) => void) => {
//         // Use path.resolve to navigate to the root directory and place files in 'uploads/'
//         cb(null, path.resolve(__dirname, '../../uploads')); // Move to root from 'src'
//     },
//     filename: (req: Request, file: Express.Multer.File, cb: (error: Error | null, filename: string) => void) => {
//         cb(null, Date.now() + '-' + file.originalname); // Add timestamp to avoid filename collisions
//     }
// });
// DON'T NEED THIS ANYMORE. THIS IS ONLY FOR LOCAL STORAGE. JUST TO TEST OUT THE CODE FIRST. THIS CODE GOES BEFORE const upload = multer




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


//This is for ._id that post route that keeps track of user who makes a post.
// Extend Express.Request with User interface
declare global {
    namespace Express {
        interface User {
            _id: mongoose.Types.ObjectId;
            // You can add other properties here if needed
        }
    }
}

const router = express.Router();

//--------------------get rid of this pretend route--------------------
// router.route('/') 
//     .get(asyncHandler(index))
//     .post(upload.array('campground[image]'),(req: Request, res: Response) => { //upload.single = 1, upload.array = multiple. This is multer
//         // console.log(req.body)
//         // console.log(process.env.CLOUDINARY_CLOUD_NAME)
//         // console.log(process.env.CLOUDNINARY_KEY)
//         // console.log(process.env.CLOUDINARY_SECRET)
//         console.log( req.body, req.files ); //req.file with no 's' if you are using upload.single. No plural
//         res.send('Worked'); //req.file with no 's' if you are using upload.single. No plural

//     })
//     // .post(isLoggedIn, asyncHandler(createCampground));


// Route for displaying all campgrounds

// router.route('/') 
//     .get(asyncHandler(index))
//     .post(isLoggedIn, asyncHandler(createCampground));

//UNCOMMENT
router.route('/') 
    .get(asyncHandler(index))
    .post(isLoggedIn, upload.array('campground[images]'), asyncHandler(createCampground));


// Route for displaying form to create a new campground
router.get('/new', isLoggedIn, asyncHandler(renderNewCampgroundsForm));


// router.route('/:id')
//     .get(asyncHandler(showCampground))
//     .put(isLoggedIn, isAuthor, asyncHandler(updateCampground))
//     .delete(isLoggedIn, isAuthor, asyncHandler(deleteCampground))

    
router.route('/:id')
    .get(asyncHandler(showCampground))
    .put(isLoggedIn, isAuthor, upload.array('campground[images]'), asyncHandler(updateCampground))
    .delete(isLoggedIn, isAuthor, asyncHandler(deleteCampground))

// Route for displaying form to edit a campground
router.get('/:id/edit', isLoggedIn, isAuthor, asyncHandler(renderEdit));


export default router;



//USED TO BE THIS
// // Route for displaying all campgrounds
// router.get('/', asyncHandler(index))


// // Route for displaying form to create a new campground
// router.get('/new', isLoggedIn, asyncHandler(renderNewCampgroundsForm));

// // Route for creating a new campground
// //isLoggedIn here, even if user shouldn't even be on the post route, but just extra protection. Maybe against something like Hoppscotch or Postman
// router.post('/', isLoggedIn, asyncHandler(createCampground));

// // Route for displaying a specific campground
// router.get('/:id', asyncHandler(showCampground));

// // Route for displaying form to edit a campground
// router.get('/:id/edit', isLoggedIn, isAuthor, asyncHandler(renderEdit));

// // Route for updating a campground
// router.put('/:id', isLoggedIn, isAuthor, asyncHandler(updateCampground));


// // Route for deleting a campground
// router.delete('/:id', isLoggedIn, isAuthor, asyncHandler(deleteCampground));
