
/***********************
* DONE:
* + push() // adds _uid for you
* +? splice()
* + $set 
* + $remove
* + v-model ds-sync for text
* + v-model ds-sync for textarea
*
*
*
* NOT PLANNED:
* sort()
* reverse()
* v-model ds-sync for number, select, checkbox and radio
*
*
* TO FIX:
* Add temp comments to not forget
* refactor:
*	remove timestamp
*	remove unnecessary comments (console.log, etc)
*	indent code properly
* Add meaningful comments
* add functions headers like others do
* 
*
*
*
*
*
* TO DO: ~~VUE~~
* pop()
* shift()
* unshift()
* +? splice()
*
*
* TO DO: ~~DS~~
* Create ds record (sugar syntax and auto _uid)
* Records
*	All Events
*	unsubscribe (subsribe is already implemented as you automatically subsribe to changes when getting a record or a field)
*	discard
*	delete
* Lists
*	All Events
*	unsubscribe (subsribe is already implemented as you automatically subsribe to changes when getting a List. Subscriptions are made on list and single record as well)
*	discard
*	delete

* PLANNED
*	ServerOptions
* 	Connection States
*	Login
*	Auth & Permissions
*	Client Record
*	Anonymous Record
*	RPC
*	ERRORS
*
*
* TO DO: ~~LAUNCH~~
* prepare readme for github
* badges for github
* css for example
* final example version
* Test with props and components (also nested)
*************************/


/* GLOBAL SUBS*/
var gloList = [];

/* HELPERS */
function _arrayObjectIndexOf(myArray, property, searchTerm) {
    for(var i = 0, len = myArray.length; i < len; i++) {
        if (myArray[i][property] === searchTerm) return i;
    }
    return -1;
}

/* VUE DS SYNC SETUP */
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
            /*if (val && typeof val.fetch === 'function') {
                return self.$set(key, val.fetch());
            } else {
               
                return self.$set(key, val);
            }*/
		console.log('val ', val)
	    return self.$set(key, val);
        })()
    }
};

Vue.config.optionMergeStrategies.sync = Vue.config.optionMergeStrategies.computed

Vue.filter('ds-sync', {//function(value, key) {

read: function(value, key) {
      if (value!=undefined) this.$emit('ds-sync', value, key);
console.log('filter ', this)
  return value	
  },
  // view -> model
  // formats the value when writing to the data.
  write: function(val, oldVal) {
        return val
  }

})//end vue filter

}

/* INIT VDS */
function vDs(params){
 ds = deepstream( params.host+':'+params.port);
 _initVueDs()

 return ds
}

/* DS HELPERS */
// For all items values included in a list
function _updateListItemValue(data){

}

function _updateSingleItemValue(value, k){
 
}

function _vdsList(list) {
  var subscribedList = ds.record.getList(list);
  console.log('I have subscribed you to the >> '+ list + ' List')
  gloList.push({listName: list, listData: subscribedList});

  console.log('# OF LIST SUBSCRIBED TO ', gloList.length)
  return _arrayObjectIndexOf(gloList, 'listName', list);
}


