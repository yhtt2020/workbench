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
        <div class="pointer" @click="bulkEdit">{{ bulkEditKey ? '完成编辑' : '批量编辑'}}</div>
        <div class="pointer" @click="saveScheme">保存</div>
        <a-tooltip>
          <template #title>保存并分享到创意市场</template>
          <div class="pointer xt-active-btn" @click="saveShare">保存并分享</div>
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
          <span v-if="icon || file.path" @click="delIcon"><Icon icon="guanbi2" style="font-size: 1.5em;"></Icon></span>
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
    <div class="key-content" v-show="defaultNavType.name === 'shortcutkey'">
      <!-- 提示 -->
      <div class="prompt mt-4 mx-3 px-4 flex justify-between items-center" v-show="closePrompt">
        <span class="flex items-center">
          <Icon icon="tishi-xianxing" style="width: 21px;height: 21px;color:#508BFE;"></Icon>
          <span class="mx-4">支持长按拖拽排序</span>
        </span>
        <Icon icon="guanbi2" style="width: 20px;height: 20px;color:#7A7A7A;" @click="closePrompt = false"></Icon>
      </div>
      <!-- 快捷键列表 -->
      <!-- <div :style="closePrompt ? 'height:90%' : 'height:100%'"> -->
      <vue-custom-scrollbar :settings="settingsScroller" :style="closePrompt ? 'height:90%' : 'height:100%'">
        <div class="key-box" :style="keyBoxStyle" id="keyBox">
          <div v-for="(item,index) in keyList" :key="item.id">
            <!-- 分组名称 -->
            <div v-if="!item.keys" class="key-item border-right" @click="editItem(item,index,'name')">
              <div class="flex items-center" v-if="item.isEdit">
                <a-input class="input"
                  v-model:value="item.groupName" 
                  :ref="`inputNameEdit_${index}`"
                  spellcheck="false" 
                  placeholder="分类名称" 
                  style="width:370px;height: 48px;"
                  @blur="lostFocus(item,'groupName')"
                />
                  <span @click.stop="delKey(index,item)">
                    <Icon class="ml-3" icon="close-circle-fill" style="font-size:21px;color: #7A7A7A;"></Icon>
                  </span>
              </div>
              <span v-else class="truncate">{{ item.groupName }}</span>
            </div>
            <!-- 快捷键 -->
            <div v-else class="border-right key-item" 
            @click="editItem(item,index,'item')">
              <div class="flex">
                <template v-if="!item.isEdit">
                  <div v-for="i in item.keys" :key="i" class="flex">
                    <span style="min-width:32px;padding:0 8px;" class="s-bg h-8 flex items-center rounded-lg justify-center mr-3">{{ i }}</span>
                  </div>
                </template>
                <div v-else class="flex items-center mr-3" @click="openKeyBoard(item,'key')">
                  <a-input class="input pointer"
                    v-model:value="item.keyStr" 
                    readonly
                    spellcheck="false" 
                    placeholder="按下组合键" 
                    style="width:179px;height: 48px;"
                  >
                    <template #suffix>
                    <div class="w-8 h-8 flex rounded-lg justify-center items-center" 
                    style="background: rgba(80,139,254,0.20);">
                      <Icon icon="jianpan-xianxing" class="active-bg" style="color:#508BFE;"></Icon>
                    </div>
                    </template>
                  </a-input>
                </div>
              </div>
              <div>
                <div class="key-title truncate" v-if="!item.isEdit">{{ item.title}}</div>
                <a-input class="input text-right"
                  v-else
                  v-model:value="item.title" 
                  :id="`keyName_${item.id}`"
                  spellcheck="false" 
                  placeholder="快捷键名称" 
                  style="width:179px;height: 48px;"
                  @blur="lostFocus(item,'keyName')"
                  />
              </div>
              <span v-if="item.isEdit" class="flex"> 
                <a-tooltip v-if="!item.addNote">
                  <template #title>添加备注</template>
                  <span @click.stop="setAddNote(index,item)" v-if="item.isEdit">
                    <Icon class="ml-3" icon="edit-square" style="font-size:21px;color: #7A7A7A;"></Icon>
                  </span>
                </a-tooltip>
                <span @click.stop="delNote(index,item)">
                  <Icon class="ml-3" icon="close-circle-fill" style="font-size:21px;color: #7A7A7A;"></Icon>
                </span>
              </span>
            </div>
            <!-- 备注 -->
            <div v-if="item.addNote" @click="editItem(item,index,'note')">
              <div class="key-item border-right" v-if="item.isNote">
                <div class="flex items-center">
                  <a-input class="input text-right"
                    v-model:value="item.noteVal" 
                    :id="`note_${item.id}`"
                    spellcheck="false" 
                    placeholder="备注" 
                    style="width:370px;height: 48px;"
                    @blur="lostFocus(item,'note')"
                  />
                    <span @click.stop="delNote(index,item)">
                      <Icon class="ml-3" icon="close-circle-fill" style="font-size:21px;color: #7A7A7A;"></Icon>
                    </span>
                </div>
              </div>
              <div v-else class="text-note">
                <span class="note-val">{{ item.noteVal }}</span>
              </div>
            </div>
          </div>
          <!-- 添加单个快捷键 -->
          <!-- <div class="input-item"> -->
            <!-- 添加组合键 -->
            <!-- <div class="border-right key-item input-item"> -->
            <!-- <div class="border-right key-item input-item" v-for="(item,i) in addKeyList" :key="i">
              <div class="flex">
                <div class="flex items-center mr-3" @click="openKeyBoard(i,'addKey')">
                  <a-input class="input pointer" 
                    :value="keyCombination[i]"
                    readonly
                    spellcheck="false" 
                    placeholder="按下组合键" 
                    style="width:179px;height: 48px;"
                  >
                    <template #suffix>
                    <div class="w-8 h-8 flex rounded-lg justify-center items-center" 
                    style="background: rgba(80,139,254,0.20);">
                      <Icon icon="jianpan-xianxing" class="active-bg" style="color:#508BFE;"></Icon>
                    </div>
                    </template>
                  </a-input>
                </div>
              </div>
              <div>
                <a-input class="input text-right"
                  v-model:value="combinationName[i]" 
                  spellcheck="false" 
                  placeholder="快捷键名称" 
                  style="width:179px;height: 48px;"
                  :ref="'inputFocusKey_'+ i"
                  @click="getFocus('key',i)"
                  @blur="lostFocus('inputFocusKey_'+ i,'addKeyName')"
                  />
              </div>
              <span @click.stop="delStaging('key')">
                <Icon class="ml-3" icon="close-circle-fill" style="font-size:21px;color: #7A7A7A;"></Icon>
              </span>
            </div> -->
            <!-- 添加分类名称 -->
            <!-- <div class="key-item border-right input-item">
              <div class="flex items-center">
                <a-input class="input"
                  v-model:value="addGroupName" 
                  spellcheck="false" 
                  placeholder="分类名称" 
                  style="width:370px;height: 48px;"
                  ref="inputFocusName"
                  @click="getFocus('name')"
                  />
                  <span @click.stop="delStaging('name')">
                    <Icon class="ml-3" icon="close-circle-fill" style="font-size:21px;color: #7A7A7A;"></Icon>
                  </span>
              </div>
            </div> -->
            <div class="add-box input-item">
              <div class="add-btn" style="width:181px" @click="addShortcutKey">新增快捷键</div>
              <div class="add-btn" @click="addGroup">新增分类</div>
            </div>
          <!-- </div> -->
        </div>
      </vue-custom-scrollbar>
      <!-- </div> -->
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
  <!-- 键盘 -->
  <KeyBoard v-if="keyBoard" 
  :selectKey="selectKey" 
  :parentKeyList="keyList"
  @closeKeyBoard="closeKeyBoard"
  @saveKey="saveKey"></KeyBoard>
