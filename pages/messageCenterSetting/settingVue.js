new Vue({
  el: "#setting",
  data() {
    return {
      webMessage: [
        {
          link: "app.vipss",
        },
        {
          link: "app.vipsss",
        },
        {
          link: "app.vipssss",
        },
        {
          link: "app.vipsss",
        },
        {
          link: "app.vipssss",
        },
      ],
      appMessage: localStorage.getItem("messageSetting")
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

      //把整个消息通知的设置状态发过去，且状态永久化存储
      ipc.send("notificationSettingStatus", this.appMessage);
      localStorage.setItem('messageSetting', JSON.stringify(this.appMessage))
    },
    childOnChange(checked, $event) {
      console.log($event);
      let index = parseInt($event.currentTarget.dataset.index);
      let rindex = parseInt($event.currentTarget.dataset.rindex);
      this.appMessage[index].childs[rindex].notice = checked;

      ipc.send("notificationSettingStatus", this.appMessage);
      localStorage.setItem('messageSetting', JSON.stringify(this.appMessage))
    },
  }
});
