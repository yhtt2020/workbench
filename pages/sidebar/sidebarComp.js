const { db } = require('../../js/util/database')
const { api } = require('../../server-config')
const standAloneAppModel = require('../util/model/standAloneAppModel.js')

const sidebarTpl = /*html*/`
  <div id="sidebar" class="side-container" @contextmenu="openSidebarMenu">
    <div id="itemsEl" class="side-items">
      <ul class="app-task">
        <li @click="toggleUserPanel" class="" style="position: relative;">
          <template>
            <a-drawer class="user-panel" @mousemove="setSidePanel()" :width="300" :visible="userPanelVisible"
              @close="closeUserPanel" :mask="false" placement="left">
              <template slot="title">
                <span v-if="user.uid==0"> 登录帐号免费体验完整功能 </span>
              </template>
              <div v-if="user.uid===0">
                <a-button @click="openUserWindow" type="primary" block>登录帐号</a-button>
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
                          <a-avatar style="position: relative;cursor: pointer" @click="userClick" :size="50"
                            :src="user.avatar">
                          </a-avatar>
                          <div class="level">{{user.grade.grade}}</div>
                        </a-col>
                        <a-col :span="15">
                          <template>
                            <a-popover>
                              <template slot="content">
                                <div class="flex flex-direction justify-around align-start" style="width: 120px; height: 140px">
                                  <div class="text-grey" style="cursor: pointer;" @click="goProfile">
                                    <a-icon type="user" style="margin-right: 5px"></a-icon>
                                    个人资料
                                  </div>
                                  <div class="text-grey" style="cursor: pointer;" @click="goAccount">
                                    <a-icon type="safety" style="margin-right: 5px"></a-icon>
                                    账号安全
                                  </div>
                                  <div class="text-grey" style="cursor: pointer;" @click="openUserWindow">
                                    <a-icon type="swap" style="margin-right: 5px"></a-icon>
                                    切换账号
                                  </div>
                                  <div class="text-grey" style="cursor: pointer;" @click="logout">
                                    <a-icon type="poweroff" style="margin-right: 5px"></a-icon>
                                    注销账号
                                  </div>
                                </div>
                              </template>
                              <a-button size="small">
                                {{user.nickname}}<a-icon type="swap" /></a-icon>
                              </a-button>
                            </a-popover>
                          </template>
                          <template>
                            <a-popover placement="bottomLeft">
                              <template slot="content">
                                <div class="flex flex-direction justify-around align-start" style="width: 100%; height: 120px">
                                  <div class="text-black">等级: {{this.$store.getters.getTsGrade.lv}}级</div>
                                  <div class="text-black">累计在线时长{{this.$store.getters.getTsGrade.cumulativeHours}}小时</div>
                                  <div class="text-grey">
                                    <img src="./assets/sun.svg" alt="" style="width: 20px; height: 20px"> = 16级
                                  </div>
                                  <div class="text-grey">
                                    <img src="./assets/moon.svg" alt="" style="width: 20px; height: 20px"> = 4级
                                  </div>
                                  <div class="text-grey">
                                    <img src="./assets/star.svg" alt="" style="width: 20px; height: 20px"> = 1级
                                  </div>
                                </div>
                              </template>
                              <div class="ts-grade flex justify-start align-center" style="margin-top: 4px">
                                <div class="ts-grade-crown" v-for="item in this.$store.getters.getTsGrade.crown">
                                  <img :src="item.icon" alt="" style="width: 20px; height: 20px">
                                </div>
                                <div class="ts-grade-sun" v-for="item in this.$store.getters.getTsGrade.sun">
                                  <img :src="item.icon" alt="" style="width: 20px; height: 20px">
                                </div>
                                <div class="ts-grade-moon" v-for="item in this.$store.getters.getTsGrade.moon">
                                  <img :src="item.icon" alt="" style="width: 20px; height: 20px">
                                </div>
                                <div class="ts-grade-star" v-for="item in this.$store.getters.getTsGrade.star">
                                  <img :src="item.icon" alt="" style="width: 20px; height: 20px">
                                </div>
                              </div>
                            </a-popover>
                          </template>
                        </a-col>
                      </a-row>
                    </div>
                    <div style="margin-bottom: 10px" class="actions flex flex-direction justify-between align-center">
                      <div class="actions-top flex justify-start  align-center">
                        <img src="./assets/tizi.svg" alt="" style="width: 16px; height: 16px">
                        <div class="text-grey" style="margin-left: 6px">我的元社区</div>
                      </div>
                      <div class="actions-bottom flex justify-around align-center">
                        <div class="action-bottom-action flex flex-direction justify-around align-center">
                          <div style="font-weight: 700;">{{user.postCount}}</div>
                          <div class="text-grey">内容</div>
                        </div>
                        <div class="action-bottom-action flex flex-direction justify-around align-center">
                          <div style="font-weight: 700;">{{user.fans}}</div>
                          <div class="text-grey">粉丝</div>
                        </div>
                        <div class="action-bottom-action flex flex-direction justify-around align-center">
                          <div style="font-weight: 700;">{{user.follow}}</div>
                          <div class="text-grey">关注</div>
                        </div>
                      </div>
                    </div>
                    <div class="my-group" style="margin-top: 20px;">
                      <template>
                        <div class="mg-top flex justify-between align-center">
                          <div class="mg-top-lf text-black" style="font-weight: 400;">我加入的团队({{this.$store.getters.getAllCircle.length}})</div>
                          <a-button id="guideTeam" class="mg-top-right" style="border-radius: 50%;" type="primary" icon="plus" size="small" @click="createGroup" />
                        </div>

        <div style="margin-top: 10px">
          <template v-for="(tag, index) in tags">
            <a-tag :key="index" :color="tag.checked ? 'blue' : ''"  @click="handleChange(tag, index)"  style="margin-left:5px;font-size: 12px; border-radius: 10px">
              {{tag.label}}
            </a-tag>
          </template>
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
<!--                          <div class="mg-content-btn flex flex-direction"-->
<!--                            v-for="(item, index) in this.$store.getters.getAllCircle" :key="item.id">-->
<!--                            <div class="cb-top flex align-center justify-start">-->
<!--                              <img :src="item.logo" alt="">-->
<!--                              <div class="cb-top-word">{{item.name}}</div>-->
<!--                              <a-icon class="cb-top-tag" type="share-alt" @click="inviteLink(item.id)"></a-icon>-->
<!--                            </div>-->
<!--                            <div class="cb-bottom flex align-center justify-around">-->
<!--                              <a-button class="cb-bottom-zone" type="link" icon="team" @click="openCircle(item.id)">-->
<!--                                圈子-->
<!--                              </a-button>-->
<!--                              <div style="border-right: 1px solid #cacaca; height: 60%;"></div>-->
<!--                              <a-button class="cb-bottom-zone" type="link" icon="message" @click="openGroupChat(item.id)">-->
<!--                                群聊-->
<!--                              </a-button>-->
<!--                              <div style="border-right: 1px solid #cacaca; height: 60%;" v-show="item.lord"></div>-->
<!--                              <a-button class="cb-bottom-zone" type="link" icon="setting" v-show="item.lord"-->
<!--                                @click="openCircleSetting(item.id)">-->
<!--                                设置-->
<!--                              </a-button>-->
<!--                            </div>-->
<!--                          </div>-->

<!--        <div>-->
<!--          <template v-for="(tag, index) in tags">-->
<!--            <a-tag :key="index" :color="tag.checked ? 'blue' : ''"  @click="handleChange(tag, index)"  style="margin-left:5px;font-size: 12px; border-radius: 10px">-->
<!--              {{tag.label}}-->
<!--            </a-tag>-->
<!--          </template>-->
<!--        </div>-->

                            <div class="mg-content-btn flex flex-direction"
                          v-for="(item, index) in teamList" :key="item.id" >
                            <div class="cb-top flex align-center justify-start">
                              <img :src="item.logo" alt="">
                              <div class="cb-top-word">{{item.name}}</div>
                              <a-icon class="cb-top-tag" type="share-alt" @click="inviteLink(item.id)"></a-icon>
                            </div>
                            <div class="cb-bottom flex align-center justify-around">
                              <a-button class="cb-bottom-zone" type="link" icon="team" @click="openCircle(item.id)">
                                圈子
                              </a-button>
                              <div style="border-right: 1px solid #cacaca; height: 60%;"></div>
                              <a-button class="cb-bottom-zone" type="link" icon="message" @click="openGroupChat(item.id)">
                                群聊
                              </a-button>
                              <div style="border-right: 1px solid #cacaca; height: 60%;" v-show="item.lord"></div>
                              <a-button class="cb-bottom-zone" type="link" icon="setting" v-show="item.lord"
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
                </template>
              </div>
            </a-drawer>
          </template>
            <div @contextmenu="openUserWindow" class="wrapper" block>
              <div class="item-icon">
                <a-avatar v-if="user.uid!==0"
                  style="background-color: white;width: 28px;height: 28px" class="icon"
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
        </li>
        <li id="guideApplySecond">
          <app-manager ref="appManager" :apps="apps" :running-apps="runningApps"></app-manager>
        </li>
      </ul>
      <div id="saApp-box"  class="app-box" style="height: 200px;overflow-x: hidden;overflow-y: hidden;flex:none">
        <ul id="pinGroup" @scroll="onScroll($event,'divider-inner')" class="app-task app-items" style="margin-bottom: 0; ">

          <li v-for="app in apps" @click="executeApp(app)" @mouseenter="hoverApp($event,app)"
            @contextmenu.stop="createMenu(app.id,app)" v-if="app.processing || app.settings.showInSideBar">
            <a-popover placement="right"  :mouse-enter-delay="0.3" overlay-class-name="tips" @visible-change="">
              <template  slot="title">
                <span class="app-name-popover"> {{app.name}} </span>
              </template>
              <template slot="content" v-if="app.processing">
                <div class="app-capture">
                  <img :src="'file://'+app.capture" onerror="this.src='../../icons/svg/empty.svg'">
                </div>
              </template>
              <template slot="content" v-else>
              <div style="max-width: 400px">{{app.summary}}</div>
              </template>
              <div class="wrapper sa-app-wrapper">
                <div v-if="app.processing" class="processing"></div>
                <div class="item-icon">
                  <a-badge :count="app.badge">
                    <!--                :style="{position: 'absolute',right:  '-2px',visibility:'visible'}"-->

                    <img onerror="this.src='../../icons/default.svg'" class="icon sa-app"
                      :style="app.processing? {'border-color':app.userThemeColor!==''?app.userThemeColor:app.themeColor}:{}"
                      :src="app.logo" :class="{running:app.processing?true:false}" />

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
        <div @dblclick.prevent="fitSize" @mousedown="dividerResizeStart" style="cursor: n-resize;padding: 10px 0;position: relative;margin-top: -10px">
          <div id="divider-inner" class="has-more" style="width: 100%;
    height: 1px;
    background: rgba(199,199,199,0.65);"></div>
        </div>
      </a-tooltip>
<!-- <a-popover placement="right" :mouse-enter-delay="0.3" overlay-class-name="tips" @visible-change="()=>{appVue.$store.dispatch('getLocalSpaces')}" >-->
<!--  <template slot="title">-->
<!--             更换标签组空间-->
<!--            </template>-->
<!--            <template slot="content">-->
<!--             <p style="width: 200px;font-size: 12px">-->
<!--              <span v-if="currentSpace.space">当前为云端空间。<br>每30秒自动备份，此时图标会转动。</span>-->
<!--                <span v-else-if="currentSpace.space.type==='cloud'">当前为离线模式。系统会自动尝试同步连接，直至连接成功。</span>-->
<!--                <span v-else>当前为本地空间，不与云端同步，建议导入到云端空间以防止标签组丢失。</span>-->
<!--</p>-->

<!--        <ul class="space-selector">-->
<!--             <li v-if="cloudSpaces.length===0"  disabled="" key="current">-->
<!--            请<a @click="login()">登录</a>后使用云空间-->
<!--          </li>-->
<!--         <li title="云端空间" :class="{'active':currentSpace.space.nanoid===space.nanoid}" v-else  @click="confirmChangeSpace(space,'cloud')" v-for="space in cloudSpaces" :key="space.nanoid" :disable="space['client_id']!=='' && currentSpace.space.nanoid!==space.nanoid">-->
<!--            <a-icon type="sync" v-if="currentSpace.space.nanoid===space.nanoid" style="color: #00bb00" spin></a-icon>-->
<!--            <a-icon style="color: #00bb00" v-else type="sync"></a-icon>-->
<!--            {{space.name}}-->
<!--            <span v-if="space.isOtherUsing">-->
<!--              <span v-if="space.disconnect">-->
<!--                   <a-badge count="离线"  :number-style="{ backgroundColor: 'red' }"title="其他设备离线使用"> </a-badge>-->
<!--</span><span v-else>-->
<!--     <a-badge count="其他"  :number-style="{ backgroundColor: 'red' }"title="其他设备使用中"> </a-badge>-->
<!--</span>-->
<!--</span>-->
<!--              <span  v-if="space.isSelfUsing">-->
<!--              <span v-if="space.disconnect">-->
<!--        <a-badge count="离线"  :number-style="{ backgroundColor: '#ccc' }"title="当前设备离线"> </a-badge>-->
<!--</span><span v-else>-->
<!--<a-badge count="当前" :number-style="{ backgroundColor: '#52c41a' }" title="当前设备使用中"> </a-badge>-->
<!--</span>-->
<!--</span>-->
<!--          </li>-->
<!--          <li class="divider"></li>-->
<!--          <li :class="{'active':currentSpace.space.id===space.id}" title="本地空间" @click="confirmChangeSpace(space,'local')"  v-for="space in localSpaces" :key="'local_'+space.id">-->

<!--           <a-icon type="sync" v-if="currentSpace.space.id===space.id"  spin></a-icon>-->
<!--            <a-icon  v-else type="sync"></a-icon> {{space.name}}-->

<!--            </li>-->
<!--&lt;!&ndash;            <a-menu-item key="add" @click="openUserWindow">&ndash;&gt;-->
<!--&lt;!&ndash;            <a-icon type="plus" ></a-icon> 创建新空间&ndash;&gt;-->
<!--&lt;!&ndash;          </a-menu-item>&ndash;&gt;-->
<!--          <li class="divider"></li>-->
<!--          <li  key="other" @click="openUserWindow">-->
<!--            <a-icon type="swap" ></a-icon> 选择其他空间-->
<!--          </li>-->
<!--        </ul>-->
<!--        </template>-->
<!--<div  style="width: 100%;overflow: hidden;height:30px;">-->

<!--       <div style="width:145px;">-->
<!--       <div style="display: inline-block;width:45px;text-align: center">-->
<!--       <svg id="savingIcon" :class="{'online':currentSpace.space.nanoid,'offline':!currentSpace.space.nanoid}" style="width: 24px" t="1648106444295"  viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="32437" width="32" height="32"><path d="M512 938.666667C276.352 938.666667 85.333333 747.648 85.333333 512S276.352 85.333333 512 85.333333s426.666667 191.018667 426.666667 426.666667-191.018667 426.666667-426.666667 426.666667z m205.653333-210.090667A298.666667 298.666667 0 0 0 385.365333 241.408l41.6 74.88A213.333333 213.333333 0 0 1 725.333333 512h-91.733333a21.333333 21.333333 0 0 0-18.645333 31.701333l102.698666 184.874667z m-120.618666-20.864A213.333333 213.333333 0 0 1 298.666667 512h91.733333a21.333333 21.333333 0 0 0 18.645333-31.701333L306.346667 295.424a298.666667 298.666667 0 0 0 332.288 487.168l-41.6-74.88z" fill="#14D081" p-id="32438"></path></svg>-->

<!--&lt;!&ndash;       <a-icon type="loading" ></a-icon>&ndash;&gt;-->
<!--       </div>-->
<!--       <div style="display: inline-block;width:96px;text-align: left">-->

<!--      <div class="space-name" type="primary">-->
<!--        {{currentSpace.space.name}}-->
<!--        <a-icon type="right" />-->
<!--      </div>-->
<!--   </div>-->
<!--   </div>-->

<!--   </div>-->
<!--</a-popover>-->
<tippy ref="tippy"
    @show="showPopSpace"
    boundary="window"
    interactive
    :animate-fill="false"
    placement="right"
    distant="7"
    theme="light"
    :sticky="true"
    animation="fade"
    :hideOnClick="false"
    trigger="mouseenter"
    :delay="[200,200]"
    :interactive-border="5"
    :lazy="false"
    :interactive-debounce="1"
    arrow>
    <!--mouseenter-->
<template v-slot:trigger>
<div @click="openUserWindow" title="点击选择其他空间" class="guideSpace"  style="width: 100%;overflow: hidden;height:30px;text-align: left ">

       <div style="width:145px;">
       <div style="display: inline-block;width:45px;text-align: center">
       <img  src="./assets/sync.svg" id="savingIcon" :class="{'online':currentSpace.spaceType==='cloud','offline':currentSpace.spaceType==='local'}" style="width: 24px;margin-top: -25px"  width="32" height="32"/>

<!--       <a-icon type="loading" ></a-icon>-->
       </div>
       <div style="display: inline-block;width:96px;text-align: left">

      <div class="space-name" type="primary">
        {{currentSpace.name}}
        <a-icon type="right" />
      </div>
   </div>
   </div>
   </div>
</template>
<div v-if="spaceStatus==='local'" style="padding: 15px;width: 300px">
<a-row>
<a-col :span="8" style="text-align: right">
<img src="./assets/local.svg" style="width: 68px;margin-right: 10px">
</a-col>
<a-col :span="16" style="padding-top: 10px">
<div style="color: #333;font-size: 16px;margin-bottom: 5px">本地空间使用中</div>
<div style="color: #999;font-size: 13px">无法跨设备使用</div>
</a-col>
</a-row>
<div style="margin-top: 10px">
   当前空间： <a-tag @click="openUserWindow" color="#108ee9">
    <strong>{{currentSpace.name}}</strong>
    </a-tag>
</div>
<div  style="line-height:24px;margin-top:15px;background-color:rgba(24,144,255,0.15);padding: 10px;border-radius: 5px;font-size: 13px">
推荐您使用<strong style="'color:#1890FF">云空间</strong>。<br>
您可以<strong>登录</strong>后使用云端空间。
在<strong>不同设备</strong>上使用您的标签组。
</div>
<div style="margin-top: 15px">
<a-row>
<a-col :span="11">
<a-button @click="learnSpace" block>了解云空间</a-button>
</a-col>
<a-col :span="2"></a-col>
<a-col :span="11">
<a-button  @click="openUserWindow" type="primary" block>选择空间</a-button>
</a-col>
</a-row>
</div>
</div>
<div v-else-if="spaceStatus==='online'" style="padding: 15px;width: 300px">
<a-row>
<a-col :span="8" style="text-align: right">
<img src="./assets/online.svg" style="width: 68px;margin-right: 10px">
</a-col>
<a-col :span="16" style="padding-top: 10px">
<div style="color: #333;font-size: 16px;margin-bottom: 5px">云空间使用中</div>
<div style="color: #03B615;font-size: 13px">正在与云端保持同步</div>
<div style="font-size: 12px;color:#999" title="最后一次成功同步时间">{{getSyncTimeStr()}}</div>
</a-col>
</a-row>
<div style="margin-top: 15px">
当前空间：<a-tag color="#108ee9" @click="openUserWindow"><strong>{{currentSpace.name}}</strong></a-tag><br>
点击更换其他空间。
</div>
<div  style="line-height:24px;margin-top:15px;background-color:rgba(24,144,255,0.15);padding: 10px;border-radius: 5px;font-size: 13px">
每30秒空间会自动与云端进行同步。
如果成功同步，图标 <img style="width: 25px" src="./assets/sync.svg"> 会转动一次。
</div>
<div style="margin-top: 15px">
<a-row>
<a-col :span="11">
<a-button @click="learnSpace" block>了解云空间</a-button>
</a-col>
<a-col :span="2"></a-col>
<a-col :span="11">
<a-button  @click="openUserWindow" type="primary" block>更换空间</a-button>
</a-col>
</a-row>
</div>
</div>
<div v-else style="padding: 15px;width: 300px">
<a-row>
<a-col :span="8" style="text-align: right">
<img src="./assets/offline.svg" style="width: 68px;margin-right: 10px">
</a-col>
<a-col :span="16" style="padding-top: 10px">
<div style="color: #333;font-size: 16px;margin-bottom: 5px">云空间离线使用中</div>
<div style="color: #999;font-size: 13px">暂时无法与服务器连接</div>
<div style="font-size: 12px;color:#999" title="最后一次成功同步时间">{{getSyncTimeStr()}}</div>
</a-col>
</a-row>
<div style="margin-top: 15px">
当前空间：<a-tag @click="openUserWindow" color="#108ee9"><strong>{{currentSpace.name}}</strong></a-tag><br>
正在离线使用云空间。
</div>
<div  style="line-height:24px;margin-top:15px;background-color:rgba(24,144,255,0.15);padding: 10px;border-radius: 5px;font-size: 13px">
系统将自动在后台尝试重连。
连接成功后，同步图标<img style="width: 25px" src="./assets/sync.svg">将恢复绿色。
</div>
<div style="margin-top: 15px">
<a-row>
<a-col :span="11">
<a-button @click="learnSpace" block>了解云空间</a-button>
</a-col>
<a-col :span="2"></a-col>
<a-col :span="11">
<a-button  @click="openUserWindow" type="primary" block>更换空间</a-button>
</a-col>
</a-row>
</div>
</div>
</tippy>
      <div class="app-box">
        <ul id="appGroup" style="user-select: none;padding-bottom: 20px" class="app-task app-items"
          @dblclick.prevent="addNewTask">
          <draggable v-model="getItems" group="sideBtn" animation="300" dragClass="dragClass" ghostClass="ghostClass"
            chosenClass="chosenClass" @start="onStart" @end="onEnd">
            <transition-group>
              <li @click="openItem(item.id,i)" @dblclick.stop="" v-for="(item,i) in this.$store.getters.getItems"
                :key="item.id" :visible="item.count>1" data-role="task" :class="isActive(item.id)" :item-id="item.id"
                style="position: relative">
                <tippy :ref="'task_'+item.id"
    boundary="window"
    interactive
    :animate-fill="false"
    placement="right"
    theme="light"
    :sticky="true"
    animation="fade"
    trigger="click mouseenter"
    :delay="[200,200]"
    :lazy="false"
    :hideOnClick="false"
    :interactive-border="2"
    arrow>
    <!--mouseenter-->
<template v-slot:trigger>
         <div class="wrapper">
                    <div id="guideTasks"  class="item-icon">
                      <img class="icon" :src="item.icon" onerror="this.src='../../icons/default.svg'" />
                      <a-badge :count="item.count" :dot="true" status="processing"
                        :style="{position: 'absolute',right:  '-2px',top:'-13px',visibility:item.count>5?'visible':'hidden'}">
                      </a-badge>
                    </div>
                    <div class="item-title">{{ item.title }}</div>
                  </div>

</template>
 <div>
                    <span @click.stop="editTaskName(item)" class="task-title">      <a-icon :id="'editTip'+item.id" class="edit-tip" type="edit"></a-icon> <span class="text"
                        :id="'taskTitle'+item.id">{{ item.count > 5 ? item.title + ' -- 高负载（5+）' : item.title }}
                      </span>

                      <a-input @blur="editTaskNameBlur(item)" hidden :id="'taskTitleInput'+item.id" size="small"
                        @keypress.enter="editTaskNameKeyPress($event)" :default-value="item.title"></a-input>
                    </span>
                    <span style="float: right;cursor: pointer" @click="closeItem(item)">
                      <a-icon class="close-task-btn" title="删除标签组" type="close-circle"></a-icon>
                    </span>
                  </div>
  <div style="text-align: right">
                        <span class="action" size="small" title="分享整组标签" @click="shareTask(item)">

                        <a-icon type="share-alt"></a-icon><span class="tip">分享</span>
                      </span>
                      <span class="action" size="small" title="锁定当前标签组内全部标签" @click="lockTask(item.id)">
                        <a-icon type="lock"></a-icon><span class="tip">锁定</span>
                      </span>
                      <span class="action" size="small" title="清理组内全部未锁定标签" @click="clearTaskUnlock(item)">
                        <a-icon type="delete"></a-icon><span class="tip">清理</span>
                      </span>
                    </div>
                    <ul class="tabs" style=" margin-top: 5px;min-height:180px">
                      <li :class="{'active':(tab.selected )}" style="position:relative;"
                        @mouseenter="showHoverLock(tab)" @mouseleave="hideHoverLock(tab)" v-for="(tab,j) in item.tabs"
                        :key="tab.id">
                        <div class="tab-title" @click="openPopoverTab(item.id, tab.id)">
                        <span @click.stop="closeTab(tab.id,item.id)" style="float: left;cursor: pointer"  title="关闭该标签" :id="'close'+tab.id" hidden  class="closeTab">
                           <img src="assets/close-box.svg"  style="margin-left: 5px;width: 25px;height: 20px;margin-right: 3px">
                        </span>
                          <img class="tab-icon" :id="'tabIcon'+tab.id"  :src="tab.icon" style="margin-left: 8px;"
                            onerror="this.src='../../icons/default.svg'" />&nbsp;{{ tab.title }}
                        </div>
                        <span @click="toggleLockTab(tab.id,item.id)" :id="'hoverLock'+tab.id" :hidden="tab.lock!==true"
                          title="锁定当前标签；锁定后，标签将无法随意关闭" class="unlock-tab">
                          <a-icon type="lock"></a-icon>
                        </span>
                      </li>
                    </ul>
</tippy>
<!--                <a-popover placement="right" :mouse-enter-delay="0.1" :mouse-leave-delay="0.2"-->
<!--                  :overlay-style="{'width':'305px','height':item.tabs.length*30+50+'px'}" overlay-class-name="tips">-->
<!--                  <div slot="title">-->
<!--                    <span @click.stop="editTaskName(item)" class="task-title"><span class="text"-->
<!--                        :id="'taskTitle'+item.id">{{ item.count > 5 ? item.title + ' &#45;&#45; 高负载（5+）' : item.title }}-->
<!--                      </span>-->
<!--                      <a-icon :id="'editTip'+item.id" class="edit-tip" type="edit"></a-icon>-->
<!--                      <a-input @blur="editTaskNameBlur(item)" hidden :id="'taskTitleInput'+item.id" size="small"-->
<!--                        @keypress.enter="editTaskNameKeyPress($event)" :default-value="item.title"></a-input>-->
<!--                    </span>-->
<!--                    <span style="float: right;cursor: pointer" @click="closeItem(item)">-->
<!--                      <a-icon title="删除标签组" type="close-circle"></a-icon>-->
<!--                    </span>-->
<!--                  </div>-->
<!--                  <template slot="content">-->
<!--                    <div style="text-align: right">-->
<!--                      <span class="action" size="small" title="锁定当前标签组内全部标签" @click="lockTask(item.id)">-->
<!--                        <a-icon type="lock"></a-icon>锁定-->
<!--                      </span>-->
<!--                      <span class="action" size="small" title="清理组内全部未锁定标签" @click="clearTaskUnlock(item)">-->
<!--                        <a-icon type="delete"></a-icon>清理-->
<!--                      </span>-->
<!--                    </div>-->
<!--                    <ul class="tabs" style="margin-top: 5px">-->
<!--                      <li :class="{'active':(tab.selected )}" style="position:relative;"-->
<!--                        @mouseenter="showHoverLock(tab)" @mouseleave="hideHoverLock(tab)" v-for="(tab,j) in item.tabs"-->
<!--                        :key="tab.id">-->
<!--                        <div class="tab-title" @click="openPopoverTab(item.id, tab.id)">-->
<!--                        <span @click.stop="closeTab(tab.id,item.id)" style="float: left;cursor: pointer"  title="关闭该标签" :id="'close'+tab.id" hidden  class="closeTab">-->
<!--                           <img src="assets/close-box.svg"  style="margin-left: 9px;width: 22px;height: 22px">-->
<!--                         </span>-->
<!--                          <img class="tab-icon" :id="'tabIcon'+tab.id"  :src="tab.icon" style="margin-left: 8px"-->
<!--                            onerror="this.src='../../icons/default.svg'" />&nbsp;{{ tab.title }}-->
<!--                        </div>-->
<!--                        <span @click="toggleLockTab(tab.id,item.id)" :id="'hoverLock'+tab.id" :hidden="tab.lock!==true"-->
<!--                          title="锁定当前标签；锁定后，标签将无法随意关闭" class="unlock-tab">-->
<!--                          <a-icon type="lock"></a-icon>-->
<!--                        </span>-->
<!--                      </li>-->
<!--                    </ul>-->
<!--                  </template>-->
<!--                  <div class="wrapper">-->
<!--                    <div class="item-icon">-->
<!--                      <img class="icon" :src="item.icon" onerror="this.src='../../icons/default.svg'" />-->
<!--                      <a-badge :count="item.count" :dot="true" status="processing"-->
<!--                        :style="{position: 'absolute',right:  '-2px',top:'-13px',visibility:item.count>5?'visible':'hidden'}">-->
<!--                      </a-badge>-->
<!--                    </div>-->
<!--                    <div class="item-title">{{ item.title }}</div>-->
<!--                  </div>-->
<!--                </a-popover>-->
              </li>
            </transition-group>
          </draggable>
        </ul>
      </div>
    </div>

    <div id="bottomsEl" class="bottom-container">
<!--     <div id="appGroupBottom" style="position: relative;bottom:">-->
<!--    <div id="appGroupInner"></div>-->
<!--</div>-->
      <ul class="bottomBar">
        <template>
          <div>
            <a-collapse default-active-key="0" :active-key="sidebarBottom" :bordered="false" @change="changeBottomSize">
              <a-collapse-panel key="1">
               <li  @click="openHelpCenter">
                  <a-button type="default" shape="circle" icon="question-circle"></a-button>
                  <div class="item-title">帮助中心</div>
                </li>
              </a-collapse-panel>
            </a-collapse>
          </div>
        </template>
        <li id="guideSearch" @click="visibleGlobalSearch">
          <a-button  type="default" shape="circle" icon="search" tabindex=-1></a-button>
          <div class="item-title">全局搜索</div>
        </li>
        <li @click="visibleMessageCenter">
          <a-badge :dot="this.$store.getters.getAllMessages.length > 0 ? true : false">
            <a-button type="default" shape="circle" icon="bell" tabindex=-1></a-button>
          </a-badge>
          <div class="item-title">消息中心</div >
        </li>
        <li @click="openBottom('setting')">
          <a-button type="default" shape="circle" icon="setting" tabindex=-1></a-button>
          <div class="item-title">偏好设置</div>
        </li>
      </ul>
    </div>
    <message-center ref="messageRef" :visible="messageShow" :mod="mod" @closeMessage="() => this.messageShow = !this.messageShow" @updateVisible="(val) => this.messageShow = val">
    </message-center>
  </div>
`

