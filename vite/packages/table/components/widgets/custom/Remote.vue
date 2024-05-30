<template>
  <!--  <div class="card  gradient gradient&#45;&#45;14  content small" style="display: flex;flex-direction: column;align-content: center;align-items: center">-->
  <!--&lt;!&ndash;  <my-list id="my" > <slot></slot></my-list>&ndash;&gt;-->
  <!--  </div>-->
  <xt-task :modelValue="m03031" @cb="openRightMenu">
    <xt-container
      :header="header"
      v-model:customSize="customData.customSize"
      :customIndex="customIndex"
      :size="customSize"
      :options="options"
      :menuList="menuList"
      ref="remote"
      :custom-data="customData"
      :desk="desk"
      :showRightIcon="notTrigger ? false : true"
      @delete="deleteCard"
    >
      <div
        ref="cardSize"
        style="
          align-items: center;
          align-content: center;
          width: 100%;
          height: 100%;
          text-align: center;
        "
        :class="notTrigger ? 'trigger' : ''"
      >
        <div
          v-if="!customData.url"
          style="
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            height: 100%;
          "
        >
          <Unusual
            :newIcon="'fluent-emoji-flat:globe-with-meridians'"
            :normalButtonTitle="'配置卡片'"
            class="mb-6"
            :disableEdit="options.disableEdit"
            @back="this.panelVisible = true"
          />

          <!-- <xt-button size="large" @click="this.panelVisible = true" v-if="!options.disableEdit">
            配置卡片
          </xt-button>

          <template v-else>
            <div class="flex flex-col items-center justify-center h-full">
              <xt-ify-icon
                icon="fluent-emoji:globe-with-meridians"
                class="pb-4"
                size="56"
              />
              <span class="xt-text xt-font font-16">暂无数据</span>
            </div>
          </template> -->
        </div>
        <template v-else>
          <iframe
            sandbox="allow-forms allow-modals allow-popups allow-same-origin allow-scripts"
            ref="myIframe"
            allowtransparency="true"
            :src="customData.url"
            style="width: 100%; height: 100%; border: none; border-radius: 8px"
          >
          </iframe>
        </template>
      </div>
    </xt-container>
  </xt-task>

  <a-drawer v-model:visible="panelVisible">
    <CardSettingExplain v-if="communityAuth(desk?.communityNo)" />

    <div class="line">
      卡片地址：
      <a-input
        v-model:value="url"
        style="width: 230px"
        placeholder="请输入远程地址，需带协议"
      ></a-input>
    </div>
    <div class="line">卡片尺寸：</div>
    <div class="line">
      <a-input-number
        :min="2"
        :max="20"
        :step="2"
        v-model:value="width"
      ></a-input-number>
      x
      <a-input-number
        :min="2"
        :max="20"
        :step="2"
        v-model:value="height"
      ></a-input-number>
    </div>
    <div class="line">
      隐藏卡片外框：
      <a-switch v-model:checked="customData.hideFrame"></a-switch>
    </div>
    <div class="mt-10">
      <a-button type="primary" @click="save" block>确定</a-button>
    </div>
  </a-drawer>
</template>

<script>
import Widget from "../../card/Widget.vue";
import { message } from "ant-design-vue";
import { taskStore } from "../../../apps/task/store";
import { mapWritableState, mapActions } from "pinia";
import { cardStore } from "../../../store/card";
// import RemoteShare from '../../card/remote/RemoteShare.vue';
import { communityNavStore } from "../../bottomPanel/store/communityNavStore";
import { communityAuth } from "../../../apps/communityDesk/hooks/deskCreateMethod";
import CardSettingExplain from "../../CardSettingExplain.vue";
import Unusual from "../Unusual.vue";

function loadScript(src, id, callback) {
  const s = document.createElement("script", id);
  s.type = "text/javascript";
  s.src = src;
  s.id = id;
  s.onload = s.onreadystatechange = function () {
    if (
      !this.readyState ||
      this.readyState === "loaded" ||
      this.readyState === "complete"
    ) {
      callback && callback();
      s.onload = s.onreadystatechange = null;
    }
  };
  document.body.appendChild(s);
}

