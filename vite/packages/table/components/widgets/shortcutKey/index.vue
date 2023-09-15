<template>
    <div>
        <Widget :customData="customData" :customIndex="customIndex"       :menuList="menuList" :options="options" ref="homelSlotRef" :desk="desk">
            <div class="icon">
                <Icon icon="solar:keyboard-bold" />
            </div>
            
            <div v-show="!isFlag" class="topList">
            <div class="cardApp" @click="onChangeCard(1)">
                <img src="" alt="">
                <div class="titleText">Adobe PSs44d56a4sas4a6das</div>
                <div class="rightBox">
                    <div class="num">92</div>
                    <div class="titleKey">快捷键</div>
                </div>
            </div>
            <div class="cardApp" @click="onChangeCard(2)">
                <img src="" alt="">
                <div class="titleText">Adobe PSs44d56a4sas4a6das</div>
                <div class="rightBox">
                    <div class="num">92</div>
                    <div class="titleKey">快捷键</div>
                </div>
            </div>
            <div class="cardApp">
                <img src="" alt="">
                <div class="titleText">Adobe PSs44d56a4sas4a6das</div>
                <div class="rightBox">
                    <div class="num">92</div>
                    <div class="titleKey">快捷键</div>
                </div>
            </div>
            <div class="cardApp">
                <img src="" alt="">
                <div class="titleText">Adobe PSs44d56a4sas4a6das</div>
                <div class="rightBox">
                    <div class="num">92</div>
                    <div class="titleKey">快捷键</div>
                </div>
            </div>
            <div class="cardApp">
                <img src="" alt="">
                <div class="titleText">Adobe PSs44d56a4sas4a6das</div>
                <div class="rightBox">
                    <div class="num">92</div>
                    <div class="titleKey">快捷键</div>
                </div>
            </div>
            <div class="cardApp">
                <img src="" alt="">
                <div class="titleText">Adobe PSs44d56a4sas4a6das</div>
                <div class="rightBox">
                    <div class="num">92</div>
                    <div class="titleKey">快捷键</div>
                </div>
            </div>

        
            <div class="buttonBom">
            <!-- shan -->
            <div class="pFirse"  @click="this.isFlag = !this.isFlag" >
                <icon></icon>更多快捷键
            </div>
            <div class="pSecond">
                <icon></icon>搜索
            </div>
        </div>

        

        </div>

        <div class="topList"  v-show="isFlag"  >
            <!-- shan -->
            <div class="pFirse" @click="onBack" :class="topBar">
                <div class="nameImg">
                    <img src="" alt="">
                    <span>Adobe Lightroom</span>
                </div>
                <div class="pageChange">
                    <i>&lt;</i>
                    <i>&gt;</i>
                </div>
            </div>
            <div class="keyBody">
                <div class="keyName" >常用</div>
                <div class="keyFlex">
                    <div class="keyItem">
                        <span>Space</span>
                        <span>H</span>
                        <span>3</span>
                    </div>
                    <div class="keyTitle">首选项sfasfafdfgsdfsfdfs</div>
                </div>
                <div class="keyFlex">
                    <div class="keyItem">
                        <span>Space</span>
                    </div>
                    <div class="keyTitle">首选项sfasfafdfgsdfsfdfs</div>
                </div>
                <div class="keyFlex">
                    <div class="keyItem">
                        <span>Space</span>
                        <span>H</span>
                        <span>3</span>
                    </div>
                    <div class="keyTitle">首选项</div>
                </div>
                <div class="keyFlex">
                    <div class="keyItem">
                        <span>Space</span>
                        <span>H</span>
                        <span>3</span>
                    </div>
                    <div class="keyTitle">首选项</div>
                </div>
                <div class="keyFlex">
                    <div class="keyItem">
                        <span>Space</span>
                        <span>H</span>
                        <span>3</span>
                    </div>
                    <div class="keyTitle">首选项</div>
                </div>
                <div class="keyFlex">
                    <div class="keyItem">
                        <span>Space</span>
                        <span>H</span>
                        <span>3</span>
                    </div>
                    <div class="keyTitle">首选项</div>
                </div>
                <div class="keyFlex">
                    <div class="keyItem">
                        <span>Space</span>
                        <span>H</span>
                        <span>3</span>
                    </div>
                    <div class="keyTitle">首选项</div>
                </div>
                <div class="keyFlex">
                    <div class="keyItem">
                        <span>Space</span>
                        <span>H</span>
                        <span>3</span>
                    </div>
                    <div class="keyTitle">首选项</div>
                </div>
                <div class="keyFlex">
                    <div class="keyItem">
                        <span>Space</span>
                        <span>H</span>
                        <span>3</span>
                    </div>
                    <div class="keyTitle">首选项</div>
                </div>
                
                <div class="keyName" >常用</div>
                <div class="keyFlex">
                    <div class="keyItem">
                        <span>Space</span>
                        <span>H</span>
                        <span>3</span>
                    </div>
                    <div class="keyTitle">首选项</div>
                </div>
                <div class="keyFlex">
                    <div class="keyItem">
                        <span>Space</span>
                        <span>H</span>
                        <span>3</span>
                    </div>
                    <div class="keyTitle">首选项</div>
                </div>
            </div>



        </div>


        </Widget>
    </div>
    <!-- 设置面板 -->
    <a-drawer :width="500" title="设置" v-model:visible="settingVisible" placement="right">
      <vue-custom-scrollbar :settings="settingsScroller" style="height: 100%;">
        <!-- <div class="primary-title" style="color: var(--primary-text);">选择地区</div>
        <div class="flex items-center justify-center w-full h-12 my-4 rounded-lg pointer s-list" v-for="(item) in city"
          :class="defaultCityIndex === item.id ? 'drawer-active' : ''" @click="selectedAreaSuit(item)">
          21324154165
        </div> -->
        <p>需要在小组件内显示的数据</p>
        <RadioTab :navList="dataType" v-model:selectType="defaultType"></RadioTab>
        <p>需要在小组件内显示的数据</p>
        <!-- <div class="btn-list">
            <div class="btn-l">
                <i></i>
                <span>最近使用列表</span>
            </div>
            <div class="btn-r">
                <i></i>
                <span>指定快捷键详情</span>
            </div>
        </div> -->
      </vue-custom-scrollbar>

    </a-drawer>
    
