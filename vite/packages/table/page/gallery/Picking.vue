<template>
  <div class="flex w-full justify-between items-center" style="margin-bottom: 16px;margin-top: 2em;">
    <div class="w-96 h-12 flex items-center">
      <div class="w-80 h-12 bg-opacity-10 rounded-lg flex items-center xt-bg-2 ">
        <div class="w-20 h-12 flex items-center justify-center"
          style="border-right: 1px solid rgba(255, 255, 255, 0.1);color: var(--primary-text);">
          壁纸源</div>
        <a-select class="w-full" :bordered="false" v-model:value="pickFilterValue" @change="pickFilterChange($event)">
          <a-select-option v-for="item in  paperSourceOption " :value="item.name" style="color: var(--font - color)">
            {{ item.title }}
          </a-select-option>
        </a-select>
      </div>
    </div>
    <div class="w-48 h-12 flex items-center justify-end" style="margin-right: 1em;color:var(--primary-text);">
      <div class="w-2/5 h-12 flex items-center rounded-lg cursor-pointer justify-center s-icon" @click="openFilter">
        <Icon icon="filter" style="font-size: 1.715em;"></Icon>
        <span style="font-size: 1.15em; " class="s-text">筛选</span>
      </div>
      <div class="w-12 h-12 flex items-center rounded-lg cursor-pointer justify-center s-icon" @click="openInfo"
        style="margin-left: 12px;">
        <InfoCircleOutlined style="font-size: 1.715em;" />
      </div>
    </div>
  </div>
  <div style="flex-shrink: 1;flex-grow: 1;flex-basis: fit-content;height: 0">
    <vue-custom-scrollbar id="pick-wrapper" :settings="settingsScroller" style="height: 100%">
      <viewer :images="pickImageData" :options="options">
        <div style="display: flex; align-items: center; justify-content: center;">
          <a-spin v-if="isLoading" />
        </div>
        <a-row :gutter="[20, 20]" id="pick-images" ref="pickRef" style="margin-right: 1em">
          <a-col class="image-wrapper " v-for=" (img,index)  in  pickImageData " :span="6" style="">
            <!-- 拾光壁纸循环位置 -->
        <xt-task v-if="index==0" :modelValue="m01036" @cb="pickShow(img)">
          <img @contextmenu.stop="pickShow(img)" class="image-item pointer" :src="img.src" :data-source="img.path"
              :alt="img.resolution" style="position: relative">
            <div style="position: absolute;right: 0;top: -10px ;padding: 10px">
              <div @click.stop="addToMy(img)" class="bottom-actions pointer"
                :style="{ background: isInMyPapers(img) ? '#009d00a8' : '' }">
                <Icon v-if="!isInMyPapers(img)" icon="tianjia1"></Icon>
                <Icon v-else style="" icon="yiwancheng"></Icon>
              </div>
            </div>
        </xt-task>
        <template v-else>
          <img @contextmenu.stop="pickShow(img)" class="image-item pointer" :src="img.src" :data-source="img.path"
              :alt="img.resolution" style="position: relative">
            <div style="position: absolute;right: 0;top: -10px ;padding: 10px">
              <div @click.stop="addToMy(img)" class="bottom-actions pointer"
                :style="{ background: isInMyPapers(img) ? '#009d00a8' : '' }">
                <Icon v-if="!isInMyPapers(img)" icon="tianjia1"></Icon>
                <Icon v-else style="" icon="yiwancheng"></Icon>
              </div>
            </div>
        </template>
          </a-col>
        </a-row>
      </viewer>
    </vue-custom-scrollbar>
  </div>


  <a-drawer v-model:visible="pickFilterShow" title="筛选" style="text-align: center !important;" class="no-drag"
    @close="closeFilter()">
    <div class="w-full h-12  flex rounded-lg" style="border:1px solid rgba(255, 255, 255, 0.1);margin-bottom:1.714289em;">
      <div class="w-1/3 h-100 flex items-center justify-center filter-item"
        :class="filterIndex === item.index ? 'active' : ''" v-for=" item  in  filterOption "
        @click="filterOptionClick(item)" style="border-right:1px solid rgba(255, 255, 255, 0.1);">
        {{ item.title }}
      </div>
    </div>
    <div class="w-full h-12  flex items-center justify-between" style="margin-bottom:1.714289em;">
      <span>分类</span>
      <template v-if="pickFilterValue !== '/wallhaven/v2'">
        <div class="w-60  bg-white bg-opacity-10 rounded-lg flex items-center ">
          <a-select class="w-full" :bordered="false" v-model:value="classValue" @change="filterClassValue($event)">
            <a-select-option v-for=" item  in  classOption " :value="item.id">
              {{ item.name }}
            </a-select-option>
          </a-select>
        </div>
      </template>
      <template v-else>
        <div class="w-60  bg-white bg-opacity-10 rounded-lg flex items-center ">
          <a-select class="w-full" :bordered="false" v-model:value="wallValue" @change="wallFilterChange($event)">
            <a-select-option v-for=" item  in  wallFilterOption " :value="item.id">
              {{ item.id === 'anime' ? '动漫精选' : item.id === 'general' ? '热门精选' : item.id === 'people' ? '人物精选' : '' }}
            </a-select-option>
          </a-select>
        </div>
      </template>
    </div>
    <div class="w-full h-12  flex items-center justify-between" style="margin-bottom:1.714289em;">
      <span>筛选项</span>
      <a-switch v-model:checked="pickChecked" />
    </div>
    <div class="w-full flex items-center justify-center">
      <div @click="restFilter"
        class="w-28 h-12  flex items-center justify-center  rounded-lg cursor-pointer  bg-white bg-opacity-10">
        <span>重置筛选</span>
      </div>
    </div>
  </a-drawer>

  <a-drawer v-model:visible="pickInfoShow" title="信息" style="text-align: center !important;" class="no-drag"
    :footer-style="{ border: 'none' }">
    <div class="flex w-full   justify-center items-center flex-col">
      <div class="flex-col flex justify-start mx-2 my-40">
        <div class="flex" style="margin-bottom: 12px;">
          <span style="margin-right: 16px; color:rgba(255, 255, 255, 0.6); font-size: 16px; font-weight: 400;">壁纸源</span>
          <span style="color:rgba(255, 255, 255, 0.85); font-size: 16px; font-weight: 400;">{{ defaultSynopsis.title
          }}</span>
        </div>
        <div class="flex" style="margin-bottom: 12px;">
          <span style="color:rgba(255, 255, 255, 0.6);font-size: 16px; font-weight: 400;">简介</span>
          <span class="ml-8" style="color:rgba(255, 255, 255, 0.85); font-size: 16px; font-weight: 400;">{{
            defaultSynopsis.synopsis }}</span>
        </div>
        <div class="flex items-center">
          <span style="margin-right: 30px; color:rgba(255, 255, 255, 0.6);font-size: 16px; font-weight: 400;">官网</span>
          <span class="w-40 h-12 flex items-center rounded-lg cursor-pointer justify-center bg-white bg-opacity-10"
            @click="toOfficialWebsite">
            访问官网
          </span>
        </div>
      </div>
    </div>
    <template #footer>
      <span style="color:rgba(255, 255, 255, 0.6);font-size: 16px; font-weight: 400;">「拾光壁纸」提供技术支持</span>
    </template>
  </a-drawer>

  <a-drawer :height="200" v-model:visible="visibleMenu" placement="bottom">
    <a-row :gutter="20" style="text-align: center">
      <a-col :span="4">
        <div @click="setDesktopPaper" class="btn">
          <Icon style="font-size: 3em" icon="tianjia1"></Icon>
          <div>设置为桌面壁纸</div>
        </div>
      </a-col>

      <a-col>
        <div @click="add()" class="btn">
          <Icon style="font-size: 3em" icon="xiazai"></Icon>
          <div>下载该壁纸</div>
        </div>
      </a-col>
      <a-col :span="4">
      <xt-task  id="M0103" no="7"  @cb="setAppPaper">
        <div @click="setAppPaper" class="btn relative">
          <Icon style="font-size: 3em" icon="tianjia1"></Icon>
          <div>设为工作台背景</div>
          <GradeSmallTip powerType="mainWallpaper"></GradeSmallTip>
        </div>

      </xt-task>
      </a-col>

    </a-row>
  </a-drawer>
