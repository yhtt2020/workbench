<template>
  <Teleport to="body">
    <div
      v-if="modelValue"
      style='width:400px;height:400px;background:var(--modal-bg);
       border: 1px solid var(--secondary-bg);box-shadow: 0px 0px 10px 0px rgba(0,0,0,0.5);
       border-radius: 10px;'
      :style="{
          'z-index': maskIndex + 10,
        }"
      class="fixed -translate-x-1/2 -translate-y-1/2 float-icon top-1/2 left-1/2" id="selectIcon">
      <!-- 选择列表 -->
      <div class="flex top-icon">
        <div class="flex type-select" style="color:var(--primary-text)">
          <span v-for="(item,index) in menus" :key="index" @click="onSelChange(index)"
                :class="selIndex == index ? 'active':''">{{ item }}</span>
          <span @click="onSelChange(menus.length)" v-if="isUpload"
                :class="selIndex == menus.length ? 'active':''">上传</span>
        </div>
        <div class="flex ">
          <div class="flex items-center pointer xt-text mr-3" @click="clearAvatar">移除</div>
          <div class="flex items-center pointer xt-text" @click="closeClick">关闭</div>
        </div>
      </div>
      <!--  搜索栏 随机 颜色选择 -->
      <div class="flex pt-3 pl-3 pr-3 action-search" style="justify-content: space-between;"
           v-if="['icon','emoji'].includes(menus[selIndex])">
        <a-input
          style="height:40px;background: var(--secondary-bg);
            color: var(--primary-text);
            border: 1px solid var(--secondary-bg);flex:1;width: 80%;
            border-radius: 10px;"
          placeholder="搜索"
          v-model:value="searchValue"
        />
        <!-- 随机 -->
        <a-tooltip>
          <template #title>随机</template>
          <xt-button class="flex items-center justify-center ml-3" :w="40" :h="40"
                     style="background: var(--secondary-bg);border-radius: 10px;" @click="onRandom">
            <Icon class="flex items-center pointer" icon="fluent:arrow-sync-20-filled" width="20" height="20"/>
          </xt-button>
        </a-tooltip>
        <!-- 颜色选择 -->
        <div v-if="menus[selIndex] == 'icon'" class="flex items-center justify-center ml-3 pointer"
             style="width: 40px;height:40px;background: var(--secondary-bg);border-radius: 10px;position: relative;"
             @click="isShowBgColor=!isShowBgColor">
          <a-tooltip>
            <template #title>颜色选择</template>
            <div class="circle" :style="{'background':bgColor[selBgColor]}"></div>
          </a-tooltip>

          <div class="select-color" v-show="isShowBgColor"
               style="flex-wrap: wrap;z-index: 100;color: var(--primary-text);">
            <div class="mt-2 ml-4">自定义</div>
            <div style='width: 40px;height:40px;border-radius: 10px;' @click.stop="changeBgColor(6)"
                 class="flex items-center justify-center mt-1 ml-3 overflow-hidden"
                 :class="selBgColor == 6 ? 'sel-active':''">
              <color-picker
                v-model:pureColor="bgColor[6]"
                v-on:update:pureColor="onSelBg"
                :z-index="9999999999999"
                shape="circle"
                blur-close
                format="hex6"
              />
            </div>
            <div class="mt-1 ml-4">系统预设</div>
            <div class="flex flex-wrap">
              <div v-for="(item,index) in bgColor.slice(0,6)" :key="index"
                   class="flex items-center justify-center mt-2 ml-3 pointer"
                   style='width: 40px;height:40px;border-radius: 10px;' :class="selBgColor == index ? 'sel-active':''"
                   @click="changeBgColor(index)">
                <div class="circle" :style="{background:bgColor[index]}"></div>
              </div>
            </div>
          </div>
        </div>
      </div>


      <!-- 渲染的列表  需要将show 换成 if-->
      <div v-if="menus[selIndex]=='emoji'" class="flex flex-wrap pl-1 pr-1 overflow-hidden overflow-y-auto xt-scrollbar"
           style="height: 290px;">
        <div v-for="(item,index) in search" :key="index" @click="onSelectIcon(item.name)"
             class="flex items-center justify-center mt-2 ml-2 overflow-hidden pointer xt-bg-2"
             style="width: 40px;height:40px;border-radius: 10px;" :class="selectIcon == index ? 'sel-active':''">
          <a-tooltip>
            <template #title>{{ item.alias }}</template>
            <a-avatar v-if="item.name != 'goods'" :src="cdnUrl(`/icon_select/${menus[selIndex]}/${item.name}.svg`)"
                      :alt="item.alias" width="32" height="32"
                      :style="{'filter': menus[selIndex] == 'icon'?`drop-shadow(${bgColor[selBgColor]} 80px 0)`:'',transform:menus[selIndex] == 'icon'?'translateX(-80px)':''}"></a-avatar>
            <a-avatar v-else :src="cdnUrl(`/goods_select/${item.name}.svg`)" :alt="item.alias" width="32"
                      height="32"></a-avatar>
          </a-tooltip>
        </div>
      </div>
      <!--  截图    -->
      <div v-if="menus[selIndex]=='截图'" class="flex flex-col flex-wrap items-center px-6"
           style="height: 290px;">
        <div v-if="!captureImg" class="flex items-center justify-center pointer " @click="startCapture()"
             style="margin-top: 98px;height: 126px;width: 126px;background: var(--secondary-bg);border: 1px dashed rgba(255,255,255,0.1);border-radius: 6px;">
          <Icon icon="fluent:screen-cut-20-filled" width="48" height="48"/>
        </div>
        <a-avatar @click="startCapture()" style="margin-top: 98px;" v-else shape="square" :size="126"
                  :src="captureImg"></a-avatar>
      </div>

      <!-- 自定义上传 -->
      <div v-else class="flex flex-col flex-wrap items-center px-6" style="height:330px;">
        <input type="file" style="display:none;" ref="groupFileID" @change="getFileInfo($event)"/>
        <div v-if="!avatarUrl" class="flex items-center justify-center pointer" @click="updateGroupAvatar()"
             style="margin-top: 98px;height: 64px;width: 64px;background: var(--secondary-bg);border: 1px dashed rgba(255,255,255,0.1);border-radius: 6px;">
          <Icon icon="fluent:add-16-filled" width="20" height="20"/>
        </div>
        <a-avatar style="margin-top: 98px;" v-else shape="square" :size="64"
                  :src="avatarUrl + '?imageMogr2/crop/260x260/gravity/center'"></a-avatar>
        <div class="mt-4" style="font-size: 14px;color: var(--secondary-text)">{{ title }}</div>
        <a-progress v-if="percent !== 0 && percent != 100" :percent="percent"/>
      </div>
    </div>
    <!-- 遮罩层 -->
    <div
      v-if="modelValue"
      @click.stop.self="closeClick()"
      class="fixed top-0 bottom-0 left-0 w-full h-full xt-mask ring-0"
      :style="{
          'z-index': zIndex,
        }"
    ></div>
  </Teleport>
