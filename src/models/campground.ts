import mongoose, { Document, Schema, Model } from 'mongoose';
import Review from './review'; // Adjust the import path as needed

interface CampgroundDocument extends Document {
    title: string;
    price: number;
    description: string;
    location: string;
    image: string;
    reviews: mongoose.Types.ObjectId[];
}

const CampgroundSchema = new Schema<CampgroundDocument>({
    title: { type: String, required: true },
    price: { type: Number, required: true },
    description: { type: String, required: true },
    location: { type: String, required: true },
    image: { type: String },
    reviews: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Review',
        }
    ]
});

// Regular function to ensure correct context
CampgroundSchema.post('findOneAndDelete', async function(doc) {
    if (doc) {
        try {
            await Review.deleteMany({
                _id: {
                    $in: doc.reviews
                }
            });
        } catch (error) {
            console.error('Error deleting related reviews:', error);
        }
    } else {
        console.log('No Campground found to delete');
    }
});

const CampgroundModel = mongoose.model<CampgroundDocument>('Campground', CampgroundSchema);

export default CampgroundModel;
