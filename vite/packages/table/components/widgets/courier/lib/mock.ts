import grab from './grab'
import {message} from 'ant-design-vue'

export const courier=([
    {
        name:'ZT00003618100',
        company:'中通快递',
        status:'已签收',
        time:'2022-06-08 15:00:00',
        road:'快件在【北京环铁站】装车,正发往【北京分拨中心】快件在【北京环铁站】装车,正发往【北京分拨中心】快件在【北京环铁站】装车,正发往【北京分拨中心】快件在【北京环铁站】装车,正发往【北京分拨中心】快件在【北京环铁站】装车,正发往【北京分拨中心】快件在【北京环铁站】装车,正发往【北京分拨中心】',
        state:2
    },
    {
        name:'ZT00003618100',
        company:'中通快递',
        status:'在途中',
        time:'2022-06-08 15:00:00',
        road:'快件在【北京环铁站】装车,正发往【北京分拨中心】',
        state:1
    },
    {
        name:'ZT00003618100',
        company:'中通快递',
        status:'已揽收',
        time:'2022-06-08 15:00:00',
        road:'快件在【北京环铁站】装车,正发往【北京分拨中心】',
        state:2
    },
    {
        name:'ZT00003618100',
        company:'中通快递',
        status:'已签收',
        time:'2022-06-08 15:00:00',
        road:'快件在【北京环铁站】装车,正发往【北京分拨中心】',
        state:3
    },
    {
        name:'ZT00003618100',
        company:'中通快递',
        status:'在途中',
        time:'2022-06-08 15:00:00',
        road:'快件在【北京环铁站】装车,正发往【北京分拨中心】',
        state:4
    },
    {
        name:'ZT00003618100',
        company:'中通快递',
        status:'已揽收',
        time:'2022-06-08 15:00:00',
        road:'快件在【北京环铁站】装车,正发往【北京分拨中心】',
        state:1
    },
    {
        name:'ZT00003618100',
        company:'中通快递',
        status:'已签收',
        time:'2022-06-08 15:00:00',
        road:'快件在【北京环铁站】装车,正发往【北京分拨中心】',
        state:2
    },
    {
        name:'ZT00003618100',
        company:'中通快递',
        status:'在途中',
        time:'2022-06-08 15:00:00',
        road:'快件在【北京环铁站】装车,正发往【北京分拨中心】',
        state:4
    },
    {
        name:'ZT00003618100',
        company:'中通快递',
        status:'已揽收',
        time:'2022-06-08 15:00:00',
        road:'快件在【北京环铁站】装车,正发往【北京分拨中心】快件在【北京环铁站】装车,正发往【北京分拨中心】快件在【北京环铁站】装车,正发往【北京分拨中心】',
        state:3
    },
])
// 处理不同快递状态背景颜色
export const switchColor=(state)=>{
    switch (state) {
        case "0":
            return '#508BFE';//暂无轨迹信息
            break;
        case "1":
            return '#43CADE';//已揽收
            break;
        case "2":
            return '#508BFE';//在途中
            break;
        case "3":
            return '#FA7B14';//签收
            break;
        case "4":
            return '#FF4D4F ';//问题件
            break;
        case "5":
            return '#FF4D4F ';//转寄
            break;
        case "6":
            return '#FF4D4F '; //清关
            break;

        default:
            return '#508BFE';
    }
}

export function convertJdStatusColor(status){
  switch (status) {
    case "0":
      return '#508BFE';
      break;
    case "1":
      return '#43CADE';
      break;
    case "等待收货":
      return '#508BFE';
      break;
    case "已完成":
      return '#FA7B14';
      break;
    case "4":
      return '#FF4D4F ';
      break;
    case "5":
      return '#FF4D4F ';
      break;
    case "6":
      return '#FF4D4F ';
      break;

    default:
      return '#508BFE';
  }
}
// 解析部分常见快递公司
export const kdCompany=(shipperCode)=>{
    switch (shipperCode) {
        case 'SF':
            return '顺丰快递';
            break;
        case 'ZTO':
            return '中通快递';
            break;
        case 'YTO':
            return '圆通快递';
            break;
        case 'HTKY':
            return '百世快递';
            break;
        case 'STO':
            return '申通快递';
            break;
        case 'YZPY':
            return '邮政快递包裹';
            break;
        case 'EMS':
            return 'EMS';
            break;
        case 'JD':
            return '京东快递';
            break;
        case 'YD':
            return '韵达快递';
            break;
        case 'JTSD':
            return '极兔速递';
            break;
        case 'CNSD':
            return '菜鸟直送';
            break;
        case 'CNCY':
            return '菜鸟橙运';
            break;
    }
}

export function kdState(state:any){
    switch (state) {
        case "0":
            return '暂无轨迹信息';
            break;
        case "1":
            return '已揽收';
            break;
        case "2":
            return '在途中';
            break;
        case "3":
            return '已签收';
            break;
        case "4":
            return '问题件';
            break;
        case "5":
            return '转寄';
            break;
        case "6":
            return '清关';
            break;
        case "202":
            return "派送中";
            break;
        case "211":
            return "待取件";
            break;
        case '301':
            return '签收'
            break;
        case '302':
            return '派件异常后最终签收'
            break;
        case '304':
            return '代收签收'
            break;
        case '311':
            return '驿站签收'
            break;
        case '401':
            return '发货无信息'
            break;
        case '402':
            return '超时未签收'
            break;
        case '403':
            return '超时未更新'
            break;
        case '404':
            return '拒收/退件'
            break;
        case '412':
            return '超时未取'
            break;
        case '405':
            return '派件异常'
            break;
        case '416':
            return '无法联系'
            break;
    }
}

export function stateColor(state:any){
    switch (state) {
     case "0":
        return '#508BFE';
     case "1":
        return '#43CADE';
        break;
     case "2":
         return '#508BFE';
     case "3":
         return '#FA7B14';
     case "4":
        return '#52C41A';
     case "5":
         return '#508BFE';
     case "6":
         return '#508BFE';
     default:
         return '#508BFE';
    }
}

