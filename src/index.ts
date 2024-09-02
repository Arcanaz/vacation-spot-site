import mongoose from "mongoose";
import Campground from "./models/campground";
import { cities } from "./seeds/cities";
import { places, descriptors } from "./seeds/seedHelpers";
import fs from 'fs';
import path from 'path';

// Connect to the database
const connectDB = async (): Promise<void> => {
    try {
        await mongoose.connect("mongodb://localhost:27017/yelp-camp", {
            // Additional options if needed
        });
        console.log("Database connected");
    } catch (error) {
        console.error("Connection error:", error);
        process.exit(1); // Exit the process if connection fails
    }
};

connectDB();

// Function to get a random item from an array
const sampleName = (array: string[]): string =>
    array[Math.floor(Math.random() * array.length)];

// Read image URLs from file
const readImageUrls = (filePath: string): string[] => {
    try {
        const data = fs.readFileSync(filePath, 'utf8');
        return data.split('\n').filter(url => url.trim() !== '');
    } catch (error) {
        console.error('Error reading image URLs:', error);
        return [];
    }
};

// Path to your txt file
const imageUrlsPath = path.resolve(__dirname, '../img/imgurl.txt');
const imageUrls = readImageUrls(imageUrlsPath);

// Function to seed the database
const seedDB = async () => {
    await Campground.deleteMany({}); // Clear existing campgrounds

    // Generate and save 25 campgrounds
    for (let i = 0; i < 25; i++) {
        const random1000 = Math.floor(Math.random() * 1000);
        const camp = new Campground({
            title: `${sampleName(descriptors)} ${sampleName(places)}`,
            price: (Math.random() * 100).toFixed(2),
            location: `${cities[random1000].city}, ${cities[random1000].state}`,
            image: imageUrls[Math.floor(Math.random() * imageUrls.length)], // Use a random image URL
            description: 'Lorem ipsum, dolor sit amet consectetur adipisicing elit. Inventore aliquid in iure. Asperiores, iure? Voluptatum error nulla, atque accusantium quis, voluptatibus, temporibus aliquam vitae sed ullam ratione! Eos, exercitationem totam. Lorem, ipsum dolor sit amet consectetur adipisicing elit. Hic iure ut, cupiditate error eum reprehenderit, consectetur quisquam deserunt corrupti ea exercitationem explicabo voluptas obcaecati, deleniti esse id sint laboriosam. Modi?'
        });
        await camp.save();
    }
};

// Run the seed function and close the database connection
seedDB().then(() => {
    mongoose.connection.close();
});
