import express from 'express'
import { deleteUser, fetchUser, updateUser } from '../controllers/userController';

const router= express.Router();

router.post('/',fetchUser);
router.put('/update',updateUser);
router.delete('/delete',deleteUser)

export default router;