<template>
    <!-- 弹窗层 -->
    <!-- <div
      v-if="modelValue"
      class="xt-text xt-modal xt-shadow fixed top-1/2 -translate-y-1/2 left-1/2 -translate-x-1/2 rounded-xl p-3"
      :style="{
        'z-index': boxIndex,
      }"
    > -->
    <div 
    v-if="modelValue"
     style='width:400px;height:400px;background:var(--modal-bg);
     border: 1px solid var(--secondary-bg);box-shadow: 0px 0px 10px 0px rgba(0,0,0,0.5);
     border-radius: 10px;z-index: 1000;
     ' class="float-icon fixed top-1/2 left-1/2 top-1/2 -translate-y-1/2 -translate-x-1/2" id="selectIcon">
      <!-- 选择列表 -->
      <div class="top-icon flex">
        <div class="type-select flex" style="color:var(--primary-text)">
            <span v-for="(item,index) in menus" @click="onSelChange(index)" :class="selIndex == index ? 'active':''">{{ item,index }}</span>
            <!-- <span @click="onSelChange(1)" :class="selIndex == 1 ? 'active':''">Emojis</span>
            <span @click="onSelChange(2)" v-show="goodVisible" :class="selIndex == 2 ? 'active':''">Icons</span>
            -->
            <span @click="onSelChange(menus.length)" v-if="isUpload" :class="selIndex == menus.length ? 'active':''">自定义</span>
        </div>
        <div class="flex items-center pointer xt-text" @click="clearAvatar">移除</div>
      </div>
      <!--  搜索栏 随机 颜色选择 -->
      <div class="action-search pl-3 pr-3 pt-3 flex" style="justify-content: space-between;" v-if="selIndex != 3">
        <a-input
          style="height:40px;background: var(--secondary-bg);
          color: var(--primary-text);
          border: 1px solid var(--secondary-bg);flex:1;width: 80%;
          border-radius: 10px;"
          placeholder="搜索"
          v-model:value="searchValue"
          @change="searchIcon"
        />
        <!-- 随机 -->
        <a-tooltip>
          <template #title>随机</template>
          <xt-button class="flex justify-center items-center ml-3" :w="40" :h="40"  style="background: var(--secondary-bg);border-radius: 10px;" @click="onRandom">
            <Icon class="pointer flex items-center" icon="fluent:arrow-sync-20-filled"  width="20" height="20"/>
          </xt-button>
        </a-tooltip>
        <!-- 颜色选择 -->
        <div v-if="menus[selIndex] == 'icon'" class="flex justify-center items-center pointer ml-3" style="width: 40px;height:40px;background: var(--secondary-bg);border-radius: 10px;position: relative;" @click="isShowBgColor=!isShowBgColor">
          <a-tooltip>
            <template #title>颜色选择</template>
            <div class="circle" :style="{background:bgColor[selBgColor]}" ></div>
          </a-tooltip>
          
          <div class="select-color" v-show="isShowBgColor" style="flex-wrap: wrap;z-index: 100;color: var(--primary-text);" >
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
      <!-- <div v-if="searchValue" class="flex pl-1 pr-1 overflow-hidden overflow-y-auto xt-scrollbar flex-wrap" style="height: 290px;">
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
      </div> -->
      <!-- 渲染的列表 -->
      <!-- {{ list }} -->
      <div v-for="(value,key) in handleList" v-show="key == menus[selIndex]"  :key="key" class="flex pl-1 pr-1 overflow-hidden overflow-y-auto xt-scrollbar flex-wrap" style="height: 290px;">
        <div v-for="(item,index) in value" :key="index" @click="onSelectIcon(index,'emoji',item.name)" class="flex justify-center items-center mt-2 ml-2 pointer overflow-hidden" style="width: 40px;height:40px;border-radius: 10px;" :class="selectIcon == index ? 'sel-active':''">
          <a-tooltip>
            <template #title>{{ item.alias }}</template>
            <a-avatar :src="`https://a.apps.vip/icons/iconSelect/${menus[selIndex]}/${item.name}.svg`" :alt="item.alias" width="32" height="32" :style="{'filter': menus[selIndex] == 'icon'?`drop-shadow(${bgColor[selBgColor]} 80px 0)`:'',transform:menus[selIndex] == 'icon'?'translateX(-80px)':''}"></a-avatar>
          </a-tooltip>
        </div>
      </div>
      <!-- icon -->
      <!-- <div v-else-if="this.selIndex == 2" class="flex pl-1 pr-1 overflow-hidden overflow-y-auto xt-scrollbar flex-wrap" style="height: 290px;">
        <div v-for="(item,index) in iconList" :key="index" @click="onSelectIcon(index,'icon',item.name)" class="flex justify-center items-center mt-2 ml-2 pointer overflow-hidden" style="width: 40px;height:40px;border-radius: 10px;" :class="selectIcon == index ? 'sel-active':''">
          <a-tooltip>
            <template #title>{{ item.alias }}</template>
            <div>
              <a-avatar :style="{'filter': `drop-shadow(${bgColor[selBgColor]} 80px 0)`,transform:'translateX(-80px)'}"  :src="'https://a.apps.vip/icons/iconSelect/icon/'+item.name+'.svg'" :alt="item.alias"  width="20" height="20"></a-avatar>
            </div>
          </a-tooltip>
        </div>
      </div> -->
      <!-- 自定义上传 -->
      <div v-if="selIndex == menus.length" class="flex pl-1 pr-1 items-center flex-wrap flex-col" style="height:330px;">
        <input type="file" id="groupFileID" style="display:none;" @change="getFileInfo($event)">
        <div v-if="!avatarUrl" class="pointer flex justify-center items-center" @click="updateGroupAvatar()" style="margin-top: 98px;height: 64px;width: 64px;background: var(--secondary-bg);border: 1px dashed rgba(255,255,255,0.1);border-radius: 6px;">
          <Icon icon="fluent:add-16-filled" width="20" height="20"/>
        </div>
        <a-avatar style="margin-top: 98px;" v-else shape="square" :size="64" :src="avatarUrl"></a-avatar>
        <div class="mt-4" style="font-size: 14px;color: var(--secondary-text)">{{ this.customTitle }}</div>
        <xt-button class="xt-active-btn mt-4" style="width:64px;height:40px;" @click="changeAvatar">确定</xt-button>
      </div>
                                                                                                                                                       

    </div>

    <!-- 遮罩层 -->
    <div
    v-if="modelValue"
      @click.stop.self="colseClick()"
      class="xt-mask h-full w-full fixed top-0 left-0 ring-0 bottom-0"
      :style="{
        'z-index': maskIndex,
      }"
    ></div>
  </template>
  
  <script setup>
  import { ref, toRefs, onMounted, onBeforeUnmount, computed,  } from "vue";
  import {fileUpload} from '../../../components/card/hooks/imageProcessing'
  import { Icon } from '@iconify/vue';
  import iconList from './iconList/icon'
  import emojisList from './iconList/emojis'
  import goodsList from './iconList/goods'
  
