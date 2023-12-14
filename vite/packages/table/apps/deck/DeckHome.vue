<template>
  <div v-if="!isWin()" class="xt-bg-2 mt-10 rounded-lg p-4 px-5 w-auto m-auto"  >
    <div class=" mr-2 pt-1 " ><iconify style="font-size: 18px;vertical-align: text-bottom" icon="akar-icons:info-fill"></iconify> 暂不支持在非Windows平台上使用快捷指令功能。请耐心等待版本更新。</div>
  </div>
  <template v-else>
    <div v-if="this.grids.length === 0" class=" box p-5" style="max-height: 100%">
      <a-result class="s-bg rounded-lg " style="background: var(--primary-bg);color: var(--primary-text);" status="success" title="使用快捷指令"
                sub-title="快捷指令功能，我们又称之为Dreamdeck，此功能的使用需要有一定的计算机基础知识。">
        <template #extra>
          <div class="item-content">
            <xt-button type="theme" :w="140" @click="initGrids" class="mr-10" key="console" >以示例方案启动</xt-button>
          </div>

<!--          <a-button disabled key="buy" @click="learn"-->
<!--                    style="color:var( &#45;&#45;secondary-text); ">学习（课程暂未上线）</a-button>-->
        </template>
        <div class="desc">
          <p style="font-size: 16px">
            <strong>您也可以通过多种方式导入别人分享的方案：</strong>
          </p>
          <p>
            <close-circle-outlined />
            使用分享代码导入
            <a @click="toggleImport">导入代码 &gt;</a>
          </p>
          <p>
            <close-circle-outlined  />
            从社区获得分享代码（此功能暂未上线，请耐心等待）
            <a>从社区导入 &gt;</a>
          </p>
        </div>
      </a-result>
    </div>

  </template>

  <div v-if="sharing" style="padding: 2em;padding-left: 4em;padding-bottom: 0">
    <h2>请选择您要分享的小组，勾选后，在底部选择需要分享的方式。</h2>
    <p>对于不希望分享的小组，可以不做勾选。</p>
  </div>
  <div v-if="sharing" class="sharing-bottom-panel" style="position: fixed;bottom: 0;padding: 2em;width: 100vw">
    <a-row>
      <a-col :span="12">
        当前选中的组：
        <span style="color: grey" v-if="selectedGrids.length === 0">请选择希望分享的组!</span>
        <a-tag v-for="grid in selectedGrids">
          {{ grid.title }}
        </a-tag>
      </a-col>
      <a-col :span="7" class="text-right">
        分享到：
        <a-select v-model:value="shareTo">
          <a-select-option value="json">代码</a-select-option>
          <a-select-option disabled value="com">社区</a-select-option>
        </a-select>
      </a-col>
      <a-col :span="5" style="text-align: right">
        <a-button class="mr-5" type="primary" @click="ensureShare">分享</a-button>
        <a-button @click="this.toggleSharing()">放弃分享</a-button>
      </a-col>
    </a-row>
  </div>
  <div class="flex h-full w-full" :class="{ sharing: sharing }">
    <vue-custom-scrollbar  @contextmenu.stop="showMenu(-1, undefined, 'wrapper')" :settings="scrollbarSettings" class="flex-1 w-full h-full"
      style=" border-radius: 8px; ">

      <div style="width: auto;white-space: nowrap">
        <div @contextmenu.stop="showMenu(grid.id)" :style="{ width: getWidth(grid.cols) }" style="display: inline-block"
          v-for="(grid, index) in            grids           ">
          <h3 class="pointer text-more" v-if="sharing">
            <a-checkbox v-model:checked="selectedGridIds[grid.id]">{{ grid.title }}</a-checkbox>
          </h3>
          <template v-else>
            <h3 class="pointer text-more" v-if="editing">
              <span v-if="editing"><span style="margin-left: 0.8em"><left-square-outlined v-if="index !== 0"
                    @click.stop="moveGrid(-1, index)" class="mr-3" /> <right-square-outlined
                    v-if="index !== this.grids.length - 1" @click.stop="moveGrid(1, index)" /></span>
                <span class="pl-5"></span> {{ grid.title }}</span>
            </h3>
            <h3 @click.stop="showEditTitle(grid)" style="padding-left: 0.8em;margin-bottom: 0em" v-else
              class="pointer text-more xt-text">
              {{ grid.title }}
            </h3>
          </template>

          <div>
            <!--      <div style="min-height: 3em" @contextmenu.stop="showMenu(index)" :id="'board-'+board.id" class="grid"-->
            <!--           v-for="(board,index) in decks">-->
            <!--        <DeckItem :id="item.id" :item="item" v-for="item in board.children"></DeckItem>-->
            <!--      </div>-->
            <div :style="{ width: getVuuriWidth(grid.cols) }"
              style="text-align: center;padding-top: 0.3em;padding-bottom: 0.3em"
              v-if="grid.children.length === 0 && editing === false" class="grid">
              <a-button block size="large" style="max-width: calc(100% - 0.6em)" type="primary" @click.stop="add(grid)">
                <plus-outlined />
                添加
              </a-button>
            </div>


            <vuuri v-show="grid.children.length !== 0 || editing" :style="{ width: getVuuriWidth(grid.cols) }" :key="key"
              :drag-enabled="editing" group-id="grid.id" :ref="'grid' + grid.id" style="min-height: 3em" item-key="id"
              class="grid s-bg" :get-item-width="getIconSize" :get-item-height="getIconSize" v-model="grid.children">
              <template #item="{ item }">
                <Widget @contextmenu.stop="showMenu(item.id, { item, grid }, 'item')" :item="item"
                  :uniqueKey="String(item.id)" :title="item.title" :showDelete="true" :resizable="true">
                  <DeckItem :id="item.id" :item="item"></DeckItem>
                </Widget>
              </template>
            </vuuri>
            <!--      <Grid :value="grid" :ref="'grid'+grid.id" class="grid" :id="grid.id" @contextmenu.stop="showMenu(grid.id)" v-for="(grid,index) in grids" :draggable="true" :showDelete="true" :resizable="false">-->
            <!--        <Widget  :w-id="widget.id" v-for="widget in grid.children"-->
            <!--          :uniqueKey="widget.id"-->
            <!--          :title="widget.title"-->
            <!--          :showDelete="true"-->
            <!--          :resizable="true"-->
            <!--        >-->
            <!--          <DeckItem :id="widget.id" :item="widget"></DeckItem>-->
            <!--        </Widget>-->
            <!--      </Grid>-->
          </div>
        </div>
      </div>

    </vue-custom-scrollbar>
  </div>
  <a-drawer title="设置分享信息" placement="right" :closable="true" v-model:visible="shareMenuComVisible" @close="onClose">
    <div class="line">
      分享标题：
      <a-input v-model:value="shareData.title"></a-input>

    </div>
    <div class="line">
      分享描述：
      <a-input v-model:value="shareData.summary"></a-input>
    </div>
    <div class="line">
      <a-button>确定</a-button>
    </div>

  </a-drawer>
  <a-drawer title="导出方案" placement="right" :closable="true" v-model:visible="shareMenuJsonVisible" @close="onClose">
    <div class="line">
      请将下方文本发送给其他用户，其他用户粘贴导入后即可导入成功。<br>
      注意：代码超过聊天工具可发送文本长度，可选择保存为文件，以发送文件方式分享。

    </div>
    <div class="line">
      方案代码：
    </div>
    <div class="line">
      <a-textarea style="width: 100%;height: 22em" :value="getShareJson()"></a-textarea>
    </div>
    <div class="line">
      <a-button class="mr-5" type="primary" @click="copyCode">复制分享代码</a-button>
      <a-button @click="saveFile">保存为文件</a-button>
    </div>

  </a-drawer>
  <a-drawer title="修改组设置" placement="right" :closable="true" v-model:visible="editGridVisible" @close="onClose">
    <div class="line">
      <a-row :gutter="5">
        <a-col>
          <div @click="changeSize('large')" class="btn">
            <a-avatar shape="square">大</a-avatar>
            <div>大图标</div>
          </div>
        </a-col>
        <a-col>
          <div @click="changeSize('middle')" class="btn">
            <a-avatar shape="square">中</a-avatar>
            <div>中图标</div>
          </div>
        </a-col>
        <a-col>
          <div @click="changeSize('small')" class="btn">
            <a-avatar shape="square">小</a-avatar>
            <div>小图标</div>
          </div>
        </a-col>
      </a-row>
    </div>
    <div class="line">
      设置组宽度：
      <a-input-number style="width:130px" :min="1" step="1" addon-before="列数" v-model:value="currentGrid.cols"
        :defalut-value="2"></a-input-number>
    </div>
  </a-drawer>
  <a-drawer title="导入方案" placement="right" :closable="true" v-model:visible="importMenuJsonVisible" @close="onClose">
    <div class="line">
      导入的方案将被添加到最前面，您可以使用编辑布局自行调整位置。
    </div>
    <div class="line">
      方案代码：
    </div>
    <div class="line">
      <a-textarea placeholder="在此处粘贴分享代码，点击导入分享代码即可完成导入。" style="width: 100%;height: 22em"
        v-model:value="importJsonTxt"></a-textarea>
    </div>
    <div class="line">
      <a-button :disabled="this.importJsonTxt === ''" class="mr-5" type="primary" @click="importCode" style="background: var(--primary-bg);color: var(--primary-text);">导入分享代码
      </a-button>
      <a-button @click="importFile"  style="background: var(--primary-bg);color: var(--primary-text);">导入文件</a-button>
    </div>

  </a-drawer>
  <a-drawer :title="null" placement="bottom" :closable="true" v-model:visible="menuVisible" @close="onClose">
    <div style="display: none">
      <Widget :uniqueKey="newItem.id" :title="newItem.title" :showDelete="true" :resizable="true">
        <DeckItem :id="newItem.id" :item="newItem"></DeckItem>
      </Widget>
    </div>
    <a-row :gutter="20">
      <a-col v-if="menuType === 'grid'">
        <div @click="add()" class="btn">
          <Icon style="font-size: 3em" icon="tianjia1"></Icon>
          <div>添加按钮</div>
        </div>
      </a-col>
      <a-col v-if="menuType === 'item'">
        <div @click="edit()" class="btn">
          <Icon style="font-size: 3em" icon="shenqing"></Icon>
          <div>编辑按钮</div>
        </div>
      </a-col>
      <a-col v-if="menuType === 'item'">
        <div @click="clone()" class="btn">
          <Icon style="font-size: 3em" icon="fuzhi"></Icon>
          <div>复制按钮</div>
        </div>
      </a-col>
      <a-col v-if="menuType === 'item'">
        <div @click="remove()" class="btn">
          <Icon style="font-size: 3em" icon="shanchu"></Icon>
          <div>删除按钮</div>
        </div>
      </a-col>

      <a-col>
        <div @click="addBoard" class="btn relative">
          <Icon style="font-size: 3em" icon="tianjiawenjianjia"></Icon>
          <div v-if="superiorLimit <= grids.length">已达上限</div>
          <div v-else>添加分组</div>
          <div class="absolute inset-0" style="border-radius: 6px;background: rgba(42, 42, 42, 0.6)"
            v-show="superiorLimit <= grids.length" @click.stop="limitTip"></div>
          <GradeSmallTip powerType="quickInstructions" ref="smallTip"></GradeSmallTip>
        </div>
      </a-col>
      <a-col v-if="menuType === 'grid'">
        <div @click="toggleEditGrid()" class="btn">
          <Icon style="font-size: 3em" icon="shenqing"></Icon>
          <div>编辑分组</div>
        </div>
      </a-col>
      <a-col v-if="menuType === 'grid'">
        <div @click="removeGrid(this.currentGridId)" class="btn">
          <Icon style="font-size: 3em" icon="shanchu"></Icon>
          <div>删除分组</div>
        </div>
      </a-col>
