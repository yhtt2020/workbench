const { db } = require('../../js/util/database');
const { api } = require('../../server-config')
const standAloneAppModel=require('../util/model/standAloneAppModel.js')

const sidebarTpl = `
  <div id="sidebar" class="side-container">
    <div id="itemsEl" class="side-items">
      <ul class="app-task">
        <li @click="toggleUserPanel" class="" style="position: relative;">
          <template>
            <a-drawer class="user-panel" @mousemove="setSidePanel()" :width="300" :visible="userPanelVisible"
              @close="toggleUserPanel" :mask="false" placement="left">
              <template slot="title">
                <span v-if="user.uid==0"> 登录帐号免费体验完整功能 </span>
              </template>
              <div v-if="user.uid===0">
                <a-button @click="userClick" type="primary" block>登录帐号</a-button>
                <br /><br />
                1.跨设备、跨终端同步我的应用和标签组设置<br />
                2.支持多个空间任意切换<br />
                3.与其他用户在线交流、反馈产品使用建议<br />
                4.开启更多高级功能<br />
                &nbsp;① 团队功能，与团队成员共享收藏<br />
                &nbsp;② 企业社区，支持私密社区，供团队内成员交流<br />
                &nbsp;③ 全网热议，支持任意网站与其他用户在线沟通
              </div>
              <div v-if="user.uid!==0">
                <template>
                  <div style="position: relative">
                    <div style="text-align: left">
                      <a-row>
                        <a-col :span="8" style="text-align: center">
                          <a-avatar style="position: relative;cursor: pointer" @click="userClick" :size="60"
                            :src="user.avatar">
                          </a-avatar>
                          <div class="level">{{user.grade.grade}}</div>
                        </a-col>
                        <a-col :span="12">
                          <a class="nick-name" @click="userClick">{{ user.nickname }}</a>
                          <div class="signature" :title="this.user.signature===''?'这个家伙有点懒，还没有签名~':this.user.signature">
                            签名：{{this.user.signature===''?'这个家伙有点懒，还没有签名~':this.user.signature}}
                          </div>
                        </a-col>
                      </a-row>
                    </div>
                    <div style="margin-bottom: 10px">
                      <template>
                        <a-row class="user-data">
                          <a-col :span="8">
                            <div @click="goSpace" class="num">{{user.postCount}}</div>
                            <div class="data-name">内容</div>
                          </a-col>
                          <a-col :span="8">
                            <div @click="goSpace" class="num">{{user.fans}}</div>
                            <div class="data-name">粉丝</div>
                          </a-col>
                          <a-col :span="8">
                            <div @click="goSpace" class="num">{{user.follow}}</div>
                            <div class="data-name">关注</div>
                          </a-col>

                        </a-row>
                        <a-row class="actions">

                          <a-col @click="goProfile" class="action" :span="8">
                            <a-tooltip title="个人资料">
                              <a-icon style="font-size: 24px" type="profile"></a-icon>
                              <div>资料</div>
                            </a-tooltip>
                          </a-col>
                          <a-col @click="goGroup" class="action" :span="8">
                            <a-tooltip title="团队">
                              <a-icon style="font-size: 24px" type="team"></a-icon>
                              <div>团队</div>
                            </a-tooltip>
                          </a-col>
                          <a-col @click="goAccount" class="action" :span="6">
                            <a-tooltip title="帐号管理">
                              <a-icon style="font-size: 24px" type="idcard"></a-icon>
                              <div>帐号</div>
                            </a-tooltip>
                          </a-col>
                          <!--                              <a-col  class="action" :span="8">-->

                          <!--                              </a-col>-->
                        </a-row>
                      </template>
                    </div>
                    <div class="my-group">
                      <template>
                        <div class="mg-top flex justify-between align-center">
                          <div class="mg-top-lf">我加入的团队({{this.$store.getters.getAllCircle.length}})</div>
                          <a-button class="mg-top-right" type="primary" icon="plus" size="small" @click="createGroup" />
                        </div>
                        <div class="mg-content flex flex-direction">
                          <template v-if="this.$store.getters.getAllCircle.length===0">
                            <a-empty style="margin-top: 10px">
                              <span slot="description"> 暂无团队， <a @click="openGroupHelp">了解团队功能</a> </span>
                              <a-button type="primary" @click="createGroup">
                                创建首个团队
                              </a-button>
                            </a-empty>
                          </template>
                          <div class="mg-content-btn flex flex-direction"
                            v-for="(item, index) in this.$store.getters.getAllCircle" :key="item.id">
                            <div class="cb-top flex align-center justify-start">
                              <img :src="item.logo" alt="">
                              <div class="cb-top-word">{{item.name}}</div>
                              <a-tag class="cb-top-tag" color="#f50"
                                v-show="item.hasOwnProperty('status') && item.status === 2 ">审核中</a-tag>
                              <a-tag class="cb-top-tag" color="#CFD1D0"
                                v-show="item.hasOwnProperty('status') && item.status === 3 ">申请驳回</a-tag>
                            </div>
                            <div class="cb-bottom flex align-center justify-around">
                              <a-button class="cb-bottom-zone" type="link" icon="team" @click="openCircle(item.id)">
                                圈子
                              </a-button>
                              <a-button class="cb-bottom-zone" type="link" icon="message" @click="openLumen(item.id)">
                                群聊
                              </a-button>
                              <a-button class="cb-bottom-zone" type="link" icon="setting"
                                @click="openCircleSetting(item.id)">
                                设置
                              </a-button>
                            </div>
                          </div>
                        </div>
                      </template>
                    </div>
                    <!--                        <a-dropdown>-->
                    <!--                          <a-menu slot="overlay">-->
                    <!--&lt;!&ndash;                            <a-menu-item v-for="(item,key) in accounts" :key="key">&ndash;&gt;-->
                    <!--&lt;!&ndash;                              <a-avatar shap="circle" size="small" :src="item.avatar"></a-avatar>&ndash;&gt;-->
                    <!--&lt;!&ndash;                              &nbsp;{{ item.nickname}}&ndash;&gt;-->
                    <!--&lt;!&ndash;                            </a-menu-item>&ndash;&gt;-->
                    <!--                            <a-menu-item @click="switchAccount">-->
                    <!--                              <a-icon style="margin-left: 5px" shap="circle" type="plus-circle"></a-icon>-->
                    <!--                              &nbsp;绑定新帐号-->
                    <!--                            </a-menu-item>-->
                    <!--                          </a-menu>-->

                    <!--                          <a-button shape="circle" size="small" style="position: absolute; right: 10px; top:10px">-->
                    <!--                            <a-icon type="down"></a-icon>-->
                    <!--                          </a-button>-->
                    <!--                        </a-dropdown>-->
                  </div>
                  <div>
                    <div style="position: absolute; bottom: 10px; width: 250px">
                      <a-button @click="logout" block>
                        <a-icon type="poweroff"></a-icon>
                        注销
                      </a-button>
                    </div>
                  </div>
                </template>
              </div>
            </a-drawer>
          </template>
          <a-popover @visible-change="changePopoverVisible" placement="right" :mouse-enter-delay="0.3"
            overlay-class-name="tips">
            <template slot="title">
              <span v-if="user.uid==0"> 登录帐号免费体验完整功能 </span>
              <span v-else> {{ user.nickname }} </span>
            </template>

            <template slot="content">
              <div v-if="user.uid===0">
                1.跨设备、跨终端同步我的应用和标签组设置<br />
                2.支持多个空间任意切换<br />
                3.与其他用户在线交流、反馈产品使用建议<br />
                4.开启更多高级功能<br />
                &nbsp;① 团队功能，与团队成员共享收藏<br />
                &nbsp;② 企业社区，支持私密社区，供团队内成员交流<br />
                &nbsp;③ 全网热议，支持任意网站与其他用户在线沟通
              </div>
              <div v-if="user.uid!==0">用户信息</div>
            </template>
            <div @contextmenu="toggleUserPanel()" class="wrapper" block>
              <div class="item-icon">
                <a-avatar v-if="user.uid!==0"
                  style="border: 1px solid #cfcfcf; background-color: white;width: 28px;height: 28px" class="icon"
                  :src="user.avatar"></a-avatar>
                <a-badge v-if="user.uid===0" count="登录" :offset="[-15,30]" :number-style="{'font-size':'12px'}">
                  <a-avatar style=" background-color: white; color: #aaa;width: 28px;height: 28px" class="icon"
                    src="../../icons/user.svg"></a-avatar>
                </a-badge>

                <!-- <a-badge :count="0" :dot="true" status="processing"
                                :style="{position: 'absolute',right:  '-2px',top:'-13px'}" />
                            </a-badge> -->
              </div>
              <div class="item-title">{{ user.nickname }}</div>
            </div>
          </a-popover>
        </li>
        <li>
          <app-manager ref="appManager" :apps="apps" :running-apps="runningApps"></app-manager>
        </li>
      </ul>
      <div id="saApp-box" class="app-box" style="height: 200px;overflow-x: hidden;overflow-y: hidden;flex:none">
        <ul id="pinGroup" class="app-task app-items" style="margin-bottom: 0; ">

          <li v-for="app in apps" @click="executeApp(app)" @mouseenter="hoverApp($event,app)"
            @contextmenu="createMenu(app.id,app)" v-if="app.processing || app.settings.showInSideBar">
            <a-popover placement="right" :mouse-enter-delay="0.3" overlay-class-name="tips" @visible-change="">
              <template slot="title">
                <span class="app-name-popover"> {{app.name}} </span>
              </template>
              <template slot="content" v-if="app.processing">
                <div class="app-capture">
                  <img :src="'file://'+app.capture" onerror="this.src='../../icons/svg/empty.svg'">
                </div>
              </template>
              <template slot="content" v-else>
                {{app.summary}}
              </template>
              <div class="wrapper sa-app-wrapper">
                <div v-if="app.processing" class="processing"></div>
                <div class="item-icon">
                  <a-badge :count="app.badge">
                    <!--                :style="{position: 'absolute',right:  '-2px',visibility:'visible'}"-->

                    <img onerror="this.src='../../icons/default.svg'" class="icon sa-app"
                      :style="app.processing? {'border-color':app.userThemeColor!==''?app.userThemeColor:app.themeColor}:{}"
                      :src="app.logo" />

                  </a-badge>
                </div>
                <div class="item-title">{{app.name}} </div>
              </div>
            </a-popover>
          </li>
          <!--        <li-->
          <!--          @click="openCom()"-->
          <!--          style="position: relative"-->
          <!--        >-->
          <!--          &lt;!&ndash;              <a-popover&ndash;&gt;-->
          <!--          &lt;!&ndash;                title="团队协作"&ndash;&gt;-->
          <!--          &lt;!&ndash;                placement="right"&ndash;&gt;-->
          <!--          &lt;!&ndash;                :mouse-enter-delay="0.1"&ndash;&gt;-->
          <!--          &lt;!&ndash;                :mouse-leave-delay="0.1"&ndash;&gt;-->
          <!--          &lt;!&ndash;                :destroy-tooltip-on-hide="true"&ndash;&gt;-->
          <!--          &lt;!&ndash;                overlay-class-name="tips">&ndash;&gt;-->
          <!--          &lt;!&ndash;                <template slot="content">&ndash;&gt;-->

          <!--          &lt;!&ndash;                </template>&ndash;&gt;-->
          <!--          <div class="wrapper" @dblclick.stop="closeItem(item)">-->
          <!--            <div class="item-icon">-->
          <!--              <img class="icon" style="border-color:#12a900" src="../../icons/svg/com.svg"/>-->
          <!--              <a-badge-->
          <!--                count="0"-->
          <!--                :dot="true"-->
          <!--                :style="{position: 'absolute',right:  '-2px',top:'-13px',visibility:'visible'}"-->
          <!--              >-->
          <!--              </a-badge>-->
          <!--            </div>-->
          <!--            <div class="item-title">效率社区</div>-->
          <!--          </div>-->
          <!--          &lt;!&ndash;              </a-popover>&ndash;&gt;-->
          <!--        </li>-->
          <draggable v-model="getPinItems" group="sideBtn" animation="300" dragClass="dragClass" ghostClass="ghostClass"
            chosenClass="chosenClass" @start="onStart" @end="onEnd">
            <transition-group>
              <li v-for="(item,i) in this.$store.getters.getPinItems" :key="item.id" @click="openPinItem(item.id,i)"
                :class="isActive(item.id)" style="position: relative" :item-id="item.id">
                <a-popover :title="item.count>5?item.title+' -- 高负载（5+）':item.title" placement="right"
                  :mouse-enter-delay="0.1" :mouse-leave-delay="0.2" :destroy-tooltip-on-hide="true"
                  overlay-class-name="tips">
                  <template slot="content">
                    <ul class="tabs">
                      <li class="tab-title" :class="{'active':tab.selected}" v-for="(tab,j) in item.tabs" :key="tab.id">
                        <img class="tab-icon" :src="tab.icon" /> {{ tab.title }}
                      </li>
                    </ul>
                  </template>
                  <div class="wrapper" @dblclick.stop="closeItem(item)">
                    <div class="item-icon">
                      <img class="icon" :src="item.icon" />
                      <a-badge :count="item.count" :dot="true" status="processing"
                        :style="{position: 'absolute',right:  '-2px',top:'-13px',visibility:item.count>5?'visible':'hidden'}">
                      </a-badge>
                    </div>
                    <div class="item-title">{{ item.title }}</div>
                  </div>
                </a-popover>
              </li>
            </transition-group>
          </draggable>
        </ul>
      </div>

      <a-tooltip placement="right" :auto-adjust-overflow="true">
        <div slot="title">
          拖动：手动，自由调节应用栏高度，可通过滚轮滚动显示隐藏应用；<br>双击：自动，根据应用数量自动调节高度，显示全部内应用
        </div>
        <div @dblclick.prevent="fitSize" @mousedown="dividerResizeStart" style="cursor: n-resize;padding: 10px 0;">
          <div style="width: 100%;
    height: 1px;
    background: rgba(199,199,199,0.65);"></div>
        </div>
      </a-tooltip>

      <div class="app-box">
        <ul id="appGroup" style="user-select: none;padding-bottom: 20px" class="app-task app-items"
          @dblclick.prevent="addNewTask">
          <draggable v-model="getItems" group="sideBtn" animation="300" dragClass="dragClass" ghostClass="ghostClass"
            chosenClass="chosenClass" @start="onStart" @end="onEnd">
            <transition-group>
              <li @click="openItem(item.id,i)" @dblclick.stop="" v-for="(item,i) in this.$store.getters.getItems"
                :key="item.id" :visible="item.count>1" data-role="task" :class="isActive(item.id)" :item-id="item.id"
                style="position: relative">
                <a-popover placement="right" :mouse-enter-delay="0.1" :mouse-leave-delay="0.2"
                  :overlay-style="{'width':'305px','height':item.tabs.length*30+50+'px'}" overlay-class-name="tips">
                  <div slot="title">
                    <span @click.stop="editTaskName(item)" class="task-title"><span class="text"
                        :id="'taskTitle'+item.id">{{ item.count > 5 ? item.title + ' -- 高负载（5+）' : item.title }}
                      </span>
                      <a-icon :id="'editTip'+item.id" class="edit-tip" type="edit"></a-icon>
                      <a-input @blur="editTaskNameBlur(item)" hidden :id="'taskTitleInput'+item.id" size="small"
                        @keypress.enter="editTaskNameKeyPress($event)" :default-value="item.title"></a-input>
                    </span>
                    <span style="float: right;cursor: pointer" @click="closeItem(item)">
                      <a-icon title="删除标签组" type="close-circle"></a-icon>
                    </span>
                  </div>
                  <template slot="content">
                    <div style="text-align: right">
                      <span class="action" size="small" title="锁定当前标签组内全部标签" @click="lockTask(item.id)">
                        <a-icon type="lock"></a-icon>锁定
                      </span>
                      <span class="action" size="small" title="清理组内全部未锁定标签" @click="clearTaskUnlock(item)">
                        <a-icon type="delete"></a-icon>清理
                      </span>
                    </div>
                    <ul class="tabs" style="margin-top: 5px">
                      <li :class="{'active':(tab.selected )}" style="position:relative;"
                        @mouseenter="showHoverLock(tab)" @mouseleave="hideHoverLock(tab)" v-for="(tab,j) in item.tabs"
                        :key="tab.id">
                        <div class="tab-title" @click="openPopoverTab(item.id, tab.id)">
                          <img class="tab-icon" :src="tab.icon"
                            onerror="this.src='../../icons/default.svg'" />&nbsp;{{ tab.title }}
                        </div>
                        <span @click="toggleLockTab(tab.id,item.id)" :id="'hoverLock'+tab.id" :hidden="tab.lock!==true"
                          title="锁定当前标签；锁定后，标签将无法随意关闭" class="unlock-tab">
                          <a-icon type="lock"></a-icon>
                        </span>
                      </li>
                    </ul>
                  </template>
                  <div class="wrapper">
                    <div class="item-icon">
                      <img class="icon" :src="item.icon" onerror="this.src='../../icons/default.svg'" />
                      <a-badge :count="item.count" :dot="true" status="processing"
                        :style="{position: 'absolute',right:  '-2px',top:'-13px',visibility:item.count>5?'visible':'hidden'}">
                      </a-badge>
                    </div>
                    <div class="item-title">{{ item.title }}</div>
                  </div>
                </a-popover>
              </li>
            </transition-group>
          </draggable>
        </ul>
      </div>
    </div>
    <div id="bottomsEl" class="bottom-container">
      <ul class="bottomBar">
        <template>
          <div>
            <a-collapse default-active-key="0" :active-key="sidebarBottom" :bordered="false" @change="changeBottomSize">
              <a-collapse-panel key="1">
                <li @click="openBottom('help')">
                  <a-button type="default" shape="circle" icon="question-circle"></a-button>
                  <div class="item-title">帮助中心</div>
                </li>

              </a-collapse-panel>
            </a-collapse>
          </div>
        </template>
        <li @click="visibleMessageCenter">
          <a-button type="default" shape="circle" icon="bell"></a-button>
          <div class="item-title">消息中心</div>
        </li>
        <li @click="openBottom('setting')">
          <a-button type="default" shape="circle" icon="setting"></a-button>
          <div class="item-title">偏好设置</div>
        </li>
      </ul>
    </div>
    <message-center :visible="messageShow" :mod="mod" @closeMessage="() => this.messageShow = !this.messageShow" @updateVisible="(val) => this.messageShow = val">
    </message-center>
  </div>
`

