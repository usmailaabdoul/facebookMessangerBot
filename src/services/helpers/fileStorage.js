const {
  readdirSync,
  rmdirSync,
  unlinkSync,
  writeFile,
  mkdir,
  existsSync
} = require('fs');
const { join } = require('path');
const fetch = require('node-fetch');

class FileStorage {
  cleanupDirectory() {
    rmDir(`${global.directory}/src/tempData/`)
    console.log('Successfull cleaned up directory')
  }

  async downloadImage(imageAttachment) {
    return new Promise(async (resolve, reject) => {
      try {
        let url = imageAttachment.payload.url;
        let data = await fetch(url)
        const buffer = await data.buffer();

        if (existsSync(`${global.directory}/src/tempData`)) {
          console.log('directory exist')
          writeFile(`${global.directory}/src/tempData/${imageAttachment.name}`, buffer, () => console.log('completed'))
        } else {
          mkdir(`${global.directory}/src/tempData`, {}, (err) => {
            if (err) reject(err);
          });
          console.log('directory does not exist')
          writeFile(`${global.directory}/src/tempData/${imageAttachment.name}`, buffer, () => console.log('completed'))
        }
        resolve('Success downloaded file')
      } catch (e) {
        console.log("Error sending message: " + e)
        reject(e)
      }
    })
  }
}

const fileStorage = new FileStorage()

module.exports = fileStorage;

const isDir = path => {
  try {
    return statSync(path).isDirectory();
  } catch (error) {
    return false;
  }
};

const getFiles = (path) =>
  readdirSync(path)
    .map(name => join(path, name));

const getDirectories = path =>
  readdirSync(path)
    .map(name => join(path, name))
    .filter(isDir);

const rmDir = path => {
  getDirectories(path).map(dir => rmDir(dir));
  getFiles(path).map(file => unlinkSync(file));
  rmdirSync(path);
};
