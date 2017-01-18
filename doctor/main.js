
require.config({
	paths: {
		"jquery": "./lib/jquery-2.1.1",
		"angular": "./lib/angular.min",
		"angular-route": "./lib/angular-route",
		"angular-css":"./lib/angular-css.min",
		"fastclick":"./lib/fastclick",
		"flex": "./lib/flexible",
		'touch':'./lib/touch.min',          
		'doctor':'./js/doctor',
		'route':'route',
		'app':'app'
	},
	shim: { 
		'touch':['jquery'],
		'angular': {
            exports: 'angular'
        },
        'angular-css':{
            deps:['angular'],
            exports:'angular-css'
        },
        'angular-route':{
            deps:['angular'],
            exports:'angular-route'
        }
	}
})
require(['jquery','angular','angular-css','angular-route',"fastclick", 'flex','touch','doctor','app','route'], function(jq,angular,touch) {
	$(function() {
//		console.log(jq)
//		console.log(angular)
		angular.bootstrap(document,["myApp"]);
        $('html').addClass('ng-app:myApp');	
	})
})











