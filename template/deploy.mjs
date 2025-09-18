import fs from 'fs-extra';
import archiver from 'archiver';
import { Client } from 'ssh2';
import ora from 'ora';
//  安装命令npm i fs-extra ssh2 ora archiver -D --legacy-peer-deps

// 配置SSH连接信息
const sshConfig = {
  host: '139.129.23.53',
  port: 22,
  username: 'root',
  password: '1yGabl2GdmUM4hPd'
};
const spinner = ora();

// 要打包的文件目录列表
const fileDirectoryList = ['dist'];

// 服务器上的目标解压目录
const remoteDirectory = '/www/wwwroot/sj.chinzee.cn';
const fileName = 'uploadRes.zip';
async function upload() {
  //  连接ssh
  const conn = new Client();
  conn
    .on('ready', () => {
      spinner.start('开始上传文件');
      conn.sftp((err, sftp) => {
        if (err) throw err;
        sftp.fastPut(fileName, `${remoteDirectory}/${fileName}`, (err) => {
          if (err) throw err;
          spinner.succeed('上传文件完成');
          conn.exec(`cd ${remoteDirectory} && unzip -o ${fileName} -d ${remoteDirectory}`, (err, stream) => {
            if (err) throw err;
            stream.on('close', (code, signal) => {
              spinner.succeed('解压文件完成');
              conn.end();
            });
            stream.on('data', (data) => {
              console.log(data.toString());
            });
          });
        });
      });
      conn.on('close', (err) => {
        fs.removeSync(fileName);
        spinner.succeed('删除本地文件');
        spinner.succeed('已上传到服务器，断开连接');
      });
    })
    .connect(sshConfig);
}

async function main() {
  fs.removeSync(fileName);
  spinner.start('开始打包文件');
  const zipFile = archiver('zip', { zlib: { level: 9 } });
  fileDirectoryList.forEach(async (dir) => {
    //  如果本地不存在这个目录 异常提示
    if (!fs.existsSync(dir)) {
      throw new Error(`本地不存在${dir}目录,请先打包`);
    }
    await zipFile.directory(dir, false);
  });
  const output = fs.createWriteStream(fileName);
  //  压缩包写入文件
  await zipFile.pipe(output);
  await zipFile.finalize();
  spinner.succeed('打包文件完成');
  await upload();
}

main();
