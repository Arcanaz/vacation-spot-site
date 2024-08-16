import mongoose, { Document, Schema, Model, model } from 'mongoose';
// const Schema = mongoose.Schema; //Shortens this call to just Schema

interface CampgroundDocument extends Document { //Document is a type from Mongoose
    title: string;
    price: string;
    description: string;
    location: string;
}

const CampgroundSchema = new Schema<CampgroundDocument>({
    title: { type: String, required: true },
    price: { type: String, required: true },
    // description: { type: String, required: true },
    location: { type: String, required: true }
});


const CampgroundModel: Model<CampgroundDocument> = mongoose.model<CampgroundDocument>('Campground', CampgroundSchema);

export default CampgroundModel;

// module.exports = mongoose.model('Campground', CampgroundSchema);