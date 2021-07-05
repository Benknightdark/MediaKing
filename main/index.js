const { join } = require("path");
const { app, BrowserWindow, shell, remote, ipcMain } = require('electron')
// const path = require('path')
const ffmpegPath = require('ffmpeg-static').replace(
  'app.asar',
  'app.asar.unpacked'
);
const { v4: uuidv4 } = require('uuid');
const notifier = require('node-notifier');
const ffmpeg = require('fluent-ffmpeg')
const fs = require('fs');
const fetch = require('node-fetch')
const serveNext = require("next-electron-server");
const isDev = require('electron-is-dev');
const events = require('events');
const em = new events.EventEmitter();
//Subscribe for FirstEvent

let mainWindow
ffmpeg.setFfmpegPath(ffmpegPath);

serveNext("next://app");

app.on("ready", async () => {
  mainWindow = new BrowserWindow({
    webPreferences: {
      nodeIntegration: false,
      preload: join(__dirname, "preload.js"),
    },
  });
  if (isDev) {
    mainWindow.webContents.openDevTools()
  }
  mainWindow.maximize();
  mainWindow.loadURL("next://app");
});

app.on("window-all-closed", app.quit);

async function getInfo(url) {
  const regex = /var ytInitialPlayerResponse = (.+);<\/script>/gm
  const r = await fetch(url)
  const str = await r.text()
  const m = regex.exec(str)
  if (m && m.length === 2) {
    return JSON.parse(m[1])
  } else return {}
}
const ytDownload = async (url, downloadType, sourcUrl, videoLength) => {
  const id = uuidv4();
  let folderName = `${app.getPath('home')}/YoutubeDownload`
  !fs.existsSync(`${folderName}`) && fs.mkdirSync(`${folderName}`, { recursive: true })
  let videoUrl = `${url}`
  let downloadfileName = `${folderName}/${id}`
  switch (downloadType) {
    case 'video':
      const audioData = (await getInfo(sourcUrl)).streamingData.adaptiveFormats.filter(a => a.mimeType.indexOf('audio') != -1)[0].url;
      ffmpeg(videoUrl)
        .input(audioData).output(`${downloadfileName}.mp4`)
        .on('progress', async function (progress) {
          //  console.log('Processing: ' + progress.percent + '% done');
          mainWindow.send('ytDownloadFromServer', progress, videoLength)//progress.percent
        })
        .on('end', async function () {
          console.log('Finished processing');
          notifier.notify({
            title: '提示訊息',
            message: `✔️✔️下載完成 ==> ${downloadfileName}`
          });
          await shell.openPath(`${folderName}`)
        })
        .on('error', function (err) {
          notifier.notify({
            title: 'an error happened: ',
            message: `err.message`
          });
          console.log('an error happened: ' + err.message);
        })
        .run()
      break;
    case 'audio':
      ffmpeg(videoUrl)
        .output(`${downloadfileName}.mp3`)
        .on('progress', async function (progress) {
          console.log('Processing: ' + progress.percent + '% done');
          mainWindow.send('ytDownloadFromServer', progress, videoLength)//progress.percent

        })
        .on('end', async function () {
          console.log('Finished processing');
          notifier.notify({
            title: '提示訊息',
            message: `✔️✔️下載完成 ==> ${downloadfileName}`
          });
          await shell.openPath(`${folderName}`)
        })
        .on('error', function (err) {
          notifier.notify({
            title: 'an error happened: ',
            message: `err.message`
          });
          console.log('an error happened: ' + err.message);
        })
        .run()                 //run the process
      break;
    default:
      break;
  }
}
// 下載Youtube影片和音樂
ipcMain.on('ytDownloadFromClient', async (event, url, downloadType, sourcUrl, videoLength) => {
  try {
    console.log(url, downloadType, sourcUrl, videoLength)
    await ytDownload(url, downloadType, sourcUrl, videoLength)
    // return ffmpegPath
  } catch (error) {
    console.log(error)
  }
})
// 取得YotubeTube影片資訊
ipcMain.on('ytInfoFromClient', async (event, url) => {
  try {
    const info = await getInfo(url)
    mainWindow.send('ytInfoFromServer', info)//progress.percent
  } catch (error) {
    console.log(error)
  }
})

const convertAudio = async (a, allData, nextIndex) => {
  let folderName = `${app.getPath('home')}/AudioConvert`
  !fs.existsSync(`${folderName}`) && fs.mkdirSync(`${folderName}`, { recursive: true })
  console.log(a)
  const outputPath = folderName + "/" + a.name.split('.')[0] + '.mp3';
  ffmpeg({ source: a.path, nolog: true })
    .toFormat('mp3')
    .on('end', async function () {
      console.log('file has been converted successfully');
      notifier.notify({
        title: a.name,
        message: `✔️✔️儲存路徑 => ${outputPath}`
      });
      a.status = 'done';
      em.emit('ConvertAudio', allData[nextIndex], allData, nextIndex + 1);

      mainWindow.send('audioConvertFromServer', a);
    })
    .on('error', function (err) {
      notifier.notify({
        title: 'an error happened: ',
        message: `err.message`
      });
      console.log('an error happened: ' + err.message);
    })
    .saveToFile(outputPath);

}
em.on('ConvertAudio', async function (currentData, allData, nextIndex) {
  //if(allData.length!==nextIndex){
  try {
    await convertAudio(currentData, allData, nextIndex)

  } catch (error) {
    console.log(error)
  }
  // }
});
// 取得訊
ipcMain.on('audioConvertFromClient', async (event, data) => {
  try {
    await convertAudio(data[0], data, 1)
  } catch (error) {
    console.log(error)
  }
})

ipcMain.on('openAudioConvertFolderFromClient', async () => {
  let folderName = `${app.getPath('home')}/AudioConvert`
  !fs.existsSync(`${folderName}`) && fs.mkdirSync(`${folderName}`, { recursive: true });
  await shell.openPath(`${folderName}`)
})