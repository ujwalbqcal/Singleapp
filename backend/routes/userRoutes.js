import express from 'express';
import { authUser, registerUser, logOutUser, getProfileUser, UpdateProfileUser } from '../controllers/userController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/' , registerUser);
router.post('/auth' , authUser);
router.post('/logout' , logOutUser);
router.route('/profile')
.get(protect, getProfileUser)
.put(protect, UpdateProfileUser);


export  default router;