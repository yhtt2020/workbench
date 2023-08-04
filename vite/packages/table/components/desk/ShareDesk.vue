<template>
  <a-drawer v-model:visible="showDrawer" @close="close" style="z-index:9999;" width="500" placement="right">
    <template #extra>
      <a-space>
        <div class="add-scheme" @click="addPlan">
          <a-spin v-if="posting"></a-spin>
          立即分享</div>
      </a-space>
    </template>
    <div class="title">选择分享桌面</div>
    <a-select v-model:value="deskId" @change="setSelectVal" style="height:48px; border:none;"
              :bordered="false" size="large" class="input rounded-lg  text-xs flex items-center"
              :dropdownStyle="{ 'z-index': 9999, backgroundColor: 'var(--secondary-bg)' }">
      <template #suffixIcon>
        <Icon icon="xiangyou" class="h-4 w-4" @click="delLabel(index)"></Icon>
      </template>
      <a-select-option v-for="(item,index) in deskList" :value="item.id">{{ item.name }}</a-select-option>
    </a-select>
    <div class="xt-bg-2 rounded-lg  px-3 py-2 mb-2 text-center">共 {{sharingDesk.cards.length}} 个组件  {{sharingDesk.layoutSize?.width}} * {{sharingDesk.layoutSize?.height}}</div>
    <div>
      <div class="title mb-2">桌面效果图
        <div class="float-right">
          <a-button style="border:none" class="mb-2 xt-active-bg rounded-full " @click="getPreview">
            {{ capture ? '重新获得效果图' : '自动获取效果图' }}
          </a-button>

        </div></div>
      <div class="mb-2 pl-3"> 请点击按钮获取桌面效果图</div>
      <a-image :preview="false" class="mb-2 rounded-lg" v-if="capture" :src="'file://'+capture"></a-image>

      <span class="title">桌面数据</span>
      <div style="font-size: 14px;" class="xt-text-2 mt-2 mb-4">
        选择是否需要保留你在小组件自定义编辑的设置或数据，比如「倒数日小组件」中的事件数据。
      </div>
      <RadioTab :navList="dataType" v-model:selectType="defaultType"></RadioTab>
      <div class="title mt-2">标题</div>
      <a-input v-model:value="shareName" spellcheck="false" class="input" placeholder="请输入"
               aria-placeholder="font-size: 16px;"/>
      <span class="title">简介</span>
      <a-textarea v-model:value="summary" spellcheck="false" class="input xt-text" placeholder="请输入"
                  aria-placeholder="font-size: 16px;" style="height: 100px;"/>
      <span class="title">分类</span>
      <a-select v-model:value="categoryId" style="height:48px;border:none;" :bordered="false" size="large"
                class="input rounded-lg  text-xs flex items-center"
                :dropdownStyle="{ 'z-index': 9999, backgroundColor: 'var(--secondary-bg)' }">
        <template #suffixIcon>
          <Icon icon="xiangyou" class="h-4 w-4" @click="delLabel(index)"></Icon>
        </template>
        <a-select-option v-for="(item,index) in categories" :key="item" :value="item.id">{{
            item.name
          }}
        </a-select-option>
      </a-select>

      <!-- <div class="flex justify-between items-center">
        <span class="title">隐私保护</span>
        <a-switch v-model:checked="secretSwitch" aria-checked="false"/>
      </div> -->
      <!-- <div style="font-size: 14px;" class="xt-text-2 mt-2 mb-4">你的隐私信息是否需要分享，例如便签等</div> -->
      <span class="title">标签</span>
      <div style="font-size: 14px;" class="xt-text-2 mt-2">最多添加四个标签</div>
      <div class="flex my-4">
        <a-input @keyup.enter="addLabel" v-model:value="labelVal" spellcheck="false" class="input"
                 style="width:340px;margin:0" placeholder="请输入" aria-placeholder="font-size: 16px;"/>
        <div class="add-label" @click="addLabel">添加</div>
      </div>
      <div v-if="tagList.length" class="flex">
        <div v-for="(item,index) in tagList" :key="index" class="label-item">
          <span class="mr-2">{{ item }}</span>
          <Icon icon="guanbi1" class="h-4 w-4" @click="delLabel(index)"></Icon>
        </div>
      </div>
    </div>
  </a-drawer>
  <!-- 分享成功的模态框和发布抽屉 -->
  <ShareModal :shareModal="shareModal" :shareName="shareName" @closeShare="closeShare"></ShareModal>
