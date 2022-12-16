const Collection=require('../../base/collection');
const  GroupModel =require('../groupModel');

class GroupCollection extends Collection {
  static model = GroupModel;
}

module.exports=GroupCollection
