import express from 'express';
import {createNote, deleteNote, updateNote, dashboard, getNoteById} from '../controller/noteController';

import { auth } from '../middlewares/auth';

const router = express.Router();

// USER NOTES DASHBOARD: & PROFILE  //publish
router.get('/', auth, dashboard);

// CREATE A NOTE  //publish
router.post('/create', auth, createNote);
router.get('/create', auth, createNote);

// READ/GET A NOTE by id  //publish
router.get('/:id/info', getNoteById)

// UPDATE A NOTE by id   //publish
router.put('/:id/update-note', auth, updateNote);
router.get('/:id/update-note', auth, updateNote);

// DELETE A NOTE by id
router.delete('/:id/delete-note', auth, deleteNote);

export default router;
