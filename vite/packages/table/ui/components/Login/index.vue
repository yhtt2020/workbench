<template>
    <teleport to="body"></teleport>
    <div 
    v-show="modelValue"
     style='width:866px;height:600px;background:var(--modal-bg);
     border: 1px solid var(--secondary-bg);box-shadow: 0px 0px 10px 0px rgba(0,0,0,0.5);
     border-radius: 10px;z-index: 1000;' 
     class="float-icon fixed top-1/2 left-1/2 top-1/2 -translate-y-1/2 -translate-x-1/2">
        <xt-modal>
            <div>
                <div>登录体验更多功能</div>

            </div>

        </xt-modal>
    </div>
    <!-- 遮罩层 -->
    <div
    v-show="modelValue"
      @click.stop.self="colseClick()"
      class="xt-mask h-full w-full fixed top-0 left-0 ring-0 bottom-0"
      style="z-index:900"
    ></div>
  </template>
  
  <script setup>
  import { ref, toRefs, onMounted, onBeforeUnmount, computed,  } from "vue";
  import {fileUpload} from '../../../components/card/hooks/imageProcessing'
  import { Icon } from '@iconify/vue';
  
//   const icon = iconList.list
//   const emoji = emojisList.list
//   const goods = goodsList.list
  // 全部的数组
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
  //进度条
  const percent = ref(0)


    const props = defineProps({
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
      title:{
        default:'推荐尺寸：256*256px，最大不超过2MB'
      },
      maxSize:{
        default:2
      }
    
    });
    const { menus } = toRefs(props);




    </script>
  
  <style lang="scss" scoped>


  </style>
  