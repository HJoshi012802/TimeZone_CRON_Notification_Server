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
 
  async function getAccessToken(project) {
    try {
      const token = await admin.credential.cert(project).getAccessToken();
      return token.access_token;
    } catch (error) {
      console.error('🚫 \x1b[32m Error getting token: \x1b[0m', error);
      throw error;
    }
  }

const app = express();

const port = 2025;

app.use(bodyParser.json());

app.get('/', (req, res) => {
    res.status(200).send('TimeZone Notification Server developed and CI/CDed by Harshit Joshi !!!');
});

app.get('/cross-app-promotion', (req, res) => {
  res.status(200).json({
    "message": "Success",
    "status": 200,
    "data": [
      {
        "app_name": "HD Video Downloader",
        "package_name": "com.rocks.video.downloader",
        "app_url": "https://play.google.com/store/apps/details?id=com.rocks.video.downloader",
        "icon_url": "https://img.rocksplayer.com/img/default/Notification/517493ee-2b37-4008-854c-10dd0ce8c044.png",
        "app_banner_url": "",
        "app_detail": "4.4 :star: | Free HD Downloader"
      },
      {
        "app_name": "Asd Music Player",
        "package_name": "com.rocks.music",
        "app_url": "https://tinyurl.com/audio-player",
        "icon_url": "https://img.rocksplayer.com/img/default/Notification/64e6a7a2-eb92-4ed9-ad32-5ead27f05103.png",
        "app_banner_url": "",
        "app_detail": "4.2 :star: | Free Audio player and Radio fm"
      },
      {
        "app_name": "File Manager",
        "package_name": "filemanager.files.fileexplorer.android.folder",
        "app_url": "https://play.google.com/store/apps/details?id=filemanager.files.fileexplorer.android.folder&referrer=utm_source%3Dcp%26utm_medium%3Dcp_banner%26utm_term%3Dcp_click%26utm_content%3Dbanner_app%26utm_campaign%3DCP_CAMPAIGN",
        "icon_url": "https://d3q1stlj95u1cj.cloudfront.net/img/default/app_launcher_icons/filemanager.png",
        "app_banner_url": "",
        "app_detail": "4.5 :star: | Free Downloader and Clean master "
      },
      {
        "app_name": "Gallery Photo-editor",
        "package_name": "com.rocks.photosgallery",
        "app_url": "https://tinyurl.com/photo-editor",
        "icon_url": "https://img.rocksplayer.com/img/default/app_launcher_icons/gallery.png",
        "app_banner_url": "",
        "app_detail": "4.4 :star: FREE Stickers, Filters and Neons"
      },
      {
        "app_name": "Asd Mp3 Converter",
        "package_name": "mp3converter.videotomp3.ringtonemaker",
        "app_url": "https://tinyurl.com/audio-converter",
        "icon_url": "https://d3q1stlj95u1cj.cloudfront.net/img/default/app_launcher_icons/mp3_converter.png",
        "app_banner_url": "",
        "app_detail": "4.3 :star: FREE Cut, split and convert video into mp3. All in one app"
      },
      {
        "app_name": "Radio Monkey: Radio Fm",
        "package_name": "radio.fm.mytunner.gaana.liveradio.radiostation.pocketfm",
        "app_url": "https://tinyurl.com/radio-monkey",
        "icon_url": "https://img.rocksplayer.com/img/default/Notification/a2b96c19-48eb-46fe-921a-6c55e4d8908e.png",
        "app_banner_url": "",
        "app_detail": "4.5 :star: FREE 5000+ Radio fm stations. Play fm online"
      },
      {
        "app_name": "Find Differences Puzzle",
        "package_name": "games.find.diff.gamma",
        "app_url": "https://tinyurl.com/find-diff",
        "icon_url": "https://d3q1stlj95u1cj.cloudfront.net/img/default/app_launcher_icons/finddiff_game.jpg",
        "app_banner_url": "",
        "app_detail": "Picture puzzle game for brain storming. Find the differences"
      },
      {
        "app_name": "Edit Photos",
        "package_name": "collagemaker.photoeditor.postcreator",
        "app_url": "https://play.google.com/store/apps/details?id=collagemaker.photoeditor.postcreator",
        "icon_url": "https://img.rocksplayer.com/img/default/Notification/8aee97bd-c9fd-4d61-ae3f-dbe7255ca600.png",
        "app_banner_url": "",
        "app_detail": "Collage maker Freestyle with Crop, Filter, stickers, effects, and neons"
      }
    ]
  });
});

app.post("/notification-Scheduler", async(req, res) => {
const {message, projectid,scheduler,timezone,project} = req.body;

const cron_string = `0 ${scheduler?.minute ?? '*'} ${scheduler?.hour ?? '*'} ${scheduler?.day ?? '*'} ${scheduler?.month ?? '*'} ${scheduler?.week ?? '*'}`;

const url = `https://fcm.googleapis.com/v1/projects/${projectid}/messages:send`;

const projects = {
  filemanager,
  videoplayer,
  ZxFileManager,
  LightVideoPlayer,
  MusicPlayer,
  vpn
};

if (!projects[project]) {
  return res.status(400).json({ error: "Invalid project name provided." });
}

try{
  console.log(`✅ \x1b[33m [server]:SCHEDULER : ${cron_string} \x1b[0m`);
  console.log(`✅ \x1b[33m [server]:PROJECT : ${projects[project]} \x1b[0m`);

  const accessToken = await getAccessToken(projects[project]);

}catch(error){
  console.error('🚫 \x1b[32m Error getting token: \x1b[0m', error );
  return res.status(400).json({ 'Error getting token:': error});
}

cron.schedule(cron_string ,async()=>{
  
  try {
    const accessToken = await getAccessToken(projects[project]);

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