const backupSpaceModel=require('../../src/model/backupSpaceModel')
const _=require('lodash')


Vue.component('sidebar', {
  data: function () {
    return {

      lastSync:Date.now(),//最后一次同步时间
      spaceStatus:'local',
      localSpaces: [],
      currentSpace: {
        space: {
          name: ''
        }
      },//'当前空间'
      messageShow: false,
      resize: false,
      startY: 0,
      apps: [],
      runningApps: [],//运行中的应用
      mod: 'auto',//auto open close
      isPopoverShowing: false,
      lastOpenId: this.$store.state.selected,
      drag: false,
      remote: {},
      loginPanelTitle: '登录帐号免费体验完整功能',
      loginPanelContent: ``,
      userPanelVisible: false,
      teamList:[],
      tags: [
        {
          label: '公开',
          checked: true,
          name:'public'
        },
        {
          label: '私密',
          checked: false,
          name:'private'
        },
        {
          label: '审核中',
          checked: false,
          name:'auditing'
        },
      ],
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
      accounts: [
        {
          'uid': 1,
          'nickname': '张三',
          'avatar': '../../icons/apps.svg'
        },
        {
          'uid': 2,
          'nickname': '李四',
          'avatar': '../../icons/browser.ico'
        }
      ],
      sidebarBottom: 0,
      cloudSpaces: []
    }

  },
  beforeCreate () {
    this.form = this.$form.createForm(this, {
      name: 'validate_other'
    })
  },

  async mounted () {
    this.watchAllHasMore()
    //获取当前左侧栏的状态，并设置
   spaceModel.getCurrent().then((space)=>{
        this.currentSpace =space
     if(space.spaceType==='local')
     {
       this.spaceStatus='local'
     }else{
       this.spaceStatus='online'
       let backupSpace= backupSpaceModel.getSpace(space.spaceId)
       this.lastSync=backupSpace.sync_time
     }
   })
    this.mod = appVue.mod
    await standAloneAppModel.initialize().then(()=>{
      standAloneAppModel.getAllApps().then(apps=>{
        this.apps =apps
        ipc.send('getRunningApps')
      })
    })

    if (localStorage.getItem('sidebarDividerMod') === 'auto' || !!!localStorage.getItem('sidebarDividerMod')) {
      document.getElementById('pinGroup').style.position = 'relative'
      document.getElementById('pinGroup').style.height = 'auto'
      document.getElementById('saApp-box').style.height = 'auto'
    } else {
      document.getElementById('pinGroup').style.position = 'absolute'
      document.getElementById('saApp-box').style.height = localStorage.getItem('sidebarDividerY') || '200px'
    }

    //mark插入对password的数据统计
    try {
      let passwordList = await ipc.invoke('credentialStoreGetCredentials')
      await userStatsModel.setValue('password', passwordList.length)
    } catch (err) {
      await userStatsModel.setValue('password', 0)
    }
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
      this.$store.commit('initItems')
    } else {
      this.$store.state.pinItems = window.sidebarData.state.sidebar.pinItems
      this.$store.state.items = window.sidebarData.state.sidebar.items
    }
    let that = this
    db.system.where({ name: 'sidebarBottom' }).first((data) => {
      that.sidebarBottom = data.value
      setTimeout(that.fixElementPosition, 250)
    })
    const currentUser = await db.system.where('name').equals('currentUser').first()
    if (currentUser.value.uid !== 0) {
      try {
        //侧边栏重载的时候也同步一下本地文件的用户标识
        ipc.send('syncCurrentUser', currentUser.value)

        this.$store.dispatch('getJoinedCircle', { page: 1, row: 500 })
        this.$store.dispatch('getMyCircle', { page: 1, row: 500 })
      } catch (err) {
        console.log(err)
        console.log('短说圈子接口获取失败')
      }
    }

    this.$store.dispatch('getAllMessage')

    //1分钟同步一次消息的时间处理，这里没有网络资源的开销
    setInterval(() => {
      this.$nextTick(() => {
        this.$store.commit('SET_ALLMESSAGES', this.$store.getters.getAllMessages)
      })
    }, 60 * 1000)

    try {
      if (currentUser.value.uid) {
        //如果用户已登录，则获取云端的空间
        this.$store.dispatch('getCloudSpaces', currentUser.value).then(()=>{
          this.cloudSpaces = this.$store.state.cloudSpaces
        })
      }
      this.$store.dispatch('getLocalSpaces').then(()=>{
        this.localSpaces = this.$store.state.localSpaces
      })
    } catch (e) {
      console.log('空间获取失败。')
    }
  },
  computed: {
    user () {
      return this.$store.state.user
    },
    getItems: {
      get () {
        //将task与items同步一次
        return this.$store.getters.getItems
      },
      set (newValue) {
        this.$store.commit('saveItems', newValue)
      }
    },
    getPinItems: {
      get () {
        //将task与items同步一次
        return this.$store.getters.getPinItems
      },
      // setter
      set (newValue) {
        this.$store.commit('savePinItems', newValue)
      }

    },
    isActive () {
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
    /**
     * 监听全部的隐藏，目前只支持应用底部阴影
     */
    watchAllHasMore(){
      this.watchHasMore(document.getElementById('pinGroup'),document.getElementById('divider-inner'))
    },
    guide(a){
      const stepsList=[
        {
          text: `<div>每一个打开网页都属于一个标签组，试试<b>双击</b>侧边栏空白处创建一个新的组</div>`, attachTo: {element: '#guideTasks', on: 'right'},
          buttons: [
            {action: function () {
                window.location.href='tsb://app/redirect/?package=com.thisky.helper&url=https://www.yuque.com/tswork/browser/yglkui'
              }, secondary: true, text: '了解更多'},
            {action: function () {
                this.cancel();
                ipc.send('exitGuide')
                ipc.send('tasksState')
              }, text: '好的'}],
          id: 'welcome'    // 用于Shepherd step的唯一标识符
        },
        {
          text: `<div>点击这里，或着按下<b>Alt + F</b>键打开全局搜索</div>`, attachTo: {element: '#guideSearch', on: 'right'},
          buttons: [
            {action: function () {
                window.location.href='tsb://app/redirect/?package=com.thisky.helper&url=https://www.yuque.com/tswork/browser/zp48yn'
              }, secondary: true, text: '了解更多'},
            {action: function () {
                this.cancel()
                ipc.send('exitGuide')
                ipc.send('searchState')
              }, text: '好的'}],
          id: 'welcome'    // 用于Shepherd step的唯一标识符
        },
        {//占位
        },
        {
          text: `<div>在这里创建或选择您想要的空间</div>`, attachTo: {element: '.guideSpace', on: 'right'},
          buttons: [
            {action: function () {
                window.location.href='tsb://app/redirect/?package=com.thisky.helper&url=https://www.yuque.com/tswork/browser/gg7vro'
              }, secondary: true, text: '了解更多'},
            {action: function () {
              this.cancel()
                ipc.send('exitGuide')
                ipc.send('spaceState')
              }, text: '好的'}],
          id: 'welcome'    // 用于Shepherd step的唯一标识符
        },
        {//占位
        },
        {
          text: `<div>点击这里可以创建你的团队</div>`, attachTo: {element: '#guideTeam', on: 'right'},
          buttons: [
            {action: function () {
                window.location.href='tsb://app/redirect/?package=com.thisky.helper&url=https://www.yuque.com/tswork/browser/rls0pi'
              }, secondary: true, text: '了解更多'},
            {action: function () {
                appVue.$refs.sidePanel.userPanelVisible=false
                this.cancel()
                ipc.send('exitGuide')
                ipc.send('teamState')
              }, text: '好的'}],
          id: 'welcome'    // 用于Shepherd step的唯一标识符
        },
      ]
        const shepherd = new Shepherd.Tour({
          // 设置默认引导配置
          useModalOverlay: true,
          defaultStepOptions: {
            // 引导左上角取消按钮图标的配置
            cancelIcon: {
              enabled: false, // 默认为true
            },
            // 指定引导盒子的类名, 用于后续自定义样式, 类名可叠加
            classes: 'custom1',
            // 滚动方式
            scrollTo: {
              behavior: 'smooth',
              block: 'center'
            }
          },
          // 添加第一步引导
          steps: [stepsList[a]]
        });
        shepherd.start();
      },
    guideApplyFirst(){
      const applyShepherd = new Shepherd.Tour({
        // 设置默认引导配置
        useModalOverlay: true,
        defaultStepOptions: {
          // 引导左上角取消按钮图标的配置
          cancelIcon: {
            enabled: false, // 默认为true
          },
          // 指定引导盒子的类名, 用于后续自定义样式, 类名可叠加
          classes: 'custom2',
          // 滚动方式
          scrollTo: {
            behavior: 'smooth',
            block: 'center'
          }
        },
        // 添加第一步引导
        steps: [{
          text: '右键网页标签，选择安装到应用', attachTo: {element: '.wrapper', on: 'bottom'},
          buttons: [
            {action: function () { this.cancel(); appVue.$refs.sidePanel.guideApplySecond()}, text: '下一步'}],
          id: 'welcome'    // 用于Shepherd step的唯一标识符
        }]
      });
      applyShepherd.start();
    },
    guideApplySecond(){
      const applySecondShepherd = new Shepherd.Tour({
        // 设置默认引导配置
        useModalOverlay: true,
        defaultStepOptions: {
          // 引导左上角取消按钮图标的配置
          cancelIcon: {
            enabled: false, // 默认为true
          },
          // 指定引导盒子的类名, 用于后续自定义样式, 类名可叠加
          classes: 'custom3',
          // 滚动方式
          scrollTo: {
            behavior: 'smooth',
            block: 'center'
          }
        },
        // 添加第一步引导
        steps: [{
          text: '点击这里可以管理你安装的所有应用', attachTo: {element: '#guideApplySecond', on: 'right'},
          buttons: [
            {action: function () {
                window.location.href='tsb://app/redirect/?package=com.thisky.helper&url=https://www.yuque.com/tswork/browser/mmcfd7'
              }, text: '了解更多',classes:'button1'},
            {action: function () { this.cancel();appVue.$refs.sidePanel.guideApplyFirst()}, text: '上一步',classes:'button2'},
            {action: function () {return this.next();}, text: '下一步',classes:'button3'}],
          id: 'first'    // 用于Shepherd step的唯一标识符
        },{
          text: '安装的应用会显示在这里，左键打开或右键进行更多设置', attachTo: {element: '#saApp-box', on: 'right'},
          buttons: [
            {action: function () {return this.back();},text: '上一步',classes:'button2'},
            {action: function () {
                this.cancel()
                ipc.send('exitGuide')
                ipc.send('appState')
              }, text: '好 的'}],
          id: 'second'    // 用于Shepherd step的唯一标识符
        },]
      });
      applySecondShepherd.start();
    },
    guideDesktop(){
      const guideDesktop = new Shepherd.Tour({
        // 设置默认引导配置
        useModalOverlay: true,

        defaultStepOptions: {
          // 引导左上角取消按钮图标的配置
          cancelIcon: {
            enabled: false, // 默认为true
          },
          classes:'custom4',
          // 滚动方式
          scrollTo: {
            behavior: 'smooth',
            block: 'center'
          }
        },
        // 添加第一步引导
        steps: [{
          text: '在这里可以创建你的专属桌面，支持导出和导入桌面文件，方便与他人分享', attachTo: {element: '#appVue', on:'bottom'},
          buttons: [
            {action: function () {
                window.location.href='tsb://app/redirect/?package=com.thisky.helper&url=https://www.yuque.com/tswork/browser/sv8ozw'
              }, text: '了解更多',classes:'button2'},
            {action: function () {
              this.cancel();
                ipc.send('exitGuide')
                ipc.send('desktopState')
              }, text: '好 的',classes:'button3'}],
          id: 'first'    // 用于Shepherd step的唯一标识符
        }]
      });
      guideDesktop.start();
    },
    sortApps(){
      let sorted=_.orderBy(this.apps,(app)=>{
        return [app.processing?1:0,app.lastExecuteTime]
      },['desc','desc'])
      this.apps=sorted
    },
    getSyncTimeStr(){
      return new Date(this.lastSync).toLocaleString()
    },
    handleChange(tag, index) {
      this.tags.forEach(e => {
        e.checked = false
      })
      this.tags[index].checked = !tag.checked
        if (this.tags[index].name === 'public') {
          this.passList = this.$store.getters.getAllCircle.filter(v => v.status !==3 && v.status !==2 )
          this.teamList = this.passList.filter(v => v.property === 0 ||  v.property===1)
        }
        if (this.tags[index].name === 'private') {
          this.teamList = this.$store.getters.getAllCircle.filter(v => v.property === 2)
        }
        if (this.tags[index].name === 'auditing') {
          this.teamList = this.$store.getters.getAllCircle.filter(v => v.status === 2)
        }
    },
    openSidebarMenu(){
      ipc.send('openSidebarMenu')
    },
    inviteLink(id) {
      tsbk.default.ready(() => {
        tsbk.default.openOsxInviteMember({
          groupId: id
        })
      })
    },
    learnSpace(){
      window.location.href='tsb://app/redirect/?package=com.thisky.helper&url=https://www.yuque.com/tswork/browser/gg7vro'
    },
    async showPopSpace () {
    },
    login () {
      ipc.send('login')
    },
    confirmChangeSpace (space, type) {
      // antd.Modal.confirm({
      //   title: '确认',
      //   content: '是否更改当前空间，更改空间将重载浏览器，可能导致您网页上未保存的内容丢失，请确认已经保存全部内容。',
      //   centered: true,
      //   okText: '我已保存，切换空间',
      //   cancelText: '取消',
      //   onOk: () => {
      //     this.changeSpace(id,type)
      //     }
      // })
      if (type !== 'cloud') {
        this.$confirm({
          title: '切换到本地空间',
          content: '是否更改当前空间，更改空间将重载浏览器，可能导致您网页上未保存的内容丢失，请确认已经保存全部内容。切换本地空间并不会更改当前登录帐号。',
          centered: true,
          okText: '我已保存，切换空间',
          cancelText: '取消',
          onOk: async () => {
            spaceModel.setAdapter('local').changeCurrent(space)
          }
        })
      } else {
        if (space.isSelfUsing) {
          if (space.disconnect) {
            antd.Modal.confirm({
              title: '重新连接',
              content: '是否尝试重新连接此空间？',
              centered: true,
              okText: '重新连接',
              cancelText: '取消',
              onOk: async () => {
                this.doChangeSpaceCloud(space)
              }
            })
          } else {
            window.antd.message.info('不可切换到当前使用中的空间。')
          }
          return
        }
        if (space.isOtherUsing) {
          if (space.online) {
            this.$confirm({
              title: '此空间正忙',
              content: '此空间正在被其他设备使用，如若切换到此空间，可能造成其他设备未同步的标签组丢失。是否仍然要强行切换？这将导致该设备上的浏览器强制下线。',
              centered: true,
              okText: '我已明确，切换空间',
              cancelText: '取消',
              onOk: async () => {
                this.doChangeSpaceCloud(space)
              }
            })
          } else {
            this.$confirm({
              title: '此空间使用设备异常离线',
              content: appVue.$createElement('div', {},
                [
                  appVue.$createElement('p', {}, '此空间正在被其他设备使用，但是系统检测到此设备可能已经因为网络或者其他原因而离线。'),
                  appVue.$createElement('p', {}, '所以此设备上可能存在未保存的标签组。如果切换到此空间，可能造成未保存的内容丢失。'),
                  appVue.$createElement('p', {}, '建议到此设备商重新连接后正常关闭浏览器，以防止数据冲突。'),
                  appVue.$createElement('p', {}, '如果您确认已无法恢复此设备的连接，则可切换到此设备在离线前最后一次保存的空间。'),
                  appVue.$createElement('p', {}, '当此设备再次连接网络，会自动将无法保存的空间保存为本地空间做备份。')
                ]
              ),
              centered: true,
              okText: '我已明确，切换空间',
              cancelText: '取消',
              onOk: async () => {
                this.doChangeSpaceCloud(space)
              }
            })
          }

        } else {
          this.$confirm({
            title: '切换到云端空间',
            content: '是否切换到云端空间？切换到云端空间后会同时更换当前帐号到此帐号。请务必确认您网页上的内容已经保存。否则可能丢失未保存内容。',
            centered: true,
            okText: '我已保存，切换空间',
            cancelText: '取消',
            onOk: async () => {
              this.doChangeSpaceCloud(space)
            }
          })
        }
      }
    },
    async doChangeSpaceCloud (space) {
      try {
        let result = await spaceModel.setUser(this.user).changeCurrent(space)
        if (result.status === 1) {
        } else {
          this.$message.error('切换使用空间失败。')
        }
      } catch (e) {
        console.warn(e)
        this.$message.error('切换使用空间失败。意外错误。')
      }

    },
    changeSpace (id, type) {
      if (type === 'cloud') {
        ipc.send('changeSpace', { spaceId: id, spaceType: type, userInfo: this.user })
      } else
        ipc.send('changeSpace', { spaceId: id, spaceType: type })
    },
    openUserWindow () {
      ipc.send('showUserWindow')
    },
    visibleMessageCenter () {
      this.messageShow = !this.messageShow
      if (this.$refs.messageRef.fixed) {
        this.messageShow ? ipc.send('channelTemporaryAdjust', {
          freeFixed: false
        }) : ipc.send('channelTemporaryAdjust', {
          freeFixed: true
        })
      }
    },
    visibleGlobalSearch () {
      ipc.send('openGlobalSearch')
    },
    openCircle (args) {
      this.userPanelVisible = false
      this.addTab(`${api.getUrl(api.API_URL.user.CIRCLE)}?id=${args}`)
    },
    openHelp (apps) {
      function checkAdult (apps) {
        return apps.package === 'com.thisky.helper'
      }

      if (apps.find(checkAdult) === undefined) {
        alert('暂时无法打开')
      } else {
        ipc.send('executeApp', { app: apps.find(checkAdult) })
      }

      // ipc.send('handleTsbProtocol',{url:'tsb://app/redirect/?package=com.thisky.helper&url=/'})
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
    openCircleSetting (args) {
      ipc.send('osxOpenCircleSetting', args)
    },
    openGroupChat (id) {
      ipc.invoke('saAppOpenSysApp', { saAppId: 1,  circleId: id })
    },
    /**
     * app浮窗显示隐藏
     */
    hoverApp (e, app) {
      // if(app.processing){
      //   ipc.send('getAppCapture',{id:app.id})
      // }
    },
    executeApp (app) {
      // if(!!!app.processing){
      //   ipc.send('executeApp',{app:app})
      // }
      // 判断单例的问题留给主进程处理
      // console.log(app)
      ipc.send('executeApp', { app: app })
    },
    focus(){
      ipc.send('sidePanelFocus')
    },
    toggleUserPanel () {
      this.passList = this.$store.getters.getAllCircle.filter(v => v.status !==3 && v.status !==2 )
      this.teamList = this.passList.filter(v => v.property === 0 ||  v.property===1)
      if(this.user.uid===0){
        this.openUserWindow()
      }else{
        this.userPanelVisible = !this.userPanelVisible
        this.$store.dispatch('getJoinedCircle', { page: 1, row: 500 })
        this.$store.dispatch('getMyCircle', { page: 1, row: 500 })
      }
    },
    closeUserPanel(){
      this.userPanelVisible =false
    },
    switchTask (id, index) {
      postMessage({
        message: 'switchToTask',
        id: id,
        index: index
      })
      this.$store.commit('setSelected', id)
    },
    switchTab (taskId, tabId) {
      postMessage({
        message: 'switchToTab',
        taskId: taskId,
        tabId: tabId
      })
      this.$store.commit('setSelected', taskId)
    },
    openPinItem (id, index) {
      if (this.$store.getters.getPinItems[index].type == 'system-bookmark') {
        //this.$tabEditor.show(tasks.getSelected().tabs.getSelected(), '!bookmarks ')
        postMessage({
          message: 'openBookMarks'
        })
      } else if (this.$store.getters.getPinItems[index].type == 'task') {
        this.openItem(id, index)
      }
    },
    openItem (id, index) {
      if (id !== this.lastOpenId) {
        this.switchTask(id, index)
        this.lastOpenId = id
      }
    },
    openPopoverTab (taskId, tabId) {
      if (taskId !== this.lastOpenId) {
        //当点击不同task的popover卡片内的tab时
        this.switchTab(taskId, tabId)
        this.lastOpenId = taskId
      } else {
        //当点击同一个task的popover卡片内的tab时，只需跳转tab
        this.switchTab(null, tabId)
      }
    },
    openBottom (action) {
      if(action==='help'){
        window.location.href='tsb://app/redirect/?package=com.thisky.helper&url=https://www.yuque.com/tswork/browser/tmpomo'
        return
      }
      if(action==='setting'){
        postMessage({
          message: action
        })
      }
    },
    openHelpCenter() {
      this.addTab('ts://guide')
    },
    openGroup () {
      ipc.send('openGroup')
    },
    //开始拖拽事件
    onStart () {
      this.drag = true
    },
    //拖拽结束事件
    onEnd (e) {
      this.drag = false

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
    watchHasMore(scroller,hasMoreEl){
      var scrollTop = scroller.scrollTop
//变量windowHeight是可视区的高度
      var windowHeight = scroller.clientHeight
//变量scrollHeight是滚动条的总高度
      var scrollHeight = scroller.scrollHeight;
      //滚动条到底部的条件
      if(scrollTop+windowHeight>=scrollHeight-10){
        hasMoreEl.classList.remove('has-more')
        //写后台加载数据的函数
      }else{
        if(!hasMoreEl.classList.contains('has-more')){
          hasMoreEl.classList.add('has-more')
        }
      }
    },
    onScroll(event,hasMoreElSelector){
     let hasMoreEl= document.getElementById(hasMoreElSelector)
      this.watchHasMore(event.target,hasMoreEl)

    },
    onMove ({
      relatedContext,
      draggedContext
    }) {
      const relatedElement = relatedContext.element
      const draggedElement = draggedContext.element
      return (
        !draggedElement.fixed //&&(!relatedElement || !relatedElement.fixed)
      )
    },
    //对任务数组重新进行排序
    getNewIndex (droppedTaskId) {
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
          break
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
            break
          }
        }
      }
      return index

    },
    changeBottomSize (key) {
      let that = this
      setTimeout(function () {
        that.fixElementPosition()
      }, 200)
      let state = key.length === 1 ? 1 : 0
      db.system.where({ name: 'sidebarBottom' }).delete()
      db.system.put({ name: 'sidebarBottom', value: state })

    },
    fixElementPosition () {
      const itemsEl = document.getElementById('itemsEl')
      const bottomsEl = document.getElementById('bottomsEl')
      itemsEl.style.bottom = bottomsEl.offsetHeight + 'px'
    },
    //点击用户登录按钮
    userClick () {
      if (this.user.uid === 0) {
        this.addTab(api.getUrl(api.API_URL.user.login))
      } else {
        this.addTab(api.getUrl(api.API_URL.user.home))
      }
      this.userPanelVisible = false
    },
    openCom () {
      if (this.user.uid === 0) {
        this.addTab(api.getUrl(api.API_URL.user.login))
      } else {
        this.addTab(api.getUrl(api.API_URL.user.home))
      }
    },
    addTab (url) {
      postMessage({
        message: 'addTab',
        'url': url
      })
    },
    async logout () {
      const result = await db.system.where('name').equals('currentUser').first()
      await db.accounts.where({ id: this.user.uid }).delete()
      ipc.send('logoutBrowser')
      await window.insertDefaultUser(result.value.code)
      //下面这步在insertDefaultUser方法中有
      //db.system.where({name:'currentUser'}).delete()
      this.closeUserPanel()
      this.$store.commit('SET_RESET_TSGRADE')
      this.$message.info('注销成功！')
    },
    switchAccount () {
      this.userPanelVisible = false
      this.addTab(api.getUrl(api.API_URL.user.login))
    },
    goSpace () {
      this.userPanelVisible = false
      this.addTab(api.getUrl(api.API_URL.user.space))
    },
    goProfile () {
      this.userPanelVisible = false
      this.addTab(api.getUrl(api.API_URL.user.profile))
    },
    goGroup () {
      this.userPanelVisible = false
      this.addTab(api.getUrl(api.API_URL.group.index))
    },
    goAccount () {
      this.userPanelVisible = false
      this.addTab(api.getUrl(api.API_URL.user.account))
    },
    openGroupHelp () {
      ipc.send('addTab', { url: 'https://www.yuque.com/tswork/ngd5zk/rls0pi' })
    },
    addNewTask (e) {
      ipc.send('addNewTask')
      this.$message.success({ content: '成功添加一个新标签组到左侧栏。' })
    },
    closeItem (item) {
      if (item.type === 'task') {
        let hasLocked = false
        item.tabs.forEach((item) => {
          if (item.lock === true) {
            hasLocked = true
          }
        })
        if (hasLocked === false) {
          ipc.send('closeTask', { tabId: item.id })
          this.$message.success({ content: '删除标签组成功。' })
        } else {
          this.$message.error({ content: '删除标签失败，组内存在锁定标签，请解锁后重新删除。' })
        }

      }
    },
    createGroup () {
      //ipc.send('createGroup')   //原方案废弃
      ipc.send('osxCreateCircle')
    },
    changePopoverVisible (visible) {
      this.isPopoverShowing = visible
    },
    shareTask(item){
      let tabs = item.tabs
      let filterList =  tabs.filter(e => !e.url.startsWith('file:///'))    //过滤掉file层面的tab
      let args = []
      for(let i = 0; i < filterList.length; i++) {
        const obj = {
          url: filterList[i].url,
          favicon: filterList[i].favicon === null ? '/shareTask/default.svg' : filterList[i].favicon.url,
          title: filterList[i].title
        }
        args.push(obj)
      }
      if(args.length===0){
        appVue.$message.error('排除系统页面后，没有其他页面，无法分享。')
        return
      }
      ipc.send( 'shareTask', args)
    },
    /**
     * 锁定任务
     * @param id
     */
    lockTask (id) {
      ipc.sendTo(mainWindowId, 'lockTask', { id: id })
    },
    /**
     * 锁定单个标签
     * @param id
     * @param taskId 标签组id
     */
    toggleLockTab (id, taskId) {
      ipc.sendTo(mainWindowId, 'toggleLockTab', { id: id, taskId: taskId })
    },
    closeTab (id, taskId) {

      ipc.sendTo(mainWindowId, 'closeTab', { id: id, taskId: taskId })
    },
    showHoverLock (tab) {
      document.getElementById('hoverLock' + tab.id).hidden = false
      document.getElementById('close' + tab.id).hidden = false
      document.getElementById('tabIcon' + tab.id).hidden = true
    },
    hideHoverLock (tab) {
      document.getElementById('close' + tab.id).hidden = true
      document.getElementById('tabIcon' + tab.id).hidden = false
      if (!(tab.lock === true)) {
        document.getElementById('hoverLock' + tab.id).hidden = true
      }
    },
    clearTaskUnlock (task) {
      ipc.sendTo(mainWindowId, 'clearTaskUnlock', { id: task.id })
    },
    createMenu (appId, app) {
      let desks = []
      try {
        desks = JSON.parse(localStorage.getItem('desks'))
      } catch (e) {
        console.log('解析桌面失败')
      }
      ipc.send('createAppMenu', { id: appId, app: app, desks: desks })
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

    editTaskName (item) {
      const id = item.id
      const inputEl = document.getElementById('taskTitleInput' + id)
      document.getElementById('editTip' + id).hidden = true
      if (inputEl.hidden === true) {
        document.getElementById('taskTitle' + id).hidden = true
        inputEl.hidden = false
        inputEl.select()
      }

    },
    editTaskNameBlur (item) {
      const id = item.id
      document.getElementById('taskTitle' + id).hidden = false
      document.getElementById('editTip' + id).hidden = false
      const inputEl = document.getElementById('taskTitleInput' + id)
      inputEl.hidden = true
      ipc.sendTo(mainWindowId, 'renameTask', { id: item.id, newName: inputEl.value })
    },
    editTaskNameKeyPress (event) {
      event.currentTarget.blur()
    },
    /**
     * 处理窗体失去焦点事件
     */
    blur () {
      // appVue.$refs.sidePanel.$refs.tippy.tip.hide() //失焦的时候关闭tippy的弹窗
      //处理左侧栏，强制移除expanded样式
      if (appVue.mod === 'auto' || appVue.mod === 'close') {
        document.getElementById('appVue').classList.remove('expanded')
      }
      //处理全部的左侧浮窗，都加上display:none
      VueTippy.tippy.hideAll()
    },
    dividerResizeStart (e) {
      this.startY = e.clientY
      this.resizing = true
      document.getElementById('saApp-box').style.height = document.getElementById('pinGroup').clientHeight + 'px'
      document.getElementById('pinGroup').style.position = 'absolute'
      this.startHeight = document.getElementById('saApp-box').offsetHeight
      document.onmousemove = this.dividerResizing
      document.onmouseup = this.dividerResizeEnd
      document.body.style.userSelect = 'none'
      localStorage.setItem('sidebarDividerMod', 'manual')
      appVue.$message.info({ content: '应用栏的高度模式更改为手动调整。双击分隔条可切换回自动模式。', key: 'dividerMod' })
    },
    dividerResizeEnd () {
      this.resizing = false
      localStorage.setItem('sidebarDividerY', document.getElementById('saApp-box').offsetHeight + 'px')
    },
    dividerResizing (e) {
      if (this.resizing) {
        let movedY = e.clientY - this.startY
        if (movedY < 0) {
          document.getElementById('saApp-box').style.height = this.startHeight
        }
        if (movedY + this.startHeight >= document.getElementById('pinGroup').scrollHeight) {
          document.getElementById('saApp-box').style.height = document.getElementById('pinGroup').offsetHeight + 'px'
          return
        } else {
          document.getElementById('saApp-box').style.height = movedY + this.startHeight + 'px'
        }
        this.watchAllHasMore()
        //this.watchHasMore(document.getElementById('appGroup'),document.getElementById('appGroupInner'))
      }
    },
    fitSize () {
      document.getElementById('saApp-box').style.height = 'auto'
      document.getElementById('pinGroup').style.position = 'relative'
      document.getElementById('pinGroup').style.height = 'auto'
      localStorage.setItem('sidebarDividerMod', 'auto')
      this.watchAllHasMore()
      appVue.$message.info({ content: '应用栏的高度模式更改为自动模式。拖动分隔条可更改为手动模式。', key: 'dividerMod' })

    }
  }

})

