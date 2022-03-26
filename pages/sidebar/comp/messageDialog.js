const messageTempl = `
  <div class="message-wrap" v-show="visible">
    <div class="message-mask" @click="clkmask"></div>
    <div class="message-dialog flex flex-direction">
      <div class="top flex justify-between align-center">
        <div class="top-lf flex justify-center align-center text-black-lg">
          <a-icon type="bell" :style="{ fontSize: '16px' }"></a-icon>
          <span>通知中心</span>
        </div>
        <div class="top-rg flex justify-around align-center">
          <img title="清理全部" src="./assets/clean.svg" alt="" style="width: 18px; height: 18px;" @click="clearMessages" v-if="this.$store.getters.getAllMessages.length > 0">
          <div style="width: 18px; height: 18px;" v-else></div>
          <a-icon title="设置" type="setting" :style="{ fontSize: '16px', color: '#8c8c8c' }" @click="openMsmSetting"></a-icon>
          <a-icon title="固定" type="pushpin" :style="{ fontSize: '16px', color: '#8c8c8c' }" @click="fixedMessage" :theme="fixed ? 'filled' : 'outlined'"></a-icon>
        </div>
      </div>
      <template v-if="this.$store.getters.getAllMessages.length === 0">
        <a-empty :description="false" class="mid flex  align-center justify-center"></a-empty>
      </template>
      <div class="mid" :class="{'silent' : !isSilent}" v-else>
        <div class="lumen flex flex-direction justify-between align-center" v-show="groupMessage.length > 0">
          <div class="lumen-top flex justify-between align-center">
            <div class="lumen-top-lf flex justify-start align-center text-black">
              <img src="../../icons/svg/chat.svg" style="width: 30px; height: 30px;">
              <span>团队</span>
              <a-icon type="export" :style="{ fontSize: '16px', color: '#8c8c8c' }" @click="showGroup"></a-icon>
            </div>
            <a-icon class="lumen-top-rg" type="close-circle" theme="filled" :style="{ fontSize: '16px' }" @click="removeAllMessage('groupChat')"></a-icon>
          </div>
          <div class="lumen-content flex flex-direction justify-center align-center">
            <ul>
              <template>
                <a-dropdown :trigger="['contextmenu']" class="flex justify-between align-center" v-for="(item, index) in groupMessage" :key="index">
                  <li>
                    <div class="flex flex-direction justify-around align-start">
                      <span class="text-black" style="font-weight: 500;">{{item.title}}</span>
                      <span class="text-grey-sm sg-omit2-sm" style="width: 94%">{{item.body}}</span>
                      <span class="text-grey-sm">{{item.time}}</span>
                    </div>
                    <a-icon class="closex" type="close-circle" theme="filled" :style="{ fontSize: '16px' }" @click="removeMessage(item.id)"></a-icon>
                  </li>
                  <a-menu slot="overlay">
                    <a-menu-item key="1"  @click="openMenuClick(item)">
                      打开
                    </a-menu-item>
                    <a-menu-item key="2" @click="delMenuClick(item.id)">
                      删除
                    </a-menu-item>
                    <a-menu-item key="3" @click="noReceived(item)">
                      不再接收团队消息
                    </a-menu-item>
                  </a-menu>
                </a-dropdown>
              </template>
            </ul>
          </div>
        </div>
        <div class="osx flex flex-direction justify-center align-center" v-show="communityMessage.length > 0">
          <div class="osx-top flex justify-between align-center">
            <div class="osx-top-lf flex justify-start align-center text-black">
              <img src="./assets/osx.svg" style="width: 30px; height: 30px;">
              <span>社区</span>
            </div>
            <a-icon class="osx-top-rg" type="close-circle" theme="filled" :style="{ fontSize: '16px' }" @click="removeAllMessage('community')"></a-icon>
          </div>
          <div class="osx-content flex flex-direction justify-center align-center">
            <ul>
              <template>
                <a-dropdown :trigger="['contextmenu']" class="flex justify-between align-center" v-for="(item, index) in communityMessage" :key="index">
                  <li>
                    <div class="flex flex-direction justify-around align-start">
                      <span class="text-black" style="font-weight: 500;">{{item.title}}新动态</span>
                      <span class="text-grey-sm sg-omit2-sm" style="width: 94%">{{item.body}}</span>
                      <span class="text-grey-sm">{{item.time}}</span>
                    </div>
                    <a-icon class="closex" type="close-circle" theme="filled" :style="{ fontSize: '16px' }" @click="removeMessage(item.id)"></a-icon>
                  </li>
                  <a-menu slot="overlay">
                    <a-menu-item key="1" @click="openMenuClick(item.id)">
                      打开
                    </a-menu-item>
                    <a-menu-item key="2" @click="delMenuClick(item.id)">
                      删除
                    </a-menu-item>
                    <a-menu-item key="3" @click="noReceived(item)">
                      不再接收社区消息
                    </a-menu-item>
                  </a-menu>
                </a-dropdown>
              </template>
            </ul>
          </div>
        </div>
        <div class="webos flex flex-direction justify-between align-center" v-show="webOsMessage.length > 0">
          <div class="webos-top flex justify-between align-center text-black">
            <div class="webos-top-lf flex justify-start align-center text-black">
              <img src="./assets/network.svg" style="width: 30px; height: 30px;">
              <span>来自网页的消息</span>
            </div>
            <a-icon class="webos-top-rg" type="close-circle" theme="filled" :style="{ fontSize: '16px' }" @click="removeAllMessage('webOs')"></a-icon>
          </div>
          <div class="webos-content flex flex-direction justify-center align-center">
            <ul>
              <template>
                <a-dropdown :trigger="['contextmenu']" class="flex justify-between align-center" v-for="(item, index) in webOsMessage" :key="index">
                  <li>
                    <div class="flex flex-direction justify-around align-start">
                      <span class="text-black" style="font-weight: 500;">{{item.title}}</span>
                      <span class="text-grey-sm sg-omit-sm" style="width: 94%">{{item.body}}</span>
                      <span class="text-grey-sm">{{item.time}}</span>
                    </div>
                    <a-icon class="closex" type="close-circle" theme="filled" :style="{ fontSize: '16px' }" @click="removeMessage(item.id)"></a-icon>
                  </li>
                  <a-menu slot="overlay">
                    <a-menu-item key="1" @click="openMenuClick(item)">
                      打开
                    </a-menu-item>
                    <a-menu-item key="2" @click="delMenuClick(item.id)">
                      删除
                    </a-menu-item>
                    <a-menu-item key="3" @click="noReceived(item)">
                      不再接收该网页消息
                    </a-menu-item>
                  </a-menu>
                </a-dropdown>
              </template>
            </ul>
          </div>
        </div>
      </div>
      <div class="bottom flex justify-start align-center" v-show="isSilent">
        <img src="./assets/nodisturb.svg" style="width: 34px; height: 34px; margin: 0px 10px;">
        <div class="flex flex-direction justify-center align-start">
          <span class="text-black" style="font-weight: 500;">勿扰模式</span>
          <span class="text-grey-sm sg-omit-sm">关闭系统消息提醒,不显示侧边栏红色</span>
        </div>
      </div>
    </div>
  </div>
`;

