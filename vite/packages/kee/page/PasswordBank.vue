<template>
  <div @click="unselectBankItem" class="password-bank-container">
    <div style="height: 180px;padding-top:84px;width: 100%;text-align: center" v-if="!showAction" @mouseenter="showAction=true">
      <span class="password-bank-unlock">
      <UnlockFilled style="color: #ffffff; font-size: 32px" />
    </span>
    </div>
    <div style="height: 180px;padding-top:44px;;width: 100%;text-align: center" v-else  @mouseleave="showAction=false">
      <a-row style="margin: auto;width: 220px;text-align: center" :gutter="20">
        <a-col class="action"  :span="12">
          <folder-open-outlined  class="icon"/>
          <div>打开</div>
        </a-col>
        <a-col @click="create"  class="action"   :span="12">
          <folder-open-outlined class="icon"/>
          <div>新建</div>
        </a-col>
      </a-row>
    </div>
    <div @click.stop="()=>{}" class="password-bank-input">
      <a-input-password  class="bank-input" v-model:value="password" :placeholder="this.bankValue?'请输入「'+this.bankValue+'」的密码':'请先选择一个密码库'"/>
      <span class="password-bank-button" @click="enterSubmit">
        <img src="../assets/image/enter_submit.svg" alt="" />
      </span>
    </div>
    <div class="password-bank-list-container">
      <a-empty v-if="bankList.length===0"></a-empty>
      <a-tooltip :overlay-style="{'min-width':'500px'}" :mouseEnterDelay="0.5" placement="bottom"  v-for="(item,index) in bankList">
      <template #title>
        保存位置：<br>{{ item.path }}
      </template>
        <div  class="password-bank-list-item" :class="bankIndex == item.id ? 'bank_active':''"
        :key="item.id" @click.stop="selectBankItem(item)">
           <img src="../assets/image/lock.svg" alt="">
            <span class="name">{{item.text}}</span>
       <span title="删除记录" @click="removeBank(index)" class="remove-icon" size="small"> <close-outlined /></span>
        </div>
      </a-tooltip>
    </div>
  </div>
  <a-modal v-model:visible="visibleInputPwd" centered :width="380" title="主密码" @ok="doCreate" >
    <div style="padding:20px">
      <a-input default-value="新密码库" style="margin-bottom: 10px" v-model:value="newName" placeholder="密码库名称">
        <template #addonBefore>
          库名称
        </template>
      </a-input>
      <div class="password-bank-input">
        <a-input-password class="bank-input" v-model:value="newPassword" placeholder="主密码">
          <template #addonBefore>
            主密码
          </template>
        </a-input-password>
      </div>
    </div>
  </a-modal>
</template>

<script>
import { UnlockFilled,FolderOpenOutlined,CloseOutlined } from "@ant-design/icons-vue";
import {message,Modal} from 'ant-design-vue'
export default {
  components: {
    UnlockFilled,FolderOpenOutlined,CloseOutlined
  },
  data() {
    return {
      showAction:false,
      bankValue: "",
      bankIndex:0,
      visibleInputPwd:false,
      password:'',
      newPassword:'',
      newName:'新密码库',
      bankList:[
      ]
    };
  },
  mounted () {
    this.loadHistory()
  },
  methods: {
    create(){
      this.visibleInputPwd=true

      // const filePath=ipc.sendSync('selectKdbx')
      // kdbxModel.create('kdb',filePath)
    },
    openDb(){
      kdbxModel.openFile(this.password,this.bankList[this.bankIndex],undefined,(err)=>{
        if(err){
          message.error('打开密码库失败，请确认主密码是否正确')
        }else{
          console.log()
        }
      })
    },
    doCreate(){
      if(!this.newPassword){
        message.error('请输入密码库主密码。')
        return
      }

      const filePath=ipc.sendSync('selectKdbx',{name:this.newName})
      if(!filePath){
        return
      }
      kdbxModel.create(this.newName,filePath,this.newPassword,()=>{
        let item={
          id:Date.now(),
          text:this.newName,
          path:filePath,
          lastOpen:Date.now()
        }
        this.bankList.unshift(item)
        this.newPassword=''
        this.newName='新密码库'
        this.visibleInputPwd=false
        message.success('密码库创建成功。')
        this.selectBankItem(item)
        this.saveHistory()
      })
    },
    saveHistory(){
      localStorage.setItem('bankList',JSON.stringify(this.bankList))
    },
    loadHistory(){
      let history = localStorage.getItem('bankList')
      if(history){
        this.bankList=JSON.parse(history)
      }
    },
    removeBank(index){
      Modal.confirm({
        centered:true,
        content:'是否移除记录？此行为不会删除密码库。',
        onOk:()=>{
          this.bankList.splice(index,1)
          this.saveHistory()
        }
      })

    },
    enterSubmit() {
      // 点击之后做进入该密码库的事情
    },
    unselectBankItem(){
      // 点击选中的状态
      this.bankIndex = 0
      // 将点击选中的内容放入输入框中
      this.bankValue =''
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

<style lang="scss" scoped>
.action{
  .icon{
    font-size: 44px;
  }
  padding: 20px;
  cursor: pointer;
  &:hover{
    background: #f1f1f1 ;
    border-radius: 4px;
  }
}
.password-bank-container {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  padding: 0 0 0 0;
  .password-bank-unlock {
    display: inline-block;
    align-items: center;
    justify-content: center;
    width: 64px;
    padding-top: 6px;
    height: 64px;
    line-height: 64px;
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
       position: relative;
       &:hover{
         .remove-icon{
           display: inline-block;
         }
       }
       .remove-icon{
         cursor: pointer;
         right: 10px;
         position: absolute;
         display: none;
         opacity: 0.5;
         padding-left: 0;
         margin-left: 0;
         width: 20px;
         text-align: center;
         &:hover{
           opacity: 1;
         }
       }
       display: flex;
       align-items: center;
       padding: 14px 23px;
       img{
         width: 16px;
         height: 16px;
       }
       .name {
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
