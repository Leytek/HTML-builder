import process from 'process';
import * as fs from 'fs';
import url from 'url';

const filePath = url.fileURLToPath(new URL('./text.txt', import.meta.url));
const fileStream = new fs.WriteStream(filePath, 'utf-8');

console.log('Hello world! Enter you\'r massage:');

process.stdin.on('data', chunk => {
  if(chunk.toString().includes('exit')) process.exit();
  fileStream.write(chunk);
});

process.on('SIGINT', () => process.exit());
process.on('exit', () => console.log('Goodbye world!'));
