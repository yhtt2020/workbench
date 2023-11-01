<template>
  <!-- <div style="width:100%;height:100%;overflow:auto"> -->
  <div>
    <xt-task :modelValue="m03033"></xt-task>
    <div class="head-nav" id="nav" v-if="listType === 'my'">
      <span>我分享外部小组件（{{ shareList.length }}）</span>
      <div class="block-btn" @click="shareNow">立即分享</div>
    </div>
    <div class="head-nav" id="nav" v-else>

      <span>来自社区用户的分享（{{ dataList.length }}）<strong style="color:red">！此功能正在开发中！</strong></span>
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
      <div class="box xt-bg-2" v-for="(item, index) in list" :key="item.nanoid">
        <div class="box xt-bg-2">
          <div v-if="setCard === 'my'">
            <!-- <div class="text" style="color: #fff">· · ·</div> -->
            <a-dropdown :trigger="['click']" :z-index="999999">
              <div class="add no-drag" >
                <div class="text" style="color: #fff">· · ·</div>
              </div>
              <template #overlay>
                <a-menu class="set-btn" theme="dark" :selected-keys="selectedKeys">
                  <a-menu-item key="0" theme="dark" class="h-11 mx-3">
                    <div class="btn-style" @click="addNewCard(item)">添加桌面</div>
                  </a-menu-item>
                  <a-menu-item key="1" theme="dark" class="h-11 mx-3">
                    <div class="btn-style" @click="openDelFrame(item.nanoid)">删除</div>
                  </a-menu-item>
                </a-menu>
              </template>
            </a-dropdown>
          </div>
          <div class="add no-drag" @click="showPrompt(item)" v-else-if="setCard === 'tip'">
            <div class="icons">
              <Icon icon="tianjia2" style="color: #000"></Icon>
            </div>
          </div>
          <div class="add no-drag" @click="addNewCard(item)" v-else>
            <div class="icons">
              <Icon icon="tianjia2" style="color: #000"></Icon>
            </div>
          </div>
          <div class="left no-drag" @click="fullScreen(item)">
            <img class="imgInit" :id="'img' + index" :src="item.option[0].img" @load="setImg(item.option[0].img,index)"/>
            <!-- <img :src="item.option[0].img ? item.option[0].img : getImg(item.option[0].name)" alt="" :style="{ zoom: '6%' }"/> -->
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
      <!-- 切换数据 -->
      <div class="switch-data" v-if="list.length > 3">
          <div :class="paging === 1 ? 'pag-active' : ''" class="mr-3">
            <Icon icon="xiangzuo" style="font-size: 1.5em;"></Icon>
          </div>
          <div>
            <Icon icon="xiangyou" style="font-size: 1.5em;"></Icon>
          </div>
        </div>
      </div>
    </div>
    <!-- 删除 -->
    <Modal blurFlag="true" v-model:visible="promptVisible" v-if="promptVisible" style="z-index:99999;">
      <div class="p-5 xt-modal flex flex-col justify-center items-center" style="width:480px;height:207px;border-radius:16px">
        <div>
          <Icon icon="tishi-xianxing" style="font-size: 21px;color: orange"></Icon>
          <span class="ml-3" style="font-size: 18px;color: var(--primary-text);font-weight: 500;">是否确定删除</span>
        </div>
        <span class="mt-6 mb-8" style="font-size: 16px;color: var(--secondary-text);">删除后会同步下架分享在创意市场的小组件方案</span>
        <div class="modal-btn">
          <div class="mr-3 rounded-lg xt-bg-2 pointer" @click="promptVisible = false">取消</div>
          <div class="mr-3 rounded-lg xt-bg-2 pointer" @click="delCard(cardId)">确定</div>
        </div>
      </div>
    </Modal>
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
  import { dataList,shareList,delList } from './testData';
  import Modal from '../../Modal.vue'
  import { taskStore } from "../../../apps/task/store";
  export default{
    computed:{
      ...mapWritableState(taskStore, ["taskID", "step"]),
      m03033(){
        return this.step == 3 &&
                this.taskID == "M0303"
      }
    },
    components: {
      NewPreviewCardDetails,
      Modal
    },
    props: {
      //获取当前桌面
      desk: {
        type: Object,
        required: true,
        default: () => {},
      },
      //列表类型   默认是社区的  my是我分享的
      listType: {
        type: String,
        default: () => '',
      },
      //卡片设置   默认直接添加  my点击下拉添加或删除  tip弹出提示框
      setCard: {
        type: String,
        default: () => '',
      }
    },
    data() {
      return {
        carouselIndex: 0,
        isCardDetails: false,
        cardDetails: {},
        remoteContent: {},
        showModal: false,
        dataList,
        shareList,
        sortVal: '最多使用',
        sortType: [
          { value: '最多使用', name: '最多使用' },
          { value: '下载次数', name: '下载次数' },
          { value: '分享时间', name: '分享时间' },
        ],
        paging: 1,
        list: [],
        promptVisible: false,
        cardId: ''
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
        let size = item.sizes[0].split('x')
        this.addCard(
          {
            name: item.option[index].name,
            id: Date.now(),
            customData: {
              url:item.url,
              width: (parseInt(size[0]) / 2),
              height:(parseInt(size[1]) / 2)
            }
          },
          this.desk
        );
        this.$emit("closeMarket",false);
        message.success("添加成功！");
      },
      closeCardDetails() {
        this.isCardDetails = false;
      },
      shareNow(){
        this.$emit('shareNow')
      },
      openDelFrame(id){
        this.cardId = id
        this.promptVisible = true
      },
      delCard(id){
        delList(id)
        this.list = shareList
        this.$forceUpdate()
        this.$emit('closeMy')
      },
      showPrompt(item){
        this.$emit('getCard',item)
      },
      setImg(src,index){
        let imgDom = document.getElementById('img' + index)
          var img = new Image();
          img.src = src
          let res ;
          setTimeout(() => {
            res = {
              width: img.width,
              height: img.height
            }
            if(res.width > res.height){
              imgDom.style.width = '100px'
            }else{
              imgDom.style.height = '100px'
            }
          })
          // return img.onload = function () {
          //   res = {
          //     width: img.width,
          //     height: img.height
          //   }
          //   console.log(res);
          //   if(res.width > res.height){
          //     return {width: '100px'}
          //   }else{
          //     return {height: '100px'}
          //   }
          // }()
      },
    },
    mounted() {
      if(this.listType === 'my'){
        this.list = JSON.parse(JSON.stringify(shareList))
      }else{
        this.list = JSON.parse(JSON.stringify(dataList))
      }
    }
  }
