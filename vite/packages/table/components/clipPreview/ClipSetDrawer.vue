<template>
  <!-- 设置 -->
  <a-drawer v-model:visible="setShow" title="设置" width="500" placement="right">
    <div class="flex items-center justify-between mb-6">
      <div class="flex flex-col">
        <span class="mb-2 ps-cm-16">剪贴板</span>
        <span class="ps-cm">关闭后将停止读取剪贴板内容</span>
      </div>
      <a-switch v-model:checked="enable"/>
    </div>
    <span class="ps-cm-16">打开剪贴板应用快捷键</span>
    <div class="flex items-center my-6">
      <div class="bt-bg px-3 py-2.5 rounded-lg mr-3" style="width: 50%; border: 1px solid var(--divider);">
        <span>{{ instruct }}</span>
      </div>
      <div class="bt-bg px-4 py-3 button-active rounded-lg pointer mr-3">
        <span>更换按键</span>
      </div>
      <div class="bt-bg px-4 py-3 button-active rounded-lg pointer">
        <span>重置</span>
      </div>
    </div>
    <span class="ps-cm-16">历史记录容量</span>
    <HorizontalPanel class="mt-6"  :navList="historyCapacity" v-model:selectType="defaultCapacity" ></HorizontalPanel>
    <div class="w-full flex items-center button-active pointer justify-center rounded-lg py-3 bt-bg my-6">
      <span>清除剪贴板记录</span>
    </div>
    <div class="flex my-6 justify-between">
      <div class="flex flex-col">
        <span class="ps-cm-16">代码高亮自动识别</span>
        <span class="ps-cm">开启后文本类内容自动关联代码高亮</span>
      </div>
      <a-switch v-model:checked="clipSetShow"/>
    </div>
    <div class="flex items-center pointer justify-center bt-bg button-active ps-cm-16 rounded-lg p-3" @click="openCodeHighlight">
      <span class="btn-text">代码高亮设置</span>
    </div>
  </a-drawer>

  <!-- 代码高亮设置 -->
  <a-drawer placement="right" width="500" title="代码高亮设置" v-model:visible="clipSetVisible" @close="onClose">
    <div class="flex justify-between mb-6">
      <div class="flex flex-col">
        <span class="ps-cm-16">代码高亮自动识别</span>
        <span class="ps-cm">开启后文本类内容自动关联代码高亮</span>
      </div>
      <a-switch  v-model:checked="clipSetShow"/>
    </div>
    <div class="mb-6 ps-cm-16">默认语言</div>
    <div @click="openLanguageDrawer" class="mb-6 bt-bg py-3 button-active flex items-center rounded-lg pointer justify-center">
      <span class="btn-text">{{ selectLanguage.name }}</span>
    </div>
    <div class="mb-6 ps-cm-16">编辑器主题</div>
    <div @click="openThemeDrawer" class="mb-6 py-3 flex items-center bt-bg button-active rounded-lg pointer justify-center">
      <span>{{clipTheme}}</span>
    </div>
    <div class="flex justify-between mb-6">
      <div class="flex flex-col">
        <span class="ps-cm-16">显示行号</span>
        <span class="ps-cm">开启后文本类内容自动关联代码高亮</span>
      </div>
      <a-switch v-model:checked="showLineNumber" />
    </div>
    <div class="mb-6 ps-cm-16">缩进单位</div>
    <a-input placeholder="4" class="h-12 "  v-model:value="clipSize" @pressEnter="updateIndentUnit($event)"/>
  </a-drawer>

  <!-- 主题色模块 -->
  <HorizontalDrawer :rightSelect="themeType" ref="themeRef" 
   v-model:selectRegion="clipTheme"  @getArea="getTheme"
  >
  </HorizontalDrawer>
  
  <!-- 语言包选择 -->
  <HorizontalDrawer :rightSelect="codeLanguage" v-model:selectRegion="clipMode" ref="languageRef" @getArea="getLanguage"></HorizontalDrawer>
