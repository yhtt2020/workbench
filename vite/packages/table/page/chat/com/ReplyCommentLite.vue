<template>
    <div class="w-full xt-bg box">
        <div class="pt-4 pb-3 pl-4 pr-3 ">
            <div class="flex ">
                <a-avatar :src="replyCom.user.avatar" :size="24" class="mr-2 pointer" @click.stop="showCard(uid, userInfo)"></a-avatar>
                <div class="flex items-center ml-2 text-center">
                    <span class="font-16 xt-text">
                        {{ replyCom.user.nickname }}
                    </span>
                    <div class="font-12 w-[32px] h-[20px] rounded-lg xt-theme-b xt-theme-text ml-2 mt-1" v-if="replyCom.author_uid === replyCom.user.uid">作者</div>
                </div>
            </div>
            <div class="mt-2 font-16 xt-text" style="user-select: text;text-align: left; " :innerHTML="content">
                <!-- {{ replyCom.content }} -->
            </div>
            <div class="flex w-full p-0 mt-3 -mb-1 whitespace-pre-wrap cover-wrapper" v-if="replyCom.image">
                <img :src="item" alt="" v-for="(item, index) in replyCom.image_pc"
                    class="object-cover mr-2 rounded-md cover-sm" :key="index">
            </div>
            <div class="flex justify-between  mt-3  h-[20px] xt-text-2 font-14">
                <div class="flex items-center justify-center ">
                    <div class="flex" @click="clickLike" :class="{'xt-theme-text':isLike}">
                        <LikeOutlined style="font-size: 16px;" class="mt-1 mr-1" />
                        <div class="mr-4 text-center" >{{ replyCom.support_count }} 点赞</div>
                    </div>
                    <div class="flex" @click="replyStatus">
                        <MessageOutlined style="font-size: 16px;" class="mt-1 mr-1" />
                        <div>回复</div>
                    </div>
                </div>
                <div>
                    <span class="local-city">{{ replyCom.user_home.region }}</span>
                    <span class="mr-1">{{ createTime[0] }}</span>
                    <span>{{ createTime[1] }}</span>
                </div>
            </div>
            <replyComments  v-if="replyVisible" @changeStatus="getReplyFlag" @addComment="getReplyText" :userName="replyCom.user.nickname"/>
        </div>
        <ReplyCommentLite v-for="item in replyCmmentList" :key="item" :replyCom="item" :replyVisible="replyVisible"></ReplyCommentLite>
    </div>
</template>

