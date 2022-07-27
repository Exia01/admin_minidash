import express from 'express';

import { registerUser, loginUser } from '../../controllers/auth.js';

const router = express.Router();

//register,login

router.post('/register', registerUser);
router.post('/login', loginUser);

export default router;