</template>

<script>
import { mapActions, mapWritableState } from 'pinia'
import { deskStore } from '../../store/desk'
import { message } from 'ant-design-vue'
import ShareModal from '../ShareModal.vue'
import { cardStore } from '../../store/card'
import { nanoid } from 'nanoid'
import RadioTab from '../RadioTab.vue'
import { marketStore } from '../../store/market'
import { getCurrentInstance } from 'vue'
import { fileUpload, pathUpload } from '../card/hooks/imageProcessing'

export default {
  name: 'ShareDesk',
  components: {
    ShareModal,
    RadioTab
  },
  data () {
    return {
      posting:false,//正在上传中
      capture: '',
      showDrawer: false,
      deskId: '',
      deskType: [],
      assort: '',
      assortList: [],
      labelVal: '',
      tagList: [],//标签列表
      scheme: {},
      shareModal: false,
      shareName: '',
      summary: '',//简介

      secretSwitch: true,
      dataType: [
        { title: '保留数据', name: 'data' },
        { title: '不保留数据', name: 'notData' }
      ],
      defaultType: { title: '不保留数据', name: 'notData' },
      sharingDesk: [],
      categoryId: 0,
      categories: [],
      layoutSize:{width:0,height:0},//当前桌面的尺寸
      shareFullLayoutSize:{width:0,height:0},
    }
  },
  props: {
    deskList:{
      type:Array
    },
    openDrawer: {
      type: Boolean,
      default: () => false
    },
    deskRef: {
      type: Object
    }
  },
  computed: {
    // ...mapWritableState(deskStore,['deskList','deskSize']),
    ...mapWritableState(deskStore, ['apiList']),
    ...mapWritableState(cardStore, [ 'settings', 'deskSize', 'countdownDay']),
  },
  watch: {
    openDrawer (newV) {
      this.showDrawer = newV
      if (this.showDrawer) {
        this.assortList = this.apiList.map(item => item.cname)
        this.assortList.unshift('请选择')
        this.assort = this.assortList[0]

        this.deskType = this.deskList.map(item => item.name)
        this.secretSwitch = true
      }
    },
  },
  async mounted () {
    let cats = await this.getCategories()

    this.categories = cats
    if (cats.length > 0) {
      this.categoryId = cats[0].id
    }
    this.update()
    this.setSelectVal(this.deskId)
  },
  methods: {
    ...mapActions(deskStore, ['setDeskList']),
    ...mapActions(marketStore, ['getCategories', 'addDesk']),

    update () {
      this.deskId = this.$parent.currentDeskId
    },
    getPreview () {
      return new Promise(resolve => {
        this.close()
        setTimeout(async () => {
          const parent = this.$parent
          console.log(parent)
          parent.setCurrentDeskId(this.deskId)
          setTimeout(() => {
            parent.setFullScreen(true)
            setTimeout(async () => {
              let capture = await tsbApi.window.getCapture()
              this.shareFullLayoutSize=parent.$refs.currentDeskRef.getLayoutSize()
              this.shareFullCardZoom=parent.$refs.currentDeskRef.getAdjustZoom()
              console.log('获得全屏状态下的尺寸',this.shareFullLayoutSize,this.shareFullCardZoom)
              this.capture = capture
              setTimeout(() => {
                parent.setFullScreen(false)
                setTimeout(() => {
                  parent.shareDesk()
                  resolve()
                }, 500)
              }, 300)
            }, 500)
          }, 200)
          //拍摄截图
        }, 500)
      })
    },
    close () {
      this.$emit('closeShare', false)
      this.setInitialData()
    },
    addLabel () {
      if (this.tagList.length >= 4) return message.info('最多添加四个')
      if (this.tagList.includes(this.labelVal.trim())) return message.info('不可添加重复标签')
      if (this.labelVal.trim()) {
        this.tagList.push(this.labelVal.trim())
        this.labelVal = ''
      }
    },
    delLabel (index) {
      this.tagList.splice(index, 1)
    },
    async addPlan () {
      if (this.shareName.trim() === '') return message.info('请输入新桌面名称')
      if (this.shareName.length >= 16) return message.error('新桌面名称长度不可超过16')
      if (!this.categoryId) return message.info('请选择分类')
      //上传图片
      await this.getPreview()
      let cover= await pathUpload(this.capture)
      let cloneDesk = JSON.parse(JSON.stringify(this.sharingDesk))
      cloneDesk.cards.forEach((item, index) => {
        // switch (item.name) {
        //   case 'notes':
        //     if (item.customData) {
        //       item.customData.text = ''
        //     }
        //     break
        //   case 'countdownDay':
        //     item.customData.notRetain = true
        //     break
        // }
        item.customData={}
      })

      let settings = {}
      if (cloneDesk.settings?.enableZoom) {
        settings = cloneDesk.settings
      } else {
        settings = this.settings
      }


      settings.cardZoom=Number(settings.cardZoom)*Number(this.shareFullCardZoom)
      settings.cardMargin=Number(settings.cardMargin)*Number(this.shareFullCardZoom)
      console.log('需要分享的settings',settings)
      const template=JSON.stringify({
        cards: this.defaultType.name === 'notData' ? cloneDesk.cards :this.sharingDesk.cards,
        settings:settings,
      })
      this.scheme = {
        cover:cover,
        categoryId:this.categoryId,
        title: this.shareName,
        introduceText:'',
        summary: this.summary,
        tags:this.tagList.length===0?'':this.tagList.join(','),
        sort:1,
        direction:'h',
        layoutSize:JSON.stringify(this.shareFullLayoutSize),
        template:template,
      }
      let desk=await  this.addDesk(this.scheme)
      this.posting=false
      if(desk){
        this.close()
        this.shareModal = true
        this.setInitialData()
      }else{
        message.error('上传失败。')
      }

    },
    setInitialData () {
      this.desk = this.deskType[0]
      this.blurb = ''
      this.tagList = []
      this.secretSwitch = true
      this.defaultType = { title: '不保留数据', icon: 'yuanquan', name: 'notData' }
    },
    closeShare (val) {
      this.shareModal = val
    },
    setSelectVal (id) {
      this.deskList.forEach(desk => {
        if (desk.id === id) {
          console.log(desk)
          this.sharingDesk = desk
          this.shareName = desk.name
          const parent = this.$parent
          parent.setCurrentDeskId(desk.id)
        }
      })
    }
  },
}
</script>

<style lang="scss" scoped>
.title {
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

.add-scheme {
  background: var(--active-bg);
  border-radius: 12px;
  width: 128px;
  height: 48px;
  display: flex;
  justify-content: center;
  align-items: center;
  color: var(--primary-text);
  font-size: 16px;
  cursor: pointer;
}

.add-label {
  width: 100px;
  height: 48px;
  border-radius: 12px;
  display: flex;
  justify-content: center;
  align-items: center;
  color: var(--primary-text);
  background: var(--secondary-bg);
  margin-left: 12px;
  font-size: 16px;
}

.label-item {
  background: rgba(255, 255, 255, 0.20);
  border-radius: 4px;
  height: 32px;
  color: var(--secondary-text);
  padding: 0 8px;
  display: flex;
  align-items: center;
  margin-right: 12px;
}
</style>
