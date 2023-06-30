<template>
  <!-- 排名前三 -->
  <div class="top-three-box">
    <div class="box-item pointer" @click="showCard(rankList[1].userInfo.uid,rankList[1].userInfo)">
      <div class="item-avatar two-avatar" >
        <a-avatar :src="rankList[1].userInfo.avatar" class="other-img"></a-avatar>
      </div>
      <span class="xt-text mb-2 truncate">{{ rankList[1].userInfo.nickname }}</span>
      <span>
        <span v-if="showSelect" class="text-back">{{ selectValue.slice(0, 1) }}</span>
        <span class="xt-text-2 ml-1">
          {{ rankList[1][lastName] }}
          <span> {{ unit }}</span>
        </span>
      </span>
    </div>
    <div class="one-box-item pointer" @click="showCard(rankList[0].userInfo.uid,rankList[0].userInfo)">
      <div class="one-avatar">
        <div class="avatar-img" >
          <a-avatar :src="rankList[0].userInfo.avatar" class="one-img"></a-avatar>
        </div>
      </div>
      <div class="xt-text mb-2 truncate">{{ rankList[0].userInfo.nickname }}</div>
      <span>
        <span v-if="showSelect" class="text-back">{{ selectValue.slice(0, 1) }}</span>
        <span class="xt-text-2 ml-1">
          {{ rankList[0][lastName] }}
          <span> {{ unit }}</span>
        </span>
      </span>
    </div>
    <div class="box-item pointer" @click="showCard(rankList[2].userInfo.uid,rankList[2].userInfo)">
      <div class="item-avatar three-avatar" >
        <a-avatar :src="rankList[2].userInfo.avatar" class="other-img"></a-avatar>
      </div>
      <span class="xt-text mb-2 truncate">{{ rankList[2].userInfo.nickname }}</span>
      <span>
        <span v-if="showSelect" class="text-back">{{ selectValue.slice(0, 1) }}</span>
        <span class="xt-text-2 ml-1">
          {{ rankList[2][lastName] }}
          <span> {{ unit }}</span>
        </span>
      </span>
    </div>
  </div>
</template>

<script>
import { mapActions, mapWritableState } from 'pinia'
import { appStore } from '../../store'

export default {
  name: 'RankList',
  components: {},
  props: {
    // 排行榜列表
    rankList: {
      type: Array,
      default: []
    },
    // 切换类型的值
    selectValue: {
      type: String,
      default: () => ''
    },
    showSelect: {
      type: Boolean,
      default: () => false
    },
    // 最后一个属性
    lastName: {
      type: String,
      default: () => ''
    },
    // 单位
    unit: {
      type: String,
      default: () => ''
    }
  },
  data () {
    return {
      selectVal: ''
    }
  },
  methods: {
    ...mapActions(appStore, ['showUserCard']),
    showCard (uid,userInfo) {
      this.showUserCard(uid,userInfo)
    },
  }
}
</script>

<style scoped lang="scss">
.box-item,.one-box-item{
  &:hover{
    opacity: 0.8;
  }
}
@media screen and (min-width: 992px) {
  .one-box-item {
    width: 231px;
    margin: 0 70px;

    .one-avatar {
      width: 231px;
      height: 231px;
      background-size: 168px;
    }

    .one-img {
      width: 87px;
      height: 87px;
    }

    .avatar-img {
      position: relative;
      top: 8px;
    }
  }
  .box-item {

    width: 178px;

    .item-avatar {
      width: 178px;
      height: 178px;
    }

    .other-img {
      width: 68px;
      height: 68px;
    }
  }
}

@media screen and (max-width: 992px) {
  .one-box-item {
    width: 180px;
    margin: 0 25px;

    .one-avatar {
      width: 180px;
      height: 180px;
      background-size: 118px;
    }

    .one-img {
      width: 60px;
      height: 60px;
    }

    .avatar-img {
      position: relative;
      top: 6px;
    }
  }
  .box-item {
    width: 128px;

    .item-avatar {
      width: 128px;
      height: 128px;
    }

    .other-img {
      width: 48px;
      height: 48px;
    }
  }
  .two-avatar {
    background-size: 92px;
  }
  .three-avatar {
    background-size: 80px;
  }
}

.top-three-box {
  height: 320px;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  // position: relative;
  .box-item {
    // width: 178px;
    font-size: 16px;
    display: flex;
    flex-direction: column;
    align-items: center;

    .item-avatar {
      // width: 178px;
      // height: 178px;
      display: flex;
      justify-content: center;
      align-items: center;
    }

    .two-avatar {
      background-image: url(../../../../public/img/rankingList/silver.svg);
      background-repeat: no-repeat;
      background-position: center;
    }

    .three-avatar {
      background-image: url(../../../../public/img/rankingList/copper.svg);
      background-repeat: no-repeat;
      background-position: center;
    }
  }

  .one-box-item {
    // width: 231px;
    font-size: 16px;
    display: flex;
    flex-direction: column;
    align-items: center;
    // margin: 0 70px;
    .one-avatar {
      // width: 231px;
      // height: 231px;
      display: flex;
      justify-content: center;
      align-items: center;
      background-image: url(../../../../public/img/rankingList/metals.svg);
      // background-size: 168px;
      background-repeat: no-repeat;
      background-position: center;
      // .avatar-img{
      //   position: relative;
      //   top: 8px;
      // }
    }
  }

  .text-back {
    background: rgba(255, 255, 255, 0.40);
    border-radius: 4px;
    width: 24px;
    height: 24px;
    text-align: center;
    display: inline-block;
    font-size: 14px;
    color: var(--secondary-text)
  }
}
</style>
