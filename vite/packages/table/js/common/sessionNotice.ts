import { useToast } from 'vue-toastification'
import { appStore } from '../../store'
import { chatStore } from '../../store/chat'
import { noticeStore } from '../../page/notice/store/noticeStore'
import { storeToRefs } from 'pinia'
import { router } from "../../router";
import _ from 'lodash-es'
import TIM from '../../TUIKit/TUICore/tim';

import ClockNoticeToast from '../../page/notice/toast/ClockNoticeToast.vue'
import SystemNoticeToast from '../../page/notice/toast/SystemNoticeToast.vue'
import MessageNoticeToast from '../../page/notice/toast/MessageNoticeToast.vue'

const toast =  useToast()

export class Notifications{

  // 闹钟的通知
  public clockToast(msg:any,title:any,changeIcon:any){
    toast.info({
      component:ClockNoticeToast,
      props:{content:msg,noticeType:'notice',isPlay:appStore().$state.settings.noticePlay,title:title,changeIcon:changeIcon},
      listeners:{
        'nowCheck':function(){
          appStore().hideNoticeEntry()
        },
      }
    },{
      icon:false,closeOnClick:false, closeButton:false,pauseOnFocusLoss:true,
      pauseOnHover:true,timeout:0,toastClassName:'notice-toast'
    })
  }
  
  // 消息弱提醒
  public messageWeak(msg:any,conversationID:any){
    const { settings } = storeToRefs(appStore())

    toast.info(
      {
        component:MessageNoticeToast,props:{msg,type:'message',play:settings.value.enablePlay},
        listeners:{
          'putNotice':function(){
            console.log('关闭并存储数据',msg);
            noticeStore().putNoticeData(msg,'message');
          },

          // 'nowCheck':function(){
          //   appStore().hideNoticeEntry();
          //   noticeStore().putNoticeData(msg,'message');
          // },

          'messageExamine': function(){
            chatStore().updateConversation(conversationID)
            appStore().hideNoticeEntry();
            router.push({name:'chatMain'});
            (window as any).$TUIKit.TUIServer.TUIConversation.getConversationProfile(conversationID).then((imResponse:any) => {
              // 通知 TUIConversation 添加当前会话
              // Notify TUIConversation to toggle the current conversation
              (window as any).$TUIKit.TUIServer.TUIConversation.handleCurrentConversation(imResponse.data.conversation);
            })
          }
        },
      },
      {
       icon:false,closeOnClick:false, closeButton:false,pauseOnFocusLoss:true,
       pauseOnHover:true,timeout: 5000,toastClassName:'notice-toast',
      //  onClose() {
      //   noticeStore().putIMChatData(msg,'message')
      //  },
      }
    )
    
  }

  // 消息强提醒
  public messageStrong(msg:any,conversationID:any){
    const { settings } = storeToRefs(appStore())

    toast.info(
      {
        component:SystemNoticeToast,
        props:{msg,type:'notice',play:settings.value.noticePlay},
        listeners:{
          'putNotice':function(){
            console.log('关闭并存储数据',msg);
            noticeStore().putNoticeData(msg,'system');
          },

          // 'nowCheck':function(){
          //   appStore().hideNoticeEntry();
          // },
          
          'systemExamine':function(){
            chatStore().updateConversation(conversationID)
            router.push({name:'chatMain'});
            (window as any).$TUIKit.TUIServer.TUIConversation.getConversationProfile(conversationID).then((imResponse:any) => {
              // 通知 TUIConversation 添加当前会话
              // Notify TUIConversation to toggle the current conversation
              (window as any).$TUIKit.TUIServer.TUIConversation.handleCurrentConversation(imResponse.data.conversation);
            })
          }
        }
      },
      {
        icon:false,closeOnClick:false, closeButton:false,pauseOnFocusLoss:true,
        pauseOnHover:true,timeout:0,toastClassName:'notice-toast'
      }
    )

  }

  // 创建音频播放组件
  private createSoundElement(): HTMLAudioElement{
    let audioElement = document.getElementById('messageAudio') as HTMLAudioElement;
    if (!audioElement) {
      audioElement = document.createElement('audio');
      audioElement.src = '/sound/message.mp3'
      audioElement.setAttribute('id', 'messageAudio');
      document.body.appendChild(audioElement);
    }
    return audioElement;
  }

  // 创建音频强提醒
  private createSoundStrongElement(): HTMLAudioElement{
    let audioElement = document.getElementById('messageAudio') as HTMLAudioElement;
    if (!audioElement) {
      audioElement = document.createElement('audio');
      audioElement.src = '/sound/notice.mp3'
      audioElement.setAttribute('id', 'messageAudio');
      document.body.appendChild(audioElement);
    }
    return audioElement;
  }

  // 获取字符串中的数字
  private extractNumbersFromString(str:any){
    const regex = /\d+/g; // 匹配一个或多个数字的正则表达式
    const matches = str.match(regex); // 使用match方法获取匹配的数字数组
    if (matches) {
     return matches.map(Number); // 将字符串数字转换为数字类型
    } else {
    return []; // 如果没有匹配到数字则返回空数组
    }
  }