<!--      <a-col>-->
<!--        <div class="btn">-->
<!--          <Icon style="font-size: 3em" icon="shezhi"></Icon>-->
<!--          <div>设置</div>-->
<!--        </div>-->
<!--      </a-col>-->


    </a-row>
    <a-row style="margin-top: 1em" :gutter="[20, 20]">
      <a-col>
        <div @click="toggleEditing" class="btn">
          <Icon v-if="!this.editing" style="font-size: 3em" icon="bofang"></Icon>
          <Icon v-else style="font-size: 3em;color: orange" icon="tingzhi"></Icon>
          <div><span v-if="!this.editing">调整布局</span><span v-else style="color: orange">停止调整</span></div>
        </div>
      </a-col>
      <a-col>
        <div class="btn" @click="toggleSharing">
          <Icon style="font-size: 3em" icon="fenxiang"></Icon>
          <div>分享方案</div>
        </div>

      </a-col>
      <a-col>
        <div class="btn" @click="toggleImport">
          <Icon style="font-size: 3em" icon="daoru"></Icon>
          <div>导入方案</div>
        </div>

      </a-col>
      <a-col>
        <div class="btn" @click="clean">
          <Icon style="font-size: 3em" icon="shanchu"></Icon>
          <div>清空</div>
        </div>

      </a-col>

    </a-row>

  </a-drawer>
