import {netWorkDownUp} from '../../util'
export function setSupervisoryData(res){
  const {down,up} = netWorkDownUp(res) //上传和下载
  let {SGPU1UTI,TGPU1DIO,SMEMUTI,SCPUUTI,TCPUPKG,SRTSSFPS,SGPU1USEDDEMEM,TGPU1HOT,TGPUDIO,TCPUDIO,TGPU1} = res || {}
  let data = {
    useGPU: { value: 0 },//GPU占用
    warmGPU: { value: 0 },//GPU温度
    useMemory: { value: 0 }, //内存占用
    useCPU: { value: 0 }, //CPU占用
    warmCPU: { value: 0}, //CPU温度
    FPS: { value: 0},//FPS
    videoStorage:{ value:0 },//显存
    down:0,
    up:0
  }
  if(down)data.down = down
  if(up) data.up = up
  if(TGPU1DIO || TGPU1HOT || TGPUDIO || TGPU1){
     const warmGPU = TGPU1DIO || TGPU1HOT || TGPUDIO || TGPU1 //替换数据
     data = {...data,warmGPU} //warmGPU为温度固定名称
  }
  if(SGPU1UTI){
    const useGPU = SGPU1UTI
    data = {...data,useGPU}
  }
  if(SMEMUTI){
    const useMemory = SMEMUTI
    data = {...data,useMemory}
  }
  if(SCPUUTI){
    const useCPU = SCPUUTI
    data = {...data,useCPU}
  }
  if(TCPUPKG || TCPUDIO){
    const warmCPU = TCPUPKG || TCPUDIO
    data = {...data,warmCPU}
  }
  if(SRTSSFPS){
    const FPS = SRTSSFPS
    data = {...data,FPS}
  }
  if(SGPU1USEDDEMEM){
    const videoStorage = SGPU1USEDDEMEM
    data = {...data,videoStorage}
  }
  return data
}