/* VUE DS PUBLIC FUNCTIONS*/
function vueListFetch (params){
  
  var listToFetch = params.listName;
  var key = params.syncData
  var list = gloList[_vdsList(listToFetch)].listData;
  var self = this // This is Vue sync caller
  var data = []

  //console.log('vueListFetch args :', arguments)

  var k = key
  list.whenReady(function onListReady(){
	  list.getEntries().forEach(function(entry, index){
	     var item = ds.record.getRecord(entry);
	     item.subscribe(function (data){
		console.log('[DS] EVENT: {SUBSCRIBE} ITEM [', data._uid,']')
		var keyExists = Object.keys(self.$$syncDict).indexOf(k) > -1 ? Object.keys(self.$$syncDict).indexOf(k) : -1;           
	    	//keyExists > -1 ? self.$set(k, data) : null;
		var update = null;

		if (keyExists > -1){
		  var idx = -1
		  update = self.$data[k].find(function(item, index){
			idx = index
		        return (item._uid == data._uid);
		       })

		 if (update){
			//if ( update._timestamp != data._timestamp) {
				console.log('[DS] FROM {SUBSCRIBE} HAVE ITEM [',update._uid,'] TO INSERT @ ', idx)
				//console.log('array? ', self.$data[k])
				self.$data[k].$set(idx, data)
			//	} else { console.log('[DS] FROM {SUBSCRIBE} ITEM [',data._uid,'] DOES NOT NEED TO BE UPDATED') }

	
		} else {
				
					//self.$data[k].$set((self.$data[k].length-1), data)		
					//self.$data[k].push(data) 
			    }  
		
	 
		 }
		//update ? self.$data[k].$set(self.$data[k].indexOf(update), data):null;
	  	
		//}
	
    	})// end item.subscribe
	     var idx = index
	     var pos = k
	     var selff = self
	     item.whenReady(function(){
		data.safePush(item.get())
		//data[idx] = item.get()
	
	     })//end forEach
    	})// end item.whenReady
  console.log('List Records: ', list.getEntries())
  })//end list.whenReady 


  list.on('entry-added', function(recordChanged){
	var item = ds.record.getRecord(recordChanged)

	item.subscribe(function (data){
		console.log('[DS] EVENT: {SUBSCRIBE} ITEM (LIST) [', data._uid,']')
		var keyExists = Object.keys(self.$$syncDict).indexOf(k) > -1 ? Object.keys(self.$$syncDict).indexOf(k) : -1;           
	    	//keyExists > -1 ? self.$set(k, data) : null;
		var update = null;

		if (keyExists > -1){
		  var idx = -1
		  update = self.$data[k].find(function(item, index){
			idx = index
		        return (item._uid == data._uid);
		       })

		 if (update){
		//	if ( update._timestamp != data._timestamp) {
				console.log('[DS] FROM {SUBSCRIBE} FOUND ITEM [',update._uid,'] TO UPDATE @ ', idx)
				//console.log('array? ', self.$data[k])
				self.$data[k].$set(idx, data)
				//self.$data[k][idx] = data
	
		//		} else { console.log('[DS] FROM {SUBSCRIBE} ITEM [',data._uid,'] DOES NOT NEED TO BE UPDATED') }

	
		}
	 
		 }
    	})// end item.subscribe
  //	item.subscribe(_updateListItemValue);


    item.whenReady(function(){
  // there is a latency compensation problem. tempObj is used a sort of OptimisticUI
		var keyExists = Object.keys(self.$$syncDict).indexOf(k) > -1 ? Object.keys(self.$$syncDict).indexOf(k) : -1; 
                var tempObj = {_uid: recordChanged};
                var obj = item.get()._uid == null ? tempObj : item.get()
                        
	       	//keyExists > -1 ? self.$data[k].$set(keyExists, obj) : null;
		var idx = -1
		 var update = self.$data[k].find(function(item, index){
			idx = index
		        return (item._uid == obj._uid);
		       })
		if(!update) self.$data[k].$safeSet(self.$data[k].length,obj)//console.log('should insert ', obj._uid)//self.$data[k].push(obj)
		console.log('[DS] EVENT: {ENTRY-ADDED} (LIST) | ITEM[', obj._uid, ']')
		 
		})// end item.whenReady
    }) // end list.on.entryAdded

  list.on('entry-removed', function(recordChanged){
  //console.log('REMOVED')
		var keyExists = Object.keys(self.$$syncDict).indexOf(k) > -1 ? Object.keys(self.$$syncDict).indexOf(k) : -1;               
       		if (keyExists > -1) {
		var remove = self.$data[k].find(function(item){
	  		return item._uid == recordChanged;
			//return item == ds.record.getRecord(recordChanged)._$data
			})
		remove ? self.$data[k].$remove(remove):null;
		
		//var item = ds.record.getRecord(message[recordChanged])

		if (remove) console.log('[DS] EVENT: {ENTRY-REMOVED} (LIST) | ITEM[', recordChanged, ']')
     }//end if
	
  })// end list.on.entryRemoved

  data._list = listToFetch
  data._key = key

  var self = this
  data.push = function (arr){
	// check if is a new object by either later date or no _timestamp field at all
	//var newItem = (arr._timestamp > self.readyDate || !arr._timestamp) ? true : false
	//var pushMessage = newItem ? '[CONNECTOR] Push intercepted | Checking... [ FRESH UID ] << Is it a newItem?' : '[CONNECTOR] Push intercepted | Checking... [' + arr._uid + '] << Is it a newItem?';
	var pushMessage = '[CONNECTOR] Push intercepted | Checking... [ FRESH UID ]'
	console.log(pushMessage)
	//if (newItem) {
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

	// inject new fields in the original array before forwarding it
	arguments[0]._uid = record
	arguments[0]._timestamp = timestamp

	newEntry.whenReady(function(){
	  newEntry.set(objData)	
	})
	var keyExists = Object.keys(self.$$syncDict).indexOf(key) > -1 ? Object.keys(self.$$syncDict).indexOf(key) : -1;               
	if (keyExists > -1) {
	  //Object.keys(self.$$syncDict)[keyExists] is Vue's sync.data property name
//	  Object.keys(self.$$syncDict)[keyExists]; console.log('self.$$syncDict ', self.key)
	gloList[_arrayObjectIndexOf(gloList, 'listName', data._list)].listData.addEntry(record)		}
	console.log('[CONNECTOR] Pushed! Complete', [data._list, record,  newEntry])
	//ee.emitEvent('push', [data._list, record,  newEntry]);

	//}
	
  return this.__proto__.push.apply(this, arguments);
  }//end data.push

data.safePush = function (arr){
  return this.__proto__.push.apply(this, arguments);
}

//data.$set needs further work to make it update the ds record otherwise other clients will not be notified if $vm.$set
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
  //return this.__proto__.$set.apply(this, arguments);
}//end data.$set

