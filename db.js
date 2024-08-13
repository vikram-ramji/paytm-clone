const mongoose = require("mongoose")
const argon2 = require("argon2")
const dotenv = require("dotenv")

dotenv.config()

mongoose.connect("mongodb://localhost:27017/paytm")

const userSchema = mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true,
        minlength: 3,
        maxlength: 30
    },
    password: {
        type: String,
        required: true,
        minlength: 6
    },
    firstName: {
        type: String,
        required: true,
        trim: true,
        maxlength: 30
    },
    lastName: {
        type: String,
        required: true,
        trim: true,
        maxlength: 30
    }
})

userSchema.methods.createHash = async (plainTextPassword) => {
    return await argon2.hash(plainTextPassword);
}

userSchema.methods.validatePassword = async (candidatePassword) => {
    return await argon2.verify(this.password_hash, candidatePassword)
}

const accountSchema = mongoose.Schema({
    userId : {
        type: mongoose.Schema.Types.ObjectId, //Reference to User model
        ref: "User",
        required: true
    },
    balance : {
        type: Number,
        required: true
    }
})

const User = mongoose.model("User", userSchema)
const Account = mongoose.model("Account", accountSchema)

module.exports = {
    User,
    Account
}