</template>

<script>
import Sortable from 'sortablejs'
import HorizontalPanel from '../../components/HorizontalPanel.vue'
import ShortcutKeyList from '../../components/shortcutKey/ShortcutKeyList.vue';
import KeyBoard from '../../components/shortcutKey/KeyBoard.vue';
import { mapActions, mapWritableState } from "pinia";
import { keyStore } from '../../store/key'
import {nanoid} from 'nanoid'
import { message } from 'ant-design-vue';
export default {
  name: 'ShareKey',
  components: {
    HorizontalPanel,
    ShortcutKeyList,
    KeyBoard
  },
  directives: {
      focus: {
          inserted(el) {
              el.focus();
          }
      }
  },
  data(){
    return{
      settingsScroller: {
        useBothWheelAxes: true,
        swipeEasing: true,
        suppressScrollY: true,
        suppressScrollX: false,
        wheelPropagation: true
      },
      navType:[
         {title:'基本信息',name:'message'},
         {title:'快捷键',name:'shortcutkey'}
      ],
      defaultNavType:{title:'基本信息',name:'message'},
      closePrompt: true, //提示
      keyList: [], //快捷键列表
      imageUrl: '',
      file: {},
      shoreModal: false, //分享
      addKeyList: [''], //添加快捷键集合
      keyCombination: [], //添加组合键
      combinationName: [], //添加快捷键名称
      addGroupName: [], //添加的分类名称
      groupName: '', //当前修改的分类名称
      keyName: '', //当前修改的快捷键类名
      keyContent: '',//当前修改的组合键
      introduce: '', //方案简介
      releaseDrawer: false,
      icon: '',
      applyName: '',
      appContent: {}, //当前方案
      paramsId: -1,
      keyBoard: false,
      selectKey: {},//选中的快捷键
      stagingKey: [],// 暂存的Key
      bulkEditKey: false,
      addNumber: 0
    }
  },
  watch: {
    recentlyUsedList: {
        deep:true,
        handler(newV,oldV){
      }
    }
  },
  computed: {
    ...mapWritableState(keyStore,['recentlyUsedList'])
  },
  mounted(){
    this.getData()
    this.$nextTick(() => {
      this.keyDrop()
    })

  },
  methods: {
    ...mapActions(keyStore, ['setSchemeList','setShortcutKeyList','setMarketList', 'delRecentlyEmpty']),
    async getData(){
      if(this.$route.params.id){
        this.paramsId = this.$route.params.id
        // let usedList = this.deepClone({},this.recentlyUsedList)
        // let usedList = this.copyObj(this.recentlyUsedList)
        this.recentlyUsedList.find(i => {
          if(i.id == this.paramsId){
            let item =  JSON.parse(JSON.stringify(this.deepClone({},i)))
            this.appContent = item
            this.icon = item.icon
            this.keyList = item.keyList
            this.applyName = item.name
            this.introduce = item.commonUse
          }
        })
        //执行添加默认添加一个可编辑的空数据
        this.addShortcutKey()
      }
    },
    //写函数
		copyObj(obj){
			let newObj={};
			for(let key in obj){
				if(typeof obj[key] =='object'){//如:key是wife,引用类型,那就递归
					newObj[key] = copyObj(obj[key])
				}else{//基本类型,直接赋值
					newObj[key] = obj[key];
				}
			}
			return newObj;
		},
    //深拷贝
    deepClone(obj, newObj) {
      var newObj = newObj || {};
      for (let key in obj) {
        if (typeof obj[key] == 'object') {
          newObj[key] = (obj[key].constructor === Array) ? [] : {}
          this.deepClone(obj[key], newObj[key]);
        } else {
          newObj[key] = obj[key]
        }
      }
      return newObj;
    },
    // 删除空数据
    delNotData(){
      // 检测快捷键列表中的空数据后进行删除操作
      this.keyList = this.keyList.filter(item => {
        return item.keyStr !== '' && item.groupName !== '' && item.title !== ''
      })
      this.delRecentlyEmpty({keyList: this.keyList, id: this.paramsId})
    },
    // 保存
    saveScheme(){
      if(!this.applyName)return message.info('名称不能为空')
      this.delNotData()

      let sum = 0
      this.keyList.map(item => {
        if(item.keys){
          sum += item.keys.length
        }
      })
      if(this.paramsId !== -1){
        this.appContent.icon = this.icon || this.file.path 
        this.appContent.keyList = this.keyList
        this.appContent.name = this.applyName
        this.appContent.commonUse = this.introduce
        this.appContent.number = sum
        this.setSchemeList(this.appContent)
      }else{
        const time = new Date().valueOf()
        this.appContent =  {   
          id: nanoid(),  //唯一标识
          icon: this.file.path, //方案的图片
          name: this.applyName, //方案名称
          number: sum, //快捷键总数
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
    // 保存并分享
    // setMarketList
    saveShare(){
      if(!this.applyName)return message.info('名称不能为空')
      if(!this.keyList.length)return message.info('快捷键列表不能为空')
      this.delNotData()

      let sum = 0
      this.keyList.map(item => {
        if(item.keys){
          sum += item.keys.length
        }
      })
      if(this.paramsId !== -1){
        this.appContent.icon = this.icon || this.file.path 
        this.appContent.keyList = this.keyList
        this.appContent.name = this.applyName
        this.appContent.commonUse = this.introduce
        this.appContent.number = sum
        this.appContent.isShare = true
        this.appContent.isMyCreate = true
        this.appContent.isCommunity =  false
        this.setMarketList(this.appContent)
      }else{
        const time = new Date().valueOf()
        this.appContent =  {   
          id: nanoid(),  //唯一标识
          icon: this.file.path, //方案的图片
          name: this.applyName, //方案名称
          number: sum, //快捷键总数
          commonUse: this.introduce, //方案简介
          avatar: '/icons/logo128.png', //方案人
          nickName: 'Victor Ruiz', //头像
          sumLikes: 0, //总赞数
          download: 0, //下载次数
          key: '快捷键',
          time, //时间轴
          isLike: false,  //是否点赞
          isMyCreate: true, //是否是自己创建
          isShare: true, //是否分享到社区
          isCommunity: false, //是否来自社区
          keyList: this.keyList //快捷键列表
        }
        this.setMarketList(this.appContent)
      }
      this.shoreModal = true
    },
    onBack(){
      this.delNotData()
      this.$router.go(-1)
    },
    nextStep(){
      this.defaultNavType = {title:'快捷键',name:'shortcutkey'}
    },
    close(){
      this.shoreModal = false
      this.$router.go(-1)
    },
    // 编辑内容
    editItem({id,groupName,keyStr,title},index,type){
      this.keyList.forEach(i => {
        if(i.id === id || i.keyStr === '' || i.groupName === '' || i.title === '' || this.bulkEditKey){
          i.isEdit = true
          i.isNote = true
        }else{
          i.isEdit = false
          i.isNote = false
        }
      })
      switch (type) {
        case 'name':
          this.groupName = groupName
          this.$nextTick(() => {
            this.$refs[`inputNameEdit_${index}`][0].focus()
          })
          break;
        case 'item':
          this.keyList.forEach(i => {
            if(i.id === id){
              i.isEdit = true
              i.isNote = true
            }
          })
          // this.keyName = title
          // this.keyContent = keyStr
          // this.$nextTick(() => {
          //   this.$refs[`inputKeyEdit_${index}`][0].focus()
          // })
          break;
        case 'note':
          this.keyList.forEach(i => {
            if(i.id === id){
              i.isEdit = true
              i.isNote = true
            }
          })
          break;
      }
    },
    //添加的input获取焦点 (禁止拖拽导致需要手动获取焦点)
    getFocus(type,index){
      switch (type) {
        case 'key':
          this.$refs[`inputFocusKey_${index}`][0].focus()
          break;
        case 'name':
        this.$refs.inputFocusName.focus()
          break;
      }
      
    },
    // 失去焦点，保存修改
    lostFocus(item,type){
      setTimeout(()=>{
        switch (type) {
          case 'groupName':
            if(!item.groupName.trim()){
              item.groupName = this.groupName
              return message.info('分组名称不能为空');
            }else{
              if(!this.bulkEditKey){
                 this.keyList.forEach(kItem => {
                  if(kItem.id === item.id)kItem.isEdit = false
                })
              }
            }
            break;
          case 'keyName':
            if(!item.title.trim()){
              item.title = this.keyName
              return message.info('快捷键名称不能为空');
            }else{
              if(!item.keys.length){
                item.keyStr = '?'
                item.keys.push('?')
              }
              if(!this.bulkEditKey){
                // if(item.keys.length){
                  this.keyList.forEach(kItem => {
                    if(kItem.id === item.id){
                      // 查找你要判断的文本框
                      var  myInput = document.getElementById( 'note_' + item.id );
                      if(myInput != document.activeElement) {
                        setTimeout(()=> {
                          kItem.isEdit = false
                          kItem.isNote = false
                          if(!kItem.noteVal){
                            kItem.addNote = false
                          }
                        }, 200)
                      }
                    }
                  })
                // }
              }
            }
            break;
          case 'note':
          if(!this.bulkEditKey){
            this.keyList.forEach(kItem => {
              if(kItem.id === item.id){
                
                // 查找你要判断的文本框
                var  myInput = document.getElementById( 'keyName_' + item.id );
                if  (myInput != document.activeElement) {
                  setTimeout(()=> {
                    kItem.isEdit = false
                    kItem.isNote = false
                    if(!kItem.noteVal){
                      kItem.addNote = false
                    }
                  }, 200)
                }
              }
            })
          }
        }
      },200)
      
    },
    // 开启键盘
    openKeyBoard(item,type){
      switch (type) {
        case 'key':
          this.selectKey = item
          break;
        case 'addKey':
          this.addNumber = item
          // this.stagingKey.id ? this.stagingKey : 
          this.selectKey = {
            id: nanoid(),
            keys: item.keys ? item.keys : [],
            keyStr: item.keyStr ? item.keyStr : '',
            keyArr: item.keyArr ? item.keyArr : [],
            title: item.title ? item.title : '',
            isEdit: item.keyStr ? true : false,
            addInputIndex: item
          }
          break;
      }
      
      this.keyBoard = true
    },
    // 关闭键盘
    closeKeyBoard(){
      this.keyBoard = false
    },
    // 保存修改的快捷键
    saveKey(keyArr){

      this.keyBoard = false
      this.keyList.forEach((item,index) => {
        if(item.id === keyArr.id){
          if(keyArr.title && !this.bulkEditKey){
            keyArr.isEdit = false
            keyArr.isNote = false
          }
          this.keyList.splice(index,1,keyArr)
          this.keyContent = keyArr.keyStr
        }
        if(item.keyStr === '' || item.title === ''){
          item.isEdit = true
          item.isNote = true
        }
      })
    },
    // 添加快捷键
    addShortcutKey(){
      this.keyList.push({
        id: nanoid(),
        keys: [],
        keyStr: '',
        keyArr: [],
        title: '',
        isEdit: true,
      })
    },
    // 添加分类名称
    addGroup(){
      this.keyList.push({
        id: nanoid(),
        groupName: '',
        isEdit: true,
      },)
      // if(!this.addGroupName.trim()) return message.info("分组名称不能为空")

      // let obj = {
      //   id: nanoid(),
      //   groupName: this.addGroupName.trim(),
      //   isEdit: false
      // }
      // this.keyList.push(obj)
      // this.addGroupName = ''
      // if(this.bulkEditKey){
      //   this.bulkEditKey = false
      //   this.bulkEdit()
      // }
    },
    // 删除一列快捷键
    delKey(index,item){
      this.keyList.forEach(i => {
        if(item.id === i.id)this.keyList.splice(index,1)
      })
      // this.keyList.splice(index,1)
    },  
    delNote(index,item){
      this.keyList.forEach(i => {
        if(item.id === i.id){
          i.addNote = false
          i.isNote = false
          i.noteVal = ''
        }
      })
    },
    //添加备注
    setAddNote(index,item){
      item.addNote = true
      item.isNote = true
    },    
    // addKey(){

    // },
    // 删除暂存添加的内容
    delStaging(type){
      switch (type) {
        case 'key':
          this.stagingKey = {}
          this.keyCombination = ''
          this.combinationName = ''
          break;
        case 'name':
          this.addGroupName = ''
          break;
      }
    },
    openDrawer(){
      this.shoreModal = false
      this.releaseDrawer = true
    },
    // 批量编辑
    bulkEdit(){
      this.bulkEditKey = !this.bulkEditKey
      if(this.bulkEditKey){
        this.keyList.forEach(item => {
          item.isEdit = true
          item.isNote = true
        })
      }else{
        this.keyList.forEach(item => {
          if(item.title === '' || item.keys === '' || item.groupName === ''){
            item.isEdit = true
            item.isNote = true
          }else{
            item.isEdit = false
            item.isNote = false
          }
        })
      }
    },
    //拖拽排序
    keyDrop(){
      let that = this;
      let side = document.getElementById('keyBox')
      Sortable.create(side, {
        sort: true,
        filter: '.input-item',
        animation: 150,
        onUpdate:function(event){
          let newIndex = event.newIndex,
            oldIndex = event.oldIndex
          let  newItem = side.children[newIndex]
          let  oldItem = side.children[oldIndex]
          // 先删除移动的节点
          side.removeChild(newItem)
          // 再插入移动的节点到原有节点，还原了移动的操作
          if(newIndex > oldIndex) {
            side.insertBefore(newItem,oldItem)
          } else {
            side.insertBefore(newItem,oldItem.nextSibling)
          }
          let temp = that.keyList[oldIndex]
          that.keyList.splice(oldIndex, 1)
          that.keyList.splice(newIndex, 0, temp)
        }
      });
    },
    // 删除上传的方案图标
    delIcon(){
      this.file = {} 
      this.icon = ''
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
    div:nth-child(1),
    div:nth-child(2){
      width: 120px;
      height: 48px;
      margin-right: 12px;
    }
    div:nth-child(3){
      width: 150px;
      height: 48px;
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
  .add-box{
    margin-left: 48px;
    display: flex;
    .add-btn{
      cursor: pointer;
      background: var(--secondary-bg);
      display: flex;
      align-items: center;
      border-radius: 12px;
      justify-content: center;
      margin-left: 12px;
      width:180px;
      height:48px;
      font-size: 16px;
      color: rgba(255,255,255,0.85);
    }
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
  .border-right{
    position: relative;
  }
  .border-right::after{
    content: '';
    position: absolute;
    right: -100px;
    top: 0;
    height: 56px;
    margin-left: 10px;
    border-right: solid rgba(255,255,255,0.1) 1px;
  }
  // .input-item{
    // justify-content: space-between;
    // margin: 28px 12px 16px;
    // >div{
    //   display: flex;
    // }
  // }
  .input{
    width:227px;
    height: 48px;
    background: var(--secondary-bg);
    border-radius: 12px;
    color: var(--primary-text);
    font-size: 16px;
    border: 1px solid rgba(255,255,255,0.2);
  }
  .key-title{
    flex: 1;
    max-width: 160px;
    text-align: right;
  }
  .edit-item{
    width:227px;
    height: 48px;
    background: var(--secondary-bg);
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
  .key-box{
    border-radius: 12px;
    display: flex;
    flex-direction: column;
    align-content: flex-start;
    // overflow: auto;
    padding: 24px 0; 
    flex-wrap: wrap;
    height: 100%;
    width: 100%;
    
  }
  .key-box::-webkit-scrollbar{
    display: none;
  }
  .key-item{
    padding: 0 12px;
    margin: 0 100px 8px 48px;
    width: 370px;
    height:48px;
    line-height:48px;
    font-size: 16px;
    color: rgba(255,255,255,0.85);
    display: flex;
    border-radius: 8px;
    justify-content: space-between;
    align-items: center;
    cursor: pointer;
    border-radius: 8px;
  }
  .text-note{
    margin: 0 100px 0 48px;
    padding: 0 12px;
    width: 370px;
    height: 22px;
    text-align:right;
    position: relative;
  }
  .note-val{
    position: relative;
    top: -14px;
    font-size: 16px;
    color: var(--secondary-text);
  }

  .text-note::after {
    content: '';
    position: absolute;
    right: -100px;
    top: 0;
    height: 22px;
    margin-left: 10px;
    border-right: solid rgba(255,255,255,0.1) 1px;
  }
  
</style>