Vue.component('sidebar', {
	data: function() {
		return {
      messageShow: false,
      resize:false,
      startY:0,
      apps:[],
      runningApps:[],//运行中的应用
      mod:'auto',//auto open close
      isPopoverShowing:false,
      lastOpenId:0,
			drag: false,
			remote: {},
			loginPanelTitle:"登录帐号免费体验完整功能",
			loginPanelContent:``,
			userPanelVisible:false,
			devices: [{
					'name': 'IphoneX',
					'width': 375,
					'height': 812,
					'icon': 'mobile'
				}, {
					'name': 'Ipad',
					'width': 768,
					'height': 1024,
					'icon': 'tablet'
				}, {
					'name': 'IpadPro',
					'width': 1024,
					'height': 1366,
					'icon': 'tablet'
				},
				{
					'name': '1080P pc',
					'width': 1920,
					'height': 1080,
					'icon': 'desktop'
				},
				{
					'name': '2K pc',
					'width': 2560,
					'height': 1440,
					'icon': 'desktop'
				},
				{
					'name': '4K pc',
					'width': 4096,
					'height': 2160,
					'icon': 'desktop'
				},


			],
			accounts:[
				{
					'uid':1,
					'nickname':'张三',
					'avatar':'../../icons/apps.svg'
				},
				{
					'uid':2,
					'nickname':'李四',
					'avatar':'../../icons/browser.ico'
				}
			],
      sidebarBottom:0
		}

	},
	beforeCreate() {
		this.form = this.$form.createForm(this, {
			name: 'validate_other'
		});

	},
	async mounted() {
    await standAloneAppModel.initialize()
    this.apps=await standAloneAppModel.getAllApps()
    ipc.send('getRunningApps')

      if(localStorage.getItem('sidebarDividerMod')==='auto' || !!!localStorage.getItem('sidebarDividerMod')){
        document.getElementById('pinGroup').style.position='relative'
        document.getElementById('pinGroup').style.height='auto'
        document.getElementById('saApp-box').style.height='auto'
      }else{
        document.getElementById('pinGroup').style.position='absolute'
        document.getElementById('saApp-box').style.height=localStorage.getItem('sidebarDividerY') || '200px'
      }

    //mark插入对password的数据统计
    let passwordList = await ipc.invoke('credentialStoreGetCredentials')
    await userStatsModel.setValue('password', passwordList.length)
		// let item = {
		// 	title: '打开标签', //名称，用于显示提示
		// 	index: 0, //索引
		// 	id: "1", //id
		// 	icon: "/icons/fav.png", //图标
		// 	draggable: true, //是否允许拖拽
		// 	ext: '', //额外的信息
		// 	fixed: false //固定
		// }
		if (window.sidebarData === false) {
			console.log('comp loaded fail')
			console.log(window.sidebarData)
			this.$store.commit('initItems')
		} else {
			this.$store.state.pinItems = window.sidebarData.state.sidebar.pinItems
			this.$store.state.items = window.sidebarData.state.sidebar.items
		}
    let that=this
    db.system.where({name:'sidebarBottom'}).first((data)=>{
      that.sidebarBottom= data.value
      setTimeout(that.fixElementPosition,250)
    })
    const currentUser = await db.system.where('name').equals('currentUser').first()
    if(currentUser.value.uid !== 0 ) {
      try {
        //await this.$store.dispatch('getGroups')
        await this.$store.dispatch('getJoinedCircle', {page: 1, row: 500})
        await this.$store.dispatch('getMyCircle', {page: 1, row: 500})
      } catch(err) {
        console.log(err)
        console.log('团队列表接口错误!')
      }
    }
    let sideMode=localStorage.getItem('sideMode')
    sideMode = sideMode||'auto'
    if(sideMode==='close' || sideMode==='auto'){
      document.getElementById('clickThroughElement').style.left = '55px'
    }
    else if(sideMode==='open'){
      document.getElementById('appVue').classList.add('expand')
      document.getElementById('clickThroughElement').style.left = '155px'
    }
    appVue.mod=sideMode
    this.mod= sideMode
	},
	computed: {
		user(){
			return this.$store.state.user
		},
		getItems: {
			get() {
				//将task与items同步一次
				return this.$store.getters.getItems
			},
			set(newValue) {
				this.$store.commit('saveItems', newValue)
			}
		},
		getPinItems: {
			get() {
				//将task与items同步一次
				return this.$store.getters.getPinItems
			},
			// setter
			set(newValue) {
				this.$store.commit('savePinItems', newValue)
			}

		},
		isActive() {
			return (id) => {
				return {
					active: id == this.$store.state.selected,
					'app-task': true
				}
			}

		}

	},
	template: sidebarTpl,
	methods: {
    visibleMessageCenter() {
      this.messageShow = !this.messageShow
    },
    openCircle(args) {
      this.userPanelVisible = false
      this.addTab(`${api.getUrl(api.API_URL.user.CIRCLE)}?id=${args}`)
    },
    // openPost() {
    //   this.userPanelVisible = false
    //   this.addTab(api.getUrl(api.API_URL.user.CIRCLE))
    // },
    // openFollow() {
    //   this.userPanelVisible = false
    //   this.addTab(api.getUrl(api.API_URL.user.CIRCLE))
    // },
    // openFans() {
    //   this.userPanelVisible = false
    //   this.addTab(api.getUrl(api.API_URL.user.CIRCLE))
    // },
    openCircleSetting(args) {
      ipc.send('osxOpenCircleSetting', args)
    },
    openLumen(id) {
      ipc.send('saAppOpen', {saAppId: 1, options: {circleId: id}})
    },
    /**
     * app浮窗显示隐藏
     */
    hoverApp(e,app){
       // if(app.processing){
       //   ipc.send('getAppCapture',{id:app.id})
       // }
    },
    executeApp(app){
      // if(!!!app.processing){
      //   ipc.send('executeApp',{app:app})
      // }
      // 判断单例的问题留给主进程处理
      ipc.send('executeApp',{app:app})
    },
		toggleUserPanel(){
			this.userPanelVisible=!this.userPanelVisible
		},
		switchTask(id, index) {
			postMessage({
				message: 'switchToTask',
				id: id,
				index: index
			})
			this.$store.commit('setSelected', id)
		},
    switchTab(taskId, tabId) {
      postMessage({
        message: 'switchToTab',
        taskId: taskId,
        tabId: tabId
      })
      this.$store.commit('setSelected', taskId)
    },
		openPinItem(id, index) {
			if (this.$store.getters.getPinItems[index].type == 'system-bookmark') {
				//this.$tabEditor.show(tasks.getSelected().tabs.getSelected(), '!bookmarks ')
				postMessage({
					message: 'openBookMarks'
				})
			} else if (this.$store.getters.getPinItems[index].type == 'task') {
        this.openItem(id, index)
			}
		},
		openItem(id, index) {
      if(id!==this.lastOpenId){
        this.switchTask(id, index)
        this.lastOpenId=id
      }

		},
    openPopoverTab(taskId, tabId) {
      if(taskId !== this.lastOpenId) {
        //当点击不同task的popover卡片内的tab时
        this.switchTab(taskId, tabId)
        this.lastOpenId = taskId
      } else {
        //当点击同一个task的popover卡片内的tab时，只需跳转tab
        this.switchTab(null, tabId)
      }
    },
		openBottom(action) {
			postMessage({
				message: action
			})

		},
    openGroup(){
      ipc.send('openGroup')
    },
		//开始拖拽事件
		onStart() {
			this.drag = true;
		},
		//拖拽结束事件
		onEnd(e) {
			this.drag = false;

			//找到拖动的任务的id
			let el = e.item
			var droppedTaskId = el.getAttribute('item-id')
			let adjacentTaskId = this.getNewIndex(droppedTaskId)
			let oldTasks = this.$store.state.tasks

			//let droppedTask = oldTasks.splice(oldTasks.getIndex(droppedTaskId), 1)[0]
			//两轮寻找后，一定会找到真正的id
			//oldTasks.splice(adjacentTaskId, 0, droppedTask)
			postMessage({
				'message': 'resortTasks',
				'droppedTaskId': droppedTaskId,
				'adjacentTaskId': adjacentTaskId
			})

		},
		onMove({
			relatedContext,
			draggedContext
		}) {
			const relatedElement = relatedContext.element;
			const draggedElement = draggedContext.element;
			return (
				!draggedElement.fixed //&&(!relatedElement || !relatedElement.fixed)
			);
		},
		//对任务数组重新进行排序
		getNewIndex(droppedTaskId) {
			let index = 0
			let find = 0
			let pinItems = this.$store.getters.getPinItems
			let items = this.$store.getters.getItems
			for (var i = 0; i < pinItems.length; i++) {
				if (pinItems[i]['type'] == 'task')
					index++
				//如果当前新数组的元素是task类型，且id和拓转的是一样的。则直接返回index即可了
				if (pinItems[i]['type'] == 'task' && pinItems[i]['ext'] == droppedTaskId) {
					index = index - 1
					find = 1
					break;
				}
			}
			if (find == 0) {
				for (var i = 0; i < items.length; i++) {
					//继续找，如果上面没找到index应该还是-1
					if (items[i]['type'] == 'task') {
						index++
					}
					if (items[i]['type'] == 'task' && items[i]['ext'] == droppedTaskId) {
						index = index - 1 //需要加上第一组的id的总数
						break;
					}
				}
			}
			return index

		},
		changeBottomSize(key) {
			let that = this
			setTimeout(function() {
				that.fixElementPosition()
			}, 200)
      let state= key.length===1?1:0
      db.system.where({name:'sidebarBottom'}).delete()
      db.system.put({name:'sidebarBottom',value:state})

		},
		fixElementPosition() {
			const itemsEl = document.getElementById('itemsEl')
			const bottomsEl = document.getElementById('bottomsEl')
			itemsEl.style.bottom = bottomsEl.offsetHeight + 'px'
		},
		//点击用户登录按钮
		userClick(){
			if(this.user.uid===0){
				this.addTab(api.getUrl(api.API_URL.user.login))
			}else{
				this.addTab(api.getUrl(api.API_URL.user.home))
			}
			this.userPanelVisible=false
		},
    openCom(){
      if(this.user.uid===0){
        this.addTab(api.getUrl(api.API_URL.user.login))
      }else{
        this.addTab(api.getUrl(api.API_URL.user.home))
      }
    },
		addTab(url){
			postMessage({
				message: "addTab",
				'url':url
			})
		},
		async logout(){
      const result = await db.system.where('name').equals('currentUser').first()
      ipc.send('logoutBrowser', result.value.code)
			await window.insertDefaultUser(result.value.code)
      //下面这步在insertDefaultUser方法中有
			//db.system.where({name:'currentUser'}).delete()
			this.$message.info('注销成功！');
		},
    switchAccount(){
      this.userPanelVisible=false
      this.addTab(api.getUrl(api.API_URL.user.login))
    },
    goSpace(){
      this.userPanelVisible=false
      this.addTab(api.getUrl(api.API_URL.user.space))
    },
    goProfile(){
      this.userPanelVisible=false
      this.addTab(api.getUrl(api.API_URL.user.profile))
    },
    goGroup(){
      this.userPanelVisible=false
      this.addTab(api.getUrl(api.API_URL.group.index))
    },
    goAccount(){
      this.userPanelVisible=false
      this.addTab(api.getUrl(api.API_URL.user.account))
    },
    openGroupHelp(){
      ipc.send('addTab',{url:'https://www.yuque.com/tswork/ngd5zk/rls0pi'})
    },
    addNewTask(e){
      ipc.send('addNewTask')
      this.$message.success({content:'成功添加一个新标签组到左侧栏。'})
    },
    closeItem(item){
      if(item.type==='task'){
        let hasLocked=false
        item.tabs.forEach((item)=>{
          if(item.lock===true){
            hasLocked=true
          }
        })
        if(hasLocked===false){
          ipc.send('closeTask',{tabId:item.id})
          this.$message.success({content:'删除标签组成功。'})
        }else{
          this.$message.error({content:'删除标签失败，组内存在锁定标签，请解锁后重新删除。'})
        }

      }
    },
    createGroup(){
      //ipc.send('createGroup')   //原方案废弃
      ipc.send('osxCreateCircle')
    },
    changePopoverVisible(visible){
      this.isPopoverShowing=visible
    },
    /**
     * 锁定任务
     * @param id
     */
    lockTask(id){
      ipc.sendTo(mainWindowId,'lockTask',{id:id})
    },
    /**
     * 锁定单个标签
     * @param id
     * @param taskId 标签组id
     */
    toggleLockTab(id,taskId){
      ipc.sendTo(mainWindowId,'toggleLockTab',{id:id,taskId:taskId})
    },
    showHoverLock(tab){
      document.getElementById('hoverLock'+tab.id).hidden=false
    },
    hideHoverLock(tab){
      if(!(tab.lock===true)){
        document.getElementById('hoverLock'+tab.id).hidden=true
      }
    },
    clearTaskUnlock(task) {
      ipc.sendTo(mainWindowId, 'clearTaskUnlock', { id: task.id })
    },
    createMenu(appId,app){
      let desks=[]
      try{
        desks=JSON.parse(localStorage.getItem('desks'))
      }
      catch (e){
        console.log('解析桌面失败')
      }
      ipc.send('createAppMenu',{id:appId,app:app,desks:desks})
      // let remote=require('electron').remote
      // let {Menu,MenuItem}=remote
      // let menu=Menu.buildFromTemplate([
      //   {
      //     label:"设置",
      //     click(){
      //       alert('a')
      //     }
      //   }
      // ])
      // menu.popup()
    },

    editTaskName(item){
      const id=item.id
      const inputEl=document.getElementById('taskTitleInput'+id)
      document.getElementById('editTip'+id).hidden=true
      if(inputEl.hidden===true){
        document.getElementById('taskTitle'+id).hidden=true
        inputEl.hidden=false
        inputEl.select()
      }

    },
    editTaskNameBlur(item){
      const id=item.id
      document.getElementById('taskTitle'+id).hidden=false
      document.getElementById('editTip'+id).hidden=false
      const inputEl=document.getElementById('taskTitleInput'+id)
      inputEl.hidden=true
      ipc.sendTo(mainWindowId,'renameTask',{id:item.id,newName:inputEl.value})
    },
    editTaskNameKeyPress(event){
        event.currentTarget.blur()
    },
    /**
     * 处理窗体失去焦点事件
     */
    blur(){
      //处理左侧栏，强制移除expanded样式
      if(appVue.mod==='auto' || appVue.mod==='close'){
        document.getElementById('appVue').classList.remove('expanded')
      }
      //处理全部的左侧浮窗，都加上display:none
      let popovers=document.getElementsByClassName('ant-popover')
      if(popovers){
        for(let i=0;i<popovers.length;i++){
          popovers[i].style.display='none'
        }
      }
    },
    dividerResizeStart(e){
      this.startY=e.clientY
      this.resizing=true
      document.getElementById('saApp-box').style.height=document.getElementById('pinGroup').clientHeight+'px'
      document.getElementById('pinGroup').style.position='absolute'
      this.startHeight=document.getElementById('saApp-box').offsetHeight
      document.onmousemove=this.dividerResizing
      document.onmouseup=this.dividerResizeEnd
      document.body.style.userSelect='none'
      localStorage.setItem('sidebarDividerMod','manual')
      appVue.$message.info({content:'应用栏的高度模式更改为手动调整。双击分隔条可切换回自动模式。',key:'dividerMod'})
    },
    dividerResizeEnd(){
      this.resizing=false
      localStorage.setItem('sidebarDividerY',document.getElementById('saApp-box').offsetHeight+'px')
    },
    dividerResizing(e){
      if(this.resizing){
        let movedY=e.clientY-this.startY
        if(movedY<0){
          document.getElementById('saApp-box').style.height=this.startHeight
        }
        if(movedY+this.startHeight>= document.getElementById('pinGroup').scrollHeight){
          document.getElementById('saApp-box').style.height=document.getElementById('pinGroup').offsetHeight+'px'
          return
        }else{
          document.getElementById('saApp-box').style.height=movedY+this.startHeight+'px'
        }

      }
    },
    fitSize(){
      document.getElementById('saApp-box').style.height='auto'
      document.getElementById('pinGroup').style.position='relative'
      document.getElementById('pinGroup').style.height='auto'
      localStorage.setItem('sidebarDividerMod','auto')
      appVue.$message.info({content:'应用栏的高度模式更改为自动模式。拖动分隔条可更改为手动模式。',key:'dividerMod'})

    }
	}

})