export default {
  name: "Remote",
  components: { Widget, CardSettingExplain, Unusual },
  props: {
    customIndex: {
      type: Number,
      default: 0,
    },
    customData: {
      type: Object,
      default: () => {
        return {};
      },
    },
    desk: {
      type: Object,
    },
    notTrigger: {
      type: Boolean,
      default: false,
    },
    openWay: {
      type: String,
      default: "desk",
    },
  },
  emits: ["delete"],
  data() {
    return {
      url: "",
      width: 2,
      height: 2,

      panelVisible: false,
      showCommunity: false,
      id: Date.now().toString(),
      openShare: false,
      menuList: [
        {
          icon: "shop",
          title: "发现",
          fn: () => {
            this.$router.push({
              name: "remoteCommunity",
              params: {
                id: this.desk.id,
                cardId: this.customIndex,
                size: JSON.stringify(this.cardSize),
              },
            });
          },
        },
        {
          icon: "fenxiang",
          title: "分享",
          fn: () => {
            this.$router.push({
              name: "remoteCommunity",
              params: {
                id: this.desk.id,
                cardId: this.customIndex,
                direct: true,
                size: JSON.stringify(this.cardSize),
              },
            });
            // this.openShare = true
          },
        },
        {
          icon: "shezhi1",
          title: "设置",
          fn: () => {
            this.panelVisible = true;
            this.$refs.remote.visible = false;
          },
        },
      ],
    };
  },
  watch: {
    width(newWidth) {
      this.width = this.ensureEvenNumber(newWidth);
    },
    height(newHeight) {
      this.height = this.ensureEvenNumber(newHeight);
    },
  },
  methods: {
    ...mapActions(cardStore, ["updateCustomData"]),
    ...mapActions(communityNavStore, ["isCommunityDesktop"]),
    communityAuth,

    openRightMenu() {
      this.$refs.remote.menuVisible = true;
    },
    closeModal(val) {
      this.showCommunity = val;
    },
    ensureEvenNumber(value) {
      const parsedValue = parseInt(value);
      return Math.ceil(parsedValue / 2) * 2;
    },
    save() {
      this.$refs.remote.visible = false;
      this.panelVisible = false;
      this.customData.width = this.width / 2;
      this.customData.height = this.height / 2;
      this.customData.url = this.url;
      this.updateCustomData(
        this.customIndex,
        {
          customSize: `${this.width}x${this.height}`,
        },
        this.desk
      );
      message.success("修改成功");
    },
    closeShare(val) {
      this.openShare = val;
    },
    setUA() {
      //暂时没有办法实现此处展现为移动端的界面
    },
    deleteCard() {
      this.$emit("delete");
    },
    //   let contentWindow=this.$refs.myIframe.contentWindow
    //   console.log('当前的contentwindow-',contentWindow)
    //   const ua='Mozilla/5.0 (iPhone; CPU iPhone OS 13_2_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/13.0.3 Mobile/15E148 Safari/604.1 Edg/112.0.0.0'
    //   var setUA = function() {
    //     if (Object.defineProperty) {
    //       Object.defineProperty(contentWindow.navigator, 'userAgent', {
    //         configurable: true,
    //         get: function () {
    //           return ua;
    //         }
    //       });
    //     } else if (Object.prototype.__defineGetter__) {
    //       contentWindow.navigator.__defineGetter__('userAgent', function () {
    //         return ua;
    //       });
    //     } else {
    //       alert('browser not supported');
    //     }
    //   };
    //   setUA()
    //   contentWindow.location.reload()
    //   console.log(contentWindow.navigator.userAgent)
    // }
  },
  computed: {
    ...mapWritableState(taskStore, ["taskID", "step"]),

    m03031() {
      return this.customData.task && this.taskID == "M0303" && this.step == 1;
    },
    customSize() {
      return {
        width:
          (this.customData.width || 1) * 280 +
          (this.customData.width - 1) * 10 +
          "px",
        height:
          (this.customData.height || 2) * 205 +
          (this.customData.height - 1) * 10 +
          "px",
      };
    },
    cardSize() {
      const { width, height } = this.$refs.cardSize.getBoundingClientRect();
      return { width, height };
    },

    options() {
      return {
        bg: this.customData.hideFrame ? "transparent" : "",
        shadow: this.customData.hideFrame,
        customDel: this.openWay === "nav" ? true : false,
        disableEdit: this.isCommunityDesktop(this.desk) ? true : false,
      };
    },
    header() {
      return {
        disabled: this.customData.hideFrame,
      };
    },
  },
  mounted() {
    this.width = this.customData.width * 2 || 2;
    this.height = this.customData.height * 2 || 2;
    if (!this.customData.width) {
      this.customData.width = 1;
      this.customData.height = 1;
    }
    this.url = this.customData.url || "";
    if (this.customData.customSize == undefined) {
      this.customData.customSize = "2x2";
    }

    if (this.options.disableEdit) {
      this.menuList = [];
    } else {
      this.menuList = [
        {
          icon: "shop",
          title: "发现",
          fn: () => {
            this.$router.push({
              name: "remoteCommunity",
              params: {
                id: this.desk.id,
                cardId: this.customIndex,
                size: JSON.stringify(this.cardSize),
              },
            });
          },
        },
        {
          icon: "fenxiang",
          title: "分享",
          fn: () => {
            this.$router.push({
              name: "remoteCommunity",
              params: {
                id: this.desk.id,
                cardId: this.customIndex,
                direct: true,
                size: JSON.stringify(this.cardSize),
              },
            });
            // this.openShare = true
          },
        },
        {
          icon: "shezhi1",
          title: "设置",
          fn: () => {
            this.panelVisible = true;
            this.$refs.remote.visible = false;
          },
        },
      ];
    }

    // console.log('尝试载入')
    // const node = document.getElementById("my");
    // //我们将变量转换一下格式，就能传递给子组件
    // node.dataset.arr = JSON.stringify(["吃饭", "睡觉"]);
    // loadScript('https://a.apps.vip/cards/my-list.js',this.id,()=>{
    //   console.log('载入远程卡片')
    //
    //
    //   window.customElements.upgrade(document.getElementById('my'))
    // })
  },
  unmounted() {
    // document.getElementById(this.id).remove()
  },
};
</script>

<style scoped>
.trigger {
  pointer-events: none;
}
</style>
