import {io} from "socket.io-client";
import {getConfig} from "../axios/serverApi";
import {barrageHandler} from "./barrageHandler";
import {kdniaoHandler} from "./kdniaoHandler";
import {noticeHandler} from './noticeHandler'
import { usePermissionStore } from "../../permission/store";
const socketDevUrl='ws://localhost:9001'
const socketPrdUrl='wss://wad.apps.vip'
const dev=false //是否是开发环境

export let  socket:any ={}

export const initSocket = async () => {
  let config = await getConfig()
  const socketConfig={
    debug:true,
    autoConnect: false,
    extraHeaders: {
      authorization: config.headers.Authorization
    },
    query:{
      token:config.headers.Authorization,
      clientId:window.$usePlat() ? '' :tsbApi.runtime.clientId,
      platform:window.$usePlat() ? '' :process.platform,//此处要指定设备平台
      clientName:window.$usePlat() ? '' :tsbApi.runtime.clientName
    }
  }
  if(!dev){
    socketConfig.path='/socket'
    socketConfig.transports=[  "websocket", ]
    socketConfig.secure=true
    //不是开发环境下，单独适配
  }
  socket = io(dev?socketDevUrl:socketPrdUrl, socketConfig);

  socket.open();
  socket.on('connect', () => {
    const usePermission = usePermissionStore()
    // 接收socket连接成功返回的消息
    socket.on('message', data => {
      if(usePermission.isOffline) usePermission.setOffline(false)
      console.log("socket连接成功的消息", data);
    });
    socket.on('onBarrage',(data)=>{
      console.error('弹幕',data)
      barrageHandler.on(data)
    })

    socket.on('onKdniao',(data)=>{
      console.error('收到快递鸟推送消息',data)
      kdniaoHandler.on(data)
    })

    socket.on('onNotice',(data)=>{
      console.error('notice')
      noticeHandler.on(data)
    } )
    // socket.on('onCommunity',(data)=>{
    //   communityHandler.on(data)
    // })
  });
  socket.on('error', error => {
    console.log("连接错误", error);
  });
  socket.on('connect_error', (e) => {
    const usePermission = usePermissionStore()
    console.error(e,'连接失败，原因是')
    // 断开网络连接的时候 设置离线状态 有问题明天改
    usePermission.setOffline(true)
    setTimeout(() => {
      socket.connect();
    }, 1000);
  });
  socket.on('disconnect', reason => {
    console.log("连接断开", reason);
    console.log(socket.id);
  });
};
