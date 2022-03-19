new Vue({
  el: "#setting",
  data() {
    return {
      webMessage: settings.get('noticeWebOrigin'),
      appMessage: JSON.parse(localStorage.getItem("messageSetting"))
    };
  },
  methods: {
    changeTree(index) {
      this.appMessage[index].childsShow = !this.appMessage[index].childsShow;

      ipc.send("notificationSettingStatus", this.appMessage);
      localStorage.setItem('messageSetting', JSON.stringify(this.appMessage))
    },
    parentOnChange(checked, $event) {
      let index = parseInt($event.currentTarget.dataset.index);
      this.appMessage[index].notice = checked;
      this.appMessage[index].childs.forEach((v) => {
        v.notice = checked;
      });
      console.log(this.appMessage[index]);

      if(this.appMessage[index].title === '浏览器') {
        //todo 后续这里并不仅仅传notification，而是整个浏览器的权限，可能是一个'all'
        ipc.send('allowPermissionsControl', {
          permission: 'notifications',
          status: checked
        })
      } else {
        //把整个消息通知的设置状态发过去，网页消息的话不在这里处理
        ipc.send("notificationSettingStatus", this.appMessage);
      }
      //且状态永久化存储
      localStorage.setItem('messageSetting', JSON.stringify(this.appMessage))

      //去改变sidebar窗体中消息中心的勿扰显示
      if(this.appMessage[index].appId === 1) {
        if(this.appMessage[index].notice) {
          this.appMessage[index].childs.some(v => v.notice === true) ? ipc.send('mainIsSilent', false) : ipc.send('mainIsSilent', true)
        } else {
          ipc.send('mainIsSilent', true)
        }
      }
    },
    childOnChange(checked, $event) {
      let index = parseInt($event.currentTarget.dataset.index);
      let rindex = parseInt($event.currentTarget.dataset.rindex);
      this.appMessage[index].childs[rindex].notice = checked;
      if(checked) {
        this.appMessage[index].notice = checked
      }

      if(this.appMessage[index].title === '浏览器') {
        ipc.send('allowPermissionsControl', {
          permission: 'notifications',
          status: checked
        })
      } else {
        ipc.send("notificationSettingStatus", this.appMessage);
      }
      localStorage.setItem('messageSetting', JSON.stringify(this.appMessage))

      //去改变sidebar窗体中消息中心的勿扰显示
      if(this.appMessage[index].appId === 1) {
        if(this.appMessage[index].childs[rindex].notice) {
          ipc.send('mainIsSilent', false)
        } else {
          this.appMessage[index].childs.some(v => v.notice === true) ? ipc.send('mainIsSilent', false) : ipc.send('mainIsSilent', true)
        }
      }
    },
    removeWebLink(index) {
      this.webMessage[index].notice ? this.webMessage[index].notice = false : this.webMessage[index].notice = true
      settings.set('noticeWebOrigin', this.webMessage)
    }
  }
});