ipc.on('message',function(event,args){
  if(!!!args.type){
    args.type='open'
  }
  appVue.$message[args.type](args.config)
})

ipc.on('executedAppSuccess',async function (event,args){
  appVue.$refs.sidePanel.apps.forEach(app=>{
    if(app.id===args.app.id){
      app.processing=true
      app.windowId=args.app.windowId
    }
  })
  appVue.$refs.sidePanel.runningApps.push(args.app.id)
  standAloneAppModel.update(args.app.id,{lastExecuteTime:Date.now()}).then((res)=>{
  })

  //mark插入对appsExecutedCounts的数据统计
  setTimeout(async () => {
    await userStatsModel.incrementValue('appsExecutedCounts')
  }, 2000)
})
ipc.on('closeApp',function (event,args){
  appVue.$refs.sidePanel.apps.forEach(app=>{
    if(app.id===args.id){
      app.processing=false
      //从正在运行的app里移除掉该id
      let appIndex=appVue.$refs.sidePanel.runningApps.indexOf(args.id)
      if(appIndex>-1)
        appVue.$refs.sidePanel.runningApps.splice(appIndex,1)
    }
  })
})

ipc.on('updateAppCapture',function (event,args){
  appVue.$refs.sidePanel.apps.forEach(app=>{
    if(app.id===args.id){
      app.capture=args.captureSrc +"?t="+Date.now()
    }
  })
})
ipc.on('updateRunningApps',function(event,args){
  appVue.$refs.sidePanel.runningApps=args.runningApps
  appVue.$refs.sidePanel.apps.forEach((app,index)=>{
    if(args.runningApps.indexOf(app.id)>-1){
      app.processing=true
      app.windowId=args.windows[args.runningApps.indexOf(app.id)]
      ipc.send('getAppRunningInfo',{id:app.id})
    }
  })
})

