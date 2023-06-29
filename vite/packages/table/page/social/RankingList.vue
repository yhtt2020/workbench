<template>
  <div class="page-container rounded-xl xt-bg">
    <!-- 榜单tab -->
    <div class="flex flex-row rounded-lg p-1 h-11" style="color: var(--primary-text); background: var(--primary-bg); z-index:2;">
      <div v-for="(item,index) in navList" :key="index" style="width:25%;" class="h-full nav-item flex justify-center btn-active items-center relative rounded-lg pointer"
          @click.stop="clickNav(item,index)" :class="activeIndex===index ? 'select-item':''" >
          <a-avatar :src="item.icon" :size="24"></a-avatar>
          <span class="ml-2">{{ item.title }}</span>
          <div v-if="item.state === true" class="state-dot ml-2"></div>
      </div>
    </div>
    <!-- 在线榜 -->
    <div class="scroll-list" v-if="defaultNavList.name === 'onLine'">
      <!-- 前三名展示 -->
      <div class="top-three-box"> 
        <div class="box-item">
          <div class="item-avatar two-avatar">
            <a-avatar :src="onLineList[1].avatar" :size="68"></a-avatar>
          </div>
          <span class="xt-text mb-2 truncate">{{ onLineList[1].nickname }}</span>
          <span>
            <span class="text-back">总</span>
            <span class="xt-text-2 ml-1">{{ onLineList[1].totalDuration }} 小时</span>
          </span>
        </div>
        <div class="one-box-item">
          <div class="one-avatar">
            <div class="avatar-img">
              <a-avatar :src="onLineList[0].avatar" :size="87"></a-avatar>
            </div>
          </div>
          <div class="xt-text mb-2 truncate">{{ onLineList[0].nickname }}</div>
          <span>
            <span class="text-back">总</span>
            <span class="xt-text-2 ml-1">{{ onLineList[0].totalDuration }} 小时</span>
          </span>
        </div>
        <div class="box-item">
          <div class="item-avatar three-avatar">
            <a-avatar :src="onLineList[2].avatar" :size="69"></a-avatar>
          </div>
          <span class="xt-text mb-2 truncate">{{ onLineList[2].nickname }}</span>
          <span>
            <span class="text-back">总</span>
            <span class="xt-text-2 ml-1">{{ onLineList[2].totalDuration }} 小时</span>
          </span>
        </div>
        <!-- 切换时长 -->
        <div class="toggle-duration">
          <a-select :style="selectStyle"
              class="select rounded-lg  text-xs flex items-center" size="large" :bordered="false"
              v-model:value="selectValue" :dropdownStyle="{ 'z-index': 9, backgroundColor: 'var(--secondary-bg)' }">
              <a-select-option class="no-drag" v-for="item in sortType" :value="item.value" :key="item">{{ item.name }}</a-select-option>
          </a-select>
        </div>
      </div>
      <!-- 在线榜列表 -->
      <div class="box">
        <a-row class="box-head">
          <!-- <a-col class="head-col" :span="6" v-for="i in onLineListTitle" :key="i">{{ i }}</a-col> -->
          <a-col class="head-col" :span="7">用户</a-col>
          <a-col class="head-col" :span="5">总在线时长</a-col>
          <a-col class="head-col" :span="5">净在线时长</a-col>
          <a-col class="head-col" :span="7">小队</a-col>
        </a-row>
        <a-row class="box-list" v-for="item in onLineList" :key="item.id">
          <a-col :span="7" class="box-col"> 
            <span class="ml-4" v-if="item.id === 1">
              <a-avatar src="../../../../public/img/rankingList/one.png" :size="32"></a-avatar>
            </span>
            <span class="ml-4" v-else-if="item.id === 2">
              <a-avatar src="../../../../public/img/rankingList/two.png" :size="32"></a-avatar>
            </span>
            <span class="ml-4" v-else-if="item.id === 3">
              <a-avatar src="../../../../public/img/rankingList/three.png" :size="32"></a-avatar>
            </span>
            <div v-else class="ranking-back">{{ item.id }}</div>
            <span class="mx-4" @showCard="item.uid">
              <a-avatar :src="item.avatar" :size="40"></a-avatar>
            </span>
            <span class="xt-text truncate" style="font-size: 16px;">{{ item.nickname }}</span>
          </a-col>
          <a-col :span="5" class="box-col justify-center">
            <span>{{ item.totalDuration }} 小时</span>
          </a-col>
          <a-col :span="5" class="box-col justify-center">{{ item.netDuration }} 小时</a-col>
          <a-col :span="7" class="box-col" v-if="item.team">
            <span class="mr-4 ml-16">
              <a-avatar :src="item.icon" :size="40"></a-avatar>
            </span>
            <span>{{ item.team }}</span>
          </a-col>
          <a-col v-else :span="6" class="box-col flex justify-center">-</a-col>
        </a-row>
      </div>
      <!-- 切换数据 -->
      <div class="switch-data">
        <div class="mr-3"><Icon icon="xiangzuo" style="font-size: 1.5em;"></Icon></div>
        <div><Icon icon="xiangyou" style="font-size: 1.5em;"></Icon></div>
      </div>
      <!-- 我的排名 -->
      <div class="my-style">
        <a-row class="box-list xt-mask">
          <a-col :span="7" class="box-col"> 
            <div class="ranking-back">{{ myRanking.id }}</div>
            <span class="mx-4" @showCard="myRanking.uid">
              <a-avatar :src="myRanking.avatar" :size="40"></a-avatar>
            </span>
            <span class="xt-text truncate" style="font-size: 16px;">{{ myRanking.nickname }}</span>
            <span class="min-back ml-2">我</span>
          </a-col>
          <a-col :span="5" class="box-col justify-center">
            <span>{{ myRanking.totalDuration }} 小时</span>
          </a-col>
          <a-col :span="5" class="box-col justify-center">{{ myRanking.netDuration }} 小时</a-col>
          <a-col :span="7" class="box-col">
            <span class="mr-4 ml-16">
              <a-avatar :src="myRanking.icon" :size="40"></a-avatar>
            </span>
            <span>{{ myRanking.team }}</span>
          </a-col>
        </a-row>
      </div>
    </div>

    <!-- 小队榜 -->
    <div class="scroll-list" v-if="defaultNavList.name === 'team'">
      <!-- 前三名展示 -->
      <div class="top-three-box"> 
        <div class="box-item">
          <div class="item-avatar two-avatar">
            <a-avatar :src="teamList[1].avatar" :size="68"></a-avatar>
          </div>
          <span class="xt-text mb-2 truncate">{{ teamList[1].nickname }}</span>
          <span>
            <span class="xt-text-2 ml-1">{{ teamList[1].onlineDuration }} 小时</span>
          </span>
        </div>
        <div class="one-box-item">
          <div class="one-avatar">
            <div class="avatar-img">
              <a-avatar :src="teamList[0].avatar" :size="87"></a-avatar>
            </div>
          </div>
          <div class="xt-text mb-2 truncate">{{ teamList[0].nickname }}</div>
          <span>
            <span class="xt-text-2 ml-1">{{ teamList[0].onlineDuration }} 小时</span>
          </span>
        </div>
        <div class="box-item">
          <div class="item-avatar three-avatar">
            <a-avatar :src="teamList[2].avatar" :size="69"></a-avatar>
          </div>
          <span class="xt-text mb-2 truncate">{{ teamList[2].nickname }}</span>
          <span>
            <span class="xt-text-2 ml-1">{{ teamList[2].onlineDuration }} 小时</span>
          </span>
        </div>
      </div>
      <!-- 小队榜列表 -->
      <div class="box">
        <a-row class="box-head">
          <!-- <a-col class="head-col" :span="6" v-for="i in teamListTitle" :key="i">{{ i }}</a-col> -->
          <a-col class="head-col" :span="7">用户</a-col>
          <a-col class="head-col" :span="5">在线时长</a-col>
          <a-col class="head-col" style="text-align:left;padding-left: 60px;" :span="12">小队成员</a-col>
        </a-row>
        <a-row class="box-list" v-for="item in teamList" :key="item.id">
          <a-col :span="7" class="box-col"> 
            <span class="ml-4" v-if="item.id === 1">
              <a-avatar src="../../../../public/img/rankingList/one.png" :size="32"></a-avatar>
            </span>
            <span class="ml-4" v-else-if="item.id === 2">
              <a-avatar src="../../../../public/img/rankingList/two.png" :size="32"></a-avatar>
            </span>
            <span class="ml-4" v-else-if="item.id === 3">
              <a-avatar src="../../../../public/img/rankingList/three.png" :size="32"></a-avatar>
            </span>
            <div v-else class="ranking-back">{{ item.id }}</div>
            <span class="mx-4" @showCard="item.uid">
              <a-avatar :src="item.avatar" :size="40"></a-avatar>
            </span>
            <span class="xt-text truncate" style="font-size: 16px;">{{ item.nickname }}</span>
            <span class="ml-2 min-back">{{ item.unknown }}</span>
          </a-col>
          <a-col :span="5" class="box-col justify-center">{{ item.onlineDuration }} 小时</a-col>
          <a-col :span="12" class="box-col flex pl-10">
            <div v-for="i in item.member" :key="i.id" class="mx-2" style="position:relative;">
              <a-avatar :src="i.avatar" :size="40"></a-avatar>
              <span v-if="i.captain" class="captain">队长</span>
            </div>
          </a-col>
        </a-row>
      </div>
      <!-- 切换数据 -->
      <div class="switch-data">
        <div class="mr-3"><Icon icon="xiangzuo" style="font-size: 1.5em;"></Icon></div>
        <div><Icon icon="xiangyou" style="font-size: 1.5em;"></Icon></div>
      </div>
      <!-- 我的排名 -->
      <div class="my-style">
        <a-row class="box-list xt-mask">
          <a-col :span="7" class="box-col"> 
            <div class="ranking-back">{{ myTeam.id }}</div>
            <span class="mx-4" @showCard="myTeam.uid">
              <a-avatar :src="myTeam.avatar" :size="40"></a-avatar>
            </span>
            <span class="xt-text truncate" style="font-size: 16px;">{{ myTeam.nickname }}</span>
            <span class="ml-2 min-back">{{ myTeam.unknown }}</span>
          </a-col>
          <a-col :span="5" class="box-col justify-center">{{ myTeam.onlineDuration }} 小时</a-col>
          <a-col :span="12" class="box-col flex pl-10">
            <div v-for="i in myTeam.member" :key="i.id" class="mx-2" style="position:relative;">
              <a-avatar :src="i.avatar" :size="40"></a-avatar>
              <span v-if="i.captain" class="captain">队长</span>
            </div>
          </a-col>
        </a-row>
      </div>
    </div>

    <!-- 邀请榜 -->
    <div class="scroll-list" v-if="defaultNavList.name === 'invite'">
      <!-- 前三名展示 -->
      <div class="top-three-box"> 
        <div class="box-item">
          <div class="item-avatar two-avatar">
            <a-avatar :src="inviteList[1].avatar" :size="68"></a-avatar>
          </div>
          <span class="xt-text mb-2 truncate">{{ inviteList[1].nickname }}</span>
          <span>
            <span class="xt-text-2 ml-1">{{ inviteList[1].invite }} 人</span>
          </span>
        </div>
        <div class="one-box-item">
          <div class="one-avatar">
            <div class="avatar-img">
              <a-avatar :src="inviteList[0].avatar" :size="87"></a-avatar>
            </div>
          </div>
          <div class="xt-text mb-2 truncate">{{ inviteList[0].nickname }}</div>
          <span>
            <span class="xt-text-2 ml-1">{{ inviteList[0].invite }} 人</span>
          </span>
        </div>
        <div class="box-item">
          <div class="item-avatar three-avatar">
            <a-avatar :src="inviteList[2].avatar" :size="69"></a-avatar>
          </div>
          <span class="xt-text mb-2 truncate">{{ inviteList[2].nickname }}</span>
          <span>
            <span class="xt-text-2 ml-1">{{ inviteList[2].invite }} 人</span>
          </span>
        </div>
      </div>
      <!-- 邀请榜列表 -->
      <div class="box">
        <a-row class="box-head">
          <a-col class="head-col" :span="7">用户</a-col>
          <a-col class="head-col" :span="10">已邀请</a-col>
          <a-col class="head-col" :span="7">小队</a-col>
        </a-row>
        <a-row class="box-list" v-for="item in inviteList" :key="item.id">
          <a-col :span="7" class="box-col"> 
            <span class="ml-4" v-if="item.id === 1">
              <a-avatar src="../../../../public/img/rankingList/one.png" :size="32"></a-avatar>
            </span>
            <span class="ml-4" v-else-if="item.id === 2">
              <a-avatar src="../../../../public/img/rankingList/two.png" :size="32"></a-avatar>
            </span>
            <span class="ml-4" v-else-if="item.id === 3">
              <a-avatar src="../../../../public/img/rankingList/three.png" :size="32"></a-avatar>
            </span>
            <div v-else class="ranking-back">{{ item.id }}</div>
            <span class="mx-4" @showCard="item.uid">
              <a-avatar :src="item.avatar" :size="40"></a-avatar>
            </span>
            <span class="xt-text truncate" style="font-size: 16px;">{{ item.nickname }}</span>
          </a-col>
          <a-col :span="10" class="box-col justify-center">{{ item.invite }} 人</a-col>
          <a-col :span="7" class="box-col" v-if="item.team">
            <span class="mr-4 ml-16">
              <a-avatar :src="item.icon" :size="40"></a-avatar>
            </span>
            <span>{{ item.team }}</span>
          </a-col>
          <a-col v-else :span="6" class="box-col flex justify-center">-</a-col>
        </a-row>
      </div>
      <!-- 切换数据 -->
      <div class="switch-data">
        <div class="mr-3"><Icon icon="xiangzuo" style="font-size: 1.5em;"></Icon></div>
        <div><Icon icon="xiangyou" style="font-size: 1.5em;"></Icon></div>
      </div>
      <!-- 我的排名 -->
      <div class="my-style">
        <a-row class="box-list xt-mask">
          <a-col :span="7" class="box-col"> 
            <div class="ranking-back">{{ myInvite.id }}</div>
            <span class="mx-4" @showCard="myInvite.uid">
              <a-avatar :src="myInvite.avatar" :size="40"></a-avatar>
            </span>
            <span class="xt-text truncate" style="font-size: 16px;">{{ myInvite.nickname }}</span>
            <span class="min-back ml-2">我</span>
          </a-col>
          <a-col :span="10" class="box-col justify-center">{{ myInvite.invite }} 人</a-col>
          <a-col :span="7" class="box-col">
            <span class="mr-4 ml-16">
              <a-avatar :src="myInvite.icon" :size="40"></a-avatar>
            </span>
            <span>{{ myInvite.team }}</span>
          </a-col>
        </a-row>
      </div>
    </div>

    <!-- 签到榜 -->
    <div class="scroll-list" v-if="defaultNavList.name === 'signIn'">
      <!-- 前三名展示 -->
      <div class="top-three-box"> 
        <div class="box-item">
          <div class="item-avatar two-avatar">
            <a-avatar :src="signInList[1].avatar" :size="68"></a-avatar>
          </div>
          <span class="xt-text mb-2 truncate">{{ signInList[1].nickname }}</span>
          <span>
            <span class="xt-text-2 ml-1">{{ signInList[1].signInTime }}</span>
          </span>
        </div>
        <div class="one-box-item">
          <div class="one-avatar">
            <div class="avatar-img">
              <a-avatar :src="signInList[0].avatar" :size="87"></a-avatar>
            </div>
          </div>
          <div class="xt-text mb-2 truncate">{{ signInList[0].nickname }}</div>
          <span>
            <span class="xt-text-2 ml-1">{{ signInList[0].signInTime }}</span>
          </span>
        </div>
        <div class="box-item">
          <div class="item-avatar three-avatar">
            <a-avatar :src="signInList[2].avatar" :size="69"></a-avatar>
          </div>
          <span class="xt-text mb-2 truncate">{{ signInList[2].nickname }}</span>
          <span>
            <span class="xt-text-2 ml-1">{{ signInList[2].signInTime }}</span>
          </span>
        </div>
        <!-- 切换签到日期 -->
        <div class="toggle-duration">
          <a-select :style="selectStyle"
              class="select rounded-lg  text-xs s-item flex items-center" size="large" :bordered="false"
              v-model:value="selectSignInValue" :dropdownStyle="{ 'z-index': 9, backgroundColor: 'var(--secondary-bg)' }">
              <a-select-option class="no-drag" v-for="item in sortSignInType" :value="item.value" :key="item">{{ item.name }}</a-select-option>
          </a-select>
        </div>
      </div>
      <!-- 签到榜列表 -->
      <div class="box">
        <a-row class="box-head">
          <a-col class="head-col" :span="7">用户</a-col>
          <a-col class="head-col" :span="10">已邀请</a-col>
          <a-col class="head-col" :span="7">小队</a-col>
        </a-row>
        <a-row class="box-list" v-for="item in signInList" :key="item.id">
          <a-col :span="7" class="box-col"> 
            <span class="ml-4" v-if="item.id === 1">
              <a-avatar src="../../../../public/img/rankingList/one.png" :size="32"></a-avatar>
            </span>
            <span class="ml-4" v-else-if="item.id === 2">
              <a-avatar src="../../../../public/img/rankingList/two.png" :size="32"></a-avatar>
            </span>
            <span class="ml-4" v-else-if="item.id === 3">
              <a-avatar src="../../../../public/img/rankingList/three.png" :size="32"></a-avatar>
            </span>
            <div v-else class="ranking-back">{{ item.id }}</div>
            <span class="mx-4" @showCard="item.uid">
              <a-avatar :src="item.avatar" :size="40"></a-avatar>
            </span>
            <span class="xt-text truncate" style="font-size: 16px;">{{ item.nickname }}</span>
          </a-col>
          <a-col :span="10" class="box-col justify-center">{{ item.signInTime }}</a-col>
          <a-col :span="7" class="box-col" v-if="item.team">
            <span class="mr-4 ml-16">
              <a-avatar :src="item.icon" :size="40"></a-avatar>
            </span>
            <span>{{ item.team }}</span>
          </a-col>
          <a-col v-else :span="6" class="box-col flex justify-center">-</a-col>
        </a-row>
      </div>
      <!-- 切换数据 -->
      <div class="switch-data">
        <div class="mr-3"><Icon icon="xiangzuo" style="font-size: 1.5em;"></Icon></div>
        <div><Icon icon="xiangyou" style="font-size: 1.5em;"></Icon></div>
      </div>
      <!-- 我的排名 -->
      <div class="my-style">
        <a-row class="box-list xt-mask">
          <a-col :span="7" class="box-col"> 
            <div class="ranking-back">{{ mySignIn.id }}</div>
            <span class="mx-4" @showCard="mySignIn.uid">
              <a-avatar :src="mySignIn.avatar" :size="40"></a-avatar>
            </span>
            <span class="xt-text truncate" style="font-size: 16px;">{{ mySignIn.nickname }}</span>
            <span class="min-back ml-2">我</span>
          </a-col>
          <a-col :span="10" class="box-col justify-center">{{ mySignIn.signInTime }}</a-col>
          <a-col :span="7" class="box-col">
            <span class="mr-4 ml-16">
              <a-avatar :src="mySignIn.icon" :size="40"></a-avatar>
            </span>
            <span>{{ mySignIn.team }}</span>
          </a-col>
        </a-row>
      </div>
    </div>
  </div>
