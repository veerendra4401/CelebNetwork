export declare enum CelebrityCategory {
    SINGER = "Singer",
    SPEAKER = "Speaker",
    ACTOR = "Actor"
}
export declare class Celebrity {
    id: string;
    name: string;
    category: CelebrityCategory;
    country: string;
    instagramUrl: string;
    fanbase: number;
    setlist: string[];
    socialStats: {
        instagram?: number;
        youtube?: number;
        spotify?: number;
    };
    description: string;
    genres: string[];
    recentPerformances: {
        date: string;
        venue: string;
        location: string;
    }[];
    createdAt: Date;
    updatedAt: Date;
}
