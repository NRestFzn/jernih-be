import express, {Router} from 'express';

const routes: Router = express.Router();

export default routes;
require('../controllers/auth/controller');
require('../controllers/posts/controller');
