<template>
    <div style='width:400px;height:400px;background: #212121;border: 1px solid rgba(255,255,255,0.1);box-shadow: 0px 0px 10px 0px rgba(0,0,0,0.5);border-radius: 10px;top: 175px;' class="float-icon">
      <!--  -->
      <!-- <div class="top-triangle"></div> -->
      <div class="top-icon flex">
        <div class="type-select flex">
          <span @click="onSelChange(1)" :class="selIndex == 1 ? 'active':''">Emojis</span>
          <span @click="onSelChange(2)" :class="selIndex == 2 ? 'active':''">Icons</span>
          <span @click="onSelChange(3)" v-if="this.isCustom" :class="selIndex == 3 ? 'active':''">自定义</span>
        </div>
        <div class="flex items-center pointer" @click="clearAvatar">移除</div>
      </div>
      <div class="action-search pl-3 pr-3 pt-3 flex" style="justify-content: space-between;" v-if="selIndex != 3">
        <a-input
          style="width:280px;height:40px;background: #191919;
          border: 1px solid rgba(255,255,255,0.1);
          border-radius: 10px;"
          placeholder="搜索"
        />
        <!-- 随机 -->
        <div class="flex justify-center items-center pointer"  style="width: 40px;height:40px;background: #2A2A2A;border-radius: 10px;" @click="onRandom">
          <Icon class="pointer" :icon="icons.arrowSync20Filled"  width="20" height="20"/>
        </div>
        <!-- 颜色选择 -->
        <div v-show="selIndex == 2" class="flex justify-center items-center pointer" style="width: 40px;height:40px;background: #2A2A2A;border-radius: 10px;position: relative;" @click="isShowBgColor=!isShowBgColor">
          <div class="circle" :style="{background:bgColor[selBgColor]}" ></div>
          <!--  -->
          <div class="select-color flex" v-show="isShowBgColor" style="flex-wrap: wrap;z-index: 100;">
            <div v-for="(item,index) in bgColor" class="flex justify-center items-center pointer mt-3 ml-3" style='width: 40px;height:40px;border-radius: 10px;' :class="selBgColor == index ? 'sel-active':''" @click="changeBgColor(index)">
              <div class="circle" :style="{background:bgColor[index]}" @click="onChangeColor"></div>
            </div>
          </div>
        </div>
        

      </div>
      <!-- emojis -->
      <div v-if="this.selIndex == 1" class="flex pl-1 pr-1 overflow-hidden overflow-y-auto xt-scrollbar" style="flex-wrap: wrap;height: 290px;">
        <div v-for="(item,index) in emojisList" :key="index" @click="onSelectIcon(index,'emoji',item.name)" class="flex justify-center items-center mt-2 ml-2 pointer" style="width: 40px;height:40px;border-radius: 10px;" :class="selectIcon == index ? 'sel-active':''">
          <img :src="'https://a.apps.vip/icons/iconSelect/emoji/'+item.name+'.svg'" :alt="item.alias" width="32" height="32">
        </div>
      </div>
      <!-- icon -->
      <div v-else-if="this.selIndex == 2" class="flex pl-1 pr-1 overflow-hidden overflow-y-auto xt-scrollbar" style="flex-wrap: wrap;height: 290px;">
        <div v-for="(item,index) in iconList" :key="index" @click="onSelectIcon(index,'icon',item.name)" class="flex justify-center items-center mt-2 ml-2 pointer overflow-hidden" style="width: 40px;height:40px;border-radius: 10px;" :class="selectIcon == index ? 'sel-active':''">
          <img :style="{'filter': `drop-shadow(${bgColor[selBgColor]} 80px 0)`,transform:'translateX(-80px)'}"  :src="'https://a.apps.vip/icons/iconSelect/icon/'+item.name+'.svg'" :alt="item.alias"  width="20" height="20">
        </div>
      </div>
      <div v-else class="flex pl-1 pr-1 items-center" style="flex-wrap: wrap;flex-direction:column;">
        <input type="file" id="groupFileID" style="display:none;" @change="getFileInfo($event)">
        <div v-if="!avatarUrl" class="pointer" @click="updateGroupAvatar()" style="margin-top: 98px;height: 64px;width: 64px;background: #2A2A2A;border: 1px solid rgba(255,255,255,0.1);border-radius: 6px;"></div>
        <a-avatar style="margin-top: 98px;" v-else shape="square" :size="64" :src="avatarUrl"></a-avatar>
        <div class="mt-4" style="font-size: 14px;color: rgba(255,255,255,0.60);">{{ this.customTitle }}</div>
        <div class="xt-active-btn mt-4" style="width:64px;height:40px;" @click="changeAvatar">确定</div>
        
      </div>


    </div>


