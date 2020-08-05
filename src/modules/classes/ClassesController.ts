import { Request, Response } from 'express';
import ClassesService from './ClassesService';

export default class ClassesController {

    constructor() { };

    async find(request: Request, response: Response) {
        try {
            const filters = request.query;

            if (!filters.subject || !filters.week_day || !filters.time) {
                return response.status(400).json({
                    error: 'Missing filters', message: 'Missing filters to search classes',
                });
            }

            const service = new ClassesService();
            const classes = await service.find(filters);
            return response.status(200).send(classes);
        } catch (error) {
            return response.status(400).json({ error: 'Unexpected error while creating new class', message: error.message });
        }
    }

    async create(request: Request, response: Response) {
        try {
            const service = new ClassesService();
            await service.create(request.body);
            return response.status(201).send();
        } catch (error) {
            return response.status(400).json({ error: 'Unexpected error while creating new class', message: error.message });
        }
    }


}
