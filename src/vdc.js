var _ = require('underscore');
var dsMethods = require('./process-method')

/**
 *
 * A good chunk is based on Zhuojie Zhou's awesome meteor-vue package @ https://github.com/zhouzhuojie/meteor-vue/blob/master/lib/main.js
 * Also re-used some code from the vue-verify package
 */

exports.install = function (Vue, options){
    var Vue = Vue;

    options = options || {}
    var builtInDeepstream = Vue.util.extend(require("./vdc-methods.js"), dsMethods.processMethod(options.methods))

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

        option.init = option.init
            ? [initDs].concat(option.init)
            : initDs

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
                self._callingKey = key
                val = rxFunc.call(self);
                return self.$set(key, val);
            })()
        }
    };

    Vue.config.optionMergeStrategies.sync = Vue.config.optionMergeStrategies.computed

    p.$dsListFetch = builtInDeepstream['vueListFetch']
    p.$dsListFetchReadOnly = builtInDeepstream['vueListFetchReadOnly']
    p.$dsConnect = builtInDeepstream['vDs']
    p.$dsLogin = builtInDeepstream['vdsLogin']
    p.$dsLogout = builtInDeepstream['vdsLogout']
    p.$dsRecordFieldFetch = builtInDeepstream['vueRecordFieldFetch']
    p.$dsRecordCreate = builtInDeepstream['vueRecordCreate']
    p.$dsRecordFetch = builtInDeepstream['vueRecordFetch']

    Vue.filter('ds-sync', {
        read: function(value, key) {
            if (value!=undefined) this.$emit('ds-sync', value, key);
            return value
        },
        write: function(val, oldVal) {
            return val
        }
    })

    function initDs () {

        // init deepstream
        if ((this.$options.ds) && (this.$root == this)) {
            this.$ds = p.$dsConnect(this.$options.ds).login()
        } else if (this.$root.$ds) {
            this.$ds = this.$root.$ds
            }

    }
}
