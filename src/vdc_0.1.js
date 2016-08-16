var deepstream = require('deepstream.io-client-js')
var _ = require('underscore');

/**
 *
 * _initVueDs is entirely based on Zhuojie Zhou's awesome meteor-vue package @ https://github.com/zhouzhuojie/meteor-vue/blob/master/lib/main.js
 */
console.log('THIS', this)
function _initVueDs (){
	Vue = this.Vue;

	var p = Vue.prototype;

	p.__callHook = p._callHook;
	p._callHook = function (hook) {
	    if(hook == 'created') {
		var self = this;

		// On every object use the $sync function to get the value
		_.each(this.$options.sync, function (rxFunc, key) {
		    self.$sync(key, rxFunc);
		});
	    }
	    this.__callHook(hook);
	}

	/**
	 * "Overwrite" of the Vue _init function
	 * @param Array option Vue options
	 */
	p.__init = p._init;
	p._init = function (option) {
	    // Dict
	    this.$$syncDict = {};

	    // Init data field to avoid warning
	    option = option || {};
	    option.data = option.data || {};
	    option.sync = option.sync || {};

	    var sync = _.extend({}, this.constructor.options.sync || {}, option.sync);
	    _.extend(option.data, sync);

	    // Default init
	    this.__init(option);
	};

	// Stop the key from syncDict
	p.$unsync = function (key) {
	    var ref = this.$$syncDict[key];

	    if (ref && typeof ref.stop === 'function') {
		ref.stop();
	    }
	};

// Sync key in syncDict with value = rxFunc
p.$sync = function (key, rxFunc) {
    this.$unsync(key);

    if (typeof rxFunc === 'function') {
        var self = this;
	

        this.$$syncDict[key] = (function () {//IIF
            var val;
            val = rxFunc.call(self, key);
	        return self.$set(key, val);
        })()
    }
};

Vue.config.optionMergeStrategies.sync = Vue.config.optionMergeStrategies.computed

// ds-sync filter to use in conjunction whit v-model for real-time sync
Vue.filter('ds-sync', {
    read: function(value, key) {
        if (value!=undefined) this.$emit('ds-sync', value, key);
        return value
  },
    write: function(val, oldVal) {
        return val
  }
})

}

/**
 *
 * @param params
 * @returns {*}
 */

