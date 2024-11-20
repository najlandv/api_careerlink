import express from 'express';
import { gantiPassword } from '../controller/ubahpwController.js';
import authenticate from '../middleware/authenticate.js';

const ubahpwRoute = express.Router();

// Endpoint untuk ganti password
ubahpwRoute.patch('/ubah-password', authenticate, gantiPassword);

export default ubahpwRoute;
