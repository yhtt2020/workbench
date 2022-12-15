<template>
  <div class="password-bank-container">
    <span class="password-bank-unlock">
      <UnlockFilled style="color: #ffffff; font-size: 32px" />
    </span>
    <div class="password-bank-input">
      <a-input class="bank-input" v-model:value="bankValue" placeholder="请输入「密码库A」的密码"/>
      <span class="password-bank-button" @click="enterSubmit">
        <img src="../../../public/img/enter_submit.svg" alt="" />
      </span>
    </div>
    <div class="password-bank-list-container">
        <div class="password-bank-list-item" :class="bankIndex == item.id ? 'bank_active':''" v-for="item in bankList" 
        :key="item.id" @click="selectBankItem(item)">
           <img :src="item.url" alt="">
           <span>{{item.text}}</span>
        </div>
    </div>
  </div>
</template>

<script>
import { UnlockFilled } from "@ant-design/icons-vue";
export default {
  components: {
    UnlockFilled,
  },
  data() {
    return {
      bankValue: "密码库A",
      bankIndex:0,
      bankList:[
          {
             id:0,
             text:'密码库A',
             url:'../../../public/img/lock.svg'
          },
          {
             id:1,
             text:'密码库B',
             url:'../../../public/img/unlock.svg'
          },
          {
             id:2,
             text:'密码库C',
             url:'../../../public/img/lock.svg'
          }
      ]
    };
  },
  methods: {
    enterSubmit() {
      // 点击之后做进入该密码库的事情
    },
    // 选中每一项内容放入输入框中
    selectBankItem(v){
       // 点击选中的状态
       this.bankIndex = v.id
       // 将点击选中的内容放入输入框中
       this.bankValue = v.text
    }
  },
};
</script>

<style lang="scss">
.password-bank-container {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  margin: 84px 0 0 0;
  .password-bank-unlock {
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 24px;
    width: 64px;
    height: 64px;
    background: linear-gradient(
      60deg,
      rgba(45, 74, 253, 0.59) 0%,
      rgba(20, 99, 250, 1) 100%
    );
    border-radius: 8px;
  }
  .password-bank-input {
    width: 345px;
    display: flex;
    padding-bottom: 16px;
    .bank-input {
      color: rgba(00, 00, 00, 0.25);
      line-height: 40px;
      width: 270px;
      margin-right: 8px;
      font-size: 14px;
      font-weight: 400;
    }
    .password-bank-button {
      border: 1px solid rgba(230, 230, 230, 1);
      width: 50px;
      height: 50px;
      border-radius: 6px;
      display: flex;
      align-items: center;
      justify-content: center;
      img {
        width: 16px;
        height: 16px;
      }
    }
  }
  .password-bank-list-container{
     width: 328px;
     .password-bank-list-item{
       display: flex;
       align-items: center;
       padding: 14px 23px;
       img{
         width: 16px;
         height: 16px;
       }
       span{
         padding-left: 13px;
       }
     }
  }
}
.bank_active{
   background: rgba(0, 0, 0, 0.04);
   border-radius: 6px;
}
</style>