ipc.on('message', function (event, args) {
  if (!!!args.type) {
    args.type = 'open'
  }
  appVue.$message[args.type](args.config)
})

ipc.on('executedAppSuccess', async function (event, args) {
  let now=Date.now()
  appVue.$refs.sidePanel.apps.forEach(app => {
    if (app.id === args.app.id) {
      app.processing = true
      app.windowId = args.app.windowId
      app.lastExecuteTime=now
    }
  })
  appVue.$refs.sidePanel.runningApps.push(args.app.id)
  appVue.$refs.sidePanel.sortApps()
  standAloneAppModel.update(args.app.id, { lastExecuteTime: now }).then((res) => {
  })
  setTimeout(()=>{
    appVue.$refs.sidePanel.watchAllHasMore()
  },300)
  //mark插入对appsExecutedCounts的数据统计
  setTimeout(async () => {
    await userStatsModel.incrementValue('appsExecutedCounts')
  }, 2000)
})
ipc.on('closeApp', function (event, args) {
  appVue.$refs.sidePanel.apps.forEach(app => {
    if (app.id === args.id) {
      app.processing = false
      //从正在运行的app里移除掉该id
      let appIndex = appVue.$refs.sidePanel.runningApps.indexOf(args.id)
      if (appIndex > -1)
        appVue.$refs.sidePanel.runningApps.splice(appIndex, 1)
      appVue.$refs.sidePanel.sortApps()
    }
  })
})

