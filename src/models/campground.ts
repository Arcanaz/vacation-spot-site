import mongoose, { Document, Schema, Model } from 'mongoose';
import Review from './review'; // Adjust the import path as needed

// Interface for the Campground document
interface CampgroundDocument extends Document {
    title: string;
    price: number;
    description: string;
    location: string;
    images: {
        url: string;
        filename: string;
    }[];
    author: mongoose.Types.ObjectId;
    reviews: mongoose.Types.ObjectId[];
}

// Schema definition
const CampgroundSchema = new Schema<CampgroundDocument>({
    title: { type: String, required: true },
    price: { type: Number, required: true },
    description: { type: String, required: true },
    location: { type: String, required: true },
    images: [
        {
            url: { type: String, required: true },
            filename: { type: String, required: true }
        }
    ],
    author: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    reviews: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Review',
        }
    ]
});

// Middleware for deleting related reviews when a campground is deleted
CampgroundSchema.post('findOneAndDelete', async function(doc) {
    if (doc) {
        try {
            await Review.deleteMany({
                _id: {
                    $in: doc.reviews
                }
            });
            console.log(`Deleted related reviews for campground ${doc._id}`);
        } catch (error) {
            console.error('Error deleting related reviews:', error);
        }
    } else {
        console.log('No Campground found to delete');
    }
});

const CampgroundModel = mongoose.model<CampgroundDocument>('Campground', CampgroundSchema);

export default CampgroundModel;