//   const icon = iconList.list
//   const emoji = emojisList.list
//   const goods = goodsList.list
  // 全部的数组
  const allList = {
    icon:iconList.list,
    emoji:emojisList.list,
    goods:goodsList.list,
  }
  //处理后的全部数据
  const handleList = ref({})
  //文件上传地址
  const avatarUrl = ref('')
  // 选中列表类型
  const selIndex = ref(0)
  // 搜索内容
  const searchValue = ref('')
  // 选中的图标
  const selectIcon = ref(-1)
  // 选中的颜色
  const selBgColor = ref(0)
  // 是否展开颜色选择
  const isShowBgColor = ref(false)
  // 当前渲染的列表
//   const list = ref([])

  




  const props = defineProps({
    // 遮罩层级
    maskIndex: {
      default: 999,
    },
    // 弹窗层级
    boxIndex: {
      default: 1000,
    },
    // 标题
    title: {
      default: "默认标题",
    },

    // 快速关闭底部
    isFooter: {
        default: true,
    },
    // 快速关闭头部
    isHeader: {
        default: true,
    },
    
    
    // 按esc关闭窗口
    esc: {
      default: true,
    },
    // 窗口显示状态
    modelValue: {
      default: false,
    },
    // 选择器数组
    menus:{
        default: () => {
            return ['icon', 'emoji']
        }
    },
    // 颜色数组
    bgColor:{
        default: ()=>{
            return ['#508bfe','#ff6c61','#73cf77','#3dffed','#ed7149','#ffffff','#000000']
        }
    },
    // 默认返回图标
    defaultIcon:{
        default:'https://jxxt-1257689580.cos.ap-chengdu.myqcloud.com/jmPD-I__T-SMyc-LMzn'
    },
    // 是否开启图标上传
    isUpload:{
        default:false
    },
    
  });
  const { menus } = toRefs(props);
  // 渲染在列表的数组
//   const list = computed(() => {
//     // console.log(menus.value);
//     // console.log(menus.value[selIndex.value]);
    
//     if (selIndex.value <= menus.value.length) {
//         const index = menus.value[selIndex.value]

