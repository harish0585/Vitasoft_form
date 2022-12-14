const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');
const validator = require('validator');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Please enter your name"],
        maxlength: [30, "Your name cannot exceed 30 characters"]
    },
    email: {
        type: String,
        required: [true, "Please enter your email"],
        unique: true,
        validate: [validator.isEmail, "Please enter a valid email address"],

    },
    password: {
        type: String,
        required: [true, "Please enter your password"],
        minlength: [6, "Your password must be at longer than 6 characters"],
        select: false
    },

    role: {
        type: String,
        default: "user"
    },

    createdAt: {
        type: Date,
        default: Date.now()
    },
    resetPasswordToken: String,
    resetPasswordExpire: Date
})

// Encrypting the password before saving
userSchema.pre("save", async function (next) {
    if (!this.isModified("password")) {
        next();
    }

    this.password = await bcrypt.hash(this.password, 10);
})


// compare user password
userSchema.methods.comparePassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password)
}


// Return JWT token
userSchema.methods.getJwtToken = function () {
    return jwt.sign({ id: this.id }, "ASDFGHNG123432SDFGBNBVFD345SDFGGFD3456SDFVB", {
        expiresIn: "7d"
    })
}


// Generate password reset token
userSchema.methods.getResetPasswordToken = function () {
    // Generate token
    const resetToken = crypto.randomBytes(20).toString("hex");

    // Hash and set to resetPasswordToken
    this.resetPasswordToken = crypto.createHash("sha256").update(resetToken).digest("hex");

    // Set token expire time
    this.resetPasswordExpire = Date.now() + + 30 * 60 * 1000;

    return resetToken;

}



module.exports = mongoose.model("User", userSchema);