import {readdirSync} from 'node:fs';
import {join} from 'node:path';
import {spawnSync} from 'node:child_process';
const files=readdirSync('dist',{recursive:true}).filter(f=>f.endsWith('.js'));
for(const file of files){const r=spawnSync(process.execPath,['--check',join('dist',file)],{encoding:'utf8'});if(r.status!==0){process.stderr.write(r.stderr||'Syntax check failed: '+file);process.exit(1)}}
console.log('JavaScript syntax passed: '+files.length+' files');
