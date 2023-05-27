<template>
  <div class="controller">
    <div class="header">
      <div class="left">
        <div class="btn" @click="onBack">
          <Icon icon="xiangzuo" style="height: 24px; width: 24px"></Icon>
        </div>
        <a-input v-model:value="selectContent" class="search" placeholder="搜索">
          <template #prefix>
            <Icon icon="sousuo" style="margin-right: 5px;"></Icon>
          </template>
        </a-input>
        <a-select style="border: 1px solid rgba(255, 255, 255, 0.1);" @change="searchChange($event)"
          class="select w-56 h-auto rounded-lg  text-xs s-item select" size="large" :options="searchOptions"
          :bordered="false" v-model:value="searchValue">

        </a-select>
      </div>
      <div class="right">添加到
        <a-select style="border: 1px solid rgba(255, 255, 255, 0.1);" @change="getRegion($event)"
          class="w-56 h-auto rounded-lg  text-xs s-item select" size="large" :bordered="false"
          v-model:value="searchValue">
          <a-select-option style="background:rgba(0, 0, 0, 0.1);" v-for="item in searchOptions" :value="item.value">{{
            item.name
          }}</a-select-option>
        </a-select>
      </div>
    </div>
    <div class="mian">
      <div class="left">
        <div class="nav" @click="updateNavIndex(index)" v-for="(item, index) in navList" :key="item.name">{{ item.cname }}
        </div>
      </div>
      <div class="right">
        <div class="warn" v-if="navIndex == 8">以下组件正在奋力💪开发中，部分功能还不完善或有明显Bug🐞，可以尝鲜试用～</div>
        <template v-if="navList[navIndex].children !== null">
          <NewCardPreViews :navList="navList[navIndex].children" @addSuccess="onBack"></NewCardPreViews>
        </template>
        <template v-else>
          <div class="warn-box">
            <img src="../../../../../public/img/state/warn.png" alt="">
            <div>暂无数据</div>
          </div>
        </template>
      </div>
    </div>
  </div>
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
      searchValue: "默认排序",
      searchOptions: [
        { value: "默认排序", name: "默认排序" },
        { value: "默认排序", name: "下载次数由高到低" },
        { value: "默认排序", name: "更新时间" },
      ]
    };
  },

  mounted() { },
  computed: {

  },
  methods: {
    onBack() {
      this.$emit("setCustoms", false);
    },
    updateNavIndex(index) {
      this.navIndex = index
    },
    searchChange(e) {
      console.log('e :>> ', e);
    }
  },
};
</script>

<style lang="scss" scoped>
.controller {
  width: 100%;
  height: 100%;
  box-sizing: border-box;
  padding: 24px;

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