ipc.on('updateAppCapture', function (event, args) {
  appVue.$refs.sidePanel.apps.forEach(app => {
    if (app.id === args.id) {
      app.capture = args.captureSrc + '?t=' + Date.now()
    }
  })
})
ipc.on('updateRunningApps', function (event, args) {
  appVue.$refs.sidePanel.runningApps = args.runningApps
  appVue.$refs.sidePanel.apps.forEach((app, index) => {
    if (args.runningApps.indexOf(app.id) > -1) {
      app.processing = true
      app.windowId = args.windows[args.runningApps.indexOf(app.id)]
      ipc.send('getAppRunningInfo', { id: app.id })
    }
  })
  appVue.$refs.sidePanel.sortApps()
  setTimeout(()=>{
    appVue.$refs.sidePanel.watchAllHasMore()
  },300)
})

ipc.on('updateSetting', function (event, args) {
  appVue.$refs.sidePanel.apps.forEach((app, index) => {
    if (app.id === args.id) {
      standAloneAppModel.setAppSetting(args.id, args.settings)
      app.settings = Object.assign(app.settings, args.settings)
    }
  })
})
ipc.on('updateAppMemoryUsage', function (event, args) {
})

ipc.on('updateRunningInfo', function (event, args) {
  appVue.$refs.sidePanel.apps.forEach(app => {
    if (app.id === args.id) {
      app.capture = args.info.capture + '?t=' + Date.now()
      app.memoryUsage = args.info.memoryUsage
    }
  })
})

