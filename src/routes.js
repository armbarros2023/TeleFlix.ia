import { Router } from 'express';

import SessionController from './app/controllers/SessionController.js';

const routes = new Router();

routes.post('/sessions', SessionController.store);

routes.get('/', (req, res) => {
    return res.json({ message: 'Hello World' });
});

export default routes;
