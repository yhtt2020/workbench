<template>
    <div>
        <Widget :customData="customData" :customIndex="customIndex"       :menuList="menuList" :options="options" ref="cardSlot" :desk="desk">
            <div class="icon">
                <Icon icon="solar:keyboard-bold" />
            </div>
            
            <div v-show="!isFlag" class="topList">
            <div class="card-app" @click="onChangeCard(1)">
                <img src="" alt="">
                <div class="title-text">Adobe PSs44d56a4sas4a6das</div>
                <div class="right-box">
                    <div class="num">92</div>
                    <div class="title-key">快捷键</div>
                </div>
            </div>
            <div class="card-app" @click="onChangeCard(2)">
                <img src="" alt="">
                <div class="title-text">Adobe PSs44d56a4sas4a6das</div>
                <div class="right-box">
                    <div class="num">92</div>
                    <div class="title-key">快捷键</div>
                </div>
            </div>
            <div class="card-app">
                <img src="" alt="">
                <div class="title-text">Adobe PSs44d56a4sas4a6das</div>
                <div class="right-box">
                    <div class="num">92</div>
                    <div class="title-key">快捷键</div>
                </div>
            </div>
            <div class="card-app">
                <img src="" alt="">
                <div class="title-text">Adobe PSs44d56a4sas4a6das</div>
                <div class="right-box">
                    <div class="num">92</div>
                    <div class="title-key">快捷键</div>
                </div>
            </div>
            <div class="card-app">
                <img src="" alt="">
                <div class="title-text">Adobe PSs44d56a4sas4a6das</div>
                <div class="right-box">
                    <div class="num">92</div>
                    <div class="title-key">快捷键</div>
                </div>
            </div>
            <div class="card-app">
                <img src="" alt="">
                <div class="title-text">Adobe PSs44d56a4sas4a6das</div>
                <div class="right-box">
                    <div class="num">92</div>
                    <div class="title-key">快捷键</div>
                </div>
            </div>

        
            <div class="button-bom">
            <!-- shan   @click="this.isFlag = !this.isFlag"  -->
            <div class="p-firse">
                <!-- <icon></icon> -->
                更多快捷键
            </div>
            <div class="p-second">
                <icon></icon>搜索
            </div>
        </div>

        

        </div>

        <div class="topList"  v-show="isFlag"  >
            <!-- shan @click="onBack" -->
            <div class="p-firse" :class="topBar">
                <div class="name-img">
                    <img src="" alt="">
                    <span>Adobe Lightroom</span>
                </div>
                <div class="page-change">
                    <left-outlined />
                    <right-outlined />
                </div>
            </div>
            <div class="key-body">
                <div class="key-name" >常用</div>
                <div class="key-flex">
                    <div class="key-item">
                        <span>Space</span>
                        <span>H</span>
                        <span>3</span>
                    </div>
                    <div class="key-title">首选项sfasfafdfgsdfsfdfs</div>
                </div>
                <div class="key-flex">
                    <div class="key-item">
                        <span>Space</span>
                    </div>
                    <div class="key-title">首选项sfasfafdfgsdfsfdfs</div>
                </div>
                <div class="key-flex">
                    <div class="key-item">
                        <span>Space</span>
                        <span>H</span>
                        <span>3</span>
                    </div>
                    <div class="key-title">首选项</div>
                </div>
                <div class="key-flex">
                    <div class="key-item">
                        <span>Space</span>
                        <span>H</span>
                        <span>3</span>
                    </div>
                    <div class="key-title">首选项</div>
                </div>
                <div class="key-flex">
                    <div class="key-item">
                        <span>Space</span>
                        <span>H</span>
                        <span>3</span>
                    </div>
                    <div class="key-title">首选项</div>
                </div>
                <div class="key-flex">
                    <div class="key-item">
                        <span>Space</span>
                        <span>H</span>
                        <span>3</span>
                    </div>
                    <div class="key-title">首选项</div>
                </div>
                <div class="key-flex">
                    <div class="key-item">
                        <span>Space</span>
                        <span>H</span>
                        <span>3</span>
                    </div>
                    <div class="key-title">首选项</div>
                </div>
                <div class="key-flex">
                    <div class="key-item">
                        <span>Space</span>
                        <span>H</span>
                        <span>3</span>
                    </div>
                    <div class="key-title">首选项</div>
                </div>
                <div class="key-flex">
                    <div class="key-item">
                        <span>Space</span>
                        <span>H</span>
                        <span>3</span>
                    </div>
                    <div class="key-title">首选项</div>
                </div>
                
                <div class="key-name" >常用</div>
                <div class="key-flex">
                    <div class="key-item">
                        <span>Space</span>
                        <span>H</span>
                        <span>3</span>
                    </div>
                    <div class="key-title">首选项</div>
                </div>
                <div class="key-flex">
                    <div class="key-item">
                        <span>Space</span>
                        <span>H</span>
                        <span>3</span>
                    </div>
                    <div class="key-title">首选项</div>
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
        <RadioTab :navList="dataType" v-model:selectType="defaultType" @click="onChangeList(selectType)"></RadioTab>
        <div v-if="defaultType.name == 'thisList'">
            <p style="margin-top: 14px;">选择快捷键方案</p>
            <a-select :style="selectStyle" style="width: 100%;"
                class="select rounded-lg  text-xs flex items-center" size="large" :bordered="false"
                v-model:value="selectValue" 
                @change="onChangeShortcutKey(selectValue)"
                placeholder="请选择">
                <a-select-option class="no-drag" v-for="item in sortType" :value="item.value" :key="item">{{item.name}}
                </a-select-option>
            </a-select>
        </div>
      </vue-custom-scrollbar>

    </a-drawer>
    
