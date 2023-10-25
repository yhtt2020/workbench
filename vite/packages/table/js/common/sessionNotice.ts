// import { noticeStore } from "../../store/notice";
// import { router } from "../../router";
// import { useToast } from 'vue-toastification'
// import NoticeToastButton from '../../components/notice/noticeToastButton.vue'
// import SystemNoticeToast from '../../components/notice/systemNoticeToast.vue'
// import clockNoticeToast from '../../components/notice/clockNoticeToast.vue'
// import { appStore } from '../../store'

// const toast = useToast()

export class Notifications{
  // private noticeObj:null

  // // 系统toast
  // private systemToast(msg:any,conversationID:any){
  //   toast.info(
  //     {
  //       component:SystemNoticeToast,props:{content:msg,noticeType:'notice',isPlay:appStore().$state.settings.noticePlay},
  //       listeners:{
  //         'nowCheck':function(){
  //           appStore().hideNoticeEntry()
  //           noticeStore().putIMChatData(msg,'Notice')
  //           noticeStore().loadNoticeDB()
  //         },
  //         'systemExamine':function(){
  //           router.push({name:'chatMain'});
  //           (window as any).$TUIKit.TUIServer.TUIConversation.getConversationProfile(conversationID).then((imResponse:any) => {
  //             // 通知 TUIConversation 添加当前会话
  //             // Notify TUIConversation to toggle the current conversation
  //             (window as any).$TUIKit.TUIServer.TUIConversation.handleCurrentConversation(imResponse.data.conversation);
  //           })
  //         }
  //       }
  //     },
  //     {
  //       icon:false,closeOnClick:false, closeButton:false,pauseOnFocusLoss:true,
  //       pauseOnHover:true,timeout:0,toastClassName:'notice-toast'
  //     }
  //   )
  // }
  // private clockToast(msg:any,title:any,changeIcon:any){
  //   toast.info(
  //     {
  //       component:clockNoticeToast,props:{content:msg,noticeType:'notice',isPlay:appStore().$state.settings.noticePlay,title:title,changeIcon:changeIcon},
  //       listeners:{
  //         'nowCheck':function(){
  //           noticeStore().hideNoticeEntry()
  //         },
  //       }
  //     },
  //     {
  //       icon:false,closeOnClick:false, closeButton:false,pauseOnFocusLoss:true,
  //       pauseOnHover:true,timeout:0,toastClassName:'notice-toast'
  //     }
  //   )
  // }

  // // 普通toast
  // private commonToast(msg:any,conversationID:any){
  //   toast.info(
  //     {
  //       component:NoticeToastButton,props:{message:msg,messageType:'message',isPlay:appStore().$state.settings.enablePlay},
  //       listeners:{
  //         'nowCheck':function(){
  //           appStore().hideNoticeEntry();
  //           noticeStore().putIMChatData(msg,'message');
  //           console.log('检测this',this)
  //         },
  //         'examine': function(){
  //           router.push({name:'chatMain'});
  //           (window as any).$TUIKit.TUIServer.TUIConversation.getConversationProfile(conversationID).then((imResponse:any) => {
  //             // 通知 TUIConversation 添加当前会话
  //             // Notify TUIConversation to toggle the current conversation
  //             (window as any).$TUIKit.TUIServer.TUIConversation.handleCurrentConversation(imResponse.data.conversation);
  //           })
  //         }
  //       },
  //     },
  //     {
  //      icon:false,closeOnClick:false, closeButton:false,pauseOnFocusLoss:true,
  //      pauseOnHover:true,timeout: 5000,toastClassName:'notice-toast',
  //     //  onClose() {
  //     //   noticeStore().putIMChatData(msg,'message')
  //     //  },
  //     }
  //   )
  // }

  // // 获取名称
  // private async getName(msg:any){
  //   if (msg.conversationType === "GROUP") {
  //     const res = await (window as any).$chat.getGroupProfile({ groupID: msg.to });
  //     return res.data.group.name;
  //   } else {
  //     return "";
  //   }
  // }

  // // 获取群组头像
  // private async getGroupAvatar(val:any){
  //   if(val.data[0].conversationType === 'GROUP'){
  //     const res = await (window as any).$chat.getGroupProfile({ groupID:val.data[0].to })
  //     return res.data.group.avatar
  //   }
  // }

  // // 根据参数获取用户名称
  // private async getUserProfile(msg: any) {
  //   // 根据用户名称
  //   const res = await (window as any).$chat.getUserProfile({
  //     userIDList: [`${msg.operatorID}`],
  //   });
  //   return res.data[0].nick;
  // }

  // // 获取系统通知内容
  // private async getSystemBody(msg:any){
  //   const data = msg.payload
  //   const groupName = data.groupProfile?.name || data.groupProfile?.groupID;
  //   const userName = await this.getUserProfile(data);
  //   let info: any; // 接收不同系统通知消息

  //   console.log(data.operationType);

