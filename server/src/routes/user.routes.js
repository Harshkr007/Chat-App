import express from 'express';
import { loginUser, logoutUser, registerUser, searchUser, updateUser, userDetails } from '../controllers/user.controller.js';
import authenticate from '../middleware/auth.middleware.js';

const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.put('/update',authenticate, updateUser);
router.post('/logout',authenticate, logoutUser);
router.get('/user-details',authenticate,userDetails);
router.post("/search-user", authenticate, searchUser);


export default router;