ipc.on('updateSetting',function (event,args){
  appVue.$refs.sidePanel.apps.forEach((app,index)=>{
    if(app.id===args.id){
      standAloneAppModel.setAppSetting(args.id,args.settings)
      app.settings=Object.assign(app.settings,args.settings)
    }
  })
})
ipc.on('updateAppMemoryUsage',function (event,args){
})

ipc.on('updateRunningInfo',function (event,args){
  appVue.$refs.sidePanel.apps.forEach(app=>{
    if(app.id===args.id){
      app.capture=args.info.capture +"?t="+Date.now()
      app.memoryUsage=args.info.memoryUsage
    }
  })
})

ipc.on('deleteApp',function(event,args){
  let index=0
  for(let i=0;i<appVue.$refs.sidePanel.apps.length;i++){
    if(appVue.$refs.sidePanel.apps[i].id===args.id){
      index=i
    }
  }
  if(index)
  {
    appVue.$refs.sidePanel.apps.splice(index,1)
  }
})

ipc.on('installApp',function (event,args){
  let id=args.id
  standAloneAppModel.get(id).then(async app=>{
    if(!args.background)
    {ipc.send('executeApp',{app:app})}
    appVue.$refs.sidePanel.apps=await standAloneAppModel.getAllApps()
    ipc.send('getRunningApps')
  })
})

