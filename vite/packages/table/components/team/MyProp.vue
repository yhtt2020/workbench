<template>
  <div class="fixed inset-0 home-blur xt-mask" style="z-index: 99;" v-if="showMyProp" >
   <div
   class="xt-modal fixed text-white top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2  rounded-lg flex flex-col justify-evenly items-center"
   style="padding: 0 16px;width: 656px;height: 480px;background:  #282828">
     <div class="box-head">
       <span class="title">我的道具</span>
       <div @click="onBack" class="head-icon xt-text">
         <Icon icon="guanbi" style="font-size: 1.5em;"></Icon>
       </div>
     </div>
   <div v-if="frameList.length===0">
     <a-empty style="margin-top:40%" image="/img/test/load-ail.png" description="暂无可用头像框"/>
   </div>
    <div class="prop-scroll">
      <div v-for="item in frameList" :key="item.id">
        <tippy :z-index="99" trigger="mouseenter" :interactive="true">
          <div class="prop-item">
            <a-avatar shape="square"  :size="80"  :src="item.image" class="w-full h-full object-cover " style="" alt=""></a-avatar>
            <span class="rank-font">{{ item.alias }}</span>
            <div v-if="item.equipped" class="prop-text">使用中</div>
          </div>
          <template #content>
            <div class="p-2" style="width: 320px">
              <div class="mb-2">
                <a-row>
                  <a-col :span="10">
                    <a-avatar shape="square"  :size="100"  :src="item.image" class="w-full h-full object-cover " style="" alt=""></a-avatar>
                  </a-col>
                  <a-col class="text-left" :span="14">
                    <div class="mt-6">
                      <span class="avatar-font mr-2 font-bold" :style="titleTagColor(item.detail.rarity)">
                        {{ item.alias }}
                      </span>
                      <span class="h-6 rank-font rounded py-0.5 px-2 my-2.5" :style="avatarTagColor(item.detail.rarity)">
                        {{ textTag(item.detail.rarity) }}
                      </span>
                    </div>
                    <div style="font-size: 12px" class="xt-text-2 mt-1">
                      {{ item.summary }}
                    </div>

                  </a-col>
                </a-row>
                <div class="xt-bg-2 mb-4" style="width:100%;border-radius: 12px;">
                  <div class="text-content">
                    <span>获取方式</span>
                    <span>{{ avatarGainMethodText(item.detail.gainMethod) }}</span>
                  </div>
                  <div class="text-content">
                    <span>获取时间</span>
                    <span>{{ item.updateTime.split(' ')[0] }}</span>
                  </div>
                  <!-- <div class="text-content">
                    <span>已售</span>
                    <span>{{item.ownersCount[1]}} 件</span>
                  </div> -->
                  <div class="text-content" v-if="item.ownersCount">
                    <span>已售</span>
                    <span class="flex items-center">
                      <span class="mr-2">{{item.ownersCount[1]}} 件</span>
                      <a-avatar-group>
                        <a-avatar class="pointer" v-for="owner in item.ownersCount[0]"  :src="owner.userInfo.avatar" @click="showUserCard(owner.uid,owner.userInfo)"></a-avatar>
                      </a-avatar-group>
                    </span>
                  </div>
                </div>

                <a-button v-if="!item.equipped" @click="equip(item)" type="primary" class="rounded-xl h-12 w-full"
                          style="margin-right: 0;color: var(--active-text);">
                  使用
                </a-button>
                <a-button v-else class="rounded-xl h-12  w-full xt-text-2"
                          style="background: rgba(80,139,254,0.20);color: var(--disable-text);">
                  使用中
                </a-button>
              </div>
            </div>
          </template>
        </tippy>
      </div>
   </div>
  </div>
 </div>
</template>

<script lang="ts">
import {
 avatarBgColor,
 avatarGainMethodText,
 avatarTagColor,
 drawHeaderImage,
 textTag,
 titleTagColor
} from "../../js/common/avatar";
import {mapActions, mapState} from "pinia";
import {frameStore} from "../../store/avatarFrame";
import {message} from 'ant-design-vue'
import {appStore} from "../../store";
import {teamStore} from "../../store/team";
import FrameAvatar from "../avatar/FrameAvatar.vue";
import Modal from "../Modal.vue";

