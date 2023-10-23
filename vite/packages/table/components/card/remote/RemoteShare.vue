<template>
  <div class="fixed inset-0 home-blur xt-mask" style="z-index: 99999;" v-if="openShare">
    <div
      class="share-modal xt-modal fixed text-white top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2  rounded-lg flex flex-col"
      style=";width: 600px;height:80%;max-height: 556px;overflow:auto;background: var(--modal-bg);">
      <div class="flex flex-col" style="width:100%;">
        <div class="head-nav">
          <div @click="close" v-show="!direct">
            <Icon icon="xiangzuo" style="color:var(--primary-text);font-size:24px"></Icon>
          </div>
          <span>分享</span>
          <div @click="$router.go(-1)">
            <Icon icon="guanbi" style="color:var(--primary-text);font-size:24px"></Icon>
          </div>
        </div>
        <div class="body-box">
          <div>
            <div class="left-img" ref="sizeBox" id="capture">
              <div :style="{ zoom: zoom + '%' }">
                <Remote :desk="desk" :notTrigger="notTrigger" :customIndex="cardId" :customData="card.customData"></Remote>
              </div>
            </div>
            <div class="upload-box">
              <div>
                <div class="avatar">
                  <div>
                    <a-avatar class="rounded-lg xt-bg-2" shape="square" :size="100" :src="img" />
                  </div>
                  <span v-if="img" @click="delImg"><Icon icon="close-circle-fill" style="font-size: 28px;color: #7A7A7A;"></Icon></span>
                </div>
                <a-upload class="pointer" :style="size"
                @change="uplaodImageChange"
                :before-upload="beforeUpload"
                :show-upload-list="false"
                >
                  <div class="pointer xt-bg-2 xt-text flex items-center rounded-lg justify-center mr-3 mt-4"
                  @click="imageSelect" style="width:100px; height:48px;">上传图片</div>
                </a-upload>
              </div>
              <div class="ml-6 xt-text-2" style="font-size: 16px;color:var(--secondary-text)">
                <div>上传小组件预览图，不要超过2MB（暂时建议手动截取合适的图片）</div>
              </div>
            </div>
          </div>
          <!-- <div class="flex my-6">
            <div v-for="(item,index) in remotes" :key="index"
            :class="activeIndex === index ? 'card-active' : ''"
            class="card-item rounded-xl text-xs"
            @click="toggleActive(index)">
              <img :src="getImg(item.name)" alt="" :style="{ zoom: '10%' }"/>
            </div>
          </div> -->
          <div class="right-box">
            <div class="box-item">
              <span>小组件类型</span>
              <span class="truncate ml-3 text-right" style="flex:1;">外部小组件</span>
            </div>
            <div class="box-item">
              <span>小组件尺寸</span>
              <span>{{ cardSize }}</span>
            </div>
            <div class="box-item">
              <span>隐藏边框</span>
              <span>{{ card.customData?.hideFrame ? '是' : '否' }}</span>
            </div>
            <div class="box-item">
              <span>连接地址</span>
                <span class="truncate ml-3 text-right" style="flex:1;">{{card.customData?.url}}</span>
            </div>
            <a-input v-model:value="name" spellcheck ="false" show-count :maxlength="20" class="input" placeholder="名称" aria-placeholder="font-size: 16px;" style="width:266px;height: 48px;"/>
            <a-textarea v-model:value="detail" :bordered="false" spellcheck="false" class="input xt-text my-4" show-count :maxlength="200" placeholder="简介（可选）" aria-placeholder="font-size: 16px;" style="width:266px;height: 156px;"/>
          </div>
        </div>
        <div class="flex justify-center mt-3 mb-6" style="width:100%;">
          <div style="width: 120px;height: 44px;font-size: 16px;"
              class=" mr-3 flex justify-center items-center xt-text xt-bg-2 rounded-lg pointer" @click="scrub">
            取消
          </div>
          <div style="width: 120px;height: 44px;font-size: 16px;"
            @click="shareNow"
            class="flex justify-center items-center bg-blue-500 rounded-lg pointer">
          立即分享
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import { defineAsyncComponent } from 'vue'
  import api from '../../../../../src/model/api';
  import { message } from 'ant-design-vue';
  import cache from '../hooks/cache';
  import {setList} from './testData'
  import {nanoid} from 'nanoid'
  import {completeTask } from "../../../apps/task/page/branch/task.ts"
  import { mapActions } from "pinia"
  const Remote = defineAsyncComponent(() => import('../../widgets/custom/Remote.vue'))
  import html2canvas from "html2canvas";
  export default{
    name: 'RemoteShare',
    components: {
      Remote,
    },
    props: ['openShare','desk','cardId','direct'],
    data() {
      return {
        remotes: [],
        activeIndex: 0,
        name: '',
        detail: '',
        img: '',
        card: {},
        notTrigger: true,
        cardSize: '',
        zoom: 0
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
      },
      uplaodImageChange(info){  // info 上传文件的所有信息
        const formData = new FormData();
        formData.append("file", info.file)
        api.postCosUpload(formData,(err,res)=>{
          if(!err){
            message.error('数据上传失败')
          }else{
            const img = 'http://'+ res.data.data
            if(img){
              message.success('自定义头像上传成功')
              this.img = img
            }
            // cache.set('avatar_url',img)
          }
        })
      },
      beforeUpload(file){  // 上传之前的准备工作
        const regex =  /^image\/(jpeg|png|jpg)$/;  // 通过正则表达式匹配是否指定的png jpg jpeg的类型文件
        const isFileType = !regex.test(file.type)
        if(isFileType){
          message.error('只能上传JPG和PNG格式图片');
        }
        const isLt2M = file.size / 1024 / 1024 < 2;
        if (!isLt2M) {
          message.error('上传图片不能大于2MB');
        }
        return isFileType && isLt2M;
      },
      delImg(){
        this.img = ''
      },
      shareNow(){
        if(!this.img.trim())return message.info('图片不能为空')
        if(!this.name.trim())return message.info('名称不能为空')
        const time = new Date().valueOf()
        let cardContent = {
          nanoid: nanoid(4),
          "name": "remote",
          "cname": this.name,
          "detail": this.detail,
          url: this.card.customData.url,
          sizes: [this.cardSize],
          option: [
            {
              img: this.img,
              name: 'Remote',
              size: [this.cardSize],
              zoom: '11'
            },
          ],
          time,
          "download": 0,
          "avatar": '/icons/logo128.png',
          "nickname": 'Victor Ruiz',
        }
        completeTask('Z0302')
        setList(cardContent)

        message.success('添加成功')
        // if(this.direct){
        //   this.$router.go(-1)
        //   return
        // }
        // this.close()
        this.$emit('closeShare',false,false)
      },
      scrub(){
        this.direct ? this.$router.go(-1) : this.close()
      }
    },
    mounted(){
      let deskCard =  cache.get('cardSize')
      const { width, height } = this.$refs.sizeBox.getBoundingClientRect();
      // console.log(deskCard)
      // console.log(width,height)
      let zoom = JSON.parse(JSON.stringify(this.desk.settings.cardZoom))
      // console.log(this.desk)
      // console.log(zoom)
      if(deskCard.width >= deskCard.height){
        this.zoom = (width * zoom / deskCard.width).toFixed()
      }else{
        this.zoom = (height * zoom / deskCard.height).toFixed()
      }
      // console.log(this.zoom)
      this.card = this.desk.cards.find(item => item.id === parseInt(this.cardId))
      this.cardSize = this.card.customData.width*2 + 'x' + this.card.customData.height*2

      // this.card = cache.get('currentCard')
      // let remoteArr = []
      // this.desk.cards.map(item => {
      //   if(item.name === 'Remote'){
      //     remoteArr.push(item)
      //   }
      // })
      // this.remotes = remoteArr
      // console.log(this.remotes)


      // html2canvas(document.querySelector("#capture"),{useCORS: true}).then(canvas => {
      //   document.body.appendChild(canvas);
      //   const base64 = canvas.toDataURL();	// 可生成base64
      //   console.log(base64)
      // })

      // var htmlcanvas = document.getElementById("capture");
      // html2canvas(htmlcanvas,{
      //   onrendered: function(canvas){
      //     var img = new Image();
      //     img.src = canvas.toDataURL(); //生成base64图片
      //     console.log(img)
      //     // document.getElementById("photo").appendChild(img);　
      //     // base64Canvas = canvas.toDataURL();
      //   }
      // })
    },
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
  height: 380px;
  margin: 12px 24px ;
  display: flex;
  justify-content: space-between;
  .left-img{
    background: var(--secondary-bg);
    border-radius: 12px;
    width: 270px;
    height: 184px;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .right-box{
    width: 266px;
    margin-bottom: 15px;
    .box-item{
      display: flex;
      justify-content: space-between;
      margin-bottom: 15px;
      >span:nth-child(1){
        font-size: 16px;
        color: var(--disable-text);
      }
      >span:nth-child(2){
        font-size: 16px;
        color: var(--primary-text);
      }
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
  display: flex;
  padding: 27px 34px 0 0;
  align-items: center;
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
.share-modal::-webkit-scrollbar{
  display: none;
}
</style>
