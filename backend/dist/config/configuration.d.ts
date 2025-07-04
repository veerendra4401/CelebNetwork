declare const _default: () => {
    database: {
        host: string;
        port: number;
        username: string;
        password: string;
        database: string;
    };
    jwt: {
        secret: string;
        expiresIn: string;
    };
    openai: {
        apiKey: string;
    };
    aws: {
        accessKeyId: string;
        secretAccessKey: string;
        region: string;
    };
};
export default _default;
