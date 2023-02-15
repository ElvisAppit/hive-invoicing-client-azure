module.exports = {
  host: process.env.HOST_NAME,
  user: process.env.FTP_DEPLOY_USERNAME,
  password: process.env.FTP_DEPLOY_PASSWORD,
  port: process.env.FTP_PORT,
  localRoot: process.env.BUILD_PATH,
  remoteRoot: '/',
  include: ['*'],
  exclude: ['dist/**/*.map', 'node_modules/**', 'node_modules/**/.*', '.git/**'],
  deleteRemote: false,
  forcePasv: true,
  sftp: false,
}
