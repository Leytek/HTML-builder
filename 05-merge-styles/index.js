import fs from 'fs/promises';
import fss from 'fs';
import path from 'path';
import url from 'url';

const __dirname = path.dirname(url.fileURLToPath(import.meta.url));

export default async function createBundle(from = 'styles', to = 'project-dist/bundle.css', dirname = __dirname){
  const sourceDirPath = path.join(dirname, from),
    bundlePath = path.join(dirname, to),
    ext = path.extname(to),
    sourceDir = await fs.readdir(sourceDirPath),
    bundle = new fss.WriteStream(bundlePath);

  for(let file of sourceDir){
    if(path.extname(file) === ext)
      new fss.ReadStream(path.join(sourceDirPath, file)).pipe(bundle);
  }
}

createBundle();
