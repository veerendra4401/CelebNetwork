import { Repository } from 'typeorm';
import { Fan } from './entities/fan.entity';
import { CelebrityService } from '../celebrity/celebrity.service';
import { Celebrity } from '../celebrity/entities/celebrity.entity';
export declare class FanService {
    private readonly fanRepository;
    private readonly celebrityService;
    constructor(fanRepository: Repository<Fan>, celebrityService: CelebrityService);
    create(createFanDto: Partial<Fan>): Promise<Fan>;
    findAll(): Promise<Fan[]>;
    findOne(id: string): Promise<Fan>;
    findByEmail(email: string): Promise<Fan>;
    update(id: string, updateFanDto: Partial<Fan>): Promise<Fan>;
    remove(id: string): Promise<void>;
    followCelebrity(fanId: string, celebrity: Celebrity): Promise<Fan>;
    unfollowCelebrity(fanId: string, celebrityId: string): Promise<Fan>;
    getDashboard(fanId: string): Promise<{
        followedCelebrities: Celebrity[];
        totalFollowing: number;
    }>;
    updateSettings(id: string, updateSettingsDto: any): Promise<Fan>;
    getNotifications(id: string): Promise<import("./entities/notification.entity").Notification[]>;
    markNotificationAsRead(fanId: string, notificationId: string): Promise<Fan>;
}
