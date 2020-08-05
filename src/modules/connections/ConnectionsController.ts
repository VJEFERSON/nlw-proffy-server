import { Request, Response } from 'express';
import ConnectionsService from './ConnectionsService';

export default class ConnectionsController {

    constructor() { };

    async count(request: Request, response: Response) {
        try {
            const service = new ConnectionsService();
            const totalConnections = await service.count();
            return response.json(totalConnections);
        } catch (error) {
            return response.status(400).json({ error: 'Unexpected error while finding new connection', message: error.message });
        }
    }

    async create(request: Request, response: Response) {
        try {
            const service = new ConnectionsService();
            await service.create(request.body);
            return response.status(201).send();
        } catch (error) {
            return response.status(400).json({ error: 'Unexpected error while creating new connection', message: error.message });
        }
    }

}
