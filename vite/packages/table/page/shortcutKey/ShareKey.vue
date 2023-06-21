<template>
  <div class="p-3 s-bg rounded-lg box">
    <!-- 头部导航栏 -->
    <div class="flex items-center justify-between">
      <div class="flex">
        <div @click="onBack" class="pointer button-active s-bg h-12 w-12 flex items-center rounded-lg justify-center mr-3">
          <Icon icon="xiangzuo" style="font-size: 1.5em;"></Icon>
        </div>
        <HorizontalPanel :navList="navType" v-model:selectType="defaultNavType"></HorizontalPanel>
      </div>
      <div class="flex btn-item">
        <div class="pointer" @click="saveScheme">保存</div>
        <a-tooltip>
          <template #title>保存并分享到创意市场</template>
          <div class="pointer xt-active-btn" @click="shoreModal=true">保存并分享</div>
        </a-tooltip>
      </div>
    </div>
    <!-- 基本信息 -->
    <div class="add-content" v-if="defaultNavType.name === 'message'">
      <span>图标</span>
      <div class="flex">
        <div class="avatar">
          <div>
            <a-avatar shape="square" :size="100" :src="file.path ? file.path : icon" />
          </div>
          <span><Icon icon="guanbi2" style="font-size: 1.5em;"></Icon></span>
        </div>
        <div class="ml-10" style="font-family: PingFangSC-Regular;font-size: 16px;color: rgba(255,255,255,0.60);">
          <div>推荐图片尺寸：256*256，不要超过2MB</div>
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
      <a-input v-model:value="applyName" spellcheck ="false" class="input" placeholder="请输入应用名称" aria-placeholder="font-size: 14px;" style="width:480px;height: 48px;"/>
      <span>方案简介</span>
      <a-textarea v-model:value="introduce" spellcheck="false" class="input"  placeholder="请输入描述" aria-placeholder="font-size: 14px;color: rgba(255,255,255,0.40);" :rows="4" style="width:480px;height: 100px;"/>
      <div @click="nextStep" class="pointer flex items-center rounded-lg justify-center mr-3 mt-6 xt-active-btn" style="width:480px;height:48px;font-size: 16px;color: rgba(255,255,255,0.85);">下一步</div>
    </div>
    <!-- 快捷键 -->
    <div class="key-content" v-else>
      <!-- 输入框 -->
      <div class="input-item">
        <div>
          <a-input class=" input"  :value="keyCombination" @keydown="showInfo" spellcheck="false" placeholder="按下组合键"/>
          <a-input class="ml-3 input" v-model:value="combinationName" spellcheck="false" placeholder="操作名称" style="width:227px;height: 48px;"/>
          <div class="addBtn" @click="addShortcutKey">添加快捷键</div>
        </div>
        <div>
          <a-input class="ml-3 input" v-model:value="groupName" spellcheck="false" placeholder="分类名称" style="width:227px;height: 48px;"/>
          <div class="addBtn" @click="addGroup">新建分类</div>
        </div>
      </div>
      <!-- 提示 -->
      <div class="prompt mb-4 mx-3 px-4 flex justify-between items-center" v-show="closePrompt">
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
  <div class="fixed inset-0 home-blur" style="z-index: 99999;" v-if="shoreModal" >
    <div
         class="fixed text-white top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2  rounded-lg flex flex-col justify-evenly items-center"
         style="padding: 24px 32px;width: 480px;height: 221px;background:  #282828">
      <div>
        <Icon icon="yiwancheng" style="color:#52C41A;font-size:20px"></Icon>
        <span class="ml-2" style="font-size: 18px;color: rgba(255,255,255,0.85);font-weight: 500;">分享成功</span>
      </div>
      <div style="font-size: 16px;margin:24px 0;color: rgba(255,255,255,0.60);">
        「 {{ applyName }} 」成功分享至创意市场，选择分享到元社区让更多人看到吧～
      </div>
      <div class="flex">
        <div style="width: 160px;height: 48px;"
          @click="openDrawer"
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
  <!-- 发布抽屉 -->
  <a-drawer v-model:visible="releaseDrawer" style="z-index:999999;" width="500" placement="right">
    <template #extra>
      <a-space>
        <div class="add-scheme" @click="saveVal">发布</div>
      </a-space>
    </template>
    <div class="drawer-center">
      <div class="mb-5 title">动态</div>
      <div class="trend-content"></div>
      <div class="drawer-img">
        <div class="title">附图</div>
        <div class="btnCopy">复制图片</div>
      </div>
    </div>
  </a-drawer>
</template>

