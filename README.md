# vue-deepstream-connector

[![Travis](https://img.shields.io/travis/ecerroni/vue-deepstream-connector.svg)](https://travis-ci.org/ecerroni/vue-deepstream-connector/builds)
[![GitHub tag](https://img.shields.io/github/tag/ecerroni/vue-deepstream-connector.svg)](https://github.com/ecerroni/vue-deepstream-connector/releases/tag/0.1.0)

A bridge connector between [Vue](http://vuejs.org) and [Deepstream](http://deepstream.io).

## Get Started
The __vue-deepstream-connector__ allows to intercepts vue's array change detection methods to trigger deepstream's API. It combines them to offer a ___bidirectional data-sync___ option.

## Demo
[link]

## Usage

Sync usage:

    sync: {
      'some-key': function(){
        // It returns a deepstream source
          }
        }



### Browser

    <script type="text/javascript" src="http://cdn.jsdelivr.net/vue/1.0.26/vue.min.jss"></script>
    <script type="text/javascript" src="assets/js/vdc.min.js"></script>


_now the vue-deepstream-connector exposes the vdc object_

Connect to the deepstream server

    // define the connection params
    var srvObj = {
      host: 'localhost',
      port: '6020'
    }
    // connect to the server
    var vds = new vdc.vDs(srvObj)


Sync a single deepstream record:

    sync: {
      object: function(){ // this, sync.key, recordName,
         return vdc.vueRecordFetch.call(this, 'object', 'welcome')
      }


Sync a whole array/list:

    sync: {
      conversations: function(){ // this, {syncData, listName}
         return vdc.vueListFetch.call(this, {
                        syncData: 'conversations',
                        listName: 'chats'
                    })
      }


Sync v-model:
Use the ds-sync filter

    <textarea rows="4" cols="50" v-model="editable | ds-sync 'editable'"></textarea>



### Node

    npm install deepstream.io@0.9.0 // install the server
    npm install vue-deepstream-connector // install both client@0.5.0 and the connector


### Example (Browser)

Same as the animated gif example

    git clone https://github.com/ecerroni/vue-deepstream-connector.git
    cd vue-deepstream-connector
    npm install
    cd example
    node server
    
Open the browser at http://localhost:6020

## Caveats

So far the vue-deepstream-connector works with:
- Deepstream server 0.9.0
- Deepstream client 0.5.0
- Vue 1.0.x

__Compatibility with deepstream 1.0 and vue 2.0 is in the works__

In order to make everything sync seamlessly a "_uid" property is added to every object inserted into the array
This allows an optimistic UI where the new item triggers a View update on the client without waiting the response of the server

-----

## VUE-DEEPSTREAM INTEGRATION STATUS

### DONE: [VUE]
- push() // adds "_uid" for you
- splice()
- $set 
- $remove
- v-model ds-sync for text
- v-model ds-sync for textarea

### TO DO: [VUE]
- pop()
- shift()
- unshift()

### NOT PLANNED: [VUE]
- sort()
- reverse()
- v-model ds-sync for number, select, checkbox and radio


### TO DO: [VUE]
- Create ds record (sugar syntax and auto "_uid")
- Records
    -	All Events
    -	unsubscribe (subscribe is already implemented as you automatically subscribe to changes when getting a record or a field)
    -	discard
    -	delete
- Lists
    -  	All Events
    -	unsubscribe (subscribe is already implemented as you automatically subscribe to changes when getting a List. Subscriptions are made on list and single record as well)
    -  	discard
    -	delete

### PLANNED: [DS]
-	ServerOptions
- 	Connection States
-	Login
-	Auth & Permissions
-	Client Record
-	Anonymous Record
-	RPC
-	ERRORS

### PLANNED: [OTHER]
- free underscore dependency
- avoid the need to pass sync.key to the function call


## Thanks To
- [Zhou's Meteor-Vue](https://github.com/zhouzhuojie/meteor-vue)

## LICENSE
---

MIT