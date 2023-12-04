<template>
  <div class="main-box">
    <template v-for="(item, index) in displayList" :key="item.name">
      <template v-if="item.name == 'clocks' && M01013">
        <xt-task :modelValue="M01013" to="" @cb="addNewCard(item)">
          <div>
            <div class="box xt-bg-2" style="z-index: 99999999999">
              <div class="add no-drag" @click="addNewCard(item)" v-if="item.option.length <= 1">
                <div class="icons">
                  <Icon icon="tianjia2" style="color: #000"></Icon>
                </div>
              </div>
              <div class="add no-drag" @click="addNewCard(item)" v-else>
                <div class="text" style="color: #fff">· · ·</div>
              </div>
              <div class="left no-drag" @click="fullScreen(item)">
                <template v-if="item.option.length > 1">
                  <div class="top">
                    <img :style="[{ zoom: item.option[0].zoom + '%' }]" :src="getImg(item.option[0].name)" alt=""/>
                  </div>
                  <div class="bottom">
                    <img class="small-cover" v-for="i in item.option" :src="getImg(i.name)" alt=""/>
                  </div>
                </template>
                <img v-else:src="getImg(item.option[0].name)" alt="" :style="[
                  {
                    zoom: item.option[0].zoom
                      ? item.option[0].zoom + '%'
                      : '11%',
                  },
                ]"/>
              </div>
              <div class="right" style="">
                <div class="title" style="color: var(--primary-text)">
                  {{ item.cname }}
                </div>
                <div class="text" style="color: var(--secondary-text)">
                  {{ item.detail }}
                </div>
                <div class="icon">
                  <div class="icon-box xt-active-bg-2" v-for="i in item.sizes" :key="i"
                       style="color: var(--secondary-text)" :class="i === '社区分享' ? 'share' : ''">
                    {{ i }}
                  </div>
                </div>
                <div class="data">
                  <Icon icon="xiazai" class="icons" style="color: #508bfe; margin: 0; width: 20px"></Icon>
                  <div class="data-box">
                    {{ item.download }}
                  </div>
                  <Icon icon="shijian" class="icons" style="color: #52c41a; margin: 0; width: 20px"></Icon>
                  <div class="data-box">{{ formatTimestamp(item.time) }}</div>
                </div>
              </div>
            </div>
          </div>
        </xt-task>
      </template>
      <div v-else>
        <div class="box xt-bg-2">
          <div class="add no-drag" @click="addNewCard(item)" v-if="item.option.length <= 1">
            <div class="icons">
              <Icon icon="tianjia2" style="color: #000"></Icon>
            </div>
          </div>
          <div class="add no-drag" @click="addNewCard(item)" v-else>
            <div class="text" style="color: #fff">· · ·</div>
          </div>
          <div class="left no-drag" @click="fullScreen(item)">
            <template v-if="item.option.length > 1">
              <div class="top">
                <img :style="[{ zoom: item.option[0].zoom + '%' }]" :src="getImg(item.option[0].name)" alt=""/>
              </div>
              <div class="bottom">
                <img class="small-cover" v-for="i in item.option" :src="getImg(i.name)" alt=""/>
              </div>
            </template>
            <img v-else style="" :src="getImg(item.option[0].name)" alt="" :style="[
              { zoom: item.option[0].zoom ? item.option[0].zoom + '%' : '11%' },
            ]"/>
          </div>
          <div class="right" style="">
            <div class="title" style="color: var(--primary-text)">
              {{ item.cname }}
            </div>
            <div class="text" style="color: var(--secondary-text)">
              {{ item.detail }}
            </div>
            <div class="icon">
              <div class="icon-box xt-active-bg-2" v-for="i in item.sizes" :key="i" style="color: var(--secondary-text)"
                   :class="i === '社区分享' ? 'share' : ''">
                {{ i }}
              </div>
            </div>
            <div class="data">
              <Icon icon="xiazai" class="icons" style="color: #508bfe; margin: 0; width: 20px"></Icon>
              <div class="data-box">
                {{ item.download }}
              </div>
              <Icon icon="shijian" class="icons" style="color: #52c41a; margin: 0; width: 20px"></Icon>
              <div class="data-box">{{ formatTimestamp(item.time) }}</div>
            </div>
          </div>
        </div>
      </div>
    </template>

    <div class="box" style="opacity: 0; height: 1px"></div>
  </div>
  <NewPreviewCardDetails v-if="isCardDetails" @addCardAchieve="addCardAchieve" @closeCardDetails="closeCardDetails"
                         :cardDetails="cardDetails">
  </NewPreviewCardDetails>
  <edit v-if="settingVisible" @close="settingVisible = false" @save="save()"></edit>
  <RemoteMarket :openRemote="openRemote" :custom="remoteContent" :desk="desk" @closeMarket="closeMarket"></RemoteMarket>
