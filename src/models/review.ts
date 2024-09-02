import mongoose, { Document, Schema, Model } from 'mongoose';

// Correcting the interface definition (removing duplicate 'interface' keyword)
interface CampgroundDocument extends Document {
    body: string;  // Use lowercase 'string' for TypeScript types
    rating: number; // Use lowercase 'number' for TypeScript types
    _id: mongoose.Types.ObjectId;  // Explicitly define _id
}

// Correcting the Mongoose schema type definition
const reviewSchema = new Schema<CampgroundDocument>({
    body: { type: String, required: true },   // Use capitalized 'String' for Mongoose types
    rating: { type: Number, required: true }, // Use capitalized 'Number' for Mongoose types
    
});

// (Optional) Create a model if needed
const Review: Model<CampgroundDocument> = mongoose.model<CampgroundDocument>('Review', reviewSchema);

export default Review;


