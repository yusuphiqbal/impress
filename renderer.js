const { remote, ipcRenderer, ipcMain } = require('electron');

const qualityContainer = document.querySelector('.quality');
const quality = document.querySelector('#quality');
const outputPath = document.querySelector('#output-path');
const selectBtn = document.querySelector('#select-btn');
const imagePath = document.querySelector('#image-path');
const compressBtn = document.querySelector('#compress-btn');
const outputLink = document.querySelector('#output-change');

let imageToCompress;

qualityContainer.innerHTML = `${quality.value}%`;
outputPath.innerHTML = remote.app.getPath('pictures');

const updateQuality = (event) => {
  console.log(event.target.value);
  qualityContainer.innerHTML = `${event.target.value}%`;
};

quality.addEventListener('input', updateQuality);

const handleSelectBtnClick = () => {
  ipcRenderer.send('select-btn-click');
};

selectBtn.addEventListener('click', handleSelectBtnClick);

ipcRenderer.on('image-selected', (event, file) => {
  imageToCompress = file[0];
  imagePath.innerHTML = file[0];
});

const handleCompressBtnClick = () => {
  if (!imageToCompress) return;
  ipcRenderer.send(
    'compress-img',
    imageToCompress,
    quality.value,
    outputPath.innerHTML
  );
};

compressBtn.addEventListener('click', handleCompressBtnClick);

ipcRenderer.on('image-compressed', () => {
  console.log('Hurrah');
});

outputLink.addEventListener('click', (e) => {
  e.preventDefault();
  ipcRenderer.send('change-output');
});

ipcRenderer.on('output-changed', (event, directories) => {
  outputPath.innerHTML = directories;
});
