<template>
  <xt-mix-menu name="title" :menus="menus">
    <div id="windowController" style="overflow: hidden" class="flex h-10">
      <div @click="fixed" :class="{ active: alwaysTop }" style="border-bottom-left-radius: 8px" class=" xt-text btn-top-active  w-10 h-10 flex justify-center items-center">
        <Icon icon="Pushpin" style="font-size: 1.2em; zoom: 1.1"></Icon>
      </div>
      <!-- <div @click="fixed" :class="{active:alwaysTop}"
           class="flex pointer   btn-top btn-top-active  items-center no-drag" style="border-bottom-left-radius: 8px">
        <Icon icon="Pushpin" style="font-size: 1.2em;zoom:1.1"></Icon>
      </div> -->
      <!-- <div @click="minimize" class="flex  items-center btn-top btn-top-active pointer no-drag">
        <MinusOutlined style="font-size: 1.2em;"></MinusOutlined>
      </div> -->
      <div @click="minimize"  class="  btn-top-active  w-10 h-10 flex justify-center items-center">
        <MinusOutlined style="font-size: 1.2em;"></MinusOutlined>
      </div>
      <div @click="maximize"  class="  btn-top-active  w-10 h-10 flex justify-center items-center">
        <BorderOutlined style="font-size: 1.2em;"></BorderOutlined>
      </div>
      <div @click="close"  class=" xt-text  btn-top-active  w-10 h-10 flex justify-center items-center">
        <Icon icon="guanbi" style="font-size: 1.2em;"></Icon>
      </div>
      <!-- <div @click="maximize" class="flex pointer  btn-top-active  items-center no-drag py-2" >
        <BorderOutlined style="font-size: 1.2em;"></BorderOutlined>
      </div> -->
      <!-- <div @click="close" class="lex pointer   btn-top-active  items-center no-drag ">
        <Icon icon="guanbi" style="font-size: 1.2em;"></Icon>
      </div> -->
    </div>
  </xt-mix-menu>
</template>

<script>
import { getSign, isMain } from "../js/common/screenUtils";

import { MinusOutlined, BorderOutlined } from "@ant-design/icons-vue";
import RightMenu from "./card/RightMenu.vue";
import { mapWritableState } from "pinia";
import { appStore } from "../store";
import { Modal } from "ant-design-vue";

export default {
  name: "WindowController",
  components: {
    RightMenu,
    MinusOutlined,
    BorderOutlined,
  },
  data() {
    return {
      menus: [
        {
          newIcon: "fluent:eye-off-16-regular",
          title: "隐藏按钮",
          fn: () => {
            Modal.confirm({
              centered: true,
              content: "隐藏窗口控制按钮后，可在设置中重新开启。",
              onOk: () => {
                this.showWindowController = false;
              },
              okText: "确认",
            });
          },
        },
      ],
      alwaysTop: false,
    };
  },
  computed: {
    ...mapWritableState(appStore, ["showWindowController",'settings']),
  },
  async mounted() {
    if (!window.$usePlat('client')) return;

    this.alwaysTop = await tsbApi.window.isAlwaysOnTop();
  },
  methods: {
    // 关闭按钮
    async close () {
      if (isMain()) {
        let closeMethod = this.settings.closeMethod
        if (!closeMethod) {
          window.$ui.confirm('关闭行为','首次点击关闭，请选择合适的行为，是隐藏工作台（以备快速打开）还是彻底退出工作台？您稍候可在设置中修改。',{
            okText: '隐藏',
            noText: '退出',
            ok :()=> {
              this.settings.closeMethod= 'hide'
              tsbApi.window.hide()
            },
            no: ()=> {
              this.settings.closeMethod ='close'
              ipc.send("exitTable");
            }
          })
        }else{
          if(closeMethod === 'close'){
            ipc.send("exitTable");
          }else{
            tsbApi.window.hide()
          }
        }
      } else {
        ipc.send("closeScreen", { fullDomain: getSign() });
      }
    },
    // 窗口放大
    async maximize() {
      if (await tsbApi.window.isMaximized()) {
        tsbApi.window.unMaximize();
        setTimeout(() => {
          document.body.classList.add("window");
        }, 200);
      } else {
        setTimeout(() => {
          document.body.classList.remove("window");
        }, 200);

        tsbApi.window.maximize();
      }
    },
    // 关闭窗口放大
    minimize() {
      tsbApi.window.minimize();
    },
    // 固定
    fixed() {
      this.alwaysTop = !this.alwaysTop;
      tsbApi.window.setAlwaysOnTop(this.alwaysTop);
    },
  },
};
</script>

<style scoped lang="scss">
.pointer {
  // background: var(--primary-bg) !important;
  & svg {
    color: var(--primary-text) !important;
  }
}

.anticon {
  color: var(--primary-text) !important;
}
.btn-top {
 height: 40px;
}
.btn-top-active {
  // text-align: center;
  // width: 40px;
  // display: inline-block;
  // padding: 8px;
  // background: var(--active-bg) ;

  &:hover {
    background: var(--active-bg) !important;
  }
}
</style>
