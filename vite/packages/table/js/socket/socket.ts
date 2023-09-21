import {io} from "socket.io-client";
import {getConfig} from "../axios/serverApi";
import {barrageHandler} from "./barrageHandler";
const socketUrl='ws://localhost:9001'
//const socketUrl='wss://wad.apps.vip/socket'

export let  socket:any ={}

export const initSocket = async () => {
  let config = await getConfig()
  socket = io(socketUrl, {
    autoConnect: false,
    extraHeaders: {
      authorization: config.headers.Authorization
    },
    query:{
      clientId:tsbApi.runtime.clientId,
      platform:process.platform,//此处要指定设备平台
    }

  });

  socket.open();
  socket.on('connect', () => {
    console.log("连接成功");
    // 接收socket连接成功返回的消息
    socket.on('message', data => {
      console.log("socket连接成功的消息", data);
    });
    socket.on('onBarrage',(data)=>{
      barrageHandler.on(data)
    })
    // socket.on('onCommunity',(data)=>{
    //   communityHandler.on(data)
    // })
  });
  socket.on('error', error => {
    console.log("连接错误", error);
  });
  socket.on('connect_error', () => {
    setTimeout(() => {
      socket.connect();
    }, 1000);
  });
  socket.on('disconnect', reason => {
    console.log("连接断开", reason);
    console.log(socket.id);
  });
};
