<script lang="ts">
import {cloneDeep} from 'lodash-es';
import {message,Modal} from 'ant-design-vue'
import {
  FilterOutlined,
  SearchOutlined,
  EyeOutlined,
  EyeInvisibleOutlined,
  EllipsisOutlined,
  DeleteOutlined,
  EditOutlined,
  CheckOutlined,
  CloseCircleOutlined,
  ExportOutlined
} from '@ant-design/icons-vue'

  ;

const editableData = {}

export default {
  name: 'Passwords',
  components: {
    FilterOutlined,ExportOutlined,
    SearchOutlined, EyeOutlined, EyeInvisibleOutlined, EllipsisOutlined,
    DeleteOutlined, EditOutlined, CheckOutlined, CloseCircleOutlined
  },
  data() {
    return {
      columns: [
        {
          title: '网站',
          dataIndex: 'domain',
          key: 'domain',
          resizable: true,
          width: 250,
          ellipsis: true,
          customFilterDropdown: true,
          onFilter: (value, record) =>
            record.name.toString().toLowerCase().includes(value.toLowerCase()),
          onFilterDropdownVisibleChange: visible => {
            if (visible) {
              setTimeout(() => {
                console.log(this.$refs.searchInput)
                this.$refs.searchInput.focus();
              }, 100);
            }
          },
        },
        {
          title: '名称',
          dataIndex: 'name',
          key: 'name',
          filters: [
            {text: '未命名', value: 'noname'},
            {text: '已命名', value: 'named'},
          ],
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
        }, {
          title: '',
          dataIndex: 'action',
          key: 'action'
        }
      ],
      passwords: [],
      editableData,
      filters: {

      },
      searchText: '',
      searchColumn: '',

    };
  },
  computed: {},
  async mounted() {
    this.passwords = await ipc.invoke('credentialStoreGetCredentials')
    this.passwords.forEach(password => {
      password.show = false
    })
  },
  methods: {
    displayData() {
      let result = this.passwords.filter((item) => {
        let pass
        if (this.filters['name']) {
          let matchNameNamed=false
          let matchNameNoName=false
          let name = item.name || ''
          if (this.filters['name'].indexOf('noname') > -1) {
            if (name === '') {
              matchNameNoName = true
            }
          }
          if (this.filters['name'].indexOf('named') > -1) {
            if (name !== '') {
              matchNameNamed = true
            }
          }
          pass= matchNameNamed || matchNameNoName
        }else{
          pass=true
        }
        if (pass) {
          //如果通过了名称筛选，再测试搜索
          if (this.searchColumn!=='' && this.searchText !== '') {
            console.log('text=',this.searchText,'column=',this.searchColumn)
            return item[this.searchColumn].indexOf(this.searchText) > -1
          }else{
            return true
          }
        }else{
          return false
        }
      })
      return result
    },
    async delAccount(account) {
      Modal.confirm({
        content:'确认删除密码？此操作不可还原。',
        centered:true,
        onOk:async () => {
          await ipc.invoke('credentialStoreDeletePassword', {
            domain: account.domain,
            username: account.username
          })
          this.passwords.splice(this.passwords.indexOf(account), 1)
        }
      })
    },
    edit(domain: string, username: string) {
      this.editableData[domain + '_' + username] = cloneDeep(this.passwords.filter(item => (domain === item.domain && username === item.username))[0]);
    },
    save(domain: string, username: string) {
      let oldData = this.passwords.filter(item => (domain === item.domain && username === item.username))[0]
      let saveData = this.editableData[domain + '_' + username]
      if (saveData.username !== oldData.username) {
        //编辑了账号的情况下，要排重
        let test = this.passwords.filter(item => (domain === item.domain && item.username === saveData.username)).length >= 1
        console.log(saveData, 'savedata')
        console.log(test)
        if (test) {
          message.error('不可设置为已经存在的账号名称。')
          return
        }
      }
      //Object.assign(oldData, this.editableData[domain+'_'+username]);
      ipc.invoke('credentialStoreSetPassword', {
        newUsername: saveData.username,
        username: oldData.username,
        name: saveData.name,
        domain: oldData.domain,
        password: saveData.password
      })
      Object.assign(oldData, this.editableData[domain + '_' + username]);
      delete editableData[domain + '_' + username];
    },
    cancelSave(domain: string, username: string) {
      delete editableData[domain + '_' + username];
    },
    handleTableChange(
      pag: { pageSize: number; current: number },
      filters: any,
      sorter: any,
    ) {
      this.filters = filters
    },
    handleSearch(selectedKeys, confirm, dataIndex) {
      console.log('handleSearch',dataIndex)
      this.searchColumn = dataIndex
    },
    handleReset() {
      this.searchText = ''
      this.searchColumn=''
    },
    filterDomain(domain){
      this.searchText=domain
      this.searchColumn='domain'
    }
  }
}
</script>

