<template>
  <div class="custom">
    <template v-if="isCustom === constant.typeService">
      <div>
        <h1>
          <label>{{ extension.title }}</label>
          <a v-if="extension.hyperlinks_text" :href="extension.hyperlinks_text.value" target="view_window">{{
            extension.hyperlinks_text.key
          }}</a>
        </h1>
        <ul v-if="extension.item && extension.item.length > 0">
          <li v-for="(item, index) in extension.item" :key="index">
            <a v-if="isUrl(item.value)" :href="item.value" target="view_window">{{ item.key }}</a>
            <p v-else>{{ item.key }}</p>
          </li>
        </ul>
        <article>{{ extension.description }}</article>
      </div>
    </template>
    <template v-else-if="isCustom.businessID === constant.typeEvaluate">
      <div class="evaluate">
        <h1>{{ $t('message.custom.对本次服务评价') }}</h1>
        <ul>
          <li class="evaluate-list-item" v-for="(item, index) in ~~isCustom.score" :key="index">
            <i class="icon icon-star-light"></i>
          </li>
        </ul>
        <article>{{ isCustom.comment }}</article>
      </div>
    </template>
    <template v-else-if="isCustom.businessID === constant.typeOrder">
      <div class="order" @click="openLink(isCustom.link)">
        <img :src="isCustom.imageUrl" alt="" />
        <main>
          <h1>{{ isCustom.title }}</h1>
          <p>{{ isCustom.description }}</p>
          <span>{{ isCustom.price }}</span>
        </main>
      </div>
    </template>
    <template v-else-if="isCustom.businessID === constant.typeTextLink">
      <div class="textLink">
        <p>{{ isCustom.text }}</p>
        <a :href="isCustom.link" target="view_window">{{ $t('message.custom.查看详情>>') }}</a>
      </div>
    </template>
    <template v-else-if="isCustom.businessID === constant.TYPE_CALL_MESSAGE">
      <div class="call" @click="handleCallAgain" :class="`call-${data?.message?.conversationType}`">
        <i class="icon" :class="handleCallMessageIcon()"></i>
        <span>{{ data.custom }}</span>
      </div>
    </template>
    <!-- 判断自定义消息展示类型 -->
<!--    <template v-else-if="isCustom. === constant.typeTextLink">-->
<!--      <div class="textLink">-->
<!--        &lt;!&ndash; 展示文本 &ndash;&gt;-->
<!--        <p>{{isCustom.text}}</p>-->
<!--        &lt;!&ndash; 展示超链接 &ndash;&gt;-->
<!--        <a :href="isCustom.link" target="view_window">{{$t('message.custom.查看详情>>')}}</a>-->
<!--      </div>-->
<!--    </template>-->

    <template v-else>
      <div  v-if="isCustom.type==='game'">
        <!--      {{steam游戏格式}}-->
        <img @click.stop="goGameDetail(isCustom.game?.appid)" style="border-radius: 5px;width: 250px;cursor:pointer!important;position: relative;pointer-events: auto;" :src="isCustom.game?.header" alt="">
        <div class="mt-2 " style="margin-top: 10px;">
          <div class="truncate" style="max-width: 160px;float: left;margin-right: 10px">
            <a-avatar :size="30" shape="square" :src="isCustom.game?.icon || '/emoji/game.png'"></a-avatar>  <strong>{{isCustom.game?.chineseName}}</strong>
          </div>

          <div  style="float: right">
            <xt-button @click="goGameDetail(isCustom.game?.appid)" :w="70" :h="35" size="mini"><ShopOutlined></ShopOutlined> 查看</xt-button>
          </div>
          <div style="clear: both">
          </div>
        </div>
      </div>
      <div v-else>
        <span v-html="data.custom"></span>
      </div >


    </template>
  </div>
</template>

<script lang="ts">
import { defineComponent, watchEffect, reactive, toRefs } from 'vue';
import { isUrl, JSONToObject } from '../utils/utils';
import constant from '../../constant';
import { useStore } from 'vuex';
import {useRouter} from "vue-router";
import {ShopOutlined} from '@ant-design/icons-vue'
export default defineComponent({
  props: {
    data: {
      type: Object,
      default: () => ({}),
    },
  },
  components:{
    ShopOutlined
  },
  setup(props: any, ctx: any) {
    const VuexStore = ((window as any)?.TUIKitTUICore?.isOfficial && useStore && useStore()) || {};
    const router= useRouter()
    const data = reactive({
      data: {} as any,
      payload:{},
      name:'',//自定义消息类型
      extension: {},
      isCustom: '',
      constant: constant,
    });
    watchEffect(() => {
      data.data = props.data;
      const {
        message: { payload },
      } = props.data;
      data.name=payload.name
      data.payload=payload
      data.isCustom = payload.data || ' ';
      data.isCustom = JSONToObject(payload.data);
      if (payload.data === constant.typeService) {
        data.extension = JSONToObject(payload.extension);
      }
    });
    const openLink = (url: any) => {
      window.open(url);
    };
    const handleCallMessageIcon = () => {
      const callType = JSON.parse(JSON.parse(data?.data?.message?.payload?.data)?.data)?.call_type;
      let className = '';
      switch (callType) {
        case 1:
          className = 'icon-call-voice';
          break;
        case 2:
          className = 'icon-call-video';
          break;
        default:
          break;
      }
      return className;
    };

    const goGameDetail=(id)=>{
      router.push({
          name:'GameDiscountDetail',
          params:{
            id:id
          }
        })
    }

    const handleCallAgain = async () => {
      const callType = JSON.parse(JSON.parse(props?.data?.message?.payload?.data)?.data)?.call_type;
      switch (data?.data?.message?.conversationType) {
        case (window as any).TUIKitTUICore.TIM.TYPES.CONV_C2C:
          // eslint-disable-next-line no-case-declarations
          const { flow, to, from } = data?.data?.message;
          if (to === from) break;
          try {
            await (window as any)?.TUIKitTUICore?.TUIServer?.TUICallKit?.call({
              userID: flow === 'out' ? to : from,
              type: callType,
            });
            (window as any)?.TUIKitTUICore?.isOfficial && VuexStore?.commit && VuexStore?.commit('handleTask', 6);
          } catch (error) {
            console.warn(error);
          }
          break;
        case (window as any).TUIKitTUICore.TIM.TYPES.CONV_GROUP:
          break;
        default:
          break;
      }
    };

    return {
      ...toRefs(data),
      isUrl,
      openLink,
      handleCallMessageIcon,
      handleCallAgain,
      goGameDetail
    };
  },
});
</script>
<style lang="scss" scoped>
@import url('../../../styles/common.scss');
@import url('../../../styles/icon.scss');
a {
  color: #679ce1;
}
.custom {
  font-size: 14px;
  h1 {
    font-size: 14px;
    color: #000000;
  }
  h1,
  a,
  p {
    font-size: 14px;
  }
  .evaluate {
    ul {
      display: flex;
      padding-top: 10px;
    }
  }
  .order {
    display: flex;
    main {
      padding-left: 5px;
      p {

        width: 145px;
        line-height: 17px;
        font-size: 14px;
        color: #999999;
        letter-spacing: 0;
        margin-bottom: 6px;
        word-break: break-word;
      }
      span {

        line-height: 25px;
        color: #ff7201;
      }
    }
    img {
      width: 67px;
      height: 67px;
    }
  }
  .call {
    display: flex;
    flex-direction: row;
    align-items: center;
    &-C2C {
      cursor: pointer;
    }
    &-GROUP {
      cursor: default;
    }
  }
}
</style>
