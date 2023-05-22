const messages = require("./protoc/game-assist_pb");
const services = require("./protoc/game-assist_grpc_pb");
const grpc = require("@grpc/grpc-js");
// function main() {
//   // 创建一个grpc的客户端连接
//   // 参数就是地址和认证方式
//   // 认证方式要和服务端一致，否则就会导致认证失败
//   const client = new services.UserInfoClient("127.0.0.1:50051", grpc.credentials.createInsecure());
//   // 定义请求的对象
//   const req = new messages.User();
//   // 设置请求的内容
//   req.setName("terence");
//   req.setId('10');
//   // 通过客户端调用服务端的sayHeyarnllo函数，通过回调知道返回信息
//   client.info(req, (err, res) => {
//     // 返回的res就是服务端定义的reply
//     // 这里获取指定字段的信息就是使用get
//     // 比如这里返回的res，要获取里面msg字段，那么就需要使用getMsg()这个方法
//     console.log(res.getMessage());
//   });
// }
const proto = grpc.loadPackageDefinition()
var client = new services.InspectorClient('127.0.0.1:50051',
  grpc.credentials.createInsecure());

 const inspector = {
  async getFPS() {
    let request=new messages.Empty({})
    return new Promise((resolve,reject)=>{
       client.getFPS(request,(err,response)=>{
         if(err){
           console.error('客户端返回error',err)
           reject(err)
         }
         resolve(response.getFps())
       })
    })
    // try{
    //   let response=
    //   console.log(response)
    //
    // }catch(e){
    //   console.warn('客户端返回error',e)
    // }
  }
}

const rpc={
   inspector
}

module.exports=rpc
