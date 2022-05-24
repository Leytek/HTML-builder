import fs from 'fs/promises';
import path from 'path';
import url from 'url';

const dirPath = url.fileURLToPath(new URL('./secret-folder', import.meta.url));
const files = await fs.readdir(dirPath, {withFileTypes: true});

files.forEach(async file => {
  const stat = await fs.stat(path.join(dirPath, file.name));
  if(stat.isFile()){
    const ext = path.extname(file.name);
    const base = path.basename(file.name, ext);
    console.log(`${base} - ${ext} - ${(stat.size / 1024).toFixed(3)}kb`);
  }
});
