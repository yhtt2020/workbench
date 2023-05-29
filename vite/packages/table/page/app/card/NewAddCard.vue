<template>
  <teleport to="body">
    <div class='popContainer'></div>
    <div class="controller drag">
      <div class="header">
        <div class="left">
          <div class="btn no-drag" @click="onBack">
            <Icon icon="xiangzuo" style="height: 24px; width: 24px"></Icon>
          </div>
          <a-input v-model:value="selectContent" class="search no-drag" placeholder="搜索">
            <template #prefix>
              <Icon icon="sousuo" style="margin-right: 5px;"></Icon>
            </template>
          </a-input>
          <a-select style=" z-index: 99999999; position: relative;" v-model:value="searchValue" class=" no-drag select"
            size="large" @change="handleChange" :dropdownStyle="{ 'z-index': 999999999999 }">
            <a-select-option class="no-drag" v-for=" item  in  searchOptions " :value="item.value">{{ item.name
            }}</a-select-option>
          </a-select>
        </div>
        <div class="right">添加到
        </div>
      </div>
      <div class="mian">
        <div class="left">
          <div class="no-drag nav" @click="updateNavIndex(index)" v-for="( item, index ) in  navList " :key="item.name">{{
            item.cname }}
          </div>
        </div>
        <div class="right no-drag">
          <div class="warn" v-if="navIndex == 8">以下组件正在奋力💪开发中，部分功能还不完善或有明显Bug🐞，可以尝鲜试用～</div>
          <NewCardPreViews v-if="navList[navIndex].children !== null" :navList="navList[navIndex].children"
            @addSuccess="onBack" :search="searchValue">
          </NewCardPreViews>
          <template v-else>
            <div class="warn-box">
              <img src="/public/img/state/warn.png" alt="">
              <div>暂无数据</div>
            </div>
          </template>
        </div>
      </div>
    </div>
  </teleport>
</template>

<script>
import NewCardPreViews from './NewCardPreViews.vue'
import { navList } from "./navList"
export default {
  name: "AddCard",
  components: { NewCardPreViews },
  data() {
    return {
      navIndex: 1,
      navList,
      baseNavList: null,
      selectContent: "",
      searchValue: "默认排序",
      searchOptions: [
        { value: "默认排序", name: "默认排序" },
        { value: "下载次数", name: "下载次数" },
        { value: "更新时间", name: "更新时间" },
      ]
    };
  },

  mounted() {
    // 这里是预留给api请求到时间和下载数据添加数据使用
    this.baseNavList = navList.map((item) => {
      if (item.children != null) {
        let children = []
        item.children.forEach((i) => {
          children.push({
            ...i,
            download: Math.floor(Math.random() * 10000) + 1,
            time: this.getTimes()
          })
        })
        return {
          cname: item.cname,
          children
        }
      } else return item
    })
    this.navList = this.baseNavList
  },
  watch: {
    selectContent(newV, oldV) {
      if (newV == "" || newV == null) {
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
          cname: "全部数据",
          children: arr
        })
        this.navIndex = 0
        this.navList = data
      }
    }

  },
  methods: {
    handleChange(value) {
      console.log(`selected ${value}`);
    },
    getTimes() {
      const currentTime = Date.now();
      const startDate = new Date('2000-01-01T00:00:00Z').getTime();
      const randomTimestamp = Math.floor(Math.random() * (currentTime - startDate)) + startDate;
      return randomTimestamp;
    },
    onBack() {
      this.$emit("setCustoms", false);
    },
    updateNavIndex(index) {
      this.navIndex = index
    },
  },
};
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
  background-color: rgba(19, 19, 19, 0.65);
  // background: #1a1a1a;
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(50px);
  transform: scale(1.2);
  opacity: 1.6;

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

  // opacity: 0.6;
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
        background: rgba(0, 0, 0, 0.30);
        border: 1px solid rgba(255, 255, 255, 0.1);
        border-radius: 12px;
        width: 400px;
        height: 48px;
        padding-left: 20px;
        font-size: 18px;
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
        background: rgba(0, 0, 0, 0.30);
        width: 112px;
        height: 56px;
        border-radius: 12px;
        display: flex;
        justify-content: center;
        align-items: center;
        margin-bottom: 16px;
        cursor: pointer;
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
      flex-wrap: wrap;

      .warn {
        background: rgba(0, 0, 0, 0.30);
        border-radius: 12px;
        font-size: 16px;
        padding: 10px;
        box-sizing: border-box;
        padding-left: 20px;
        height: 48px;
      }

      .warn-box {
        display: flex;
        justify-content: center;
        align-items: center;
        flex-direction: column;
        width: 320px;
        height: 320px;
        opacity: 0.65;
        border-radius: 12px;
        background: rgba(26, 26, 26, 1);
        box-shadow: 0px 0px 3.12px 0px rgba(0, 0, 0, 0.06), 0px 0px 10.23px 0px rgba(0, 0, 0, 0.2), 0px 0px 20px 0px rgba(0, 0, 0, 0.4);
        backdrop-filter: blur(100px);
        margin: 0 auto;

        img {
          width: 80px;
          height: 80px;
          margin-bottom: 20px;
        }
      }
    }
  }
}
</style>
