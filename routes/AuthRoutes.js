import express from 'express'

import { register, login, getProfile, logout } from '../controllers/AuthController.js'
import { verifyUser } from '../middlewares/Auth.js'

const authRoutes = express.Router()

authRoutes.post('/register', register)
authRoutes.post('/login', login)
authRoutes.post('/logout', verifyUser, logout)
authRoutes.get('/profile', verifyUser, getProfile)

export default authRoutes