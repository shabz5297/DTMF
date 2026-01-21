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

//telegram send function
async function sendTelegram(text, chat_id) {
  await axios.post(`https://api.telegram.org/bot${TELEGRAM_TOKEN}/sendMessage`, {
    chat_id,
    text
  });
}

//which extension?
function extractExt(evt) {
  const cid = (evt.CallerIDNum || evt.ConnectedLineNum || '').trim();
  if (/^\d+$/.test(cid)) return cid;

  const ch = (evt.Channel || '').trim();

  let m = ch.match(/^PJSIP\/(\d+)-/);
  if (m) return m[1];

  m = ch.match(/^PJSIP\/(\d+)\//);
  if (m) return m[1];

  m = ch.match(/^Local\/(\d+)@/);
  if (m) return m[1];

  return '';
}
