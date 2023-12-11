import {netWorkDownUp} from '../../util'
import {execSync} from "child_process";

export function setSupervisoryData(res) {
  const {down, up} = netWorkDownUp(res) //上传和下载
  let {
    SGPU1UTI,
    TGPU1DIO,
    SMEMUTI,
    SCPUUTI,
    TCPUPKG,
    SRTSSFPS,
    SGPU1USEDDEMEM,
    TGPU1HOT,
    TGPUDIO,
    TCPUDIO,
    TGPU1
  } = res || {}
  let data = {
    useGPU: 0,//GPU占用
    warmGPU:0,//GPU温度
    useMemory: 0, //内存占用
    useCPU: 0, //CPU占用
    warmCPU: 0, //CPU温度
    FPS: 0,//FPS
    videoStorage:0,//显存
    down: 0,
    up: 0
  }
  if (down) data.down = down
  if (up) data.up = up
  if (TGPU1DIO || TGPU1HOT || TGPUDIO || TGPU1) {
    const warmGPU = TGPU1DIO || TGPU1HOT || TGPUDIO || TGPU1 //替换数据
    data = {...data, warmGPU} //warmGPU为温度固定名称
  }
  if (SGPU1UTI) {
    const useGPU = SGPU1UTI
    data = {...data, useGPU}
  }
  if (SMEMUTI) {
    const useMemory = SMEMUTI
    data = {...data, useMemory}
  }
  if (SCPUUTI) {
    const useCPU = SCPUUTI
    data = {...data, useCPU}
  }
  if (TCPUPKG || TCPUDIO) {
    const warmCPU = TCPUPKG || TCPUDIO
    data = {...data, warmCPU}
  }
  if (SRTSSFPS) {
    const FPS = SRTSSFPS
    data = {...data, FPS}
  }
  if (SGPU1USEDDEMEM) {
    const videoStorage = SGPU1USEDDEMEM
    data = {...data, videoStorage}
  }
  return data
}

export declare interface IDisplayData {
  useGPU: number,
  useCPU: number,
  useMemory: number,
  FPS: number,
  warmGPU:number,
  warmCPU:number,
  down: number,
  up: number
}

async function getNetStat(){
  const { execSync } = require('child_process');
  const command = `Get-Counter '\\Network Interface(*)\\Bytes Received/sec' '\\Network Interface(*)\\Bytes Sent/sec' -EA SilentlyContinue`;
  const result = execSync(`powershell -Command "${command}"`);
  console.log(result.toString());
}
export function prettyDisplayBytes(data){
  let unit='KB'
  let num=0
  data=data/1000
  if(data < 1000){
    num=data
    unit='KB'
  }else if(data<1024000){
    num=data/1024
    unit='MB'
  }else {
    num=data/1024/1024
    unit='GB'
  }
  return num.toFixed(1)+' '+unit
}
export async function getSysStats() {
  let dsData: IDisplayData = {
    useGPU: 0,
    useCPU: 0,
    warmGPU:0,
    warmCPU:0,
    useMemory: 0,
    FPS: 0,
    down: 0,
    up: 0
  }
  let osu = window.$models.osUtils
  const inspector=window.$models.inspector
  dsData.useCPU = (await inspector.getCpuUsage()) || 0
  console.log(await inspector.getCpuUsage())
  const usedMem = await osu.mem.used()
  dsData.useMemory = (usedMem.usedMemMb / usedMem.totalMemMb)*100 || 0

  const net=await inspector.getRealtimeNetworkBandwidth()
  dsData.down=net.receivedBandwidth/2 || 0
  dsData.up=net.sentBandwidth/2 || 0
  dsData.warmCPU=(await inspector.getCpuTemperature() )||0
  console.log(dsData.warmCPU)

  return dsData
}
