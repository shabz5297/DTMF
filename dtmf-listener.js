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

//where tones are stored
const buffers = Object.create(null);

//rules for max,min and submission and buffer TTL
const MIN_LEN = Number(process.env.MIN_LEN || 4);
const MAX_LEN = Number(process.env.MAX_LEN || 10);
const TERMINATOR = Number(process.env.BUFFER_TTL_MS || 30_000);

