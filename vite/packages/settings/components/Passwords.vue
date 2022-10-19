<script  lang="ts">
import { cloneDeep } from 'lodash-es';
import {message} from 'ant-design-vue'
import {EyeOutlined,EyeInvisibleOutlined,EllipsisOutlined,DeleteOutlined,EditOutlined,CheckOutlined,CloseCircleOutlined} from '@ant-design/icons-vue'
const columns = [
  {
    title: '网站',
    dataIndex: 'domain',
    key: 'domain',
    resizable:true,
    width:150,
    ellipsis:true,
  },
  {
    title: '名称',
    dataIndex: 'name',
    key: 'name',
  },
  {
    title: '账号',
    dataIndex: 'username',
    key: 'username',
  },
  {
    title: '密码',
    dataIndex: 'password',
    key: 'password',
  },
  {
    title: '',
    dataIndex: 'show',
    key: 'show',
  },{
  title:'',
    dataIndex: 'action',
    key:'action'
  }
];
const editableData={}

export default {
  name: 'Passwords',
  components:{
    EyeOutlined,EyeInvisibleOutlined,EllipsisOutlined,
    DeleteOutlined,EditOutlined,CheckOutlined,CloseCircleOutlined
  },
  data() {
    return {
      columns,
      passwords:[],
      editableData
    };
  },
  async mounted() {
    this.passwords = await ipc.invoke('credentialStoreGetCredentials')
      this.passwords.forEach(password=>{
        password.show=false
      })
      console.log(this.passwords)
  },
  methods:{
    async delAccount(account) {
      await ipc.invoke('credentialStoreDeletePassword', {
        domain: account.domain,
        username: account.username
      })
      this.passwords.splice(this.passwords.indexOf(account), 1)
    },
    edit(domain: string,username:string){
      this.editableData[domain+'_'+username] = cloneDeep(this.passwords.filter(item => (domain===item.domain && username===item.username))[0]);
    },
    save (domain: string,username:string){
      let oldData=this.passwords.filter(item => (domain===item.domain && username===item.username))[0]
      let saveData=this.editableData[domain+'_'+username]
      if(saveData.username!==oldData.username){
        //编辑了账号的情况下，要排重
        let test=this.passwords.filter(item => (domain===item.domain && item.username===saveData.username)).length>=1
        console.log(saveData,'savedata')
        console.log(test)
        if(test){
          message.error('不可设置为已经存在的账号名称。')
          return
        }
      }
      //Object.assign(oldData, this.editableData[domain+'_'+username]);
      ipc.invoke('credentialStoreSetPassword',{
        newUsername:saveData.username,
        username:oldData.username,
        name:saveData.name,
        domain:oldData.domain,
        password:saveData.password
      })
      Object.assign(oldData, this.editableData[domain+'_'+username]);
      delete editableData[domain+'_'+username];
    },
    cancelSave(domain: string,username:string){
      delete editableData[domain+'_'+username];
    }
  }
}
</script>

<template>
  <a-table :columns="columns" :data-source="passwords">
    <template #headerCell="{ column }">
      <template v-if="column.key === 'name'">
        <span>
          <smile-outlined/>
          名称
        </span>
      </template>
    </template>

    <template #bodyCell="{ column, record }">
      <template v-if="column.key === 'domain'">
        <a :href="'http://'+record.domain" target="_blank">
          {{ record.domain }}
        </a>
      </template>
      <template v-else-if="column.key === 'name'">
        <div v-if="editableData[record.domain+'_'+record.username]" class="editable-cell-input-wrapper">
          <a-input v-model:value="editableData[record.domain+'_'+record.username].name" @pressEnter="save(record.domain,record.username)" />
        </div>
        <div v-else class="editable-cell-text-wrapper">
          {{ record.name }}
        </div>
      </template>
      <template v-else-if="column.key === 'username'">
        <div v-if="editableData[record.domain+'_'+record.username]" class="editable-cell-input-wrapper">
          <a-input v-model:value="editableData[record.domain+'_'+record.username].username" @pressEnter="save(record.domain,record.username)" />
        </div>
        <div v-else class="editable-cell-text-wrapper">
          {{ record.username }}
        </div>
      </template>
      <template v-if="column.key === 'password'">
        <div v-if="editableData[record.domain+'_'+record.username]" class="editable-cell-input-wrapper">
          <a-input v-model:value="editableData[record.domain+'_'+record.username].password" @pressEnter="save(record.domain,record.username)" />
        </div>
        <div v-else class="editable-cell-text-wrapper">
          <span v-if="record.show">
           {{ record.password }}
        </span>
          <span v-else>
           {{ '•••••••••' }}
        </span>
        </div>

      </template>
      <template v-else-if="column.key==='show'">
        <a-button @click="record.show=!record.show" type="primary" shape="circle" size="small">
          <span v-if="!record.show">
             <eye-outlined />
          </span>
          <span v-else>
            <eye-invisible-outlined />
          </span>
        </a-button>
      </template>
      <template v-else-if="column.key === 'tags'">
        <span>
          <a-tag
            v-for="tag in record.tags"
            :key="tag"
            :color="tag === 'loser' ? 'volcano' : tag.length > 5 ? 'geekblue' : 'green'"
          >
            {{ tag.toUpperCase() }}
          </a-tag>
        </span>
      </template>
      <template v-else-if="column.key === 'action'">
        <a-dropdown v-if="!editableData[record.domain+'_'+record.username]">
          <span class="ant-dropdown-link" @click.prevent>
            <ellipsis-outlined style="font-size: 22px" />
          </span>
          <template #overlay>
            <a-menu>
              <a-menu-item>
                <a @click="delAccount(record)" href="javascript:;"><delete-outlined /> 删除</a>
              </a-menu-item>

              <a-menu-item>
                <a @click="edit(record.domain,record.username)"><edit-outlined/> 编辑</a>
              </a-menu-item>
<!--              <a-menu-item>-->
<!--                <a href="javascript:;">2nd menu item</a>-->
<!--              </a-menu-item>-->
<!--              <a-menu-item>-->
<!--                <a href="javascript:;">3rd menu item</a>-->
<!--              </a-menu-item>-->
            </a-menu>
          </template>
        </a-dropdown>
        <div style="font-size: 20px" v-else>
          <check-outlined class="editable-cell-icon-check" @click="save(record.domain,record.username)" />
          &nbsp;
          <close-circle-outlined @click="cancelSave(record.domain,record.username)"/>

        </div>
      </template>
    </template>
  </a-table>
</template>

<style scoped>

label {
  margin: 0 0.5em;
  font-weight: bold;
}

code {
  background-color: #eee;
  padding: 2px 4px;
  border-radius: 4px;
  color: #304455;
}
</style>
