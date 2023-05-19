<template>
  <div
    v-if="hide"
    style="position: fixed; top: 0; bottom: 0; right: 0; left: 0"
    @click="hideDesk"
    @contextmenu="hideDesk"
  ></div>
  <div
    v-if="!hide"
    @contextmenu="showMenu"
    style="
      display: flex;
      align-items: flex-start;
      flex-direction: column;
      justify-content: left;
      flex-grow: 1;
      flex-shrink: 1;
      height: 100%;
      width: 100%;
    "
  >
    <div class="text-left" v-if="desks.length > 1">
      <HorizontalPanel
        @changed="this.key = Date.now()"
        :navList="desksList"
        v-model:selectType="currentDeskIndex"
      ></HorizontalPanel>
    </div>
    <div class="p-3 m-auto" v-if="this.currentDesk.cards.length === 0">
      <div style="width: 100%">
        <a-result
          class="s-bg rounded-lg m-auto"
          style="margin: auto"
          status="success"
          title="使用卡片桌面"
          sub-title="您可以长按空白处、右键添加卡片。"
        >
          <template #extra>
            <a-button
              @click="addCard"
              class="mr-10"
              key="console"
              type="primary"
              >添加第一张卡片</a-button
            >
            <a-button disabled key="buy" @click="learn"
              >学习（课程暂未上线）</a-button
            >
          </template>

          <div class="desc">
            <p style="font-size: 16px">
              <strong>您可以通过桌面设置调节卡片到合适的大小</strong>
            </p>
            <p>
              <close-circle-outlined :style="{ color: 'red' }" />
              从社区获得分享代码（此功能暂未上线，请耐心等待）
              <a>从社区导入 &gt;</a>
            </p>
          </div>
        </a-result>
      </div>
    </div>
    <vue-custom-scrollbar
      key="scrollbar"
      id="scrollerBar"
      @contextmenu.stop="showMenu"
      :settings="scrollbarSettings"
      style="position: relative; border-radius: 8px; width: 100%; height: 100%"
    >
      <div
        style="
          white-space: nowrap;
          height: 100%;
          width: 100%;
          display: flex;
          align-items: center;
          align-content: center;
        "
        :style="{ 'padding-top': this.settings.marginTop + 'px' }"
      >
        <!--      <div style="width: 43em;display: inline-block;" v-for="(grid,index) in customComponents">-->
        <!--        <div>-->
        <!--          <vuuri group-id="grid.id" :drag-enabled="true" v-model="grid.children" class="grid" ref="grid">-->
        <!--          <template #item="{ item }">-->
        <!--              <div style="display: inline-block" >-->
        <!--                <Widget @contextmenu.stop="showMenu(item.id,{item,grid},'item')"   :item="item"-->
        <!--                    :uniqueKey="String(item.id)"-->
        <!--                    :showDelete="true"-->
        <!--                    :resizable="true"-->
        <!--            >-->
        <!--            <component :is="item.name" :customIndex="item.id" ></component></Widget></div>-->
        <!--          </template>-->
        <!--          </vuuri></div></div>-->
        <vuuri
          v-if="currentDesk.cards"
          :get-item-margin="
            () => {
              return settings.cardMargin + 'px';
            }
          "
          group-id="grid.id"
          :drag-enabled="editing"
          v-model="currentDesk.cards"
          :key="key"
          :style="{
            zoom: (this.settings.cardZoom / 100).toFixed(2),
            height: '100%',
            width: '100%',
          }"
          class="grid home-widgets"
          ref="grid"
          :options="muuriOptions"
        >
          <template #item="{ item }">
            <div :style="{ pointerEvents: editing ? 'none' : '' }">
              <component
                :is="item.name"
                :customIndex="item.id"
                @touchstart="touch"
                @touchmove="touch"
                @touchend="touch"
                :customData="item.data"
                :editing="editing"
                :runAida64="runAida64"
                @customEvent="customEvent"
              ></component>
            </div>
          </template>
        </vuuri>
      </div>
    </vue-custom-scrollbar>
  </div>
  <transition name="fade">
    <div
      class="home-blur"
      style="
        position: fixed;
        top: 0;
        right: 0;
        left: 0;
        bottom: 0;
        z-index: 999;
      "
      v-if="custom"
    >
      <AddCard @setCustom="setCustom"></AddCard>
    </div>
  </transition>

  <a-drawer
    :contentWrapperStyle="{ backgroundColor: '#1F1F1F' }"
    :width="120"
    :height="220"
    class="drawer"
    placement="bottom"
    :visible="menuVisible"
    @close="onClose"
  >
    <a-row style="margin-top: 1em" :gutter="[20, 20]">
      <a-col>
        <div @click="toggleEditing" class="btn">
          <Icon
            v-if="!this.editing"
            style="font-size: 3em"
            icon="bofang"
          ></Icon>
          <Icon
            v-else
            style="font-size: 3em; color: orange"
            icon="tingzhi"
          ></Icon>
          <div>
            <span v-if="!this.editing">调整布局</span
            ><span v-else style="color: orange">停止调整</span>
          </div>
        </div>
      </a-col>
      <a-col>
        <div @click="addCard" class="btn">
          <Icon style="font-size: 3em" icon="tianjia1"></Icon>
          <div><span>添加卡片</span></div>
        </div>
      </a-col>
      <a-col>
        <div @click="showSetting" class="btn">
          <Icon style="font-size: 3em" icon="shezhi1"></Icon>
          <div><span>设置</span></div>
        </div>
      </a-col>
      <a-col>
        <div @click="clear" class="btn">
          <Icon style="font-size: 3em" icon="shanchu"></Icon>
          <div><span>清空卡片</span></div>
        </div>
      </a-col>
      <a-col>
        <div @click="showAddDeskForm" class="btn">
          <Icon style="font-size: 3em" icon="desktop"></Icon>
          <div><span>添加桌面</span></div>
        </div>
      </a-col>
      <a-col>
        <div @click="delDesk" class="btn">
          <Icon style="font-size: 3em" icon="shanchu"></Icon>
          <div><span>删除桌面</span></div>
        </div>
      </a-col>
      <a-col>
        <div @click="hideDesk" class="btn">
          <Icon style="font-size: 3em" icon="yanjing-yincang"></Icon>
          <div><span>隐藏桌面</span></div>
        </div>
      </a-col>
    </a-row>
  </a-drawer>
  <a-drawer v-model:visible="settingVisible" placement="right">
    <div class="line-title">卡片设置：</div>
    <div class="line">
      卡片缩放：
      <a-slider
        :min="20"
        :max="500"
        v-model:value="settings.cardZoom"
      ></a-slider>
    </div>
    <div class="line">
      卡片空隙：(调大空隙可能变成瀑布流布局)
      <a-slider
        :min="5"
        :max="30"
        v-model:value="settings.cardMargin"
      ></a-slider>
    </div>
    <div class="line">
      距离顶部：
      <a-slider
        :min="0"
        :max="200"
        v-model:value="settings.marginTop"
      ></a-slider>
    </div>
    <div class="line-title">背景设置：</div>
    <div class="line">
      透明背景(透出系统桌面壁纸)：<a-switch
        v-model:checked="appSettings.transparent"
      ></a-switch>
    </div>
    <div class="line" v-if="!appSettings.transparent">
      <a-button type="primary" class="mr-3" @click="goPaper">背景设置</a-button>
      <a-button @click="clearWallpaper">清除背景</a-button>
    </div>
    <div v-if="!appSettings.transparent" class="line">
      <div class="line">
        背景模糊度：
        <a-slider
          v-model:value="backgroundSettings.backGroundImgBlur"
          :max="100"
          :step="1"
        />
      </div>
      <!--      <div class="line">-->
      <!--        遮罩浓度：-->
      <!--        <a-slider v-model:value="backgroundSettings.backGroundImgLight" :max="0.8" :min="0" :step="0.1"/>-->
      <!--      </div>-->
    </div>

    <div class="line-title">RGB<br />（此类功能性能消耗较高，请酌情开启）</div>
    <div class="line">
      边框跑马灯：
      <a-switch v-model:checked="appSettings.houserun"></a-switch>
    </div>
    <div class="line">
      飘落特效：
      <a-switch v-model:checked="appSettings.down.enable"></a-switch>
    </div>
    <div class="line" v-if="appSettings.down.enable">
      飘落物：
      <a-radio-group v-model:value="appSettings.down.type">
        <a-radio value="rain">雨</a-radio>
        <a-radio value="snow">雪</a-radio>
        <a-radio value="leaf">叶</a-radio>
      </a-radio-group>
    </div>
    <div class="line" v-if="appSettings.down.enable">
      飘落物数量：
      <a-input-number v-model:value="appSettings.down.count"></a-input-number>
    </div>
  </a-drawer>
  <div
    class="home-blur fixed inset-0 p-12"
    style="z-index: 999"
    v-if="agreeTest === false"
  >
    <GradeNotice></GradeNotice>
  </div>
  <a-drawer v-model:visible="addDeskVisible">
    <div class="line-title">添加桌面</div>
    <div class="line">
      <a-input v-model:value="newDesk.name" placeholder="桌面名称"></a-input>
    </div>
    <div class="line">选择初始布局：</div>
    <div class="line">
      <a-radio-group v-model:value="newDesk.template" defaultValue="daily">
        <a-radio value="daily">日常桌面</a-radio>
        <a-radio value="game">游戏桌面</a-radio>
        <a-radio value="work">办公桌面</a-radio>
        <a-radio value="empty">空白桌面</a-radio>
      </a-radio-group>
    </div>
    <div class="mt-5">
      <a-button type="primary" @click="doAddDesk" block>确认添加</a-button>
    </div>
  </a-drawer>
