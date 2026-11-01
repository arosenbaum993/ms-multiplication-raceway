import http from 'node:http';
import {readFile} from 'node:fs/promises';
import path from 'node:path';
const root=path.resolve(process.argv[2]);
const types={'.html':'text/html; charset=utf-8','.js':'text/javascript; charset=utf-8','.css':'text/css; charset=utf-8','.png':'image/png','.webp':'image/webp','.svg':'image/svg+xml','.mp3':'audio/mpeg','.json':'application/json'};
http.createServer(async(req,res)=>{
  try {
    const url=new URL(req.url,'http://127.0.0.1');
    const requested=decodeURIComponent(url.pathname)==='/'?'index.html':decodeURIComponent(url.pathname).slice(1);
    let file=path.resolve(root,requested);
    if(!path.extname(file))file+='.html';
    if(!file.startsWith(root+path.sep)){res.writeHead(403);res.end();return;}
    const body=await readFile(file);
    const headers={'Content-Type':types[path.extname(file)]||'application/octet-stream','Cache-Control':'no-store','Accept-Ranges':'bytes','Content-Length':body.length};
    const range=req.headers.range?.match(/^bytes=(\d+)-(\d*)$/);
    if(range){const start=Number(range[1]),end=range[2]?Math.min(Number(range[2]),body.length-1):body.length-1;if(start> end){res.writeHead(416,{'Content-Range':'bytes */'+body.length});res.end();return}res.writeHead(206,{...headers,'Content-Length':end-start+1,'Content-Range':`bytes ${start}-${end}/${body.length}`});res.end(body.subarray(start,end+1));return}
    res.writeHead(200,headers);res.end(body);
  }catch{res.writeHead(404);res.end('Not found');}
}).listen(8891,'127.0.0.1',()=>console.log('Local URL: http://127.0.0.1:8891'));
