<template>
    <div style='width:400px;height:400px;background: #212121;border: 1px solid rgba(255,255,255,0.1);box-shadow: 0px 0px 10px 0px rgba(0,0,0,0.5);border-radius: 10px;top: 175px;' class="float-icon" id="selectIcon">
      <!--  -->
      <div class="top-icon flex">
        <div class="type-select flex">
          <span @click="onSelChange(1)" :class="selIndex == 1 ? 'active':''">Emojis</span>
          <span @click="onSelChange(2)" v-show="goodVisible" :class="selIndex == 2 ? 'active':''">Icons</span>
          <span @click="onSelChange(3)" v-if="this.isCustom" :class="selIndex == 3 ? 'active':''">自定义</span>
        </div>
        <div class="flex items-center pointer" @click="clearAvatar">移除</div>
      </div>
      <div class="action-search pl-3 pr-3 pt-3 flex" style="justify-content: space-between;" v-if="selIndex != 3">
        <a-input
          style="height:40px;background: #191919;
          border: 1px solid rgba(255,255,255,0.1);flex:1;width: 80%;
          border-radius: 10px;"
          placeholder="搜索"
          v-model:value="searchValue"
          @change="searchIcon"
        />
        <!-- 随机 -->
        <a-tooltip>
          <template #title>随机</template>
          <xt-button class="flex justify-center items-center ml-3" :w="40" :h="40"  style="background: #2A2A2A;border-radius: 10px;" @click="onRandom">
            <Icon class="pointer flex items-center" :icon="icons.arrowSync20Filled"  width="20" height="20"/>
          </xt-button>
        </a-tooltip>
        <!-- 颜色选择 -->
        <div v-show="selIndex == 2" class="flex justify-center items-center pointer ml-3" style="width: 40px;height:40px;background: #2A2A2A;border-radius: 10px;position: relative;" @click="isShowBgColor=!isShowBgColor">
          
          <a-tooltip>
            <template #title>颜色选择</template>
            <!-- <div class="circle" :style="{background:bgColor[selBgColor]}" ></div> -->
            <div class="circle" :style="{background:bgColor[selBgColor]}" ></div>
          </a-tooltip>
          
          <div class="select-color" v-show="isShowBgColor" style="flex-wrap: wrap;z-index: 100;">
            <div class="ml-4 mt-2">自定义</div>
            <div style='width: 40px;height:40px;border-radius: 10px;' class="flex justify-center items-center mt-1 ml-3" :class="selBgColor == 6 ? 'sel-active':''">
              <XtBaseColor v-model:data="bgColor[6]" @click="changeBgColor(6)"></XtBaseColor>
            </div>
            <div class="ml-4 mt-1">系统预设</div>
            <div class="flex flex-wrap">
              <div v-for="(item,index) in bgColor.slice(0,6)" class="flex justify-center items-center pointer mt-2 ml-3" style='width: 40px;height:40px;border-radius: 10px;' :class="selBgColor == index ? 'sel-active':''" @click="changeBgColor(index)">
                <div class="circle" :style="{background:bgColor[index]}"></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 搜索结果 -->
      <div v-if="searchValue" class="flex pl-1 pr-1 overflow-hidden overflow-y-auto xt-scrollbar flex-wrap" style="height: 290px;">
        <div v-for="(item,index) in searchIcon" :key="index" @click="onSelectIcon(index,'emoji',item.name)" class="flex justify-center items-center mt-2 ml-2 pointer" style="width: 40px;height:40px;border-radius: 10px;" :class="selectIcon == index ? 'sel-active':''">
          <a-tooltip v-if="goodVisible">
            <template #title>{{ item.alias }}</template>
            <a-avatar v-show="selIndex==1" :src="'https://a.apps.vip/icons/iconSelect/emoji/'+item.name+'.svg'" :alt="item.alias" width="32" height="32"></a-avatar>
            <a-avatar v-show="selIndex==2"  :style="{'filter': `drop-shadow(${bgColor[selBgColor]} 80px 0)`,transform:'translateX(-80px)'}"  :src="'https://a.apps.vip/icons/iconSelect/icon/'+item.name+'.svg'" :alt="item.alias"  width="20" height="20"></a-avatar>
          </a-tooltip>
          <a-tooltip v-else>
            <template #title>{{ item.alias }}</template>
            <a-avatar v-show="selIndex==1" :src="'https://a.apps.vip/icons/goodSelect/'+item.name+'.svg'" :alt="item.alias" width="32" height="32"></a-avatar>
          </a-tooltip>
        </div>
      </div>
      <!-- emojis -->
      <div v-else-if="this.selIndex == 1" class="flex pl-1 pr-1 overflow-hidden overflow-y-auto xt-scrollbar flex-wrap" style="height: 290px;">
        <div v-for="(item,index) in emojisList" :key="index" @click="onSelectIcon(index,'emoji',item.name)" class="flex justify-center items-center mt-2 ml-2 pointer" style="width: 40px;height:40px;border-radius: 10px;" :class="selectIcon == index ? 'sel-active':''">
          <a-tooltip>
            <template #title>{{ item.alias }}</template>
            <a-avatar v-if="goodVisible" :src="'https://a.apps.vip/icons/iconSelect/emoji/'+item.name+'.svg'" :alt="item.alias" width="32" height="32"></a-avatar>
            <a-avatar v-else :src="'https://a.apps.vip/icons/goodSelect/'+item.name+'.svg'" :alt="item.alias" width="32" height="32"></a-avatar>
          </a-tooltip>
        </div>
      </div>
      <!-- icon -->
      <div v-else-if="this.selIndex == 2" class="flex pl-1 pr-1 overflow-hidden overflow-y-auto xt-scrollbar flex-wrap" style="height: 290px;">
        <div v-for="(item,index) in iconList" :key="index" @click="onSelectIcon(index,'icon',item.name)" class="flex justify-center items-center mt-2 ml-2 pointer overflow-hidden" style="width: 40px;height:40px;border-radius: 10px;" :class="selectIcon == index ? 'sel-active':''">
          <a-tooltip>
            <template #title>{{ item.alias }}</template>
            <div>
              <a-avatar :style="{'filter': `drop-shadow(${bgColor[selBgColor]} 80px 0)`,transform:'translateX(-80px)'}"  :src="'https://a.apps.vip/icons/iconSelect/icon/'+item.name+'.svg'" :alt="item.alias"  width="20" height="20"></a-avatar>
            </div>
          </a-tooltip>
        </div>
      </div>
      <div v-else class="flex pl-1 pr-1 items-center flex-wrap flex-col" style="height:330px;">
        <input type="file" id="groupFileID" style="display:none;" @change="getFileInfo($event)">
        <div v-if="!avatarUrl" class="pointer flex justify-center items-center" @click="updateGroupAvatar()" style="margin-top: 98px;height: 64px;width: 64px;background: #2A2A2A;border: 1px dashed rgba(255,255,255,0.1);border-radius: 6px;">
          <Icon :icon="icons.add16Filled" width="20" height="20"/>
        </div>
        <a-avatar style="margin-top: 98px;" v-else shape="square" :size="64" :src="avatarUrl"></a-avatar>
        <div class="mt-4" style="font-size: 14px;color: rgba(255,255,255,0.60);">{{ this.customTitle }}</div>
        <xt-button class="xt-active-btn mt-4" style="width:64px;height:40px;" @click="changeAvatar">确定</xt-button>
        
      </div>


    </div>


