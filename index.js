const express = require('express');
const cors = require('cors');
const { Client } = require('whatsapp-web.js');
const qrcode = require( 'qrcode-terminal');

const { IP, PORT, ADMIN_PHONE } = require('./config');

const app = express();
const port = PORT;
const ip = IP;

// API to update JSON file
app.use(express.json());
app.use(cors());


const client = new Client({
  puppeteer: {
    args: ['--no-sandbox'],
  },
});

client.on('qr', qr => {
    qrcode.generate(qr, { small: true });
});

client.on('ready', () => {
    console.log('Successfully connected to WhatsApp!');
});

async function sendMessageAdmin(info) {
    const admin_chatId = `${ADMIN_PHONE}@c.us`;
    try {
      await client.sendMessage(admin_chatId, info.text)
      console.log(`SUCCESS: Message sent to ADMIN`);
      return true; // Return true if the message is sent
    } catch (error) {
      console.log(`ERROR: sending message to admin`, error);
      return false; // Return false in case of an error
    }
  }


// API endpoint for sending a message to a single recipient
app.post('/api/sendadmin', async (req, res) => {
    const info = req.body;

    console.log(info);
  
    if (!info || !info.text) {
      return res.status(400).json({ error: 'Invalid request body' });
    }
  
    const result = await sendMessageAdmin(info);
  
    if (result) {
      return res.json({ success: 'Message ADMIN sent successfully' });
    } else {
      return res.status(500).json({ error: 'Failed to send ADMIN message' });
    }
  });
  



// Start the server
app.listen(port, () => {
    console.log(`Server is running on http://${ip}:${port}`);
    client.initialize();
  });