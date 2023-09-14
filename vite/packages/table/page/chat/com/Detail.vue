<template >
    <!-- {{ isShow.isShow }} -->
    <div class="w-full card" style="height:auto">
        <!-- {{ isShow.isShow }} -->
        <div class="w-full card-content">
            <div class="card-top">
                <div class="top-left">
                    <a-avatar :src="cardData.user.avatar" :size="32" class="pointer" @click.stop="showCard(uid,userInfo)">
                        <template #icon>
                            <UserOutlined />
                        </template>
                    </a-avatar>
                    <div class="user-msg">
                        <div class="username" style="color: var(--primary-text);">
                            {{ cardData.user.nickname }}
                        </div>
                        <div class="self-msg " style="color:  var(--secondary-text);">
                            <span class="date">{{ createTime[0] }}</span>
                            <span class="time">{{ createTime[1] }}</span>
                            <span class="ip">{{ cardData.user.ip_home.region }}</span>
                        </div>
                    </div>
                </div>
                <div class="top-right">
                    <!-- 当展示文章详情时,需要一个返回按钮去返回上一级 -->
                    <slot name="top-right"></slot>
                </div>

            </div>

            <div>
                <div>
                    <div class="flex flex-col items-center " v-if="cardData.data?.video">
                        <video class="object-cover mb-2 rounded-md cover-lm" >
                            <source :src="cardData.data.video" type="video/mp4" />
                            <source :src="cardData.data.video" type="video/webm" />
                        </video>
                    </div>
                    <template v-if="cardData.image">
                        <ul class="flex flex-col items-center p-0 mb-0">
                            <img :src="item.image" v-for="(item,index) in cardData.image_350_173" class="mb-2 rounded-md cover-lm" :key="index">
                        </ul>
                    </template>
                    <!-- 正文元素 -->
                    <div class="mt-1">
                        <div>
                            <div id="title" style="color: var(--primary-text); " v-if="cardData.title">{{
                                cardData.title
                            }}</div>
                            <div id="context" style="color:  var(--secondary-text); word-break: pre-wrap;">{{
                                cardData.summary
                            }}</div>
                        </div>

                    </div>
                </div>

            </div>
            <div class="text-xs card-bottom" style="color:  var(--secondary-text);">
                <span class="view" style="cursor: pointer;">{{ cardData.view_count }} 浏览</span>
                <span class="like" style="cursor: pointer;">{{ cardData.support_count }} 点赞</span>
                <span class="comments" style="cursor: pointer;">{{ cardData.reply_count }} 评论</span>
            </div>
            <!-- 分隔线 -->
            <!-- <div class="w-full h-[2px] mt-4 xt-bg-2"></div> -->
            <a-divider   class="w-full h-[2px] mt-4 xt-bg-2" />
            <div class="flex mt-4 mb-4 ">
            <!-- :icon="h(SearchOutlined)" -->
            <!-- {{ isLike }} -->
            <div class="flex items-center "  style="cursor: pointer;" @click="clickLike">
                <button class="mr-3 reply w-[57px] h-[32px]  pl-5 " :class="{ 'xt-bg': !isLike, 'xt-active-bg': isLike }"
                    style="position: relative;border: none;cursor: pointer;" >{{ cardData.support_count }}</button>
                <img src="../../../../../public/icons/like.png" alt="" class="w-[20px] h-[20px] "
                    style="position: absolute;left:34px;">
            </div>
            <div class="flex items-center" style="cursor: pointer;" @click="clickCollect">
                <button class="reply w-[57px] h-[32px]  pl-5" :class="{ 'xt-bg': !isCollect, 'xt-active-bg': isCollect }" 
                    style="position: relative;border: none;cursor: pointer;">{{ cardData.collect_count }}</button>
                <img src="../../../../../public/icons/collect.png" alt="" class="w-[20px] h-[20px]"
                    style="position: absolute;left:102px;">
            </div>

        </div>
            <Comment :tid="tid" :reply="cardData.reply_count"/>
        </div>
    </div>
</template>

<script setup lang='ts'>
import { ref, reactive,computed } from 'vue'
import { UserOutlined } from '@ant-design/icons-vue'
import Comment from './comment.vue';
import { useCommunityStore } from '../community'
import {appStore} from '../../../../table/store'
const useUserStore=appStore()
let uid=props.cardData.user.uid
let userInfo={
    uid:uid,
    nickname:props.cardData.user.nickname,
    avatar:props.cardData.user.avatar_128
}
const showCard=(uid,userInfo)=>{
    useUserStore.showUserCard(uid,userInfo)
}
const store = useCommunityStore();
// 点赞
const isLike = ref(false)
// 
const clickLike = () => {
    isLike.value = !isLike.value
}
const isCollect = ref(false)
// 
const clickCollect  = () => {
    isCollect.value = !isCollect.value
}
const props = defineProps({
    isShow: Boolean,
    cardData: {
        type: Object,
        default: () => []
    }
})
const createTime=computed(()=>{
    let [date, time]=props.cardData.create_time.split(' ')
    return [date,time]
})
// const tid=store.communityPostDetail.pay_set.tid 
let tid
// console.log(store.communityPostDetail);

if(store.communityPostDetail.pay_set ){
    tid=store.communityPostDetail.pay_set.tid 
}else{
    // 
    tid=1234
}
</script>
<style lang='scss' scoped>
.card {
    display: flex;
    // 占满整个父元素
    flex-grow: 1;
    // width: 600px;


    .card-content {
        margin: 12px;

        .card-top {
            display: flex;
            align-items: center;
            margin-bottom: 12px;
            justify-content: space-between;

            .top-left {
                display: flex;
                align-items: center;
            }

            .user-msg {
                margin-left: 8px;

                .user-name {
                    font-family: PingFangSC-Regular;
                    font-size: 14px;
                    color: rgba(255, 255, 255, 0.85);
                    font-weight: 400;
                }

                .self-msg {
                    font-family: PingFangSC-Regular;
                    font-size: 12px;
                    color: rgba(255, 255, 255, 0.40);
                    font-weight: 400;

                    .date {
                        margin-right: 3px;
                    }

                    .time::after {
                        content: '·';
                        margin-left: 5px;
                        margin-right: 5px;
                    }
                }
            }


        }

        .card-content {
            font-family: PingFangSC-Regular;
            font-size: 16px;
            // color: rgba(255, 255, 255, 0.85);
            // text-align: justify;
            line-height: 22px;
            font-weight: 400;
        }

        .cover-lm {
            width: 250px;
            height: 175px;
            text-align: center;
            // object-fit: cover;

        }
    }
    .reply {
    border-radius: 8px;
    }

    #title {
        font-family: PingFangSC-Regular;
        font-size: 16px;
        color: rgba(255, 255, 255, 0.85);
        text-align: justify;
        line-height: 22px;
        font-weight: 400;
    }

    #context {
        font-family: PingFangSC-Regular;
        font-size: 14px;
        color: rgba(255, 255, 255, 0.60);
        text-align: justify;
        line-height: 22px;
        font-weight: 400;
        white-space: pre-wrap;
        word-wrap: break-word;
    }
    .card-bottom {
            margin-top: 12px;

            .view::after {
                content: '·';
                margin-left: 5px;
                margin-right: 5px;

            }

            .like::after {
                content: '·';
                margin-left: 5px;
                margin-right: 5px;
            }
        }

}
</style>