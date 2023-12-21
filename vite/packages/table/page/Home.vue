<template>
  <div v-if="hide" style="position: fixed; top: 0; bottom: 0; right: 0; left: 0" @click="hideDesk"
    @contextmenu="hideDesk"></div>
  <!--  <div v-if="!hide" @contextmenu="showMenu" style="-->
  <!--      display: flex;-->
  <!--      align-items: flex-start;-->
  <!--      flex-direction: column;-->
  <!--      justify-content: left;-->
  <!--      flex-grow: 1;-->
  <!--      flex-shrink: 1;-->
  <!--      height: 100%;-->
  <!--      width: 100%;-->
  <!--      margin-left: 15px;-->
  <!--    ">-->
  <!--    <div class="mb-2 text-left" v-if="desks.length > 1">-->
  <!--      <HorizontalPanel @changed="this.key = Date.now()" :navList="desksList" v-model:selectType="currentDeskIndex">-->
  <!--      </HorizontalPanel>-->
  <!--    </div>-->
  <!--    <div class="p-3 m-auto" v-if="this.currentDesk.cards.length === 0">-->
  <!--      <div style="width: 100%;">-->
  <!--        <a-result class="m-auto rounded-lg s-bg"-->
  <!--          style="margin: auto;background: var(&#45;&#45;primary-bg);color: var(&#45;&#45;primary-text);" status="success" title="使用卡片桌面"-->
  <!--          sub-title="您可以长按空白处、右键添加卡片。">-->
  <!--          <template #extra>-->
  <!--            <a-button @click="newAddCard" class="mr-10 xt-active-bg" key="console" type="primary" style="color:var(&#45;&#45;active-text)">添加第一张卡片</a-button>-->
  <!--            <a-button key="buy" @click="learn"-->
  <!--              style="">学习</a-button>-->
  <!--          </template>-->

  <!--          <div class="desc">-->
  <!--            <p style="font-size: 16px">-->
  <!--              <strong>您可以通过桌面设置调节卡片到合适的大小</strong>-->
  <!--            </p>-->
  <!--            <p>-->
  <!--              <close-circle-outlined :style="{ color: 'red' }" />-->
  <!--              从社区获得分享代码（此功能暂未上线，请耐心等待）-->
  <!--              <a>从社区导入 &gt;</a>-->
  <!--            </p>-->
  <!--          </div>-->
  <!--        </a-result>-->
  <!--      </div>-->
  <!--    </div>-->
  <!--    <vue-custom-scrollbar key="scrollbar" id="scrollerBar" @contextmenu.stop="showMenu" :settings="scrollbarSettings"-->
  <!--      style="position: relative; border-radius: 8px; width: calc(100% - 20px); height: 100%;">-->
  <!--      <div style="-->
  <!--          white-space: nowrap;-->
  <!--          height: 100%;-->
  <!--          width: 100%;-->
  <!--          display: flex;-->
  <!--          align-items: center;-->
  <!--          align-content: center;-->
  <!--        " :style="{ 'padding-top': this.cardSettings.marginTop + 'px' }"-->
  <!--        id="cardContent">-->
  <!--        &lt;!&ndash;      <div style="width: 43em;display: inline-block;" v-for="(grid,index) in customComponents">&ndash;&gt;-->
  <!--        &lt;!&ndash;        <div>&ndash;&gt;-->
  <!--        &lt;!&ndash;          <vuuri group-id="grid.id" :drag-enabled="true" v-model="grid.children" class="grid" ref="grid">&ndash;&gt;-->
  <!--        &lt;!&ndash;          <template #item="{ item }">&ndash;&gt;-->
  <!--        &lt;!&ndash;              <div style="display: inline-block" >&ndash;&gt;-->
  <!--        &lt;!&ndash;                <Widget @contextmenu.stop="showMenu(item.id,{item,grid},'item')"   :item="item"&ndash;&gt;-->
  <!--        &lt;!&ndash;                    :uniqueKey="String(item.id)"&ndash;&gt;-->
  <!--        &lt;!&ndash;                    :showDelete="true"&ndash;&gt;-->
  <!--        &lt;!&ndash;                    :resizable="true"&ndash;&gt;-->
  <!--        &lt;!&ndash;            >&ndash;&gt;-->
  <!--        &lt;!&ndash;            <component :is="item.name" :customIndex="item.id" ></component></Widget></div>&ndash;&gt;-->
  <!--        &lt;!&ndash;          </template>&ndash;&gt;-->
  <!--        &lt;!&ndash;          </vuuri></div></div>&ndash;&gt;-->
  <!--        <vuuri v-if="currentDesk.cards" :get-item-margin="() => {-->
  <!--            return cardSettings.cardMargin + 'px';-->
  <!--          }-->
  <!--          " group-id="grid.id" v-model="currentDesk.cards" :key="key" :style="{-->

  <!--      height: '100%',-->
  <!--      width: '100%',-->
  <!--    }" class="grid home-widgets" ref="grid" :options="muuriOptions" :drag-enabled="true">-->
  <!--          <template #item="{ item }">-->
  <!--            <div  :style="{  zoom: (this.cardSettings.cardZoom / 100).toFixed(2),}">-->
  <!--              <component :desk="currentDesk" :is="item.name" :customIndex="item.id"  :editing="editing" :customData="item.customData" @customEvent="customEvent"></component>-->
  <!--            </div>-->
  <!--          </template>-->
  <!--        </vuuri>-->
  <!--      </div>-->
  <!--    </vue-custom-scrollbar>-->
  <!--  </div>-->
  <div style="height: 100%">
   <desk-group @changeDesk="changeDesk" ref="deskGroupRef" :settings="settings" :desk-list="desks"
      v-model:currentDeskId="this.currentDeskId">
      <template #settingsAll>
        1   
        <div class="p-4 mb-4 text-base xt-bg-2 rounded-xl">
          <div class="flex justify-between mb-4">
            <div>桌面背景</div>
          </div>
          <div class="my-4 text-sm xt-text-2">
            选择喜欢的图片作为工作台桌面背景。
          </div>
          <div class="flex my-4 text-sm xt-text-2" v-if="!appSettings.transparent">
            <xt-task id="M0103" no="3" to=""> </xt-task>
            <xt-task id="M0103" no="4" to="" @cb="goPaper">
              <xt-button size="mini" :w="80" :h="40" type="theme" class="mr-3" @click="goPaper">背景设置</xt-button>
            </xt-task>
            <xt-button size="mini" class="xt-modal" :w="80" :h="40" @click="clearWallpaper">还原背景</xt-button>
          </div>
          <hr class="my-4" />

          <template v-if="!appSettings.transparent">
            <div class="flex justify-between mb-4">
              <div>背景模糊度</div>
            </div>
            <div class="my-4 text-sm xt-text-2">开启后增加背景模糊度</div>
            <div class="my-4 text-sm xt-text-2">
              <a-slider v-model:value="backgroundSettings.backGroundImgBlur" :max="100" :step="1" />
            </div>
            <hr class="my-4" />
          </template>
          <div class="flex justify-between mb-4">
            <div>透明背景</div>
            <a-switch v-model:checked="appSettings.transparent" />
          </div>
          <div class="mt-4 text-sm xt-text-2">开启后透明背景</div>
        </div>
        <div class="p-4 mb-1 text-base xt-bg-2 rounded-xl">
          <div class="p-4 xt-modal rounded-xl xt-text-2">
            此类功能性能消耗较高，请酌情开启
          </div>
          <div class="flex justify-between my-4">
            <div>边框RGB灯</div>
            <a-switch v-model:checked="appSettings.houserun" />
          </div>
          <div class="my-4 text-sm xt-text-2">
            在工作台窗口四周显示RGB效果。
          </div>
          <hr class="my-4" />
          <div class="flex justify-between mb-4">
            <div>飘落效果</div>
            <a-switch v-model:checked="appSettings.down.enable" />
          </div>
          <div class="my-4 text-sm xt-text-2">开启后页面会有炫酷的飘落效果</div>
          <hr class="my-4" style="height: 0.5px" />
          <template v-if="appSettings.down.enable">
            <div class="flex justify-between my-4">
              <div>飘落物</div>
            </div>
            <div class="my-4 text-sm xt-text-2">
              <xt-tab class="h-10" v-model="appSettings.down.type" :list="fallingList"></xt-tab>
            </div>
            <hr class="my-4" />
            <div class="flex justify-between my-4">
              <div>飘落物数量</div>
            </div>
            <div class="mt-4 text-sm xt-text-2">
              <xt-input v-model="appSettings.down.count" class="xt-modal xt-b" style="height: 40px"></xt-input>
            </div>
          </template>
        </div>
      </template>
      <!--      <template #empty>-->
      <!--        <div style="width: 100%;height: 100%;" :class="notTrigger ? 'trigger' : '' " class="m-auto">-->
      <!--          <div style="width: 100%;height: 100%">-->
      <!--            <a-result class="m-auto rounded-lg s-bg xt-bg" style="margin: auto;width: 580px" status="success" title="使用卡片桌面"-->
      <!--                      sub-title="您可以长按空白处、右键添加卡片。">-->
      <!--              <template #extra>-->
      <!--                <a-button style="color: var(&#45;&#45;active-text);" @click="newAddCard" class="mr-10 xt-active-bg" key="console"-->
      <!--                          type="primary"><icon class="mr-1" icon="tianjia2"></icon>&nbsp;添加第一张卡片-->
      <!--                </a-button>-->
      <!--                <a-button class="xt-bg-2"  key="buy" @click="learn"><icon class="mr-1" icon="bofang"></icon>&nbsp;学习</a-button>-->
      <!--                <a-button class="xt-bg-2" key="buy" @click="delDesk"><icon class="mr-1" icon="shanchu"></icon>&nbsp;删除桌面</a-button>-->
      <!--              </template>-->

      <!--              <div class="desc xt-text">-->
      <!--                <p style="font-size: 16px">-->
      <!--                  <strong>您可以通过桌面设置调节卡片到合适的大小</strong>-->
      <!--                </p>-->
      <!--                <p>-->
      <!--                  从社区获得分享代码（此功能暂未上线，请耐心等待）-->
      <!--                  <a>从社区导入 &gt;</a>-->
      <!--                </p>-->
      <!--              </div>-->
      <!--            </a-result>-->
      <!--          </div>-->
      <!--        </div>-->
      <!--      </template>-->
    </desk-group>
  </div>

  <transition name="fade">
    <div class="" style="
        position: fixed;
        top: 0;
        right: 0;
        left: 0;
        bottom: 0;
        z-index: 999;
      " v-if="iconVisible">
      <AddIcon @setCustoms="setCustoms" @close="iconHide" :desk="currentDesk"></AddIcon>
    </div>
  </transition>
  <!-- <div class="fixed inset-0 p-12 home-blur" style="z-index: 999" >
    <GradeNotice></GradeNotice>
  </div> -->
  <!-- 引导暂时隐藏 等后续开发 -->
  <div class="fixed inset-0 flex items-center justify-center" style="z-index: 999" v-if="false">
    <GuidePage></GuidePage>
  </div>

  <!-- 检测到用户头像为默认头像时触发用户中心个人信息修改弹窗 -->
  <div class="fixed inset-0 home-guide" style="z-index: 999" v-if="infoVisible === true">
    <UpdateMyInfo :updateVisible="true"></UpdateMyInfo>
  </div>