<script setup lang='ts'>
import { ref, reactive ,computed} from 'vue'
import { MessageOutlined, LikeOutlined } from '@ant-design/icons-vue'
import ReplyCommentLite from './ReplyCommentLite.vue';
import replyComments from './replyComments.vue';
import { appStore } from '../../../../table/store'
const useUserStore = appStore()
let uid = props.replyCom.user.uid
let userInfo = {
    uid: uid,
    nickname: props.replyCom.user.nickname,
    avatar: props.replyCom.user.avatar_128
}
const showCard = (uid, userInfo) => {
    useUserStore.showUserCard(uid, userInfo)
}
const isLike=ref(false)
const replyVisible=ref(false)
const replyCmmentList=computed(()=>{
    return props.replyCom.comment
})
const props=defineProps({
    replyCom:String
})
const createTime=computed(()=>{
    let [date, time]=props.replyCom.time.split(' ')
    return [date,time]
})
const clickLike = () => {
    isLike.value=!isLike.value
}
const replyStatus=()=>{
    replyVisible.value=!replyVisible.value
}
const getReplyFlag=(val)=>{
    // console.log(val);
    replyVisible.value=val
    
}
const getReplyText=(val)=>{
    // console.log(val);
    replyCmmentList.value=val.value
    
}
const fluentEmojis = reactive({
    "[Kiss]": "Face Blowing a Kiss.png",
    "[Tears]": "Face with Tears of Joy.png",
    "[Cry]": "Loudly Crying Face.png",
    "[Smiling]": "Smiling Face with Open Hands.png",
    "[Confound]": "Confounded Face.png",
    "[Mask]": "Face with Medical Mask.png",
    "[Zany]": "Zany Face.png",
    "[Vomit]": "Face Vomiting.png",
    "[Kissing]": "Kissing Face.png",
    "[Fearful]": "Fearful Face.png",
    "[Pleading]": "Pleading Face.png",
    "[Scream]": "Face Screaming in Fear.png",
    "[AngryFace]": "Angry Face.png",
    "[Zipper]": "Zipper-Mouth Face.png",
    "[Expressionless]": "Expressionless Face.png",
    "[SpiralEyes]": "Face with Spiral Eyes.png",
    "[Shushing]": "Shushing Face.png",
    "[MoneyMouth]": "Money-Mouth Face.png",
    "[ThumbsUp]": "Thumbs Up Light Skin Tone.png",
    "[ThumbsDown]": "Thumbs Down Light Skin Tone.png",
    "[Victory]": "Victory Hand Light Skin Tone.png",
    "[Ok]": "OK Hand Light Skin Tone.png",
    "[Pingching]": "Pinching Hand Light Skin Tone.png",
    "[Hands]": "Folded Hands Light Skin Tone.png",
    "[Clap]": "Clapping Hands Light Skin Tone.png",
    "[OpenHands]": "Open Hands Light Skin Tone.png",
    "[Waing]": "Waving Hand Light Skin Tone.png",
    "[Writing]": "Writing Hand Light Skin Tone.png",
    "[PigFace]": "Pig Face.png",
    "[Cat]": "Cat with Wry Smile.png",
    "[Blowfish]": "Blowfish.png",
    "[Yen]": "Yen Banknote.png",
    "[Triangular]": "Triangular Flag.png",
    "[Heart]": "Beating Heart.png",
    "[Broken]": "Broken Heart.png",
    "[1st]": "1st Place Medal.png",
    "[2nd]": "2nd Place Medal.png",
    "[3rd]": "3rd Place Medal.png",
    "[Selfie]": "Selfie Light Skin Tone.png",
    "[Teacup]": "Teacup Without Handle.png",
    "[New]": "New Button.png",
    "[Check]": "Check Mark Button.png",
    "[Anger]": "Anger Symbol.png",
    "[Acceptable]": 'Japanese Acceptable Button.png',
    "[Hundred]": "Hundred Points.png",
    "[Crab]": "Crab.png",
    "[MoneyBag]": "Money Bag.png",
    "[Zzz]": "Zzz.png",
    "[Bomb]": "Bomb.png",
})


// 用于在动态和评论中使用的表情
// str.replace(/\[([^(\]|\[)]*)\]/g,(item,index) => {})
// https://sad.apps.vip/public/static/emoji/emojistatic/
const content = computed(() => {
    let result = props. replyCom.content.replace(/\[([^(\]|\[)]*)\]/g, (item, index) => {
        let emojiValue;
        Object.entries(fluentEmojis).forEach(([key, value]) => {
            if (key == item) {
                emojiValue = value;
            }
        });

        if (emojiValue) {
            let url = `https://sad.apps.vip/public/static/emoji/emojistatic/${emojiValue}`;
            return `<img src="${url}" class=" w-[22px] h-[22px]">`;
        }

        return item;
    });

    return result;
});
</script>
<style lang='scss' scoped>
.box {
    border-radius: 8px 8px 0px 0px;
}

.font-16 {
    font-family: PingFangSC-Medium;
    font-size: 16px;
    font-weight: 500;
}

.font-12 {
    font-family: PingFangSC-Regular;
    font-size: 12px;
    font-weight: 400;
    text-align: center;
}

.font-14 {
    font-family: PingFangSC-Regular;
    font-size: 14px;
    font-weight: 400;
}
.cover-wrapper {
        flex-wrap: wrap;
    }

    .cover-sm {
        margin-bottom: 10px;
        width: 56px;
        height: 56px;
        aspect-ratio: 1 / 1;
    }
.local-city {
    &::after {
        content: '·';
        margin: 0 4px;
    }
}</style>