<!--  <a-modal :key="addKey" v-model:visible="visibleAdd" :title="null" width="800px" centered height="500px"-->
<!--    wrap-class-name="lg-modal" :footer="null">-->
<!--    <DeckAdd :data="this.currentItem" @add="doAdd"></DeckAdd>-->
<!--  </a-modal>-->

  <Prompt @cancel="this.visiblePromptTitle = false" content="请输入分组标题" title="编辑组标题" placeholder="输入标题"
    :visible="visiblePromptTitle" @change-value="changeTitle"></Prompt>
</template>

<script>
import DeckItem from '../../components/muuri/DeckItem.vue'
import { appStore } from '../../store'
import { mapWritableState, mapActions } from 'pinia'
import Template from '../../../user/pages/Template.vue'
import DeckAdd from './DeckAdd.vue'
import { message } from 'ant-design-vue'
import { deckStore } from './store'
import Widget from '../../components/muuri/Widget.vue'
import vuuri from '../../components/vuuri/Vuuri.vue'
import Prompt from '../../components/comp/Prompt.vue'
import { Modal } from 'ant-design-vue'
import BackBtn from '../../components/comp/BackBtn.vue'
import { LeftSquareOutlined, RightSquareOutlined, PlusOutlined } from '@ant-design/icons-vue'
import GradeSmallTip from "../../components/GradeSmallTip.vue";
import { powerState } from '../../js/watch/grade'
import _ from 'lodash-es'
import {completeTask} from "../task/page/branch/task.ts"
import { isWin } from '../../js/common/screenUtils'
import { Icon as Iconify} from '@iconify/vue';

