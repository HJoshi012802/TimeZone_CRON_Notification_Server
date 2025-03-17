const bodyParser = require('body-parser');
const express = require('express');
const axios = require('axios');
const admin = require('firebase-admin');
const cron = require("node-cron");
const dotenv = require("dotenv");

dotenv.config(); 

const filemanager = {
  type: "service_account",
  project_id: process.env.FILE_MANAGER_PROJECT_ID,
  private_key_id: process.env.FILE_MANAGER_PRIVATE_KEY_ID,
  private_key: process.env.FILE_MANAGER_PRIVATE_KEY.replace(/\\n/g, "\n"), // Fix new line issue
  client_email: process.env.FILE_MANAGER_CLIENT_EMAIL,
  client_id: process.env.FILE_MANAGER_CLIENT_ID,
  auth_uri: process.env.AUTH_URI,
  token_uri: process.env.TOKEN_URI,
  auth_provider_x509_cert_url: process.env.AUTH_PROVIDER_CERT_URL,
  client_x509_cert_url: process.env.FILE_MANAGER_CLIENT_CERT_URL,
  universe_domain: process.env.UNIVERSE_DOMAIN,
};

const videoplayer = {
  type: "service_account",
  project_id: process.env.VIDEO_PLAYER_PROJECT_ID,
  private_key_id: process.env.VIDEO_PLAYER_PRIVATE_KEY_ID,
  private_key: process.env.VIDEO_PLAYER_PRIVATE_KEY.replace(/\\n/g, "\n"), // Fix new line issue
  client_email: process.env.VIDEO_PLAYER_CLIENT_EMAIL,
  client_id: process.env.VIDEO_PLAYER_CLIENT_ID,
  auth_uri: process.env.AUTH_URI,
  token_uri: process.env.TOKEN_URI,
  auth_provider_x509_cert_url: process.env.AUTH_PROVIDER_CERT_URL,
  client_x509_cert_url: process.env.VIDEO_PLAYER_CLIENT_CERT_URL,
  universe_domain: process.env.UNIVERSE_DOMAIN,
};

const ZxFileManager = {
  type: "service_account",
  project_id: process.env.ZX_FILE_MANAGER_PROJECT_ID,
  private_key_id: process.env.ZX_FILE_MANAGER_PRIVATE_KEY_ID,
  private_key: process.env.ZX_FILE_MANAGER_PRIVATE_KEY.replace(/\\n/g, "\n"), // Fix new line issue
  client_email: process.env.ZX_FILE_MANAGER_CLIENT_EMAIL,
  client_id: process.env.ZX_FILE_MANAGER_CLIENT_ID,
  auth_uri: process.env.AUTH_URI,
  token_uri: process.env.TOKEN_URI,
  auth_provider_x509_cert_url: process.env.AUTH_PROVIDER_CERT_URL,
  client_x509_cert_url: process.env.ZX_FILE_MANAGER_CLIENT_CERT_URL,
  universe_domain: process.env.UNIVERSE_DOMAIN,
};

const LightVideoPlayer = {
  type: "service_account",
  project_id: process.env.LIGHT_VIDEO_PLAYER_PROJECT_ID,
  private_key_id: process.env.LIGHT_VIDEO_PLAYER_PRIVATE_KEY_ID,
  private_key: process.env.LIGHT_VIDEO_PLAYER_PRIVATE_KEY.replace(/\\n/g, "\n"), // Fix new line issue
  client_email: process.env.LIGHT_VIDEO_PLAYER_CLIENT_EMAIL,
  client_id: process.env.LIGHT_VIDEO_PLAYER_CLIENT_ID,
  auth_uri: process.env.AUTH_URI,
  token_uri: process.env.TOKEN_URI,
  auth_provider_x509_cert_url: process.env.AUTH_PROVIDER_CERT_URL,
  client_x509_cert_url: process.env.LIGHT_VIDEO_PLAYER_CLIENT_CERT_URL,
  universe_domain: process.env.UNIVERSE_DOMAIN,
};


const MusicPlayer = {
  type: "service_account",
  project_id: process.env.MUSIC_PLAYER_PROJECT_ID,
  private_key_id: process.env.MUSIC_PLAYER_PRIVATE_KEY_ID,
  private_key: process.env.MUSIC_PLAYER_PRIVATE_KEY.replace(/\\n/g, "\n"), // Fix new line issue
  client_email: process.env.MUSIC_PLAYER_CLIENT_EMAIL,
  client_id: process.env.MUSIC_PLAYER_CLIENT_ID,
  auth_uri: process.env.AUTH_URI,
  token_uri: process.env.TOKEN_URI,
  auth_provider_x509_cert_url: process.env.AUTH_PROVIDER_CERT_URL,
  client_x509_cert_url: process.env.MUSIC_PLAYER_CLIENT_CERT_URL,
  universe_domain: process.env.UNIVERSE_DOMAIN,
};

const vpn = {
  type: "service_account",
  project_id: process.env.VPN_PROJECT_ID,
  private_key_id: process.env.VPN_PRIVATE_KEY_ID,
  private_key: process.env.VPN_PRIVATE_KEY.replace(/\\n/g, "\n"), // Fix new line issue
  client_email: process.env.VPN_CLIENT_EMAIL,
  client_id: process.env.VPN_CLIENT_ID,
  auth_uri: process.env.AUTH_URI,
  token_uri: process.env.TOKEN_URI,
  auth_provider_x509_cert_url: process.env.AUTH_PROVIDER_CERT_URL,
  client_x509_cert_url: process.env.VPN_CLIENT_CERT_URL,
  universe_domain: process.env.UNIVERSE_DOMAIN,
};


  async function getAccessToken() {
    try {
      const token = await admin.credential.cert(filemanager).getAccessToken();
      // console.log('Token:', token.access_token);
      return token.access_token;
    } catch (error) {
      console.error('Error getting token:', error);
      throw error;
    }
  }

const app = express();

const port = 2025;

app.use(bodyParser.json());


app.get('/', (req, res) => {
    res.status(200).send('TimeZone Notification Server by Harshit Joshi!');
});



app.post("/notification-Scheduler", async(req, res) => {
const {message, project,scheduler,timezone} = req.body;
const cron_string = `0 ${scheduler?.minute ?? '*'} ${scheduler?.hour ?? '*'} ${scheduler?.day ?? '*'} ${scheduler?.month ?? '*'} *`;
  
console.log(cron_string);

const url = `https://fcm.googleapis.com/v1/projects/${project}/messages:send`;

cron.schedule(cron_string ,async()=>{
  console.log("Triggered")
  try {
    const accessToken = await getAccessToken();
    console.log(accessToken);
    const response = await axios.post(
        url,
        { message },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
        }
      );
    res.status(200).json({
        status: response.status,
        statusText: response.statusText,
        data: response.data
    });
} catch (error) {
    console.error("Error sending notification:", error);
    // Create a simplified error object without circular references
    const errorResponse = {
        message: error.message,
        status: error.response ? error.response.status : 500,
        data: error.response ? error.response.data : null
    };
    res.status(400).json(errorResponse);
}
},{
    scheduled: true,
    timezone: `${timezone}`
})

})

app.listen(port, () => {
    console.log(`⚡️ \x1b[43m [server]: Server is Fired Up at http://localhost:${port} \x1b[0m`);
}); 
