import fs from 'fs/promises';
import fss from 'fs';
import path from 'path';

async function createBundle(){
  const stylesDirPath = new URL('./styles', import.meta.url).pathname.slice(1),
    bundlePath = new URL('./project-dist/bundle.css', import.meta.url).pathname.slice(1),
    stylesDir = await fs.readdir(stylesDirPath),
    bundle = new fss.WriteStream(bundlePath);

  for(let file of stylesDir){
    if(path.extname(file) == '.css')
      new fss.ReadStream(path.join(stylesDirPath, file)).pipe(bundle);
  }
}

createBundle();