</template>
  
<script>
import axios from "axios";
import Widget from "../../card/Widget.vue";
import { Icon } from '@iconify/vue';
import RadioTab from "../../RadioTab.vue"

// import BottomEdit from "..";
export default {
    components:{
        Widget,
        Icon,
        RadioTab
    },

    props: {
        customIndex: {
            type: Number,
            default: 0,
        },
        customData: {
            type: Object,
            default: () => { },
        },
        menuList: {
            type: Array,
        },
        desk: {
            type: Object,
        },
        editing: {
            type: Boolean,
        },
    },
    data() {
        return {
            dataType: [
                { title: '最近使用列表', name: 'useList' },
                { title: '指定快捷键详情', name: 'thisList' }
            ],
            defaultType: { title: '最近使用列表', name: 'useList' },
            settingVisible: false,
            options: {
                className: "card double",
                title: "快捷键",
                // icon: "solar:keyboard-bold",
                // icon: "shezhi1",
                // icon: "iconamoon:history-fill",
                // icon: "games-16-filled",
            },
            dataList:[
                
            ],
            menuList: [
                {
                    icon: 'shezhi1',
                    title: '设置',
                    fn: () => { this.settingVisible = true; this.$refs.cardSlot.visible = false }
                },
            ],
            
            isFlag:true,
            // types:"123",
            keyList:[
                {
                    name:"常用",
                    key:[
                        {
                            keyc:["Space","H","3"],
                            keyName:"首选项"
                        },
                        {
                            keyc:["Space","H","3"],
                            keyName:"首选项"
                        }
                    ]
                },
                {
                    name:"文件",
                    key:[
                        {
                            keyc:["Space","H","3"],
                            keyName:"首选项"
                        },
                        {
                            keyc:["Space","H","3"],
                            keyName:"首选项"
                        }
                    ]
                }
            ],
            
        };
    },
    async mounted() {

    },
    methods:{

        // 切换卡片进入快捷键
        // shan
        onChangeCard(){
            this.isFlag = !this.isFlag
        },
        onBack(){
            this.isFlag = !this.isFlag
        }
    }
};
</script>
  
