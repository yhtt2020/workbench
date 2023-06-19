<template>
  <!-- 详情快捷方案 -->
 <div class="detail-box" v-if="keyList.length">
   <!-- 头部导航 -->
   <div class="flex justify-between items-center" style="height: 72px;width:98%">
    <div class="flex items-center">
      <div @click="onBack" class="pointer button-active s-bg h-12 w-12 flex items-center rounded-lg justify-center mr-3">
        <Icon icon="xiangzuo" style="font-size: 1.5em;"></Icon>
      </div>
      <div class="flex">
        <div v-for="(item,index) in appList.slice(0,3)" class="head-list"
        :class="navIndex === index ? 's-bg':''" @click="toggleApp(index)">
          <span>
            <a-avatar shape="square" :src="item.icon" :size="38"></a-avatar>
          </span>
          <span class="ml-2" style="font-size: 16px;color: rgba(255,255,255,0.85);">{{ item.name }}</span>
        </div>
      </div>
      <div @click="recentlyUsed = true" class="pointer button-active s-bg h-12 w-12 flex items-center rounded-lg justify-center">
        <Icon icon="gengduo1" style="font-size: 1.5em;"></Icon>
      </div>
    </div>
    <div class="flex">
      <div @click="clipSearch" class="pointer button-active s-bg h-12 w-12 flex items-center rounded-lg justify-center mr-3">
        <Icon icon="dianzan" style="font-size: 1.5em;"></Icon>
      </div>
      <div class="pointer button-active s-bg h-12 w-12 flex items-center rounded-lg justify-center" @click="openSet = true">
        <Icon icon="shezhi" style="font-size: 1.5em;"></Icon>
      </div>
    </div>
  </div>
  <!-- 快捷键列表 -->
  <div style="width:98%;height:85%;">
    <ShortcutKeyList :keyList="keyList" :keyIndex="keyIndex" @setKeyItem="setKeyItem" :keyBoxStyle="{background:'var(--primary-bg)'}"></ShortcutKeyList>
  </div>
 </div>
 <!-- 无详情快捷方案 -->
 <div class="detail-box" v-else>
  <!-- 头部快捷软件 -->
  <div class="flex items-center mb-3">
    <div @click="onBack" class="pointer button-active s-bg h-12 w-12 flex items-center rounded-lg justify-center mr-3">
      <Icon icon="xiangzuo" style="font-size: 1.5em;"></Icon>
    </div>
    <div class="head-list s-bg">
      <span>
        <a-avatar shape="square" :src="appList[0].icon" :size="38"></a-avatar>
      </span>
      <span class="ml-2" style="font-size: 16px;color: rgba(255,255,255,0.85);">{{ appList[0].name }}</span>
    </div>
  </div>
  <!-- 快捷推荐列表 -->
  <NotShortcutKey :notDownloadList="notDownloadList" :detailJump="true" :appMessage="appMessage"></NotShortcutKey>
 </div>
  <!-- 最近使用 -->
  <a-drawer v-model:visible="recentlyUsed" title="最近使用" width="500" placement="right">
    <div class="main-part">
        <div v-for="item in appList" class="flex items-center mb-4 pointer" @click="btnDetail(item)">
            <span class="mx-4 h-14 w-14 flex justify-center items-center">
                <a-avatar shape="square" :src="item.icon" :size="48"></a-avatar>
            </span>
            <span>{{ item.name }}</span>
            <div class="flex flex-col justify-center items-center">
                <span>{{ item.number }}</span>
                <span>快捷键</span>
            </div>
        </div>
    </div>
  </a-drawer>
  <!-- 设置 -->
  <a-drawer v-model:visible="openSet" title="设置" width="500" placement="right">
    <span class="set-title" v-if="appContent.isCommunity">该快捷键方案来自创意市场</span>
    <span class="set-title" v-else-if="appContent.isMyCreate && appContent.isShare">该快捷键方案由我创建，并已分享至创意市场</span>
    <span class="set-title" v-else-if="appContent.isMyCreate && !appContent.isShare">该快捷键方案未分享至社区，仅本地可用</span>
    <div  class="pointer recommend">
      <div class="flex justify-between">
        <div class="flex">
          <span class="h-14 w-14 flex justify-center items-center">
            <a-avatar shape="square" :src="appContent.icon" :size="48"></a-avatar>
          </span>
          <span class="flex flex-col ml-4">
            <span style="font-size: 18px;color: rgba(255,255,255,0.85);font-weight: 500;">{{ appContent.name }}</span>
            <span class="mt-1" style="font-size: 16px;color: rgba(255,255,255,0.60);">{{ appContent.commonUse }}</span>
          </span>
        </div>
        <div class="flex flex-col justify-center items-center w-16 h-16 s-bg rounded-lg">
          <span style="font-family: Oswald-SemiBold;font-size: 24px;color: rgba(255,255,255,0.85);font-weight: 600;">{{ appContent.number }}</span>
          <span>{{appContent.key}}</span>
        </div>
      </div>
      <div class="flex justify-between items-center mt-4" style="font-size: 14px;color: rgba(255,255,255,0.60);">
        <span class="flex items-center">
          <div @click="showCard(appContent.id)">
            <a-avatar size="24">
                <template #icon><UserOutlined /></template>
            </a-avatar>
          </div>
          <span class="ml-3">{{ appContent.userName }}</span>
        </span>
        <span v-if="appContent.isCommunity || appContent.isShare">
          <span>
            <Icon icon="dianzan" class="mr-2"></Icon>
            <span>{{ appContent.sumLikes }}</span>
          </span>
          <span class="ml-3">
            <Icon icon="xiazai" class="mr-2"></Icon>
            <span>{{ appContent.download }}</span>
          </span>
        </span>
      </div>
    </div>
    <div class="set-item" v-if="!appContent.isMyCreate">
      <Icon icon="xiazai" class="mr-2"></Icon>
      <span>下载更新</span>
    </div>
    <div class="set-item" v-if="appContent.isMyCreate && !appContent.isShare">
      <Icon icon="upload" class="mr-2"></Icon>
      <span>立即上传</span>
    </div>
    <div class="set-item" v-if="!appContent.isMyCreate">
      <Icon icon="dianzan" class="mr-2"></Icon>
      <span>点赞</span>
    </div>
    <div class="set-item" @click="btnEdit">
      <Icon icon="bianji" class="mr-2"></Icon>
      <span>编辑方案</span>
    </div>
    <div class="set-item">
      <Icon icon="delete" class="mr-2"></Icon>
      <span>删除</span>
    </div>
  </a-drawer>
