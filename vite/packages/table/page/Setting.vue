<template>

    <vue-custom-scrollbar :settings="scrollbarSettings" style="position: relative; border-radius: 8px; width: 100%;height: 100%">
      <div class="setting-menu" style="display: flex; width: 100%;justify-content: center;justify-items: center">

        <!-- 快速搜索 快速开关功能 -->
        <div class="p-4 s-bg" style="
            border-radius: 0.5em;
            width: 20em;
            display: inline-block;
            color: var(--primary-text);
            background: var(--primary-bg);
          ">
          <h3 style="color: var(--primary-text)">快速开关功能</h3>
          <a-row :gutter="[20, 20]" style="font-size: 1.2em; text-align: center">
            <a-col :span="12" v-if="!this.isOffline">
              <div class="relative btn">
                弹幕
                <br />
                <a-switch @change="switchBarrage" v-model:checked="settings.enableBarrage"></a-switch>
              </div>
            </a-col>

            <a-col :span="12">
              <div style="cursor: help" @click="tipSaving" class="relative btn">
                节能模式<br />
                <a-switch @click.stop="() => { }" v-model:checked="saving"></a-switch>
              </div>
            </a-col>

            <a-col :span="12">
              <div class="relative btn">
                窗口控制<br />
                <a-switch @click.stop="() => { }" v-model:checked="showWindowController"></a-switch>
              </div>
            </a-col>
            <a-col :span="12">
              <div class="relative btn test">
                浅色模式<br />
                <!-- <a-switch @click.native.stop="styleSwitch($event)" v-model:checked="styles"></a-switch> -->
                <a-switch @click="themeSwitch()" v-model:checked="styles"></a-switch>
              </div>
            </a-col>

            <a-col  :span="12" v-if="!this.isOffline">
              <div class="relative btn">
                社群沟通<br />
                <a-switch v-model:checked="settings.enableChat"></a-switch>
              </div>
            </a-col>
            <a-col v-if="isMain()" :span="12">
              <div class="relative btn">
                消息免打扰<br />
                <a-switch v-model:checked="settings.noticeEnable"></a-switch>
              </div>
            </a-col>
            <a-col :span="12" v-if="!this.isOffline">
              <div style="cursor: help" @click="tipSimple" class="relative btn">
                极简模式<br />
                <a-switch @click.stop="() => { }" v-model:checked="simple"></a-switch>
              </div>
            </a-col>
            <!-- <a-col :span="12">
              <div  @click="tipOffline" class="relative btn">
                离线模式<br />
                <a-switch @click="this.changeOffline"  v-model:checked="isOffline"></a-switch>
              </div>
            </a-col> -->
            <a-col :span="12">
              <div  class="relative btn">
                辅助模式<br />
                <a-switch @click="this.toggleAided"  v-model:checked="aided"></a-switch>
              </div>
            </a-col>
            <a-col :span="12">
              <div  class="relative btn">
                摇一摇<br />
                <a-switch @click="this.enableShake"  v-model:checked="settings.shake.enable"></a-switch>
              </div>
            </a-col>
          </a-row>

          <div></div>
        </div>
        <div class="" style="display: inline-block; vertical-align: top">
          <div class="p-4 ml-4 s-bg menu-block">
            <h3 style="color: var(--primary-text)">常用</h3>
            <a-row style="font-size: 1.2em; text-align: center">
              <a-col v-if="isMain() && isWin()" :span="6">
                <div @click="setTouch" class="btn">
                  <!-- <Icon icon="Touch" style="font-size: 2em"></Icon> -->
                  <Iconify icon="fluent:hand-draw-16-regular" style="font-size: 2em" />
                  <div>设置触摸屏</div>
                </div>
              </a-col>