</template>

<script>
import { mapActions, mapWritableState } from 'pinia'
import { cardStore } from '../../../store/card'
import { message } from 'ant-design-vue'
import NewPreviewCardDetails from './NewPreviewCardDetails.vue'
import Edit from '../../../components/widgets/myIcons/edit/index.vue'
import RemoteMarket from './RemoteMarket.vue'
import { myIcons } from '../../../store/myIcons.ts'
import _ from 'lodash-es'
import { taskStore } from '../../../apps/task/store'

export default {
  emits: ['close', 'addSuccess'],
  props: {
    allList: {
      type: Array,
      default: true,
    },
    cardList: {
      type: Array,
      default: true,
    },
    search: {
      type: String,
    },
    desk: {
      type: Object,
      required: true,
      default: () => { },
    },
    keywords: {
      type: String
    }
  },
  computed: {
    ...mapWritableState(myIcons, ['iconOption', 'edit']),
    ...mapWritableState(taskStore, ['taskID', 'step', 'success']),
    M01013 () {
      return this.taskID == 'M0101' && this.step == 3
    },
    displayList () {
      if (this.keywords) {
        return this.allList.filter(item => {

          return item.cname.toLowerCase().includes(this.keywords.toLowerCase()) || item.detail.toLowerCase().includes(this.keywords.toLowerCase())

        })
      } else {
        return this.cardList
      }
    }
  },
  data () {
    return {
      navLists: [],
      carouselIndex: 0,
      isCardDetails: false,
      cardDetails: {},
      settingVisible: false,
      openRemote: false,
      remoteContent: {},
    }
  },
  components: {
    NewPreviewCardDetails,
    Edit,
    RemoteMarket,
  },
  watch: {
    navList: {
      immediate: true,
      handler () {
        this.navLists = JSON.parse(JSON.stringify(this.cardList))
      },
    },
    search: {
      immediate: true,
      handler (newV, oldV) {
        if (newV == '下载次数')
          this.navLists = this.mySort(this.navLists, 'download')
        else if (newV == '更新时间')
          this.navLists = this.mySort(this.navLists, 'time')
        else this.navLists = this.cardList
      },
    },
  },
  methods: {
    ...mapActions(cardStore, ['addCard']),
    // 添加图标保存
    save () {
      if (this.edit.src.length === 0) return message.error('图标不能为空')
      this.settingVisible = false
      this.addCard(
        {
          name: 'myIcons',
          id: Date.now(),
          customData: { iconList: [{ ...this.edit }] },
        },
        this.desk
      )
      this.edit = {}
      this.$emit('addSuccess')
      message.success('添加成功！')
    },
    getImg (url) {
      return '/img/addCard/' + url + '.png'
    },
    mySort (data, property, asc) {
      let datas = [...data]
      return datas.sort(function (a, b) {
        a = a[property]
        b = b[property]
        if (asc) return a - b
        else return b - a
      })
    },
    formatTimestamp (timestamp) {
      const date = new Date(timestamp)
      const year = date.getFullYear().toString()
      const month = (date.getMonth() + 1).toString().padStart(2, '0')
      const day = date.getDate().toString().padStart(2, '0')
      return `${year}-${month}-${day}`
    },
    closeCardDetails () {
      this.isCardDetails = false
    },
    addImgClass (index) {
      this.$nextTick(() => {
        let img = this.$refs.imgRef
        let width = img[index].naturalWidth
        let height = img[index].naturalHeight
        if (width > height) img[index].setAttribute('class', 'img-w')
        else img[index].setAttribute('class', 'img-h')
      })
    },
    addNewCard (item) {

      if (item.option[1] != undefined) {
        this.fullScreen(item)
      } else {
        if (item.name === 'remote') {
          this.openRemote = true
          this.remoteContent = item
          return
        }
        this.addCardAchieve(item)
      }
    },
    fullScreen (item) {
      this.cardDetails = item
      this.isCardDetails = true
    },
    addCardAchieve (item, i) {
      // 添加图标前处理
      if (item.name == 'myIcons') {
        this.edit = _.cloneDeep(this.iconOption)
        this.settingVisible = true
        return
      }
      this.add(item, i)
    },
    add (item, index) {
      index = index ?? this.carouselIndex

      this.addCard(
        { name: item.option[index].name, id: Date.now(), customData: {} },
        this.desk
      )
      this.$emit('addSuccess')
      message.success('添加成功！')
    },
    closeMarket (val) {
      this.openRemote = val
    },
  },
}
</script>

