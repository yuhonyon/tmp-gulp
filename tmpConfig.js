const fs = require('fs-extra');
const tmp=[
  {
    message: '请输入项目名',
    default: 'my-gulp-roject',
    type: 'input',
    name: 'name',
    validate: function(value) {
      if (!/^[a-zA-Z-_0-9]+$/.test(value)) {
        return '项目名不规范,请重新输入';
      }
      if(fs.existsSync(value)){
        return '已经存在同名项目';
      }
      return true;
    }
  },
  {
    message: '打包预编译样式',
    type: 'checkbox',
    name: 'style',
    choices: [
      {name: 'sass',checked: true},
      {name: 'pxtorem(px转rem,默认75px>1rem)',value: 'pxtorem',checked: true},
      {name: 'autoprefixer(自动加前缀)',value: 'autoprefixer',checked: true},
      {name: 'cssnext(css4,包含autoprefixer)',value: 'cssnext',checked: true},
      {name: 'precss(仿sass语法)',value: 'precss',checked: true},
      {name: 'cssnano(css优化)',value: 'cssnano',checked: true},
      {name: 'assets(公共路径,插入图片尺寸,内联文件)',value: 'assets',checked: false},
      {name: 'sprites(生成雪碧图及样式)',value: 'sprites',checked: true}
    ]
  },
  {
    message: '使用postcss',
    type: 'postcss',
    name: 'style',
    choices: [
      {name: '不使用',checked: true,value: false},
      {name: 'postcss-css'}
    ]
  },
  {
    type: 'input',
    name: 'md5',
    message: '添加md5去缓存',
    default: 'y',
    validate: function(value) {
      if (/^[yn]$/.test(value)) {
        return true;
      }
      return '请输出y或者n';
    }
  },
  {
    type: 'input',
    name: 'html',
    message: '打包html',
    default: 'y',
    validate: function(value) {
      if (/^[yn]$/.test(value)) {
        return true;
      }
      return '请输出y或者n';
    }
  }, {
      type: 'input',
      name: 'img',
      message: '打包图片img',
      default: 'y',
      validate: function(value) {
        if (/^[yn]$/.test(value)) {
          return true;
        }
        return '请输出y或者n';
      }
    },
  {
    type: 'list',
    name: 'js',
    message: '打包js',
    default: false,
    choices: [
      {
        name: 'webpack模式',
        value: 'webpack'
      },
      {
        name: 'browserify模式',
        value: 'browserify'
      },
      {
        name: '不使用',
        value: false
      }
    ]
  },{
      type: 'input',
      name: 'server',
      message: '本地服务器(自动刷新)',
      default: 'y',
      validate: function(value) {
        if (/^[yn]$/.test(value)) {
          return true;
        }
        return '请输出y或者n';
      }
    }
];

module.exports=tmp;
