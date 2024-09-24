import express, { Request, Response, NextFunction } from 'express';
import Campground from '../models/campground';
import { cloudinary } from '../cloudinary';
// import fs from 'fs'; // Import the file system module




//export const allows for you to export as default AND as named.
export const index = async (req: Request, res: Response): Promise<void> => {
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
};

export const renderNewCampgroundsForm = async (req: Request, res: Response) => {
    res.render('campgrounds/new', { title: 'Create New Campground' });
}

// export const createCampground = async (req: Request, res: Response) => { 
//     req.files.map(f => ({url: f.path, filename: f.filename}))
//     if (!req.user || !req.user._id) {
//         req.flash('error', 'You must be signed in to create a campground');
//         return res.redirect('/login');
//     } //this fixes req.user below
//     const campground = new Campground(req.body.campground);
//     campground.author = req.user._id;
//     await campground.save();    
//     req.flash('success', 'Successfully made a new campground');
//     res.redirect(`/campgrounds/${campground._id}`);
// }

// export const createCampground = async (req: Request, res: Response) => {
//     // Ensure req.files is defined
//     const files = req.files as Express.Multer.File[] | undefined;
//     const images = files ? files.map(file => ({ url: file.path, filename: file.filename })) : []; 

//     if (!req.user || !req.user._id) {
//         req.flash('error', 'You must be signed in to create a campground');
//         return res.redirect('/login');
//     }

//     const campground = new Campground(req.body.campground);
//     campground.author = req.user._id;
//     campground.images = images; // Set images field with URLs and filenames. This line is also redundant with const images
//     await campground.save();

//     req.flash('success', 'Successfully made a new campground');
//     res.redirect(`/campgrounds/${campground._id}`);
// }


//BUG ERRROR - Uploading image and updating in update route makes duplicates. idk where.

// export const createCampground = async (req: Request, res: Response) => {
//     // Ensure req.files is defined and has files
//     const files = req.files as Express.Multer.File[] | undefined;
//     console.log("Files being uploaded:", files);

    
//     // If files are provided, upload to Cloudinary and extract URLs
//     // const newimages = files ? await Promise.all(files.map(async (file) => {
//     //     const result = await cloudinary.uploader.upload(file.path);
//     //     return { url: result.secure_url, filename: result.public_id };
//     // })) : [];


//     const newImages = files ? await Promise.all(files.map(async (file) => {
//         const result = await cloudinary.uploader.upload(file.path, { folder: 'YelpCamp' });
//         return { url: result.secure_url, filename: result.public_id };  // 'filename' now includes 'YelpCamp/'
//     })) : [];

//     if (!req.user || !req.user._id) {
//         req.flash('error', 'You must be signed in to create a campground');
//         return res.redirect('/login');
//     }

//     const campground = new Campground(req.body.campground);
//     campground.author = req.user._id;
//     //UNCOMMENT
//     campground.images = newImages; // Set images field with URLs and filenames
//     await campground.save();

//     console.log(`Campground created with images:`, campground.images);

//     req.flash('success', 'Successfully made a new campground');
//     res.redirect(`/campgrounds/${campground._id}`);
// }

export const createCampground = async (req: Request, res: Response) => {
    // Debugging: Track function call count
    console.log("createCampground function called");

    // Ensure req.files is defined and has files
    const files = req.files as Express.Multer.File[] | undefined;
    console.log("Files being uploaded:", files);

    // If files are provided, upload to Cloudinary and extract URLs
    const newImages = files ? await Promise.all(files.map(async (file) => {
        const result = await cloudinary.uploader.upload(file.path, { folder: 'YelpCamp' });
        return { url: result.secure_url, filename: result.public_id };  // 'filename' now includes 'YelpCamp/'
    })) : [];

    if (!req.user || !req.user._id) {
        req.flash('error', 'You must be signed in to create a campground');
        return res.redirect('/login');
    }

    const campground = new Campground(req.body.campground);
    campground.author = req.user._id;
    campground.images = newImages; // Set images field with URLs and filenames
    await campground.save();

    console.log(`Campground created with images:`, campground.images);

    req.flash('success', 'Successfully made a new campground');
    res.redirect(`/campgrounds/${campground._id}`);
}




