import { FanService } from './fan.service';
import { Fan } from './entities/fan.entity';
import { CelebrityService } from '../celebrity/celebrity.service';
export declare class FanController {
    private readonly fanService;
    private readonly celebrityService;
    constructor(fanService: FanService, celebrityService: CelebrityService);
    create(createFanDto: Partial<Fan>): Promise<Fan>;
    findAll(): Promise<Fan[]>;
    findOne(id: string): Promise<Fan>;
    getFollowedCelebrities(id: string): Promise<import("../celebrity/entities/celebrity.entity").Celebrity[]>;
    update(id: string, updateFanDto: Partial<Fan>): Promise<Fan>;
    remove(id: string): Promise<{
        message: string;
    }>;
    followCelebrity(fanId: string, celebrityId: string): Promise<Fan>;
    unfollowCelebrity(fanId: string, celebrityId: string): Promise<Fan>;
    getDashboard(id: string): Promise<{
        followedCelebrities: import("../celebrity/entities/celebrity.entity").Celebrity[];
        totalFollowing: number;
    }>;
    updateSettings(id: string, updateSettingsDto: any): Promise<Fan>;
    getNotifications(id: string): Promise<import("./entities/notification.entity").Notification[]>;
    markNotificationAsRead(id: string, notificationId: string): Promise<Fan>;
}
