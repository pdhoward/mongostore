'use strict';

///////////////////////////////////////////////////////////////
////////      function to instantiate exports object   ///////
///////               copywrite xio  2018             ///////
/////////////////////////////////////////////////////////////

// export all stages

// The physical file name (ie Message.js) is refactored as the function name (ie message.js)
// refactored name must match export object -- enforcing convention for stage names

require('fs').readdirSync(__dirname + '/').forEach(function(file) {
  if (file.match(/\.js$/) !== null && file !== 'index.js') {
    let name = file.replace('.js', '');
    name = name.replace(/[^a-z]+/gi, ' ');
    name = name.trim().toLowerCase()
    let fn = require('./' + file);
    exports[name] = fn[name]

  }
});