ipc.on('deleteApp', function (event, args) {
  let index = 0
  for (let i = 0; i < appVue.$refs.sidePanel.apps.length; i++) {
    if (appVue.$refs.sidePanel.apps[i].id === args.id) {
      index = i
    }
  }
  if (index) {
    appVue.$refs.sidePanel.apps.splice(index, 1)
  }
})

ipc.on('installApp', function (event, args) {
  let id = args.id
  standAloneAppModel.get(id).then(async app => {
    if (!args.background) {ipc.send('executeApp', { app: app })}
    appVue.$refs.sidePanel.apps = await standAloneAppModel.getAllApps()
    ipc.send('getRunningApps')
  })
})

ipc.on('runAutoRunApps', function (event, args) {
  appVue.$refs.sidePanel.apps.forEach(app => {
    if (app.settings.autoRun) {
      ipc.send('executeApp', { app: app, background: true })
    }
  })
  // if (!localStorage.getItem('suggest')) {
  //   ipc.send('wizard', { page: 'apps' })
  // }
})

ipc.on('appBadge', function (event, args) {
  appVue.$refs.sidePanel.apps.forEach(app => {
    if (app.id === args.id) {
      if (args.add) {
        if (!!!app.badge) app.badge = 0
        app.badge += args.add //默认是使用add来增加，否则直接使用badge
      } else {
        app.badge = args.badge
      }
    }

  })
})

