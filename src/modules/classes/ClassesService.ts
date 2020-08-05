import database from '../../database/connection';
import ScheduleItem from '../../interfaces/schedule-item';
import converteHourToMinutes from '../../utils/convert-hours-to-minutes';

export default class ClassesService {

    constructor() { };
    async find(filters: any) {
        try {
            const subject = filters.subject as string;
            const week_day = filters.week_day as string;
            const time = filters.time as string;
            const timeInMinutes = converteHourToMinutes(time);
            console.log(timeInMinutes);

            const classes = await database('classes')
                .select('classes.*', 'users.*')
                .join('users', 'classes.user_id', '=', 'users.id')
                .where('classes.subject', '=', subject)
                .whereExists(function () {
                    this.select('class_schedule.*')
                        .from('class_schedule')
                        .whereRaw('`class_schedule`.`class_id` = `classes`.`id`')
                        .whereRaw('`class_schedule`.`week_day` = ??', [Number(week_day)])
                        .whereRaw('`class_schedule`.`from` <= ??', [timeInMinutes])
                        .whereRaw('`class_schedule`.`to` > ??', [timeInMinutes]);
                });
            return classes;
        } catch (error) {
            throw error;
        }
    }
    async create(data: any) {
        const {
            name,
            avatar,
            whatsapp,
            bio,
            subject,
            cost,
            schedule
        } = data;

        const transaction = await database.transaction();

        try {
            const insertedUsersIds = await transaction('users').insert({
                name,
                avatar,
                whatsapp,
                bio
            });
            const user_id = insertedUsersIds[0];

            const insertedClassesIds = await transaction('classes').insert({
                subject,
                cost,
                user_id
            });
            const class_id = insertedClassesIds[0];

            const classSchedule = schedule.map((element: ScheduleItem) => {
                return {
                    class_id,
                    week_day: element.week_day,
                    from: converteHourToMinutes(element.from),
                    to: converteHourToMinutes(element.to)
                }
            });

            await transaction('class_schedule').insert(classSchedule);
            await transaction.commit();
        } catch (error) {
            await transaction.rollback();
            throw error;
        }
    }
}