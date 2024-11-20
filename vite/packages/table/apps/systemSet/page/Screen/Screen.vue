<template>
  <xt-option-box>
    <div class="flex justify-between flex-wrap">
      <div
        @click="click(screen)"
        @dblclick="dblclick(screen)"
        style="width: 134px; height: 80px"
        class="flex justify-center items-center rounded-xl xt-b mb-3 xt-modal"
        :class="{
          'xt-theme-b xt-theme-bg-2': screen.active,
        }"
        v-for="screen in screens"
      >
        {{ screen.title }}
      </div>
    </div>
    <div class="flex justify-between mb-3">
      <div></div>
      <div class="flex flex-wrap justify-center items-center">
        <xt-button
          @click="tagScreen"
          class="xt-modal mr-3"
          :radius="8"
          icon="fluent:eye-16-regular"
          w="32"
          h="32"
        ></xt-button>
        <xt-button
          @click="addScreen"
          type="theme"
          :radius="8"
          icon="fluent:add-16-regular"
          w="32"
          h="32"
        ></xt-button>
      </div>
    </div>
  </xt-option-box>
  <xt-option-box v-if="currentScreen.key !== 'main'" :key="currentKey">
    <xt-option-info
      title="运行"
      @change="toggleScreen"
      isSwitch
      v-model:switch="currentScreen.running"
    />
    <template v-if="currentScreen.settings" >
      <hr />
      <xt-option-info
        title="自动运行（跟随工作台启动）"
        isSwitch
        v-model:switch="currentScreen.settings.autoRun"
      />
      <hr />
      <xt-option-info title="名称" />
      <xt-option-input @cb="setTitle" @enter="setTitle" v-model:input="newTitle" />
      <hr />
      <div class="flex justify-between mb-3 gap-2">
        <xt-button
          @click="restorePos"
          h="40"
          class="xt-modal"
          iconSize="20"
          icon="fluent:arrow-clockwise-16-regular"
        >
          <div class="ml-1">还原位置</div></xt-button
        >
        <xt-button
          @click="restore"
          h="40"
          class="xt-modal"
          iconSize="20"
          icon="fluent:arrow-clockwise-16-regular"
        >
          <div class="ml-1">重置缩放</div></xt-button
        >
        <xt-button
          @click="chooseScreen"
          h="40"
          class="xt-modal"
          iconSize="20"
          icon="fluent:desktop-16-regular"
        >
          <div class="ml-1">选择屏幕</div></xt-button
        >
        <xt-button
          @click="remove"
          iconSize="20"
          h="40"
          icon="fluent:add-16-regular"
          class="xt-modal"
        >
          <div class="ml-1" style="color: #ff4d4f">删除</div></xt-button
        >
      </div>
    </template>
  </xt-option-box>

  <xt-modal v-model="chooseScreenVisible" v-if="chooseScreenVisible">
    <div style="width: 500px; height: 400px">
      <ChooseScreen
        :customCallback="true"
        @setScreen="setSubBounds"
      ></ChooseScreen>
      <a-checkbox
        style="
          position: absolute;
          left: 50%;
          bottom: 0;
          transform: translateX(-50%);
        "
        v-model:checked="setFullscreen"
        >自动最大化
      </a-checkbox>
    </div>
  </xt-modal>
</template>

<script>
import { mapWritableState, mapActions } from "pinia";
import { screenStore } from "../../../../store/screen";
import _ from "lodash-es";
import { EditOutlined } from "@ant-design/icons-vue";
import { mainIPC } from "../../../../js/common/screenIPC";
import { Modal } from "ant-design-vue";
import ChooseScreen from "../../../../page/ChooseScreen.vue";

