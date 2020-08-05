import database from '../../database/connection';

export default class ConnectionsService {

    constructor() { };

    async count() {
        try {
            const totalConnections = await database('connections').count('* as total');
            const total = totalConnections[0];
            return total;
        } catch (error) {
            throw error;
        }
    }

    async create(data: any) {
        try {
            const {
                user_id
            } = data;

            await database('connections').insert({
                user_id
            });
        } catch (error) {
            throw error;
        }
    }


}