ipc.on('countWebviewInk', async () => {
  setTimeout(async () => {
    await userStatsModel.incrementValue('webviewsInk')
  }, 2000)
})

ipc.on('countScript', async () => {
  try {
    let num = require('../util/model/userScriptModel').countScript(window.globalArgs['user-data-path'])
    setTimeout(async () => {
      await userStatsModel.setValue('scripts', num)
    }, 10000)
  } catch (err) {
    await userStatsModel.setValue('scripts', 0)
  }
})

ipc.on('defaultBrowser', (event, args) => {
  setTimeout(async () => {
    args ? await userStatsModel.setValue('defaultBrowser', 1) : await userStatsModel.setValue('defaultBrowser', 0)
  }, 2000)
})

ipc.on('addToDesk', (event, args) => {
  const deskModel = require('../util/model/deskModel.js')
  const element = deskModel.createElementPos(args.app)
  deskModel.addElementToDesk(element, args.deskId)
  ipc.send('message', { 'type': 'success', config: { 'content': '添加到桌面成功' } })
})

//左侧栏失去焦点
ipc.on('blur', (event, args) => {
  //todo 关闭左侧栏的展开
  appVue.$refs.sidePanel.blur()
})

//左侧栏最小化后会有失去焦点穿透问题，最小化前先收起左侧栏
ipc.on('closeUserSidePanel',(event,args)=>{
 appVue.$refs.sidePanel.userPanelVisible=false
})

