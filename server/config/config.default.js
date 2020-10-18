'use strict'
const path = require('path')
const config = {
  keys: '1552708589620_hj',
  cluster: {
    listen: {
      port: 7001,
      hostname: '127.0.0.1',
    },
  },
  Proj: {
    code: 'project', //项目代号,如广西环监:gxhj,遵义lims：zylims
    title: '机动车排气污染防治信息监管平台', //项目标题,可用来显示各处项目标题，比如浏览器标题栏
    authToken: '', //项目授权码
    defaultPCLayout: 'pc2', //默认PC布局
    defaultThema: 'light', //默认主题色
    disablethema: false, //是否禁用主题切换
    loginIpMutex: false, //true代表ip登录排他
    isforceStrongPwd: false, //是否强制要求强密码,false代表不强制要求，true代表强制要求
    isCryptoLoginPWD: false, //是否对登录密码加密
    isTitle: false, // 是否更改标题的开关
  },
  mysql: {
    client: {
      // host
      host: '127.0.0.1',
      // 端口号
      port: '3306',
      // 用户名
      user: 'root',
      // 密码
      password: '123456',
      // 数据库名
      database: 'project',
    },
  },
  redis: {
    clients: {
      fx: {
        host: '127.0.0.1',
        port: 6379,
        password: '123456',
        db: 0,
        keyPrefix: 'hj/',
      },
    },
  },
}
config.cors = {
  origin: '*', // 表示允许的源
  allowMethods: 'GET,HEAD,PUT,POST,DELETE,PATCH', // 表示允许的http请求方式
}
config.security = {
  csrf: {
    enable: false,
  },
}

//站点图片代理路径
config.imgPath = 'StationImg/'
//公安抓拍黄标车管理图片上传路径
config.captureImgPath = 'C://Files'
//excel上传保存路径
config.ExcelPath = 'D:/appData2'
// 扩展几种上传的文件格式
config.multipart = {
  mode: 'stream',
  fileExtensions: ['.xls', '.xlsx', '.csv', '.pdf', '.doc', '.docx', 'txt'],
}
//设置session时间
config.session = {
  maxAge: 1000 * 60 * 60 * 6,
}
config.middleStartTime = '2019/01/01 00:00:00' // 默认2019年1月1日 0时0分0秒
module.exports = config
