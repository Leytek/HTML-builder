import * as fs from 'fs';
import * as process from 'process';

const filePath = new URL('./text.txt', import.meta.url).pathname.slice(1);
const fileStream = new fs.ReadStream(filePath, 'utf-8');

fileStream.pipe(process.stdout);
