import fs from 'fs/promises';
import path from 'path';

async function copyDir(){
  const baseDirPath = new URL('./files', import.meta.url).pathname.slice(1),
    copyDirPath = new URL('./files-copy', import.meta.url).pathname.slice(1),
    baseDir = await fs.readdir(baseDirPath),
    copyDir = await fs.readdir(copyDirPath);

  await fs.mkdir(copyDirPath, {recursive: true});
  for(let file of copyDir){
    if(!baseDir.includes(file))
      fs.rm(path.join(copyDirPath, file));
  }
  for(let file of baseDir){
    fs.copyFile(path.join(baseDirPath, file), path.join(copyDirPath, file));
  }
}

copyDir();