function vDs(params){
    var ds = params.path ?
        deepstream( params.host+':'+params.port, {
        path: '/deepstream'
    })
        :
        deepstream( params.host+':'+params.port);

    _initVueDs();
    return ds
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
function _vdsList(list) {
  var subscribedList = ds.record.getList(list);
  console.log('I have subscribed you to the >> '+ list + ' List')
  gloList.push({listName: list, listData: subscribedList});

  console.log('# OF LIST SUBSCRIBED TO ', gloList.length)
  return _arrayObjectIndexOf(gloList, 'listName', list);
}


/**
 *
 * @param params
 * @returns {Array}
 */
function vueListFetch (params){
  
  var listToFetch = params.listName;
  var key = params.syncData
  var list = gloList[_vdsList(listToFetch)].listData;
  var self = this // This is Vue sync caller
  var data = []

  var k = key
  list.whenReady(function onListReady(){
      list.getEntries().forEach(function(entry, index){
          var item = ds.record.getRecord(entry);
	      item.subscribe(function (data){
              console.log('[DS] EVENT: {SUBSCRIBE} ITEM [', data._uid,']')
              var keyExists = Object.keys(self.$$syncDict).indexOf(k) > -1 ? Object.keys(self.$$syncDict).indexOf(k) : -1;
	          var update = null;

		      if (keyExists > -1){
                  var idx = -1
                  update = self.$data[k].find(function(item, index){
                      idx = index
                      return (item._uid == data._uid);
                  })

                  if (update){
                      console.log('[DS] FROM {SUBSCRIBE} HAVE ITEM [',update._uid,'] TO INSERT @ ', idx)
                      self.$data[k].$set(idx, data)
                  }
              }
          })// end item.subscribe

          item.whenReady(function(){
              data.safePush(item.get())
          })
      })
      console.log('[DS] FETCH LIST ENTRIES: ', list.getEntries())
  })

    list.on('entry-added', function(recordChanged){
        var item = ds.record.getRecord(recordChanged)
        item.subscribe(function (data){
            console.log('[DS] EVENT: {SUBSCRIBE} ITEM (LIST) [', data._uid,']')
            var keyExists = Object.keys(self.$$syncDict).indexOf(k) > -1 ? Object.keys(self.$$syncDict).indexOf(k) : -1;
	    	var update = null;
            if (keyExists > -1){
                var idx = -1
                update = self.$data[k].find(function(item, index){
                    idx = index
                    return (item._uid == data._uid);
                })

                if (update){
                    console.log('[DS] FROM {SUBSCRIBE} FOUND ITEM [',update._uid,'] TO UPDATE @ ', idx)
                    self.$data[k].$set(idx, data)
                }
            }
        })// end item.subscribe

        item.whenReady(function(){
        // there is a latency compensation problem. tempObj is used a sort of OptimisticUI
            var keyExists = Object.keys(self.$$syncDict).indexOf(k) > -1 ? Object.keys(self.$$syncDict).indexOf(k) : -1;
            var tempObj = {_uid: recordChanged};
            var obj = item.get()._uid == null ? tempObj : item.get()
            var idx = -1
		    var update = self.$data[k].find(function(item, index){
                idx = index
                return (item._uid == obj._uid);
            })

            if(!update) self.$data[k].$safeSet(self.$data[k].length,obj)
            console.log('[DS] EVENT: {ENTRY-ADDED} (LIST) | ITEM[', obj._uid, ']')
        })
    }) // end list.on.entryAdded

    list.on('entry-removed', function(recordChanged){
        var keyExists = Object.keys(self.$$syncDict).indexOf(k) > -1 ? Object.keys(self.$$syncDict).indexOf(k) : -1;
        if (keyExists > -1) {
            var remove = self.$data[k].find(function(item){
                return item._uid == recordChanged;
            })
            remove ? self.$data[k].$remove(remove):null;
            if (remove) console.log('[DS] EVENT: {ENTRY-REMOVED} (LIST) | ITEM[', recordChanged, ']')
        }
    })// end list.on.entryRemoved

    data._list = listToFetch
    data._key = key
    var self = this
    data.push = function (arr){
        var pushMessage = '[CONNECTOR] Push intercepted | Checking... [ FRESH UID ]'
        console.log(pushMessage)
	    var uid = ds.getUid();
        var record = data._key+'/'+uid;
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

        newEntry.whenReady(function(){
            newEntry.set(objData)
        })

        var keyExists = Object.keys(self.$$syncDict).indexOf(key) > -1 ? Object.keys(self.$$syncDict).indexOf(key) : -1;
        if (keyExists > -1) {
            gloList[_arrayObjectIndexOf(gloList, 'listName', data._list)].listData.addEntry(record)
        }

        console.log('[CONNECTOR] Pushed! Complete', [data._list, record,  newEntry])
        return this.__proto__.push.apply(this, arguments);
    }//end data.push

    data.safePush = function (arr){
        return this.__proto__.push.apply(this, arguments);
    }

    data.$set = function (idx, toUpdate){
        console.log('[CONNECTOR] $set intercepted | Checking... [',toUpdate._uid, '] @', idx)
        if (idx >= data.length) {
            data.length = Number(idx) + 1
        }

        data.splice(idx, 1, toUpdate)[0]
        console.log('[CONNECTOR] $set complete | Commit... [',toUpdate._uid, ']')

        var updateRecord = ds.record.getRecord(toUpdate._uid)
        updateRecord.whenReady(function(){
            updateRecord.set(toUpdate)
        })
    }//end data.$set

    data.$safeSet = function (idx, toUpdate){
        console.log('[CONNECTOR] $safeSet intercepted | Checking... [',toUpdate._uid, '] @', idx)
        if (idx >= data.length) {
            data.length = Number(idx) + 1
        }

        data.splice(idx, 1, toUpdate)[0]
        console.log('[CONNECTOR] $safeSet complete | Commit... [',toUpdate._uid, ']')
    }//end data.$set

    data.$remove = function (toUpdate){
        console.log('[CONNECTOR] $remove intercepted | Deleting... [',toUpdate._uid, '] ')
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
 */
function vueRecordCreate(recordName, defVal) {
    var uid = ds.getUid();
    var record = recordName+'/'+uid;
    var entry = ds.record.getRecord(record)

    var data = ''

    entry.whenReady(function(){
        if (defVal && record.get().id != '' ) {
            var newEntry = {}
            var objData = {id: record, timestamp: Date.now()}

            for (var k in defVal) {
                if (defVal.hasOwnProperty(k)) {
                    objData[k] = defVal[k];
                }
            }

            newEntry.set(objData);
        } else {
            console.log('Either something went wrong during "create" or object data are missing')
        }

        return record
    })
}

/**
 *
 * @param k
 * @param record
 */
function vueRecordFetch(k, record) {
    var self = this
    var item = ds.record.getRecord(record);

    item.subscribe(function(value){
        console.log('[DS] EVENT: {SUBSCRIBE} ITEM (SINGLE ITEM) ', value)

        var keyExists = Object.keys(self.$$syncDict).indexOf(k) > -1 ? Object.keys(self.$$syncDict).indexOf(k) : -1;

        if (keyExists > -1) {
            for (var key in value) {
                if (Object.hasOwnProperty(key)) {
                    console.log(key);self.$set(key, value[key])
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
function vueRecordFieldFetch(k, record, field, id) {
    var item = ds.record.getRecord(record);
    var self = this
    var data;

    item.subscribe( field, function( value ){
        var keyExists = Object.keys(self.$$syncDict).indexOf(k) > -1 ? Object.keys(self.$$syncDict).indexOf(k) : -1;

        if ((keyExists > -1) /*&& (self.$data[k])*/) {
            self.$set(k, value)
        };
    });

    item.whenReady(function(){
        var value = item.get()
        console.log('[DS] EVENT: {SUBSCRIBE} FIELD (SINGLE ITEM) ["'+ field + '"]' , 'IN RECORD:  ', value)

        self.$set(k, item.get()[field])
        data = item.get()[field]
    })// end item.whenReady

    this.$on('ds-sync', function(newVal, keySent){
        if (k==keySent) {
            console.log('[CONNECTOR] v-model change interecepted | Checking...', 'record[', record, '] field[', field, '] value[', newVal, ']')
            var rec = ds.record.getRecord(record)

            rec.whenReady(function(){
                console.log('newVal from update: ', newVal, 'Value on rec: ', rec.get(field))
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
    vueListFetch: vueListFetch
    }
