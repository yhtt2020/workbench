<template>
  <!--  工具栏-->
  <div class="mb-2 flex flex-row" v-if="showTopBar && !fullScreen">
    <!-- tabs   -->
    <div class="tabs flex flex-row mb-3 ml-3" v-if="showTabs">
      <!--      <div @click="setCurrentDeskId('0')" :class="{'tab-active':currentDeskId==='0'}" class="pr-3 home game-tab game-bg">-->
      <!--        <icon class="icon" style="font-size: 22px;" icon="desktop"></icon>-->
      <!--        主桌面-->
      <!--      </div>-->
      <div :class="{'tab-active':currentDeskId===item.id}" @click="setCurrentDeskId(item.id)" style="width: 140px;"
           class="truncate pr-3 tab tab-bg" v-for="(item,index) in displayDesks">
        <a-avatar v-if="item.iconUrl" shape="square" class="mr-2 icon " :size="22" :src="item.iconUrl"></a-avatar>
        <icon v-else :icon="item.icon" style="font-size: 18px;vertical-align: middle" class="mr-2"></icon>
        <span class="">{{ item.name }}</span>
        <div v-if="currentDeskId===item.id" style="border-bottom: 3px solid var(--active-bg)"></div>
      </div>
      <a-tooltip title="全部桌面" placement="bottom">
        <div @click="showAll"
             class="  btn-bg no-drag pointer h-10 w-10 rounded-md flex justify-center items-center ml-3">
          <icon class="icon" style="font-size: 22px" icon="gengduo1"></icon>
        </div>
      </a-tooltip>

    </div>

    <div v-if="showTools">

      <div class="flex flex-row">
        <a-tooltip title="添加游戏桌面" placement="bottom">
          <div @click="showMore"
               class=" btn-bg no-drag pointer h-10 w-10 rounded-md flex justify-center items-center ml-3">
            <icon class="icon" style="font-size: 22px" icon="tianjia1"></icon>
          </div>
        </a-tooltip>
        <a-tooltip v-if="!editing" title="开始调整桌面" placement="bottom">
          <div @click="startEdit"
               class=" btn-bg no-drag pointer h-10 w-10 rounded-md flex justify-center items-center ml-3">
            <icon class="icon" style="font-size: 22px" icon="line-dragdroptuofang"></icon>
          </div>
        </a-tooltip>
        <a-tooltip v-else title="停止调整桌面" placement="bottom">
          <div @click="stopEdit"
               class=" btn-bg no-drag pointer h-10 w-10 rounded-md flex justify-center items-center ml-3">
            <icon class="icon" style="font-size: 22px;color:red" icon="tingzhi"></icon>
          </div>
        </a-tooltip>
        <a-tooltip title="全屏" placement="bottom">
          <div @click="setFullScreen"
               class="btn-bg no-drag pointer h-10 w-10 rounded-md flex justify-center items-center ml-3">
            <Icon style="font-size: 18px" icon="fullscreen"></Icon>
          </div>
        </a-tooltip>
      </div>
    </div>
  </div>
  <div v-if="fullScreen" class="no-drag">
    <div style="position: absolute;right: 10px;top: 10px;z-index: 999">
      <div @click="setFullScreen(false)"
           class="btn-bg no-drag pointer  w-10 rounded-md flex justify-center items-center ml-3">
        <Icon style="font-size: 18px" icon="quxiaoquanping_huaban"></Icon>
      </div>
    </div>
  </div>
  <template v-if="currentDesk && currentDesk?.cards?.length>0 ">
    <Desk :editing="editing" ref="currentDeskRef" :currentDesk="currentDesk"
          :settings="currentDesk.settings" :key="key">

      <template #outMenu>
        <a-row class="text-center" style="margin-top: 20px" :gutter="20">
          <a-col>
            <div @click="showAddDeskForm" class="btn">
              <Icon style="font-size: 3em" icon="desktop"></Icon>
              <div><span>添加桌面</span></div>
            </div>
          </a-col>
          <a-col>
            <div v-if="this.currentDesk.lock" class="btn" style="opacity: 0.5">
              <Icon style="font-size: 3em" icon="shanchu"></Icon>
              <div><span>删除桌面</span></div>
            </div>
            <div v-else @click="delDesk" class="btn">
              <Icon style="font-size: 3em" icon="shanchu"></Icon>
              <div><span>删除桌面</span></div>
            </div>
          </a-col>
          <a-col>
            <div @click="exportDesk" class="btn">
              <Icon style="font-size: 3em" icon="export"></Icon>
              <div><span>导出桌面</span></div>
            </div>
          </a-col>


        </a-row>
      </template>

    </Desk>
  </template>
  <template v-else>
    <slot name="empty">

    </slot>
    <span v-show="false">
       <Desk ref="currentDeskRef" :currentDesk="currentDesk"  :key="key" :editing="editing"></Desk>
    </span>

  </template>
  <a-drawer height="220" placement="bottom" v-model:visible="allDeskListVisible">
    <AllDeskList :activeId="currentDeskId" :items="deskList" @visibleChanged=""
                 @valueChanged="(event)=>{setCurrentDeskId(event.id);this.allDeskListVisible=false}"
    ></AllDeskList>
  </a-drawer>
  <a-drawer v-model:visible="addDeskVisible" width="500" title="添加桌面" @close="shareCode = false">
    <template #extra v-if="shareCode">
      <a-space>
        <div class="btn-item xt-active-bg" style="width:120px;margin:0;">立即添加</div>
      </a-space>
    </template>
    <div v-if="!shareCode">
      <span class="desk-title">标题</span>
      <a-input v-model:value="deskTitle" spellcheck ="false" class="input" placeholder="请输入" aria-placeholder="font-size: 16px;"/>
      <span class="desk-title">初始布局</span>
      <div class="mt-6">
        <HorizontalPanel :navList="deskType" v-model:selectType="selectDesk"></HorizontalPanel>
      </div>
      <div @click="doAddDesk" class="btn-item">立即添加</div>
      <div>
        <div @click="importDesk" class="btn-item">导入桌面</div>
      </div>
      <!--      <div @click="shareCode = true" class="btn-item">使用分享码添加</div>-->
      <!--      <div class="flex justify-between">-->
      <!--        <span class="flex items-center">-->
      <!--          <span class="desk-title mr-2">热门桌面</span>-->
      <!--          <Icon style="font-size: 20px;"  icon="daohang_remen-xuanzhong"></Icon>-->
      <!--        </span>-->
      <!--        <div class="btn-item" @click="moreDesk" style="width:160px;">更多桌面分享</div>-->
      <!--      </div>-->
      <!--      <div>-->
      <!--        <DeskMarket :navList="hotDesk" :closeParent="true" @openPerview="openPerview"  deskItemStyle="width:452px;height:392px;margin:0;"></DeskMarket>-->
      <!--      </div>-->
    </div>
    <div v-else>
      <span class="desk-title">分享码</span>
      <a-input v-model:value="deskCode" spellcheck ="false" class="input" placeholder="请输入" aria-placeholder="font-size: 16px;"/>
    </div>
    <!-- <div class="line">
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
    </div> -->
  </a-drawer>
  <ExportDesk :openModal="exportModal" @closeExport="closeExport" :layoutSize="layoutSize" :desks="deskList"></ExportDesk>
