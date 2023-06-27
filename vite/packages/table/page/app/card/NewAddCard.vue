<template>
  <teleport to="body">
    <div class='popContainer'></div>
    <div class="controller drag" style="color: var(--primary-text);">
      <div class="header">
        <div class="left">
          <div class="btn no-drag xt-bg-2" @click="onBack" style="color:var(--primary-text);  ">
            <Icon icon="xiangzuo" style="height: 24px; width: 24px"></Icon>
          </div>
          <a-input v-model:value="selectContent" class="search no-drag" placeholder="搜索">
            <template #prefix>
              <Icon icon="sousuo" style="margin-right: 5px;"></Icon>
            </template>
          </a-input>
          <a-select style=" z-index: 99999999; position: relative;" v-model:value="searchValue" class=" no-drag select"
            size="large" @change="handleChange"
            :dropdownStyle="{ 'z-index': 999999999999, backgroundColor: 'var(--secondary-bg)' }">
            <a-select-option class="no-drag" v-for=" item  in  searchOptions " :value="item.value">{{
              item.name
            }}
            </a-select-option>
          </a-select>
        </div>
        <div class="right">
        </div>
      </div>
      <div class="mian">
        <div class="left">
          <div class="no-drag nav" style="color:var(--primary-text)" :class="{ 'xt-active-btn': navIndex == index }"
            @click="updateNavIndex(index)" v-for="( item, index ) in  baseNavList " :key="item.name">{{
              item.cname
            }}
          </div>
        </div>
        <div class="right no-drag">
          <div class="warn" v-if="navIndex == 8">
            <div class="icon">i</div>
            以下组件正在奋力💪开发中，部分功能还不完善或有明显Bug🐞，可以尝鲜试用～
          </div>
          <NewCardPreViews @addSuccess="onBack" v-if="baseNavList[navIndex].children !== null"
            :navList="baseNavList[navIndex].children" :search="searchValue" :desk="desk">
          </NewCardPreViews>
          <template v-else>

            <div class="warn-boxs">
              <CardState :state="'null'" @onClick="onClick" style="width: 320px;height: 320px;"></CardState>
            </div>
          </template>
        </div>
      </div>
    </div>
  </teleport>
</template>

<script>
import NewCardPreViews from './NewCardPreViews.vue'
import { NavList } from "./navList"
import CardState from '../../../components/card/cardState.vue';
import _ from 'lodash-es'

export default {
  name: 'AddCard',
  components: { NewCardPreViews, CardState },
  props: ['desk'],
  data() {
    return {
      navIndex: 1,
      apiList: [],
      selectContent: '',
      searchValue: '默认排序',
      baseNavList: NavList,
      searchOptions: [
        { value: '默认排序', name: '默认排序' },
        { value: '下载次数', name: '下载次数' },
        { value: '更新时间', name: '更新时间' },
      ]
    }
  },

  mounted() {
    // 这里是预留给api请求到时间和下载数据添加数据使用
    let navList = _.cloneDeep(this.baseNavList)

    let items = []
    navList.map(li => {
      return items.push(...li.children)
    })
    //取得全部不重复的数组元素
    items = _.uniqBy(items, (li) => { return li.name })
    navList.splice(1, 0,
      {
        cname: '全部',
        children: items
      })
    // navList = this.baseNavList

    navList.forEach(li => {
      li.cname = li.cname + `（${li.children.length}）`
    })
    this.baseNavList = navList.map((item) => {
      if (item.children != null) {
        let children = []
        item.children.forEach((i) => {
          i.time = new Date(i.time).getTime()
          children.push({
            ...i,
            download: Math.floor(Math.random() * 10000) + 1,
            // time: this.getTimes()
          })

        })
        return {
          cname: item.cname,
          children
        }
      } else
        return item
    })
  },
  computed: {
    displayList() {
      // return this.apiList.filter
    }
  },
  watch: {
    selectContent(newV, oldV) {
      if (newV == '' || newV == null) {
        this.navList = this.baseNavList
        this.navIndex = 1
        return
      }
      let data = []
      this.navList = this.baseNavList
      let arr = []
      this.navList.filter((item) => {
        if (item.children != null) {
          item.children.forEach((i) => {
            if (i.cname.includes(newV) || i.detail.includes(newV)) arr.push(i)
          })
        }
      })
      if (arr != false) {
        data.push({
          cname: '全部数据',
          children: arr
        })
        this.navIndex = 0
        this.navList = data
      }
    }

  },
  methods: {
    onClick() {
    },
    handleChange(value) {
      console.log(`selected ${value}`)
    },
    getTimes() {
      const currentTime = Date.now()
      const startDate = new Date('2023-01-01T00:00:00Z').getTime()
      const randomTimestamp = Math.floor(Math.random() * (currentTime - startDate)) + startDate
      return randomTimestamp
    },
    onBack() {
      this.$emit('close')
    },
    updateNavIndex(index) {
      this.navIndex = index
    },
  },
}
</script>