ipc.on('guide',async (event, args) => {
  let current;
  if (args === 5) {
    current = await db.system.where('name').equals('currentUser').first()
    if(current.value.uid !== 0){
      appVue.$refs.sidePanel.toggleUserPanel()
      setTimeout(() => {
        appVue.$refs.sidePanel.focus()
        appVue.$refs.sidePanel.guide(args)
        ipc.send('enterGuide')
      }, 500)
    }
    if(current.value.uid === 0){
     console.log('请先登录')
    }
    // appVue.$refs.sidePanel.userPanelVisible=true
  } else {
    ipc.send('enterGuide')
    appVue.$refs.sidePanel.focus()
    appVue.$refs.sidePanel.guide(args)
  }
})

ipc.on('guideApplyFirst',()=>{
  ipc.send('enterGuide')
  appVue.$refs.sidePanel.focus()
  appVue.$refs.sidePanel.guideApplyFirst()
})

ipc.on('guideDesktop',()=>{
  setTimeout(() => {
    ipc.send('enterGuide')
  }, 1200)
  appVue.$refs.sidePanel.focus()
  appVue.$refs.sidePanel.guideDesktop()
})

ipc.on('appRedirect', async (event, args) => {
  let app = await standAloneAppModel.getFromPackage(args.package)
  if (app) {
    ipc.send('executeApp', {
      app,
      background: args.background ? args.background === 'true' : true,
      option: {
        action: 'redirect',
        url: args.url
      }
    })
  }
})
/**
 * 处理各种文件关联
 */
