var path = require('path') // if module is locally defined we path.resolve it

require.find = function (moduleName) {
  if (moduleName[0] === '.') {
    moduleName = path.resolve(path.dirname(module.parent.filename), moduleName)
  }
  try {
    return require.resolve(moduleName)
  } catch (e) {
    return
  }
}

/**
 * Removes a module from the cache. We need this to re-load our http_request !
 * see: http://stackoverflow.com/a/14801711/1148249
 */
require.decache = function (moduleName) {
  moduleName = require.find(moduleName)

  if (!moduleName) { return }

    // Run over the cache looking for the files
    // loaded by the specified module name
  require.searchCache(moduleName, function (mod) {
    if (!mod.id.endsWith('.node')) {
      delete require.cache[mod.id]
    }
  })

    // Remove cached paths to the module.
    // Thanks to @bentael for pointing this out.
  Object.keys(module.constructor._pathCache).forEach(function (cacheKey) {
    if (cacheKey.indexOf(moduleName) > 0) {
      delete module.constructor._pathCache[cacheKey]
    }
  })
}

/**
 * Runs over the cache to search for all the cached
 * files
 */
require.searchCache = function (moduleName, callback) {
    // Resolve the module identified by the specified name
  var mod = require.resolve(moduleName)

    // Check if the module has been resolved and found within
    // the cache no else so #ignore else http://git.io/vtgMI
    /* istanbul ignore else  */
  if (mod && ((mod = require.cache[mod]) !== undefined)) {
        // Recursively go over the results
    (function run (mod) {
            // Go over each of the module's children and
            // run over it
      mod.children.forEach(function (child) {
        run(child)
      })

            // Call the specified callback providing the
            // found module
      callback(mod)
    })(mod)
  }
}

module.exports = require.decache
