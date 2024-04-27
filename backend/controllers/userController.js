import asyncHandler from 'express-async-handler';
import {User, validateUser as validate} from '../models/userModel.js';
import generateToken from '../utils/generateToken.js';
import bcrypt from 'bcryptjs';

//@desc Auth User/ set token
//@route POST/api/Users/auth
//@access Public
const authUser = asyncHandler(async(req, res)=>{
  const {email, password} = req.body;

 try{
    const user = await User.findOne({email});
    if(user && (await user.matchPassword(password))){
        generateToken(res, user._id);
        res.status(201).json({user,
        message : "Login Successful"});
  } else {
    res.status(401.);
    throw new Error('User not found');  //unAuthorised
    
  } 
}
  catch(err){
    res.status(401).json({
        message : 'Invalid email or password'
    })
  }
  
});

//@desc Register User
//@route POST/api/Users/register
//@access Public
const registerUser = asyncHandler(async(req, res)=>{
    const { error } = validate(req.body)
    if (error) {
        return res.status(400).send(error.details[0].message)
    }
        //one method to create new user
        try {
             const {name, email} = req.body;

            const salt = await bcrypt.genSalt(10);
            const password = await bcrypt.hash(req.body.password, salt);

            const user = new User({
                name,
                email,
                password
            })
            if(user){
                const userExists = await User.findOne({email});
     
                if(userExists){
                    res.status(400);
                    throw new Error('User already Exists');
                    } else {
                        await user.save();
                        generateToken(res, user._id);
                        res.status(201).json(user); 
                            }
                     }  
        } catch (err) {
            res.status(400).json({ message: err.message })
        
    }



// try {
//     const {name, email, password} = req.body;

//     const userExists = await User.findOne({email});
//     if(userExists){
//             res.status(400);
//             throw new Error('User already Exists');
//         }

//                 const user = await User.create({
//                     name,
//                     email,
//                     password
//                 });
//                  if(user){
//                     generateToken(res, user._id);
//                     res.status(201).json(user); 
//             }  else {
//                 res.status(400);
//                 throw new Error('Invalid User data ');
//             }
//         } 

    
//     catch (err) {
//     res.status(400).json({ message: err.message });
//     }
});

//@desc Logout User
//@route POST/api/Users/logOut
//@access Public
const logOutUser = asyncHandler(async(req, res)=>{
    res.cookie('jwt', '' , {
        httpOnly : true,
        expires: new Date(0)
    })
    
    res.status(200).json({
        message: 'User Logged out'
    })

});

//@desc Profile of User
//@route GET/api/Users/Profile
//@access Private
const getProfileUser = asyncHandler(async(req, res)=>{

    const user = {
        _id: req.user._id,
        name: req.user.name,
        email: req.user.email

    }
    res.status(200).json(user);

});

//@desc Update profile of User
//@route PUT/api/Users/auth
//@access Private
const UpdateProfileUser = asyncHandler(async(req, res)=>{

    const user = await User.findById(req.user._id);

    if(user){
        user.name = req.body.name || user.name;
        user.email = req.body.email || user.email;

        if(req.body.password){
            user.password = req.body.password  ;
        }

        const updatedUserProfile = await user.save();

        res.status(200).json({
            _id: updatedUserProfile._id,
            name: updatedUserProfile.name,
            email :updatedUserProfile.email
        });

    }
    else {
        res.status(404).json({
            message: 'User not found'
        });
    }

    res.status(200).json({
        message: 'Update profile of User'
    })

});

export {authUser,
registerUser,
logOutUser,
getProfileUser,
UpdateProfileUser
};