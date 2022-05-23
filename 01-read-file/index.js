import process from 'process';
import fs from 'fs';
import url from 'url';

const filePath = url.fileURLToPath(new URL('./text.txt', import.meta.url));
const fileStream = new fs.ReadStream(filePath, 'utf-8');

fileStream.pipe(process.stdout);