<style lang="scss" scoped>
.popContainer {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 999;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
  // 背景的模糊大小通过下面的属性值大小来调制
  // background-color: rgba(19, 19, 19, 0.35);
  // background: red;
  background: var(--mask-bg);
  backdrop-filter: blur(10px);
  // background: red;
  -webkit-backdrop-filter: blur(50px);
  // transform: scale(1.2);

}

.controller {
  z-index: 9999;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  width: 100%;
  height: 100%;
  box-sizing: border-box;
  padding: 24px;

  :deep(.ant-select-selector) {
    border: none !important;
    box-shadow: none !important;
  }

  .header {
    display: flex;
    justify-content: space-between;
    margin-bottom: 20px;

    .left {
      display: flex;

      .select {
        display: flex;
        justify-content: center;
        align-items: center;
        text-align: center;
        font-size: 16px;
        background: rgba(0, 0, 0, 0.30);
        background: var(--secondary-bg) !important;
        border-radius: 12px;
        margin-left: 10px;
      }

      .btn {
        background: rgba(0, 0, 0, 0.30);
        border-radius: 12px;
        display: flex;
        justify-content: center;
        align-items: center;
        width: 112px;
        height: 48px;
        margin-right: 20px;
      }

      .search {
        background: var(--secondary-bg);
        border: 1px solid rgba(255, 255, 255, 0.1);
        border-radius: 12px;
        width: 400px;
        height: 48px;
        padding-left: 20px;
        font-size: 18px;

        color: var(--primary-text);

        input {
          color: var(--primary-text);
        }
      }

      .select {
        width: 134px;
        height: 48px;
      }
    }
  }

  .mian {
    margin-top: 20px;
    box-sizing: border-box;
    height: 95%;
    display: flex;


    .left {
      height: 100%;
      width: 140px;
      overflow: auto;
      padding-bottom: 40px;

      .nav {
        width: 112px;
        height: 56px;
        border-radius: 12px;
        display: flex;
        justify-content: center;
        align-items: center;
        cursor: pointer;

      }

      .active {
        background: var(--secondary-bg);

      }
    }

    .left::-webkit-scrollbar,
    .right::-webkit-scrollbar {
      display: none;
    }

    .right {
      width: 100%;
      height: 100%;
      overflow: auto;
      display: flex;
      // flex-wrap: wrap;
      flex-direction: column !important;

      .warn {
        background: rgba(0, 0, 0, 0.30);
        border-radius: 12px;
        font-size: 16px;
        padding: 10px;
        box-sizing: border-box;
        padding-left: 20px;
        height: 48px;
        display: flex;
        align-items: center;
        margin-bottom: 20px;

        .icon {
          width: 21px;
          height: 21px;
          background: #508BFE;
          border-radius: 50%;
          display: flex;
          justify-content: center;
          align-items: center;
          margin-right: 10px;
        }
      }

      .warn-boxs {
        width: 100%;
        height: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
      }


    }
  }
}
</style>