</template>

<script setup>
import {ref, toRefs, onMounted, onBeforeUnmount, computed, nextTick,} from 'vue'
import {fileUpload} from '../../../components/card/hooks/imageProcessing'
import {Icon} from '@iconify/vue'
import iconList from './iconList/icon'
import emojisList from './iconList/emojis'
import goodsList from './iconList/goods'
import {cdnUrl} from '../../../consts'

// 全部的数组
const allList = {
  icon: iconList.list,
  emoji: emojisList.list,
  goods: goodsList.list,
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
//进度条
const percent = ref(0)

const groupFileID = ref({})

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
  menus: {
    default: () => {
      return ['icon', 'emoji', '截图']
    }
  },
  // 颜色数组
  bgColor: {
    default: () => {
      return ['#ffffff', '#508bfe', '#ff6c61', '#73cf77', '#3dffed', '#ed7149', '#000000']
    }
  },
  // 默认返回图标
  defaultIcon: {
    default: 'https://jxxt-1257689580.cos.ap-chengdu.myqcloud.com/jmPD-I__T-SMyc-LMzn'
  },
  // 是否开启图标上传
  isUpload: {
    default: false
  },
  title: {
    default: '推荐尺寸：256*256px，最大不超过2MB'
  },
  maskIndex: {
    default: 900
  },
  zIndex: {
    default: 900
  }

})
const {menus} = toRefs(props)
const captureImg = ref(null)

const startCapture = () => {
  const cbId = Date.now()
  ipc.once(cbId, (event, args) => {
    var f;
    const savePath = require('path').join(globalArgs['user-data-dir'], 'icons', String(cbId) + '.jpg')
    fs.open(savePath, "w", function (err, fd) {
      fs.write(fd,args.buffer, function (err, fd) {
        //判断是否出错
        if (!err) {
          f = fd;
          captureImg.value = savePath
          emits('getAvatar', 'file://' +savePath)
        } else {
          console.log(err);
        }
      })
    });
    console.log(args, '收到的数据')
  })
  ipc.send('capture', {
    cbId: cbId,
  })``
}
// 动态搜索
const search = computed(() => {
  let tmpList = []
  const type = menus.value[selIndex.value]
  const list = handleList.value[type]
  if (list && searchValue.value != '') {
    list.forEach(i => {
      if (i.alias.indexOf(searchValue.value) >= 0 || i.name.indexOf(searchValue.value) >= 0) {
        tmpList.push(i)
      }
    })
    return tmpList
  } else {
    return list
  }
})

// 选择图标类型
const onSelChange = (n) => {
  selIndex.value = n
  selectIcon.value = -1
  searchValue.value = ''
}
const onSelBg = () => {
  selBgColor.value = 6
}