ipc.on('handleFileAssign', async (event, args) => {
  let app = null
  if (args.target) {
    //已经指定了运行的方式
  } else {
    let assignApps = await standAloneAppModel.getFileAssginApps(args.type)
    if (assignApps.length === 0) {
      ipc.send('message', { type: 'error', config: { content: '不存在可执行的相关应用' } })
    }
    if (assignApps.length > 1) {
      //todo 选择一个app
    } else {
      ipc.send('executeApp', {
        app: assignApps[0],
        background: false,
        option: {
          action: 'fileAssign',
          filePath: args.args.filePath
        }
      })
    }
  }
})

ipc.on('saving', async () => {
  let savingIcon = document.getElementById('savingIcon')
  savingIcon.classList.add('saving')
  appVue.$refs.sidePanel.lastSync=Date.now()
  if (savingIcon.classList.contains('offline')) {
    appVue.$message.success('云空间重新连接成功，已为您实时保持同步。')
    appVue.$refs.sidePanel.spaceStatus='online'

    await appVue.$store.dispatch('getCloudSpaces')
    appVue.$refs.sidePanel.cloudSpaces = this.$store.state.cloudSpaces
    savingIcon.classList.remove('offline')
    savingIcon.classList.add('online')
  }
  setTimeout(() => {
    savingIcon.classList.remove('saving')
  }, 2000)
})

ipc.on('disconnect', async () => {
  let savingIcon = document.getElementById('savingIcon')
  if (savingIcon.classList.contains('online')) {
    appVue.$refs.sidePanel.spaceStatus='offline'
    savingIcon.classList.remove('online')
    savingIcon.classList.add('offline')

  }
})

ipc.on('reconnect',async()=>{
  let savingIcon = document.getElementById('savingIcon')
  appVue.$message.success('云空间重新连接成功，已为您实时保持同步。')
  if (savingIcon.classList.contains('offline')) {
    savingIcon.classList.remove('offline')
    appVue.$refs.sidePanel.spaceStatus='online'
    savingIcon.classList.add('online')
  }

})


ipc.on('getUserInfo',async (event,args)=>{
  let user=await db.system.where("name").equals("currentUser").first();
  ipc.sendTo(args.webContentsId,'gotUserInfo',{user:user})
})
