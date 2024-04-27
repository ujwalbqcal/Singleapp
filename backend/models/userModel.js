import mongoose from "mongoose";
import Joi from 'joi';
import bcrypt from "bcryptjs";

const userSchema = mongoose.Schema ({
    name: {
        type: String,
        required: true,
        min: 3,
        max: 100
    },
    email: {
        type: String,
        required: true,
        unique: true,
        min: 5,
        max: 255
    },
     password: {
        type: String,
        required: true,
        min: 5,
        max: 100
    }
},
{
    timestamps: true
});

 const validateUser = (user) => {
    const schema = Joi.object({
        name: Joi.string().min(3).max(100).required(),
        email: Joi.string().min(5).max(255).required().email(),
        password: Joi.string().min(3).max(100).required()
    })
    return schema.validate(user)
}

userSchema.methods.matchPassword = async function(enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
}

// to hash password
// userSchema.pre('save', async function (next){
//     if(!this.isModified('password')) {
//         next();

//     }
//     const salt = await bcrypt.genSalt(0);
//     this.password =  bcrypt.hash(this.password,salt);
// })

const User = mongoose.model('User', userSchema);

export {User, validateUser};