</template>
  
  <script>
  import { Icon } from '@iconify/vue';
  import arrowSync20Filled from '@iconify-icons/fluent/arrow-sync-20-filled';
  import emojis from '../components/IconListData/emojis'
  import icon from '../components/IconListData/icon'
  import {fileUpload} from '../../table/components/card/hooks/imageProcessing'
  export default {
    name: "SelectIcon",
    components: {
      Icon,
      emojis,
      icon,
    },
    props:{
      isCustom:String,
      customTitle:String,

    },
    // props:['isCustom','customTitle'],
    data() {
      return { 
        // 头像
        avatarUrl:'',
        // 选择图标的类型
        selIndex:1,
        searchValue:'',
        // 选择的第几个图标
        selectIcon:-1,
        selBgColor:0,
        bgColor:['#555555','#666666','#777777','#000000','#222222','#333333'],
        isShowBgColor:false,
        icons:{
          arrowSync20Filled
        },
        iconList:icon.list,
        emojisList:emojis.list,
      }  
    },
    
    methods: {
      // 选择图标类型
      onSelChange(n){
        this.selIndex = n
        this.selectIcon = -1
      },
      // 选择第几个图标
      onSelectIcon(n,type,url){
        this.selectIcon = n
        if(type=='emoji'){
          this.$emit('getAvatar','https://a.apps.vip/icons/iconSelect/emoji/'+url+'.svg')
        }else if(type == 'icon'){
          // console.log(this.bgColor[this.selBgColor]);
          this.$emit('getAvatar','https://a.apps.vip/icons/iconSelect/icon/'+url+'.svg?color=' + this.bgColor[this.selBgColor])
        }
      },
      //随机图标 
      onRandom(){
        let randomNum = this.selIndex==1?this.emojisList.length:this.iconList.length
        this.selectIcon = Math.round(Math.random()*48);
      },
      setSvgColor(){

      },
      changeBgColor(n){
        this.selBgColor = n
      },
      // 上传文件
      async getFileInfo(evt){
        const files = evt.target.files[0]
        const res  = await fileUpload(files)
        // console.log('获取头像::>>',res)
        this.avatarUrl = res
        this.$emit('getAvatar',this.avatarUrl)
      },
      // 更换头像
      async updateGroupAvatar(){
        document.querySelector('#groupFileID').click()
      },
      // 清楚已上传信息
      clearAvatar(){
        this.avatarUrl=''
      },
      // 上传文件确认
      changeAvatar(){
        this.$emit('getAvatar',this.avatarUrl)
      },

    },
  }
  </script>
  
  <style lang="scss" scoped>
  .top-triangle{
    width: 0;
    height: 0;
    display: flex;
    border: 10px solid transparent;
    border-bottom-color: #212121;
    position: absolute;
    top:-20px;
    left: 195px;

  }
  .float-icon{
    position: absolute;
    z-index: 100;
    top: 50%;
  }
    .top-icon{
      height: 48px;
      border-bottom: 1px solid rgba(255,255,255,0.10);
      padding: 0 16px;
      justify-content: space-between;
    }

    .top-icon .type-select{
      
    }
    
    .top-icon .type-select span{
      display: flex;
      height: 48px;
      font-family: PingFangSC-Semibold;
      font-size: 14px;
      color: rgba(255,255,255,0.85);
      font-weight: 400;
      align-items: center;
      margin-right: 16px;
      cursor: pointer;
      border-bottom: 2px solid transparent;
    }

    
    .active{
      font-weight: 600 !important;
      border-bottom: 2px solid #508BFE !important;
      border-radius: 2px;
    }

    .sel-active{
      background: rgba(80,139,254,0.20);
    }

    .circle{
      width: 20px;
      height: 20px;
      border-radius: 50%;
    }

    .select-color{
      width:166px;
      height:116px;
      background: #212121;
      border: 1px solid rgba(255,255,255,0.1);
      box-shadow: 0px 0px 10px 0px rgba(0,0,0,0.5);
      border-radius: 8px;
      position: absolute;
      top: 45px;
      left: -125px;
    }


  </style>
  