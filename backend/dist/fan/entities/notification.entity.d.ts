import { Fan } from './fan.entity';
export declare enum NotificationType {
    PERFORMANCE = "performance",
    UPDATE = "update",
    ANNOUNCEMENT = "announcement"
}
export declare class Notification {
    id: string;
    type: NotificationType;
    title: string;
    message: string;
    isRead: boolean;
    date: Date;
    fan: Fan;
}
