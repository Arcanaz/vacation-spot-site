import mongoose, { Document, Schema} from 'mongoose';
import passportLocalMongoose from 'passport-local-mongoose';


interface UserDocument extends Document {
    email: string;
}

const UserSchema = new Schema<UserDocument>({
    email: {
        type: String,
        required: true,
        unique: true,
    }
});

UserSchema.plugin(passportLocalMongoose); 

const User = mongoose.model<UserDocument>('User', UserSchema); //Adds password and username field and stuff.
export default User;