</template>

<script>
import NotShortcutKey from './NotShortcutKey.vue'
import ShortcutKeyList from '../../components/shortcutKey/ShortcutKeyList.vue'
export default {
  name: 'ShortcutKeyDetail',
  components: {
    NotShortcutKey,
    ShortcutKeyList
  },
  data(){
    return{
      navIndex: 0,
      keyIndex: 1,
      recentlyUsed: false,
      openSet: false,
      appList: [
        {   
            icon: 'http://a.apps.vip/icons/flappy.jpg',
            name: 'Adobe Lightroom',
            number: 92
        },
        {
            icon: 'http://a.apps.vip/icons/flappy.jpg',
            name: 'Adobe Lightroom',
            number: 92
        },
        {
            icon: 'http://a.apps.vip/icons/flappy.jpg',
            name: 'Adobe Lightroom',
            number: 92
        },
        {
            icon: 'http://a.apps.vip/icons/flappy.jpg',
            name: 'Adobe Lightroom',
            number: 92
        },
        {
            icon: 'http://a.apps.vip/icons/flappy.jpg',
            name: 'Adobe Lightroom',
            number: 92
        },
        {
            icon: 'http://a.apps.vip/icons/flappy.jpg',
            name: 'Adobe Lightroom',
            number: 92
        },
      ],
      //快捷键列表
      keyList: [
        {
          groupName: '常用',
          id: 1,
        },
        {
          id: 2,
          keys: [
            {icon: 'linechart'},
            {key: 'H'}
          ],
          title: '首选项',
        },
        {
          id: 3,
          keys: [
            {icon: 'linechart'},
            {icon: 'linechart'},
            {key: 'Q'}
          ],
          title: '清除浏览器数据',
        },
        {
          id: 4,
          keys: [
            {icon: 'linechart'},
            {key: 'H'}
          ],
          title: '隐藏 Microsoft Edge'
        },
        {
          id: 5,
          keys: [
            {icon: 'linechart'},
            {key: 'H'}
          ],
          title: '隐藏 Microsoft Edge'
        },
        {
          groupName: '文件',
          id: 6,
        },
        {
          id: 7,
          keys: [
            {icon: 'linechart'},
            {key: 'H'}
          ],
          title: '首选项',
        },
        {
          id: 8,
          keys: [
            {icon: 'linechart'},
            {icon: 'linechart'},
            {key: 'Q'}
          ],
          title: '清除浏览器数据',
        },
        {
          id: 9,
          keys: [
            {icon: 'linechart'},
            {key: 'H'}
          ],
          title: '隐藏 Microsoft Edge'
        },
        {
          id: 10,
          keys: [
            {icon: 'linechart'},
            {key: 'H'}
          ],
          title: '隐藏 Microsoft Edge'
        }
      ],
      //推荐方案
      notDownloadList: [
        {   
          id: 1,
          icon: 'http://a.apps.vip/icons/flappy.jpg',
          name: 'Adobe Lightroom',
          number: 92,
          commonUse: 'Lr常用26个快捷键',
          avatar: '',
          userName: 'Victor Ruiz',
          sumLikes: 12334,
          download: 1232,
        },
        {   
          id: 2,
          icon: 'http://a.apps.vip/icons/flappy.jpg',
          name: 'Adobe Lightroom',
          number: 92,
          commonUse: 'Adobe XD',
          avatar: '',
          userName: 'Victor Ruiz',
          sumLikes: 12334,
          download: 1232,
        },
        {   
          id: 3,
          icon: 'http://a.apps.vip/icons/flappy.jpg',
          name: 'Adobe Lightroom',
          number: 92,
          commonUse: 'Lr常用26个快捷键',
          avatar: '',
          userName: 'Victor Ruiz',
          sumLikes: 12334,
          download: 1232,
        },
        {   
          id: 4,
          icon: 'http://a.apps.vip/icons/flappy.jpg',
          name: 'Adobe Lightroom',
          number: 92,
          commonUse: 'Lr常用26个快捷键',
          avatar: '',
          userName: 'Victor Ruiz',
          sumLikes: 12334,
          download: 1232,
        },
        {   
          id: 5,
          icon: 'http://a.apps.vip/icons/flappy.jpg',
          name: 'Adobe Lightroom',
          number: 92,
          commonUse: 'Lr常用26个快捷键',
          avatar: '',
          userName: 'Victor Ruiz',
          sumLikes: 12334,
          download: 1232,
        },
        {   
          id: 6,
          icon: 'http://a.apps.vip/icons/flappy.jpg',
          name: 'Adobe Lightroom',
          number: 92,
          commonUse: 'Lr常用26个快捷键',
          avatar: '',
          userName: 'Victor Ruiz',
          sumLikes: 12334,
          download: 1232,
        },
      ],
      // 单个app的内容
      appContent: {
        id: 1,
        icon: 'https://s1.hdslb.com/bfs/static/jinkela/popular/assets/icon_popular.png',
        name: 'Adobe Lightroom',
        number: 92,
        commonUse: 'Lr常用26个快捷键',
        avatar: '',
        userName: 'Victor Ruiz',
        sumLikes: 12334,
        download: 39,
        key: '快捷键',
        time: 1686462400000,
        isDownload: true, //是否下载
        isLike: false,  //是否点赞
        isMyCreate: false, //是否是自己创建
        isShare: false, //是否分享到社区
        isCommunity: true, //是否来自社区
        keyList: [
          {
            groupName: '常用',
            id: 1,
          },
          {
            id: 2,
            keys: [
              {icon: 'linechart'},
              {key: 'H'}
            ],
            title: '首选项',
          },
          {
            id: 3,
            keys: [
              {icon: 'linechart'},
              {icon: 'linechart'},
              {key: 'Q'}
            ],
            title: '清除浏览器数据',
          },
          {
            id: 4,
            keys: [
              {icon: 'linechart'},
              {key: 'H'}
            ],
            title: '隐藏 Microsoft Edge'
          },
          {
            id: 5,
            keys: [
              {icon: 'linechart'},
              {key: 'H'}
            ],
            title: '隐藏 Microsoft Edge'
          },
          {
            groupName: '文件',
            id: 6,
          },
          {
            id: 7,
            keys: [
              {icon: 'linechart'},
              {key: 'H'}
            ],
            title: '首选项',
          },
          {
            id: 8,
            keys: [
              {icon: 'linechart'},
              {icon: 'linechart'},
              {key: 'Q'}
            ],
            title: '清除浏览器数据',
          },
          {
            id: 9,
            keys: [
              {icon: 'linechart'},
              {key: 'H'}
            ],
            title: '隐藏 Microsoft Edge'
          },
          {
            id: 10,
            keys: [
              {icon: 'linechart'},
              {key: 'H'}
            ],
            title: '隐藏 Microsoft Edge'
          }
        ]
      }
    }
  },
  mounted(){
  },
  methods:{
    toggleApp(index){
      this.navIndex = index
    },
    setKeyItem(id){
      this.keyIndex = id
    },
    onBack(){
      this.$emit('detailShow',false)
    },
    btnEdit(){
      this.openSet = false
    }
  },
}
</script>