//         // console.log(menus.value[selIndex.value]);
//         // console.log('all',allList[index]);
//         // return menus.value[selIndex.value];
//         return handleList.value[index]
//     }else{
//         return false
//     }
//   });

    // 选择图标类型
    const onSelChange = (n) =>{
        selIndex.value = n
        selectIcon.value = -1
        searchValue.value = ''
    }

        // 选择图标
    const onSelectIcon = (n,type,url) => {
    selectIcon.value = n
        if(selIndex.value==1){
            if(this.goodVisible){
            this.$emit('getAvatar','https://a.apps.vip/icons/iconSelect/emoji/'+url+'.svg')
            }else{
            this.$emit('getAvatar','https://a.apps.vip/icons/goodSelect/'+url+'.svg')
            }
        }else{
            this.$emit('getAvatar','https://a.apps.vip/icons/iconSelect/icon/'+url+'.svg?color=' + this.bgColor[this.selBgColor])
        }
        this.$emit('isIconShow')
    }


    //随机图标 
    const onRandom = () => {
        const type = menus.value[selIndex.value]
        const randomLength = handleList.value[type].length
        let randomNum = Math.round(Math.random()*randomLength);
        selectIcon.value = randomNum;
        // message.$success=handleList.value[menus.value[selIndex.value]][randomNum].alias
        // if(this.selIndex == 1){
        //     if(this.goodVisible){
        //     this.$emit('getAvatar','https://a.apps.vip/icons/iconSelect/emoji/'+this.emojisList[randomNum].name+'.svg')
        //     }else{
        //     this.$emit('getAvatar','https://a.apps.vip/icons/goodSelect/'+this.emojisList[randomNum].name+'.svg')
        //     }
        // }else{
        //     this.$emit('getAvatar','https://a.apps.vip/icons/iconSelect/icon/'+this.iconList[randomNum].name+'.svg?color=' + this.bgColor[this.selBgColor])
        // }
        // console.log(handleList.value[type][randomNum].name)
        // console.log(menus.value[selIndex.value]);
        // icon 的背景颜色需要特殊处理
        // if (type == 'icon') {
        //     emits('getAvatar',)
        // }else{
        //     emits('getAvatar',)
        // }
    }


    // 改变颜色
    const changeBgColor = (n) => {
        selBgColor.value = n
        // console.log(selBgColor.value);
        // console.log(props.bgColor[selBgColor.value]);
        // props.bgColor[n] = props.bgColor[selBgColor.value]
        if(menus.value[selIndex.value] == 'icon' && selIndex.value >= 0){
            // emits('getAvatar',`https://a.apps.vip/icons/iconSelect/icon/`)
            // this.$emit('getAvatar','https://a.apps.vip/icons/iconSelect/icon/'+this.iconList[this.selectIcon].name+'.svg?color=' + this.bgColor[this.selBgColor])
        }
    }

      // 上传文件
    const getFileInfo = async (evt) => {
        const files = evt.target.files[0]
        const res  = await fileUpload(files)
        avatarUrl.value = res
        emits('getAvatar',res)
    }

      // 更换头像
    const updateGroupAvatar = () => { 
        document.querySelector('#groupFileID').click()
    }

      // 清除已上传信息
    const clearAvatar = () => {
        avatarUrl.value=''
        emits('getAvatar',props.defaultIcon)
    }
    // 确认上传
    const changeAvatar = () => {
        emits('getAvatar',avatarUrl.value)
        colseClick();
    }


    // 检查是否是有效的手柄实现
    // const isValidHandle = (event: any, handle: string | string[]) => {
    //     if (typeof handle === "string") {
    //         return event.target?.closest(handle) !== null
    //     } else if (Array.isArray(handle) && handle.length > 0) {
    //         return handle.some((selector) => event.target?.closest(selector) !== null)
    //     }
    //     return false
    // }

  const emits = defineEmits(["close", "ok", "modelValue",'getAvatar']);
  
  // 关闭
  const colseClick = () => {
    emits("update:modelValue", false);
    emits("close");
  };
  
  // 完成
  const okClick = () => {
    emits("update:modelValue", false);
    emits("ok");
  };
  
  // esc关闭
  const handleEscKeyPressed = (event) => {
    if (props.esc && event.keyCode === 27) {
      colseClick();
    }
  };
  onMounted(() => {
    // 后续用于其他功能
    // document.addEventListener('mouseup', (e) => {
    //     e.stopPropagation();
    //     console.log(e.target)
    // });
    // 处理渲染的列表
    props.menus.forEach(i => {
        if (allList[i] != undefined) {
            handleList.value[i] = allList[i]
        }
    });

    window.addEventListener("keydown", handleEscKeyPressed, {
      capture: true,
    });
  });
  onBeforeUnmount(() => {
    window.removeEventListener("keydown", handleEscKeyPressed, {
      capture: true,
    });
  });
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
      border-bottom: 1px solid var(--secondary-bg);
      // border-bottom: 1px solid rgba(255,255,255,0.10);
      padding: 0 16px;
      justify-content: space-between;
    }

    
    .top-icon .type-select span{
      display: flex;
      height: 48px;
      font-family: PingFangSC-Semibold;
      font-size: 14px;
      // color: rgba(255,255,255,0.85);
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
      background: var(--modal-bg);
      border: 1px solid rgba(255,255,255,0.1);
      box-shadow: 0px 0px 10px 0px rgba(0,0,0,0.5);
      border-radius: 8px;
      position: absolute;
      top: 45px;
      left: -125px;
    }

    :deep(.ant-input){
      color: var(--secondary-text) !important;
      font-size: 14px;
      font-weight: 400;
      &::placeholder{
       color: var(--secondary-text) !important;
      }
     }


  </style>
  