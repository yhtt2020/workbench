new Vue({
  el: "#setting",
  data() {
    return {
      webMessage: [
        {
          link: 'app.vipss'
        },
        {
          link: 'app.vipsss'
        },
        {
          link: 'app.vipssss'
        },
        {
          link: 'app.vipsss'
        },
        {
          link: 'app.vipssss'
        }

      ],
      appMessage: [
        {
          title: '浏览器',
          url: '../sidebar/assets/network.svg',
          notice: true,
          childsShow: true,
          childs: [
            {
              title: '网页消息',
              notice: true
            }
          ]
        },
        {
          title: '团队',
          url: '../../icons/svg/chat.svg',
          notice: true,
          childsShow: true,
          childs: [
            {
              title: '聊天',
              notice: true
            },
            {
              title: '好友申请',
              notice: true
            }
          ]
        },
        {
          title: '社区',
          url: '../../icons/svg/chat.svg',
          notice: true,
          childsShow: true,
          childs: [
            {
              title: '互动消息',
              notice: true
            },
            {
              title: '关注消息',
              notice: true
            },
            {
              title: '应用消息',
              notice: true
            }
          ]
        },
        {
          title: '社区',
          url: '../../icons/svg/chat.svg',
          notice: true,
          childsShow: true,
          childs: [
            {
              title: '互动消息',
              notice: true
            },
            {
              title: '关注消息',
              notice: true
            },
            {
              title: '应用消息',
              notice: true
            }
          ]
        },
        {
          title: '社区',
          url: '../../icons/svg/chat.svg',
          notice: true,
          childsShow: true,
          childs: [
            {
              title: '互动消息',
              notice: true
            },
            {
              title: '关注消息',
              notice: true
            },
            {
              title: '应用消息',
              notice: true
            }
          ]
        }
      ]
    }
  },
  methods: {
    changeTree(index) {
      this.appMessage[index].childsShow = !this.appMessage[index].childsShow
    },
    parentOnChange(checked, $event) {
      let index = parseInt($event.currentTarget.dataset.index)
      this.appMessage[index].notice = checked
      this.appMessage[index].childs.forEach(v => {
        v.notice = checked
      });
      console.log(this.appMessage[index])
    },
    childOnChange(checked, $event) {
      console.log($event)
      let index = parseInt($event.currentTarget.dataset.index)
      let rindex = parseInt($event.currentTarget.dataset.rindex)
      this.appMessage[index].childs[rindex].notice = checked
    },
  },
});
