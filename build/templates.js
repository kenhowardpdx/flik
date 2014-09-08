angular.module("templates", []).run(["$templateCache", function($templateCache) {$templateCache.put("login/login.html","<h3 class=\"view-title\">Login</h3>\n<form ng-submit=\"login(credentials)\" method=\"post\" novalidate form-autofill-fix>\n  <div class=\"form-group\">\n    <label for=\"username\">Username:</label>\n    <input type=\"text\" name=\"username\" id=\"username\" ng-model=\"credentials.username\" class=\"form-control\"  />\n  </div>\n  <div class=\"form-group\">\n    <label for=\"password\">Password:</label>\n    <input type=\"password\" name=\"password\" id=\"password\" ng-model=\"credentials.password\" class=\"form-control\" />\n  </div>\n  <div class=\"form-group\">\n    <button type=\"submit\" class=\"btn btn-primary\" id=\"btnLogin\">\n      Log In\n    </button>\n  </div>\n</form>\n");
$templateCache.put("main/main.html","<h3 class=\"view-title\">Hello {{user.Name}}</h3>");
$templateCache.put("navbar/navbar.html","<nav class=\"navbar navbar-inverse navbar-citrus navbar-fixed-top\" role=\"navigation\" ng-controller=\"NavCtrl\">\n  <div class=\"container\">\n    <div class=\"navbar-header\">\n      <button type=\"button\" class=\"navbar-toggle\" ng-click=\"isCollapsed = !isCollapsed\">\n        <span class=\"sr-only\">Toggle navigation</span>\n        <span class=\"icon-bar\"></span>\n        <span class=\"icon-bar\"></span>\n        <span class=\"icon-bar\"></span>\n      </button>\n      <a class=\"navbar-brand\" href=\"#\">Citrus</a>\n    </div>\n    <div class=\"collapse navbar-collapse\" collapse=\"isCollapsed\" id=\"main-nav\">\n      <ul class=\"nav navbar-nav\">\n        <li ng-class=\"{active:isActive([\'home\'])}\" data-toggle=\"collapse\" data-target=\"#main-nav\"><a href=\"#\">Home</a></li>\n        <li ng-class=\"{active:isActive([\'login\'])}\" data-toggle=\"collapse\" data-target=\"#main-nav\" ng-show=\"loggedUser\"><a href=\"#logout\">Log Out</a></li>\n        <li ng-class=\"{active:isActive([\'login\'])}\" data-toggle=\"collapse\" data-target=\"#main-nav\" ng-hide=\"loggedUser\"><a href=\"#login\" ng-hide=\"app.LoggedIn\">Login</a></li>\n        <li ng-class=\"{active:isActive([\'signup\'])}\" data-toggle=\"collapse\" data-target=\"#main-nav\" ng-hide=\"loggedUser\"><a href=\"#signup\">Sign Up</a></li>\n    </ul>\n\n	<ul class=\"nav navbar-nav navbar-right\">\n        <li ng-class=\"{active:isActive([\'projects\',\'project\'])}\"><a ng-show=\"loggedUser\" href=\"#projects\"><span class=\"sr-only\">Projects</span><span class=\"glyphicon glyphicon-briefcase\"></span></a></li>\n		<li ng-class=\"{active:isActive([\'time\'])}\"><a ng-show=\"loggedUser\" href=\"#time\"><span class=\"sr-only\">Add Time</span><span class=\"glyphicon glyphicon-time\"></span></a></li>\n	</ul>\n    </div>\n  </div>\n</nav>\n");
$templateCache.put("partials/toaster.html","<toaster-container></toaster-container>\n");
$templateCache.put("projects/project-edit.html","<h2>{{ pageTitle }}</h2>\n\n<div class=\"toolbar row\">\n	<div class=\"pull-right\">\n		<button class=\"btn btn-success btn-sm\" ng-click=\"saveRecord()\"><span class=\"glyphicon glyphicon-save\"></span> Save</button>\n		<a class=\"btn btn-default btn-sm\" href=\"#projects\"><span class=\"glyphicon glyphicon-remove\"></span> Cancel</a>\n	</div>\n</div>\n\n<div class=\"row\">\n	<div class=\"col-sm-12 form-group\">\n		<label for=\"name\">Project Name:</label>\n		<input type=\"text\" name=\"name\" id=\"name\" ng-model=\"project.Name\" class=\"form-control\"  />\n	</div>\n</div>\n");
$templateCache.put("projects/projects.html","<h2>{{ pageTitle }}</h2>\n\n<div class=\"toolbar\">\n	<a class=\"btn btn-default btn-md\" ng-href=\"#project/add\"><span class=\"glyphicon glyphicon-plus\"></span> Create Project</a>\n</div>\n\n<ul class=\"nav navbar-vertical\">\n	<li ng-repeat=\"project in projects\">\n		<div>\n			{{project.Name}}\n			<div class=\"pull-right\">\n				<a class=\"btn btn-default btn-sm\" ng-href=\"#project/edit/{{project.ProjectId}}\"><span class=\"glyphicon glyphicon-pencil\"></span></a>\n				&nbsp;\n				<button type=\"button\" class=\"btn btn-danger btn-sm\" ng-click=\"deleteRecord($index)\"><span class=\"glyphicon glyphicon-remove\"></span></button>\n			</div>\n		</div>\n	</li>\n</ul>\n");
$templateCache.put("signup/signup.html","<h3 class=\"view-title\">Sign Up</h3>\n<form ng-submit=\"createUser()\">\n  <div class=\"panel panel-danger\" ng-show=\"errors\">\n    <div class=\"panel-heading\" ng-model=\"errorHeading\">Error</div>\n    <div class=\"panel-body\">\n      <ul>\n        <li ng-repeat=\"error in errorList\">{{ error.Message }}</li>\n    </div>\n  </div>\n  <div class=\"form-group\">\n    <label for=\"username\">Username:</label>\n    <input ng-model=\"username\" type=\"text\" name=\"username\" id=\"username\" class=\"form-control\" />\n  </div>\n  <div class=\"form-group\">\n    <label for=\"name\">Your Name:</label>\n    <input ng-model=\"name\" type=\"text\" name=\"name\" id=\"name\" class=\"form-control\" />\n  </div>\n  <div class=\"form-group\">\n    <label for=\"password\">Password:</label>\n    <input ng-model=\"password\" type=\"password\" name=\"password\" id=\"password\" class=\"form-control\" />\n  </div>\n  <div class=\"form-group\">\n    <label for=\"email\">Email Address:</label>\n    <input ng-model=\"email\" type=\"email\" name=\"email\" id=\"email\" class=\"form-control\" />\n  </div>\n  <div class=\"form-group\">\n    <button type=\"submit\" class=\"btn btn-primary\" id=\"btnSignup\">\n      Sign Up\n    </button>\n  </div>\n\n</form>\n");
$templateCache.put("time/time-edit.html","<h2>{{ pageTitle }}</h2>\n\n<div class=\"toolbar row\">\n	<div class=\"pull-right\">\n		<button class=\"btn btn-success btn-sm\" ng-click=\"saveRecord()\"><span class=\"glyphicon glyphicon-save\"></span> Save</button>\n		<a class=\"btn btn-default btn-sm\" href=\"#time\"><span class=\"glyphicon glyphicon-remove\"></span> Cancel</a>\n	</div>\n</div>\n\n<div class=\"row\">\n	<div class=\"col-sm-3 form-group\">\n		<label for=\"name\">Time:</label>\n		<input type=\"text\" name=\"time\" id=\"time\" ng-model=\"entry.Hours\" class=\"form-control\"  />\n	</div>\n	<div class=\"col-sm-3 form-group\">\n		<label for=\"name\">Project:</label>\n		<select name=\"projectId\" class=\"form-control\" ng-model=\"entry.Project\" ng-options=\"projects.Name for projects in availableProjects\">\n			<option value=\"\">--Select One--</option>\n		</select>\n	</div>\n	<div class=\"col-sm-6 form-group\">\n		<label for=\"comment\">Comment:</label>\n		<input type=\"text\" name=\"comment\" id=\"comment\" ng-model=\"entry.Comment\" class=\"form-control\" />\n	</div>\n</div>\n");
$templateCache.put("time/time.html","<h2>{{ pageTitle }}</h2>\n\n<div class=\"toolbar\">\n    <a class=\"btn btn-default btn-md\" ng-href=\"#time/add\"><span class=\"glyphicon glyphicon-plus\"></span> Add Time</a>\n</div>\n<br />\n<div class=\"btn-group\">\n    <button type=\"button\" class=\"btn btn-default\" ng-click=\"previousDate()\"><span class=\"glyphicon glyphicon-chevron-left\"></span></button>\n    <button class=\"btn btn-default\">{{ timeEntryDate | aDate : \'EEEE, MMMM doo, y\' }}</button>\n    <button type=\"button\" class=\"btn btn-default\" ng-click=\"nextDate()\"><span class=\"glyphicon glyphicon-chevron-right\"></span></button>\n</div>\n\n<ul class=\"timeEntries\">\n    <li ng-repeat=\"entry in timeEntries\">\n        <span ng-bind=\"entry.time\"></span>\n        <span ng-bind=\"entry.details\"></span>\n    </li>\n</ul>\n");
$templateCache.put("projects/project-edit-partials/main-information.html","");}]);