</template>

<script>
import { onMounted } from "vue";
import Weather from "../components/widgets/Weather.vue";
import Timer from "../components/widgets/Timer.vue";
import Music from "../components/widgets/Music.vue";
import Stock from "../components/widgets/Stock.vue";
import AddMore from "../components/widgets/AddMore.vue";
import Dou from "../components/widgets/Dou.vue";
import Fish from "../components/widgets/Fish.vue";
import CustomTimer from "../components/widgets/CustomTimer.vue";
import SmallCountdownDay from "../components/widgets/SmallCountdownDay.vue";
import Clock from "../components/widgets/Clock.vue";
import CountdownDay from "../components/widgets/CountdownDay.vue";
import { mapActions, mapWritableState } from "pinia";
import { cardStore } from "../store/card";
import vuuri from "../components/vuuriHome/Vuuri.vue";
import Widget from "../components/muuri/Widget.vue";
import { message, Modal } from "ant-design-vue";
import CPULineChart from "../apps/inspector/widget/CPULineChart.vue";
import CPUFourCard from "../apps/inspector/widget/CPUFourCard.vue";
import InternalList from "../apps/inspector/widget/InternalList.vue";
import SmallCPUCard from "../apps/inspector/widget/SmallCPUCard.vue";
import SmallGPUCard from "../apps/inspector/widget/SmallGPUCard.vue";
import GamesDiscount from "../components/widgets/games/GamesDiscount.vue";
import GuidePage from "./app/grade/GuidePage.vue";
import DiscountPercentage from "../components/widgets/games/DiscountPercentage.vue";
import MiddleWallpaper from "../components/widgets/MiddleWallpaper.vue";
import SmallWallpaper from "../components/widgets/SmallWallpaper.vue";
import MyGameSmall from "../components/widgets/games/MyGameSmall.vue";
import Capture from "../components/widgets/games/Capture.vue";
import AddCard from "./app/card/AddCard.vue";
import GradeNotice from "./app/grade/GradeNotice.vue";
import Voice from "../components/widgets/audio/Voice.vue";
import Audio from "../components/widgets/audio/Audio.vue";
import CaptureNewCard from "../components/widgets/games/CaptureNewCard.vue";
import { runExec } from "../js/common/exec";
import { appStore } from "../store";
import Remote from "../components/widgets/custom/Remote.vue";
import { weatherStore } from "../store/weather";
import GameEpic from "../components/widgets/games/GameEpic.vue";
import CustomAssembly from "../components/widgets/custom/CustomAssembly.vue";
import SignIn from "../components/widgets/SignIn.vue";
import SingleFilm from "../components/widgets/film/SingleFilm.vue";
import ManyFilm from "../components/widgets/film/ManyFilm.vue";
import SteamFriends from "../components/widgets/games/SteamFriends.vue";
import Muuri from "muuri";
import HorizontalPanel from "../components/HorizontalPanel.vue";
import Clocks from "../components/widgets/clock/index.vue";
import Notes from "../components/widgets/note/index.vue";
import myIcons from "../components/widgets/myIcons/index.vue";
import NewAddCard from "./app/card/NewAddCard.vue";
import ShortcutKeyDetail from "../apps/shortcutKey/shortcutKey/ShortcutKeyDetail.vue";
import NotShortcutKey from "../apps/shortcutKey/page/NotShortcutKey.vue";
import ShortcutKeyList from "../apps/shortcutKey/shortcutKey/ShortcutKeyList.vue";
import GameStrategy from "../components/widgets/games/GameStrategy.vue";
import AddIcon from "./app/addIcon/index.vue";
import KeyBoard from "../apps/shortcutKey/components/KeyBoard.vue";
import SmallRank from "../components/widgets/SmallRank.vue";
import AggregateSearch from "../components/widgets/aggregate/AggregateSearch.vue";
import UpdateMyInfo from "../components/comp/UpdateMyInfo.vue";
import ShareDesk from "../components/desk/ShareDesk.vue";
import DeskMarket from "./app/card/DeskMarket.vue";
import DeskPreview from "../components/desk/DeskPreview.vue";
import ExportDesk from "../components/desk/ExportDesk.vue";
import DeskGroup from "../components/desk/DeskGroup.vue";
import Template from "../../user/pages/Template.vue";
import Icon from "../components/Icon.vue";
import Todo from "../components/widgets/todo/Todo.vue";
import EatToday from "../components/widgets/eat/EatToday.vue";
import HotSearch from "../components/widgets/HotSearch.vue";
import RadioTab from "../components/RadioTab.vue";
// import News from "../components/widgets/news/NewsCard.vue";
import {
  setTransparent,
  detTransparent,
} from "../components/card/hooks/themeSwitch";
import { taskStore } from "../apps/task/store";
import navigationData from "../js/data/tableData";
import { navStore } from "../store/nav";
import { homeStore } from "../store/home";
import _ from "lodash-es";
// 桌面默认数据
import { defaultFreeLayoutStore } from './defaultFreeLayout'
import { useFreeLayoutStore } from "../components/desk/freeLayout/store";
const { steamUser, steamSession, path, https, steamFs } = $models;
if (steamUser && steamSession) {
  const { LoginSession, EAuthTokenPlatformType } = steamSession;
  var session = new LoginSession(EAuthTokenPlatformType.SteamClient);
  var client = new steamUser({
    enablePicsCache: true,
  });
}