// 选择图标
const onSelectIcon = (name) => {
  const type = menus.value[selIndex.value]
  if (type == 'icon') {
    const color = props.bgColor[selBgColor.value]
    emits('getAvatar', cdnUrl(`/icon_select/${type}/${name}.svg?color=${color}`))
  } else if (type == 'goods') {
    emits('getAvatar', cdnUrl(`/goods_select/${name}.svg`))
  } else if (type == '截图') {
    if (!captureImg.value) {
      return
    }
    emits('getAvatar', 'file://' + captureImg.value)
  } else {
    emits('getAvatar', cdnUrl(`/icon_select/${type}/${name}.svg`))
  }
  closeClick()
}

//随机图标
const onRandom = () => {
  const type = menus.value[selIndex.value]
  const randomLength = handleList.value[type].length
  let randomNum = Math.round(Math.random() * randomLength)
  const name = handleList.value[type][randomNum].name
  selectIcon.value = randomNum
  let res
  if (type == 'icon') {
    const color = props.bgColor[selBgColor.value]
    res = cdnUrl(`/icon_select/${type}/${name}.svg?color=${color}`)
  } else if (type == 'goods') {
    res = cdnUrl(`/goods_select/${name}.svg`)
  } else {
    res = cdnUrl(`/icon_select/${type}/${name}.svg`)
  }
  emits('getAvatar', res)
  return res
}

// 改变颜色
const changeBgColor = (n) => {
  selBgColor.value = n
}

// 上传文件
const getFileInfo = async (evt) => {
  let timer = setInterval(() => {
    percent.value += 1
    if (percent == 99) {
      clearInterval(timer)
      timer = null
    }
  }, 50)
  const files = evt.target.files[0]
  await fileUpload(files).then(res => {
    // 上传结束后自动完成 并清空
    percent.value = 0
    clearInterval(timer)
    timer = null
    avatarUrl.value = res
    emits('getAvatar', res)
  })
}

// 更换头像
const updateGroupAvatar = () => {
  groupFileID.value.click()

}

const showUpload = async () => {
  onSelChange(2)
  await nextTick()
  //updateGroupAvatar()
}

// 清除已上传信息
const clearAvatar = () => {
  avatarUrl.value = ''
  emits('getAvatar', props.defaultIcon)
}
// 确认上传
const changeAvatar = () => {
  emits('getAvatar', avatarUrl.value)
  closeClick()
}

const emits = defineEmits(['close', 'ok', 'modelValue', 'getAvatar'])

// 关闭
const closeClick = () => {
  emits('update:modelValue', false)
  emits('close')
}

// 完成
const okClick = () => {
  emits('update:modelValue', false)
  emits('ok')
}

// esc关闭
const handleEscKeyPressed = (event) => {
  if (props.esc && event.keyCode === 27) {
    closeClick()
  }
}
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
  })

  window.addEventListener('keydown', handleEscKeyPressed, {
    capture: true,
  })
})
onBeforeUnmount(() => {
  window.removeEventListener('keydown', handleEscKeyPressed, {
    capture: true,
  })
})
defineExpose({
  onRandom, showUpload
})
</script>

<style lang="scss" scoped>
.top-triangle {
  width: 0;
  height: 0;
  display: flex;
  border: 10px solid transparent;
  border-bottom-color: #212121;
  position: absolute;
  top: -20px;
  left: 195px;

}

.float-icon :deep(.ant-avatar) {
  border-radius: 0 !important;
}

.float-icon :deep(.zs-color-picker-btn-color) {
  border-radius: 50% !important;
  width: 24px;
  height: 24px;
}

.top-icon {
  height: 48px;
  border-bottom: 1px solid var(--secondary-bg);
  // border-bottom: 1px solid rgba(255,255,255,0.10);
  padding: 0 16px;
  justify-content: space-between;
}


.top-icon .type-select span {
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


.active {
  font-weight: 600 !important;
  border-bottom: 2px solid #508BFE !important;
  border-radius: 2px;
}

.sel-active {
  background: rgba(80, 139, 254, 0.20);
  background: rgba(51, 127, 255, 0.30) !important;
}

.circle {
  width: 24px;
  height: 24px;
  border-radius: 50%;
}

.select-color {
  width: 166px;
  height: 204px;
  background: var(--modal-bg);
  border: 1px solid rgba(255, 255, 255, 0.1);
  box-shadow: 0px 0px 10px 0px rgba(0, 0, 0, 0.5);
  border-radius: 8px;
  position: absolute;
  top: 45px;
  left: -125px;
}

:deep(.ant-input) {
  color: var(--secondary-text) !important;
  font-size: 14px;
  font-weight: 400;

  &::placeholder {
    color: var(--secondary-text) !important;
  }
}

:deep(.vc-color-wrap) {
  width: 24px !important;
  height: 24px !important;
  margin-right: 0 !important;
  border: 1px solid #fff !important;

}
</style>
