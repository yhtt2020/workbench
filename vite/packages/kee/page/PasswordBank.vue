<template>
  <div @click="unselectBankItem" class="password-bank-container">
    <div style="height: 180px;padding-top:84px;width: 100%;text-align: center" v-if="!showAction"
         @mouseenter="showAction=true">
      <span class="password-bank-unlock">
      <UnlockFilled style="color: #ffffff; font-size: 32px"/>
    </span>
    </div>
    <div style="height: 180px;padding-top:44px;;width: 100%;text-align: center" v-else @mouseleave="showAction=false">
      <a-row style="margin: auto;width: 220px;text-align: center" :gutter="20">
        <a-col @click="selectDb" class="action" :span="12">
          <folder-open-outlined class="icon"/>
          <div>打开</div>
        </a-col>
        <a-col @click="create" class="action" :span="12">
          <folder-open-outlined class="icon"/>
          <div>新建</div>
        </a-col>
      </a-row>
    </div>
    <div @click.stop="()=>{}" class="password-bank-input">
      <a-input-password id="pwdInput" @keypress.enter="openDb" class="bank-input" v-model:value="password"
                        :placeholder="this.bankValue?'请输入「'+this.bankValue+'」的密码':'请先选择一个密码库'">

      </a-input-password>
      <span @click="openDb" class="password-bank-button">
        <img src="../../../public/img/enter_submit.svg" alt=""/>
      </span>
    </div>

    <div class="collapse-addon" style="text-align: left;width: 340px;margin-top: -10px">
      <a-collapse ghost>
        <a-collapse-panel class="addon" style="color: #999" key="1" header="更多选项">
          附加凭证（如果有） <a @click="selectKey" type="primary" size="small">
          <key-outlined/>
          选择秘钥文件</a>
          <div v-if="keyPath" style="position: relative">
            <a-tag title="{{keyPath[0]}}">
              <div class="key-file">{{ keyPath[0] }}</div>
              <a title="去除秘钥" @click="removeKey" style="color: red;position: absolute;right: 0px;top: 0 "
                 class="remove-icon" size="small">
                <close-outlined/>
              </a>
            </a-tag>
          </div>
        </a-collapse-panel>
      </a-collapse>
    </div>

    <div class="password-bank-list-container">
      <vue-custom-scrollbar :settings="settings" style="position:relative;height: 185px">
      <a-empty v-if="dbList.length===0"></a-empty>
      <a-tooltip :mouseEnterDelay="0.5" placement="top" title="使用内置的密码库，但是无法被外部网盘同步，建议保存到外部密码库。">
        <div class="password-bank-list-item" :class="bankIndex == 'inner' ? 'bank_active':''"
             key="inner" @click.stop="setInnerDb">
          <img src="/img/lock-app.svg" alt="">
          <strong class="name">内置密码库</strong>
        </div>
      </a-tooltip>

      <a-tooltip :overlay-style="{'min-width':'500px'}" :mouseEnterDelay="0.5" placement="bottom"
                 v-for="(item,index) in dbList">
        <template #title>
          保存位置：<br>{{ item.path }}
        </template>

        <div class="password-bank-list-item" :class="bankIndex == item.id ? 'bank_active':''"
             :key="item.id" @click.stop="selectBankItem(item)">
          <img src="/img/lock.svg" alt="">
          <span class="name">{{ item.text }}</span>
          <span title="删除记录" @click="removeBank(index)" class="remove-icon" size="small"> <close-outlined/></span>
        </div>
      </a-tooltip>
      </vue-custom-scrollbar>
    </div>
  </div>



  <a-modal v-model:visible="visibleInputPwd" centered :width="380" title="主密码" @ok="doCreate">
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
import { UnlockFilled, FolderOpenOutlined, CloseOutlined, KeyOutlined } from '@ant-design/icons-vue'
import { message, Modal } from 'ant-design-vue'
import vueCustomScrollbar from '../../../src/components/vue-scrollbar.vue'
import {mapActions,mapWritableState} from 'pinia'
import  { appStore } from '../store'
export default {
  components: {
    vueCustomScrollbar,
    UnlockFilled, FolderOpenOutlined, CloseOutlined, KeyOutlined
  },
  data () {
    return {
      settings: {
        swipeEasing: true,
        suppressScrollY: false,
        suppressScrollX: true,
        wheelPropagation: false
      },
      showAction: false,
      bankValue: '',
      bankIndex: 0,
      visibleInputPwd: false,
      password: '',
      selectedItem: {},
      newPassword: '',
      newName: '新密码库',
      keyPath: '',
    }
  },
  computed:{
    ...mapWritableState(appStore,['dbList','filterInfo'])
  },
  mounted () {
    let bank=this.$route.params
    if(bank.name){
      message.info('请输入密码库的登录信息，回车进入。')
      document.getElementById('pwdInput').focus()
      this.selectBankItem({
        text:bank.name,
        path:bank.path
      })
    }

  },
  methods: {
    ...mapActions(appStore,['setDb','loadDbList','saveDbList']),
    create () {
      this.visibleInputPwd = true
      // const filePath=ipc.sendSync('selectKdbx')
      // kdbxModel.create('kdb',filePath)
    },
    setInnerDb(){
      Modal.confirm({
        content:'设置为内置密码库时，部分功能将被禁用。',
        okText:'确定',
        onOk:()=>{
          this.setDb({
            tags: [],
            name: '内部密码库',
            type:'builtin'
          })
          this.$router.push({name:'passwords',params:{value:'',type:'all'}})
        }
      })
    },
    selectDb () {
      let filePath = ipc.sendSync('selectKdbx')
      if (!filePath) {
        return
      }
      filePath = filePath[0]
      const path = require('path')

      let item = {
        id: Date.now(),
        text: path.basename(filePath).replace(path.extname(filePath), ''),
        path: filePath,
        lastOpen: Date.now()
      }
      let found = this.dbList.findIndex((testItem) => {
        return testItem.path === filePath
      })
      if (found > -1) {
        this.dbList.splice(found, 1)
      }
      this.dbList.unshift(item)
      setTimeout(()=>{
        this.selectBankItem(item)
        this.saveHistory()
      },300)

    },
    openDb () {
      if (!this.selectedItem.path) {
        message.error('请先选择密码库')
      }
      passwordModel.openFile(this.password, this.selectedItem.path, null, (err,dbInfo) => {
        if (err) {
          this.password=''
          message.error('打开密码库失败，请确认主密码正确且选择了正确的秘钥文件（如果有。点击更多选项进行选择）。')
        } else {
          //message.success('打开密码库成功。')
          Modal.confirm({
            centered:true,
            title:'切换密码库',
            content:'是否切换当前的密码库到：「'+dbInfo.name+'」，切换密码库会导致浏览器的填充密码被调整为新的密码库中的密码。',
            okText:'切换',
            onOk:()=>{

              this.filterInfo.type='all'
              this.setDb({
                filePath:this.selectedItem.path,
                kdbx:dbInfo.db,
                tags:dbInfo.tags,
                name:dbInfo.name
              })
              this.$router.push({name:'passwords',params:{value:'',type:'all'}})
            }
          })
        }
      })
    },
    selectKey () {
      const keyPath = ipc.sendSync('selectKey')
      if (keyPath)
        this.keyPath = keyPath
    },
    removeKey () {
      this.keyPath = ''
    },
    doCreate () {
      if (!this.newPassword) {
        message.error('请输入密码库主密码。')
        return
      }

      const filePath = ipc.sendSync('createKdbx', { name: this.newName })
      if (!filePath) {
        return
      }
      passwordModel.create(this.newName, filePath, this.newPassword, () => {
        let item = {
          id: Date.now(),
          text: this.newName,
          path: filePath,
          lastOpen: Date.now()
        }
        this.dbList.unshift(item)
        this.newPassword = ''
        this.newName = '新密码库'
        this.visibleInputPwd = false
        message.success('密码库创建成功。')
        this.selectBankItem(item)
        this.saveHistory()
      })
    },
    saveHistory () {
      this.saveDbList()
    },
    removeBank (index) {
      Modal.confirm({
        centered: true,
        content: '是否移除记录？此行为不会删除密码库。',
        onOk: () => {
          this.dbList.splice(index, 1)
          this.saveHistory()
        }
      })

    },
    unselectBankItem () {
      // 点击选中的状态
      this.bankIndex = 0
      // 将点击选中的内容放入输入框中
      this.bankValue = ''
    },
    // 选中每一项内容放入输入框中
    selectBankItem (v) {
      // 点击选中的状态
      this.bankIndex = v.id
      // 将点击选中的内容放入输入框中
      this.bankValue = v.text
      this.selectedItem = v
    }
  },
}
</script>
<style>
.collapse-addon .ant-collapse > .ant-collapse-item > .ant-collapse-header {
  padding: 0;
}