</template>

<script>
import { defineComponent, ref } from 'vue';
import { InfoCircleOutlined } from '@ant-design/icons-vue'
import axios from 'axios';
import { paperStore } from "../../store/paper";
import { mapActions, mapState,mapWritableState } from "pinia";
import { message, Modal } from 'ant-design-vue'
import GradeSmallTip from "../../components/GradeSmallTip.vue";
import { appStore } from "../../store";
import browser from '../../js/common/browser'
import { taskStore } from '../../apps/task/store';
export default defineComponent({
  name: 'Picking',
  components: {
    InfoCircleOutlined, GradeSmallTip
  },
  computed: {
    ...mapState(paperStore, ["myPapers","settings"]),
    ...mapWritableState(taskStore, ['taskID','step']),
    m01036() {
        return  this.step === 6 && this.taskID == "M0103"
    },

  },
  data() {
    return {
      isLoading: false,
      pickChecked: false,
      classOption: [],
      wallFilterOption: [],
      settingsScroller: {
        useBothWheelAxes: true,
        swipeEasing: true,
        suppressScrollY: false,
        suppressScrollX: true,
        wheelPropagation: true
      },
      pickImageData: [],
      pickHeight: 80000,
      options: {
        url: 'data-source',
      },
      score: 99999999,
      no: 99999999,
      dateTime: 20500101,
      visibleMenu: false,
      currentPaper: null,
      count: '',
      paperSourceOption: [
        {
          title: '拾光',
          name: '/timeline/v2',
          synopsis: '时光如歌,岁月如诗'
        },
        {
          title: '贪食鬼',
          name: '/glutton/journal',
          synopsis: '饕餮盛宴'
        },
        {
          title: '贪吃蛇',
          name: '/snake/v2',
          synopsis: ''
        },
        {
          title: 'wallhaven',
          name: '/wallhaven/v2',
          synopsis: 'The best wallpapers on the Net'
        }
      ],
      defaultSynopsis: { title: '拾光', name: '/timeline/v2', synopsis: '时光如歌,岁月如诗' }
    }
  },
  mounted() {
    $("#pick-wrapper").scroll(() => {
      if ($("#pick-wrapper").scrollTop() + $("#pick-wrapper").height() + 20 >= $("#pick-images").prop("scrollHeight") && this.isLoading === false) {
        const newTime = new Date()
        this.dateTime = this.formatDateTime(newTime)
        this.score = this.pickImageData.sort((a, b) => {
          return a.resolution - b.resolution > b.resolution
        })[this.pickImageData.length - 1].score
        this.no = this.pickImageData.sort((a, b) => {
          return a.resolution - b.resolution > b.resolution
        })[this.pickImageData.length - 1].no
        this.getPickingData(this.pickFilterValue)
      }
    })
    this.getPickingData(this.pickFilterValue)
    this.getClassOption()
    this.getWallOption()
  },
  methods: {
    ...mapActions(paperStore, ["removeToMyPaper"]),
    ...mapActions(appStore, ["setBackgroundImage"]),
    // 获取拾光壁纸数据
    getPickingData(e) {
      const api = 'https://api.nguaduot.cn'
      const cate = this.pickFilterValue === '/wallhaven/v2' ? this.wallValue :
        this.pickFilterValue === '/timeline/v2' ? this.classValue : ''
      const order = this.filterValue
      const no = this.no
      const dateTime = this.dateTime
      const score = this.score
      const url = `${api}${e}?${cate === '' ? '' : `cate=${cate}`}&order=${order}&no=${no}&date=${dateTime}&score=${score}&client=thisky`
      if (!this.isLoading) {
        this.isLoading = true
        axios.get(url).then(async res => {
          if (res.data.data.length !== 1) {
            let pickImage = res.data.data
            this.count = res.data.count
            let animations = ["ani-gray", "bowen", "ani-rotate"];
            if (pickImage) {
              pickImage.forEach(img => {
                if (img.thumburl !== null) {
                  let randomIndex = Math.floor(Math.random() * animations.length);
                  const image = {
                    title: false,
                    src: img.thumburl,
                    path: img.imgurl,
                    resolution: img.size,
                    score: img.score,
                    no: img.no,
                    animations: animations[randomIndex],
                  }
                  this.pickImageData.push(image)
                }
              })
            }
          } else {
            return
          }
        })
          .finally(() => {
            this.$nextTick(() => {
              this.isLoading = false;
            });
          })
      }
    },
    setAppPaper() {
      message.info('正在为您设置壁纸')
      this.setBackgroundImage(this.currentPaper)
      this.visibleMenu = false
    },
    // 获取拾光壁纸分类
    getClassOption() {
      const apiUrl = 'https://api.nguaduot.cn/timeline/cate'
      axios.get(apiUrl).then(res => {
        this.classOption = res.data.data
      })
    },

    // 获取wallheaven壁纸分类
    getWallOption() {
      const url = 'https://api.nguaduot.cn/wallhaven/cate'
      axios.get(url).then(res => {
        this.wallFilterOption = res.data.data
      })
    },

    pickFilterChange(e) {
      this.pickFilterValue = e
      const index = this.paperSourceOption.findIndex(v => {
        return v.name === e
      })
      this.defaultSynopsis = this.paperSourceOption[index]
      this.pickImageData = []
      this.getPickingData(e)
    },
    // 重置筛选
    restFilter() {
      this.filterValue = 'date'
      this.pickChecked = false
      this.classValue = 'landscape'
      this.filterIndex = 'D'
    },
    formatDateTime(date) {
      var y = date.getFullYear();
      var m = date.getMonth() + 1;
      m = m < 10 ? ('0' + m) : m;
      var d = date.getDate();
      d = d < 10 ? ('0' + d) : d;
      return y + m + d
    },
    addToMy(img) {
      this.removeToMyPaper(img);
    },
    isInMyPapers(image) {
      return (
        this.myPapers.findIndex((img) => {
          return image.src === img.src;
        }) > -1
      );
    },

    pickShow(item) {
console.log('11111 :>> ', 11111);
      this.currentPaper = item
      this.visibleMenu = true
    },

    // 下载壁纸
    add() {
      if(this.settings.savePath === ''){
        Modal.confirm({
          centered:true,
          content: '您尚未设置壁纸保存目录，请设置目录，设置目录后下载将自动开始。',
          onOk: async () => {
            await this.queryStart()
          }
        })
      }else{
        this.doStartDownload(this.currentPaper.path)
      }
    },

    //开始下载文件
    doStartDownload(item){
      message.info('开始下载壁纸')
      const name = item.split('/')
      const fileName  = name[name.length - 1]
      tsbApi.download.start({
        url:item,
        savePath: this.settings.savePath + '/static/' + fileName,
        done:(args)=>{
          console.log('排查::>>',args)
          message.success('壁纸下载完成')
        }
      })
      this.visibleMenu = false
    },

    // 用户没有选中指定文件时需要提示选中文件
    async queryStart (){
      let savePath = await tsbApi.dialog.showOpenDialog({
        title: '选择目录', message: '请选择下载壁纸的目录', properties: [
          'openDirectory', 'createDirectory',
        ]
      })
      if (savePath) {
        this.settings.savePath = savePath[0]
        this.doStartDownload(this.currentPaper.path)
      } else {
      }
    },

    setDesktopPaper() {
      Modal.confirm({
        content: '确定将此壁纸设置为系统桌面壁纸？注意，此处设置不是工作台的壁纸。',
        okText: '设置桌面壁纸',
        onOk: () => {
          message.info('正在为您下载并设桌面壁纸')
          tsbApi.system.setPaper(this.currentPaper.path)
          this.visibleMenu = false
        }
      })
    },

    closeFilter() {
      this.pickImageData = []
      this.getPickingData(this.pickFilterValue)
    }
  },
  setup() {
    const pickFilterValue = ref('/timeline/v2')
    const pickInfoShow = ref(false)
    const pickFilterShow = ref(false)
    let classValue = ref('landscape')
    const filterOption = ref([
      {
        index: 'D',
        title: '最新',
        value: 'date'
      },
      {
        index: 'S',
        title: '趋势',
        value: 'score'
      },
      {
        index: 'R',
        title: '随机',
        value: 'random'
      }
    ])
    let filterIndex = ref('D')
    let filterValue = ref('date')
    let wallValue = ref('general')


    // 右侧打开拾光壁纸官网信息
    const openInfo = () => {
      pickInfoShow.value = true
    }
    // 点击筛选
    const openFilter = () => {
      pickFilterShow.value = true
    }
    const filterOptionClick = (item) => {
      filterIndex.value = item.index
      filterValue.value = item.value
    }
    // 跳转至拾光壁纸官网
    const toOfficialWebsite = () => {
      browser.openInUserSelect('https://timeline.ink')
    }
    // 获取分类参数
    const filterClassValue = (e) => {
      classValue.value = e
    }
    // 获取wall分类参数
    const wallFilterChange = (e) => {
      wallValue.value = e
    }
    return {
      pickFilterValue,
      pickInfoShow,
      pickFilterShow,
      classValue,
      filterOption,
      filterIndex,
      filterValue,
      wallValue,
      openInfo,
      openFilter,
      filterOptionClick,
      toOfficialWebsite,
      filterClassValue,
      wallFilterChange
    }
  }
})

</script>

<style lang="scss" scoped>
.s-icon svg {
 filter: none  !important;
}

.s-text {
    text-shadow: none;
}
.filter-item:nth-of-type(3) {
  border: none !important;
}

.active {
  background: rgba(77, 77, 77, 1);

  &:nth-of-type(1) {
    border-top-left-radius: 0.5em;
    border-bottom-left-radius: 0.5em;
  }

  &:nth-of-type(3) {
    border-top-right-radius: 0.5em;
    border-bottom-right-radius: 0.5em;
  }
}
:deep(.ant-select){
  background: none;
}
</style>
