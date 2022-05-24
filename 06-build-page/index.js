import fs from 'fs/promises';
import path from 'path';
import readline from 'readline';
import url from 'url';
import copyDir from '../04-copy-directory/index.js';
import mergeStyles from '../05-merge-styles/index.js';

const __dirname = path.dirname(url.fileURLToPath(import.meta.url));

async function renderTemplate(from, to, templateName){
  const templatePath = path.join(__dirname, templateName),
    resultPath = path.join(__dirname, to),
    componentsDirPath = path.join(__dirname, from),
    templateFile = await fs.open(templatePath),
    resultFile = await fs.open(resultPath, 'w'),
    template = templateFile.createReadStream('utf-8'),
    componentsDir = await fs.readdir(componentsDirPath),
    rl = readline.createInterface({input: template});

  let promise = new Promise(r => r());

  rl.on('line', line => {
    const name = line.match(/\{\{(\w+)\}\}/);
    if(name)
      promise = promise.then(r => fs.readFile(path.join(componentsDirPath, name[1] + path.extname(componentsDir[0]))))
        .then(r => line.replace(/\{\{(\w+)\}\}/, r) + '\n', e => '');
    else promise = promise.then(r => line + '\n');
    promise = promise.then(r => fs.writeFile(resultPath, r, {flag: 'a'}));
  });
  rl.on('close', () => {
    templateFile.close();
    resultFile.close();
  });
}

async function buildPage(){
  await fs.mkdir(path.join(__dirname, 'project-dist'), {recursive: true});
  copyDir('assets', 'project-dist/assets', __dirname);
  mergeStyles('styles', 'project-dist/style.css', __dirname);
  renderTemplate('components', 'project-dist/index.html', 'template.html');
}

buildPage();