.collapse-addon .ant-collapse-ghost > .ant-collapse-item > .ant-collapse-content > .ant-collapse-content-box {
  padding: 0;
}
</style>
<style lang="scss" scoped>

.action {
  .icon {
    font-size: 44px;
  }

  padding: 20px;
  cursor: pointer;

  &:hover {
    background: #f1f1f1;
    border-radius: 4px;
  }
}

.addon {
  font-size: 12px;
  color: #999;
}

.key-file {
  padding-right: 15px;
  position: relative;
  color: #333;
  overflow: hidden;
  word-break: break-word;
  text-overflow: ellipsis;
  width: 300px;
  white-space: nowrap;
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

  .password-bank-list-container {
    margin-top: 8px;
    width: 328px;

    .password-bank-list-item {
      position: relative;
      display: flex;
      align-items: center;
      padding: 8px 23px;

      &:hover {
        .remove-icon {
          display: inline-block;
        }
      }

      .remove-icon {
        cursor: pointer;
        right: 10px;
        position: absolute;
        display: none;
        opacity: 0.5;
        padding-left: 0;
        margin-left: 0;
        width: 20px;
        text-align: center;

        &:hover {
          opacity: 1;
        }
      }

      img {
        width: 16px;
        height: 16px;
      }

      .name {
        padding-left: 13px;
      }
    }
  }
}

.bank_active {
  background: rgba(0, 0, 0, 0.04);
  border-radius: 6px;
}
</style>
