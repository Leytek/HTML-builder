import fs from 'fs/promises';
import fss from 'fs';
import path from 'path';
import readline from 'readline';
import url from 'url';

const __dirname = path.dirname(url.fileURLToPath(import.meta.url));

async function copyDir(from, to){
  const fromDirPath = path.join(__dirname, from),
    toDirPath = path.join(__dirname, to),
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
      copyDir(path.join(from, file.name), path.join(to, file.name));
  }
}

async function createBundle(from, to, ext = path.extname(to)){
  const sourceDirPath = path.join(__dirname, from),
    bundlePath = path.join(__dirname, to),
    sourceDir = await fs.readdir(sourceDirPath),
    bundle = new fss.WriteStream(bundlePath);

  for(let file of sourceDir){
    if(path.extname(file) === ext)
      new fss.ReadStream(path.join(sourceDirPath, file)).pipe(bundle);
  }
}

async function renderTemplate(from, to){
  const templatePath = path.join(__dirname, from),
    resultPath = path.join(__dirname, to),
    componentsDirPath = path.join(__dirname, 'components'),
    template = new fss.ReadStream(templatePath, 'utf-8'),
    result = new fss.WriteStream(resultPath),
    componentsDir = await fs.readdir(componentsDirPath);

  let components = {}, fileStream;

  for(let file of componentsDir){
    const fileBaseName = path.basename(file, path.extname(file));
    fileStream = new fss.ReadStream(path.join(componentsDirPath, file), 'utf-8');
    fileStream.on('data', chunk => components[fileBaseName] = (components[fileBaseName] || '') + chunk);
  }

  fileStream.on('end', () => {
    const rli = readline.createInterface({input: template, output: result});
    rli.on('line', line => {
      const lineReplace = line.replace(/\{\{(\w+)\}\}/, (m, p1) => components[p1] || '');
      result.write(lineReplace + '\n');
    });
  });
}

async function buildPage(){
  await fs.mkdir(path.join(__dirname, 'project-dist'), {recursive: true});
  copyDir('assets', 'project-dist/assets');
  createBundle('styles', 'project-dist/style.css');
  renderTemplate('template.html', 'project-dist/index.html');
}

buildPage();
