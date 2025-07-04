import { Celebrity } from '../../celebrity/entities/celebrity.entity';
import { Notification } from './notification.entity';
export declare class Fan {
    id: string;
    name: string;
    email: string;
    password: string;
    followedCelebrities: Celebrity[];
    notifications: Notification[];
    createdAt: Date;
    updatedAt: Date;
}
