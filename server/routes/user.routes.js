import express from 'express'
import { login, register, resetPasssword, verifyUser, requestResetPassword } from '../controller/user.controller.js';
const router = express.Router();

router.post('/register', register);
router.get('/verify/:token', verifyUser);
router.post('/login', login);
router.post('/request-password-reset', requestResetPassword);
router.get('/reset-password/:token', resetPasssword);

export default router;