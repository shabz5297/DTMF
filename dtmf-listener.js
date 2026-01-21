//imports for AMI connection and Telegram HTTPS API
const AmiClient = require('asterisk-ami-client');
const axios =  require('axios')

//config
const AMI_CONFIG = {
    host: process.env.AMI_HOST || '127.0.0.1',
    port: Number(process.env.AMI_PORT || 5038),
    username: process.env.AMI_USER || '...',
    secret: process.env.AMI_SECRET || '...',
};

