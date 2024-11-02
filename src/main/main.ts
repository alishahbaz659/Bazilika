/* eslint global-require: off, no-console: off, promise/always-return: off */

/**
 * This module executes inside of electron's main process. You can start
 * electron renderer process from here and communicate with the other processes
 * through IPC.
 *
 * When running `npm run build` or `npm run build:main`, this file is compiled to
 * `./src/main.js` using webpack. This gives us some performance wins.
 */
import path from 'path';
import { app, BrowserWindow, shell, ipcMain } from 'electron';
import { autoUpdater } from 'electron-updater';
import log from 'electron-log';
import MenuBuilder from './menu';
import { resolveHtmlPath } from './util';
import fs from 'fs';
const nodemailer = require('nodemailer');

class AppUpdater {
  constructor() {
    log.transports.file.level = 'info';
    autoUpdater.logger = log;
    autoUpdater.checkForUpdatesAndNotify();
  }
}

let mainWindow: BrowserWindow | null = null;

ipcMain.on('ipc-example', (event, arg) => {

  const msgTemplate = (pingPong: string) => `${pingPong}`;
  // console.log(msgTemplate(arg));
    // Get the userData directory and create a subdirectory for captured images
  const dir = path.join(app.getPath('userData'), 'captured_images');

    // Ensure the directory exists
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true }); // Create the directory, including parent folders if needed
    console.log("Folder didn't exist, new folder created");
  }

    const data = msgTemplate(arg).replace(/^data:image\/\w+;base64,/, "");

    // Update filePath to use the correct directory path
    const filePath = path.join(dir, `image${Date.now()}.png`);

    const imageBuffer = Buffer.from(data, "base64");

    fs.writeFile(filePath, imageBuffer, (err) => {
    if (err)
      console.log(err);
      else{
        console.log("Image Saved");
        send_mail(filePath,arg[1],event)
        }
    });

});


function send_mail(filePath,email,event){

  const msgTemplate = (pingPong: string) => `${pingPong}`;
  const transporter = nodemailer.createTransport({
    service: 'gandi',
    auth: {
      user: 'bazilika@gifie.me',
      pass: 'Bazilika111!'
    }
  });

  fs.readFile(filePath, function (err, data) {
   return new Promise(function(resolve,reject){
    var fieldheader = `Kedves Látogató! Köszönjük, hogy meglátogattad adventi vásárunkat a Bazilikánál.<br> Alább megtalálod csatolt fájlként a vásárban készült képedet! <br> Boldog Karácsonyt kívánunk! <br><br>Dear Visitor,
    <br>Thank you for visiting our Advent Feast at the Basilica.
    <br>Please find attached the picture you have taken.
    <br>We wish you a merry Christmas!
    <br>
    `
    transporter.sendMail({
      from: 'bazilika@gifie.me',
      to: email,
      subject: 'Bazilika',
      // text: 'Kedves Látogató! Köszönjük, hogy meglátogattad adventi vásárunkat a Bazilikánál. Alább megtalálod csatolt fájlként a vásárban készült képedet! Boldog Karácsonyt kívánunk! ',
      html:fieldheader,
      attachments: [{ filename: path.basename(filePath), content: data }]
    }, function (err, success) {
      if (err) {
        // Handle error
        console.log(err);
        reject(err);
      }else{

        resolve(success)
        console.log("Mail sent");
        event.reply('ipc-example', msgTemplate('mailSent'));
      }

    })
  })
});
}


if (process.env.NODE_ENV === 'production') {
  const sourceMapSupport = require('source-map-support');
  sourceMapSupport.install();
}

const isDebug =
  process.env.NODE_ENV === 'development' || process.env.DEBUG_PROD === 'true';

if (isDebug) {
  require('electron-debug')();
}

const installExtensions = async () => {
  const installer = require('electron-devtools-installer');
  const forceDownload = !!process.env.UPGRADE_EXTENSIONS;
  const extensions = ['REACT_DEVELOPER_TOOLS'];

  return installer
    .default(
      extensions.map((name) => installer[name]),
      forceDownload
    )
    .catch(console.log);
};

const createWindow = async () => {
  if (isDebug) {
    await installExtensions();
  }

  const RESOURCES_PATH = app.isPackaged
    ? path.join(process.resourcesPath, 'assets')
    : path.join(__dirname, '../../assets');

  const getAssetPath = (...paths: string[]): string => {
    return path.join(RESOURCES_PATH, ...paths);
  };

  mainWindow = new BrowserWindow({
    show: false,
    width: 1024,
    height: 728,
    frame:true,
    fullscreen:false,
    icon: getAssetPath('icon.png'),
    webPreferences: {
      devTools:!app.isPackaged,
      allowRunningInsecureContent: true,
      nodeIntegration: true,
      webSecurity:false,
      preload: app.isPackaged
        ? path.join(__dirname, 'preload.js')
        : path.join(__dirname, '../../.erb/dll/preload.js'),
    },
  });

  mainWindow.loadURL(resolveHtmlPath('index.html'));

  mainWindow.on('ready-to-show', () => {
    if (!mainWindow) {
      throw new Error('"mainWindow" is not defined');
    }
    if (process.env.START_MINIMIZED) {
      mainWindow.minimize();
    } else {
      mainWindow.show();
    }
  });

  mainWindow.on('closed', () => {
    mainWindow = null;
  });

  const menuBuilder = new MenuBuilder(mainWindow);
  menuBuilder.buildMenu();

  // Open urls in the user's browser
  mainWindow.webContents.setWindowOpenHandler((edata) => {
    shell.openExternal(edata.url);
    return { action: 'deny' };
  });

  // Remove this if your app does not use auto updates
  // eslint-disable-next-line
  new AppUpdater();
};

/**
 * Add event listeners...
 */

app.on('window-all-closed', () => {
  // Respect the OSX convention of having the application in memory even
  // after all windows have been closed
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app
  .whenReady()
  .then(() => {
    createWindow();
    app.on('activate', () => {
      // On macOS it's common to re-create a window in the app when the
      // dock icon is clicked and there are no other windows open.
      if (mainWindow === null) createWindow();
    });
  })
  .catch(console.log);
