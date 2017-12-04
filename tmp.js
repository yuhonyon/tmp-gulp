const fs = require('fs-extra');
const path = require('path');
const ejs = require('ejs');
const glob = require("glob");
function copy(from,to){
  return new Promise((resolve,reject) => {
    fs.copy(from,to,err => {
      if(err){
        reject(err);
        return;
      }
      resolve(true);
    });
  });
}
function remove(file){
  fs.removeSync(file);
}
function resolve(dir){
  return path.resolve(__dirname, dir);
}
function render(config,src,json){
  let str = fs.readFileSync(resolve(src), 'utf8');
  let info=ejs.render(str, {
      config
  });
  if(json){
    info=JSON.stringify(JSON.parse(info),null, 2);
  }else{
    info=info.replace(/[\n\r]{2,10}/g,'\n');
  }
  fs.outputFile(resolve(src),info);
}
function allRender(config){
  glob(resolve("./")+"/**/*.json", function (err, files) {
    if(err){
      return;
    }
    for(let file of files){
      render(config,file,true);
    }
  });
  glob(resolve("./")+"/**/*.@(js|vue|eslintrc|babelrc)", function (err, files) {
    if(err){
      return;
    }
    for(let file of files){
      render(config,file);
    }
  });
  glob(resolve("./")+"/**/.@(js|eslintrc|babelrc)", function (err, files) {
    if(err){
      return;
    }
    for(let file of files){
      render(config,file);
    }
  });
}

function tmp(config){
  if(config.js!=='webpack'){
    remove(resolve('./webpack.config.js'));
  }
  allRender(config);
  copy(resolve("./"),'./'+config.name).then(() => {
    remove('./'+config.name+'/tmp.js');
    remove('./'+config.name+'/tmpConfig.js');
    console.log('-------生成完成------');
  });
}
module.exports=tmp;
