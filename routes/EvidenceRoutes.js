import express from 'express'

import { index, show, create, update, destroy } from '../controllers/EvidenceController.js'
import { verifyUser } from '../middlewares/Auth.js'

const evidenceRoute = express.Router()

evidenceRoute.get('/', verifyUser, index)
evidenceRoute.get('/:id', verifyUser, show)
evidenceRoute.post('/', verifyUser, create)
evidenceRoute.put('/:id', verifyUser, update)
evidenceRoute.delete('/:id', verifyUser, destroy)

export default evidenceRoute