</template>
  
  <script>
  import icon from '../components/IconListData/icon'
  import emojis from '../components/IconListData/emojis'
  import { goodList } from '../components/goods'
  import {fileUpload} from '../../table/components/card/hooks/imageProcessing'
  import { Icon } from '@iconify/vue';
  import arrowSync20Filled from '@iconify-icons/fluent/arrow-sync-20-filled';
  import add16Filled from '@iconify-icons/fluent/add-16-filled';
  export default {
    name: "SelectIcon",
    components: {
      Icon,
      emojis,
      icon,
    },
    props:{
      isCustom:Boolean,
      customTitle:String,
      windowHeight:Number,
      goodVisible:Boolean,
    },
          
    computed:{
      searchIcon(){
        let tmpList = []
        if (this.selIndex == 1) {
          this.emojisList.forEach((value, index)=>{
            if ((value.alias.indexOf(this.searchValue) >= 0)  || (value.name.indexOf(this.searchValue) >= 0)) {
              tmpList.push(value)
            }
          })

        }
        else if(this.selIndex == 2){
          this.iconList.forEach((value, index)=>{
            if ((value.alias.indexOf(this.searchValue) >= 0)  || (value.name.indexOf(this.searchValue) >= 0)) {
              tmpList.push(value)
            }
          })
        }
        this.searchList = tmpList
        return this.searchList
      },
    },
    data() {
      return { 
        // 上传头像
        avatarUrl:'',
        // 选择图标的类型
        selIndex:1,
        // 搜索内容
        searchValue:'',
        // 搜索结果渲染
        searchList:[],
        // 选择的第几个图标
        selectIcon:-1,
        selBgColor:0,
        bgColor:['#508bfe','#ff6c61','#73cf77','#3dffed','#ed7149','#ffffff','#000000'],
        isShowBgColor:false,
        icons:{
          arrowSync20Filled,
				  add16Filled,
        },
        iconList:icon.list,
        emojisList:this.goodVisible ?  emojis.list : goodList,
        topHeight:0,
        
      }  
    },
    mounted(){
      this.topHeight = document.getElementById('selectIcon').getBoundingClientRect().top;
      // console.log(111111111111);
    },
    
    methods: {
      // 选择图标类型
      onSelChange(n){
        this.selIndex = n
        this.selectIcon = -1
        this.searchValue = ''
      },

      // 选择图标
      onSelectIcon(n,type,url){
        this.selectIcon = n
        if(this.selIndex==1){
          
          if(this.goodVisible){
            this.$emit('getAvatar','https://a.apps.vip/icons/iconSelect/emoji/'+url+'.svg')
          }else{
            this.$emit('getAvatar','https://a.apps.vip/icons/goodSelect/'+url+'.svg')
          }
        }else{
          this.$emit('getAvatar','https://a.apps.vip/icons/iconSelect/icon/'+url+'.svg?color=' + this.bgColor[this.selBgColor])
        }
        
        this.$emit('isIconShow')

      },

      //随机图标 
      onRandom(){
        let randomLength = this.selIndex==1?this.emojisList.length:this.iconList.length
        let randomNum = Math.round(Math.random()*randomLength);
        this.selectIcon = randomNum;
        if(this.selIndex == 1){
          if(this.goodVisible){
            this.$emit('getAvatar','https://a.apps.vip/icons/iconSelect/emoji/'+this.emojisList[randomNum].name+'.svg')
          }else{
            this.$emit('getAvatar','https://a.apps.vip/icons/goodSelect/'+this.emojisList[randomNum].name+'.svg')
          }
        }else{
          this.$emit('getAvatar','https://a.apps.vip/icons/iconSelect/icon/'+this.iconList[randomNum].name+'.svg?color=' + this.bgColor[this.selBgColor])
        }
      },

      // 改变颜色
      changeBgColor(n){
        this.selBgColor = n
        if(this.selIndex==2){
          this.$emit('getAvatar','https://a.apps.vip/icons/iconSelect/icon/'+this.iconList[this.selectIcon].name+'.svg?color=' + this.bgColor[this.selBgColor])
        }
      },

      // 上传文件
      async getFileInfo(evt){
        const files = evt.target.files[0]
        const res  = await fileUpload(files)
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
        this.$emit('getAvatar','https://jxxt-1257689580.cos.ap-chengdu.myqcloud.com/jmPD-I__T-SMyc-LMzn')

      },
      // 确认
      changeAvatar(){
        this.$emit('getAvatar',this.avatarUrl)
        
        this.$emit('isIconShow')
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

  .float-icon :deep(.ant-avatar){
    border-radius: 0 !important;
  }
  .float-icon :deep(.zs-color-picker-btn-color){
    border-radius: 50% !important;
    width: 24px;
    height: 24px;
  }
    .top-icon{
      height: 48px;
      border-bottom: 1px solid rgba(255,255,255,0.10);
      padding: 0 16px;
      justify-content: space-between;
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
      width: 24px;
      height: 24px;
      border-radius: 50%;
    }

    .select-color{
      width:166px;
      height:204px;
      background: #212121;
      border: 1px solid rgba(255,255,255,0.1);
      box-shadow: 0px 0px 10px 0px rgba(0,0,0,0.5);
      border-radius: 8px;
      position: absolute;
      top: 45px;
      left: -125px;
    }


  </style>
  