const kdbxweb=require('kdbxweb')
const Model=require('../base/model')
const { readXoredValue, makeXoredValue } = require('../../util/byte-utils')
require('../../util/kdbxweb/protected-value-ex')
const logger = require('../../util/logger')
// const GroupCollection = require('./collections/groupCollection')
// const GroupModel = require('./groupModel')
class FileModel extends Model{
  name
  db
  keyFile

  constructor (data) {
    super({
      entryMap: {},
      groupMap: {},
      ...data
    });
  }

  kdfArgsToString(header) {
    if (header.kdfParameters) {
      return header.kdfParameters
        .keys()
        .map((key) => {
          const val = header.kdfParameters.get(key);
          if (val instanceof ArrayBuffer) {
            return undefined;
          }
          return key + '=' + val;
        })
        .filter((p) => p)
        .join('&');
    } else if (header.keyEncryptionRounds) {
      return header.keyEncryptionRounds + ' rounds';
    } else {
      return '?';
    }
  }
  async create (name = 'kdb',path,pwd='',callback) {
    this.path=path
    const password = kdbxweb.ProtectedValue.fromString(pwd);
    const credentials = new kdbxweb.Credentials(password);
    //kdbxweb.CryptoEngine.setArgon2Impl((...args) => this.argon2(...args));
    this.db = kdbxweb.Kdbx.create(credentials, name);
    let group = this.db.createGroup(this.db.getDefaultGroup(), '密码组');
    let entry = this.db.createEntry(group);
    this.name = name;
    this.readModel();
    this.set({ active: true, created: true, name });
    this.db.save().then((data)=>{
      console.log('data=',data)
      callback(data)
    })

  }
  open(password, fileData, keyFileData, callback) {
    let passwordValue=kdbxweb.ProtectedValue.fromString(password)
    console.log('use',passwordValue)
    try {
      let  credentials
      //const challengeResponse = ChalRespCalculator.build(this.chalResp);

      console.log(keyFileData,'keyfile')
      credentials = new kdbxweb.Credentials(passwordValue);

      const ts = logger.ts();
      kdbxweb.Kdbx.load(fileData, credentials)
        .then((db) => {
          this.db = db;
        })
        .then(() => {
          // this.readModel();
          this.setOpenFile({ passwordLength: password ? password.textLength : 0 });
          if (keyFileData) {
            kdbxweb.ByteUtils.zeroBuffer(keyFileData);
          }
          logger.info(
            'Opened file ' +
            this.name +
            ': ' +
            logger.ts(ts) +
            ', ' +
            this.kdfArgsToString(this.db.header) +
            ', ' +
            Math.round(fileData.byteLength / 1024) +
            ' kB'
          );
          callback(undefined,{
            name:this.db.meta._name,
            db:this.db,
          });
        })
        .catch((err) => {
          if (
            err.code === kdbxweb.Consts.ErrorCodes.InvalidKey &&
            password &&
            !password.byteLength
          ) {
            logger.info(
              'Error opening file with empty password, try to open with null password'
            );
            return this.open(null, fileData, keyFileData, callback);
          }
          logger.error('Error opening file', err.code, err.message, err);
          callback(err);
        });
    } catch (e) {
      logger.error('Error opening file', e, e.code, e.message, e);
      callback(e);
    }
  }
  setOpenFile(props) {
    this.set({
      ...props,
      active: true,
      oldKeyFileName: this.keyFileName,
      oldPasswordLength: props.passwordLength,
      passwordChanged: false,
      keyFileChanged: false
    });
    this.oldPasswordHash = this.db.credentials.passwordHash;
    this.oldKeyFileHash = this.db.credentials.keyFileHash;
    this.oldKeyChangeDate = this.db.meta.keyChanged;
  }
  readModel() {
    //const groups = new GroupCollection();
    this.set(
      {
        uuid: this.db.getDefaultGroup().uuid.toString(),
        // groups,
        formatVersion: this.db.header.versionMajor,
        defaultUser: this.db.meta.defaultUser,
        recycleBinEnabled: this.db.meta.recycleBinEnabled,
        historyMaxItems: this.db.meta.historyMaxItems,
        historyMaxSize: this.db.meta.historyMaxSize,
        keyEncryptionRounds: this.db.header.keyEncryptionRounds,
        keyChangeForce: this.db.meta.keyChangeForce,
        kdfName: this.readKdfName(),
        kdfParameters: this.readKdfParams()
      },
      { silent: true }
    );
    // this.db.groups.forEach(function (group) {
    //   let groupModel = this.getGroup(this.subId(group.uuid.id));
    //   if (groupModel) {
    //     groupModel.setGroup(group, this);
    //   } else {
    //     groupModel = GroupModel.fromGroup(group, this);
    //   }
    //   groups.push(groupModel);
    // }, this);
    // this.buildObjectMap();
    // this.resolveFieldReferences();
  }
  readKdfName() {
    if (this.db.header.versionMajor === 4 && this.db.header.kdfParameters) {
      const kdfParameters = this.db.header.kdfParameters;
      let uuid = kdfParameters.get('$UUID');
      if (uuid) {
        uuid = kdbxweb.ByteUtils.bytesToBase64(uuid);
        switch (uuid) {
          case kdbxweb.Consts.KdfId.Argon2d:
            return 'Argon2d';
          case kdbxweb.Consts.KdfId.Argon2id:
            return 'Argon2id';
          case kdbxweb.Consts.KdfId.Aes:
            return 'Aes';
        }
      }
      return 'Unknown';
    } else {
      return 'Aes';
    }
  }

  readKdfParams() {
    const kdfParameters = this.db.header.kdfParameters;
    if (!kdfParameters) {
      return undefined;
    }
    let uuid = kdfParameters.get('$UUID');
    if (!uuid) {
      return undefined;
    }
    uuid = kdbxweb.ByteUtils.bytesToBase64(uuid);
    switch (uuid) {
      case kdbxweb.Consts.KdfId.Argon2d:
      case kdbxweb.Consts.KdfId.Argon2id:
        return {
          parallelism: kdfParameters.get('P').valueOf(),
          iterations: kdfParameters.get('I').valueOf(),
          memory: kdfParameters.get('M').valueOf()
        };
      case kdbxweb.Consts.KdfId.Aes:
        return {
          rounds: kdfParameters.get('R').valueOf()
        };
      default:
        return undefined;
    }
  }
}
FileModel.defineModelProperties({
  id: '',
  uuid: '',
  name: '',
  db: null,
  entryMap: null,
  groupMap: null,
  keyFileName: '',
  keyFilePath: null,
  chalResp: null,
  passwordLength: 0,
  path: '',
  opts: null,
  storage: null,
  modified: false,
  dirty: false,
  active: false,
  created: false,
  demo: false,
  groups: null,
  oldPasswordLength: 0,
  oldKeyFileName: '',
  passwordChanged: false,
  keyFileChanged: false,
  keyChangeForce: -1,
  syncing: false,
  syncError: null,
  syncDate: null,
  backup: null,
  formatVersion: null,
  defaultUser: null,
  recycleBinEnabled: null,
  historyMaxItems: null,
  historyMaxSize: null,
  keyEncryptionRounds: null,
  kdfName: null,
  kdfParameters: null,
  fingerprint: null, // obsolete
  oldPasswordHash: null,
  oldKeyFileHash: null,
  oldKeyChangeDate: null,
  encryptedPassword: null,
  encryptedPasswordDate: null,
  supportsTags: true,
  supportsColors: true,
  supportsIcons: true,
  supportsExpiration: true,
  defaultGroupHash: ''
});


module.exports=FileModel
