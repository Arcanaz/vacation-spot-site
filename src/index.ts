import mongoose from "mongoose"; //mongoose initializing starts
import Campground from "./models/campground";
import {cities} from "./seeds/cities";
import {places, descriptors}  from "./seeds/seedHelpers";

const connectDB = async (): Promise<void> => {
    try {
    await mongoose.connect("mongodb://localhost:27017/yelp-camp", {
      // You can specify additional options here if needed
    });
    console.log("Database connected");
    } catch (error) {
    console.error("Connection error:", error);
    process.exit(1); // Exit the process if connection fails
    }
}; //mongoose initializing ends

// export default connectDB;
connectDB();

const sampleName = (array: string[]): string =>
  array[Math.floor(Math.random() * array.length)];

const seedDB = async () => {
    await Campground.deleteMany({});
    for (let i = 0; i < 25; i++) {
    const random1000 = Math.floor(Math.random() * 1000);
    const camp = new Campground({
        title: `${sampleName(descriptors)} ${sampleName(places)}`,
        price: (Math.random() * 100).toFixed(2),
        location: `${cities[random1000].city}, ${cities[random1000].state} `,
    });
    await camp.save();
    }
};

seedDB().then(() => {
    mongoose.connection.close();
})