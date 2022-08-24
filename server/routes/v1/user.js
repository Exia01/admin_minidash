import express from 'express';
import {
  index,
  getSingleUser,
  updateUser,
  deleteUser,
} from '../../controllers/user.js';
const router = express.Router();
//get all users,get single user,updateUser, updateUserPassword--not--implemented,

router.get('/', index);
router.get('/:user_id', getSingleUser);
router.patch('/:user_id', updateUser);
router.delete('/:user_id', deleteUser);

export default router;
