<template>
  <xt-modal v-model="shareResultVisible"  custom
            boxClass="rounded-xl"
            :mask="true"
            :index="850">
    <div style="width: 560px" class="p-4">
      <h2 style="text-align: center" class="mb-3">分享成功</h2>
      <p>快点复制分享链接吧。</p>
      <div class="flex mb-2">
        <div   style="width:400px" class="xt-modal xt-b  mr-2 rounded-md p-1 pointer" @click="openLink(getShareLink())" >{{getShareLink()}}</div> <xt-button @click="copyToClipboard(getShareLink())">复制</xt-button>
      </div>
      <div class="flex mb-2" v-if="needPwd">
      <div   style="width:400px" class="xt-modal xt-b  mr-2 rounded-md p-1 pointer" @click="openLink(getShareLink(true))" >{{getShareLink(true)}}</div> <xt-button @click="copyToClipboard(getShareLink(true))">复制</xt-button>
      </div>
      <div class="flex mb-2">
      <div  style="width:400px"  class="xt-modal xt-b  mr-2 rounded-md p-1 pointer" @click="openLink(getShareWords())">{{getShareWords()}}</div> <xt-button @click="copyToClipboard(getShareWords())">复制</xt-button>
      </div>
      <div class="flex flex-col items-center justify-center mt-6">
        <xt-button @click="shareResultVisible=false" type="theme">关闭</xt-button>
      </div>
    </div>


  </xt-modal>

  <xt-modal v-model="chooseShareTargetVisible"
            custom
            boxClass="rounded-xl"
            :mask="true"
            :index="850">
    <div style="width:auto;" class="p-4">
      <h2 style="text-align: center" class="mb-3">选择分享类型</h2>
      <div class="share-mode mt-3">
        <div :class="{active:target=='market'}" @click="target='market'">
          <h3>1.上架到桌面市场</h3>
          <p>所有用户都可以通过桌面市场下载和使用这个桌面。</p>
        </div>
        <div :class="{active:target=='public'}" @click="target='public'">
          <h3>2.公开到互联网</h3>
          <p>创建一个公开的链接，任何人都可以通过链接地址查看桌面。也可以设置密码，只有获得密码的用户可查看。</p>
        </div>
        <!--        <div :class="{active:target=='user'}" @click="target='user'">-->
        <!--          <h3>3.分享给好友</h3>-->
        <!--          <p>创建一个限部分用户访问的链接。其他人即使获得链接也无法查看。</p>-->
        <!--        </div>-->
        <!--        <div :class="{active:target=='community'}" @click="target='community'">-->
        <!--          <h3>4.分享到社群</h3>-->
        <!--          <p>将当前桌面转换为社群桌面供社群内的成员查看，部分组件可能无效。</p>-->
        <!--        </div>-->
      </div>
    </div>

    <div class="flex p-4 pt-3 gap-2">
      <xt-button style="flex:1" @click="showMy">查看我的分享</xt-button>
      <xt-button style="flex:2" type="theme" @click="showShare">确认分享</xt-button>

    </div>

  </xt-modal>

  <xt-modal v-model="shareToPublic"
            custom
            boxClass="rounded-xl"
            :mask="true"
            :index="850">
    <div style="width:auto;width:450px" class="p-4">
      <h2 style="text-align: center" class="mb-3">分享到互联网</h2>
      <div class="line-title">链接密码及有效期</div>
      <div class="option-block p-2 mt-2 rounded-md">
        <xt-option-info
          title="启用密码"
          info="启用密码后，用户打开此分享桌面需要输入密码。"
          class="pb-3"
          isSwitch
          v-model:switch="needPwd"
        />
        <div class="flex gap-2 items-center flex-row-reverse" v-if="needPwd">
          <xt-button :w="90" :h='30' type="theme" @click="resetPwd">重置密码</xt-button>
          <xt-button :w="60" :h='30' type="default" style="border:1px solid var(--secondary-text)"
                     @click="copyToClipboard">复制
          </xt-button>

          <xt-input maxlength="6" style="width:100px" v-model="sharePwd" class="xt-modal xt-b  "></xt-input>
          <div>密码</div>
        </div>
      </div>
      <div class="option-block p-2 mt-2 rounded-md">
        <xt-option-info
          title="有效期"
          info="不设置则永久有效。设置有效期后，此链接过期将不再可被访问。"
          class="pb-3"
          isSwitch
          v-model:switch="needExpireTime"
        />
        <div v-if="needExpireTime">
          <xt-select
            h="40"
            :zIndex="99999999"
            v-model="expireTime"
            :list="expireTimes"
            class="xt-bg-t-2"
          ></xt-select>
          <div class="mt-2">
            <a-date-picker value-format="YYYY-MM-DD" v-if="expireTime=='custom'" v-model:value="customExpireTime"
                           :bordered="false"/>
            <span class="xt-text-2" style="color:orangered" v-if='realExpireTime!=="永不过期"'> {{ realExpireTime }} 00:00 前有效</span>
          </div>
        </div>


      </div>
    </div>
    <div class="p-2 flex gap-2 flex-row-reverse">
      <xt-button type="default" @click="shareToPublic=false">取消</xt-button>
      <xt-button type="theme" @click="doShareToPublic">确定</xt-button>
    </div>

  </xt-modal>

  <a-drawer v-if="showDrawer" v-model:visible="showDrawer" @close="close" style="z-index:9999;" width="500"
            placement="right">
    <template #extra>
      <a-space>
        <div class="add-scheme" @click="addPlan">
          <a-spin v-if="posting"></a-spin>
          立即分享
        </div>
      </a-space>
    </template>
    <div class="title">选择分享桌面</div>
    <a-select v-model:value="deskId" @change="setSelectVal" style="height:48px; border:none;margin-bottom: 10px"
              :bordered="false" size="large" class="input rounded-lg  text-xs flex items-center "
              :dropdownStyle="{ 'z-index': 9999, backgroundColor: 'var(--secondary-bg)' }">
      <template #suffixIcon>
        <Icon icon="xiangyou" class="h-4 w-4" @click="delLabel(index)"></Icon>
      </template>
      <a-select-option v-for="(item,index) in deskList" :value="item.id">{{ item.name }}</a-select-option>
    </a-select>
    <div class="text-center">
      <div class="xt-bg-2 rounded-lg  px-3 py-2 mb-4 text-center w-auto " style="display: inline-block">共
        {{ sharingDesk.cards.length }} 个组件 {{ sharingDesk.layoutSize?.width }} * {{ sharingDesk.layoutSize?.height }}
      </div>
    </div>
    <div>
      <div class="title mb-2">桌面效果图

      </div>
      <div class="line">
        <a-image :preview="false" class="mb-2 rounded-lg" v-if="capture"
                 :src="capture + '?imageMogr2/crop/160x90/gravity/center'"></a-image>
        <div v-if="isWeb">
          <input type="file" style="display:none;" ref="uploadRef" @change="getFileInfo($event)"/>
          <div v-if="!capture" class="flex items-center justify-center pointer" @click="updateGroupAvatar()"
               style="width: 160px;height: 90px;background: var(--secondary-bg);border: 1px dashed rgba(255,255,255,0.1);border-radius: 6px;">
            <Icon icon="fluent:add-16-filled" width="20" height="20"/>
          </div>
          <div class="mt-4" style="font-size: 14px;color: var(--secondary-text)">推荐比例：16:9，最大不超过5MB</div>
          <a-progress v-if="percent !== 0 && percent != 100" :percent="percent"/>
        </div>
        <div class="float-right" v-else>
          <xt-button style="border:none" class="mb-2 xt-active-bg rounded-full " @click="getPreview">
            {{ capture ? '重新获得效果图' : '自动获取效果图' }}
          </xt-button>

        </div>
      </div>


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

