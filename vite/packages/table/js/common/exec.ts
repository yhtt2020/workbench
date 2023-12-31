import {arch} from "process";

const {exec} = require('child_process')
const iconv=window.iconv
let workerProcess
const path=require('path')
export function getResPath() {
  let isDevelopmentMode = 'development-mode' in window.globalArgs
  if (isDevelopmentMode) {
    return window.globalArgs['app-dir_name'] + `/../../res`
  } else {
    return path.dirname(window.globalArgs['app-dir_name']) + `/../../res`
  }
}

/**
 * 获取到res目录，并拼接
 * @param paths
 */
export function getResPathJoin(...paths) {
  return require('path').join(getResPath(), ...paths)
}

/**
 * 执行一个cmd命令
 * @param cmdStr
 * @param cmdPath
 */
export async function runExec(cmdStr, cmdPath?) {
  let promise = new Promise((resolve, reject) => {
    // 执行命令行，如果命令不需要路径，或就是项目根目录，则不需要cwd参数：
    workerProcess = exec(cmdStr, {cwd: cmdPath,encoding:'buffer'})
    // 不受child_process默认的缓冲区大小的使用方法，没参数也要写上{}：workerProcess = exec(cmdStr, {})

    // 打印正常的后台可执行程序输出
    workerProcess.stdout.on('data', function (data) {
      console.log('stdout: ' + iconv.decode(Buffer.from(data, "binary"), 'GBK'));
      resolve( iconv.decode(Buffer.from(data, "binary"), 'GBK'))
    });
//退出之后的输出
    workerProcess.on('close', function (code) {
      resolve(code)
      console.log('out code：' +code);
    })

    // 打印错误的后台可执行程序输出
    workerProcess.stderr.on('data', function (data) {
      console.log('stderr: ' +  iconv.decode(Buffer.from(data, "binary"), 'GBK'));
      reject( iconv.decode(Buffer.from(data, "binary"), 'GBK'))
    });
  })


  return promise

}

export async function runSoundVolume(cmd){
  let path = getResPathJoin('nir', 'SoundVolumeView.exe')
  return await runExec(`"${path}" ` + cmd, undefined)
}

export async function runMultiMonitorToolCmd(cmd){
  const {arch} = require('process')
  let path = getResPathJoin('MultiMonitorTool', arch, 'MultiMonitorTool.exe')
  return await runExec(`"${path}" ` + cmd, undefined)
}

/**
 * 运行nircmd
 * @param cmd
 * @returns {Promise<unknown>}
 */
export async function runNir(cmd) {
  const {arch} = require('process')
  let path = getResPathJoin('nir', arch, 'nircmdc.exe')
  return await runExec(`"${path}" ` + cmd, undefined)
}
