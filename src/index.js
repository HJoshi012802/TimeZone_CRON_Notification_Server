const bodyParser = require('body-parser');
const express = require('express');
const axios = require('axios');
const admin = require('firebase-admin');
const node_cron = require("node-cron");
const dotenv = require("dotenv");
const cors = require('cors');

// const cronitor = require('cronitor')('a1ef2a270e6c4a0d9150a87b5e7e8322');
// const eventsApi = require('@slack/events-api');
const { WebClient, LogLevel } = require("@slack/web-api");


const port = 2025;
const app = express();
dotenv.config(); 
app.use(bodyParser.json());

app.use(cors({
  origin: ['https://dashboardnotification.web.app',"http://localhost:5173"],
  methods: ['GET', 'POST', 'OPTIONS'],
  // allowedHeaders: ['Content-Type', 'Authorization']
}));

const filemanager = {
  type: "service_account",
  project_id: process.env.FILE_MANAGER_PROJECT_ID,
  private_key_id: process.env.FILE_MANAGER_PRIVATE_KEY_ID,
  private_key: process.env.FILE_MANAGER_PRIVATE_KEY, // Fix new line issue
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
  private_key: process.env.VIDEO_PLAYER_PRIVATE_KEY, // Fix new line issue
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
  private_key: process.env.ZX_FILE_MANAGER_PRIVATE_KEY, // Fix new line issue
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
  private_key: process.env.LIGHT_VIDEO_PLAYER_PRIVATE_KEY, // Fix new line issue
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
  private_key: process.env.MUSIC_PLAYER_PRIVATE_KEY, // Fix new line issue
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
  private_key: process.env.VPN_PRIVATE_KEY, // Fix new line issue
  client_email: process.env.VPN_CLIENT_EMAIL,
  client_id: process.env.VPN_CLIENT_ID,
  auth_uri: process.env.AUTH_URI,
  token_uri: process.env.TOKEN_URI,
  auth_provider_x509_cert_url: process.env.AUTH_PROVIDER_CERT_URL,
  client_x509_cert_url: process.env.VPN_CLIENT_CERT_URL,
  universe_domain: process.env.UNIVERSE_DOMAIN,
};

const collagemaker ={
  type: "service_account",
  project_id: process.env.PHOTO_EDITOR_PROJECT_ID,
  private_key_id: process.env.PHOTO_EDITOR_PRIVATE_KEY_ID,
  private_key: process.env.PHOTO_EDITOR_PRIVATE_KEY, // Fix new line issue
  client_email: process.env.PHOTO_EDITOR_CLIENT_EMAIL,
  client_id: process.env.PHOTO_EDITOR_CLIENT_ID,
  auth_uri: process.env.AUTH_URI,
  token_uri: process.env.TOKEN_URI,
  auth_provider_x509_cert_url: process.env.AUTH_PROVIDER_CERT_URL,
  client_x509_cert_url: process.env.PHOTO_EDITOR_CLIENT_CERT_URL,
  universe_domain: process.env.UNIVERSE_DOMAIN,
}
 
  async function getAccessToken(project) {
    try {
      const token = await admin.credential.cert(project).getAccessToken();
      return token.access_token;
    } catch (error) {
      console.error('🚫 \x1b[32m Error getting token: \x1b[0m', error);
      throw error;
    }
  }
  
const token = process.env.BOT_TOKEN;

const slackClient = new WebClient(token, {
    logLevel: LogLevel.DEBUG
});

async function sendSlackMessage(channel, text) {
  try {
    await slackClient.chat.postMessage({
      channel,
      text,
    });
  } catch (err) {
    console.error("⚠️ Failed to send Slack message:", err);
  }
}

app.get('/', (req, res) => {
    res.status(200).send('TimeZone Notification Server developed and CI/CDed by Harshit Joshi !!!');
});

app.post("/notification-Scheduler", async(req, res) => {
  const {message, projectid,scheduler,timezone,project} = req.body;

  if (message && message.data && message.data.data) {
    const str = "{\"title\":\"Precision Challenge Awaits! 🔨\",\"body\":\"Play and master the challenge! 🎯👊\"}";
  const messageData = JSON.parse(str);
  message.data.data = messageData;
}

const fcmPayload = {
  message: {
    data: {
      data: JSON.stringify(message.data.data) 
    },
  }
};

 if (message.topic !== undefined && message.topic !== "") {
   fcmPayload.message.topic = message.topic;
  } else if (message.token !== undefined && message.token !== "") {
    fcmPayload.message.token = message.token;
  }

  // console.log(`✅ \x1b[33m [server]:NOTIFICATION-SCHEDULER : ${JSON.stringify(req.body)} \x1b[0m`);
  
  const cron_string = `0 ${scheduler?.minute ?? '*'} ${scheduler?.hour ?? '*'} ${scheduler?.day ?? '*'} ${scheduler?.month ?? '*'} ${scheduler?.week ?? '*'}`;
  
  const url = `https://fcm.googleapis.com/v1/projects/${projectid}/messages:send`;
  
  const projects = {
    filemanager,
    videoplayer,
    ZxFileManager,
    LightVideoPlayer,
    MusicPlayer,
    vpn,
    collagemaker
  };
  
  if (!projects[project]) {
    return res.status(400).json({ error: "Invalid project name provided." });
  }
  
  try{
    console.log(`✅ \x1b[33m [server]:SCHEDULER : ${cron_string} \x1b[0m`);
    // console.log(`✅ \x1b[33m [server]:PROJECT : ${projects[project]} \x1b[0m`);
    
    const accessToken = await getAccessToken(projects[project]);
    
  }catch(error){
    console.error('🚫 \x1b[32m Error getting token: \x1b[0m', error );
    return res.status(400).json({ 'Error getting token:': error});
  }
  
   await sendSlackMessage("C092NBGSRLY", `[Server]: ⏰📅 Notification Scheduled successfully for *${project}* at ${new Date().toLocaleString("en-IN", { timeZone: timezone })}`);

  node_cron.schedule(cron_string ,async()=>{
    
    try {
      const accessToken = await getAccessToken(projects[project]);
      
      const response = await axios.post(
        url,
        fcmPayload,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.status === 200) {
        console.log("✅ Notification sent", response);
        return await sendSlackMessage("C092NBGSRLY", `[Server]: ✅ Notification sent successfully for *${project}* at ${new Date().toLocaleString("en-IN", { timeZone: timezone })}`);
      }

      // return res.status(200).json({
      //   status: response.status,
      //   statusText: response.statusText,
      //   data: response.data});

    } catch (error) {
      console.error("Error sending notification:", error);
      const errorResponse = {
        message: error.message,
        status: error.response ? error.response.status : 500,
        data: error.response ? error.response.data : null
      };
      await sendSlackMessage("C092NBGSRLY", `[Server]: ❌ Error sending notification for *${project}*: ${error.message}`);
      return res.status(400).json(errorResponse);
    }
  },{
    scheduled: true,
    timezone: `${timezone}`
  })
  
    res.status(200).json({
      message: "Notification Scheduler is running",
      status: 200,
      data: {
        cron_string,
        project,
        timezone
      }
    });
})

app.listen(port, () => {
  console.log(`⚡️ \x1b[43m [server]: Server is Fired Up at http://localhost:${port} \x1b[0m`);
}); 