export default {
  name: 'Deck',
  components: {
    BackBtn,
    Prompt,
    DeckAdd,
    Template,
    DeckItem,
    Widget: Widget,
    vuuri,
    LeftSquareOutlined, RightSquareOutlined, PlusOutlined,
    GradeSmallTip,
    Iconify
  },
  data() {
    return {
      //分享相关的组
      selectedGridIds: {},//分享选中的组
      sharing: false,//分享状态
      shareTo: 'json',//json file com
      shareMenuComVisible: false,//显示分享抽屉菜单
      shareMenuJsonVisible: false,
      importMenuJsonVisible: false,//导入功能
      importJsonTxt: '',//导入的json文本
      shareData: {},

      key: Date.now(),

      editGridVisible: false,

      addKey: Date.now(),
      editGrid: null,
      visiblePromptTitle: false,
      displayGrids: [],
      scrollbarSettings: {
        useBothWheelAxes: true,
        swipeEasing: true,
        suppressScrollY: true,
        suppressScrollX: false,
        wheelPropagation: true
      },
      newItem: {
        icon: '',
        cover: '',
        title: '微信'
      },
      menuType: '',//菜单类型

      currentGridId: -1,//当前菜单选中的grid
      currentGrid: {},

      currentItemId: -1,//当前菜单的item
      currentItem: {},

      cloneMap: [],
      menuVisible: false,
      visibleAdd: false,
      superiorLimit: 10
    }
  },
  computed: {
    ...mapWritableState(appStore, ['fullScreen']),
    ...mapWritableState(deckStore, ['grids', 'editing', 'settings']),
    selectedGrids() {
      let selectedIds = Object.keys(this.selectedGridIds).filter(key => {
        return this.selectedGridIds[key]
      })
      return this.grids.filter(g => {
        return selectedIds.indexOf(String(g.id)) > -1
      })
    }
  },
  mounted() {
    const { superiorLimit } = this.powerState('quickInstructions', lv)
    this.superiorLimit = superiorLimit
    //进来之后就把存储的部分和初始化部分完全脱钩，这样，可以随意变更按钮，并即时存储，而不会影响到我们界面上的部分。
    //this.displayGrids=_.cloneDeep(this.grids)
    //window.gridsSave=_.cloneDeep(this.grids)
    // this.decks.forEach(board => {
    //   this.initBoard(board)
    // })
  },
  methods: {
    isWin,
    powerState,
    limitTip() {
      this.$refs.smallTip.clickTip()
      this.$refs.smallTip.limitFlag = true
    },
    toggleEditGrid() {
      if (!this.currentGrid.cols) {
        this.currentGrid.cols = 2
      }
      this.editGridVisible = true
    },
    getWidth(col) {
      if (!col) {
        col = 2
      }
      return col * 90 + 25 + 'px'

    },
    getVuuriWidth(col) {
      if (!col) {
        col = 2
      }
      return col * 90 + 10 + 'px'

    },
    ...mapActions(deckStore, ['initGrids']),
    importCode() {
      if (this.importJsonTxt === '') {
        message.error('请粘贴分享代码后导入。')
        return
      }
      let needImportGrids = []
      try {
        needImportGrids = JSON.parse(this.importJsonTxt)

        needImportGrids.forEach(g => {
          g.id = window.$models.nanoid.nanoid(8)
          this.grids.unshift(g)
        })
        this.toggleImport()
        message.success('为您成功导入' + needImportGrids.length + '个方案分组。')
      } catch (e) {
        console.warn(e)
        message.error('导入失败，请检查代码。')
      }

    },
    async importFile() {
      let openPath = await tsbApi.dialog.showOpenDialog({
        title: '选择导入的代码',
        filters: [{ name: 'deck存档', extensions: ['deck'] }],
      })
      if (!openPath) {
        return
      }
      this.importJsonTxt = require('fs').readFileSync(openPath[0], 'utf-8')
    },
    copyCode() {
      require('electron').clipboard.writeText(this.getShareJson())
      this.toggleSharing()
      this.shareMenuJsonVisible = false
      message.success('已为您复制到剪切板，赶紧去分享给其他小伙伴吧！')
    },
    async saveFile() {
      let savePath = await tsbApi.dialog.showSaveDialog({
        title: '选择保存位置',
        defaultPath: '我的分享.deck',
        message: '选择保存分享代码位置',
        filters: [{ name: 'deck存档', extensions: ['deck'] }],
        properties: [
          'createDirectory',
          'showOverwriteConfirmation'
        ]
      })
      const fs = require('fs')
      if (!savePath) {
        return
      }
      fs.writeFile(savePath, this.getShareJson(), (err) => {
        if (!err) {
          message.success('导出成功。为您的分享精神点赞！')
          require('electron').shell.showItemInFolder(savePath)
          this.toggleSharing()
          this.shareMenuJsonVisible = false
          return
        } else {
          message.error('导出失败，请确认文件权限。')
        }
      })
    },
    ensureShare() {
      if (this.selectedGrids.length === 0) {
        message.error('您至少选择一个组。')
        return
      }
      if (this.shareTo === 'com') {
        this.shareMenuComVisible = true
      } else {
        this.shareMenuJsonVisible = true
      }
    },
    getShareJson() {
      return JSON.stringify(this.selectedGrids)
    },
    clean() {
      Modal.confirm({
        centered: true,
        content: '是否删除全部指令？此操作不可还原。',
        okText: '清空',
        onOk: () => {
          this.grids = []
        }
      })
    },
    toggleImport() {
      this.importJsonTxt = ''
      this.importMenuJsonVisible = !this.importMenuJsonVisible
    },
    toggleSharing() {
      if (this.editing) {
        //互斥
        this.toggleEditing()
      }
      this.selectedGridIds = {}
      this.sharing = !this.sharing
      this.fullScreen = this.sharing
      this.menuVisible = false
    },
    toggleEditing() {
      if (this.sharing) {
        //互斥
        this.toggleSharing()
      }
      this.editing = !this.editing
      if (this.editing) {
        message.info('您可以直接拖拽图标调整位置，支持跨组调整')
      } else {
        message.info('已关闭拖拽调整')
      }
      this.menuVisible = false
      this.key = Date.now()
    },
    /**
     * 移动分组
     * @param step
     * @param index
     */
    moveGrid(step, index) {
      let tmp = this.grids[index]
      this.grids.splice(index, 1)
      if (step === -1) {
        this.grids.splice(index + step, 0, tmp)
      } else {
        this.grids.splice(index + 1, 0, tmp)
      }
    },
    showEditTitle(grid) {
      this.visiblePromptTitle = true
      this.editGrid = grid
    },
    changeTitle(title) {
      if (title.value.length > 0) {
        this.editGrid.title = title.value
        this.visiblePromptTitle = false
      } else {
        message.error('请输入分组标题')
      }

    },
    changeSize(size) {
      this.settings.iconSize = size
      this.menuVisible = false
      Object.keys(this.$refs).forEach(key => {
        this.$refs[key][0].update()
      })

    },
    /**
     * 手动刷新全部Grids
     */
    updateAllGrids() {
      Object.keys(this.$refs).forEach(key => {
        this.$refs[key][0].update()
      })
    },
    getIconSize() {
      let width = 80
      switch (this.settings.iconSize) {
        case 'small':
          width = 40
          break
        case 'middle':
          width = 80
          break
        case 'large':
          width = 160
          break
        default:
          width = 80
      }
      return width + 'px'
    },

    onClose() {
      this.menuVisible = false
    },
    remove() {
      Modal.confirm({
        content: '确定删除按钮【' + this.currentItem.title + '】？此操作不可还原。请谨慎操作。',
        okText: '确认删除',
        onOk: () => {
          this.currentGrid.children.splice(this.currentGrid.children.findIndex(item => {
            return item.id === this.currentItemId
          }), 1)
          this.menuVisible = false
        }
      })

    },
    edit() {
      this.visibleAdd = true
      this.$router.push({
        name:'deckAdd',
        params:{
          gridId:this.currentGridId,
          id:this.currentItemId
        }
      })
    },
    clone() {
      let cloneItem = _.cloneDeep(this.currentItem)
      cloneItem.id = window.$models.nanoid.nanoid(8)
      this.currentGrid.children.unshift(cloneItem)
      this.menuVisible = false
      this.key += 1
      message.success('复制按钮成功')
    },
    add(currentGrid) {

      let params={}
      if(currentGrid){
        this.currentGrid=currentGrid
        this.currentItemId=currentGrid.id
      }
      if (this.currentGrid) {
        params.gridId = this.currentGrid.id
      }else{
        message.error('必须选择添加到的分组')
        return
      }
      // 支线任务点
      completeTask('Z0201')
      this.currentItem = undefined
      this.$router.push({
        name:'deckAdd',
        params:params
      })
    },
    showMenu(id, data={}, type = 'grid') {
      this.menuVisible = true
      if (type === 'grid') {
        this.menuType = 'grid'
        this.currentGridId = id
        this.currentGrid = this.grids.find(g => {
          return String(g.id) === String(id)
        })
      } else if (type === 'item') {
        this.menuType = 'item'
        this.currentItemId = id
        this.currentItem = data.item
        this.currentGrid = data.grid
        this.currentGridId = data.grid.id
      } else {
        this.menuType = 'wrapper'
      }
    },
    removeGrid(id) {
      Modal.confirm({
        content: '是否确认删除分组？此操作无法恢复。',
        okText: '确认删除',
        onOk: () => {
          let foundIndex = this.grids.findIndex(g => {
            return g.id === id
          })
          if (foundIndex > -1) {
            this.grids.splice(foundIndex, 1)
          }
          this.menuVisible = false
        }
      })

    },
    addBoard() {
      if (this.superiorLimit <= this.grids.length) {
        this.limitTip()
        return
      }
      let grid = {
        id: Date.now(),
        title: '新组',
        children: [],
        cols: 2
      }
      this.grids.push(grid)
      // this.$nextTick(() => {
      //   this.initBoard(board)
      // })
      this.menuVisible = false
    }
  }
}
</script>

