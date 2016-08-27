function processMethod(methods) {
    if (!methods) {
        return {}
    }

    function process(method) {
        if (!method) {
            return null
        }
        if (typeof method === 'function') {
            return {priority: 100, fn: method}
        }

        if (!Vue.util.isObject(method)) {
            return null
        }
        if (typeof method.fn != "function") {
            return null
        }
        var priority = method.priority
        if (!priority) {
            return {priority: 100, fn: method.fn}
        }
        if (typeof priority != 'number' || priority < 1 || priority > 100) {
            return null
        }
        return {priority: priority, fn: method.fn}

    }

    var result = {}
    Object.keys(methods).forEach(function (key) {
        var value = methods[key]
        var method = process(value)
        if (!method) {
            0
            throw "can not accept method \"" + key + "\""
        } else {
            result[key] = method
        }
    })
    return result
}


module.exports = {
    processMethod: processMethod
}