<style lang="scss" scoped>
.detail-box{
  width: 100%;
  height: 100%;
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
  .s-bg{
    box-shadow: none !important;
  }
  .main-part{
        >div{
            background: rgba(0,0,0,0.30);
            border-radius: 12px;
            width:452px;
            height:88px;
            position: relative;
            >div{
                position: absolute;
                top: 0;
                bottom: 0;
                right: 0;
                width: 88px;
                height: 88px;
                background: rgba(0,0,0,0.30);
                border-radius: 0px 12px 12px 0px;
                >span:nth-child(1){
                    font-family: Oswald-SemiBold;
                    font-size: 28px;
                    color: rgba(255,255,255,0.85);
                    font-weight: 600;
                }
            }
        }
        >div:last-child{
          margin-bottom: 0;
        }
    }
  .head-list{
    margin-right: 12px;
    padding: 6px 12px;
    cursor: pointer;
    border-radius: 12px;
    min-width: 80px;
    white-space: nowrap;
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
    border-right: solid rgba(255, 245, 245, 0.1) 1px;
  }
  .recommend{
    margin: 24px 0;
    background: #2A2A2A;
    border-radius: 12px;
    // width: 452px;
    height: 136px;
    padding: 12px;
  }
  .set-title{
    font-size: 16px;
    color: rgba(255,255,255,0.85);
    font-weight: 500;
  }
  .set-item{
    background: #2A2A2A;
    border-radius: 12px;
    // width: 452px;
    height: 48px;
    margin-bottom: 16px;
    font-size: 16px;
    color: rgba(255,255,255,0.85);
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
  }
</style>