<style scoped lang="scss">
.box {
  :deep(.ant-result-subtitle) {
    color: var(--primary-text);
  }

  :deep(.ant-result-title) {
    color: var(--primary-text);
  }
}

.ant-result-content {
  margin-top: 24px;
  padding: 15px;
  background-color: #fafafa;
  padding-bottom: 5px;
}

.grid {
  position: relative;
  width: 18em;
  display: inline-block;
  border: 5px solid transparent;
  border-radius: 8px;
  vertical-align: top;
  margin: 1em;
}


.btn {
  text-align: center;
}

:deep(.muuri-grid) {
  /* any styles to card on the muuri grid */
}

:deep(.muuri-item) {
  /* any styles to card on the item container */
  /* only to override positioning */
  margin: 5px;

  .muuri-item-content {
    /* card any markup you like */
  }

  &.muuri-item-dragging {}

  &.muuri-item-releasing {}

  &.muuri-item-hidden {}
}

.muuri-item-placeholder {
  /* shadow element behind the dragging element */
}
</style>
<style lang="scss">
.full-modal {
  .ant-modal {
    max-width: 100%;
    top: 0;
    padding-bottom: 0;
    margin: 0;
  }

  .ant-modal-content {
    display: flex;
    flex-direction: column;
    height: calc(100vh);
  }

  .ant-modal-body {
    flex: 1;
  }
}

.btn {
  min-width: 7em;

  div {
    line-height: 2;
  }
}

.sharing {
  padding: 4em;
  padding-top: 0em;
}
</style>