  //   switch (data.operationType) {
  //     case 1:
  //       if (msg.handleMessage === "加群" && msg.hasOwnProperty("handleMessage")) {
  //         info = `${userName}申请加入群组:${groupName}`;
  //       } else {
  //         info = `${msg.nick === '' ? userName : msg.nick}加入${msg.payload.groupProfile?.groupName || msg.payload.groupProfile?.name}群聊`;
  //       }
  //       break;
  //     case 2:
  //       info = `成功加入群组：${groupName}`;
  //       break;
  //     case 3:
  //       console.log(data);
  //       info = `申请加入群组:${groupName}被拒绝`;
  //       break;
  //     case 4:
  //       if(data.hasOwnProperty('memberList') && data.memberList.length !== 0 && data.memberList[0].role === 300){
  //         info = `${data.memberList[0].nick}被${userName} 设置为群：${groupName} 的管理员`;
  //       }else{
  //         info = `你${msg.nick}被管理员${userName}踢出群组：${groupName}`
  //       }
  //       break;
  //     case 5:
  //       if(data.hasOwnProperty('memberList') && data.memberList.length !== 0 && data.memberList[0].role === 200){
  //         info = `${data.memberList[0].nick}被${userName} 撤销群：${groupName} 的管理员身份`;
  //       }else{
  //         info = `群：${groupName}被${userName} 解散`;
  //       }
  //       break;
  //     case 6:
  //       info = `${userName} 创建群：${groupName}`;
  //       break;
  //     case 8:
  //       info = `你退出群组：${groupName}`;
  //       break;
  //     case 9:
  //       info = '';
  //       // info = `你被${userName} 设置为群：${groupName} 的管理员`;
  //       break;
  //     case 10:
  //       info = '';
  //       // info = `你被${userName} 撤销群：${groupName} 的管理员身份`;
  //       break;
  //     case 12:
  //       info`${userName} 邀请你加群：${groupName}`;
  //       break;
  //     case 13:
  //       info = `${userName} 同意加群：${groupName}`;
  //       break;
  //     case 14:
  //       info = `${userName} 拒接加群：${groupName}`;
  //       break;
  //     case 20:
  //       info = ''
  //       break;
  //     case 255:
  //       info = `自定义群系统通知: ${data.userDefinedField}`;
  //       break;
  //   }

  //   return info
  // }


  // // 接收IM聊天消息通知公共方法
  // public async receiveNotification(notification:any){
  //   const store = appStore()
  //   const {settings,userInfo} = store

  //   // 创建一个audio标签
  //   function createOrUpdateAudioElement(): HTMLAudioElement {
  //     let audioElement = document.getElementById('messageAudio') as HTMLAudioElement;

  //     if (!audioElement) {
  //       audioElement = document.createElement('audio');
  //       audioElement.src = '/sound/message.mp3'
  //       audioElement.setAttribute('id', 'messageAudio');
  //       document.body.appendChild(audioElement);
  //     }

  //     return audioElement;
  //   }
  //   const audioElement: HTMLAudioElement = createOrUpdateAudioElement();

  //   const data = notification.data[0]
  //   const c2cData = {
  //     type:data.conversationType,
  //     nickname: data.conversationType === 'C2C' ? data.nick : data.to,
  //     text:data.payload.hasOwnProperty('text') ? `${data.payload.text}`:''
  //   }
  //   this.noticeObj = c2cData

  //   const setting = {
  //     isStore:Object.keys((window as any).$TUIKit.TUIServer.TUIChat.store.conversation).length !== 0, // 判断chat界面缓存不为空
  //     isEnable:settings.noticeEnable, // 消息开关
  //     isGlobal:router.options.history.state.current !== '/chatMain', // 判断是否在全局页面
  //     enablePlay:settings.enablePlay, // 提示音开关
  //     isCurrentChat:(window as any).$TUIKit.TUIServer.TUIChat.store.conversation?.conversationID === data.conversationID, // 判断是否为当前会话
  //     isAT:data.atUserList.length !== 0, // 判断@消息
  //     isAtMe:data.atUserList.includes(String(userInfo.uid)),
  //     noTrouble:(window as any).$TUIKit.TUIServer.TUIChat.store.conversation?.groupProfile?.selfInfo.messageRemindType === 'AcceptAndNotify', // 是否开启免打扰
  //     isEmpty:Object.keys((window as any).$TUIKit.TUIServer.TUIChat.store.conversation).length === 0, // 为空
  //   }


  //   // 判断消息开关和音频开关是否打开
  //   if(!setting.isEnable && !setting.noTrouble){
  //     // console.log('开启消息通知');
  //     // console.log('排查问题::>>');
  //     const isText = data.payload.hasOwnProperty('text')
  //     // 普通文本内容
  //     if(isText){
  //       // 好友名称标题
  //       const friendTitle = data.nick ? `${data.nick}` : ''
  //       // 群组名称标题
  //       const groupTitle = await this.getName(data) !== '' ?  `${await this.getName(data)}` : ''
  //       // 获取头像
  //       const avatar = await this.getGroupAvatar(notification)

  //       // 主页面情况
  //       if(setting.isGlobal){
  //         // 显示消息入口
  //         store.showNoticeEntry()
  //         const newMsg = {
  //           title:data.conversationType === 'C2C' ? friendTitle : groupTitle,
  //           icon:data.conversationType === 'C2C' ? data.avatar : avatar,
  //           body:`${data.nick}：${data.payload.text}`,
  //           time:data.time,
  //         }
  //         if(settings.isAtMe){
  //           this.systemToast(newMsg,data.conversationID)
  //         }else{
  //           this.commonToast(newMsg,data.conversationID)
  //         }

  //       }

  //       // 聊天页面
  //       else if(!setting.enablePlay){
  //         // 不在当前会话
  //         if(!setting.isStore && !setting.isCurrentChat){
  //           if(settings.isAtMe){
  //             audioElement.play()
  //           }else{
  //             audioElement.play()
  //           }
  //         }
  //       }
  //     }
  //     // 群系统通知
  //     else{
  //       if(data.payload.description !== ''){
  //         const body = await this.getSystemBody(data)
  //         if(body !== ''){
  //           const notice = {
  //             title:'社群沟通',
  //             body:body,
  //             icon:'/icons/IM.png',
  //             time:data.time
  //           }
  //           this.commonToast(notice,data.conversationID)
  //         }
  //       }
  //     }
      
  //   }else{
  //     // console.log('关闭消息通知');
  //     return;
  //   }
    
  // }

}