ipc.on('runAutoRunApps',function(event,args){
  appVue.$refs.sidePanel.apps.forEach(app=>{
    if(app.settings.autoRun){
      ipc.send('executeApp',{app:app,background:true})
    }
  })
  if(!localStorage.getItem('suggest')){
    ipc.send('wizard',{page:'apps'})
  }
})

ipc.on('appBadge',function (event,args){
  appVue.$refs.sidePanel.apps.forEach(app=>{
    if(app.id===args.id){
      if(args.add){
        if(!!!app.badge) app.badge=0
        app.badge+=args.add //默认是使用add来增加，否则直接使用badge
      }else{
        app.badge=args.badge
      }
    }

  })
})

ipc.on('countWebviewInk', async () => {
  setTimeout(async () => {
    await userStatsModel.incrementValue('webviewsInk')
  }, 2000)
})

ipc.on('countScript', () => {
  try {
    let num = require('../util/model/userScriptModel').countScript(window.globalArgs['user-data-path'])
    setTimeout(async () => {
      await userStatsModel.setValue('scripts', num)
    }, 10000)
  } catch (err) {
    console.warn(err)
  }
})

ipc.on('defaultBrowser', (event, args) => {
  setTimeout(async () => {
    args ? await userStatsModel.setValue('defaultBrowser', 1) : await userStatsModel.setValue('defaultBrowser', 0)
  }, 2000)
})

