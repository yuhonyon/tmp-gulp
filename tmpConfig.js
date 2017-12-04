const fs = require('fs-extra');
const config=[
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
      {name: 'less'}
    ]
  },
  {
    message: '使用postcss',
    type: 'checkbox',
    name: 'style',
    choices: [
      {name: 'pxtorem(px转rem,默认75px>1rem)',value: 'pxtorem',checked: false},
      {name: 'autoprefixer(自动加前缀)',value: 'autoprefixer',checked: false},
      {name: 'cssnext(css4,包含autoprefixer)',value: 'cssnext',checked: false},
      {name: 'precss(仿sass语法)',value: 'precss',checked: false},
      {name: 'cssnano(css优化)',value: 'cssnano',checked: false},
      {name: 'assets(公共路径,插入图片尺寸,内联文件)',value: 'assets',checked: false},
      {name: 'sprites(生成雪碧图及样式)',value: 'sprites',checked: false}
    ],
    when: function(answers) {

      return [121]
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
  },  {
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

module.exports=config;
