const SMSClient = require('@alicloud/sms-sdk'); // 引入阿里云短信 SDK

// 阿里云短信服务配置
const accessKeyId = 'LTAI5tKGnmnR6CAoiqhY7HH4';
const accessKeySecret = '1pP10kQDBbTUNWGcJw2iyUtDXavuXh';
// 初始化 SMSClient
const smsClient = new SMSClient({
  accessKeyId,
  secretAccessKey: accessKeySecret,
});

module.exports = { smsClient };