<template>
  <div>
    <div style="margin-bottom: 10px">
      <a-tag  v-if="this.searchColumn && this.searchText" :closable='true' @close='()=>{this.searchText="";this.searchColumn=""}'
             color="#108ee9">网站：{{this.searchText}}</a-tag>
      <span v-if="this.filters['name']">
      <a-tag v-for="name in this.filters['name']"  @close="()=>{
        this.filters['name'].splice(this.filters['name'].indexOf(name),1)
      }"
             color="#108ee9">{{name==='named'?'已命名':'未命名'}}</a-tag>
      </span>
    </div>

  </div>
  <a-table style="user-select: text" @change="handleTableChange" :columns="columns" :data-source="displayData()">
    <template #headerCell="{ column }">
      <template v-if="column.key === 'name'">
        <span>
          <smile-outlined/>
          名称
        </span>
      </template>
    </template>
    <template
      #customFilterDropdown="{ setSelectedKeys, selectedKeys, confirm, clearFilters, column }"
    >
      <div style="padding: 8px">
        <a-input
          ref="searchInput"
          :placeholder="`搜索 ${column.title}`"
          v-model:value="searchText"
          style="width: 188px; margin-bottom: 8px; display: block"
          @pressEnter="handleSearch(selectedKeys, confirm, column.dataIndex)"
        />
        <a-button
          type="primary"
          size="small"
          style="width: 90px; margin-right: 8px"
          @click="handleSearch(selectedKeys, confirm, column.dataIndex)"
        >
          <template #icon>
            <SearchOutlined/>
          </template>
          搜索
        </a-button>
        <a-button size="small" style="width: 90px" @click="handleReset(clearFilters)">
          重置
        </a-button>
      </div>
    </template>
    <template #customFilterIcon="{ filtered,column }">
      <filter-outlined v-if="column.dataIndex==='name'" :style="{ color: filtered ? '#108ee9' : undefined }"/>
      <search-outlined v-else :style="{ color: (this.searchText!=='' && this.searchColumn===column.dataIndex) ? '#108ee9' : undefined }"/>
    </template>
    <template #bodyCell="{ column, record }">
      <template v-if="column.key === 'domain'">
        <a-dropdown>
          <a class="ant-dropdown-link" @click.prevent>
            {{ record.domain }}
          </a>
          <template #overlay>
            <a-menu>
              <a-menu-item>
                <a @click="filterDomain(record.domain)" href="javascript:;"><search-outlined></search-outlined> 只看此网站的账号</a>
              </a-menu-item>
              <a-menu-item>
                <a :href="'http://'+record.domain" target="_blank" href="javascript:;"><export-outlined /> 打开此网站</a>
              </a-menu-item>
            </a-menu>
          </template>
        </a-dropdown>

      </template>
      <template v-else-if="column.key === 'name'">
        <div v-if="editableData[record.domain+'_'+record.username]" class="editable-cell-input-wrapper">
          <a-input v-model:value="editableData[record.domain+'_'+record.username].name"
                   @pressEnter="save(record.domain,record.username)"/>
        </div>
        <div v-else class="editable-cell-text-wrapper">
          {{ record.name }}
        </div>
      </template>
      <template v-else-if="column.key === 'username'">
        <div v-if="editableData[record.domain+'_'+record.username]" class="editable-cell-input-wrapper">
          <a-input v-model:value="editableData[record.domain+'_'+record.username].username"
                   @pressEnter="save(record.domain,record.username)"/>
        </div>
        <div v-else class="editable-cell-text-wrapper">
          {{ record.username }}
        </div>
      </template>
      <template v-if="column.key === 'password'">
        <div v-if="editableData[record.domain+'_'+record.username]" class="editable-cell-input-wrapper">
          <a-input v-model:value="editableData[record.domain+'_'+record.username].password"
                   @pressEnter="save(record.domain,record.username)"/>
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
             <eye-outlined/>
          </span>
          <span v-else>
            <eye-invisible-outlined/>
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
            <ellipsis-outlined style="font-size: 22px"/>
          </span>
          <template #overlay>
            <a-menu>
              <a-menu-item>
                <a @click="delAccount(record)" href="javascript:;">
                  <delete-outlined/>
                  删除</a>
              </a-menu-item>

              <a-menu-item>
                <a @click="edit(record.domain,record.username)">
                  <edit-outlined/>
                  编辑</a>
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
          <check-outlined class="editable-cell-icon-check" @click="save(record.domain,record.username)"/>
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