let List = [];

export default {
  name: "Home",
  data() {
    return {
      visibleAdd: false,
      iconVisible: false,
      newDesk: {
        name: "",
        template: "daily",
      },
      fallingList: [
        {
          value: "rain",
          name: "雨",
        },
        {
          value: "snow",
          name: "雪",
        },
        {
          value: "leaf",
          name: "叶",
        },
      ],
      hide: false,
      menuVisible: false,
      settingVisible: false,
      addDeskVisible: false,
      editing: false,
      key: Date.now(),
      scrollbarSettings: {
        useBothWheelAxes: true,
        swipeEasing: true,
        suppressScrollY: true,
        suppressScrollX: false,
        wheelPropagation: true,
        currentItemId: -1,
      },
      scrollbar: Date.now(),
      inspectorTimer: null,
      reserveTimer: null,
      custom: false,
      muuriOptions: {
        layout: {
          fillGaps: true,
          horizontal: false,
          alignRight: false,
          alignBottom: false,
          rounding: true,
        },
        targets: [
          {
            element: "#scrollerBar>div",
          },
        ],
        handle: null,
        threshold: 50,
        safeZone: 0.2,
        speed: Muuri.AutoScroller.smoothSpeed(1000, 2000, 2500),
        sortDuringScroll: true,
        smoothStop: false,
        onStart: null,
        onStop: null,
        dragSortPredicate: {
          threshold: 30,
        },
        dragSortHeuristics: {
          sortInterval: 10,
          minDragDistance: 5,
          minBounceBackAngle: Math.PI / 2,
        },
      },
      openDesk: false,
      deskType: [
        { title: "日常桌面", name: "daily" },
        { title: "游戏桌面", name: "game" },
        { title: "办公桌面", name: "work" },
        { title: "空白桌面", name: "empty" },
      ],
      selectDesk: { title: "日常桌面", name: "daily" },
      deskTitle: "",
      hotDesk: [],
      scheme: {},
      showModal: false,
      deskCode: "",
      shareCode: false,
      panelIndex: 0,
      cardSettings: {},
      cardDesk: "all",
      cardDeskList: [
        { name: "通用桌面设置", value: "all" },
        { name: "当前桌面设置", value: "current" },
      ],
      cardSwitch: false,
      exportModal: false,
      // 在页面创建的第一次触发，后面就不触发了--替换图标
      hasTriggered: 1,
      replaceFlag: true,
    };
  },
  components: {
    // News,
    Icon,
    Template,
    DeskGroup,
    HorizontalPanel,
    Modal,
    Dou,
    AddMore,
    Stock,
    Music,
    Weather,
    Timer,
    CustomTimer,
    SmallCountdownDay,
    Clock,
    Remote,
    CountdownDay,
    Fish,
    vuuri,
    Widget,
    CPULineChart,
    CPUFourCard,
    InternalList,
    SmallCPUCard,
    SmallGPUCard,
    AddCard,
    GradeNotice,
    GamesDiscount,
    DiscountPercentage,
    MiddleWallpaper,
    SmallWallpaper,
    GameEpic,
    MyGameSmall,
    Capture,
    CustomAssembly,
    SignIn,
    SingleFilm,
    ManyFilm,
    Voice,
    Audio,
    SteamFriends,
    CaptureNewCard,
    Clocks,
    Notes,
    myIcons,
    NewAddCard,
    GuidePage,
    ShortcutKeyDetail,
    NotShortcutKey,
    ShortcutKeyList,
    GameStrategy,
    AddIcon,
    KeyBoard,
    SmallRank,
    AggregateSearch,
    ShareDesk,
    DeskMarket,
    DeskPreview,
    UpdateMyInfo,
    ExportDesk,
    Todo,
    EatToday,
    HotSearch,
    RadioTab,
  },
  computed: {
    ...mapWritableState(navStore, [
      "sideNavigationList",
      "footNavigationList",
      "rightNavigationList",
    ]),
    ...mapWritableState(cardStore, [
      "customComponents",
      "clockEvent",
      "settings",
      "desks",
      "moved",
      "lastHeight",
    ]),
    ...mapWritableState(appStore, [
      "agreeTest",
      "backgroundSettings",
      "backgroundImage",
      "styles",
      "style",
      "fullScreen",
      "infoVisible",
      "searchFullScreen",
    ]),

    ...mapWritableState(appStore, {
      appSettings: "settings",
      deskInit:'deskInit',

    }),
    ...mapWritableState(taskStore, ["taskID", "step"]),
    ...mapWritableState(homeStore, ["currentDeskId", "currentDeskIndex", 'currentInit']),
    ...mapWritableState(useFreeLayoutStore, ['freeLayoutData', 'freeLayoutState']),
    ...mapWritableState(defaultFreeLayoutStore, ['deskDefault', 'freeLayoutDataTmp', 'freeLayoutStateTmp']),

    desksList() {
      return this.desks.map((desk) => {
        return {
          name: desk.nanoid,
          title: desk.name,
        };
      });
    },
    currentDesk() {
      let find = this.desks.find((desk) => {
        return desk.id === this.currentDeskId;
      });
      if (find) {
        find.cards.forEach((e) => {
          if (!e.data) {
            e.data = {};
          }
          if (!e.customData) {
            e.customData = {};
          }
        });
        return find;
      } else {
        this.currentDeskId=this.desks[0].id
        return this.desks[0];
      }
    },
  },
  beforeUpdate() {
    if (this.hasTriggered <= 10) {
      console.log("chufa");
      this.replaceIcon();
      this.hasTriggered++;
    }
  },
  async mounted() {
    this.replaceIcon();
    // setTimeout(() => {
    //   this.replaceIcon()
    // },500)
    let n = 0;
    if (navigator.connection.downlink < 1) {
      let timer = setInterval(() => {
        if (n > 3) {
          clearInterval(timer);
          return;
        }
        this.replaceIcon();
        n++;
      }, 3000);
    } else {
      let timer = setInterval(() => {
        if (n > 2) {
          clearInterval(timer);
          return;
        }
        this.replaceIcon();
        n++;
      }, 1000);
    }
    // 判断是否是第一次加载
    if(this.deskInit){
      // 新用户第一次进入加载一个默认桌面
      this.addFreeLayoutDesk()
      this.deskInit = false
    }

    // let counte=0
    // const counter=setInterval(()=>{
    //     if(this.replaceFlag==false){
    //       clearInterval(counter)
    //     }
    //     this.replaceIcon()
    //     console.log(this.replaceFlag,this.footNavigationList,'footNavigationList')
    //     counte++
    //     if(counte>=3){
    //       clearInterval(counter)
    //     }
    // },1200)
    // this.replaceIcon()
    // this.desks.splice(3,1)
    // await session.startWithCredentials({
    //    accountName: 'snpsly123123',
    //    password:'xyx86170060',
    //   // steamGuardCode:'5BCMH'
    //  }).then((res) =>{
    //    console.log(res)
    //  }).catch(err=>{
    //    console.log(err)
    //  })
    //  session.on('authenticated', async () => {
    //    console.log(`Logged into Steam as ${session.accountName}`);
    //    let webCookies = await session.getWebCookies();
    //    if (webCookies) {
    //      const steamLoginData = {
    //        accessToken: session.accessToken,
    //        refreshToken: session.refreshToken,
    //        webCookies: webCookies
    //      }
    //      console.log(steamLoginData)
    //    }
    //  });
    //  client.logOn({"refreshToken": 'eyAidHlwIjogIkpXVCIsICJhbGciOiAiRWREU0EiIH0.eyAiaXNzIjogInN0ZWFtIiwgInN1YiI6ICI3NjU2MTE5OTI0MzA3NjczMSIsICJhdWQiOiBbICJjbGllbnQiLCAid2ViIiwgInJlbmV3IiwgImRlcml2ZSIgXSwgImV4cCI6IDE3MDIyNTcxNTgsICJuYmYiOiAxNjc1Mjk5NTkwLCAiaWF0IjogMTY4MzkzOTU5MCwgImp0aSI6ICIxNEJCXzIyODVDQzAzXzVDNTA1IiwgIm9hdCI6IDE2ODM5Mzk1OTAsICJwZXIiOiAxLCAiaXBfc3ViamVjdCI6ICIxMTEuMy4xMS4xNzMiLCAiaXBfY29uZmlybWVyIjogIjE4NS4yMzAuMjQ1LjIxMCIgfQ.C3cpZLysxiWU6UuyfyHGYKidNiWXCkyBbr6I0LLY5qIjodrwoHPE1pWsv0NIIvU10--EUme20XCf9aQR43R9CQ'})
    //  client.on('loggedOn', async function () {
    //    console.log("Logged into Steam as " + client.steamID.getSteamID64());
    //    //  console.log(client)
    //    // const appid = 570;
    //    // const coverUrl = `https://steamcdn-a.akamaihd.net/steam/apps/${appid}/header.jpg`;
    //    // const cacheDir = path.join('C:\\Users\\2\\Desktop\\abc', 'pics_cache');
    //    // if (!steamFs.existsSync(cacheDir)) {
    //    //   steamFs.mkdirSync(cacheDir);
    //    //   console.log(steamFs.existsSync(cacheDir))
    //    // }
    //    //
    //    // const cacheFile = path.join(cacheDir, `${appid}_header.jpg`);
    //
    //    // const file = steamFs.createWriteStream(cacheFile);
    //    // const request = https.get(coverUrl, (response) => {
    //    //   response.pipe(file);
    //    // });
    //    // const steamid = client.steamID.getSteamID64();
    //    // const avatarUrl = `https://steamcdn-a.akamaihd.net/steamcommunity/public/images/avatars/5a/5a8d6e7a7d9d7d9d7d9d7d9d7d9d7d9d7d9d7d9.jpg`;
    //    // const avatarCacheDir = path.join('C:\\Users\\2\\Desktop\\abc', 'pics_cache', 'avatars');
    //    //
    //    // if (!steamFs.existsSync(avatarCacheDir)) {
    //    //   steamFs.mkdirSync(avatarCacheDir);
    //    // }
    //    //
    //    // const avatarCacheFile = path.join(avatarCacheDir, `${steamid}.jpg`);
    //    //
    //    // const avatarFile = steamFs.createWriteStream(avatarCacheFile);
    //    // const avatarRequest = https.get(avatarUrl, (response) => {
    //    //   response.pipe(avatarFile);
    //    // });
    //    client.setPersona(steamUser.EPersonaState.Online);
    //
    //    client.on('appOwnershipCached', () => {
    //      console.log('Game ownership cached');
    //
    //      client.getProductInfo(client.getOwnedApps({excludeFree: false}),[],(err,data)=>{
    //        console.log(data)
    //     if(err) console.log(err)
    //        Object.keys(data).forEach(i=>{
    //           if(data[i].appinfo.common){
    //             if(data[i].appinfo.common.type === 'Game'){
    //               console.log(data[i],data[i].appinfo.common.oslist)
    //               // console.log(data[i].appinfo.common.name_localized||data[i].appinfo.common.name
    //               // )
    //             }
    //           }
    //        })
    //      })
    //      // client.getUserOwnedApps(client.steamID.getSteamID64(),[],(err,data)=>{
    //      //  if(err) console.log(err)
    //      //   console.log(data)
    //      // })
    //    });
    //
    //    client.on('error', async function (err) {
    //      console.log(err)
    //    })
    //
    //  })
    // await session.startWithCredentials({
    //       accountName: 'snpsly123',
    //       password:'xyx86170060',
    //       steamGuardCode:'5BCMH'
    //     }).then((res) =>{
    //   console.log(res)
    // }).catch(err=>{
    //   console.log(err)
    // })
    //    session.on('authenticated', async () => {
    //      console.log(`Logged into Steam as ${session.accountName}`);
    //      let webCookies = await session.getWebCookies();
    //
    //      if (webCookies) {
    //       const steamLoginData = {
    //          accessToken: session.accessToken,
    //          refreshToken: session.refreshToken,
    //          webCookies: webCookies
    //        }
    //        console.log(steamLoginData)
    //      }
    //    });
    if (!this.moved) {
      //最早的修复
      this.desks[0].cards = this.customComponents;
      this.moved = true;
    }
    if (this.currentDeskId === "") {
      this.currentDeskId = this.desks[0].id;
    }
    if (this.desks.length > 0 && !this.currentDeskIndex.name) {
      this.currentDeskIndex = {
        // name: this.desks[0].nanoid,
        name: this.desks[0].id,
        title: this.desks[0].name,
      };
    }
    this.fixData();
    // window.onresize = () => {
    //   this.scrollbar = Date.now();

    //   this.$nextTick(() => {
    //     let cardsHeight = document.getElementById("cardContent")?.offsetHeight;
    //     let deskHeight = document.documentElement.clientHeight // 高
    //     let deskWidth = document.documentElement.clientWidth // 宽
    //     let size = {
    //       deskWidth,
    //       deskHeight,
    //       cardsHeight,
    //     }
    //     console.log(cardsHeight)
    //     this.setDeskSize(size)
    //   })
    // };
    // this.setInitCard()

    // if(this.currentDesk?.settings === 'current'){
    //   this.cardSettings = this.currentDesk.aloneSettings
    //   this.cardDesk = 'current'
    // }else{
    //   this.cardSettings = this.settings
    //   this.cardDesk = 'all'
    // }
    //this.customComponents=[{name:'Music',id:2},{name:'Weather',id:3},{name:'Timer',id:4}]//重置
    if (this.customComponents.length > 0) {
      if (typeof this.customComponents[0] === "string") {
        this.customComponents = [];
      }
    }
    //  this.hotDesk.push(this.deskList[0].children[0])
  },
  created() {
    if (this.currentDesk.cards.length) {
      this.currentDesk.cards.forEach((e) => {
        if (!e.data) {
          e.data = {};
        }
        if (!e.customData) {
          e.customData = {};
        }
        if (Object.keys(e.data).length > 0) {
          e.customData = { ...e.customData, ...e.data };
          e.data1 = e.data; //转移备份
          e.data = {}; //修理掉
        }
      });
    }

    this.navigationList = [];
    //this.setAgreeTest(false)
  },
  unmounted() {
    if (this.reserveTimer) {
      clearInterval(this.reserveTimer);
    }
  },
  methods: {
    /**
     * 更新布局，会自动判断布局存在与否
     */
    updateLayout() {
      if (this.$refs.grid) {
        this.$refs.grid.update();
      }
    },
    learn() {
      browser.openInTable(
        "https://www.bilibili.com/video/BV1Th4y1o7SZ/?vd_source=2b7e342ffb60104849f5db6262bb1e0b"
      );
    },
    iconHide() {
      this.iconVisible = false;
    },
    hideAddCard() {
      this.visibleAdd = false;
    },
    // 添加图标
    newAddIcon() {
      this.iconVisible = true;
      this.menuVisible = false;
    },
    replaceIcon() {
      navigationData.systemAppList.forEach((item) => {
        this.sideNavigationList.forEach((i) => {
          if (item.event === i.event) {
            i.icon = item.icon
            i.name = item.name
          }
        });
      });
      navigationData.systemAppList.forEach((item) => {
        this.rightNavigationList.forEach((i) => {
          if (item.event === i.event) {
            i.icon = item.icon
            i.name = item.name
          }
        });
      });
      navigationData.systemAppList.forEach((item) => {
        this.footNavigationList.forEach((i) => {
          if (item.event === i.event) {
            i.icon = item.icon
            i.name = item.name
          }
        })
      })
      this.replaceFlag = false;
    },
    setTransparent() {
      console.log(
        "this.appSettings.transparent :>> ",
        this.appSettings.transparent
      );
      if (this.appSettings.transparent) {
        // setWallpaperColor('none')
        setTransparent();
      } else {
        detTransparent();
      }
      // if (this.appSettings.transparent) {
      //   window.localStorage.setItem("transparent", JSON.stringify("true"));
      //   document.documentElement.classList.add("transparent");
      // } else {
      //   window.localStorage.removeItem("transparent")
      //   document.documentElement.classList.remove("transparent");
      // }
    },
    customEvent() {
      this.updateLayout();
    },
    touch(event) {
      // if (this.editing) {
      //   event.stopPropagation();
      // } else {
      // }
    },
    runExec,
    ...mapActions(cardStore, [
      "getCurrentDesk",
      "addDesk",
      "switchToDesk",
      "removeDesk",
      "getCurrentIndex",
      "setDeskSize",
      "addShareDesk",
    ]),
    ...mapActions(appStore, ["setBackgroundImage"]),
    ...mapActions(weatherStore, ["fixData"]),
    // ...mapActions(deskStore, ["setDeskSize"]),

    clearWallpaper() {
      this.setBackgroundImage({ path: "" });
      message.success('已为您恢复默认背景')
      // const value = cache.get("style")
      // document.documentElement.classList.remove(value);
      // cache.set("background","-no")
      // let background = cache.get("background")
      // let model = this.styles ? "light" : "dark"
      // let name = `${model}${background || ''}-model`
      // document.documentElement.classList.add(name);
      // cache.set("style",name)
      // if (this.styles == true) {
      //   document.documentElement.classList.add(`light${background || ''}-model`);
      //   window.localStorage.setItem("style", JSON.stringify(`light${background || ''}-model`));
      // } else {
      //   document.documentElement.classList.add(`dark${background || ''}-model`);
      //   window.localStorage.setItem("style", JSON.stringify(`dark${background || ''}-model`));
      // }
    },
    initGrids() {
      this.currentDesk.cards = this.cleanMuuriData(deskTemplate["daily"]);
    },
    hideDesk() {
      this.fullScreen = !this.fullScreen;
      this.hide = !this.hide;
      this.menuVisible = false;
    },
    showAddDeskForm() {
      this.menuVisible = false;
      this.addDeskVisible = true;
    },
    delDesk() {
      this.$refs.deskGroupRef.delDesk();
    },
    changeDesk(p) {
      this.currentDeskId = p.id;
      let found = this.desks.find((desk) => {
        return desk.id === p.id;
      });
      if (found) {
        this.currentDeskIndex = {
          id: found.id,
          title: found.name,
        };
      }
    },
    doAddDesk() {
      if (this.deskTitle.trim() === "") {
        message.error("请输入新桌面名称");
        return;
      }
      if (this.deskTitle.length >= 16) {
        message.error("新桌面名称长度不可超过16");
        return;
      }
      // if (this.newDesk.name.trim() === "") {
      //   message.error("请输入新桌面名称");
      //   return;
      // }
      // if (this.newDesk.name.length >= 16) {
      //   message.error("新桌面名称长度不可超过16");
      //   return;
      // }
      this.addDesk(
        this.deskTitle,
        this.cleanMuuriData(deskTemplate[this.selectDesk.name])
        // this.newDesk.name,
        // this.cleanMuuriData(deskTemplate[this.newDesk.template])
      );
      this.switchToDesk(this.desks.length - 1);
      this.deskTitle = "";
      this.selectDesk = { title: "日常桌面", name: "daily" };
      // this.newDesk = {
      //   name: "",
      //   template: "daily",
      //   data: {},
      // };
      this.key = Date.now();
      this.addDeskVisible = false;
    },
    exportDesk() {
      this.exportModal = true;
      this.getHomeSize();
      this.menuVisible = false;
    },

    clear() {
      this.menuVisible = false;
      let desk = this.getCurrentDesk();
      if (desk) {
        Modal.confirm({
          centered: true,
          content: "清空当前桌面的全部卡片？此操作不可还原。",
          onOk: () => {
            desk.cards = [];
            this.menuVisible = false;
          },
          okText: "清空卡片",
        });
      }
    },
    // delDesk() {
    //   if (this.desks.length === 1) {
    //     Modal.info({
    //       content: "至少保留一个桌面",
    //       centered: true,
    //     });
    //     return;
    //   } else {
    //     Modal.confirm({
    //       centered: true,
    //       content: "删除当前桌面？此操作不可还原。",
    //       onOk: () => {
    //         this.menuVisible = false;
    //         this.desksList.
    //         this.key = Date.now();
    //       },
    //       okText: "删除桌面",
    //     });
    //   }
    // },
    // setInitCard(){
    //   if(this.currentDesk.showSettings){
    //     this.cardSettings = this.currentDesk.aloneSettings
    //     this.cardDesk = 'current'
    //     this.cardSwitch = true
    //   }else{
    //     this.cardSettings = this.settings
    //     this.cardDesk = 'all'
    //   }
    // },

    // 第一次登录默认数据
    addFreeLayoutDesk() {
      if (this.currentInit) {
        // 会有一个清楚数据的过程 暂时没找到原因 先用定时器延迟执行
        setTimeout(() => {
          let deskTmp = _.cloneDeep(this.deskDefault[0]);
          let oldId = deskTmp.id
          let cardZoom = ((deskTmp.settings.zoom * 10) / deskTmp.deskHeight).toFixed();
          deskTmp.settings.zoom = parseInt(cardZoom);
          deskTmp.id = window.$models.nanoid.nanoid(8);
          if (this.freeLayoutStateTmp[oldId]) {
            this.freeLayoutData[deskTmp.id] = this.freeLayoutDataTmp[oldId]
            this.freeLayoutState[deskTmp.id] = this.freeLayoutStateTmp[oldId]
          }
          this.desks[0] = deskTmp
          this.currentDeskId = deskTmp.id
          this.addApptoDesk()
          this.currentInit = false
        }, 2000)
      }
    },

    // 第一次登录加载桌面应用
    async addApptoDesk(){
      const desktopApps = await ipc.sendSync('getDeskApps')
      let appList = []
      desktopApps.forEach(i=>{
        if(i.ext == '.exe'){
          appList.push(i)
        }
      })
      let appListHandle = []
      appList.forEach(item=>{
        let obj = {
          backgroundColor: '',
          backgroundIndex: 0,
          imgShape: "square",
          imgState: "cover",
          isBackground: false,
          isRadius: true,
          isTitle: true,
          link: "fast",
          linkValue: "",
          radius: 5,
          size: "mini",
          // 图标
          src: item.icon,
          // 标题
          titleValue: item.name,
          open:{
            type:"default",
            // 网址
            value:item.path
          }
        }
        appListHandle.push(obj)
      })
      this.desks[0].cards.forEach((item,index)=>{
        // 直接修改默认数据
        if(item.id == '1702026795921'){
          // 如果一个图标都读取不出来 则将组件换成历史上的今天
          if(appListHandle.length <= 1){
            this.desks[0].cards[index].customData.iconList = appListHandle
          }else{
            this.desks[0].cards[index] = {
              "name": "historyInfo",
              "id": 1702026795921,
              "customData": {},
              "data": {}
            }
          }
        }
      })
    },

    showSetting() {
      // this.setInitCard()
      this.settingVisible = true;
      this.menuVisible = false;
    },
    goPaper() {
      this.$router.push({ name: "my" });
    },
    addCard() {
      this.custom = true;
      this.menuVisible = false;
    },
    newAddCard() {
      this.$refs.deskGroupRef.addCard();
    },
    showMenu() {
      this.menuVisible = true;
    },
    onClose() {
      this.menuVisible = false;
    },
    toggleEditing() {
      this.editing = !this.editing;
      if (this.editing) {
        message.info("您可以直接拖拽图标调整位置，支持跨组调整");
      } else {
        message.info("已关闭拖拽调整");
      }
      this.menuVisible = false;
      this.key = Date.now();
    },
    setCustom() {
      this.custom = false;
    },
    setCustoms() {
      this.visibleAdd = false;
    },
    shareDesk() {
      this.openDesk = true;
      this.menuVisible = false;
    },
    openPerview({ scheme, showModal }) {
      this.scheme = scheme;
      this.showModal = showModal;
    },
    closePreview() {
      this.showModal = false;
      this.getHomeSize();
    },
    closeShare(val) {
      this.openDesk = val;
    },
    moreDesk() {
      this.panelIndex = 1;
      this.visibleAdd = true;
      this.addDeskVisible = false;
    },
    getHomeSize() {
      this.$nextTick(() => {
        let height = document.getElementById("cardContent")?.offsetHeight;
        let width = document.getElementById("cardContent")?.offsetWidth;
        const windowHeight = document.documentElement.clientHeight; // 高
        let windowWidth = document.documentElement.clientWidth; // 宽
        let size = {
          width,
          height,
          windowHeight,
          windowWidth,
        };
        // console.log(cardsHeight)
        console.log(size, "输出");
        this.setDeskSize(size);
      });
    },
    switchChange(val) {
      if (!this.currentDesk.settings) {
        this.currentDesk.settings = {
          cardMargin: 5,
          cardZoom: 100,
          marginTop: 0,
          enableZoom: true,
        };
      } else {
        this.currentDesk.settings.enableZoom = val;
      }
      // this.currentDesk.settings.enableZoom = val
    },
    closeExport(val) {
      this.exportModal = val;
    },
    async importDesk() {
      let openPath = await tsbApi.dialog.showOpenDialog({
        title: "选择导入的代码",
        filters: [{ name: "desk存档", extensions: ["desk"] }],
      });
      if (!openPath) {
        return;
      }
      let importJsonTxt = require("fs").readFileSync(openPath[0], "utf-8");
      let needImportDesk = [];
      try {
        needImportDesk = JSON.parse(importJsonTxt);
        let cardsHeight = document.getElementById("cardContent")?.offsetHeight;
        needImportDesk.forEach((g) => {
          let cardZoom = (
            (g.settings.cardZoom * cardsHeight) /
            g.cardsHeight
          ).toFixed();

          g.settings.cardZoom = parseInt(cardZoom);
          g.nanoid = window.$models.nanoid.nanoid(8);
          this.desks.push(g);
        });
        this.addDeskVisible = false;
        message.success("为您成功导入" + needImportDesk.length + "个桌面。");
      } catch (e) {
        console.error(e);
        message.error("导入失败，请检查代码。", e);
      }
    },
  },
  watch: {
    currentDeskIndex: {
      handler() {
        this.updateLayout();
      },
    },

    backgroundSettings: {
      handler() {
        document.body.style.setProperty(
          "--backGroundImgBlur",
          this.backgroundSettings.backGroundImgBlur + "px"
        );
        document.body.style.setProperty(
          "--backGroundImgLight",
          this.backgroundSettings.backGroundImgLight
        );
      },
      deep: true,
      immediate: true,
    },
    "settings.cardMargin": {
      handler(newValue) {
        this.key = Date.now();
        // //$('.muuri-item').css('margin',newValue+'px')
        this.updateLayout();
      },
    },
    currentDesk: {
      deep: true,
      handler(val) {
        if (!val.settings) {
          this.cardSettings = this.settings;
          this.cardSwitch = false;
        } else if (val.settings.enableZoom) {
          this.cardSettings = this.currentDesk.settings;
          this.cardSwitch = true;
        } else {
          this.cardSettings = this.settings;
          this.cardSwitch = false;
        }
      },
    },
    cardDesk(val) {
      //  switch (val) {
      //   case 'all':
      //     // this.cardDesk = 'current'
      //     // if(this.currentDesk.settings.enableZoom){
      //     //   this.cardDesk = 'current'
      //     //   return message.info('当前卡片关闭后可切换')
      //     // }
      //     // this.cardSettings = this.settings
      //     break;
      //   case 'current':
      //     if(this.currentDesk.showSettings){
      //       this.cardSettings = this.currentDesk.settings
      //       this.cardSwitch = true
      //     }else{
      //       this.cardSwitch = false
      //     }
      //   // this.cardSettings = this.currentDesk.aloneSettings
      //     break;
      // }
      // if(this.currentDesk.aloneSettings){
      //   this.cardSettings = this.currentDesk.aloneSettings
      // }else{
      //   this.cardSettings = this.settings
      // }
      // switch (val) {
      //   case 'all':
      //     console.log("a11",this.settings)
      //     this.cardSettings = this.settings
      //     break;
      //   case 'current':
      //   this.cardSettings = this.currentDesk.aloneSettings
      //     break;
      // }
    },
    // cardSettings: {
    //   deep: true,
    //   handler(val){
    //     switch (this.cardDesk) {
    //       case 'all':
    //         this.settings = val
    //         // console.log("this.settings",this.settings)
    //         break;

    //       case 'current':
    //         if(this.currentDesk.showSettings)this.currentDesk.aloneSettings = val
    //         break;
    //   }
    //   }
    // }
    // showModal: {
    //   handler(newValue) {
    //     this.$refs.grid.update();
    //   },
    // }
  },
  beforeUnmount() {
    let cardsHeight = document.getElementById("cardContent")?.offsetHeight;
    this.lastHeight = cardsHeight;
    // console.log("销毁组件",cardsHeight);
  },
};
</script>