</template>

<script>
import { mapActions, mapWritableState } from 'pinia'
import { appStore } from '../../store'
export default {
  name: 'RankingList',
  components: {
  },
  data(){
    return {
      // 榜单tab
      navList: [
      {title: '在线榜', icon: '../../../../public/img/rankingList/rocket.png', name: 'onLine'},
      {title: '小队榜', icon: '../../../../public/img/rankingList/tiny_spot.png', name: 'team'},
      {title: '邀请榜', icon: '../../../../public/img/rankingList/handshake.png', name: 'invite'},
      {title: '签到榜', icon: '../../../../public/img/rankingList/mantelpiece.png', name: 'signIn'}
      ],
      // 默认选中
      defaultNavList: {title: '在线榜', icon: '../../../../public/img/rankingList/rocket.png', name: 'onLine'},
      activeIndex: 0,
      onLineListTitle: ['用户','总在线时长','净在线时长','小队'],
      // 在线榜
      onLineList: [
        {
          id: 1,
          uid: 111,
          avatar: '/icons/logo128.png',
          nickname: 'Victor Ruiz',
          totalDuration: 1453,
          netDuration: 1341,
          team: '铁匠铺',
          icon: '../../../../public/img/rankingList/rocket.png'
        },
        {
          id: 2,
          uid: 112,
          avatar: '/icons/logo128.png',
          nickname: 'Edith Harvey',
          totalDuration: 1253,
          netDuration: 1241,
          team: '铁匠铺',
          icon: '../../../../public/img/rankingList/handshake.png'
        },
        {
          id: 3,
          uid: 113,
          avatar: '/icons/logo128.png',
          nickname: 'Russell Morgan',
          totalDuration: 1113,
          netDuration: 1011,
          team: '',
          icon: ''
        },
        {
          id: 4,
          uid: 114,
          avatar: '/icons/logo128.png',
          nickname: 'Edith Turner',
          totalDuration: 1053,
          netDuration: 1052,
          team: '铁匠铺',
          icon: '../../../../public/img/rankingList/mantelpiece.png',
        },
        {
          id: 5,
          uid: 115,
          avatar: '/icons/logo128.png',
          nickname: 'Edith Turner',
          totalDuration: 1053,
          netDuration: 1052,
          team: '铁匠铺',
          icon: '../../../../public/img/rankingList/mantelpiece.png',
        },
        {
          id: 6,
          uid: 116,
          avatar: '/icons/logo128.png',
          nickname: 'Edith Turner',
          totalDuration: 1053,
          netDuration: 1052,
          team: '铁匠铺',
          icon: '../../../../public/img/rankingList/mantelpiece.png',
        },
        {
          id: 7,
          uid: 116,
          avatar: '/icons/logo128.png',
          nickname: 'Edith Turner',
          totalDuration: 1053,
          netDuration: 1052,
          team: '铁匠铺',
          icon: '../../../../public/img/rankingList/mantelpiece.png',
        },
        {
          id: 8,
          uid: 116,
          avatar: '/icons/logo128.png',
          nickname: 'Edith Turner',
          totalDuration: 1053,
          netDuration: 1052,
          team: '铁匠铺',
          icon: '../../../../public/img/rankingList/mantelpiece.png',
        },
        {
          id: 9,
          uid: 116,
          avatar: '/icons/logo128.png',
          nickname: 'Edith Turner',
          totalDuration: 1053,
          netDuration: 1052,
          team: '铁匠铺',
          icon: '../../../../public/img/rankingList/mantelpiece.png',
        },
        {
          id: 10,
          uid: 116,
          avatar: '/icons/logo128.png',
          nickname: 'Edith Turner',
          totalDuration: 1053,
          netDuration: 1052,
          team: '铁匠铺',
          icon: '../../../../public/img/rankingList/mantelpiece.png',
        }
      ],
      // 我的在线榜排行
      myRanking: {
        id: 20,
        uid: 113,
        avatar: '/icons/logo128.png',
        nickname: 'Russell Morgan',
        totalDuration: 1113,
        netDuration: 1011,
        team: '铁匠铺',
        icon: '../../../../public/img/rankingList/rocket.png'
      },
      selectValue: '总在线时长',
      sortType: [
        {name: '总在线时长',value: '总在线时长'},
        {name: '净在线时长',value: '净在线时长'},
      ],
      selectSignInValue: '今日签到榜',
      sortSignInType: [
        {name: '今日签到榜',value: '今日签到榜'},
        {name: '累计签到榜',value: '累计签到榜'},
        {name: '连续签到榜',value: '连续签到榜'},
      ],
      teamListTitle: ['用户','在线时长','小队成员'],
      // 小队榜
      teamList: [
        {
          id: 1,
          uid: 111,
          avatar: '/icons/logo128.png',
          nickname: '铁匠铺',
          unknown: '#6666',
          onlineDuration: 34563,
          member: [
            {
              id: 1,
              uid: 111,
              avatar: '/icons/logo128.png',
              nickname: 'Victor Ruiz',
              totalDuration: 1453,
              netDuration: 1341,
              team: '铁匠铺',
              icon: '../../../../public/img/rankingList/rocket.png',
              captain: true
            },
            {
              id: 2,
              uid: 112,
              avatar: '/icons/logo128.png',
              nickname: '疯狂蜜蜂团',
              totalDuration: 1253,
              netDuration: 1241,
              team: '铁匠铺',
              icon: '../../../../public/img/rankingList/handshake.png'
            },
            {
              id: 3,
              uid: 111,
              avatar: '/icons/logo128.png',
              nickname: 'Victor Ruiz',
              totalDuration: 1453,
              netDuration: 1341,
              team: '铁匠铺',
              icon: '../../../../public/img/rankingList/rocket.png',
            },
            {
              id: 4,
              uid: 112,
              avatar: '/icons/logo128.png',
              nickname: '疯狂蜜蜂团',
              totalDuration: 1253,
              netDuration: 1241,
              team: '铁匠铺',
              icon: '../../../../public/img/rankingList/handshake.png'
            },
            {
              id: 5,
              uid: 112,
              avatar: '/icons/logo128.png',
              nickname: '疯狂蜜蜂团',
              totalDuration: 1253,
              netDuration: 1241,
              team: '铁匠铺',
              icon: '../../../../public/img/rankingList/handshake.png'
            },
          ]
        },
        {
          id: 4,
          uid: 111,
          avatar: '/icons/logo128.png',
          nickname: '勇敢海豚',
          unknown: '#6666',
          onlineDuration: 34563,
          member: [
            {
              id: 1,
              uid: 111,
              avatar: '/icons/logo128.png',
              nickname: 'Victor Ruiz',
              totalDuration: 1453,
              netDuration: 1341,
              team: '铁匠铺',
              icon: '../../../../public/img/rankingList/rocket.png',
              captain: true
            },
            {
              id: 2,
              uid: 112,
              avatar: '/icons/logo128.png',
              nickname: 'Edith Harvey',
              totalDuration: 1253,
              netDuration: 1241,
              team: '铁匠铺',
              icon: '../../../../public/img/rankingList/handshake.png'
            },
          ]
        },
        {
          id: 3,
          uid: 111,
          avatar: '/icons/logo128.png',
          nickname: 'Victor Ruiz',
          unknown: '#6666',
          onlineDuration: 34563,
          member: [
            {
              id: 1,
              uid: 111,
              avatar: '/icons/logo128.png',
              nickname: 'Victor Ruiz',
              totalDuration: 1453,
              netDuration: 1341,
              team: '铁匠铺',
              icon: '../../../../public/img/rankingList/rocket.png',
              captain: true
            },
            {
              id: 2,
              uid: 112,
              avatar: '/icons/logo128.png',
              nickname: 'Edith Harvey',
              totalDuration: 1253,
              netDuration: 1241,
              team: '铁匠铺',
              icon: '../../../../public/img/rankingList/handshake.png'
            },
          ]
        },
        {
          id: 4,
          uid: 111,
          avatar: '/icons/logo128.png',
          nickname: 'Victor Ruiz',
          unknown: '#6666',
          onlineDuration: 34563,
          member: [
            {
              id: 1,
              uid: 111,
              avatar: '/icons/logo128.png',
              nickname: 'Victor Ruiz',
              totalDuration: 1453,
              netDuration: 1341,
              team: '铁匠铺',
              icon: '../../../../public/img/rankingList/rocket.png',
              captain: true
            },
            {
              id: 2,
              uid: 112,
              avatar: '/icons/logo128.png',
              nickname: 'Edith Harvey',
              totalDuration: 1253,
              netDuration: 1241,
              team: '铁匠铺',
              icon: '../../../../public/img/rankingList/handshake.png'
            },
          ]
        },
      ],
      // 我的小队榜排行
      myTeam: {
        id: 54,
        uid: 111,
        avatar: '/icons/logo128.png',
        nickname: 'Victor Ruiz',
        unknown: '#6666',
        onlineDuration: 34563,
        member: [
          {
            id: 1,
            uid: 111,
            avatar: '/icons/logo128.png',
            nickname: 'Victor Ruiz',
            totalDuration: 1453,
            netDuration: 1341,
            team: '铁匠铺',
            icon: '../../../../public/img/rankingList/rocket.png',
            captain: true
          },
          {
            id: 2,
            uid: 112,
            avatar: '/icons/logo128.png',
            nickname: 'Edith Harvey',
            totalDuration: 1253,
            netDuration: 1241,
            team: '铁匠铺',
            icon: '../../../../public/img/rankingList/handshake.png'
          },
        ]
      },
      // 邀请榜
      inviteList: [
        {
          id: 1,
          uid: 111,
          avatar: '/icons/logo128.png',
          nickname: 'Victor Ruiz',
          invite: 354,
          team: '铁匠铺',
          icon: '../../../../public/img/rankingList/rocket.png'
        },
        {
          id: 2,
          uid: 112,
          avatar: '/icons/logo128.png',
          nickname: 'Edith Harvey',
          invite: 222,
          team: '铁匠铺',
          icon: '../../../../public/img/rankingList/handshake.png'
        },
        {
          id: 3,
          uid: 113,
          avatar: '/icons/logo128.png',
          nickname: 'Russell Morgan',
          invite: 111,
          team: '',
          icon: ''
        },
        {
          id: 4,
          uid: 114,
          avatar: '/icons/logo128.png',
          nickname: 'Edith Turner',
          invite: 34,
          team: '铁匠铺',
          icon: '../../../../public/img/rankingList/mantelpiece.png',
        },
        {
          id: 5,
          uid: 115,
          avatar: '/icons/logo128.png',
          nickname: 'Edith Turner',
          invite: 11,
          team: '铁匠铺',
          icon: '../../../../public/img/rankingList/mantelpiece.png',
        }
      ],
      // 我的邀请榜排行
      myInvite: {
        id: 7,
        uid: 111,
        avatar: '/icons/logo128.png',
        nickname: 'Victor Ruiz',
        invite: 99,
        team: '铁匠铺',
        icon: '../../../../public/img/rankingList/rocket.png'
      },
      // 签到榜
      signInList: [
        {
          id: 1,
          uid: 111,
          avatar: '/icons/logo128.png',
          nickname: 'Victor Ruiz',
          signInTime: '00:00',
          team: '铁匠铺',
          icon: '../../../../public/img/rankingList/rocket.png'
        },
        {
          id: 2,
          uid: 112,
          avatar: '/icons/logo128.png',
          nickname: 'Edith Harvey',
          signInTime: '00:01',
          team: '铁匠铺',
          icon: '../../../../public/img/rankingList/handshake.png'
        },
        {
          id: 3,
          uid: 113,
          avatar: '/icons/logo128.png',
          nickname: 'Russell Morgan',
          signInTime: '00:10',
          team: '',
          icon: ''
        },
        {
          id: 4,
          uid: 114,
          avatar: '/icons/logo128.png',
          nickname: 'Edith Turner',
          signInTime: '10:00',
          team: '铁匠铺',
          icon: '../../../../public/img/rankingList/mantelpiece.png',
        },
        {
          id: 5,
          uid: 115,
          avatar: '/icons/logo128.png',
          nickname: 'Edith Turner',
          signInTime: '12:00',
          team: '铁匠铺',
          icon: '../../../../public/img/rankingList/mantelpiece.png',
        }
      ],
      // 我的邀请榜排行
      mySignIn: {
        id: 5,
        uid: 111,
        avatar: '/icons/logo128.png',
        nickname: 'Victor Ruiz',
        signInTime: '12:00',
        team: '铁匠铺',
        icon: '../../../../public/img/rankingList/rocket.png'
      },
    }
  },
  methods: {
    ...mapActions(appStore,['showUserCard']),
    clickNav (item, index) {
      this.activeIndex = index
      item.state = false  // 将消息未读状态隐藏
      this.defaultNavList = item
    },
    showCard(uid){
      this.showUserCard(uid)
    },
  }
}
</script>

