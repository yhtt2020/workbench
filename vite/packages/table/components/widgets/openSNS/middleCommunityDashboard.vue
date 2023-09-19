<template>

    <Widget @click="onHistoryMessage" :customData="customData" :customIndex="customIndex" :menuList="menuList" :options="options" ref="dataSlot" :desk="desk" >
        <div class="top-icon">
            <Icon icon="majesticons:monitor-line" />
        </div>
        <div class="dash-board">
            <div class="dash-cell pointer" v-for="(item,index) in dataList" :key="index">
                <div class="cell-title">{{ item.title }}</div>
                <div class="cell-num">{{ item.num }}</div>
            </div>
        </div>
        
        <!-- 设置面板 -->
        <a-drawer :width="500" title="设置" v-model:visible="settingVisible" placement="right">
            <template #extra>
                <a-button class="top-btn" type="primary" @click="setVisible = !setVisible">保存</a-button>
            </template>
            <vue-custom-scrollbar :settings="settingsScroller" style="height: 100%;">
                <div v-show="!setVisible">
                    <div class="text-content">
                        <div>关联短说社区系统</div>
                        <div>在使用该功能前，需要关联您的短说社区系统，请在短说管理后台获取系统密钥，填入下方输入框，以及您的管理后台地址，成功完成配置后即可使用。</div>
                        <div>在想天浏览器中打开短说管理后台，可以自动检测获取密钥。</div>
                    </div>
                    <p class="ml-1 mt-1">密钥</p>
                    <a-input style="border-radius: 10px;" v-model:value="this.secKey" placeholder="请输入" class="search pl-1 input-txt"></a-input>
                    <p class="ml-1">管理后台地址</p>
                    <a-input style="border-radius: 10px;" v-model:value="this.secAdd" placeholder="请输入" class="search pl-1 input-txt"></a-input>
                </div>
                <div v-show="setVisible">
                    <div class="text-title">
                        关联短说社区系统
                        <span>已关联 ></span>
                    </div>
                    <div class="text-content">
                        <div>设置小组件数据</div>
                        <div>4*4尺寸的小组件可以选择9个数据，2*4的小组件可以选择六个数据，
                            每个小组件的数据都是独立的，你可以为小组件去不同的名字，自由组合不同的数据维度的小组件看板</div>
                    </div>
                    <p>小组件名称</p>
                    <p>
                        <a-input style="border-radius: 10px;" v-model:value="this.options.title" class="search pl-1" maxlength="20"></a-input>
                    </p>
                    <p>选择统计数值</p>
                    <div class="transfer">
                        <a-transfer
                        v-model:target-keys="targetKeys"
                        :data-source="mockData"
                        :show-select-all="false"
                        @change="handleChange">
                        <template #render="item">
                            <span class="custom-item" >{{ item.title }}</span>
                        </template>
                        </a-transfer>
                    </div>
                </div>
                

            </vue-custom-scrollbar>
        </a-drawer>

    </Widget>


</template>
  
<script>
import Widget from "../../card/Widget.vue";
import { Icon } from '@iconify/vue';
import { defineComponent } from 'vue';
export default {
    components:{
        Widget,
        Icon,
        defineComponent,
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
            setVisible: true,
            // 密钥和地址
            secKey:"",
            secAdd:"",
            menuList: [
                {
                    icon: 'shezhi1',
                    title: '设置',
                    fn: () => { 
                        this.settingVisible = true; 
                        this.$refs.dataSlot.visible = false 
                    }
                },
            ],
            options: {
                className: "card double",
                title: "社区数据",
                // icon: "bianji",
                // icon: "shezhi1",
                icon: "iconamoon:history-fill",
                rightIcon:"fluent:open-20-filled",
                // icon: "games-16-filled",
            },
            dataList:[
                {
                    title:"今日访问",
                    num:"123"
                },
                {
                    title:"今日访问",
                    num:"123"
                },
                {
                    title:"今日访问",
                    num:"123"
                },
                {
                    title:"今日访问",
                    num:"123"
                },
                {
                    title:"今日访问",
                    num:"123"
                },
                {
                    title:"今日访问",
                    num:"123"
                },
                {
                    title:"今日访问",
                    num:"123"
                },
                {
                    title:"今日访问",
                    num:"123"
                },
                {
                    title:"今日访问",
                    num:"123"
                },
            ],
            menuList: [
                {
                    icon: 'shezhi1',
                    title: '设置',
                    fn: () => { 
                        this.settingVisible = true; 
                        this.$refs.dataSlot.visible = false 
                    }
                },
            ],
            mockData:[
                {
                    key: 1,
                    title: "总访问",
                },
                {
                    key: 2,
                    title: "本周发布",
                },
                {
                    key: 3,
                    title: "本月发布",
                },
                {
                    key: 4,
                    title: "我是标题",
                },
                {
                    key: 5,
                    title: "我是标题",
                },
                {
                    key: 6,
                    title: "我是标题",
                },
                {
                    key: 7,
                    title: "总访问",
                },
                {
                    key: 8,
                    title: "本周发布",
                },
                {
                    key: 9,
                    title: "本月发布",
                },
                {
                    key: 10,
                    title: "我是标题",
                },
                {
                    key: 11,
                    title: "我是标题",
                },
                {
                    key: 12,
                    title: "我是标题",
                },
                {
                    key: 13,
                    title: "我是标题",
                },
                {
                    key: 14,
                    title: "我是标题",
                },
                {
                    key: 15,
                    title: "我是标题",
                },
                {
                    key: 16,
                    title: "总访问",
                },
                {
                    key: 17,
                    title: "本周发布",
                },
                {
                    key: 18,
                    title: "本月发布",
                },
                {
                    key: 19,
                    title: "我是标题",
                },
                {
                    key: 20,
                    title: "我是标题",
                },
                {
                    key: 21,
                    title: "我是标题",
                },

            ],
            targetKeys:[5,6],
        };
    },
    async mounted() {

    },
    methods:{

    }
};
</script>
  
