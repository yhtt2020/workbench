const { $ } = require('../../app')

function getNickname(){
  return $('#ttbar-login .nickname').text()
}
function isLogged(){
  return  $('#ttbar-login .nickname').length>0 ? !getNickname().includes('你好，请登录') : false
}
function loaded(){
  return $('#ttbar-login .nickname')
}
module.exports={
  getNickname,isLogged,loaded
}
