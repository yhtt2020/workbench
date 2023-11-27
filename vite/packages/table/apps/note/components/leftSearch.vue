<template>
    <div class="flex flex-col justify-between h-full xt-br mr-3">
      <div class="h-full flex" style="max-width: 308px;flex-direction: column;" >
        <!-- class="xt-scrollbar" -->
        <div class="flex w-full pr-3 mb-4" style="height: 40px;">
            <a-input
                style="height:40px;background: var(--mask-bg);
                color: var(--primary-text);
                border: 1px solid rgba(255,255,255,0.1);flex:1;
                border-radius: 10px;"
                placeholder="搜索"
                maxlength="10"
                v-model:value="this.searchValue"
                @change="this.searchNote(this.searchValue)"
            ><Icon :icon="icons.search20Filled" /></a-input>
            <xt-button class="flex justify-center items-center ml-3" :w="40" :h="40"  style="background:var(--mask-bg);border-radius: 10px;" @click="addNote">
            <Icon :icon="icons.add16Filled" class="flex items-center" width="20" height="20"/>
          </xt-button>
        </div>
        <div 
        class=" xt-scrollbar h-full scroll-color pr-3" 
        style="width: 306px;"
        >
            <!-- <div @click="this.dbClear">清除数据</div>
            <div @click="showData">目前数据</div>
            <div @click="showDesk">桌面数据</div>
            <div @click="this.findAll">db数据</div> -->
            <xt-menu  ref="menu" :menus="menus" v-for="(item,index) in this.noteList"  @mounted="changeMenu(index)" 
            >
                <div @click="changeNote(index)" style="min-width: 296px;;border-radius: 10px;padding: 12px;"
                class="note-box w-full"
                :class="index == this.selNote?'note-active':''">
                    <div class="flex list-top font-16" style="color: var(--primary-text);justify-content: space-between;">
                        <div class="flex items-center">
                            <span  :style="{background:item.hasOwnProperty('customData')?item.customData.background:''}"></span>
                            <div class="ml-2">{{ item.hasOwnProperty('customData')?item.customData.title:'' }}</div>
                        </div>
                        <!-- 菜单 -->
                        <xt-menu @mounted="changeMenu(index)" :menus="menus" model="click">
                            <div class="flex items-center pointer note-menu">
                                <Icon icon="fluent:more-horizontal-16-filled" width="20" height="20" />
                            </div>
                        </xt-menu>
                    </div>
                    <div class="mt-2 w-full two-hidden" style="min-height:22px;color: var(--secondary-text);font-size: 16px;word-wrap: break-word;">
                        {{ item.hasOwnProperty('customData')?item.customData.content:'' }}
                    </div>
                    <div class="bottom mt-3" style="color: var(--secondary-text);font-size: 14px;">
                        {{ formatTimestamp(item.id)  }}
                        <!-- {{ time }} -->
                        {{ item.deskName!=''?' · '+item.deskName:'' }}
                    </div>
                </div>
            </xt-menu>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  import { Icon } from '@iconify/vue';
  import add16Filled from '@iconify-icons/fluent/add-16-filled';
  import search20Filled from '@iconify-icons/fluent/search-20-filled';
  import {mapActions, mapState,mapWritableState} from "pinia";
  import { noteStore } from '../store'
  import { formatTimestamp, formatTime } from '../../../util'
import { cardStore } from "../../../store/card";
import { message } from 'ant-design-vue';

  export default {
    components: {
        Icon,
    },
    props:['selDesk'],
    data() {
      return {  
			icons: {
				add16Filled,
				search20Filled,
			},
            menus:[
                // { 
                //     label: "小窗模式", 
                //     // callBack: this.callBack, 
                //     newIcon: "fluent:window-multiple-16-filled",
                // },
                { 
                    // label: this.isSelTab?'添加到桌面':'还原', 
                    label: "添加到桌面", 
                    callBack: ()=>{
                        // 修改当前选中桌面
                        if (!this.isSelTab) {
                            // 添加到桌面
                            this.selDesk()
                        }else{
                            // 还原
                            this.restore()
                        }
                    }, 
                    newIcon: "fluent:open-20-filled",
                },
                { 
                    label: "跳转到桌面", 
                    newIcon: "majesticons:monitor-line",
                    callBack:()=>{
                        if (this.noteList[this.selNote].deskName) {
                            this.deskList.forEach((item,index)=>{
                                if (this.noteList[this.selNote].deskId == item.id) {
                                    this.currentDeskId = item.id
                                    this.$router.push({
                                        name:'home',
                                    })
                                }
                            })
                        }else{
                            if (this.isSelTab) {
                                message.error('该便签已被删除')
                            }else{
                                message.error('请先添加桌面')
                            }
                        }
                    }
                },
                { 
                    // name:"删除便签",
                    label: "删除便签", 
                    newIcon: "akar-icons:trash-can",
                    color:'#FF4D4F',
                    callBack:()=>{
                        if (!this.isSelTab) {
                            // 删除
                            this.moveToTrash()
                        }else{
                            // 彻底删除
                            this.deleteNote()

                        }
                    }
                },
            ]
      };
    },
    computed: {
        ...mapWritableState(noteStore, ['noteList','selNote','selNoteTitle','selNoteText','isSelTab','searchValue','deskList']),
        ...mapWritableState(cardStore, ['currentDeskIndex','currentDeskId']),
        // time(item) {
        //     let timestamp = item.updateTime // 假设您已经获取了时间戳
        //     if (timestamp == undefined) {
        //       timestamp = item.createTime
        //     }
        //     return formatTime(timestamp)
        // },
    },
    mounted() {
    },
    watch: {
        isSelTab(newval,oldval){
            if (newval) {
                this.menus[0].label = '还原'
                this.menus[2].label = '彻底删除'
            }else{
                this.menus[0].label = '添加到桌面'
                this.menus[2].label = '删除便签'
            }
        }
    },
    methods: {
        ...mapActions(noteStore,['moveToTrash','dbClear','addNote','restore','searchNote','findAll','deleteNote']),
        ...mapActions(cardStore, ['switchToDesk','setRouteParams']),
        formatTimestamp,
        changeNote(n){
            this.selNote = n
            this.selNoteTitle = this.noteList[n].customData.title
            this.selNoteText = this.noteList[n].customData.text
            
        },
        showData(){
            console.log(this.noteList);
        },
        showDesk(){
            console.log(this.deskList);
        },
        changeMenu(index){
            this.selNote = index
        },
    },
  };
  </script>
  
  <style lang="scss" scoped>
    .note-active{
        background: rgba(80,139,254,0.20);
    }

    .list-top span{
        display: flex;
        width: 20px;
        height: 20px;
        box-shadow: 0px 0px 20px 0px rgba(0,0,0,0.2);
        border-radius: 6px;
    }

    .two-hidden{
        display: -webkit-box;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
        text-overflow: ellipsis;
        overflow: hidden;
    }

    .note-box .note-menu{
        display: none;
    }
    .note-box:hover .note-menu{
        display: flex;
    }
    .scroll-color::-webkit-scrollbar-thumb {
        background-color: #ccc; /* 滚动条颜色 */
        border-radius: 6px; /* 滚动条圆角 */
    }
    
    .scroll-color::-webkit-scrollbar-thumb:hover {
        background-color: #999; /* 悬停时滚动条颜色 */
    }

    .scroll-color::-webkit-scrollbar-track {
        border-radius: 6px; /* 轨道圆角 */
    }

    :deep(.ant-dropdown-menu-item:hover, .ant-dropdown-menu-submenu-title:hover){
        background-color: var(--active-secondary-bg);
    }
</style>
  