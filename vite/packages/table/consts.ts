//系统应用变量
const SystemApps = {
  //网易云音乐
  wyyMusic: {
    theme: '#242424',
    name: 'wyyMusic',
    url: 'https://music.163.com',
    preload: 'wyyMusic',
    background: true,
  }
}
let ActionGroups = [
  {
    title: '浏览器',
    name: 'browser',
    color: '#0a84ff',
    actions: [
      {
        title: '打开网页',
        name: 'addTab',
        summary: '打开一个网页，可以选择打开的位置和方式',
        defaultValue: {
          url: '',
          position: 'builtin',
          tab: 'current'
        },
        inputs: [
          {
            name: 'url',
            placeholder: '输入完整的带协议的的地址，例如https://www.apps.vip',
            title: '打开的网址',
            type: 'input',
            width: '26em'
          },
          {
            name: 'position',
            placeholder: '',
            title: '打开的位置',
            type: 'radio',
            options: [
              {
                name: '内置浏览器',
                value: 'builtin'
              },
              {
                name: '系统浏览器',
                value: 'system'
              },
              {
                name: '工作台',
                value: 'table'
              }
            ]
          }, {
            assign: {position: 'builtin'},
            name: 'tab',
            title: '打开位置',
            type: 'radio',
            options: [{
              name: '当前标签组',
              value: 'current'
            }, {
              name: '创建新标签组打开',
              value: 'new'
            }]
          }
        ]
      },
      {
        summary: '在内置浏览器中创建一个标签组',
        title: '创建标签组',
        name: 'addTask',
        inputs: [{
          name: 'title',
          title: '名称',
          type: 'input',
          width: '26em',
          placeholder: '输入标签组名称'
        }]
      },
      {
        title: '打开密码管理器',
        summary: '直接打开内置的密码管理器',
        name: 'openPwdManager'
      },
      {
        title: '打开浏览器设置',
        summary: '直接打开浏览器的设置',
        name: 'openSettings'
      }
    ]
  },
  {
    title: '提示',
    name: 'tip',
    color: 'orange',

    actions: [
      {
        name: 'modal',
        title: '模态弹窗',
        summary: '弹窗提示',
        defaultValue:{
          closable:'true',
        },
        inputs: [
          {

            name: 'closable',
            type: 'switch',
            title: '是否可关闭'
          }
        ]
      }
    ]
  },
  {
    title: '命令行',
    key: 'cmd',
    color: '#999',
    actions: [
      {
        name: 'exe',
        title: '执行程序',
        summary: '选择一个外部程序，并执行相应的指令，支持单行和多行，具体可查看<a>此处帮助</a>',
        inputs: [
          {
            name: 'exe',
            title: '选择命令行工具：',
            type: 'file',
            placeholder: '点击选择命令行工具'
          },
          {
            name: 'cm',
            title: '参数，回车换行，每行参数会顺序执行',
            type: 'textarea',
          }
        ]
      },
      {
        name: 'cmd',
        title: '执行终端（CMD）程序',
        summary: '直接执行系统的命令行，windows下执行命令提示符，mac、linux下执行终端（暂未支持这两个平台）',
        inputs: [
          {
            name: 'cm',
            title: '参数，回车换行，每行参数会顺序执行',
            type: 'textarea',
          }
        ]
      },
      {
        name: 'nircmd',
        title: '执行nircmd的命令行',
        summary: '直接执行工作台内置的nircmd，可查考此处的nircmd的命令，此操作不需要再安装nircmd，工作台自带了。',
        inputs: [
          {
            name: 'cm',
            title: '参数，回车换行，每行参数会顺序执行',
            type: 'textarea',
          }
        ]
      }
    ]
  }
]
export {SystemApps, ActionGroups}