export default {
 name: "MyFrames",
 components: {Modal, FrameAvatar},
 props: {
   showMyProp: {
     type: Boolean,
     default: () => false
   },
 },
 data() {
   return {
     currentItem: {},
     downloadVisible: false,//下载
     frameList: [],
     canvas:null,
     ctx:null,
     ownersCount: 0,
     frames: {}
   }
 },
 computed: {
   ...mapState(teamStore, ['team']),
   ...mapState(appStore, ['userInfo']),
   ...mapState(frameStore, ['frameData']),
 },
 mounted() {
   let frames = JSON.parse(localStorage.getItem('frames')) || {}
   if((Object.keys(this.frameData).length)  && JSON.stringify(frames)===JSON.stringify(this.frameData)){
    this.frames = frames
    // console.log('相等',this.frames)
   }else {
    // console.log('不相等')
     this.getFrameGoods()
   }

   this.getMyFrames().then(rs => {
    if (rs.status) {
      this.frameList = rs.data.map(itemOwner => {
        return {
        ...itemOwner.item,
        }
      })
    }
   })
 },
 watch: {
   showMyProp(val){
     if(val === true){
       if(!!this.frames){
         this.frames = this.frameData
         localStorage.setItem('frames', JSON.stringify(this.frameData))
       }
       this.frames.list.map((item) => {
         this.frameList.forEach(f => {
           if(item.alias === f.alias){
             f.ownersCount = item.ownersCount
           }
         })
       })

     }
   },
 },
 methods: {
   ...mapActions(frameStore, ['getMyFrames', 'equipFrame','getFrameGoods']),
   ...mapActions(appStore, ['getUserInfo','showUserCard']),
   ...mapActions(teamStore, ['refreshTeamUsers']),
   avatarTagColor, textTag, titleTagColor, avatarBgColor, avatarGainMethodText,
   async equip(item) {
     let rs = await this.equipFrame(item.nanoid)
     if (rs && rs.status) {
       this.frameList.forEach(i => {
         i.equipped = false
       })
       item.equipped = true
       this.getUserInfo()
       this.refreshTeamUsers()
       message.success('装备成功。')
     } else {
       message.error('装备失败，请稍后再试。')
     }
   },
   download(item) {

     this.currentItem = item

     drawHeaderImage(128, 128, 80, 128, item.image, this.userInfo.avatar, (canvas, ctx) => {
       document.getElementById('downloadContainer').appendChild(canvas)
       this.canvas=canvas
       this.ctx=ctx
     })
     this.downloadVisible = true

   },
   async doDownload() {

     let filters = {name: '图片', extensions: ['png']}
     let savePath = await tsbApi.dialog.showSaveDialog({
       title: '选择保存位置',
       defaultPath: this.recentFileName,
       message: '选择保存的位置',
       filters: [filters],
       properties: [
         'createDirectory',
         'showOverwriteConfirmation'
       ]
     })
     const base64 = this.canvas.toDataURL('image/png',1)
     function dataURLToBlob(fileDataURL) {
       let arr = fileDataURL.split(','),
         mime = arr[0].match(/:(.*?);/)[1],
         bstr = atob(arr[1]),
         n = bstr.length,
         u8arr = new Uint8Array(n)
       while (n--) {
         u8arr[n] = bstr.charCodeAt(n)
       }
       return new Blob([u8arr], { type: mime })
     }
     require('fs').writeFile(savePath,Buffer.from(await dataURLToBlob(base64).arrayBuffer()), (err) => {
       if (err) throw err;
       console.log('The file has been saved!');
     });

   },
   onBack(){
     this.$emit('closeMyProp',false)
   }
 }
}
</script>

<style scoped lang="scss">
 .box-head{
   height: 76px;
   line-height: 72px;
   .title{
     font-size: 16px;
     color: var(--primary-text);
   }
   .head-icon{
     cursor: pointer;
     height: 48px;
     width: 48px;
     display: flex;
     align-items: center;
     border-radius: 12px;
     justify-content: center;
     position: absolute;
     background: var(--secondary-bg);
     top: 12px;
     right: 12px;
   }
 }
 .prop-item{
   width: 140px;
   height: 140px;
   border-radius: 12px;
   background: var(--secondary-bg);
   margin: 0 8px 16px;
   padding: 16px 0;
   display: flex;
   flex-direction: column;
   align-items: center;
   justify-content: space-between;
   color: var(--primary-text);
   position: relative;
   .prop-text{
     position: absolute;
     top: 8px;
     right: 8px;
     border-radius: 4px;
     background: var(--active-bg);
     color: var(--primary-text);
     font-size: 12px;
     padding: 1px 4px;
   }
 }
 .prop-scroll{
  flex:1;
  width:100%;
  overflow: auto;
  display: flex;
  flex-wrap: wrap;
 }
 .prop-scroll::-webkit-scrollbar{
  display: none;
 }

.avatar-font {
 font-family: Oswald;
 font-size: 16px;
 font-weight: 500;
}

.rank-font {

 font-size: 14px;
 color: var(--primary-text);
 font-weight: 500;
 text-align: center;
}

.text-content{
 display: flex;
 align-items: center;
 justify-content: space-between;
 height: 48px;
 padding: 0 16px;
}
.text-content span:nth-child(1){
 color: var(--secondary-text);
}
.text-content span:nth-child(2){
 color: var(--primary-text);
}
</style>