<script>
import HorizontalPanel from '../../components/HorizontalPanel.vue'
import ShortcutKeyList from '../../components/shortcutKey/ShortcutKeyList.vue';
import { mapActions, mapWritableState } from "pinia";
import { keyStore } from '../../store/key'
import {nanoid} from 'nanoid'
import { message } from 'ant-design-vue';
export default {
  name: 'ShareKey',
  components: {
    HorizontalPanel,
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
      // keyList: [
      //   {
      //     groupName: '常用0',
      //     id: 1,
      //   },
      //   {
      //     id: 2,
      //     keys: [
      //       {icon: 'linechart'},
      //       {key: 'H'}
      //     ],
      //     title: '首选项1',
      //   },
      //   {
      //     id: 3,
      //     keys: [
      //       {icon: 'linechart'},
      //       {icon: 'linechart'},
      //       {key: 'Q'}
      //     ],
      //     title: '清除2',
      //   },
      //   {
      //     id: 4,
      //     keys: [
      //       {icon: 'linechart'},
      //       {key: 'H'}
      //     ],
      //     title: '隐藏3'
      //   },
      //   {
      //     id: 5,
      //     keys: [
      //       {icon: 'linechart'},
      //       {key: 'H'}
      //     ],
      //     title: 'osoft4'
      //   },
      //   {
      //     groupName: '文件5',
      //     id: 6,
      //   },
      //   {
      //     id: 7,
      //     keys: [
      //       {icon: 'linechart'},
      //       {key: 'H'}
      //     ],
      //     title: '首选项6',
      //   },
      //   {
      //     id: 8,
      //     keys: [
      //       {icon: 'linechart'},
      //       {icon: 'linechart'},
      //       {key: 'Q'}
      //     ],
      //     title: '清除浏览器数据7',
      //   },
      //   {
      //     id: 9,
      //     keys: [
      //       {icon: 'linechart'},
      //       {key: 'H'}
      //     ],
      //     title: '隐藏8'
      //   },
      //   {
      //     id: 10,
      //     keys: [
      //       {icon: 'linechart'},
      //       {key: 'H'}
      //     ],
      //     title: '隐藏 Microsoft9'
      //   },
      //   {
      //     id:11,
      //     keys: [
      //       {icon: 'linechart'},
      //       {key: 'H'}
      //     ],
      //     title: '首选项'
      //   },
      //   {
      //     id:12,
      //     keys: [
      //       {icon: 'linechart'},
      //       {icon: 'linechart'},
      //       {key: 'Q'}
      //     ],
      //     title: '清除浏览器数据'
      //   },
      //   {
      //     id: 13,
      //     groupName: '其他'
      //   },
      //   {
      //     id:14,
      //     keys: [
      //       {icon: 'linechart'},
      //       {key: 'H'}
      //     ],
      //     title: '辅导课'
      //   },
      //   {
      //     id:15,
      //     keys: [
      //       {icon: 'linechart'},
      //       {icon: 'linechart'},
      //       {key: 'Q'}
      //     ],
      //     title: '类似的控股权'
      //   }
      // ],
      keyList: [],
      keyIndex: 1,
      imageUrl: '',
      file: {},
      shoreModal: false,
      keyCombination: '',
      inputKeyArr: [],
      combinationName: '',
      groupName: '',
      // 介绍
      introduce: '',
      releaseDrawer: false,
      icon: '',
      applyName: '',
      appContent: {},
      paramsId: -1
    }
  },
  computed: {
    ...mapWritableState(keyStore,['recentlyUsedList'])
  },
  mounted(){
    this.getData()
  },
  methods: {
    ...mapActions(keyStore, ['setSchemeList','setShortcutKeyList']),
    getData(){
      if(this.$route.params.id){
        this.paramsId = this.$route.params.id
        this.recentlyUsedList.find(item => {
          if(item.id == this.paramsId){
            this.appContent = item
            this.icon = item.icon
            this.keyList = item.keyList
            this.applyName = item.name
            this.introduce = item.commonUse
          }
        })
      }
    },
    // 保存
    saveScheme(){
      if(!this.applyName)return message.info('名称不能为空')
      if(this.paramsId !== -1){
        this.appContent.icon = this.icon 
        this.appContent.keyList = this.keyList
        this.appContent.name = this.applyName
        this.appContent.commonUse = this.introduce
        this.setSchemeList(this.appContent)
      }else{
        const time = new Date().valueOf()
        this.appContent =  {   
          id: nanoid(),  //唯一标识
          icon: this.file.path, //方案的图片
          name: this.applyName, //方案名称
          number: 92, //快捷键总数
          commonUse: this.introduce, //方案简介
          avatar: '/icons/logo128.png', //方案人
          nickName: 'Victor Ruiz', //头像
          sumLikes: 0, //总赞数
          download: 0, //下载次数
          key: '快捷键',
          time, //时间轴
          isLike: false,  //是否点赞
          isMyCreate: true, //是否是自己创建
          isShare: false, //是否分享到社区
          isCommunity: false, //是否来自社区
          keyList: this.keyList //快捷键列表
        }
        this.setShortcutKeyList(this.appContent)
      }
      message.success('成功保存');
      this.$router.go(-1)
    },
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
    openDrawer(){
      this.shoreModal = false
      this.releaseDrawer = true
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
      width: 150px;
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
      top: -10px;
      right: -10px;
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
  .input-item{
    display: flex;
    justify-content: space-between;
    margin: 28px 12px 16px;
    >div{
      display: flex;
    }
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
  .s-bg{
        box-shadow: none !important;
    }
  .add-scheme{
    background: #2A2A2A;
    border-radius: 12px;
    width: 80px;
    height: 48px;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .drawer-center{
    .title{
      font-size: 16px;
      color: rgba(255,255,255,0.85);
      font-weight: 500;
    }
    .trend-content{
      background: #2A2A2A;
      border: 1px solid rgba(255,255,255,0.1);
      border-radius: 12px;
      height:100px;
    }
    .drawer-img{
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin: 24px 0;
      .btnCopy{
        background: #2A2A2A;
        border-radius: 12px;
        width: 128px;
        height: 48px;
        display: flex;
        justify-content: center;
        align-items: center;
      }
    }
  }
</style>