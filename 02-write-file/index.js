import process from 'process';
import * as fs from 'fs';

const filePath = new URL('./text.txt', import.meta.url).pathname.slice(1);
const fileStream = new fs.WriteStream(filePath, 'utf-8');

console.log('Hello world! Enter you\'r massage:');

process.stdin.on('data', chunk => {
  if(chunk.toString().includes('exit')) process.exit();
  fileStream.write(chunk);
});

process.on('SIGINT', () => process.exit());
process.on('exit', () => console.log('Goodbye world!'));
