const kdbxweb=require('kdbxweb')
const { readXoredValue, makeXoredValue } = require('../util/byte-utils')
require('../util/kdbxweb/protected-value-ex')
class KdbxModel {
  name
  db

  argon2(password, salt, memory, iterations, length, parallelism, type, version) {
    const args = { password, salt, memory, iterations, length, parallelism, type, version };
    return this.loadRuntime(memory).then((runtime) => {
     // const ts = logger.ts();
      return runtime.hash(args).then((hash) => {
        //logger.debug('Hash computed', logger.ts(ts));
        return hash;
      });
    });
  }
  _argon2(password, salt, options) {
    const fileName = `argon2-${process.platform}-${process.arch}.node`;
    const argon2 = require('@keeweb/keeweb-native-modules/'+fileName);

    password = readXoredValue(password);
    salt = readXoredValue(salt);

    return new Promise((resolve, reject) => {
      try {
        argon2.hash(password, salt, options, (err, res) => {
          password.fill(0);
          salt.fill(0);

          if (err) {
            reject(err);
          } else {
            resolve(makeXoredValue(res));
          }
        });
      } catch (e) {
        reject(e);
      }
    });
  }
  loadRuntime(requiredMemory){
    let argon2Func=this._argon2
    this.runtimeModule = {
      hash(args) {
        //const ts = logger.ts();

        let bin=kdbxweb.ProtectedValue.fromBinary(args.password)
        console.log(bin,'bin')
        const password = kdbxweb.ProtectedValue.fromBinary(args.password).dataAndSalt();
        const salt = kdbxweb.ProtectedValue.fromBinary(args.salt).dataAndSalt();

        return argon2Func(password, salt, {
          type: args.type,
          version: args.version,
          hashLength: args.length,
          saltLength: args.salt.length,
          timeCost: args.iterations,
          parallelism: args.parallelism,
          memoryCost: args.memory
        })
          .then((res) => {
            password.data.fill(0);
            salt.data.fill(0);

            //logger.debug('Argon2 hash calculated', logger.ts(ts));

            res = new kdbxweb.ProtectedValue(res.data, res.salt);
            return res.getBinary();
          })
          .catch((err) => {
            password.data.fill(0);
            salt.data.fill(0);

            //logger.error('Argon2 error', err);
            throw err;
          });
      }
    };
    return Promise.resolve(this.runtimeModule);
  }
  constructor () {
    kdbxweb.CryptoEngine.setArgon2Impl((...args) => this.argon2(...args));
  }
  async create (name = 'kdb',path,pwd) {
    this.path=path
    const password = kdbxweb.ProtectedValue.fromString(pwd);
    const credentials = new kdbxweb.Credentials(password);
    //kdbxweb.CryptoEngine.setArgon2Impl((...args) => this.argon2(...args));
    this.db = kdbxweb.Kdbx.create(credentials, name);
    let group = this.db.createGroup(this.db.getDefaultGroup(), 'subgroup');
    let entry = this.db.createEntry(group);
    this.name = name;

    this.save()
    // this.readModel();
    // this.set({ active: true, created: true, name });
  }
  async save () {
    const dataAsArrayBuffer = await this.db.save()
    require('fs').writeFile(this.path, Buffer.from(dataAsArrayBuffer),()=>{});
  }
}
module.exports=KdbxModel
