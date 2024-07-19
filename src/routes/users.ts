import express from 'express';
// import * as userController from '../controller/userController';
import {signUp, login, getUserAndNote, logout, editUser, deleteUser, userInfo} from '../controller/userController';
import { auth } from '../middlewares/auth';

const router = express.Router();

// SIGNUP : REGISTER   //publish
router.post('/signup', signUp);
router.get('/signup', signUp);

// LOGIN   //publish
router.post('/login', login);
router.get('/login', login);

// READ/GET A USER INFO by id
router.get('/:id/info', userInfo)

// UPDATE A USER by id
router.post('/:id/edit', editUser)
router.get('/:id/edit', editUser)

// DELETE A USER by id
router.post('/:id/delete', deleteUser);

// GET ALL USERS by id
router.get('/all', getUserAndNote);

// LOGOUT A USER 
router.post('/logout', logout)


export default router;
