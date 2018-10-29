const fs = require('fs-extra');
const path = require('path');
const ejs = require('ejs');
const glob = require("glob");


function pathResolve(dir){
  return path.resolve(__dirname, dir);
}



function render(config){
  return new Promise((resolve,reject)=>{
    glob(pathResolve("./")+"/*.@(js|eslintrc|babelrc|json|gitgnore)", function (err, files) {
      if(err){
        reject()
        return;
      }
      console.log(files)
      for(let file of files){
        let template=fs.readFileSync(pathResolve(file), 'utf8');
        let result=ejs.render(template, config);
        fs.writeFileSync(pathResolve(file),result);
      }
      resolve()
    });
  })
}



function tmp(config){
  render(config).then(()=>{
    fs.copySync(pathResolve("./"),'./'+config.name);
    fs.removeSync('./'+config.name+'/tmp.js');
    fs.removeSync('./'+config.name+'/tmpConfig.js');
  })

}
module.exports=tmp;
