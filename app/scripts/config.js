(function() {
  angular.module('site-config',[]);

  var config_data = {
    'CONFIG': {
      'SITE_NAME': 'Citrus',
      'APP_VERSION': '1.0.0'
    }
  };
  angular.forEach(config_data, function(key,value) {
    angular.module('site-config').constant(value,key);
    // Load config constants
  });
})();
