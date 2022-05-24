import fs from 'fs/promises';
import path from 'path';
import url from 'url';

const __dirname = path.dirname(url.fileURLToPath(import.meta.url));

export default async function mergeStyles(from = 'styles', to = 'project-dist/bundle.css', dirname = __dirname){
  const sourceDirPath = path.join(dirname, from),
    bundlePath = path.join(dirname, to),
    ext = path.extname(to),
    sourceDir = await fs.readdir(sourceDirPath);

  await fs.rm(bundlePath, {force: true});
  sourceDir.forEach(async file => {
    if(path.extname(file) === ext)
      await fs.writeFile(bundlePath, await fs.readFile(path.join(sourceDirPath, file)), {flag: 'a'});
  });
}

mergeStyles();
