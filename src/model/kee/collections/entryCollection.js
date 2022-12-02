const Collection=require('../../base/collection');
const EntryModel=require('../entryModel');

class EntryCollection extends Collection {
    static model = EntryModel;
}

module.exports=EntryCollection
