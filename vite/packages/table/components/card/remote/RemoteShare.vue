<template>
  <div class="fixed inset-0 home-blur xt-mask" style="z-index: 99999;" v-if="openShare">
    <div
      class="share-modal xt-modal fixed text-white top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2  rounded-lg flex flex-col"
      style=";width: 600px;height:80%;max-height: 556px;overflow:auto;background: var(--modal-bg);">
      <div class="flex flex-col" style="width:100%;">
        <div class="head-nav">
          <div @click="close">
            <Icon icon="xiangzuo" style="color:var(--primary-text);font-size:24px"></Icon>
          </div>
          <span>分享</span>
          <div @click="$router.go(-1)">
            <Icon icon="guanbi" style="color:var(--primary-text);font-size:24px"></Icon>
          </div>
        </div>
        <div class="body-box">
          <span class="title">分享当前「外部小组件」</span>
          <div class="upload-box">
            <div class="avatar">
              <div>
                <a-avatar class="rounded-lg xt-bg-2" shape="square" :size="100" src="" />
              </div>
              <span @click="delIcon"><Icon icon="close-circle-fill" style="font-size: 28px;color: #7A7A7A;"></Icon></span>
            </div>
            <div class="ml-10 xt-text-2" style="font-family: PingFangSC-Regular;font-size: 16px;">
              <div>上传小组件预览图，不要超过2MB</div>
              <a-upload
                name="file"
                :showUploadList="false"
                :customRequest="uploadImage"
                :beforeUpload="beforeUpload"
                accept="image/jpeg,image/jpg,image/png"
              >
                <div class="pointer xt-bg-2 xt-text flex items-center rounded-lg justify-center mr-3 mt-2" 
                @click="imageSelect" style="width:120px; height:48px;">上传图片</div>
              </a-upload>
            </div>
          </div>
        <!-- <UploadImage></UploadImage> -->
          <!-- <div class="flex my-6">
            <div v-for="(item,index) in remotes" :key="index"
            :class="activeIndex === index ? 'card-active' : ''" 
            class="card-item rounded-xl text-xs"
            @click="toggleActive(index)">
              <img :src="getImg(item.name)" alt="" :style="{ zoom: '10%' }"/>
            </div>
          </div> -->
          <a-input v-model:value="name" spellcheck ="false" show-count :maxlength="20" class="input" placeholder="名称" aria-placeholder="font-size: 16px;" style="width:552px;height: 48px;"/>
          <a-textarea v-model:value="detail" :bordered="false" spellcheck="false" class="input xt-text my-6" show-count :maxlength="200" placeholder="简介（选填）" aria-placeholder="font-size: 16px;" style="width:552px;height: 122px;"/>
          <div class="flex justify-center mb-6" style="width:100%;">
            <div style="width: 120px;height: 44px;"
                class=" mr-3 flex justify-center items-center xt-text xt-bg-2 rounded-lg pointer" @click="close">
              取消
            </div>
            <div style="width: 120px;height: 44px;"
              @click="openDrawer"
              class="flex justify-center items-center bg-blue-500 rounded-lg pointer">
            立即分享
            </div>
          </div>
        </div>
      </div>
    </div>
  </div> 
</template>

<script>
  import UploadImage from '../../UploadImage.vue';
  export default{
    name: 'RemoteShare',
    components: {
      UploadImage
    },
    props: ['openShare','desk'],
    data() {
      return {
        remotes: [],
        activeIndex: 0,
        name: '',
        detail: ''
      }
    },
    methods: {
      close(){
        this.$emit('closeShare',false)
      },
      getImg(url) {
        return "/img/addCard/" + url + ".png";
      },
      toggleActive(index){
        this.activeIndex = index
      }
    },
    computed: {
    },
    mounted(){
      let remoteArr = []
      this.desk.cards.map(item => {
        if(item.name === 'Remote'){
          remoteArr.push(item)
        }
      })
      this.remotes = remoteArr
      console.log(this.remotes)
    }
  }
</script>

<style lang="scss" scoped>
.head-nav{
  width: 100%;
  height: 72px;
  padding: 12px;
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 16px;
  color: var(--primary-text);
  font-weight: 500;
  font-family: PingFangSC-Medium;
  div{
    width: 44px;
    height: 44px;
    display: flex;
    justify-content: center;
    align-items: center;
    background: var(--secondary-bg);
    border-radius: 12px;
    cursor: pointer;
  }
  >div:nth-child(1){
    position: absolute;
    left: 12px;
  }
  >div:nth-child(3){
    position: absolute;
    right: 12px;
  }
}
.body-box{
  flex: 1;
  padding: 8px 24px 0;
  .title{
    font-family: PingFangSC-Regular;
    font-size: 16px;
    color: var(--primary-text);
  }
  .avatar{
    width: 100px;
    height: 100px;
    position: relative;
    >span{
      position: absolute;
      top: -10px;
      right: -10px;
    }
  }
}
.card-item{
  width: 160px;
  height: 160px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  cursor: pointer;
}
.card-item:nth-child(2){
  margin: 0 36px;
}
.card-active{
  border: 1px solid var(--active-bg) !important; 
  background: var(--active-secondary-bg) !important;
}
.input{
  width:227px;
  height: 48px;
  background: var(--secondary-bg);
  border-radius: 12px;
  color: var(--primary-text);
  font-size: 16px;
  border: 1px solid rgba(255,255,255,0.2);
}
.upload-box{
  height: 164px;
  display: flex;
  align-items: end;
  padding: 24px 0;
}
.share-modal::-webkit-scrollbar{
  display: none;
}
</style>