import express from 'express'

import { index, show, create, update, destroy } from '../controllers/UserController.js'

const userRoute = express.Router()

userRoute.get('/', index)
userRoute.get('/:id', show)
userRoute.post('/', create)
userRoute.put('/:id', update)
userRoute.delete('/:id', destroy)

export default userRoute