import express from 'express';
import ClassesController from './modules/classes/ClassesController';
import ConnectionsController from './modules/connections/ConnectionsController';

const routes = express.Router();
const classesController = new ClassesController();
const connectionsController = new ConnectionsController();

routes.get('/classes', classesController.find);
routes.post('/classes', classesController.create);

routes.get('/connections', connectionsController.count);
routes.post('/connections', connectionsController.create);

export default routes;