data.$safeSet = function (idx, toUpdate){
	console.log('[CONNECTOR] $safeSet intercepted | Checking... [',toUpdate._uid, '] @', idx)
	if (idx >= data.length) {
      	  data.length = Number(idx) + 1
    	}
    	data.splice(idx, 1, toUpdate)[0]
	console.log('[CONNECTOR] $safeSet complete | Commit... [',toUpdate._uid, ']')


  //return this.__proto__.$set.apply(this, arguments);
}//end data.$set

data.$remove = function (toUpdate){
	console.log('[CONNECTOR] $remove intercepted | Deleting... [',toUpdate._uid, '] ')
	/*if (!this.length) return
        var index = this.indexOf(this, toUpdate)
        if (index > -1) return this.splice(index, 1)

	console.log('[CONNECTOR] $remove complete | Commit... [',toUpdate._uid, ']')
	*/
	gloList[_arrayObjectIndexOf(gloList, 'listName', data._list)].listData.removeEntry(toUpdate._uid)
  	return this.__proto__.$remove.apply(this, arguments);
}//end data.$set


return data
} // end function vdsListFetch


// this library assuemes and works only if records have unique Ids
// If not it may broke.
// This library, when you're creating either list or records, uses the following format to produce and id: 'recordName/'+ds.getUid()
function vueListAddEntry(listName, rec, obj){
gloList[_arrayObjectIndexOf(gloList, 'listName', listName)].listData.addEntry(rec)

}

function vueListRemoveEntry(listName, id){
  gloList[_arrayObjectIndexOf(gloList, 'listName', listName)].listData.removeEntry(id)
}


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
	} //end if 
		else {console.log('Either something went wrong during "create" or object data are missing')}
	  return record
	})
}

function vueRecordFetch(k, record) {
   var self = this
   var item = ds.record.getRecord(record);

  


   item.subscribe(function(value){
	console.log('[DS] EVENT: {SUBSCRIBE} ITEM (SINGLE ITEM) ', value)
    	var keyExists = Object.keys(self.$$syncDict).indexOf(k) > -1 ? Object.keys(self.$$syncDict).indexOf(k) : -1; 
    	if (keyExists > -1) {
	  for (var key in value) {
		if (Object.hasOwnProperty(key)) {console.log(key);self.$set(key, value[key])}
	  }
	  
	}
	self.$data[k] = keyExists > -1 ? value : null
   })// end item.subscribe

   item.whenReady(function(){
        //console.log('item.get() vueRecordFetch', item.get() )
        self.$set(k, item.get())

	})//item.whenReady
}

function vueRecordFieldFetch(k, record, field, id) {
 
   var item = ds.record.getRecord(record);
   var self = this
   var data;
   var previousStack = []
   var prevVal = self.$data[k]
   item.subscribe( field, function( value ){

	var keyExists = Object.keys(self.$$syncDict).indexOf(k) > -1 ? Object.keys(self.$$syncDict).indexOf(k) : -1;
	if ((keyExists > -1) /*&& (self.$data[k])*/) {

	  self.$set(k, value)
	};
	
  });//end item subscribe field

   item.whenReady(function(){
	
	var value = item.get()

        console.log('[DS] EVENT: {SUBSCRIBE} FIELD (SINGLE ITEM) ["'+ field + '"]' , 'IN RECORD:  ', value)
        self.$set(k, item.get()[field])
	data = item.get()[field]	
	})// end item.whenReady

this.$on('ds-sync', function(newVal, keySent){//function(keySent, newVal, ts){
			if (k==keySent) {
			  console.log('[CONNECTOR] v-model change interecepted | Checking...', 'record[', record, '] field[', field, '] value[', newVal, ']')
     			  var rec = ds.record.getRecord(record)

			  rec.whenReady(function(){
			     console.log('newVal from update: ', newVal, 'Value on rec: ', rec.get(field))
			     //if (newVal != rec.get(field) && rec.get('_timestamp') != ts ) {
			     if (newVal != rec.get(field)) {
					rec.set(field, newVal)
					//rec.set('_timestamp', ts)					
					} else {}

			  })
			} //end if
			
			})//end self.$on
return data
}