<style lang="scss" scoped>

    .icon{
        width: 24px;
        height: 24px;
        // border: 1px solid #fff;
        position: absolute;
        top: 15px;
        left: 15px;
    }
    .icon svg{
        width: 24px;
        height: 24px;
    }

    .cardApp{
        float: left;
        // border: 1px solid #fff;
        width: 265px;
        height: 88px;
        margin-top: 14px;
        background: rgba(0,0,0,0.30);
        border-radius: 12px;
    }
    .cardApp:nth-last-of-type(2n){
        margin-right: 14px;
    }
    .cardApp img{
        width: 56px;
        height: 56px;
        float: left;
        margin: 16px;
    }
    
    .titleText{
        font-family: 'PingFang SC';
        float: left;
        width: 88px;
        height: 50px;
        font-size: 18px;
        opacity: 0.85;
        margin-top: 19px;
        font-weight: 500;
        word-wrap: break-word;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space:pre-wrap;
        display: -webkit-box;
        -webkit-box-orient: vertical;
        -webkit-line-clamp: 2;
    }

    .rightBox{
        float: left;
        width: 42px;
        height: 60px;
        margin-left: 32px;
        margin-top: 5px;
    }

    .rightBox .num{
        font-family: 'Oswald';
        font-size: 28px;
        opacity: 0.85;
        text-align: center;
    }

    .rightBox .titleKey{
        font-family: 'PingFang SC';
        width: 42px;
        height: 20px;
        font-size: 14px;
        opacity: 0.6;
    }

    .buttonBom{
        font-family: PingFangSC-Regular;
        font-size: 16px;
        color: rgba(255,255,255,0.85);
        text-align: center;
        font-weight: 400;
        line-height: 44px;
    }
    .buttonBom .pFirse{
        width: 266px;
        height: 44px;
        float: left;
        background: rgba(0,0,0,0.30);
        border-radius: 12px;
        margin-top: 16px;
    }
    
    .nameImg{
        float: left;
        line-height: 44px;
    }
    
    .nameImg img{
        line-height: 44px;
        margin-right: 10px;
        width: 32px;
        height: 32px;
    }
    
    .nameImg span{
        margin-right: 10px;
        font-family: PingFangSC-Regular;
        font-size: 16px;
        color: rgba(255, 255, 255, 0.85);
    }


    .buttonBom .pSecond{
        width: 266px;
        height: 44px;
        float: left;
        background: rgba(0,0,0,0.30);
        border-radius: 12px;
        margin-left: 12px;
        margin-top: 16px;
    }


    .pageChange{
       width: 100%; 
    //    border: 1px solid #fff;
       text-align: right;
       margin-top: 10px;
    }

    .pageChange i{
        display: inline-block;
        width: 44px;
        height: 44px;
        font-size: 20px;
        line-height: 34px;
        text-align: center;
        background-color: rgba(0,0,0,0.3);
        color: rgba(255,255,255,0.85);
        border-radius: 8px;
        margin-left: 10px;
    }
    i:hover{
        color: rgba(255,255,255,1);

    }

    .keyBody{
        margin-top: 10px;
        width: 544px;
        overflow: hidden;
        // border: 1px solid #fff;
        display: flex;
        flex-wrap: wrap;
        align-content: flex-start;
        flex-direction: column;
        height: 330px;
        color: rgba(255,255,255,0.85);

    }

    .keyBody>div{
        width: 240px;
        height: 32px;
        margin: 0 16px 18px 20px;
    }

    .keyFlex{
        display: flex;
        line-height: 32px;
    }
    .keyName{
        font-size: 16px;
        font-family: PingFangSC-Regular;
        color: rgba(255,255,255,0.85);
        font-weight: 400;
        line-height: 32px;
        padding: 5px;
    }

    .keyItem{
        // display: flex;
    }

    .keyTitle{
        text-align: right;
        flex: 1;
        font-family: PingFangSC-Regular;
        font-size: 16px;
        color: rgba(255,255,255,0.85);
        text-align: right;
        font-weight: 400;
        overflow: hidden;
        text-overflow: ellipsis;
    }


    .keyFlex span{
        width: 32px;
        height: 32px;
        background: rgba(0,0,0,0.30);
        border-radius: 8px;
        padding: 5px 8px;
        font-size: 16px;
        margin-right: 8px;
    }
</style>
  