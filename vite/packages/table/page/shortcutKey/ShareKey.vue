<template>
  <div class="p-3 s-bg rounded-lg box">
    <!-- 头部导航栏 -->
    <div class="flex items-center justify-between">
      <div class="flex">
        <div @click="onBack" class="pointer button-active s-bg h-12 w-12 flex items-center rounded-lg justify-center mr-3">
          <Icon icon="xiangzuo" style="font-size: 1.5em;"></Icon>
        </div>
        <HorzontanlPanelIcon :navList="navType" v-model:selectType="defaultNavType"></HorzontanlPanelIcon>
      </div>
      <div class="flex btn-item">
        <div class="pointer">保存</div>
        <div class="pointer" @click="shoreModal=true">保存并分享到创意市场</div>
      </div>
    </div>
    <!-- 基本信息 -->
    <div class="add-content" v-if="defaultNavType.name === 'message'">
      <span>图标</span>
      <div class="flex">
        <div class="avatar">
          <div>
            <a-avatar :size="100" :src="file.path" />
          </div>
          <span><Icon icon="guanbi2" style="font-size: 1.5em;"></Icon></span>
        </div>
        <div class="ml-10" style="font-family: PingFangSC-Regular;font-size: 16px;color: rgba(255,255,255,0.60);">
          <div>推荐图片尺寸：128*128，不要超过2MB</div>
          <!-- <div class="pointer s-bg flex items-center rounded-lg justify-center mr-3 mt-2" @click="imageSelect" style="width:120px; height:48px;">自定义上传</div> -->
          
        <a-upload
          name="file"
          :showUploadList="false"
          :customRequest="uploadImage"
          :beforeUpload="beforeUpload"
          accept="image/jpeg,image/jpg,image/png"
        >
        <div class="pointer flex items-center rounded-lg justify-center mr-3 mt-2" @click="imageSelect" style="background: #2A2A2A;width:120px; height:48px;">自定义上传</div>
        </a-upload>
        </div>
      </div>
      <span>应用名称</span>
      <a-input v-model:value="userName" class="input" placeholder="请输入应用名称" aria-placeholder="font-size: 14px;" style="width:480px;height: 48px;"/>
      <span>方案简介</span>
      <a-textarea v-model:value="introduce" class="input"  placeholder="请输入描述" aria-placeholder="font-size: 14px;color: rgba(255,255,255,0.40);" :rows="4" style="width:480px;height: 100px;"/>
      <div @click="nextStep" class="pointer flex items-center rounded-lg justify-center mr-3 mt-6" style="background: #2A2A2A;width:480px;height:48px;font-size: 16px;color: rgba(255,255,255,0.85);">下一步</div>
    </div>
    <!-- 快捷键 -->
    <div class="key-content" v-else>
      <!-- 输入框 -->
      <div class="flex mt-7 mb-4">
        <a-input class="ml-3 input"  :value="keyCombination" @keydown="showInfo" placeholder="按下组合键"/>
        <a-input class="ml-3 input" v-model:value="combinationName" placeholder="操作名称" style="width:227px;height: 48px;"/>
        <div class="addBtn" @click="addShortcutKey">添加快捷键</div>
        <a-input class="ml-3 input" v-model:value="groupName" placeholder="分类名称" style="width:227px;height: 48px;"/>
        <div class="addBtn" @click="addGroup">新建分类</div>
      </div>
      <!-- 提示 -->
      <div class="prompt mb-4 mx-4 px-4 flex justify-between items-center" v-show="closePrompt">
        <span class="flex items-center">
          <Icon icon="tishi-xianxing" style="width: 21px;height: 21px;color:#508BFE;"></Icon>
          <span class="mx-4">支持长按拖拽排序</span>
        </span>
        <Icon icon="guanbi2" style="width: 20px;height: 20px;color:#7A7A7A;" @click="closePrompt = false"></Icon>
      </div>
      <!-- 快捷键列表 -->
      <div :style="closePrompt ? 'height:80%' : 'height:90%'">
        <ShortcutKeyList :keyList="keyList" :keyIndex="keyIndex" :showEdit="true" @setKeyItem="setKeyItem"></ShortcutKeyList>
      </div>
    </div>
  </div>
  <!-- 分享成功的模态框 -->
  <div class="fixed inset-0 home-blur" style="z-index: 999999999999;" v-if="shoreModal" >
    <div
         class="fixed text-white top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2  rounded-lg flex flex-col justify-evenly items-center"
         style="padding: 24px 32px;width: 480px;height: 221px;background:  #282828">
      <div>
        <Icon icon="yiwancheng" style="color:#52C41A;font-size:20px"></Icon>
        <span class="ml-2" style="font-size: 18px;color: rgba(255,255,255,0.85);font-weight: 500;">分享成功</span>
      </div>
      <div style="font-size: 16px;margin:24px 0;color: rgba(255,255,255,0.60);">
        「 {{ userName }} 」成功分享至创意市场，选择分享到元社区让更多人看到吧～
      </div>
      <div class="flex">
        <div style="width: 160px;height: 48px;"
           class="flex justify-center items-center bg-blue-500 rounded-lg pointer">
        同时分享到元社区
        </div>
        <div style="width: 160px;height: 48px;"
            class=" ml-3 flex justify-center items-center s-bg rounded-lg pointer" @click="close">
          完成
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import HorzontanlPanelIcon from '../../components/HorzontanlPanelIcon.vue'
import ShortcutKeyList from '../../components/shortcutKey/ShortcutKeyList.vue';
import {nanoid} from 'nanoid'
import { message } from 'ant-design-vue';
export default {
  name: 'ShareKey',
  components: {
    HorzontanlPanelIcon,
    ShortcutKeyList
  },
  data(){
    return{
      navType:[
         {title:'基本信息',name:'message'},
         {title:'快捷键',name:'shortcutkey'}
      ],
      defaultNavType:{title:'基本信息',name:'message'},
      closePrompt: true,
      keyList: [
        {
          groupName: '常用0',
          id: 1,
        },
        {
          id: 2,
          keys: [
            {icon: 'linechart'},
            {key: 'H'}
          ],
          title: '首选项1',
        },
        {
          id: 3,
          keys: [
            {icon: 'linechart'},
            {icon: 'linechart'},
            {key: 'Q'}
          ],
          title: '清除2',
        },
        {
          id: 4,
          keys: [
            {icon: 'linechart'},
            {key: 'H'}
          ],
          title: '隐藏3'
        },
        {
          id: 5,
          keys: [
            {icon: 'linechart'},
            {key: 'H'}
          ],
          title: 'osoft4'
        },
        {
          groupName: '文件5',
          id: 6,
        },
        {
          id: 7,
          keys: [
            {icon: 'linechart'},
            {key: 'H'}
          ],
          title: '首选项6',
        },
        {
          id: 8,
          keys: [
            {icon: 'linechart'},
            {icon: 'linechart'},
            {key: 'Q'}
          ],
          title: '清除浏览器数据7',
        },
        {
          id: 9,
          keys: [
            {icon: 'linechart'},
            {key: 'H'}
          ],
          title: '隐藏8'
        },
        {
          id: 10,
          keys: [
            {icon: 'linechart'},
            {key: 'H'}
          ],
          title: '隐藏 Microsoft9'
        },
        {
          id:11,
          keys: [
            {icon: 'linechart'},
            {key: 'H'}
          ],
          title: '首选项'
        },
        {
          id:12,
          keys: [
            {icon: 'linechart'},
            {icon: 'linechart'},
            {key: 'Q'}
          ],
          title: '清除浏览器数据'
        },
        {
          id: 13,
          groupName: '其他'
        },
        {
          id:14,
          keys: [
            {icon: 'linechart'},
            {key: 'H'}
          ],
          title: '辅导课'
        },
        {
          id:15,
          keys: [
            {icon: 'linechart'},
            {icon: 'linechart'},
            {key: 'Q'}
          ],
          title: '类似的控股权'
        }
      ],
      keyIndex: 1,
      imageUrl: '',
      file: {},
      shoreModal: false,
      keyCombination: '',
      inputKeyArr: [],
      combinationName: '',
      groupName: '',
      // 介绍
      introduce: ''
    }
  },
  methods: {
    onBack(){
      this.$router.go(-1)
    },
    setKeyItem(id){
      this.keyIndex = id
    },
    nextStep(){
      this.defaultNavType = {title:'快捷键',name:'shortcutkey'}
    },
    close(){
      this.shoreModal = false
    },
    //获取键盘按下的键
    showInfo(event){
      const str = event.key
      str.replace(/[^u4e00-u9fa5|,]+/ig, '')
      switch(event.key){
        case "Backspace":
          this.keyCombination = ''
          this.inputKeyArr = []
          break;
        // 不需要的
        case "Tab":
        case " ":
        case "Process":
          break;
        default:
          //去重
          if(this.keyCombination.indexOf(str.toUpperCase()) == -1){
            this.keyCombination.replace(/^\s/g, '')
            this.inputKeyArr.push(str)
            if(this.inputKeyArr.length < 4){
              this.keyCombination += this.keyCombination ? (' + ' + str) : str
              this.keyCombination = this.keyCombination.toUpperCase()
            }
          }
          break;
      }
    },
    // 添加快捷键
    addShortcutKey(){
      if(!this.keyCombination || !this.combinationName.trim())return message.info('组合键或名称不能为空');
      let keyArr = this.keyCombination.split(' + ')
      keyArr.forEach((item,index) => {
        keyArr.splice(index,1,{key: item})
      })
      let obj =  {
        id: nanoid(),
        keys: keyArr,
        title: this.combinationName.trim(),
      }
      this.keyList.push(obj)
      this.keyCombination = ''
      this.combinationName = ''
    },
    // 添加分类名称
    addGroup(){
      if(!this.groupName.trim()) return message.info("分组名称不能为空")
      let obj = {
        id: nanoid(),
        groupName: this.groupName.trim()
      }
      this.keyList.push(obj)
      this.groupName = ''
    },
    // 上传头像前校验
    beforeUpload(file) {
      const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/jpg' || file.type === 'image/png'
      if (!isJpgOrPng) {
        this.$message.error('只能上传jpg/png格式的头像!')
      }
      const isLt2M = file.size / 1024 / 1024 < 2
      if (!isLt2M) {
        this.$message.error('图片不得大于2MB!')
      }
      return isJpgOrPng && isLt2M
    },
    // 上传头像
    uploadImage(file) {
      this.file = file.file
      // this.avatarLoading = true
      // const formData = new FormData()
      // formData.append('file', file.file)
      // api.upload(formData).then(res => {
      //   if (res) {
      //     this.imageUrl = res.data.data.link
      //     this.saveAvatar() // 保存新头像
      //     this.avatarLoading = false
      //   }
      // }, err => {
      //   this.avatarLoading = false
      // })
    },
    //图片选中后的事件

    // imageSelect(e) {
    //   console.log(e);
    //   var file = e.target.files[0]
    //   var reader = new FileReader()
    //   var that = this

    //   if (file.size / 1024 > 200) {
    //     layer.open({
    //     title: '提示',
    //     content: '上传图片的大小不能大于200K,请用photoshop等软件压缩一下图片'
    //     });
    //     return;
    //   }

    //   if (file.type.indexOf("gif") == -1 &&
    //     file.type.indexOf("jpeg") == -1 &&
    //     file.type.indexOf("jpg") == -1 &&
    //     file.type.indexOf("png") == -1 &&
    //     file.type.indexOf("bmp") == -1) {
    //       layer.open({
    //         title: '提示',
    //         content: '图片格式不正确，请重新选择图片'
    //       });
    //       return;
    //   }

    //   reader.readAsDataURL(file)

    //   reader.onload = function (e) {
    //     console.log("file name", file.name);
    //     console.log("file type", file.type);
    //     console.log("this.result", this.result)
    //     that.imageUrl = this.result

    //   }
    // }
  }
}
</script>

