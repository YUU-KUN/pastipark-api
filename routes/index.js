import express from 'express';
import userRoute from './UserRoutes.js';
import reportRoute from './ReportRoutes.js';
import evidenceRoute from './EvidenceRoutes.js';
import authRoutes from './AuthRoutes.js';
import { verifyUser } from '../middlewares/Auth.js';

const routes = express.Router();

routes.get('/', (req, res) => {
    res.send('Hello from PastiPark API')
})


routes.use('/users', verifyUser, userRoute)
routes.use('/reports', reportRoute)
routes.use('/evidences', evidenceRoute)
routes.use('/auth', authRoutes)

export default routes