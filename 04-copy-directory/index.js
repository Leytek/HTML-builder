import fs from 'fs/promises';
import path from 'path';
import url from 'url';

async function copyDir(from, to){
  const fromDirPath = url.fileURLToPath(new URL(from, import.meta.url)),
    toDirPath = url.fileURLToPath(new URL(to, import.meta.url)),
    fromDir = await fs.readdir(fromDirPath, {withFileTypes: true});

  await fs.mkdir(toDirPath, {recursive: true});
  const toDir = await fs.readdir(toDirPath);

  for(let file of toDir){
    if(!fromDir.find(f => f.name === file))
      fs.rm(path.join(toDirPath, file), {recursive: true});
  }
  for(let file of fromDir){
    if(file.isFile())
      fs.copyFile(path.join(fromDirPath, file.name), path.join(toDirPath, file.name));
    else
      copyDir(from + '/' + file.name, to + '/' + file.name);
  }
}

copyDir('./files', './files-copy');
