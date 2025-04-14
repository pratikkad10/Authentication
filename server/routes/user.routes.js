import express from 'express'
import { login, register, verifyUser } from '../controller/user.controller';
const router = express.Router();

router.post('/register', register);
router.post('/verify/:token', verifyUser);
router.post('/login', login);

export default router;