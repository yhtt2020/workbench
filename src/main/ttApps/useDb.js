/**
 * 二次封装db ttapp.js
 */
const { SqlDb } = require("../../util/sqldb");

const sqlDb = new SqlDb();
const ttAppModel = {
  /**
   * 初始化数据库
   */
  async initDb() {
    // 是否存在ttApp表
    let exists = await sqlDb.knex.schema.hasTable("ttApp");
    // 不存在则创建
    if (!exists) {
      await sqlDb.knex.schema.createTable("ttApp", function (t) {
        t.string("id").primary().unique(); // 唯一ID
        t.string("modules"); // 模块
      });
    }
    // let sql = `INSERT INTO ttApp VALUES ('${id}')`;
    // sqlDb.knex.raw(sql).then((resp) => {
    //   console.log("resp :>> ", resp);
    // });
  },
  /**
   * 插入数据
   */
  async insert(data) {
    try {
      // let { id, modules } = ttAppData;
      // let sql = `INSERT INTO ttApp VALUES ('${id}', '${modules}')`;
      // let res = await sqlDb.knex.raw(sql);
      await ttAppModel.initDb();

      const { id, modules } = data;
      return sqlDb
        .knex("ttApp")
        .insert({ id, modules })
        .then(() => {
          return true;
        })
        .catch((err) => {
          console.log(err);
        });
      return res;
    } catch (err) {
      console.log(err);
      return false;
    }
  },
  /**
   * 删除
   */
  async del(id) {
    try {
      await sqlDb.knex("ttApp").where({ id: id }).del();
      return true;
    } catch (err) {
      console.log(err);
      return false;
    }
  },
  /**
   * 查询所有
   */
  async selectAll() {
    let sql = `SELECT * FROM ttApp`;
    let res = await sqlDb.knex.raw(sql);
    return res;
  },
  /**
   * 查询
   */
  async select(id) {
    let sql = `SELECT * FROM ttApp WHERE id='${id}'`;
    let res = await await sqlDb.knex.raw(sql);
    return res;
  },

  // 增删改查
  // https://blog.csdn.net/m0_51810668/article/details/131277990
  // https://cloud.tencent.com/developer/information/%E4%BD%BF%E7%94%A8knexjs%E5%B0%86%E6%95%B0%E6%8D%AE%E6%8F%92%E5%85%A5sqlite%E6%97%B6%E5%87%BA%E7%8E%B0%E9%97%AE%E9%A2%98-article
};

module.exports = ttAppModel;
