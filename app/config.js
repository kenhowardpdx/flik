(function() {
    'use strict';

    angular.module('site-config',[]);

    var configData = {
        'CONFIG': {
            'SITE_NAME': 'Citrus',
            'APP_VERSION': '1.0.0',
            'API_URL': 'https://csgprohackathonapi.azurewebsites.net/',
            'USERNAME_PREFIX': 'c*'
    }
    };
    angular.forEach(configData, function(key,value) {
    angular.module('site-config').constant(value,key);
    // Load config constants
    });
})();
