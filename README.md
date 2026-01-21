# DTMF Tone Listener (Asterisk AMI + Telegram Webapp)

A lightweight Node.js service that connects to a FreePBX/Asterisk server using AMI (Asterisk Manager Interface),
captures DTMF keypad input during live calls, and forwards validated tones to webapp.

This project was built as part of my ongoing work in telephony automation and VoIP system development
(FreePBX/Asterisk, SIP routing, Linux server management).

------------

## Features

- **AMI Event Listener**: Subscribes to Asterisk AMI events and filters for `DTMFEnd`
- **Reliable Digit Buffering**: Builds a digit buffer per call leg (keyed by `Uniqueid`)
- **Guess Submission Logic**: Uses a terminator key (default `#`) to submit a guess
- **Validation Rules**: Enforces minimum and maximum digit length for guesses
- **Per-Extension Routing**: Sends Telegram messages based on `EXT_MAP` (extension → chat_id)
- **Timeout Cleanup**: Automatically clears inactive buffers to prevent memory buildup

---

## Why `DTMFEnd`?

This listener processes **DTMFEnd** instead of DTMFBegin for more consistent results across SIP clients
and to reduce duplicate events.

---

## Requirements

- Asterisk / FreePBX server with AMI enabled
- Node.js (recommended: Node 18+)
- SIP endpoints using RFC4733 / RTP DTMF recommended

---

## Installation

```bash
git clone https://github.com/shabz5297/DTMF.git
cd DTMF
npm install
