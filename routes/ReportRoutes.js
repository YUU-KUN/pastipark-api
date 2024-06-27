import express from 'express'

import { index, show, create, update, destroy, getStatistics, detectLicencePlate } from '../controllers/ReportController.js'
import { verifyUser } from '../middlewares/Auth.js'
import { upload } from '../middlewares/UploadFile.js'

const cpUpload = upload.fields([{ name: 'evidences', maxCount: 5, mimetype: 'image/*' }])
const reportRoute = express.Router()

reportRoute.get('/', verifyUser, index)
reportRoute.get('/statistics', verifyUser, getStatistics)
reportRoute.post('/detect-lisence-plate', verifyUser, upload.single('evidence'), detectLicencePlate)
reportRoute.get('/:id', verifyUser, show)
reportRoute.post('/', verifyUser, upload.single('evidences'), create)
// reportRoute.post('/', verifyUser, upload.array('evidences', 5), create)
reportRoute.patch('/:id', verifyUser, update)
reportRoute.delete('/:id', verifyUser, destroy)

export default reportRoute