</template>

<script>
import { mapActions, mapWritableState } from 'pinia'
import { clipboardStore } from '../../store/clipboard'
import HorizontalPanel from '../../components/HorizontalPanel.vue';
import HorizontalDrawer from '../HorizontalDrawer.vue';
import { themeType  } from '../../js/data/clipTheme'
import { codeLanguage } from '../../js/data/clipTheme';
export default {
  components:{
    HorizontalPanel,
    HorizontalDrawer
  },
  data(){
    return{
      // 控制抽屉打开
      setShow:false,
      themeType,   // 代码块主题选择
      codeLanguage, // 代码块语言包选择
      // 控制代码高亮设置弹窗
      clipSetVisible:false,
      // 默认的快捷键
      instruct: 'CTRL + ALT + V',
        // 历史记录时间
        historyCapacity: [
        {title: '1天', name: 'day'},
        {title: '1周', name: 'week'},
        {title: '1月', name: 'month'},
        {title: '不限制', name: 'unlimited'}
      ],
      // 默认历史记录时间
      defaultCapacity: {title: '1天', name: 'day'},
    }
  },
  computed:{
    ...mapWritableState(clipboardStore,[
      'enable','clipSetShow','clipMode',
      'showLineNumber','clipTheme','clipSize','clipboardObserver'
    ]),
    selectLanguage(){
      const index = this.codeLanguage.find(el=>{
        return el.abbr === this.clipMode
      })
      return index
    }
  },
  methods:{
    ...mapActions(clipboardStore,
    [
      'start','stop','isRunning','prepare',
      'isClipLineNumber','isSetCodeHighlight',
      'updateClipSize','updateTheme','changeClipMode'
    ]
    ),
    // 通过该方法可以打开弹窗
    clipOpenShow(){
      this.setShow = true
    },
    // 打开代码高亮
    openCodeHighlight(){
      this.clipSetVisible = true
    },
    // 关闭全部
    onClose(){
      this.clipSetVisible = false
    },
    // 修改缩进单位配置
    updateIndentUnit(e){
      this.updateClipSize(e.target.value)
    },
    // 选择主题
    openThemeDrawer(){
      this.$refs.themeRef.openDrawer()
    },
    // 选择代码语言
    openLanguageDrawer(){
      this.$refs.languageRef.openDrawer()
    },
    // 修改主题
    getTheme(item){
      // console.log('修改主题',item);
      this.updateTheme(item.name)
    },
    // 修改语言包
    getLanguage(item){
      // console.log('修改语言',item);
      this.changeClipMode(item.abbr)
    }
  },
  watch:{
    'enable':{
      handler(newVal, oldVal){
        // console.log('剪切板开关',newVal)
        if (newVal) {
          this.prepare()
          this.start()
        }else{
          if (this.clipboardObserver) {
            if (this.isRunning()) {
              this.stop()
            }
          }
        }
      }
    },
    // 是否默认代码高亮
    'clipSetShow':{
      handler(newVal,oldVal){
        this.isSetCodeHighlight(newVal)
      }
    },
    // 是否显示行号
    'showLineNumber':{
      handler(newVal,oldVal){
        this.isClipLineNumber(newVal)
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.ps-cm{
  font-family: PingFangSC-Medium;
  font-size: 14px;
  color: var(--secondary-text);
  font-weight: 500;
}
.ps-cm-16{
  font-family: PingFangSC-Medium;
  font-size: 16px;
  color: var(--primary-text);
  font-weight: 500;
}

.bt-bg{
  background: var(--secondary-bg);
}

.button-active{
  &:active{
    filter: brightness(0.8);
    background: rgba(42, 42, 42, 0.25);
  }
  &:hover{
    background: rgba(42, 42, 42, 0.25);
  }
}
.ant-input{
  border-radius: 12px !important;
  border: 1px solid var(--divider);
}
</style>