ipc.on('addToDesk',(event,args)=>{
  const  deskModel=require('../util/model/deskModel.js')
  const element= deskModel.createElementPos(args.app)
  deskModel.addElementToDesk(element,args.deskId)
  ipc.send('message',{'type':'success',config:{'content':'添加到桌面成功'}})
})

//左侧栏失去焦点
ipc.on('blur',(event,args)=>{
  //todo 关闭左侧栏的展开
  appVue.$refs.sidePanel.blur()
})

ipc.on('appRedirect',async (event,args)=>{
  let app=await standAloneAppModel.getFromPackage(args.package)
  if(app){
    ipc.send('executeApp',{
      app,
      background:args.background?args.background==='true':true,
      option:{
        action:'redirect',
        url:args.url
      }
    })
  }
  console.log(args)
})
/**
 * 处理各种文件关联
 */
ipc.on('handleFileAssign',async (event,args)=>{
  let app=null
  if(args.target){
    //已经指定了运行的方式
  }else{
    let assignApps=await standAloneAppModel.getFileAssginApps(args.type)
    if(assignApps.length===0){
      ipc.send('message',{type:'error',config:{content:'不存在可执行的相关应用'}})
    }
  if(assignApps.length>1){
    //todo 选择一个app
  }else{
    ipc.send('executeApp',{
      app:assignApps[0],
      background:false,
      option:{
        action:'fileAssign',
        filePath:args.args.filePath
      }
    })
    console.log('sended',{
      app:assignApps[0],
      background:false,
      option:{
        action:'fileAssign',
        filePath:args.args.filePath
      }
    })
  }
  }
  console.log(args)
  console.log('assigneApps',assignApps)
})
