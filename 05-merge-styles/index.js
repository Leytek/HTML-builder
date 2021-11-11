import fs from 'fs/promises';
import fss from 'fs';
import path from 'path';
import url from 'url';

async function createBundle(){
  const stylesDirPath = url.fileURLToPath(new URL('./styles', import.meta.url)),
    bundlePath = url.fileURLToPath(new URL('./project-dist/bundle.css', import.meta.url)),
    stylesDir = await fs.readdir(stylesDirPath),
    bundle = new fss.WriteStream(bundlePath);

  for(let file of stylesDir){
    if(path.extname(file) == '.css')
      new fss.ReadStream(path.join(stylesDirPath, file)).pipe(bundle);
  }
}

createBundle();
