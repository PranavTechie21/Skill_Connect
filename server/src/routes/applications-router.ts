import { Router } from 'express';
import { createApplication, getUserApplications } from '../routes/applications';
import { auth } from './auth';

const router = Router();

router.use(auth);
router.post('/applications/quick-apply', createApplication);
router.get('/applications/user', getUserApplications);

export default router;