</template>
  
<script>
import axios from "axios";
import Widget from "../../card/Widget.vue";
import { Icon } from '@iconify/vue';
import RadioTab from "../../RadioTab.vue"
import { defineComponent } from 'vue';
import { LeftOutlined, RightOutlined } from '@ant-design/icons-vue';


// import BottomEdit from "..";
export default {
    components:{
        Widget,
        Icon,
        RadioTab,
        LeftOutlined,
        RightOutlined
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
            settingVisible: false,
            selectValue: '请选择',
            // 选择快捷键方案
            sortType: [
                { name: 'Adobe PS', value: 'Adobe PS' },
                { name: 'Adobe AI', value: 'Adobe AI' },
                { name: 'Adobe PR', value: 'Adobe PR' },
                { name: 'Adobe AX', value: 'Adobe AX' },
            ],
            // 需要在小组件显示的数据
            dataType: [
                { title: '最近使用列表', name: 'useList' },
                { title: '指定快捷键详情', name: 'thisList' }
            ],
            defaultType: { title: '最近使用列表', name: 'useList' },
            options: {
                className: "card double",
                title: "快捷键",
            },
            dataList:[],
            menuList: [
                {
                    icon: 'shezhi1',
                    title: '设置',
                    fn: () => { 
                        this.settingVisible = true; 
                        this.$refs.cardSlot.visible = false 
                    }
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
        },
        // 查看切换的应用
        onChangeShortcutKey(key){
            // console.log("xuanzel;e")
            // console.log(key)
        },
        // 切换卡片类型 目前还有点问题 找不到触发事件
        onChangeList(selectType){
            // console.log("selectType",selectType)

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

    .card-app{
        float: left;
        // border: 1px solid #fff;
        width: 265px;
        height: 88px;
        margin-top: 14px;
        background: rgba(0,0,0,0.30);
        border-radius: 12px;
    }
    .card-app:nth-last-of-type(2n){
        margin-right: 14px;
    }
    .card-app img{
        width: 56px;
        height: 56px;
        float: left;
        margin: 16px;
    }
    
    .title-text{
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

    .right-box{
        float: left;
        width: 42px;
        height: 60px;
        margin-left: 32px;
        margin-top: 5px;
    }

    .right-box .num{
        font-family: 'Oswald';
        font-size: 28px;
        opacity: 0.85;
        text-align: center;
    }

    .right-box .title-key{
        font-family: 'PingFang SC';
        width: 42px;
        height: 20px;
        font-size: 14px;
        opacity: 0.6;
    }

    .button-bom{
        font-family: PingFangSC-Regular;
        font-size: 16px;
        color: rgba(255,255,255,0.85);
        text-align: center;
        font-weight: 400;
        line-height: 44px;
    }
    .button-bom .p-firse{
        width: 266px;
        height: 44px;
        float: left;
        background: rgba(0,0,0,0.30);
        border-radius: 12px;
        margin-top: 16px;
    }
    
    .name-img{
        float: left;
        line-height: 44px;
    }
    
    .name-img img{
        line-height: 44px;
        margin-right: 10px;
        width: 32px;
        height: 32px;
    }
    
    .name-img span{
        margin-right: 10px;
        font-family: PingFangSC-Regular;
        font-size: 16px;
        color: rgba(255, 255, 255, 0.85);
    }


    .button-bom .p-second{
        width: 266px;
        height: 44px;
        float: left;
        background: rgba(0,0,0,0.30);
        border-radius: 12px;
        margin-left: 12px;
        margin-top: 16px;
    }


    .page-change{
       width: 100%; 
    //    border: 1px solid #fff;
       text-align: right;
       margin-top: 10px;
    }

    .page-change span{
        display: inline-block;
        width: 44px;
        height: 44px;
        font-size: 20px;
        line-height: 47px;
        text-align: center;
        background-color: rgba(0,0,0,0.3);
        color: rgba(255,255,255,0.85);
        border-radius: 8px;
        margin-left: 10px;
    }
    i:hover{
        color: rgba(255,255,255,1);

    }

    .key-body{
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

    .key-body>div{
        width: 240px;
        height: 32px;
        margin: 0 16px 18px 20px;
    }

    .key-flex{
        display: flex;
        line-height: 32px;
    }
    .key-name{
        font-size: 16px;
        font-family: PingFangSC-Regular;
        color: rgba(255,255,255,0.85);
        font-weight: 400;
        line-height: 32px;
        padding: 5px;
    }

    // .key-item{
    //     // display: flex;
    // }

    .key-title{
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


    .key-flex span{
        width: 32px;
        height: 32px;
        background: rgba(0,0,0,0.30);
        border-radius: 8px;
        padding: 5px 8px;
        font-size: 16px;
        margin-right: 8px;
    }
</style>
  