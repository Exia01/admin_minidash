import express from 'express';

import { registerUser, loginUser, logoutUser } from '../../controllers/auth.js';

const router = express.Router();

//register,login

router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/logout', logoutUser);

export default router;
