var deepstream = require('deepstream.io-client-js')


/**
 *
 * @param params
 * @returns {*}
 */


function vDs(params){
    var ds = deepstream(params.connectionUrl, params.options);
    ds.on('connectionStateChanged', function(connectionState) {
        // will be called with 'CLOSED' once the connection is successfully closed.
    })
    return ds
}


/**
 *
 * @param params
 * @param fn
 */
function vdsLogin(params, fn){
    var ds = this.$ds
    ds.close()
    var status = false
    function login (params, ds, fn){
        ds.login(params, function(success, data){
            if (success) {
                status = true
                fn(status, data)
            } else {
                fn(status, data)
            }
        })
    }
    var cbFn = fn
    login(params, ds, function(login, data){
        cbFn(login, data)
    })

}

function vdsLogout () {
    var status = false
    var ds = this.$ds
    ds.close()
    return status
}

/* Array containing all the list subscribtions made*/
var gloList = [];

/* HELPERS */
function _arrayObjectIndexOf(myArray, property, searchTerm) {
    for(var i = 0, len = myArray.length; i < len; i++) {
        if (myArray[i][property] === searchTerm) return i;
    }
    return -1;
}

/**
 *
 * @param list
 * @returns {*}
 * @private
 */
function _vdsList(list, ds) {
  var subscribedList = ds.record.getList(list);
  gloList.push({listName: list, listData: subscribedList});

  0

  return _arrayObjectIndexOf(gloList, 'listName', list);
}

function vueListDiscard (listName) {
    var ds = this.$ds

    var list = ds.record.getList(listName);
    0

    list.discard()

}


function vueListFetchReadOnly (listName) {

    var ds = this.$ds
    var listToFetch = listName;
    var key = this._callingKey
    var list = gloList[_vdsList(listToFetch, ds)].listData;
    var self = this // This is Vue sync caller
    var data = [];

    var k = key

    list.whenReady(function onListReady() {
        list.getEntries().forEach(function (entry, itemIdx) {
            var item = ds.record.getRecord(entry);
            item.subscribe(function (data) {
                0
                var keyExists = Object.keys(self.$$syncDict).indexOf(k) > -1 ? Object.keys(self.$$syncDict).indexOf(k) : -1;
                var update = null;

                if (keyExists > -1) {
                    var idx = -1
                    update = self.$data[k].find(function (item, index) {
                        idx = index

                        return idx == itemIdx
                    })

                    if (update) {
                        0
                        self.$data[k].$set(idx, data)
                    }
                }
            })// end item.subscribe

            item.whenReady(function () {
                data.safePush(item.get())
            })
        })
        0
    })


    data._list = listToFetch
    data._key = key
    var self = this

    data.safePush = function (arr) {
        return this.__proto__.push.apply(this, arguments);
    }

    data.$safeSet = function (idx, toUpdate) {
        0
        if (idx >= data.length) {
            data.length = Number(idx) + 1
        }

        data.splice(idx, 1, toUpdate)[0]
        0
    }//end data.$set

    data.$remove = function (toUpdate) {
        0
        gloList[_arrayObjectIndexOf(gloList, 'listName', data._list)].listData.removeEntry(toUpdate)
        return this.__proto__.$remove.apply(this, arguments);
    }//end data.$set

    return data
}

/**
 *
 * @param params
 * @returns {Array}
 */