Vue.component("message-center", {
  template: messageTempl,
  props: {
    visible: {
      type: Boolean,
    },
    mod: {
      type: String,
    },
  },
  data() {
    return {
      fixed: localStorage.getItem("isMessageFixed") == "true" ? true : false,
      silent: false
    };
  },
  computed: {
    groupMessage() {
      return this.$store.getters.getAllMessages.filter(
        (v) => v.messageType === "groupChat"
      );
    },
    communityMessage() {
      return this.$store.getters.getAllMessages.filter(
        (v) => v.messageType === "community"
      );
    },
    webOsMessage() {
      return this.$store.getters.getAllMessages.filter(
        (v) => v.messageType === "webOs"
      );
    },
    isSilent: {
      get() {
        return this.silent
      },
      set(val) {
        this.silent = val
      }
    }
  },
  methods: {
    showGroup() {
      ipc.send('saAppOpen', {saAppId: 1})
    },
    mountedIsSilent() {
      let messageSetting = JSON.parse(localStorage.getItem("messageSetting"))
      let index = messageSetting.findIndex(v => v.appId === 1)
      let childRes = messageSetting[index].childs.some(v => v.notice === true)
      if(messageSetting[index].notice || childRes) {
        this.silent =  false
      } else {
        this.silent = true
      }
    },
    clearMessages() {
      this.$store.dispatch("deleteAllMessages");
    },
    delMenuClick(id) {
      this.$store.dispatch("deleteMessageById", id);
    },
    openMenuClick(item) {
      if(item.messageType === 'groupChat') {
        ipc.send('mesageOpenOperate', {
          saAppId: 1,
          type: 'groupChat',
          indexName: item.indexName
        })
      } else if(item.messageType === 'webOs') {
        ipc.send('addTab',{url: item.title});
      } else if(item.messageType === 'community') {
        //todo
      }
    },
    noReceived(item) {
      if(item.messageType === 'groupChat') {
        let messageSetting = JSON.parse(localStorage.getItem('messageSetting'))
        let index = messageSetting.findIndex(v => v.appId === 1)
        messageSetting[index].notice = false
        messageSetting[index].childs.forEach(v => {
          v.notice = false
        });
        ipc.send("notificationSettingStatus", messageSetting)
        localStorage.setItem("messageSetting", JSON.stringify(messageSetting))
        this.silent = true
      } else if(item.messageType === 'groupChat') {
        //todo
      } else if(item.messageType === 'webOs') {
        let webMessage = settings.get('noticeWebOrigin')
        let mapWebMessage = webMessage.map(v => {
          if(v.link == item.title) {
            return {
              link: v.link,
              notice: false
            }
          } else {
            return v
          }
        })
        settings.set('noticeWebOrigin', mapWebMessage)
      }
    },
    removeAllMessage(type) {
      this.$store.dispatch("deleteMessageByType", type);
    },
    removeMessage(id) {
      this.$store.dispatch("deleteMessageById", id);
    },
    clkmask() {
      this.$emit("closeMessage");
      localStorage.setItem("isMessageFixed", false);
    },
    openMsmSetting() {
      ipc.send("openMsmSetting");
    },
    fixedMessage() {
      if (this.mod !== "auto" && !this.fixed) {
        let $style = document.getElementsByClassName("message-dialog")[0].style;
        $style.height = "100vh";
        $style.borderRadius = "0px";
        $style.bottom = '0px'
        this.fixed = true;
        this.mod === 'open' ? $style.left = '145px' : $style.left = '45px'
        localStorage.setItem("isMessageFixed", true);
      } else if (this.mod !== "auto" && this.fixed) {
        let $style = document.getElementsByClassName("message-dialog")[0].style;
        $style.height = "600px";
        $style.borderRadius = "10px";
        $style.bottom = '10px'
        this.mod === 'open' ? $style.left = '155px' : $style.left = '55px'
        this.fixed = false;
        localStorage.setItem("isMessageFixed", false);
      } else {
        ipc.send("message", {
          type: "error",
          config: {
            content: "auto模式下无法固定消息中心位置,请切换侧边栏其余两种模式",
          },
        });
      }
    },
  },
  watch: {
    mod: {
      handler(val) {
        if (val === "auto" || val === "open") {
          if(this.fixed) {
            document.getElementsByClassName("message-dialog")[0].style.left = "145px"
            document.getElementsByClassName("message-dialog")[0].style.bottom = "0px"
          } else {
            document.getElementsByClassName("message-dialog")[0].style.left = "155px"
            document.getElementsByClassName("message-dialog")[0].style.bottom = "10px"
          }
        } else {
          if(this.fixed) {
            document.getElementsByClassName("message-dialog")[0].style.left = "45px"
            document.getElementsByClassName("message-dialog")[0].style.bottom = "0px"
          } else {
            document.getElementsByClassName("message-dialog")[0].style.left = "55px"
            document.getElementsByClassName("message-dialog")[0].style.bottom = "10px"
          }
        }
      },
      deep: true,
    },
    fixed: {
      handler(val) {
        if (val === true) {
          document.getElementsByClassName("message-mask")[0].style.display =
            "none";
          ipc.send("channelFixed");
        } else {
          document.getElementsByClassName("message-mask")[0].style.display =
            "block";
          ipc.send("channelFreeFixed");
        }
      },
      deep: true,
    },
  },
  mounted() {
    this.$tag = 'message-center'

    if (this.mod === "auto" || this.mod === "open") {
      if (this.fixed) {
        this.$emit("updateVisible", true);
        let $style = document.getElementsByClassName("message-dialog")[0].style;
        $style.height = "100vh";
        $style.borderRadius = "0px";
        $style.left = '145px'
        $style.bottom = '0px'
        document.getElementsByClassName("message-mask")[0].style.display = "none";
      } else {
        this.$emit("updateVisible", false);
        let $style = document.getElementsByClassName("message-dialog")[0].style;
        $style.height = "600px";
        $style.borderRadius = "10px";
        $style.left = '155px'
        $style.bottom = '10px'
        document.getElementsByClassName("message-mask")[0].style.display =
          "block";
      }
    } else {
      if (this.fixed) {
        this.$emit("updateVisible", true);
        let $style = document.getElementsByClassName("message-dialog")[0].style;
        $style.height = "100vh";
        $style.borderRadius = "0px";
        $style.left = '45px'
        $style.bottom = '0px'
        document.getElementsByClassName("message-mask")[0].style.display = "none";
      } else {
        this.$emit("updateVisible", false);
        let $style = document.getElementsByClassName("message-dialog")[0].style;
        $style.height = "600px";
        $style.borderRadius = "10px";
        $style.left = '55px'
        $style.bottom = '10px'
        document.getElementsByClassName("message-mask")[0].style.display =
          "block";
      }
    }

    if (localStorage.getItem("messageSetting")) {
      ipc.send("notificationSettingStatus", JSON.parse(localStorage.getItem('messageSetting')))
    } else {
      const list = [
        {
          title: "浏览器",
          appId: 0,
          url: "../sidebar/assets/network.svg",
          notice: true,
          childsShow: true,
          childs: [
            {
              title: "网页消息",
              notice: true,
            },
          ],
        },
        {
          title: "团队",
          appId: 1,
          url: "../../icons/svg/chat.svg",
          notice: true,
          childsShow: true,
          childs: [
            {
              title: "聊天",
              notice: true,
            },
            {
              title: "好友申请",
              notice: true,
            },
          ],
        },
        {
          title: "社区",
          appId: 2,
          url: "../sidebar/assets/osx.svg",
          notice: true,
          childsShow: true,
          childs: [
            {
              title: "互动消息",
              notice: true,
            },
            {
              title: "关注消息",
              notice: true,
            },
            {
              title: "应用消息",
              notice: true,
            },
          ],
        },
      ];
      localStorage.setItem("messageSetting", JSON.stringify(list));
      ipc.send("notificationSettingStatus", list)
    }

    this.mountedIsSilent()
  },
});