export default {
  name: "ScreenManage",
  data() {
    return {
      currentScreen: {},
      editing: false,
      newTitle: "",
      setFullscreen: false,
      chooseScreenVisible: false,
      currentKey:"0"
    };
  },
  components: { ChooseScreen, EditOutlined },
  computed: {
    ...mapWritableState(screenStore, ["screens"]),
    setting(){
      return JSON.stringify(this.currentScreen)
    }
  },

  mounted() {
    this.screens.forEach((s) => {
      if (!s.settings) {
        s.settings = {};
      }
    });
    this.screens.map((s) => {
      if (s.active) {
        this.currentScreen = s;
        this.currentKey=s.key
      }
    });
    this.newTitle=this.currentScreen.title
  },
  watch:{
    'setting':{
      handler(newVal,oldVal){
        let newObj=JSON.parse(newVal)
        let oldObj=JSON.parse(oldVal)
        if(newObj.key===newObj.key&& oldObj.key!=='main'){
            if(newObj.running!==oldObj.running){
              this.toggleScreen(newObj.running)
            }
        }
      },
      deep:true
    },
  },
  methods: {
    ...mapActions(screenStore, [
      "startupScreen",
      "tagScreen",
      "stopScreen",
      "add",
    ]),
    addScreen() {
      let s = this.add();
      this.select(s.key);
    },
    toggleScreen(checked) {
      console.log('切换启动',checked)
      if(this.currentScreen.key==='main'){
        return
      }
      if (checked) {
        this.startupScreen(this.currentScreen.key);
      } else {
        this.stopScreen(this.currentScreen.key);
        this.currentScreen.running = false;
      }
    },
    toggleEdit() {
      if (this.currentScreen.key === "main") return;
      this.editing = !this.editing;
      if (this.editing) {
        // this.newTitle = "";
      }
    },
    setTitle() {
      this.currentScreen.title = this.newTitle;
      this.toggleEdit();
      mainIPC.sendToSub(this.currentScreen.key, "updateDetail", {
        detail: JSON.parse(JSON.stringify(this.currentScreen)),
      });
    },
    dblclick(screen) {
      if (screen.key !== "main") this.startupScreen(screen.key);

    },
    restorePos(){
      mainIPC.sendToSub(this.currentScreen.key,'restorePos')
    },
    restore() {
      mainIPC.sendToSub(this.currentScreen.key, "restore");
    },
    chooseScreen() {
      this.chooseScreenVisible = true;
    },
    setSubBounds(data) {
      let bounds = data.display.bounds;
      let width = bounds.width > 1200 ? 1200 : bounds.width;
      let height = bounds.height > 800 ? 800 : bounds.height;
      let setBounds = {
        x: +(bounds.x + bounds.width / 2 - width / 2).toFixed(0),
        y: +(bounds.y + bounds.height / 2 - height / 2).toFixed(0),
        width: width,
        height: height,
      };
      console.log(setBounds, "setbounds");
      mainIPC.sendToSub(this.currentScreen.key, "setScreen", {
        bounds: setBounds,
        fullscreen: this.setFullscreen,
      });
    },
    select(key) {
      this.screens.map((s) => {
        s.active = false;
        if (s.key === key) {
          this.currentScreen = s;
          s.active = true;
        }
      });
    },
    remove() {
      window.$ui.confirm(
        "确认删除分屏？",
        "此操作不可恢复，将丢失分屏全部的设置，请谨慎操作。",
        {
          ok: () => {
            this.currentKey=0
            this.screens.splice(
              this.screens.findIndex((s) => {
                return s.key === this.currentScreen.key;
              }),
              1
            );
            this.select("main");
          },
        }
      );
    },
    click(screen) {
      this.currentKey = screen.key
      this.currentScreen = screen;
      this.newTitle = screen.title;
      //
      this.screens.forEach((s) => {
        s.active = false;
      });
      screen.active = true;
    },
  },
};
</script>
<style lang="scss">
.btn {
  background: var(--mask-item-background-color);
  color: var(--font-color);
}

.screen.die {
  .ant-image-img {
    filter: grayscale(100%);
  }

  opacity: 0.7;
}

.screen {
  .ant-image-img {
    object-fit: cover;
    width: 120px !important;
    border-radius: 4px;
    height: 70px !important;
  }
}
</style>
<style scoped lang="scss">
.screen {
  opacity: 0.7;
  border: #343434 2px solid;
  margin-right: 1em;
  background: #1c1c1c;
  cursor: pointer;

  &:hover {
    border: rgba(255, 255, 255, 0.56) 2px solid;
    opacity: 0.9;
  }
}

.screen.active {
  border: white 2px solid;
  opacity: 1;
}

.screen-title {
  position: absolute;
  bottom: 0;
  right: 0;
  color: white;
  background: rgba(51, 51, 51, 0.6);
  padding-top: 3px;
  padding-bottom: 3px;
  font-size: 13px;
}
</style>
