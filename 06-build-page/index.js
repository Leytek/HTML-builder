import fs from 'fs/promises';
import fss from 'fs';
import path from 'path';
import readline from 'readline';

async function copyDir(from, to){
  const fromDirPath = new URL(from, import.meta.url).pathname.slice(1),
    toDirPath = new URL(to, import.meta.url).pathname.slice(1),
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

async function createBundle(from, to, ext = path.extname(to)){
  const sourceDirPath = new URL(from, import.meta.url).pathname.slice(1),
    bundlePath = new URL(to, import.meta.url).pathname.slice(1),
    sourceDir = await fs.readdir(sourceDirPath),
    bundle = new fss.WriteStream(bundlePath);

  for(let file of sourceDir){
    if(path.extname(file) === ext)
      new fss.ReadStream(path.join(sourceDirPath, file)).pipe(bundle);
  }
}

async function renderTemplate(from, to){
  const templatePath = new URL(from, import.meta.url).pathname.slice(1),
    resultPath = new URL(to, import.meta.url).pathname.slice(1),
    componentsDirPath = new URL('./components', import.meta.url).pathname.slice(1),
    template = new fss.ReadStream(templatePath, 'utf-8'),
    result = new fss.WriteStream(resultPath),
    componentsDir = await fs.readdir(componentsDirPath),
    rli = readline.createInterface({input: template, output: result});

    

  rli.on('line', line => {
    const replaceTag = (m, p1) => {
        const f = new fss.ReadStream(path.join(componentsDirPath, p1 + '.html'), 'utf-8');
        let data, chunk;

          while(f.readable && (chunk = f.read() !== null))
            {data = (data || '') + chunk;console.log(data)}

        return data;
      },
      lineReplace = line.replace(/\{\{(\w+)\}\}/, replaceTag);
    result.write(lineReplace + '\n');
  });
}

async function buildPage(){
  await fs.mkdir(new URL('./project-dist', import.meta.url).pathname.slice(1), {recursive: true});
  copyDir('./assets', './project-dist/assets');
  createBundle('./styles', './project-dist/style.css');
  renderTemplate('./template.html', './project-dist/index.html');
}

buildPage();
