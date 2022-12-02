const logger = require('../../util/logger')
const kdbxweb = require('kdbxweb')
const { readXoredValue, makeXoredValue } = require('../../util/byte-utils')

const kdbxwebInit={
  init(){
    kdbxweb.CryptoEngine.setArgon2Impl((...args) => this.argon2(...args));
  },
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
  },
  argon2(password, salt, memory, iterations, length, parallelism, type, version) {
    const args = { password, salt, memory, iterations, length, parallelism, type, version };
    return this.loadRuntime(memory).then((runtime) => {
      const ts = logger.ts();
      return runtime.hash(args).then((hash) => {
        logger.debug('Hash computed', logger.ts(ts));
        return hash;
      });
    });
  },
  loadRuntime(requiredMemory){
    let argon2=this._argon2
    this.runtimeModule = {
      hash(args) {
        const ts = logger.ts();
        let bin=kdbxweb.ProtectedValue.fromBinary(args.password)
        const password = kdbxweb.ProtectedValue.fromBinary(args.password).dataAndSalt();
        const salt = kdbxweb.ProtectedValue.fromBinary(args.salt).dataAndSalt();

        return argon2(password, salt, {
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

            logger.debug('Argon2 hash calculated', logger.ts(ts));
            res = new kdbxweb.ProtectedValue(res.data, res.salt);
            return res.getBinary();
          })
          .catch((err) => {
            password.data.fill(0);
            salt.data.fill(0);

            logger.error('Argon2 error', err);
            throw err;
          });
      }
    };
    return Promise.resolve(this.runtimeModule);
  }
}
module.exports=kdbxwebInit