<!--              <a-col v-if="isMain() && isWin()" :span="6">-->
<!--                <div @click="setPen" class="btn">-->
<!--                  <Icon icon="icon-checkin" style="font-size: 2em"></Icon>-->
<!--                  <Iconify icon="fluent:pen-sparkle-16-regular" style="font-size: 2em" />  -->
<!--                  <div>设置笔</div>-->
<!--                </div>-->
<!--              </a-col>-->
              <a-col :span="6">
                <div @click="chooseScreen" class="btn">
                  <!-- <Icon icon="touping" style="font-size: 2em"></Icon> -->
                  <Iconify icon="majesticons:monitor-line" style="font-size: 2em" />
                  <div>选择屏幕</div>
                </div>
              </a-col>
              <a-col :span="6">
                <div v-if="isMain()"  @click="subscreen" class="btn">
                  <!-- <Icon icon="pingmufenge02" style="font-size: 2em"></Icon> -->
                  <Iconify icon="fluent:slide-settings-24-regular" style="font-size: 2em" />
                  <div > 分屏设置</div>
                </div>
              </a-col>
              <a-col v-if="simple && !this.isOffline"  :span="6">
                <MyAvatar :size="37"></MyAvatar>
              </a-col>
            </a-row>
            <div></div>
          </div>
          <div   class="p-4 mt-4 ml-4 s-bg menu-block">
            <h3 style="color: var(--primary-text)">其他</h3>
            <a-row style="font-size: 1.2em; text-align: center" :gutter="[10, 10]">
              <a-col v-if="isMain()" :span="6">
                <div @click="editNavigation" class="btn">
                  <!-- <Icon icon="Pushpin" style="font-size: 2em"></Icon> -->
                  <Iconify icon="fluent:tablet-16-regular" style="font-size: 2em" />
                  <div>导航栏编辑</div>
                </div>
              </a-col>
              <a-col :span="6">
                <xt-task  id="M0401" no="1" @cb="basic">
                  <div @click="basic" class="btn">
                    <!-- <Icon icon="shezhi" style="font-size: 2em"></Icon> -->
                    <Iconify icon="fluent:settings-16-regular" style="font-size: 2em" />
                    <div>通用设置</div>
                  </div>
                </xt-task>
              </a-col>
              <a-col v-if="isMain()" :span="6">
                <div @click="goApps()" class="btn">
                  <Iconify icon="fluent:grid-16-regular" style="font-size: 2em"></Iconify>
                  <div>应用管理</div>
                </div>
              </a-col>
              <!-- <Icon icon="jurassic_nav" style="font-size: 2em"></Icon> -->
             <!-- <a-col v-if="isMain()" :span="6">
               <div @click="wizard" class="btn">
                 <Iconify icon="fluent:star-settings-24-regular" style="font-size: 2em" />
                 <div>配置向导</div>
               </div>
             </a-col> -->

              <a-col :span="6">
                <div @click="papersSettings" class="btn">
                  <!-- <Icon icon="banner" style="font-size: 2em"></Icon> -->
                  <Iconify icon="fluent:image-multiple-16-regular" style="font-size: 2em" />
                  <div>壁纸</div>
                </div>
              </a-col>


              <a-col :span="6">
                <xt-task id="M0301" no="1" @cb="styleVisible = true">
                  <div @click="styleVisible = true" class="btn">
                    <!-- <Icon icon="yifu" style="font-size: 2em"></Icon> -->
                    <Iconify icon="fluent:color-24-regular" style="font-size: 2em" />
                    <div>主题颜色</div>
                  </div>
                </xt-task>
              </a-col>
              <a-col v-if="isMain() && !this.isOffline" :span="6">
                <div @click="invite" class="btn">
                  <!-- <Icon icon="tianjiachengyuan" style="font-size: 2em"></Icon> -->
                  <Iconify icon="fluent:people-add-16-regular" style="font-size: 2em" />
                  <div>邀请</div>
                </div>
              </a-col>
              <a-col v-if="isMain() && !this.isOffline" :span="6">
                <div @click="verify" class="btn">
                  <!-- <Icon icon="team" style="font-size: 2em"></Icon> -->
                  <Iconify icon="fluent:people-16-regular" style="font-size: 2em" />
                  <div>受邀</div>
                </div>
              </a-col>
              <a-col v-if="userInfo && userInfo.uid === 4 && isMain() && false" :span="6">
                <div @click="createCodes" class="btn">
                  <Icon icon="shezhi" style="font-size: 2em"></Icon>
                  <div>生成激活码</div>
                </div>
              </a-col>
              <a-col :span="6">
                <div @click="power" class="btn">
                  <!-- <Icon icon="tuichu" style="font-size: 2em"></Icon> -->
                  <Iconify icon="fluent:power-20-filled" style="font-size: 2em" />
                  <div>电源</div>
                </div>
              </a-col>
            </a-row>
            <div></div>
          </div>
        </div>
      </div>
    </vue-custom-scrollbar>
  <xt-msg :modelValue="simpleVisible" title="极简模式" text="使用极简模式后，将隐藏部分娱乐、社交类的功能，例如用户中心，小队，任务功能" :noVisible="false" @ok="this.simpleVisible=false"></xt-msg>
  <div  style="z-index: 90" v-if="editNavigationVisible">
    <EditNewNavigation @setQuick="editNavigationVisible = false,this.editToggle=false"></EditNewNavigation>
  </div>
  <a-drawer :width="500" v-if="styleVisible" v-model:visible="styleVisible" placement="right" style="z-index: 9999999">
    <xt-task id="M0301" no="2"></xt-task>
    <XtColor v-model:color="bgColor" title="主题" btnText="恢复默认主题颜色" @onBtnClick="clearBgColor"></XtColor>
    <XtColor v-model:color="textColor" title="文本" btnText="恢复默认文本颜色" @onBtnClick="clearTextColor"></XtColor>
    <XtColor v-model:color="wallpaperColor" title="背景" @onBtnClick="clearWallpaperColor" btnText="恢复默认壁纸颜色"></XtColor>
  </a-drawer>

  <a-modal v-model:visible="visibleChooseScreen" :title="null" width="100%" :footer="null" wrap-class-name="full-modal"
    @ok="() => {
        this.visibleChooseScreen = false;
      }
      ">
    <div style="zoom: 1.5; font-size: 16px; padding-top: 5em; text-align: center">
      <div style="width: 500px; overflow: visible; display: inline-block">
        <ChooseScreen></ChooseScreen>
      </div>
    </div>
  </a-modal>