function vueListFetch (listName) {

    var ds = this.$ds
    var listToFetch = listName;
    var key = this._callingKey
    var list = gloList[_vdsList(listToFetch, ds)].listData;
    var self = this // This is Vue sync caller
    var data = [];

    var k = key


    list.whenReady(function onListReady() {
        list.getEntries().forEach(function (entry, index) {
            var item = ds.record.getRecord(entry);
            item.subscribe(function (data) {
                0
                var keyExists = Object.keys(self.$$syncDict).indexOf(k) > -1 ? Object.keys(self.$$syncDict).indexOf(k) : -1;
                var update = null;

                if (keyExists > -1) {
                    var idx = -1
                    update = self.$data[k].find(function (item, index) {
                        idx = index
                        return (item._uid == data._uid);
                    })

                    if (update) {
                        0
                        self.$data[k].$set(idx, data)
                    }
                }
            })// end item.subscribe

            item.whenReady(function () {
                data.safePush(item.get())
            })
        })
        0
    })

    list.on('entry-added', function (recordChanged) {
        var item = ds.record.getRecord(recordChanged)
        item.subscribe(function (data) {
            0
            var keyExists = Object.keys(self.$$syncDict).indexOf(k) > -1 ? Object.keys(self.$$syncDict).indexOf(k) : -1;
            var update = null;
            if (keyExists > -1) {
                var idx = -1
                update = self.$data[k].find(function (item, index) {
                    idx = index
                    return (item._uid == data._uid);
                })

                if (update) {
                    0
                    self.$data[k].$set(idx, data)
                }
            }
        })// end item.subscribe

        item.whenReady(function () {
            // there is a latency compensation problem. tempObj is used a sort of OptimisticUI
            var keyExists = Object.keys(self.$$syncDict).indexOf(k) > -1 ? Object.keys(self.$$syncDict).indexOf(k) : -1;
            var tempObj = {_uid: recordChanged};
            var obj = item.get()._uid == null ? tempObj : item.get()
            var idx = -1
            var update = self.$data[k].find(function (item, index) {
                idx = index
                return (item._uid == obj._uid);
            })

            if (!update) self.$data[k].$safeSet(self.$data[k].length, obj)
            0
        })
    }) // end list.on.entryAdded

    list.on('entry-removed', function (recordChanged) {
        var keyExists = Object.keys(self.$$syncDict).indexOf(k) > -1 ? Object.keys(self.$$syncDict).indexOf(k) : -1;
        if (keyExists > -1) {
            var remove = self.$data[k].find(function (item) {
                return item._uid == recordChanged;
            })
            remove ? self.$data[k].$remove(remove) : null;
            if (remove) 0
        }
    })// end list.on.entryRemoved

    data._list = listToFetch
    data._key = key
    var self = this
    data.push = function (arr) {
        var pushMessage = '[CONNECTOR] Push intercepted | Checking... [ FRESH UID ]'
        0
        var uid = ds.getUid();
        var record = data._key + '/' + uid;
        var timestamp = Date.now()
        var newEntry = ds.record.getRecord(record)
        var objData = {_uid: record, _timestamp: timestamp}
        for (var k in arr) {
            if (arr.hasOwnProperty(k)) {
                objData[k] = arr[k];
            }
        }

        arguments[0]._uid = record
        arguments[0]._timestamp = timestamp

        newEntry.whenReady(function () {
            newEntry.set(objData)
        })

        var keyExists = Object.keys(self.$$syncDict).indexOf(key) > -1 ? Object.keys(self.$$syncDict).indexOf(key) : -1;
        if (keyExists > -1) {
            gloList[_arrayObjectIndexOf(gloList, 'listName', data._list)].listData.addEntry(record)
        }

        0
        return this.__proto__.push.apply(this, arguments);
    }//end data.push

    data.safePush = function (arr) {
        return this.__proto__.push.apply(this, arguments);
    }

    data.$set = function (idx, toUpdate) {
        0
        if (idx >= data.length) {
            data.length = Number(idx) + 1
        }

        data.splice(idx, 1, toUpdate)[0]
        0

        var updateRecord = ds.record.getRecord(toUpdate._uid)
        updateRecord.whenReady(function () {
            updateRecord.set(toUpdate)
        })
    }//end data.$set

    data.$safeSet = function (idx, toUpdate) {
        0
        if (idx >= data.length) {
            data.length = Number(idx) + 1
        }

        data.splice(idx, 1, toUpdate)[0]
        0
    }//end data.$set

    data.$remove = function (toUpdate) {
        0
        gloList[_arrayObjectIndexOf(gloList, 'listName', data._list)].listData.removeEntry(toUpdate._uid)
        return this.__proto__.$remove.apply(this, arguments);
    }//end data.$set

    return data
}
// this library assumes and works only if records have unique Ids
// If not it may broke.
// This library, when you're creating either list or records, uses the following format to produce and id: 'recordName/'+ds.getUid()