<style lang="scss" scoped>
  .box{
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    width: 100%;
    height: 100%;
    box-sizing: border-box;
  }
  .btn-item{
    display: flex;
    >div{
      background: var(--primary-bg);
      border-radius: 12px;
      display: flex;
      justify-content: center;
      align-items: center;
      font-family: PingFangSC-Regular;
      font-size: 16px;
      color: rgba(255,255,255,0.85);
    }
    div:nth-child(1){
      width: 120px;
      height: 48px;
    }
    div:nth-child(2){
      width: 200px;
      height: 48px;
      margin-left: 12px;
    }
  }
  .add-content{
    height: 90%;
    width: 480px;
    margin: 0 auto;
    overflow-x: hidden;
    overflow-y: auto;
    >span{
      font-family: PingFangSC-Medium;
      font-size: 16px;
      color: rgba(255,255,255,0.85);
      font-weight: 500;
      margin: 21px 0;
      display: block;
    }
  }
  .avatar{
    width: 100px;
    height: 100px;
    position: relative;
    >span{
      position: absolute;
      top: -14px;
      right: -14px;
    }
  }
  .key-content{
    height: 90%;
  }
  .addBtn{
    cursor: pointer;
    background: var(--secondary-bg);
    display: flex;
    align-items: center;
    border-radius: 12px;
    justify-content: center;
    margin-left: 12px;
    width:120px;
    height:48px;
    font-size: 16px;
    color: rgba(255,255,255,0.85);
  }
  .key-list{
    display: flex;
    flex-direction: column;    
    flex-wrap: wrap;
    overflow: hidden;
    align-content: flex-start;
    padding: 24px 0;
    height: 500px;
  }
  .add-content::-webkit-scrollbar{
    display: none;
  }
  .prompt{
      background: rgba(0,0,0,0.30);
      border-radius: 12px;
      height: 56px;
    }
  .right-text{
    margin: 0 40px;
  }
  .border-right {
    position: relative;
  }
  .border-right::after {
    content: '';
    position: absolute;
    right: -20px;
    top: 0;
    height: 56px;
    margin-left: 10px;
    border-right: solid rgba(255,255,255,0.1) 1px;
  }
  .input{
    width:227px;
    height: 48px;
    background: var(--secondary-bg);
    border-radius: 12px;
    color: var(--primary-text);
    font-size: 16px;
  }
  .s-bg{
        box-shadow: none !important;
    }
</style>