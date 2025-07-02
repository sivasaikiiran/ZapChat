import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique : true,
    },
    password: {
        type: String,
        required : true
    },
    firstName: {
        type: String,
        required : true
    },
    lastName: {
        type: String,
        required : true,
    },
    imageUrl: {
        type: String,
        required: true,
        default : "https://img.freepik.com/free-vector/blue-circle-with-white-user_78370-4707.jpg?size=338&ext=jpg&ga=GA1.1.1819120589.1727740800&semt=ais_hybrid"
    },
})

const UserModel = mongoose.model("user", userSchema)

export default UserModel