/**
 *
 * @param listName
 * @param rec
 * @param obj
 */
function vueListAddEntry(listName, rec, obj){
    gloList[_arrayObjectIndexOf(gloList, 'listName', listName)].listData.addEntry(rec)
}

/**
 *
 * @param listName
 * @param id
 */
function vueListRemoveEntry(listName, id){
  gloList[_arrayObjectIndexOf(gloList, 'listName', listName)].listData.removeEntry(id)
}

/**
 *
 * @param recordName
 * @param defVal
 * @param genId
 */
function vueRecordCreate(recordName, defVal, genId) {
    var ds = this.$ds
    var uid = ds.getUid();


    var genId = genId === false ? genId : true
    var record = genId === true ? recordName+'/'+uid : recordName;
    var entry = ds.record.getRecord(record)

    var data = ''

    entry.whenReady(function(){
        if (defVal && entry.get().id != '' ) {
            //var newEntry = {}
            var objData = {id: record, timestamp: Date.now()}

            for (var k in defVal) {
                if (defVal.hasOwnProperty(k)) {
                    objData[k] = defVal[k];
                }
            }

            entry.set(objData);

            return entry
        } else {
            0
        }

    })
    return record
}

/**
 *
 * @param k
 * @param record
 */
function vueRecordFetch(record) {
    var ds = this.$ds;
    var k = this._callingKey
    var self = this
    var item = ds.record.getRecord(record);

    item.subscribe(function(value){
        0

        var keyExists = Object.keys(self.$$syncDict).indexOf(k) > -1 ? Object.keys(self.$$syncDict).indexOf(k) : -1;

        if (keyExists > -1) {
            for (var key in value) {
                if (Object.hasOwnProperty(key)) {
                    self.$set(key, value[key])
                }
            }
        }

        self.$data[k] = keyExists > -1 ? value : null
    })// end item.subscribe

    item.whenReady(function(){
        self.$set(k, item.get())
    })
}

/**
 *
 * @param k
 * @param record
 * @param field
 * @param id
 * @returns {*}
 */
function vueRecordFieldFetch(record, field) {
    var k = this._callingKey
    var ds = this.$ds

        var item = ds.record.getRecord(record);
        var self = this
        var data;

        item.subscribe(field, function (value) {
            var keyExists = Object.keys(self.$$syncDict).indexOf(k) > -1 ? Object.keys(self.$$syncDict).indexOf(k) : -1;
            if ((keyExists > -1) /*&& (self.$data[k])*/) {
                self.$set(k, value)
                0
            }
            ;
        });

        item.whenReady(function () {
            var value = item.get()


            self.$set(k, item.get()[field])
            data = item.get()[field]
        })// end item.whenReady

        this.$on('ds-sync', function (newVal, keySent) {
            if (k == keySent) {
                0
                var rec = ds.record.getRecord(record)

                rec.whenReady(function () {
                    if (newVal != rec.get(field)) {
                        rec.set(field, newVal)
                    }
                })
            }
        })//end this.$on


  return data
}

module.exports = {
    vDs: vDs,
    vueRecordFieldFetch: vueRecordFieldFetch,
    vueRecordFetch: vueRecordFetch,
    vueListFetch: vueListFetch,
    vueListFetchReadOnly: vueListFetchReadOnly,
    vueListDiscard: vueListDiscard,
    vdsLogin: vdsLogin,
    vdsLogout: vdsLogout,
    vueRecordCreate: vueRecordCreate
    }