<style lang="scss" scoped>
.main-box {
  display: flex;
  flex-wrap: wrap;
  margin: 0 auto;
  margin-top: 3px;
  width: 100%;
  flex-wrap: wrap;
  align-content: flex-start;
  justify-content: center;
}

.box {
  box-shadow: rgb(0 0 0 / 30%) 0px 0px 3px 0px;
  width: 542px;
  height: 184px;
  display: flex;
  border-radius: 12px;
  position: relative;
  margin: 18px;
  margin-left: 0;
  margin-top: 0;
  border-radius: 10px;

  .add {
    position: absolute;
    right: 22px;
    top: 50%;
    transform: translateY(-50%);
    background: rgba(0, 0, 0, 0.3);
    background: var(--active-bg);
    border-radius: 12px;
    width: 48px;
    height: 48px;
    display: flex;
    justify-content: center;
    align-items: center;
    cursor: pointer;

    .icons {
      background: #fff;
      width: 24px;
      height: 24px;
      border-radius: 50%;
      font-size: 12px !important;
      display: flex;
      justify-content: center;
      align-items: center;
    }

    .text {
      font-size: 20px !important;
      display: flex;
      align-items: center;
    }
  }

  .left {
    //margin: 0;
    height: 182px;
    //background: rgba(0, 0, 0, 0.30);
    border-radius: 12px 0px 0px 12px;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    width: 180px;
    cursor: pointer;
    background: var(--secondary-bg);

    .top {
      background: var(--secondary-bg);
      width: 100%;
      height: 120px;
      display: flex;
      justify-content: center;
      align-items: center;
      border-radius: 10px 0 0 0;

      img {

        zoom: 0.07;
        border-radius: 8px;
        object-fit: contain;
      }


      .zoom {
        zoom: 0.05 !important;
      }
    }

    .bottom {
      .small-cover {
        width: 90%;
        height: 90%;
      }

      width: 100%;
      height: 62px;
      border-radius: 0px 0px 0px 12px;
      display: flex;
      gap: 5px;
      justify-content: space-around;
      padding: 10px;

      .zoom {
        zoom: 0.02 !important;
      }

      img {
        zoom: 0.04;
        border-radius: 5px;
        object-fit: contain;
      }
    }
  }

  .right {
    box-sizing: border-box;
    padding: 10px;
    width: 358px;

    border-radius: 0 12px 12px 0px;

    .title {
      font-size: 18px;
      color: rgba(255, 255, 255, 0.85);
      font-weight: 500;
      height: 35px;
      line-height: 35px;
    }

    .text {
      display: flex;
      align-items: center;
      font-size: 16px;
      color: rgba(255, 255, 255, 0.6);
      font-weight: 400;
      margin: 2px 0;
      width: 78%;
      height: 55px;
    }

    .icon {
      margin-bottom: 10px;
      display: flex;
      width: 100%;
      height: 24px;
      margin-top: 10px;

      .icon-box {
        padding: 0 10px 0 10px;
        margin-right: 10px;
        display: flex;
        justify-content: center;
        align-items: center;
        padding: 4px 10px;
        border-radius: 4px;
        font-size: 14px;
        color: rgba(255, 255, 255, 0.9);
        font-weight: 500;
        background: rgba(255, 255, 255, 0.2);
      }
    }

    .data {
      display: flex;
      flex-wrap: wrap;
      align-items: center;

      .icons {
        color: #508bfe 100%;
        height: 16px;
      }

      .data-box {
        margin: 0 4px;
        color: var(--primary-text);
      }
    }
  }
}

.share {
  background: rgba(250, 173, 20, 0.2) !important;
  color: #faad14 !important;
  font-weight: 500;
}
</style>