<style scoped lang="scss">
:deep(.ant-result-title) {
  color: var(--primary-text);
}

:deep(.ant-result-subtitle) {
  color: var(--secondary-text);
}

.grid {
  position: relative;
  display: inline-block;
  width: 43em;
  border-radius: 4px;
  vertical-align: top;
  left: 0;
  right: 0;
  margin-right: 1em;
}

.btn {
  text-align: center;
}

@media screen and (min-height: 1020px) and (max-height: 1600px) {
  #scrollerBar {
    height: 880px;

    .grid {
      height: 880px;
    }
  }
}

@media screen and (max-height: 1021px) {
  #scrollerBar {
    height: 438px;

    .grid {
      height: 438px;
    }
  }
}

.home-guide {
  background: var(--modal-bg) !important;
}

.desk-title {
  font-size: 16px;
  color: var(--primary-text);
  font-weight: 500;
}

.input {
  width: 452px;
  height: 48px;
  background: var(--secondary-bg);
  border-radius: 12px;
  color: var(--primary-text);
  font-size: 16px;
  border: 1px solid rgba(255, 255, 255, 0.2);
  margin: 21px 0 24px;
}

.btn-item {
  height: 48px;
  background: var(--secondary-bg);
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 24px 0;
  border-radius: 12px;
  font-size: 16px;
  color: var(--primary-text);
  cursor: pointer;
}
</style>
<style lang="scss">
.home-widgets {
  .muuri-item {
    padding: 0;
  }

  /**
  .muuri-item {
  }
  */

  .card {
    position: relative;
    border: 0;
    height: 420px;

    &.small {
      height: 204px;
    }

    &.double {
      width: 572px;
      height: 420px;
    }
  }
}
</style>
<style lang="scss">
//@media screen and (max-height: 510px) {
//  #scrollerBar {
//    zoom: 0.718;
//    width: calc(100vw + 40em);
//  }
//  .ant-tooltip{
//    zoom: 0.718;
//  }
//}
//@media screen and (min-height: 511px) and (max-height: 550px) {
//  #scrollerBar {
//    zoom: 0.78;
//    width: calc(100vw +  24em);
//  }
//  .ant-tooltip{
//    zoom: 0.78;
//  }
//}
//
//@media screen and (min-height: 551px) and (max-height: 610px) {
//  #scrollerBar {
//    zoom: 0.88;
//    width: calc(100vw + 8em);
//  }
//  .ant-tooltip{
//    zoom: 0.88;
//  }
//}
//
//@media screen and (min-height: 610px) and (max-height: 710px) {
//  #scrollerBar {
//    zoom: 1;
//    width: calc(100vw - 9em);
//  }
//}
//@media screen and (min-height: 711px) and (max-height: 810px) {
//  #scrollerBar {
//    zoom: 1.2;
//    width: calc(100vw - 9em);
//  }
//  .ant-tooltip{
//    zoom: 1.2;
//  }
//}
//
//@media screen and (min-height: 811px) and (max-height: 910px) {
//  #scrollerBar {
//    zoom: 1.4;
//    width: calc(100vw - 9em);
//  }
//  .ant-tooltip{
//    zoom: 1.4;
//  }
//}
//@media screen and (min-height: 911px) and (max-height: 1020px) {
//  #scrollerBar {
//    zoom: 1.7;
//    width: calc(100vw - 9em);
//  }
//  .ant-tooltip{
//    zoom: 1.7;
//  }
//}
//@media screen and (min-height: 1021px) and (max-height: 1220px) {
//  #scrollerBar {
//    zoom: 1;
//    width: calc(100vw - 9em);
//  }
//
//}
//@media screen and (min-height: 1221px) and (max-height: 1320px) {
//  #scrollerBar {
//    zoom: 1.1;
//    width: calc(100vw - 9em);
//  }
//  .ant-tooltip{
//    zoom: 1.1;
//  }
//}
//@media screen and (min-height: 1321px) and (max-height: 2880px) {
//  #scrollerBar {
//    zoom: 1.4;
//    width: calc(100vw - 9em);
//  }
//  .ant-tooltip{
//    zoom: 1.4;
//  }
//}
</style>
