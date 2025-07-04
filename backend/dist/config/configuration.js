"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = () => {
    console.log('Loading configuration with OPENAI_API_KEY:', process.env.OPENAI_API_KEY ? 'Present' : 'Missing');
    return {
        database: {
            host: process.env.DATABASE_HOST || 'localhost',
            port: parseInt(process.env.DATABASE_PORT || '5432', 10),
            username: process.env.DATABASE_USERNAME || 'postgres',
            password: process.env.DATABASE_PASSWORD || 'Veerendra21@',
            database: process.env.DATABASE_NAME || 'nest',
        },
        jwt: {
            secret: process.env.JWT_SECRET || 'your-secret-key',
            expiresIn: process.env.JWT_EXPIRES_IN || '1d',
        },
        openai: {
            apiKey: process.env.OPENAI_API_KEY || '',
        },
        aws: {
            accessKeyId: process.env.AWS_ACCESS_KEY_ID || '',
            secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || '',
            region: process.env.AWS_REGION || 'us-east-1',
        },
    };
};
//# sourceMappingURL=configuration.js.map