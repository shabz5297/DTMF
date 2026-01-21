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

//stabilising buffer key
function keyOf(evt) {
  return evt.Uniqueid || evt.Linkedid || evt.Channel || 'unknown';
}

//clean loop to prevent stale bufferes
setInterval(cleanupExpired, 5_000).unref();

//log into amy and tell it to send svents 
await client.connect(username, secret, { host, port });
await client.action({ Action: 'Events', EventMask: 'on' });



//Ignore all AMI events except DTMF
client.on('event', evt => {
  if (evt.Event !== 'DTMFEnd') return;
  const digit = evt.Digit;
  ...
});

//buffer creation and update
if (!buffers[key]) {
  buffers[key] = { digits:'', lastTs: now, caller:..., channel:..., extenGuess:... };
} else {
  buffers[key].lastTs = now;
  ...
}

//submission
if (digit === TERMINATOR) {
  const guess = buf.digits;

  if (guess.length >= MIN_LEN && guess.length <= MAX_LEN) {
    const ext = buf.extenGuess || 'unknown';
    const msg = `Guess ... Digits: ${guess}`;
    console.log(msg);

    const chatId = EXTENSION_MAP[ext];
    if (chatId) sendTelegram(msg, chatId);
  }

  delete buffers[key];
  return;
}

//normal numbers with no submission should append
buf.digits += digit;
if (buf.digits.length > MAX_LEN) buf.digits = buf.digits.slice(-MAX_LEN);
console.log(`Buffer[...] = ${buf.digits}`);