</template>

<script>
import {
  delBgColor,
  delSecondaryBgColor,
  delTextColor,
  delWallpaperColor,
} from "./../components/card/hooks/styleSwitch/delStyle";
import {
  getBgColor,
  getTextColor,
  getWallpaperColor,
} from "./../components/card/hooks/styleSwitch/getStyle";
import {
  setBgColor,
  setSecondaryBgColor,
  setTextColor,
  setWallpaperColor,
} from "./../components/card/hooks/styleSwitch/setStyle";
import { setThemeSwitch } from "./../components/card/hooks/themeSwitch/";
import {useNavigationStore} from '../components/desk/navigationBar/navigationStore'
import ChooseScreen from "./ChooseScreen.vue";
import { appStore } from "../store";
import { mapWritableState } from "pinia";
import { message, Modal,notification } from "ant-design-vue";
import { mapActions } from "pinia";
import { codeStore } from "../store/code";
import SecondPanel from "../components/SecondPanel.vue";
import GradeSmallTip from "../components/GradeSmallTip.vue";
import { isMain,isWin } from "../js/common/screenUtils";
import MyAvatar from "../components/small/MyAvatar.vue";
// import EditNavigation from '../components/bottomPanel/EditNavigation.vue'
import EditNewNavigation from "../components/desk/navigationBar/EditNewNavigation.vue";
import { taskStore } from "../apps/task/store";
import { offlineStore } from "../js/common/offline";
import {Icon as Iconify} from '@iconify/vue'
export default {
  name: "Setting",
  components: { EditNewNavigation, MyAvatar, SecondPanel, ChooseScreen, GradeSmallTip,Iconify },
  data() {
    return {
      bgColor: "",
      textColor: "",
      wallpaperColor: "",
      styleVisible: false,
      visibleChooseScreen: false,
      scrollbarSettings: {
        useBothWheelAxes: true,
        swipeEasing: true,
        suppressScrollY: false,
        suppressScrollX: true,
        wheelPropagation: true,
      },
      editNavigationVisible: false,
      simpleVisible:false,
      listenEnter:(event)=>{
        if (event.code === "Enter") {
          let win32=$models.win32
          let lastPoints=win32.getMouseMovePoints()
          if(lastPoints?.length>0){
            this.settings.shake.pos={...lastPoints[0]}
            message.success('设置摇一摇定位成功。')
            window.shake={}
            window.shake.pos=this.settings.shake.pos
            window.shake.enable=true
            window.shake.sensitive=this.settings.shake.sensitive || 4
            window.shake.sound=this.settings.shake.sound
            this.shakeConfirm.close()
            window.removeEventListener('keydown',this.listenEnter)
            this.$router.push({
              name:'key'
            })
          }
          event.preventDefault();
          event.stopPropagation();
        }
      },
      shakeConfirm:null
    };
  },
  watch: {
    'settings.shake.enable':{
      handler(newVal){
        window.shake.enable=newVal
      }
    },
    bgColor(newV) {
      if (!newV) return;
      setBgColor(newV);
      setSecondaryBgColor(newV);
    },
    textColor(newV) {
      if (!newV) return;
      setTextColor(newV);
    },
    wallpaperColor(newV) {
      setWallpaperColor(newV);
    },
    // simple(){
    //   if(this.simple){
    //     this.bottomToggle[0]=false
    //     this.bottomToggle[1]=false
    //     this.bottomToggle[2]=false
    //   }else{
    //     this.bottomToggle[0]=true
    //     this.bottomToggle[1]=true
    //     this.bottomToggle[2]=true
    //   }
    // },
    // bottomToggle:{
    //   deep:true,
    //   handler(newV,oldV){
    //     if(this.bottomToggle[0] || this.bottomToggle[1] || this.bottomToggle[2]){
    //       this.simple=false
    //     }else if(!this.bottomToggle[0] && !this.bottomToggle[1] && !this.bottomToggle[2]){
    //       this.simple=true
    //     }
    //   }
    // }
  },
  mounted() {
    this.bgColor = getBgColor();
    this.textColor = getTextColor();
    this.wallpaperColor = getWallpaperColor();
  },
  computed: {
    ...mapWritableState(appStore, [
      "settings",
      "saving",
      "simple",
      "aided",
      "styles",
      "style",
      "showWindowController",
    ]),
    ...mapWritableState(appStore, ["userInfo"]),
    ...mapWritableState(taskStore, ["taskID", "step"]),
    ...mapWritableState(offlineStore, ["isOffline"]),
    ...mapWritableState(useNavigationStore,['bottomToggle','oldToggle','editToggle']),

  },

  methods: {
    ...mapActions(codeStore, ["verify", "create", "myCode"]),
    ...mapActions(offlineStore, ["changeOffline"]),
    ...mapActions(appStore, ['enterAided', 'leaveAided']),
    isMain: isMain, isWin,
    enableShake () {
      if (this.settings.shake.enable) {
        if (this.settings.shake.pos.x === 0 && this.settings.shake.pos.y === 0) {
          this.$xtConfirm("摇一摇功能向导", "您似乎从未使用过摇一摇穿梭的功能，是否根据提示设置摇一摇功能？", {
            ok: () => {
              setTimeout(()=>{
                this.$xtConfirm('功能说明',"您可以在工作台所在位置设置一个通过摇一摇快速到达的位置，后续通过摇一摇鼠标快速到达此位置，再次摇一摇即可回到首次摇动的位置。点击开始向导。",{
                  okText:'开始',
                  ok:()=>{
                    window.addEventListener('keydown',this.listenEnter)
                    setTimeout(()=>{
                     this.shakeConfirm= this.$xtConfirm('提示', "请将鼠标移动到您希望在摇一摇后自动定位到的位置，并按下回车键（Enter），期间请勿关闭此窗口", {
                        mask: true,
                        okText:'取消',
                        no:false,
                        noText:false,
                        ok:()=>{
                          window.removeEventListener('keydown',this.listenEnter)
                          message.info('已取消设置')
                          this.settings.shake.enable=false
                        }

                      })
                    },500)
                  },
                  noText:'取消',
                  no:()=>{
                    message.info('已取消设置')
                    this.settings.shake.enable=false
                  }
                })
              },500)

            },
            type: 'info',
            no:()=>{
              message.info('已取消设置')
              this.settings.shake.enable=false
            }
          });
        }
      }
    } ,
    goApps(){
      this.$router.push({
        name:'apps'
      })
    },
    editNavigation() {
      this.editNavigationVisible = true
      this.editToggle = true
    },
    clearBgColor() {
      delBgColor();
      delSecondaryBgColor();
    },
    clearTextColor() {
      delTextColor();
    },
    clearWallpaperColor() {
      delWallpaperColor();
    },
    themeSwitch() {
      setThemeSwitch(this.styles);
    },

    tipSaving() {
      Modal.info({
        content:
          "使用节能模式后，将关闭各种界面动画，同时尽可能清理掉滞留内存中的进程。可能导致打开界面效果折损或者应用切换缓慢。但可以显著降低内存、CPU、GPU占用。",
        centered: true,
      });
    },
    toggleAided(){
      if(this.aided){
        notification.info({
          message:'开启辅助模式后，工作台将无法被聚焦。此时无法输入任何内容，但是也不会因为点击工作台而切换焦点。可防止游戏窗口失焦。或者搭配快捷键使用。'
        })
        this.enterAided()
      }else{
        this.leaveAided()
        message.success('已为您关闭辅助模式')
      }

    },
    tipSimple() {
      // Modal.info({
      //   content:
      //     "使用极简模式后，将隐藏部分娱乐、社交类的功能，例如用户中心，小队，任务功能。",
      //   centered: true,
      // });
      this.simpleVisible=true
    },
    tipOffline() {
      Modal.info({
        content:
          "使用离线模式后，将隐藏部分娱乐、社交类的功能，例如游戏、天气等。",
        centered: true,
      });
    },
    power() {
      this.$router.push({ path: "/power" });
    },

    invite() {
      this.$router.push({
        name: "invite",
      });
    },
    verify() {
      this.$router.push({
        name: "invite",
        params: {
          tab: "verify",
        },
      });
    },

    async verifyCode() {
      if (!this.myCode) {
        Modal.confirm({
          content:
            "您还没有通过邀请码受邀，点击“接受邀请”，进入验证邀请码界面。",
          okText: "接受邀请",
          centered: true,
          onOk: () => {
            this.$router.push({
              name: "invite",
              params: {
                tab: "verify",
              },
            });
          },
        });
        return;
      }
      let rs = await this.verify(this.userInfo.uid);
      if (rs) {
        Modal.info({
          content: "验证邀请码成功。您可在小队个人信息界面查收勋章。",
          centered: true,
        });
      } else {
        Modal.error({
          content: "邀请码已失效。",
          centered: true,
        });
      }
    },
    async createCodes() {
      this.create().then((rs) => {
        message.success("生成激活码10个");
      });
    },
    async setTouch() {
      await tsbApi.window.setAlwaysOnTop(false);
      let cp = require("child_process");
      cp.exec("MultiDigiMon.exe -touch", async (err) => {
        await tsbApi.window.setAlwaysOnTop(true);
      });
    },
    async setPen() {
      await tsbApi.window.setAlwaysOnTop(false);
      let cp = require("child_process");
      cp.exec("MultiDigiMon.exe -pen", async (err) => {
        await tsbApi.window.setAlwaysOnTop(true);
      });
    },
    subscreen() {
      this.$router.push({ name: "subscreen" });
    },
    chooseScreen() {
      this.visibleChooseScreen = true;
    },
    wizard() {
      this.$router.push("/wizard");
    },
    barrage() {
      this.$router.push({
        name: "barrageSetting",
      });
    },
    papersSettings() {
      this.$router.push({
        name: "my",
      });
    },
    basic() {
      this.$router.push({
        name: "common",
      });
    },
    switchBarrage(value) {
      if (value) {
        window.$manager.show();
      } else {
        window.$manager.hidden();
      }
    },
  },
};
</script>

<style scoped lang="scss">
:deep(.zs-color-picker-btn) {
  // width: 455px;
  // height: 100px;
}
.menu-block{
  border-radius: 0.5em;
  width: 40em;
  color: var(--primary-text);
  background: var(--primary-bg);
}

</style>
