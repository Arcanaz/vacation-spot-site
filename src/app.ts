if(process.env.NODE_ENV !== "production"){
    require('dotenv').config(); //if we run in development mode, like right now, take .env variable, and add them to process.env in Node app to access. In production we don't do this.
}
// console.log(process.env.CLOUDINARY_CLOUD_NAME)
// console.log(process.env.CLOUDNINARY_KEY)



import express, {ErrorRequestHandler, Request, Response, NextFunction} from 'express';
// import bodyParser from 'body-parser';
import path from 'path'
import mongoose from 'mongoose'; //mongoose initializing starts
// import Campground from './models/campground';
import methodOverride from 'method-override';
import ejsLayouts from 'express-ejs-layouts';
import {asyncHandler} from './utils/CatchAsync';
import {ExpressError} from './utils/ExpressErrors'
import Joi from 'joi'; //havent use this. This is for erro handling
import session from 'express-session';
import flash from 'connect-flash';

import passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';
import User from './models/user'
// import User, { UserDocument } from './models/user';

import campgroundRoutes from './routes/campgrounds';
import reviewRoutes from './routes/reviews';
import userRoutes from './routes/users';

import MongoStore from 'connect-mongo'; //session store



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
app.use(express.static('public')); //for stars css


app.use(express.urlencoded({extended: true}))
app.use(methodOverride('_method'));

// app.use(bodyParser.urlencoded({ extended: true }));

// const sessionConfig = { //Right click inspect, Applicaitons to see cookies
//     secret: 'thisshouldbeabettersecret',
//     resave: false,
//     saveUninitialized: true, //Eventually we will change to mongostore, not default store that resets session after server restarts
//     cookie: {
//         httpOnly: true, //This is for extra secuirty, but I think its default true already. We are just implicitly saying it
//         expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7),
//         maxAge: 1000 * 60 * 60 * 24 * 7
//         //1000 miliseconds  = 1, 60 sec = 1 min, 60 min = 1 hour, 24 hour = 1 day, 7 day = 1 week.
//         //if you do Date.now in console, this is done in miliseconds, so that's we we areusing miliseconds to count time.
//     }

// }

const sessionConfig = {
    secret: 'thisshouldbeabettersecret',
    resave: false,
    saveUninitialized: false, // Save session only if modified
    cookie: {
        httpOnly: true,
        expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7), // 1 week expiration
        maxAge: 1000 * 60 * 60 * 24 * 7 // 1 week in milliseconds
    }
};


app.use(session(sessionConfig));

app.use(flash());

app.use(passport.initialize());
app.use(passport.session()); //check passport docs. You need this for persistent login sessions.
//passport.session must be set after app.use(session) above
passport.use(new LocalStrategy(User.authenticate()));


// passport.serializeUser(User.serializeUser() as (user: UserDocument, done: (err: any, id?: any) => void) => void);
// passport.serializeUser(User.serializeUser())
// passport.deserializeUser(User.deserializeUser())

// Serialize the user
passport.serializeUser((user: Express.User, done: (err: any, id?: any) => void) => {
    done(null, (user as any)._id); // Assumes the user has _id as the unique identifier
});

// Deserialize the user

passport.deserializeUser(async (id: string, done: (err: any, user?: Express.User | null) => void) => {
    try {
        const user = await User.findById(id).exec();
        done(null, user);
    } catch (err) {
        done(err);
    }
});




app.use(ejsLayouts);
app.set('layout', 'layout/boilerplate');

app.use((err: ErrorRequestHandler, req: Request, res: Response, next: NextFunction) => {
    console.log('Error');
    res.status(500).send('ERROR');
    next(err);
})

app.use((req: Request, res: Response, next: NextFunction) => { 
    // console.log(req.session)
    res.locals.currentUser = req.user; //req.user comes method within passport. Instead of putting this in isLoggedIn and try for every request, we add it here to the global variables.
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    next();
}) // This middleware function is to pass success for flash message. Displayed in boilerplate and run because campgrounds made new campground location entry.

app.use('/', userRoutes);
app.use('/campgrounds', campgroundRoutes);
app.use('/campgrounds', reviewRoutes);



app.get('/', (req: Request, res: Response) => {
    res.render('home', { title: 'Home' });
});

//delete this shit
app.get('/fakeUser', async(req: Request, res: Response) => {
    const user = new User({email: 'jgmaximum@gmail.com', username: 'arc'})
    const newUser = await User.register(user, 'chicken');
    res.send(newUser);
})


// express-session.d.ts
import 'express-session';

declare module 'express-session' {
    interface SessionData {
        returnTo?: string;
        testData?: string;
    }
}

app.get('/test-session', (req: Request, res: Response) => {
    req.session.testData = 'Session works!';
    // console.log(req.session.testData);
    res.send('Session data set. Check the console for details.');
});

app.get('/check-session', (req: Request, res: Response) => {
    // console.log(req.session.testData)
    res.send(`Session testData: ${req.session.testData}`);
});



//MAKE SURE TO TURN BACK THESE ROUTES ON///


// app.use('*', (req: Request, res: Response, next: NextFunction) => {
//     next(new ExpressError('Page not found', 404))
// })



// // I think this sends stuff to console, not for people to see
// app.use((err: ExpressError, req: Request, res: Response, next: NextFunction) => {
//     const {statusCode = 500} = err;
//     if(!err.message) err.message = 'Oh no Something went wrong' //dont know if this works, but this is an error for something besides page not found
//     res.status(statusCode).render('error', {title: 'Error Occured'})
// });



app.listen(3000, () => {
    console.log('Serving on port 3000')
});



//ISSUES
//Joi not implemented
//returnTo session not working
//Duplicates in cloudinary made