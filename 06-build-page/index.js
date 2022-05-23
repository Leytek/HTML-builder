import fs from 'fs/promises';
import fss from 'fs';
import path from 'path';
import readline from 'readline';
import url from 'url';
import copyDir from '../04-copy-directory/index.js';
import createBundle from '../05-merge-styles/index.js';

const __dirname = path.dirname(url.fileURLToPath(import.meta.url));

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
  copyDir('assets', 'project-dist/assets', __dirname);
  createBundle('styles', 'project-dist/style.css', __dirname);
  renderTemplate('template.html', 'project-dist/index.html');
}

buildPage();
