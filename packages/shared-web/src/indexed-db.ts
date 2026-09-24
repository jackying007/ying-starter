type DbStoreType = {
  db: IDBDatabase
  storeName: string
}

export class IndexedDBStoreWrapper<T> {
  db: IDBDatabase
  storeName: string
  constructor(db: IDBDatabase, storeName: string) {
    this.db = db
    this.storeName = storeName
  }

  static getStoreWrapper<U>({ db, storeName }: DbStoreType): IndexedDBStoreWrapper<U> {
    return new IndexedDBStoreWrapper<U>(db, storeName)
  }

  private _promiseWrap<TResult>(request: IDBRequest<TResult>): Promise<TResult> {
    return new Promise((resovle, reject) => {
      request.onsuccess = function () {
        resovle(request?.result)
      }
      request.onerror = function () {
        reject(request.error)
      }
    })
  }

  private _getStore(mode?: IDBTransactionMode) {
    const transaction = this.db.transaction(this.storeName, mode)
    const store = transaction.objectStore(this.storeName)
    return store
  }

  add(data: T, key?: IDBValidKey) {
    return this._promiseWrap(this._getStore('readwrite').add(data, key))
  }

  put(data: T, key?: IDBValidKey) {
    return this._promiseWrap(this._getStore('readwrite').put(data, key))
  }

  get(key: IDBValidKey) {
    return this._promiseWrap<T>(this._getStore('readonly').get(key))
  }

  delete(key: IDBValidKey) {
    return this._promiseWrap(this._getStore('readwrite').delete(key))
  }

  getAll() {
    return this._promiseWrap<T[]>(this._getStore('readonly').getAll())
  }

  clear() {
    return this._promiseWrap(this._getStore('readwrite').clear())
  }
}

type DbInfoType = {
  dbName: string
  version?: number
  storeSchemas: { storeName: string; options?: IDBObjectStoreParameters }[]
}
export function openDb({ dbName, version, storeSchemas }: DbInfoType): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(dbName, version)

    request.onerror = () => {
      console.error('数据库打开失败', request.error)
      reject(request.error)
    }

    request.onupgradeneeded = () => {
      // 只能在这个时候创建 store 否则报错
      console.log('数据库升级或首次创建')
      const db = request.result
      // 根据配置创建各个对象仓库
      storeSchemas.forEach(schema => {
        if (!db.objectStoreNames.contains(schema.storeName)) {
          db.createObjectStore(schema.storeName, schema.options)
        }
      })
    }

    request.onsuccess = () => {
      resolve(request.result)
    }
  })
}
