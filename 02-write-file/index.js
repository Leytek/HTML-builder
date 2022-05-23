import process from 'process';
import fs from 'fs';
import url from 'url';

const filePath = url.fileURLToPath(new URL('./text.txt', import.meta.url));
const fileStream = new fs.WriteStream(filePath, 'utf-8');

process.stdout.write('Hello world! Enter you\'r massage:\n');

process.stdin.on('data', chunk => {
  if(chunk.toString().includes('exit')) process.exit();
  fileStream.write(chunk);
});

process.on('SIGINT', () => process.exit());
process.on('exit', () => process.stdout.write('Goodbye world!'));