  // 解析系统通知消息方法
  private async translateGroupSystemNotice(message:any){
    const groupResult = await (window as any).$TUIKit.tim.getGroupList()
    // console.log('请求返回结果',groupResult);

    const groupList = groupResult?.data?.groupList
    // console.log('查看群聊列表',groupList);

    const findGroup = groupList.find((item:any)=>{
     return String(item.groupID) === String(message.to)
    })
    // console.log('获取群聊数据',findGroup);

    let  numArr: any;
    if(message.payload.data === 'group_create'){
     const extension = message.payload.extension
     //console.log('排查',extension);
    
     numArr = this.extractNumbersFromString(extension)
     // console.log('查看strArr',numArr);
    }
    

    const option = {
      userIDList: message.payload.data === 'group_create' ? [`${numArr[0]}`] : message.payload.userIDList ? message.payload.userIDList :  [`${message.payload.operatorID}`]
    }
    // console.log('查看参数配置',option);
    
    
    const res = await (window as any ).$TUIKit.tim.getUserProfile(option)
    // console.log('获取用户名称',res.data);

    let userinfo = res.data[0]
    // console.log('排查::>>',userinfo);
    

    const groupName = findGroup?.name === undefined ? message.payload.groupProfile.name : findGroup?.name ;
    const username = userinfo === undefined ? message.nick : userinfo?.nick;
    // console.log('查看用户昵称',username);
    
    // console.log('验证通知消息类型',message.payload.operationType);

    switch (message.payload.operationType){
      case TIM.TYPES.GRP_TIP_MBR_JOIN:
        // console.log('查看消息通知为什么有两条',message.payload);
        return `${username} 申请加入群组：${groupName}`;
      case TIM.TYPES.GRP_TIP_MBR_QUIT:
        return `${username} 退出群组：${groupName}`;
      case 3:
        return `申请加入群组：${groupName} 被拒绝`;
      case 4:
        return `你被管理员${username} 踢出：${groupName}群组`;
      case 5:
        return `群：${groupName} 被 ${username} 解散`;
      case 6:
        return `${username} 创建群：${groupName}`;
      case 7:
        return `${username} 邀请你加群：${groupName}`;
      case 8:
        return `你退出群组：${groupName}`;
      case 12:
        return `${username} 邀请你加群：${groupName}`;
      case 13:
        return `${username} 同意加群：${groupName}`;
      case 14:
        return `${username} 拒接加群：${groupName}`;
      case undefined && message.payload.data === 'group_create':
        return `${username} 创建群：${groupName}`;
      default:
        break;
    }

  }


  // 社群消息通知
  public async receiveNotification(msg:any){

    const data = {...msg.data[0]}
    const { settings,userInfo  } = storeToRefs(appStore())
    const app = appStore()
    const server = (window as any).$TUIKit.TUIServer.TUIChat.store

    const config = {
      enable:settings.value.noticeEnable === false, // 消息通知开关
      global:router.options.history.state.current !== '/chatMain', // 是否在聊天页面
      cue:settings.value.enablePlay, // 提示音开关
      currentSession:server.conversation?.conversationID === data.conversationID, // 当前会话
      atMsg:data.atUserList.length !== 0, // @全部消息
      atMeMsg:data.atUserList.includes(String(userInfo.value.uid)), // @我的消息
      currentDisturb:server.conversation?.groupProfile?.selfInfo.messageRemindType === 'AcceptAndNotify', // 免打扰
      emptyData:Object.keys(server.conversation).length === 0 // 空数据
    }

    app.showNoticeEntry()
    
    // 消息内容为text是否存在
    const isText = data.payload.hasOwnProperty('text')
  
    if(isText){
      // 好友消息
      if(data.conversationType === 'C2C'){
        // 好友消息内容
        const friendContent = {
          icon:data.avatar,
          title:`好友${data.nick}的消息`,
          body: `${data.nick}：${data.payload.text}`,
          time:data.time
        }
        // 全局
        if(config.global && config.enable && config.cue && !config.currentDisturb){ 
          this.messageWeak(friendContent,data.conversationID)
        }
        // 所属应用中(非当前会话)
        else if(!config.global && config.enable && config.cue && !config.currentSession && !config.currentDisturb){  
          const playElement: HTMLAudioElement = this.createSoundElement();
          playElement.play()
        }
      }

      // 群聊消息
      else{
        const groupResult = await (window as any).$TUIKit.tim.getGroupList();
        const groupList = groupResult?.data?.groupList
        const findItem = groupList.find((item:any)=>{ return String(item.groupID) === String(data.to) })
        const textContent = {
          icon:findItem.avatar,
          title:findItem.name,
          body:`${data.nick}：${data.payload.text}`,
          time:data.time
        }
        

        // 群聊消息全局情况下
        if(config.global && config.enable && config.cue || !config.currentDisturb){
          // @我和@所有人的消息
          if(config.atMeMsg && config.atMsg){  // 强提醒
            this.messageStrong(textContent,data.conversationID)
          }else{
            this.messageWeak(textContent,data.conversationID)
          }
        }

        // 所属应用中(非当前会话)
        else if(!config.global && config.enable && config.cue && !config.currentSession || !config.currentDisturb){
          // @我和@所有人的消息
          if(config.atMeMsg && config.atMsg){  // 强提醒
            const strongEl:HTMLAudioElement = this.createSoundStrongElement()
            strongEl.play()
          }else{
            const playElement: HTMLAudioElement = this.createSoundElement();
            playElement.play()
          }
        } 


      }
    }

    else{
      // console.log('查看情况',data);
      // console.log('查看判断条件',config.enable && config.cue || !config.currentDisturb);
      
      
      if(data.conversationType !== 'C2C'){
        // 将群聊通知的用户uid进行中文昵称显示
        const systemText = await this.translateGroupSystemNotice(data)  
        // 通知、提示音开关是否打开
        if(config.enable && config.cue || !config.currentDisturb){
          const systemContent = { title:'社群沟通', icon:'/icons/IM.png',  time:data.time, body:systemText, }
          this.messageWeak(systemContent,data?.conversationID)
        }
      }

    }

  }

}