// export const createCampground = async (req: Request, res: Response) => {
//     console.log("createCampground function called");

//     const files = req.files as Express.Multer.File[] | undefined;
//     console.log("Files being uploaded:", files);

//     const newImages = files ? await Promise.all(files.map(async (file) => {
//         const result = await cloudinary.uploader.upload(file.path, { folder: 'YelpCamp' });
        
//         // Log the local file path before deletion
//         console.log("Deleting local file:", file.path);
        
//         // Delete the local file after uploading to Cloudinary
//         fs.unlinkSync(file.path); // This removes the local file
        
//         return { url: result.secure_url, filename: result.public_id };
//     })) : [];

//     if (!req.user || !req.user._id) {
//         req.flash('error', 'You must be signed in to create a campground');
//         return res.redirect('/login');
//     }

//     const campground = new Campground(req.body.campground);
//     campground.author = req.user._id;
//     campground.images = newImages;
//     await campground.save();

//     console.log(`Campground created with images:`, campground.images);

//     req.flash('success', 'Successfully made a new campground');
//     res.redirect(`/campgrounds/${campground._id}`);
// }






export const showCampground = async (req: Request, res: Response) => { ///here
    const campground = await Campground.findById(req.params.id).populate({
        path: 'reviews', //nested populate, for reviews id
        populate: {
            path: 'author'
        }
    }).populate('author').exec();
    // console.log(campground); 
    if (campground) {
        res.render('campgrounds/show', { campground, title: 'Campground Details' });
    } else {
        req.flash('error', 'Campground cannot be foundz')
        return res.redirect('/campgrounds')
        // res.status(404).send('Campground not found');
    }
}

export const renderEdit = async (req: Request, res: Response) => {
    const campground = await Campground.findById(req.params.id);
    if (campground) {
        res.render('campgrounds/edit', { campground, title: 'Edit Campground' });
    } else {
        req.flash('error', 'Campground cannot be found')
        return res.redirect('/campgrounds')
        // res.status(404).send('Campground edit cannot be found');
    }
}


export const updateCampground = async (req: Request, res: Response) => {
    const { id } = req.params;
    console.log(req.body);
    // Ensure req.files is defined and has files
    const files = req.files as Express.Multer.File[] | undefined;

    // Find the existing campground
    const campground = await Campground.findById(id);

    if (!campground) {
        req.flash('error', 'Campground not found');
        return res.redirect('/campgrounds');
    }

    // Upload new images if any were added
    // const newImages = files ? await Promise.all(files.map(async (file) => {
    //     const result = await cloudinary.uploader.upload(file.path);
    //     return { url: result.secure_url, filename: result.public_id };
    // })) : [];

    const newImages = files ? await Promise.all(files.map(async (file) => {
        const result = await cloudinary.uploader.upload(file.path, { folder: 'YelpCamp' });
        return { url: result.secure_url, filename: result.public_id };  // 'filename' now includes 'YelpCamp/'
    })) : [];
    

    // Append new images to the campground's images array
    campground.images.push(...newImages);

    // Update other campground fields (title, price, etc.)
    campground.set(req.body.campground);

    //Deleting campground Mongoose query. Check campground model. This removes it from carasoul too.
    if(req.body.deleteImages) {
        for(let filename of req.body.deleteImages) {
            await cloudinary.uploader.destroy(filename); //this deletes an image on cloudinary too. await might not be needed
        }
        await campground.updateOne({$pull: {images: {filename: {$in: req.body.deleteImages}}}})

        console.log(campground);
    }

    // Save the updated campground
    await campground.save();

    req.flash('success', 'Successfully updated campground');
    res.redirect(`/campgrounds/${campground._id}`);
}




export const deleteCampground = async (req: Request, res: Response) => {
    const { id } = req.params;
    await Campground.findByIdAndDelete(id);
    req.flash('success', 'Successfully deleted campground')
    res.redirect('/campgrounds');
}


export default {
    index,
    renderNewCampgroundsForm,
    createCampground,
    showCampground,
    renderEdit,
    deleteCampground
};