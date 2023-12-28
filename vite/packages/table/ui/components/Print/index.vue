<template>
  <teleport to="body">
    <!-- 打印 -->
    <Modal :blurFlag="true" :mask-no-close="false" style="z-index:1200" class="xt-modal fixed top-1/2 left-1/2 -translate-y-1/2 -translate-x-1/2 rounded-lg">
      <div class="px-6" style="width:500px;height:500px;">
        <div class="font-16 pt-4" style="height:64px;line-height: 32px;text-align: center;color: var(--primary-text);">
          打印
          <div class="flex justify-center items-center rounded-lg pointer" style="width:32px;height:32px;background-color: var(--secondary-bg);float: right;" @click="closeClick">
            <Icon icon="fluent:dismiss-16-filled" />
          </div>
        </div>
        <!-- 打印机就绪 -->
        <!-- status 仅检测两个打印机驱动 -->
        <div class="" v-if="print.status && print.printers.length">
          <div class="p-3 rounded-lg mb-4 xt-bg xt-text xt-bg-2">设备要求：德佟P1；纸张：40*60，间隙纸</div>
          <a-select
              style="z-index: 99999999; position: relative;border:none"
              v-model:value="selectedPrinter"
              class="no-drag w-full rounded-xl printers"
              size="large"
              @change="handleChangePrinter"
              :dropdownStyle="{
              'z-index': 999999999999,
              backgroundColor: 'var(--secondary-bg)',
            }"
            >
              <a-select-option class="no-drag" v-for="item in print.printers" :value="item.name"
              >{{ item.name }}
              </a-select-option>
            </a-select>
          <div class="text-center" >
            <!-- 打印预览 -->
            <div ref="previewText" class="rounded-lg mt-3  mb-3 "
                  style="display:inline-block;background:white;color:black;width:160px;height:240px;font-size:12px;overflow: hidden">
              <div ref="printContent" hidden v-html="print.previewHtml"></div>
              <div ref="preivew" class="item-content "></div>
            </div>
          </div>
          <div class="flex justify-end">
            <xt-button type="primary" class="mt-2 font-16 xt-text"
                style="width: 64px; height: 40px; background-color: var(--secondary-bg); "
                @click="closeClick">取消</xt-button>
            <xt-button type="primary" class="mt-2 font-16 xt-text ml-3"
                style="width: 64px; height: 40px; background-color: var(--active-bg);"
                @click="printing">确定</xt-button>
          </div>
        </div>
        <!-- 打印机未就绪 -->
        <div v-else class="p-6">
          <div class="flex justify-center" style="margin-top:42px;">
            <Icon icon="fluent-emoji:printer" width="56px" height="56px" />
          </div>
          <div class="font-14 text-center w-full mt-4" style="color:var(--secondary-text)">驱动未就绪或未检测到可用打印机</div>
          <div class="p-3 rounded-lg mt-4" style="background:var(--secondary-bg)">仅支持德佟标签打印机，推荐使用「德佟 P1 标签打印机」</div>
          <div class="flex p-3 items-center mt-4 rounded-lg" style="background:var(--secondary-bg)">
            <a-image src="https://a.apps.vip/element/p1cover.jpg" style="width: 45px;border-radius: 6px" />
            <div class="flex ml-3" style="flex-direction:column;width:216px;">
              <div>德佟 P1 标签打印机</div>
              <div>纸张：40*60mm</div>
            </div>
            <Modal teleport="body" v-model:visible="showBuy" v-if="showBuy">
              <a-image class="fixed top-1/2 left-1/2 -translate-y-1/2 -translate-x-1/2" style="border-radius: 8px" src="https://a.apps.vip/element/p1qrcode.jpg"></a-image>
            </Modal>
            <xt-button style="border-radius:8px;" type="theme" :w="84" :h="32"  @click="showBuy=true"  >扫码购买</xt-button>
          </div>
          <div class="flex p-3 items-center mt-4 rounded-lg" style="background:var(--secondary-bg)">
            <div
            class="flex justify-center items-center rounded-lg"
            style="width:48px;height:48px;background-color: var(--primary-bg);">
              <Icon icon="tabler:brand-bilibili" width="20" height="20" />
            </div>
            <div class="flex ml-3" style="flex-direction:column;width:216px;">
              <div>天天工作台「德佟 P1 标签打印机」使用教程</div>
            </div>
            <xt-button style="border-radius:8px;" type="theme" :w="84" :h="32">观看视频</xt-button>
          </div>
        </div>
      </div>
    </Modal>
    <!-- 遮罩层 -->
    <div
      v-show="modelValue"
      @click.stop.self="closeClick()"
      class="xt-mask h-full w-full fixed top-0 left-0 ring-0 bottom-0"
      style="z-index:1100"
    ></div>

  </teleport>

  </template>

  <script setup>
  import { ref, toRefs, onMounted, onBeforeUnmount, computed, nextTick, watch  } from "vue";
  import { Icon } from '@iconify/vue';
  import { message } from 'ant-design-vue'
  import { DTPWeb, LPA_JobNames } from 'dtpweb'
  import { validateDrive, startPrint,
    //  doPreview,
      doJob  } from '../../../components/card/hooks/print.ts'

  let api = ref({})
  const showBuy = ref(false)
  const selectedPrinter = ref('')
  const print = ref({
    // 打印机状态
    status: false,
    // 当前选中打印机
    printer: {},
    // 可用打印机列表
    printers: []//所有打印机
  })
  const printContent = ref({})
  const preivew = ref({})
  const props = defineProps({
    // 按esc关闭窗口
    esc: {
      default: true,
    },
    // 窗口显示状态
    modelValue: {
      default: false,
    },
    content:{
      defaule: ""
    }
  });
  // 打印前加载 检测驱动是否安装完毕
  const prePrint = () => {
    api.value = DTPWeb.getInstance()

    const div = document.createElement('div')
    print.value.previewText = div.innerText
    print.value.previewHtml = props.content

    // 打印驱动检测  需要判断两个
    DTPWeb.checkServer((value) => {
      print.value.status = !!value
      print.value.printer = value
      if (!value) {
        message.error('打印助手不可用')
      }if(!api.value.getPrinters({ onlyLocal: true })){
        print.value.status = false
        message.error('暂无打印机连接')
      } else {
        print.value.printers =  api.value.getPrinters({ onlyLocal: true })
        if (print.value.printers[0]?.name) {
          selectedPrinter.value = print.value.printers[0]?.name
        }else{
          selectedPrinter.value = "请选择打印机"
        }
        nextTick(()=>{
          // 去生成预览图
          doPreview()
        })
      }
    })
  }
  // 加载预览图
  const doPreview = () => {
    doJob(LPA_JobNames.Preview,selectedPrinter.value,props.content, (success) => {
      if (success) {
        // 当内容过长时 需要添加分页打印
        let page = api.value.getPageImage({ page: 0 })
        const img = document.createElement('img')
        img.setAttribute('style', 'object-fit:contains;width:100%;height:100%')
        img.src = page.data
        preivew.value.appendChild(img)
        api.value.closePrinter()
      } else {
        message.error('生成预览图失败')
      }
    })
  }
  // 开始打印
  const printing = () => {
    if(print.value.printers){
      if(selectedPrinter.value == '请选择打印机'){
        message.error('请选择打印机！')
      }else{
        message.success('正在打印...')
        startPrint(selectedPrinter.value,props.content)
        closeClick()
      }
    }else{
      message.error('暂无打印机连接！')
    }
  }



    // 更换打印机
    const handleChangePrinter = () => {
      doPreview()
    }
    const emits = defineEmits(["close", "ok", "modelValue"]);
    // 关闭
    const closeClick = () => {
      emits("update:modelValue", false);
      emits("close");
    };

    onMounted(() => {
      // 加载时 检测
      prePrint()
      // 处理关闭事件
      window.addEventListener("keydown", handleEscKeyPressed, {
        capture: true,
      });
    });
    onBeforeUnmount(() => {
      window.removeEventListener("keydown", handleEscKeyPressed, {
        capture: true,
      });
    });
    // esc关闭
    const handleEscKeyPressed = (event) => {
      if (props.esc && event.keyCode === 27) {
        closeClick();
      }
    };
    </script>

  <style lang="scss" scoped>

.box {
  width: 100%;
  height: 100%;
  background-color: rgba(165, 42, 42, 0);
  border: 0px;
  resize: none;
  border-radius: 8px;
  overflow: hidden;
  box-sizing: border-box;
  // padding: 12px;
  font-size: 16px;
  // border: 1PX solid RED;
  position: relative;
  top: -11px;
}

.box::-webkit-scrollbar {
  width: 0;
}

.box:focus {
  outline: none;
}

.item-box {
  display: flex;
  flex-wrap: wrap;
  box-sizing: border-box;
  margin-left: 2px;
}

.item {
  width: 40px;
  height: 40px;
  // opacity: 0.65;
  border-radius: 10px;
  cursor: pointer;
}

.drag-boxs {
  display: flex;
  margin-top: -24px;
  width: 100%;
  height: 20px;
  justify-content: end;
}

::-webkit-input-placeholder {
  color: var(--primary-text);
}


.printers .ant-select-selector{
  &:active{
    outline:none
  }
  border:none !important;
  outline: none;
}
  </style>