import { completeTask } from '../../apps/task/task'
import { Icon } from '@iconify/vue'
import { usePlat } from '../../permission/usePlat'
import { formatTime, formatTimestamp } from '../../util'
import shareHelper from '../../js/lib/shareHelper'
import {Server} from '../../consts'

export default {
  name: 'ShareDesk',
  components: {
    Icon,
    ShareModal,
    RadioTab
  },
  data () {
    return {
      //分享到互联网
      sharePwd: '',
      expireTimes: [
        { value: '7day', name: '7天' },
        { value: '30day', name: '30天' },
        { value: 'never', name: '永不过期' },
        { value: 'custom', name: '自定义' },
      ],
      expireTime: 'never',
      customExpireTime: '',
      needPwd: false,//需要密码
      needExpireTime: false,//设置截止时间

      shareResultVisible:false,//分享结果展示
      shareData:{},

      chooseShareTargetVisible: false,
      shareToPublic: false,
      target: 'market',
      percent: 0,
      isWeb: !usePlat('client'),
      oldSet: this.settings, // 原先设置
      posting: false,//正在上传中
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
      layoutSize: { width: 0, height: 0 },//当前桌面的尺寸
      shareFullLayoutSize: { width: 0, height: 0 },
      openDrawer: false,
      capturing: false//正在抓图

    }
  },
  props: {
    deskList: {
      type: Array
    },
    deskRef: {
      type: Object
    }
  },
  computed: {
    // ...mapWritableState(deskStore,['deskList','deskSize']),
    ...mapWritableState(deskStore, ['apiList']),
    ...mapWritableState(cardStore, ['settings', 'deskSize', 'countdownDay']),
    realExpireTime () {
      if (this.expireTime === 'custom') {
        if (!this.customExpireTime) {
          return '永不过期'
        } else {
          return this.customExpireTime
        }
      } else {
        let timeSpan = 0
        if (this.expireTime === '7day') {
          timeSpan = 7 * 24 * 60 * 60 * 1000
        } else if (this.expireTime === '30day') {
          timeSpan = 30 * 24 * 60 * 60 * 1000
        }
        if (timeSpan > 0) {
          return formatTimestamp(Date.now() + timeSpan)
        } else {
          return '永不过期'
        }
      }
    }
  },
  watch: {

    'needPwd': {
      handler (newVal) {
        if (!this.sharePwd && newVal) {
          this.resetPwd()
        }
      }
    },

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
    this.getCategories('desk').then(cats => {
      this.categories = cats
      if (cats?.length > 0) {
        this.categoryId = cats[0].id
      }
      this.update()
      this.setSelectVal(this.deskId)
    })
  },

  methods: {
    ...mapActions(deskStore, ['setDeskList']),
    ...mapActions(marketStore, ['getCategories', 'addDesk']),
    showMy(){
      this.$router.push({name:'shareRecord'})
    },
    showShare () {
      this.chooseShareTargetVisible = false
      if (this.target === 'market') {
        this.openDrawer = true
      } else if (this.target === 'public') {
        this.shareToPublic = true
      }
    },
    copyToClipboard (str) {
      //浏览器复制文本到剪切板
      if(!str){
        str=this.sharePwd
      }
      const input = document.createElement('input')
      input.setAttribute('readonly', 'readonly')
      input.setAttribute('value',str )
      document.body.appendChild(input)
      input.select()
      document.execCommand('copy')
      document.body.removeChild(input)
      message.success('复制成功')
    },
    resetPwd () {
      this.sharePwd = nanoid(6)
    },
    getShareLink(pwd=false){
      let baseUrl=window.location.origin
      if(usePlat('client')){
        baseUrl=Server.webUrl
      }
      if(this.needPwd && pwd){
        return `${baseUrl}/s/${this.shareData.code}/${this.sharePwd}`
      }else{
        return `${baseUrl}/s/${this.shareData.code}`
      }
    },
    openLink(url){
      browser.openInSystem(url)
    },
    getShareWords(){
      return '我给您分享了一个导航桌面，快来看看吧，链接地址是：'+this.getShareLink(true)
    },
    parseTime () {
      let timeStr = this.realExpireTime
      console.log(this.realExpireTime,(new Date(timeStr)).toString())
      if (timeStr === '永不过期') {
        return 0
      } else {
        return Date.parse((new Date(timeStr+' 00:00')).toString())
      }
    },
    async doShareToPublic () {

      let pwd=this.needPwd?this.sharePwd:''
      let rs = await shareHelper.create('','',pwd, this.parseTime(), 'desk', this.getShareDeskData(false))
      if(rs?.status){
        message.success('分享成功')
        this.shareToPublic = false
        this.shareData=rs?.data
        this.shareResultVisible=true
        //显示分享结果界面
      }else{
        message.error('分享失败，失败原因：'+rs?.info)

      }
      console.log(rs, '分享结果')
      //todo check输入合法性
    },
    update () {
      this.deskId = this.$parent.currentDeskId
    },
    showShareType () {
      this.chooseShareTargetVisible = true
    },
    updateGroupAvatar () {
      this.$refs.uploadRef.click()

    },
    async getFileInfo (evt) {
      let timer = setInterval(() => {
        this.percent += 1
        if (this.percent === 99) {
          clearInterval(timer)
          timer = null
        }
      }, 50)
      const files = evt.target.files[0]
      await fileUpload(files).then(res => {
        // 上传结束后自动完成 并清空
        this.percent = 0
        clearInterval(timer)
        timer = null
        this.capture = res
      })
    },
    getPreview () {
      this.capturing = true
      return new Promise(resolve => {
        this.close()
        setTimeout(async () => {
          const parent = this.$parent
          parent.setCurrentDeskId(this.deskId)
          setTimeout(() => {
            parent.setFullScreen(true)
            setTimeout(async () => {
              if (this.isWeb) {
                resolve()
                return
              }
              let capture = await tsbApi.window.getCapture()
              this.shareFullLayoutSize = parent.$refs.currentDeskRef.getLayoutSize()
              this.shareFullCardZoom = parent.$refs.currentDeskRef.getAdjustZoom()
              this.capture = capture
              setTimeout(() => {
                parent.setFullScreen(false)
                setTimeout(() => {
                  parent.shareDesk()
                  this.capturing = false
                  resolve()
                }, 500)
              }, 300)
            }, 1000)//切换到全屏
          }, 200)
          //拍摄截图
        }, 500)
      })
    },
    close () {
      this.openDrawer = false
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
    getShareDeskData (removeData=true) {
      let cloneDesk = JSON.parse(JSON.stringify(this.sharingDesk))
      if (removeData) {
        //如果选择不保留数据，则进行清理，此处要对不同的组件进行不同的清理数据处理，不能一概而论
        cloneDesk.cards.forEach((item, index) => {
          if (item.name !== 'folder') {
            item.customData = {}
          }
        })
      }
      cloneDesk.cards.forEach((item, index) => {
        delete item._$muuri_id
      })

      let settings = {}
      if (cloneDesk.settings?.enableZoom) {
        settings = cloneDesk.settings
      } else {
        settings = this.settings
      }
      settings.cardZoom = Number(settings.cardZoom) * Number(this.shareFullCardZoom)
      settings.cardMargin = Number(settings.cardMargin) * Number(this.shareFullCardZoom)
      const template = JSON.stringify({
        cards: cloneDesk.cards,
        settings: settings,
        customData: {}
      })
      return template
    },
    async addPlan () {
      if (this.shareName.trim() === '') return message.info('请输入新桌面名称')
      if (this.shareName.length >= 16) return message.error('新桌面名称长度不可超过16')
      if (!this.categoryId) return message.info('请选择分类')
      if (!this.sharingDesk.cards.length) {
        return message.info('不可分享空白桌面。')
      }

      let cover = ''
      if (this.isWeb) {
        cover = this.capture
      } else {
        //上传图片
        await this.getPreview()
        cover = await pathUpload(this.capture)
      }
      const template = this.getShareDeskData(this.defaultType.name === 'notData')

      this.scheme = {
        cover: cover,
        categoryId: this.categoryId,
        title: this.shareName,
        introduceText: '',
        summary: this.summary,
        tags: this.tagList.length === 0 ? '' : this.tagList.join(','),
        sort: 1,
        direction: 'h',
        layoutSize: JSON.stringify(this.shareFullLayoutSize),
        template: template,
      }
      // return
      let desk = await this.addDesk(this.scheme)
      this.posting = false
      if (desk) {
        this.close()
        this.shareModal = true
        this.setInitialData()
        completeTask('Z0209')
      } else {
        message.error('上传失败。')
      }

      this.settings = this.oldSet
      console.log('this.oldSet :>> ', this.oldSet)
      console.log('      this.settings :>> ', this.settings)
    },
    setInitialData () {
      if (this.capturing) {
        return
      }
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
      this.deskList?.forEach(desk => {
        if (desk.id === id) {
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

.share-mode {
  display: flex;
  gap: 15px;

  & > div {
    background: var(--secondary-bg);
    padding: 10px;
    border-radius: 4px;
    border: 1px solid var(--border-color);
    width: 220px;

    &:hover, &.active {
      cursor: pointer;
      border-color: var(--active-bg);
      background: var(--active-bg);

      h3 {
        color: var(--active-text)
      }

      p {
        color: var(--active-text) opacity(.9)
      }
    }

    h3 {
      font-size: 18px;
      color: var(--primary-text);
    }

    p {
      color: var(--secondary-text)
    }
  }

}

.option-block {
  background: var(--secondary-bg);
}
</style>
