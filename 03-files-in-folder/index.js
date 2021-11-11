import fs from 'fs';
import path from 'path';
import url from 'url';

const dirPath = url.fileURLToPath(new URL('./secret-folder', import.meta.url));

fs.readdir(dirPath, {withFileTypes: true}, (err, files) => {
  for (let file of files){
    fs.stat(path.join(dirPath, file.name), (err, stats) => {
      if(stats.isFile()){
        const ext = path.extname(file.name);
        const base = path.basename(file.name, ext);
        console.log(`${base} - ${ext} - ${(stats.size / 1024).toFixed(3)}kb`);
      }
    });
  }
});
