const wallpaperSelectorTpl = `
<div>
<img class="wallPaperFrame" :src="wallPaper" @click="showWallPaperSetting">
  <a-modal  :z-index="100000" style="" :visible="setWallPaperVisible" title="设置壁纸" :width="800"  :footer="null" @cancel="setWallPaperVisible=false;this.loadingWallPaperHistory=true">
      <template>
        <div>
          <a-alert style="margin-bottom: 10px"
            message="您可以在浏览器中【查看图片】时，【右键】-【设置图片为壁纸】。也可以选择下方壁纸快速设置。"
            type="info"
            closable
            show-icon
          ></a-alert>
          <a-tabs  default-active-key="history" tab-position="left">
<!--            <a-tab-pane key="search" tab="网络搜索" >-->

<!--            </a-tab-pane>-->

            <a-tab-pane key="history" tab="最近" >
              <div style="height: 600px;overflow-y: auto">

                <div v-if="wallPaperHistory.length!==0 && this.loadingWallPaperHistory===false" style=" padding: 20px;">
                  <a-row :gutter="24">
                    <a-col v-for="(wallPaper,wallPaperIndex) in wallPaperHistory" :span="8" style="margin-bottom: 10px">
                      <a-card @click="setWallPaper(wallPaper)" hoverable :bordered="false">
                        <img  class="wallPaperFrame" height="100"
                             slot="cover"
                             :src="wallPaper"
                        />
                      </a-card>
                    </a-col>
                  </a-row>
                </div>
                <a-spin  style="padding: 250px" v-if="this.loadingWallPaperHistory===true" size="large"></a-spin>
                <a-empty style="padding: 100px" description="暂无壁纸历史" v-if="wallPaperHistory.length===0"></a-empty>
              </div>
            </a-tab-pane>
            <a-tab-pane v-for="(type,typeIndex) in wallPapersList" :key="typeIndex" :tab="type.title">
              <div style="padding: 20px">
                <a-row :gutter="24">
                  <a-col v-for="(wallPaper,wallPaperIndex) in type.list" :span="8">
                    <a-card @click="setWallPaper(wallUrl+wallPaper.image)" hoverable :bordered="false">
                      <img class="wallPaperFrame" height="100"
                           slot="cover"
                           :alt="wallPaper.title"
                           :src="wallUrl+wallPaper.image"
                      />
                    </a-card>
                  </a-col>
                </a-row>
              </div>
            </a-tab-pane>
          </a-tabs>
        </div>
      </template>
    </a-modal>


</div>
  `
const wallList = require('../wall.json')
const { wallUrl } = require('../../util/theme.js')
const wallpaperSelector = Vue.component('wallpaper-selector', {
  template: wallpaperSelectorTpl,
  name: 'wallpaper-selector',
  props: {
    'value': String,
    'deskId': '',
    'defaultWallPaper':'',
  },
  components: {},
  data () {
    return {
      wallUrl: wallUrl,
      wallPapersList: wallList,
      setWallPaperVisible: false,
      loadingWallPaperHistory: false,
      wallPaperHistory: [],//壁纸历史

    }
  },
  watch: {
  },
  computed: {
    wallPaper(){
      if(!!!this.value){
        return this.defaultWallPaper
      }else{
        return this.value
      }
    }
  },
  mounted () {
    this.wallPaperHistory = wallPaper.getHistory()
  },
  methods: {

    showWallPaperSetting () {
      this.setWallPaperVisible = true
    },
    change () {
      // this.$emit('change', this.wallPaper)
    }
    , /**
     * 设置壁纸
     */
    setTheme () {
      setTimeout(() => {
        appVue.loadingWallPaperHistory = false
      }, 500)
      this.setThemeVisible = true
      this.visibleMainMenu = false
    },
    setWallPaper (wp) {
      if(!!!this.deskId){
        //设置默认背景
        //todo 处理有deskid的情况，只设置desk的桌面壁纸
        try {
          //保存壁纸设置
          wallPaper.setUrlWallPaper(wp).then(() => {
              if(!!!appVue.currentDeskInfo.wallPaper){
                wallPaper.setElementBg(document.body, wp)
              }
              this.refreshWallPaperHistory()
              this.$message.success({ content: '壁纸设置成功。' ,key:'setWallPaper'})
            }
          )
          appVue.defaultDeskWallPaper=wp
        } catch (err) {
          this.$message.error({ content: '保存壁纸失败。',key:'setWallPaper' })
        }
      }else{
        let deskInfo=deskModel.getDeskInfo(this.deskId)
        deskInfo.wallPaper=wp
        appVue.currentDeskInfo=deskModel.updateDeskInfo(this.deskId,deskInfo)
        appVue.setBg(wp)
        this.$message.success({ content: '当前桌面壁纸设置成功。' ,key:'setWallPaper'})
      }


    },
    refreshWallPaperHistory () {
      this.wallPaperHistory = wallPaper.getHistory()
    }
  },

  destroyed () {
  }
})

module.exports = wallpaperSelector
