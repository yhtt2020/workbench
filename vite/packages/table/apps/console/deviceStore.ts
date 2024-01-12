import {defineStore} from "pinia";
import dbStorage from "../../store/dbStorage";
import {nanoid} from "nanoid";
import {sUrl} from "../../consts";
import {post} from "../../js/axios/request"
const getClients=sUrl('/app/device/getClients')

// @ts-ignore
export const deviceStore = defineStore("deviceStore", {
    state: () => ({
        files: [],
        clients: [
          {
            name: 'gtr-6',
            os: 'windows11',
            ip: '117.257.15.231',
            keepOnlineTime: 26
          },
          {
            name: 'gtr-5',
            os: 'windows11',
            ip: '117.257.15.11',
            keepOnlineTime: 26
          }]
      }
    ),
    actions: {
      handleClients(clients){
          return clients.map(client=>{
            return {
              ...client,
              os:client.platform,
              keepOnlineTime:(Date.now()-client.updateTime)/1000/60/60
            }
          }).sort(client=>{
            return client.updateTime-client.updateTime>0?-1:1
          })
      },
      async updateDeviceList() {
        let rs = await post(getClients)
        if (rs?.status) {
          this.clients = this.handleClients(rs.data)
        }else{
          this.clients=[]
        }
      }
    }
  }
)
