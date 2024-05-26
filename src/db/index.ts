export const createDB = (): void => {
    const dbPromise = indexedDB.open('lewla', 1)

    dbPromise.addEventListener('upgradeneeded', (event) => {
        if (event.target instanceof IDBOpenDBRequest) {
            event.target.result.createObjectStore('member', { keyPath: 'id' })
            event.target.result.createObjectStore('channel', { keyPath: 'id' })
            event.target.result.createObjectStore('message', { keyPath: 'id' })
        }
    })

    dbPromise.addEventListener('success', (event) => {
        console.log(event)
    })
}

export const storeData = async (table: string, data: any): Promise<any> => {
    const dbPromise = indexedDB.open('lewla', 1)
    return await new Promise((resolve, reject) => {
        dbPromise.addEventListener('success', (event) => {
            if (event.target instanceof IDBOpenDBRequest) {
                const db = event.target.result
                const transaction = db.transaction(table, 'readwrite')
                const req = transaction.objectStore(table).put(data)

                transaction.commit()

                req.addEventListener('success', (event) => {
                    resolve(req.result)
                })

                req.addEventListener('error', (event) => {
                    reject(event)
                })
            }
        })
    })
}

export const getById = async (table: string, id: string): Promise<any> => {
    return await new Promise((resolve, reject) => {
        const dbPromise = indexedDB.open('lewla', 1)
        dbPromise.addEventListener('success', (event) => {
            if (event.target instanceof IDBOpenDBRequest) {
                const db = event.target.result
                const transaction = db.transaction(table, 'readonly')
                const req = transaction.objectStore(table).get(id)

                req.addEventListener('success', (event) => {
                    resolve(req.result)
                })

                req.addEventListener('error', (event) => {
                    reject(event)
                })
            }
        })
    })
}

export const getAll = async (table: string): Promise<any> => {
    return await new Promise((resolve, reject) => {
        const dbPromise = indexedDB.open('lewla', 1)
        dbPromise.addEventListener('success', (event) => {
            if (event.target instanceof IDBOpenDBRequest) {
                const db = event.target.result
                const transaction = db.transaction(table, 'readonly')
                const req = transaction.objectStore(table).getAll()

                req.addEventListener('success', (event) => {
                    resolve(req.result)
                })

                req.addEventListener('error', (event) => {
                    reject(event)
                })
            }
        })
    })
}

export const deleteAll = async (table: string): Promise<any> => {
    return await new Promise((resolve, reject) => {
        const dbPromise = indexedDB.open('lewla', 1)
        dbPromise.addEventListener('success', (event) => {
            if (event.target instanceof IDBOpenDBRequest) {
                const db = event.target.result
                const transaction = db.transaction(table, 'readwrite')
                const req = transaction.objectStore(table).clear()

                transaction.commit()

                req.addEventListener('success', (event) => {
                    resolve(req.result)
                })

                req.addEventListener('error', (event) => {
                    reject(event)
                })
            }
        })
    })
}

export const deleteById = async (table: string, id: string): Promise<any> => {
    return await new Promise((resolve, reject) => {
        const dbPromise = indexedDB.open('lewla', 1)
        dbPromise.addEventListener('success', (event) => {
            if (event.target instanceof IDBOpenDBRequest) {
                const db = event.target.result
                const transaction = db.transaction(table, 'readwrite')
                const req = transaction.objectStore(table).delete(id)

                transaction.commit()

                req.addEventListener('success', (event) => {
                    resolve(req.result)
                })

                req.addEventListener('error', (event) => {
                    reject(event)
                })
            }
        })
    })
}
