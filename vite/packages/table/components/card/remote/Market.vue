<template>
  <!-- <div style="width:100%;height:100%;overflow:auto"> -->
  <div>
    <div class="head-nav" id="nav">
      <span>来自社区用户的分享（{{ dataList.length }}）  <strong style="color:red">！此功能正在开发中！</strong></span>
      <a-select style=" z-index: 9; position: relative;" v-model:value="sortVal" class="select rounded-lg  s-item flex items-center text-center" :bordered="false"
        size="large" @change="handleChange"
        :dropdownStyle="{ 'z-index': 99999, backgroundColor: 'var(--secondary-bg)' }">
        <a-select-option class="no-drag" v-for=" item  in  sortType " :value="item.value">{{
          item.name
        }}
        </a-select-option>
      </a-select>
    </div>
    <div id="navList">
      <!-- 外部小组件的社区列表 -->
      <div class="box xt-bg-2" v-for="(item, index) in dataList" :key="item.name">
        <div class="box xt-bg-2">
          <div class="add no-drag" @click="addNewCard(item)">
            <div class="icons">
              <Icon icon="tianjia2" style="color: #000"></Icon>
            </div>
          </div>
          <div class="left no-drag" @click="fullScreen(item)">
            <img :src="item.option[0].img ? item.option[0].img : getImg(item.option[0].name)" alt="" :style="{ zoom: '6%' }"/>
            <span class="size-bg">{{ item.option[0].size }}</span>
          </div>
          <div class="right" style="">
            <div class="title" style="color: var(--primary-text)">
              {{ item.cname }}
            </div>
            <div class="text truncate" style="color: var(--secondary-text)">
              {{ item.detail }}
            </div>
            <div class="flex justify-between">
              <div class="flex items-center truncate pr-2" style="flex:1;">
                <span>
                  <a-avatar shape="square" :src="item.avatar" :size="24"></a-avatar>
                </span>
                <span class="ml-3 truncate xt-text" style="flex:1;font-size: 16px;">{{ item.nickname }}</span>
              </div>
              <div class="data">
                  <Icon
                    icon="xiazai"
                    class="icons"
                    style="color: #508bfe; margin: 0; width: 20px"
                  ></Icon>
                  <div class="data-box">
                    {{ item.download }}
                  </div>
                  <Icon
                    icon="shijian"
                    class="icons"
                    style="color: #52c41a; margin: 0; width: 20px"
                  ></Icon>
                  <div class="data-box">{{ formatTimestamp(item.time) }}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <!-- 切换数据v-if="dataList.length > 10" -->
      <div class="switch-data" >
          <div :class="paging === 1 ? 'pag-active' : ''" class="mr-3">
            <Icon icon="xiangzuo" style="font-size: 1.5em;"></Icon>
          </div>
          <div>
            <Icon icon="xiangyou" style="font-size: 1.5em;"></Icon>
          </div>
        </div>
      </div>
    </div>
  <NewPreviewCardDetails
    v-if="isCardDetails"
    @addCardAchieve="add"
    @closeCardDetails="closeCardDetails"
    :cardDetails="cardDetails"
  >
  </NewPreviewCardDetails>
</template>