<style lang="scss" scoped>
    .top-icon{
        position: absolute;
        top:17px;
    }
    .top-icon svg{
        width:20px;
        height:20px;
    }
    .dash-board{
        display: flex;
        text-align: center;
        flex-wrap: wrap;
        position: relative;
        top: -3px;
        justify-content: space-between;
    }

    .dash-cell{
        width: 173px;
        height: 112px;
        background: rgba(0,0,0,0.30);
        border-radius: 10px;
        margin-top: 12px;
    }


    .dash-cell .cell-title{
        font-family: PingFangSC-Regular;
        font-size: 16px;
        color: rgba(255,255,255,0.60);
        font-weight: 400;
        margin-top: 23px;
    }
    .dash-cell .cell-num{
        margin-top: 11px;
        font-family: Oswald-Medium;
        font-size: 24px;
        color: rgba(255,255,255,0.85);
        font-weight: 500;
    }
    .transfer ul{
        border-radius: 10px !important;
    }
    // .transfer .ant-transfer-list{
    //     border-radius: 10px !important;
        
    //     width: 194px;
    //     height: 656px;
    // }
    // .transfer>div{
    //     border-radius: 10px !important;
        
    // }
    
    :deep(.ant-transfer-list){
        border-radius: 3px !important;
        max-height: 564px;
        width: 194px !important;
        height: 656px !important;
        
    }
    :deep(.ant-btn-icon-only.ant-btn-sm){
        width: 40px;
        height: 40px;
        border-radius: 3px;
        margin-top: 8px;
    }

    :deep(.ant-transfer-list-content-item){
        height: 48px;
    }

    // :deep(.ant-transfer-list-content-item):active {
    //     // background: #212121;
    // }
    :deep(.ant-checkbox-wrapper){
        margin-left: 5px;
    }
    :deep(.ant-transfer-list-content-item-text){
        margin-left: 5px;
        font-family: PingFangSC-Regular;
        font-size: 16px;
        color: rgba(255,255,255,0.85);
    }
    
    .text-content{
        width: 100%;
        min-height: 124px;
        background: #2A2A2A;
        border-radius: 12px;
        padding: 10px 16px;
        font-family: PingFangSC-Regular;
        font-size: 14px;
        color: rgba(255,255,255,0.60);
        font-weight: 400;
        margin-bottom: 10px;
    }
    .text-content div:nth-of-type(1){
        font-size: 16px;
        color: rgba(255,255,255,0.85);
        margin-bottom: 10px;
    }
    
    .text-content div{
        margin-bottom: 10px;
    }


    .top-btn{
        width: 64px;
        height: 40px;
        border-radius: 10px;
    }

    .text-title{
        width: 100%;
        font-size: 16px;
        padding: 0 16px;
        height: 48px;
        line-height: 48px;
        color: rgba(255,255,255,0.85);
        background: #2A2A2A;
        border-radius: 12px;
        margin-bottom: 16px;
        cursor: pointer;
    }

    .text-title span{
        font-size: 14px;
        color: rgba(255,255,255,0.60);
        float: right;
    }

    :deep(.ant-drawer-body){
        // padding: 100px !important;
        // font-size: 10px;
    }

    .input-txt{
        height: 40px;
        margin-bottom: 12px;
        background-color: #2A2A2A 100%;
    }
    
    :deep(.ant-pagination){
        text-align: center !important;
    }

    
    // 滚动条
    :deep(.ant-transfer-list-content){
        flex: 1 1 0%;
        overflow: hidden;
        overflow-y: auto;
    }
    :deep(.ant-transfer-list-content::-webkit-scrollbar){
        width: 5px;
    }
    :deep(.ant-transfer-list-content::-webkit-scrollbar-thumb){
        background: #aaa;
        border-radius: 3px;
    }
</style>
  