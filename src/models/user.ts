import mongoose, { Schema } from 'mongoose';
import passportLocalMongoose from 'passport-local-mongoose';

// No need to manually extend Passport types, let passport-local-mongoose handle it
interface UserDocument extends mongoose.PassportLocalDocument {
    email: string;
    username: string;
}

const UserSchema = new Schema<UserDocument>({
    email: {
        type: String,
        required: true,
        unique: true,
    },
    username: {
        type: String,
        required: true,
        unique: true, // Enforce unique usernames
    }
});

// Add the passport-local-mongoose plugin
UserSchema.plugin(passportLocalMongoose);

const User = mongoose.model<UserDocument>('User', UserSchema);
export default User;