</script>

<style lang="scss" scoped>
.head-nav{
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 76px;
  padding: 16px 29px;

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

      font-size: 16px;
      color: rgba(255, 255, 255, 0.85);
      font-weight: 500;
      height: 35px;
      line-height: 35px;
    }

    .text {

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
.block-btn{
  text-align: center;
  padding: 10px 28px;
  border-radius: 12px;
  background: var(--active-bg);
  cursor: pointer;
}
.dropdown{
  background: red;
}
.set-btn{
  width:120px;
  height:112px;
  background: var(--secondary-bg);
  border: 1px solid rgba(255,255,255,0.1);
  box-shadow: 0px 0px 20px 0px rgba(0,0,0,0.5);
  border-radius: 10px;
  position: relative;
  top: 5px;
  left: -68px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  .btn-style{
    height: 44px;
    width:104px;
    border-radius: 10px;

    font-size: 16px;
    color: var(--primary-text);
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .btn-style:hover{
    background: var(--active-secondary-bg);
  }
}
.imgInit{
  max-width: 100px;
  max-height: 100px;
}
.modal-btn {
  display: flex;
  font-size: 16px;
  color: var(--primary-text);
  > div {
    width: 120px;
    height: 44px;
    display: flex;
    justify-content: center;
    align-items: center;
    border-radius: 12px;
    background: var(--mask-bg);
  }
  >div:nth-child(2){
    background: var(--active-bg) !important;
  }
}
</style>