</template>


<script lang="ts">
import Desk from "./Desk.vue";
import {appStore} from "../../store";
import {mapWritableState, mapWritableState} from "pinia";
import GameListDrawer from "../game/GameListDrawer.vue";
import AllDeskList from "./AllDeskList.vue";
import {message, Modal} from "ant-design-vue";
import HorizontalPanel from "../HorizontalPanel.vue";
import ExportDesk from "./ExportDesk.vue";

export default {
  name: "DeskGroup",
  components: {ExportDesk, HorizontalPanel, AllDeskList, GameListDrawer, Desk},
  emits: ['update:currentDeskId', 'showMore'],
  props: {
    deskList: {
      type: Array,
      default: []
    },
    //是否显示tabs
    showTabs: {
      type: Boolean,
      default: true
    },

    //是否显示顶部栏
    showTopBar: {
      type: Boolean,
      default: true
    },
    //是否显示工具栏
    showTools: {
      type: Boolean,
      default: true
    },
    currentDeskId: {
      type: String,
      default: '0'
    }
  },
  data() {
    return {
      key:Date.now(),
      moreDesksVisible: false,//显示更多桌面
      allDeskListVisible: false,
      editing: false,//编辑桌面

      addDeskVisible:false,
      deskType: [
        {title:'日常桌面',name:'daily'},
        {title:'游戏桌面',name:'game'},
        {title:'办公桌面',name:'work'},
        {title:'空白桌面',name:'empty'},
      ],
      selectDesk: {title:'日常桌面',name:'daily'},
      deskTitle: '',
      hotDesk: [],
      scheme: {},
      showModal: false,
      deskCode: '',
      shareCode: false,
      exportModal: false,
      layoutSize:{width:0,height:0}
    }
  },
  mounted() {
    if (this.deskList.length > 0) {
      this.currentDesk = this.deskList[0]
    }
    this.deskList.forEach(desk=>{
      if(!desk.id){
        desk.id=desk.nanoid
      }
    })
  },
  computed: {
    ...mapWritableState(appStore, ['fullScreen']),
    currentDesk() {
      return this.deskList.find(desk => {
        return desk.id === this.currentDeskId
      })
    },
    displayDesks() {
      return [...this.deskList.filter(desk => {
        return desk.pin
      }),
        ...this.deskList.filter(desk => {
          return !desk.pin
        })
      ].slice(0, 4).sort((a, b) => {
        if (b.pin) {
          //置顶的桌面排最前面
          return 9999999999999
        }
        return Number(b.order || 0) - Number(a.order || 0)
      })
    }
  },
  methods: {
    startEdit() {
      this.key=Date.now()
      this.editing = true
      this.$refs.currentDeskRef.update()
    },
    stopEdit() {
      this.key=Date.now()
      this.editing = false
    },
    addCard() {
      this.$refs.currentDeskRef.newAddCard()
    },
    setFullScreen(flag = true) {
      this.$refs.currentDeskRef.stashLayout()
      this.fullScreen = flag
      this.$nextTick(() => {
        if (flag === false) {
          this.$refs.currentDeskRef.restoreLayout(1)
        } else {
          this.$refs.currentDeskRef.restoreLayout()
        }

      })
    },
    showMore() {
      this.$emit('showMore')
    },
    setCurrentDeskId(id) {
      this.$emit('update:currentDeskId', id)
    },
    showAll() {
      this.allDeskListVisible = true
    },
    async importDesk() {
      let openPath = await tsbApi.dialog.showOpenDialog({
        title: '选择导入的代码',
        filters: [{ name: 'desk存档', extensions: ['desk'] }],
      })
      if (!openPath) {
        return
      }
      let importJsonTxt = require('fs').readFileSync(openPath[0], 'utf-8')
      let needImportDesk = []
      try {
        needImportDesk = JSON.parse(importJsonTxt)
        let cardsHeight = document.getElementById("cardContent")?.offsetHeight;
        needImportDesk.forEach(g => {
          console.log(g,'导出的数据')
          //修正一下老版本导出的数据
          if(g.cardsHeight){
            g.deskHeight=g.cardsHeight
          }
          if(g.settings.cardZoom){
            g.settings.zoom=g.settings.cardZoom
          }
          let cardZoom = (g.settings.zoom * cardsHeight/g.deskHeight).toFixed()
          g.icon='desktop'
          g.settings.zoom = parseInt(cardZoom)
          g.id = window.$models.nanoid.nanoid(8)
          this.deskList.unshift(g)
        })
        this.addDeskVisible = false
        message.success('为您成功导入' + needImportDesk.length + '个桌面。')
      } catch (e) {
        console.warn(e)
        message.error('导入失败，请检查代码。')
      }
    },
    showAddDeskForm() {
      this.$refs.currentDeskRef.hideMenu()
      this.menuVisible = false;
      this.addDeskVisible = true;
    },
    delDesk() {
      if (this.deskList.length === 1) {
        Modal.info({
          content: "至少保留一个桌面",
          centered: true,
        });
        return;
      } else {
        this.$refs.currentDeskRef.hideMenu()
        Modal.confirm({
          centered: true,
          content: "删除当前桌面？此操作不可还原。",
          onOk: () => {
            this.deskList.splice(this.deskList.findIndex(desk=>{
              return desk===this.currentDesk
            }),1)
            this.$emit('changeDesk',{id:this.deskList[0].id})
            this.key = Date.now();
          },
          okText: "删除桌面",
        });
      }
    },
    exportDesk(){
      this.$refs.currentDeskRef.hideMenu()
      this.layoutSize=this.$refs.currentDeskRef.getLayoutSize()
      this.exportModal = true
    },
    closeExport(val){
      this.exportModal = val
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
      this.deskTitle = ''
      this.selectDesk = {title:'日常桌面',name:'daily'}
      // this.newDesk = {
      //   name: "",
      //   template: "daily",
      //   data: {},
      // };
      this.key = Date.now();
      this.addDeskVisible = false;
    },
  }
}
</script>


<style scoped lang="scss">
.tabs {
  .tab {
    .icon {
      margin-top: -1px;
      vertical-align: text-top;
    }

    cursor: pointer;

    &.tab-active, &:hover {
      opacity: 1;
      font-weight: bold;
    }

    opacity: 0.5;
    line-height: 38px;
    font-size: 15px;
    min-width: 150px;
    border-radius: 4px;
    margin-right: 10px;
    padding-left: 10px;
    padding-right: 10px;
    text-align: center;
  }

  .more {
    min-width: 80px;
  }

  .home {

    min-width: 90px;
  }

}

.btn-bg {
  background: var(--primary-bg);
  color: var(--primary-text);
  height: 42px;
  line-height: 42px;

  &:hover {
    opacity: 0.8;
  }
}

.tab-bg {
  background: var(--primary-bg);
  color: var(--primary-text);

}


.btn-item{
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
.desk-title{
  font-size: 16px;
  color: var(--primary-text);
  font-weight: 500;
}
.input{
  width: 452px;
  height: 48px;
  background: var(--secondary-bg);
  border-radius: 12px;
  color: var(--primary-text);
  font-size: 16px;
  border: 1px solid rgba(255,255,255,0.2);
  margin: 21px 0 24px;
}
</style>
