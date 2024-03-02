const { SqlDb } = require("../util/sqldb");
const { nanoid } = require('nanoid')

const sqlDb = new SqlDb();
const ttAppModel = {
  /**
   * 初始化数据库
   */
  async initDb() {
    // 是否存在ttApp表
    console.log("----------- ttAppModel 我执行啦 -----------");

    let exists = await sqlDb.knex.schema.hasTable("ttApp");

    // 不存在则创建
    if (!exists) {
      console.log("object :>> ", object);
      await sqlDb.knex.schema.createTable("ttApp", function (t) {
        t.string("nanoid").primary().unique(); //本地id
      });
    }
    console.log("来了老弟 :>> ");
    // sqlDb.knex.raw("INSERT INTO ttApp VALUES ('wanan123')").then((resp) => {
    //   console.log("resp :>> ", resp);
    //   console.log("resp :>> ", resp);
    //   console.log("resp :>> ", resp);
    //   console.log("resp :>> ", resp);
    //   console.log("resp :>> ", resp);
    //   console.log("resp :>> ", resp);
    //   console.log("resp :>> ", resp);
    // });
    sqlDb
      .knex("ttApp")
      .insert({ nanoid: nanoid()})
      .then(() => {
        console.log("Inserted");
        console.log("Inserted");
        console.log("Inserted");
        console.log("Inserted");
        console.log("Inserted");
      })
      .catch((err) => {
        console.log(err);
      });
  },

  // 增删改查
  // https://blog.csdn.net/m0_51810668/article/details/131277990
  // https://cloud.tencent.com/developer/information/%E4%BD%BF%E7%94%A8knexjs%E5%B0%86%E6%95%B0%E6%8D%AE%E6%8F%92%E5%85%A5sqlite%E6%97%B6%E5%87%BA%E7%8E%B0%E9%97%AE%E9%A2%98-article
};

module.exports = ttAppModel;
