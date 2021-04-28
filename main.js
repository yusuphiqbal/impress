const path = require('path');
const {
  app,
  BrowserWindow,
  ipcMain,
  dialog,
  Notification,
} = require('electron');
const slash = require('slash');
const imagemin = require('imagemin');
const imageminMozJpeg = require('imagemin-mozjpeg');
const imageminPngQuant = require('imagemin-pngquant');

const createWindow = () => {
  const mainWindow = new BrowserWindow({
    title: 'Impress',
    backgroundColor: '#1B2C3F',
    width: 472,
    height: 572,
    resizable: false,
    webPreferences: {
      nodeIntegration: true,
      enableRemoteModule: true,
      contextIsolation: false,
    },
  });

  mainWindow.loadFile('index.html');
  mainWindow.removeMenu();
};

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
  app.quit();
});

app.setAppUserModelId('Impress');

ipcMain.on('select-btn-click', async (event) => {
  const result = await dialog.showOpenDialog({
    properties: ['openFile'],
    filters: [{ name: 'Images', extensions: ['jpg', 'png'] }],
  });

  event.sender.send('image-selected', result.filePaths);
});

ipcMain.on('compress-img', async (event, image, quality, outputPath) => {
  try {
    const pngQuality = quality / 100;
    const files = await imagemin([slash(image)], {
      destination: outputPath,
      plugins: [
        imageminMozJpeg({ quality }),
        imageminPngQuant({ quality: [pngQuality, pngQuality] }),
      ],
    });

    const notification = {
      title: 'Image compressed',
      body: 'Your image has been compressed successfully.',
    };

    new Notification(notification).show();
  } catch (error) {
    console.log(error);
  }
});

ipcMain.on('change-output', async (event) => {
  const result = await dialog.showOpenDialog({ properties: ['openDirectory'] });
  event.sender.send('output-changed', result.filePaths);
});