</template>
<script>
import Weather from "../components/homeWidgets/Weather.vue";
import Calendar from "../components/homeWidgets/Calendar.vue";
import Timer from "../components/homeWidgets/Timer.vue";
import Music from "../components/homeWidgets/Music.vue";
import Stock from "../components/homeWidgets/Stock.vue";
import AddMore from "../components/homeWidgets/AddMore.vue";
import Dou from "../components/homeWidgets/Dou.vue";
import Fish from "../components/homeWidgets/Fish.vue";
import CustomTimer from "../components/homeWidgets/CustomTimer.vue";
import SmallCountdownDay from "../components/homeWidgets/SmallCountdownDay.vue";
import Clock from "../components/homeWidgets/Clock.vue";
import CountdownDay from "../components/homeWidgets/CountdownDay.vue";
import { mapActions, mapWritableState } from "pinia";
import { cardStore } from "../store/card";
import vuuri from "../components/vuuriHome/Vuuri.vue";
import Widget from "../components/muuri/Widget.vue";
import { message, Modal } from "ant-design-vue";
import CPULineChart from "../components/homeWidgets/supervisory/CPULineChart.vue";
import CPUFourCard from "../components/homeWidgets/supervisory/CPUFourCard.vue";
import InternalList from "../components/homeWidgets/supervisory/InternalList.vue";
import SmallCPUCard from "../components/homeWidgets/supervisory/SmallCPUCard.vue";
import SmallGPUCard from "../components/homeWidgets/supervisory/SmallGPUCard.vue";
import GamesDiscount from "../components/homeWidgets/games/GamesDiscount.vue";
import DiscountPercentage from "../components/homeWidgets/games/DiscountPercentage.vue";
import MiddleWallpaper from "../components/homeWidgets/MiddleWallpaper.vue";
import SmallWallpaper from "../components/homeWidgets/SmallWallpaper.vue";
import MyGameSmall from "../components/homeWidgets/games/MyGameSmall.vue";
import MyGameMiddle from "../components/homeWidgets/games/MyGameMiddle.vue";
import Capture from "../components/homeWidgets/games/Capture.vue";
import AddCard from "./app/card/AddCard.vue";
import GradeNotice from "./app/grade/GradeNotice.vue";
import Voice from "../components/homeWidgets/games/Voice.vue";
import Audio from "../components/homeWidgets/games/Audio.vue";
import CaptureNewCard from "../components/homeWidgets/games/CaptureNewCard.vue";
import { runExec } from "../js/common/exec";
import { appStore } from "../store";
import Remote from "../components/homeWidgets/custom/Remote.vue";
import { weatherStore } from "../store/weather";
import GameEpic from "../components/homeWidgets/games/GameEpic.vue";
import CustomAssembly from "../components/homeWidgets/custom/CustomAssembly.vue";
import SignIn from "../components/homeWidgets/SignIn.vue"
import SteamFriends from '../components/homeWidgets/games/SteamFriends.vue'
import Muuri from 'muuri'
import HorizontalPanel from '../components/HorizontalPanel.vue'
import {setSupervisoryData} from '../js/action/supervisory'
const readAida64 = window.readAida64
const {steamUser,steamSession,path,https,steamFs} = $models
const {LoginSession, EAuthTokenPlatformType} = steamSession
let session = new LoginSession(EAuthTokenPlatformType.SteamClient);
let client = new steamUser({
  enablePicsCache: true,
});
let List = [];
const deskTemplate = {
  daily: [
    {
      name: "GamesDiscount",
      id: 1681304819425,
      _$muuri_id: "55c84b95-d86c-44af-b762-2670a0b46402",
      data: {
        Code: {
          id: 1682157435113,
          value: {
            id: "cn",
            name: "国区",
          },
        },
      },
    },
    {
      name: "weather",
      id: 1681303795258,
      _$muuri_id: "3b0a3701-25e5-4324-b1b0-a25f7cc91d02",
      data: {},
    },
    {
      name: "music",
      id: 1681736564285,
      _$muuri_id: "64c17a09-b036-44b3-99b9-4c2c13e4ca3b",
      data: {},
    },
    {
      name: "DiscountPercentage",
      id: 1681479859424,
      _$muuri_id: "361290b7-f0f9-44d6-b213-39d0dfb34c97",
      data: {},
    },
    {
      name: "timer",
      id: 1681303805239,
      _$muuri_id: "f508d0b1-046f-46f1-b423-e39226b91256",
      data: {},
    },
    {
      name: "fish",
      id: 1681303797561,
      _$muuri_id: "6a6bf415-1491-4a70-bc45-c72877843a34",
      data: {},
    },
    {
      name: "customTimer",
      id: 1681303790200,
      _$muuri_id: "5084aec4-5597-40e3-9b71-8eda52328eb1",
      data: {},
    },
    {
      name: "smallCountdownDay",
      id: 1681303811893,
      _$muuri_id: "e7652694-bad4-4688-80ac-b8cb89111ae2",
      data: {},
    },
    {
      name: "clock",
      id: 1681303836730,
      _$muuri_id: "799e50c0-9c51-46c5-9134-6d70a107d6bf",
      data: {},
    },
    {
      name: "middleWallpaper",
      id: 1682158281403,
      data: {},
      _$muuri_id: "9eae01ee-7184-47f3-ad73-a62d90ba4630",
    },
  ],
  game: [
    {
      name: "GamesDiscount",
      id: 1683361279519,
      data: {
        id: "cn",
      },
      _$muuri_id: "afe08db5-591c-4c03-8535-302485228da7",
    },
    {
      name: "GameEpic",
      id: 1683361479503,
      data: {},
      _$muuri_id: "d9775365-ac7a-44eb-9643-f5afd2ce1927",
    },
    {
      name: "CPULineChart",
      id: 1683361318879,
      data: {},
      _$muuri_id: "cddb3c87-1dd9-429c-8db5-b626a41b520e",
    },
    {
      name: "capture",
      id: 1683361487658,
      data: {},
      _$muuri_id: "4f68f51f-12c3-4dfd-a56f-a317eefb2a8d",
    },
    {
      name: "MyGameSmall",
      id: 1683361327075,
      data: {},
      _$muuri_id: "27f6b805-9460-4b4f-b48a-0fe9f861d4fb",
    },
  ],
  work: [
    {
      name: "customTimer",
      id: 1683361408159,
      data: {},
      _$muuri_id: "b9da8e82-b907-45b8-b4f7-404409a53625",
    },
    {
      name: "clock",
      id: 1683361412293,
      data: {},
      _$muuri_id: "43c55d51-7ffb-4fbd-994c-64a4b8a503d0",
    },
    {
      name: "weather",
      id: 1683361418237,
      data: {},
      _$muuri_id: "d6e03889-a8ea-4328-97b4-599350aa4002",
    },
    {
      name: "timer",
      id: 1683361422401,
      data: {},
      _$muuri_id: "75ed0b65-5b37-4f79-82e5-3b1c46b9df53",
    },
    {
      name: "smallCountdownDay",
      id: 1683361434496,
      data: {},
      _$muuri_id: "698a7d80-23c9-42cf-9e7b-3a580acc7be8",
    },
    {
      name: "smallWallpaper",
      id: 1683361445577,
      data: {
        Code: {
          id: 1683361445577,
          value: {
            value: "贪食鬼",
            path: "https://api.nguaduot.cn/glutton/journal",
            name: "PickingPaper",
          },
        },
      },
      _$muuri_id: "d6f9dfae-8098-4da3-8f15-3913cb506bf7",
    },
  ],
  empty: [],
};
export default {
  name: "Home",
  data() {
    return {
      newDesk: {
        name: "",
        template: "daily",
      },

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
      timer: null,
      reserveTimer: null,
      custom: false,
      runAida64: true,
      muuriOptions: {
        dragAutoScroll: {
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
        },
      },
    };
  },
  components: {
    HorizontalPanel,
    Modal,
    Dou,
    AddMore,
    Stock,
    Music,
    Calendar,
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
    MyGameMiddle,
    Capture,
    CustomAssembly,
    SignIn,
    Voice,
    Audio,
    SteamFriends,
    CaptureNewCard,
    //clocks,
  },
  computed: {
    ...mapWritableState(cardStore, [
      "customComponents",
      "clockEvent",
      "aidaData",
      "settings",
      "desks",
      "moved",
      "currentDeskIndex",
    ]),
    ...mapWritableState(appStore, [
      "agreeTest",
      "backgroundSettings",
      "backgroundImage",
    ]),

    ...mapWritableState(appStore, {
      appSettings: "settings",
    }),
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
        return desk.nanoid === this.currentDeskIndex.name;
      });
      if (find) {
        return find;
      } else {
        return {
          cards: [],
        };
      }
    },
  },
  async mounted() {
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
      this.desks[0].cards = this.customComponents;
      this.moved = true;
    }
    if (this.desks.length > 0 && !this.currentDeskIndex.name) {
      this.currentDeskIndex = {
        name: this.desks[0].nanoid,
        title: this.desks[0].name,
      };
    }
    this.fixData();
    window.onresize = () => {
      this.scrollbar = Date.now();
    };
    //this.customComponents=[{name:'Music',id:2},{name:'Weather',id:3},{name:'Timer',id:4}]//重置
    if (this.customComponents.length > 0) {
      if (typeof this.customComponents[0] === "string") {
        this.customComponents = [];
      }
    }
  },
  created() {
    this.customComponents.forEach((e) => {
      if (!e.data) {
        e.data = {};
      }
    });
    this.navigationList = [];
    this.startAida();
    //this.setAgreeTest(false)
  },
  unmounted() {
    if (this.timer) {
      clearInterval(this.timer);
    }
    if (this.reserveTimer) {
      clearInterval(this.reserveTimer);
    }
  },
  methods: {
    customEvent() {
      this.$refs.grid.update();
    },
    touch(event) {
      if (this.editing) {
        event.stopPropagation();
      } else {
      }
    },
    runExec,
    ...mapActions(cardStore, [
      "setAidaData",
      "getCurrentDesk",
      "addDesk",
      "switchToDesk",
      "removeDesk",
      "getCurrentIndex",
    ]),
    ...mapActions(appStore, ["setBackgroundImage"]),
    ...mapActions(weatherStore, ["fixData"]),
    setSupervisoryData,
    clearWallpaper() {
      this.setBackgroundImage({ path: "" });
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
    doAddDesk() {
      if (this.newDesk.name.trim() === "") {
        message.error("请输入新桌面名称");
        return;
      }
      if (this.newDesk.name.length >= 16) {
        message.error("新桌面名称长度不可超过16");
        return;
      }

      this.addDesk(
        this.newDesk.name,
        this.cleanMuuriData(deskTemplate[this.newDesk.template])
      );
      this.switchToDesk(this.desks.length - 1);
      this.newDesk = {
        name: "",
        template: "daily",
        data: {},
      };
      this.key = Date.now();
      this.addDeskVisible = false;
    },
    cleanMuuriData(list) {
      list.forEach((li) => {
        li.id = Date.now();
        delete li["_$muuri_id"];
      });
      return list;
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
    delDesk() {
      if (this.desks.length === 1) {
        Modal.info({
          content: "至少保留一个桌面",
          centered: true,
        });
        return;
      } else {
        Modal.confirm({
          centered: true,
          content: "删除当前桌面？此操作不可还原。",
          onOk: () => {
            this.menuVisible = false;
            this.removeDesk(this.getCurrentIndex());
            this.key = Date.now();
          },
          okText: "删除桌面",
        });
      }
    },
    showSetting() {
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
    startAida() {
      this.timer = setInterval(() => {
        readAida64()
          .then((res) => {
            this.runAida64 = true;
            const newData = this.setSupervisoryData(res);
            this.setAidaData(newData);
            // console.log(res)
            //this.data=JSON.stringify(res, null, '\t')
          })
          .catch((err) => {
            this.runAida64 = false;
            clearInterval(this.timer);
            this.reserveTimer = setInterval(() => {
              readAida64()
                .then((res) => {
                  this.runAida64 = true;
                  clearInterval(this.reserveTimer);
                  this.startAida();
                })
                .catch((err) => {});
            }, 10000);
            const newData = this.setSupervisoryData(undefined);
            this.setAidaData(newData);
          });
      }, 1000);
    },
  },
  watch: {
    currentDeskIndex: {
      handler() {
        this.$refs.grid.update();
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
        this.$refs.grid.update();
      },
    },
  },
};
</script>
<style scoped lang="scss">
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
