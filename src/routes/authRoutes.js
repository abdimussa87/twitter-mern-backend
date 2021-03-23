import express from 'express'
import { signup, signin } from '../controller/authController.js'
import { signupValidator, signinValidator, isRequestValidated } from '../validators/authValidator.js';
const router = express.Router()

router.post('/signup', signupValidator, isRequestValidated, signup);
router.post('/signin', signinValidator, isRequestValidated, signin);

export default router;