<script>
  import { mapActions, mapWritableState } from "pinia";
  import { cardStore } from "../../../store/card";
  import { message } from "ant-design-vue";
  import NewPreviewCardDetails from "../../../page/app/card/NewPreviewCardDetails.vue";
  import { dataList } from './testData'
  export default{
    components: {
      NewPreviewCardDetails,
    },
    props: {
      //获取当前桌面
      desk: {
        type: Object,
        required: true,
        default: () => {},
      },
    },
    data() {
      return {
        carouselIndex: 0,
        isCardDetails: false,
        cardDetails: {},
        remoteContent: {},
        showModal: false,
        dataList,
        sortVal: '最多使用',
        sortType: [
          { value: '最多使用', name: '最多使用' },
          { value: '下载次数', name: '下载次数' },
          { value: '分享时间', name: '分享时间' },
        ],
        paging: 1
      }
    },
    methods: {
      ...mapActions(cardStore, ["addCard"]),
      getImg(url) {
        return "/img/addCard/" + url + ".png";
      },
      addNewCard(item) {
        if (item.option[1] != undefined) {
          this.fullScreen(item);
        } else {
          this.add(item);
        }
      },
      fullScreen(item) {
        this.cardDetails = item;
        this.isCardDetails = true;
      },
      //获取url
      // getUrl(str) {
      //     const reg = /(https?|http|ftp|file):\/\/[-A-Za-z0-9+&@#/%?=~_|!:,.;]+[-A-Za-z0-9+&@#/%=~_|]/g;
      //     str = str.match(reg);
      //     if (str && str.length > 0) {
      //         return str[0];
      //     }
      //     return null;
      // },
      add(item, index = 0) {
        index = index ?? this.carouselIndex;
        // let url = this.getUrl(item.detail)
        this.addCard(
          { name: item.option[index].name, id: Date.now(), customData: {url:item.url} },
          this.desk
        );
        this.$emit("closeMarket",false);
        message.success("添加成功！");
      },
      closeCardDetails() {
        this.isCardDetails = false;
      },
      formatTimestamp(timestamp) {
        const date = new Date(timestamp);
        const year = date.getFullYear().toString();
        const month = (date.getMonth() + 1).toString().padStart(2, "0");
        const day = date.getDate().toString().padStart(2, "0");
        return `${year}-${month}-${day}`;
      }
    },
  }
</script>

<style lang="scss" scoped>
.head-nav{
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 76px;
  padding: 16px 29px;
  font-family: PingFangSC-Regular;
  font-size: 16px;
  color: var(--primary-text);
}
.box {
  box-shadow: rgb(0 0 0 / 30%) 0px 0px 3px 0px;
  width: 542px;
  height: 120px;
  display: flex;
  border-radius: 12px;
  position: relative;
  border-radius: 12px;
  margin: 0 auto 16px;

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
    height: 120px;
    border-radius: 12px 0px 0px 12px;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    width: 120px;
    cursor: pointer;
    background: var(--mask-bg);
    position: relative;
    .size-bg{
      position: absolute;
      bottom: 8px;
      left: 8px;
      background: var(--secondary-bg);
      font-weight: 500;
      color: var(--secondary-text);
      padding: 0 8px;
      border-radius: 4px;
    }
    .top {
      background: var(--secondary-bg);
      width: 100%;
      height: 120px;
      display: flex;
      justify-content: center;
      align-items: center;
      border-radius: 10px 0 0 0;
      img {
        zoom: 0.07 !important;
        object-fit: contain;
      }
      .zoom {
        zoom: 0.05 !important;
      }
    }

    .bottom {
      width: 100%;
      height: 62px;
      border-radius: 0px 0px 0px 12px;
      display: flex;
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
    width: 340px;
    border-radius: 0 12px 12px 0px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    .title {
      font-family: PingFangSC-Medium;
      font-size: 16px;
      color: rgba(255, 255, 255, 0.85);
      font-weight: 500;
      height: 35px;
      line-height: 35px;
    }

    .text {
      font-family: PingFangSC-Regular;
      font-size: 16px;
      font-weight: 400;
      margin: 2px 0;
      width: 100%;
      height: 30px;
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
        font-family: PingFangSC-Medium;
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
.select{
  width:120px;
  height:44px;
  color: var(--primary-text);
  font-size: 16px;
  background: var(--secondary-bg);
}
.nav{
  position: fixed;
  top: 0;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  background-color: #e7e7e7;
}
.switch-data {
  display: flex;
  justify-content: center;
  color: var(--primary-text);
  margin-bottom: 16px;
  > div {
    background: var(--secondary-bg);
    display: flex;
    justify-content: center;
    align-items: center;
    border-radius: 8px;
    width: 48px;
    height: 48px;
    cursor: pointer;
  }

  > div:hover {
    opacity: 0.3;
  }
}
.pag-active {
  opacity: 0.5;
}
</style>
