import express, {Request, Response} from 'express';
import path from 'path'
import mongoose from 'mongoose'; //mongoose initializing starts
import Campground from './models/campground';
import methodOverride from 'method-override';
import { layoutMiddleware } from './middleware/layoutMiddleware'; //importing our own middleware because ejs-mate wasnt workign with typescript
//not using layoutmiddleware or boilerplate.ejs

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

// Apply the layout middleware
app.use(layoutMiddleware);
//not using this. fuck it

// app.get('/', (req, res) => {
//     res.render('home')
// })

app.get('/', (req: Request, res: Response) => {
    res.render('home', { title: 'Home' });
});

app.get('/test', (req: Request, res: Response) => {
    res.render('test', { title: 'Test Page' });
});



app.get('/campgrounds', async (req: Request, res: Response): Promise<void> => {
    try {
        const campgrounds: CampgroundData[] = await Campground.find({});
        res.render('campgrounds/index', {campgrounds});
    } catch (error) {
        res.status(500).send('Error retrieving campgrounds')
    }
})

app.get('/campgrounds/new', (req: Request, res: Response) =>{
    try {
        res.render('campgrounds/new')
    } catch {
        res.status(404).json('Server not found')
    }
})

app.post('/campgrounds', async (req: Request, res: Response) => {
    const campgrounds = new Campground(req.body.campground);
    await campgrounds.save();
    res.redirect(`/campgrounds/${campgrounds._id}`)
})

app.get('/campgrounds/:id', async (req: Request, res: Response) => {
    try {
        const campground = await Campground.findById(req.params.id).exec();
        if (campground) {
            res.render('campgrounds/show', {campground});
        } else {
            res.status(404).send('Campground not found');
        }
    } catch {
        res.status(404).send('Server not found');
    }
})


app.get('/campgrounds/:id/edit', async (req: Request, res: Response) => {
    // const campground = await Campground.findById(req.params.id);
    // res.render('campgrounds/show', {campground})
    try {
        const campground = await Campground.findById(req.params.id);
        if (campground) {
            res.render('campgrounds/edit', {campground})
        } else {
            res.status(404).send('Campground editcannot be found');
        } 
    } catch {
        res.status(404).send('Server not found')
    }
})

app.put('/campgrounds/:id', async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const updatedCampground = await Campground.findByIdAndUpdate(id, req.body.campground, { new: true });
        
        if (updatedCampground) {
            res.redirect(`/campgrounds/${updatedCampground._id}`);
        } else {
            res.status(404).send('Campground not found');
        }
    } catch (error) {
        res.status(500).send('Error updating campground');
    }
});

app.delete('/campgrounds/:id', async (req: Request, res: Response) => {
    const {id} = req.params;
    await Campground.findByIdAndDelete(id);
    res.redirect('/campgrounds')
})


app.listen(3000, () => {
    console.log('Serving on port 3000')
});