<style lang="scss" scoped>
 .page-container{
  margin: 0 12px;
  padding: 12px;
  position: relative;
  // width: 98%;
  height: 100%;
 }
  .scroll-list{
    height: 92%;
    overflow-y: auto;
    overflow-x: hidden;
    padding: 0 0 100px;
  }
  .scroll-list::-webkit-scrollbar{
    display: none;
  }
  .top-three-box{
    height: 320px;
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    // position: relative;
    .box-item{
      width: 178px;
      font-size: 16px;
      display: flex;
      flex-direction: column;
      align-items: center;
      .item-avatar{
        width: 178px;
        height: 178px;
        display: flex;
        justify-content: center;
        align-items: center;
      }
      .two-avatar{
        background-image: url(../../../../public/img/rankingList/silver.svg);
        background-repeat: no-repeat;
        background-position:center;
      }
      .three-avatar{
        background-image: url(../../../../public/img/rankingList/copper.svg);
        background-repeat: no-repeat;
        background-position:center;
      }
    }
    .one-box-item{
      width: 231px;
      font-size: 16px;
      display: flex;
      flex-direction: column;
      align-items: center;
      margin: 0 70px;
      .one-avatar{
        width: 231px;
        height: 231px;
        display: flex;
        justify-content: center;
        align-items: center;
        background-image: url(../../../../public/img/rankingList/metals.svg);
        background-size: 168px;
        background-repeat: no-repeat;
        background-position: center;
        .avatar-img{
          position: relative;
          top: 8px;
        }
      } 
    }
    .text-back{
      background: rgba(255,255,255,0.40);
      border-radius: 4px;
      width: 24px;
      height: 24px;
      text-align: center;
      display: inline-block;
      font-size: 14px;
      color: var(--secondary-text)
    }
  }
  .toggle-duration{
    position: absolute;
    right: 16px;
    top: 66px;
    z-index: 9;
  }
  .box{
    .box-head{
      margin-top: 20px;
      .head-col{
        text-align: center;
        font-size: 16px;
        color: var(--primary-text);
      }
    }
  }
  .box-list{
    width: 100%;
    height: 72px;
    margin: 12px 0 0;
    border-radius: 12px;
    display: flex;
    align-items: center;
    .box-col{
      display: flex;
      align-items: center;
      border-right: 1px solid var(--divider);
      height: 40px;
      font-size: 16px;
      color: var(--primary-text);
    }
    .box-col:last-child{
      border-right: none;
    }
    .ranking-back{
      height: 32px;
      padding: 0 10px;
      line-height: 32px;
      border-radius: 8px;
      text-align: center;
      background: var(--mask-bg);
      font-size: 18px;
      color: var(--primary-text);
      font-weight: 500;
      margin-left: 16px;
    }
  }
  .my-style{
    z-index: 99;
    position: absolute;
    bottom: 16px;
    width: 100%;
    padding-right: 24px;
  }
  .switch-data{
    margin: 12px 0 0;
    display: flex;
    justify-content: center;
    color: var(--primary-text);
    >div{
      background: var(--secondary-bg);
      display: flex;
      justify-content: center;
      align-items: center;
      border-radius: 8px;
      width: 160px;
      height: 48px;
    }
  }
  .select{
    width:200px;
    height:48px;
    color: var(--primary-text);
    background: var(--secondary-bg);
    border: 1px solid rgba(255, 255, 255, 0.1);
    font-size: 16px;
  }
  .min-back{
    background: rgba(255,255,255,0.40);
    color: var(--disable-text);
    border-radius: 4px;
    padding: 0 5px;
    font-size: 14px;
    color: var(--primary-text);
    font-weight: 400;
  }
  .captain{
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    background: var(--modal-bg);
    box-shadow: 0px 2px 4px 0px rgba(0,0,0,0.3);
    border-radius: 4px;
    font-family: PingFangSC-Semibold;
    font-size: 10px;
    color: var(-secondary-text);
    height: 16px;
    text-align: center;
    font-weight: 600;
  }
  // .box-list:nth-of-type(2) > .ranking-icon > div{
  //   background-image: url(../../../../public/img/rankingList/one.png);
  //   background-size: 32px;
  //   color: ;
  // }

  .box > .box-list:nth-child(2){
    background: rgba(254,44,70,0.4);
  }
  .box > .box-list:nth-child(3){
    background: rgba(255,102,0,0.4);
  }
  .box > .box-list:nth-child(4){
    background: rgba(153,103,10,0.4);
  }
  .select-item{
    background:var(--active-bg);
    color: var( --active-text) !important;
  }
</style>
