define(['app', "touch"], function(app, touch) {
	return app
		.controller("doctorController", ["$scope", "$css", "$rootScope", "$http", "$location", "$timeout", "$interval", function($scope, $css, $rootScope, $http, $location, $timeout, $interval) {
			$css.add("./css/E01_1doctor.css");
			$css.remove("./css/e04_6diagnoseDetails.css")
//			$css.remove("./css/e04_6diagnoseDetails.css")

			//获取用户基本信息=======================================================================================
			var url = "http://www.dianneidna.com/diannei/"
				//获取用户基本信息=======================================================================================
			localStorage.removeItem("visitid")
			var getUserInfo = function() {
					var wex_token = localStorage.getItem("wex_token");
					//					alert("getUserInfo==token = " + wex_token);
					$http({
						method: "POST",
						headers: {
							"Content-Type": "application/json",
							"token": wex_token
						},
						url: 'http://www.dianneidna.com/diannei/doctor/getdoctorinfo',
						data: {

						}
					}).success(function(res) {
						console.log(res);
						// console.log(1)
						$scope.data = res.data;
						$scope.amount = res.data.statisticinfo;
						if($scope.data.avatar != null) {
							$("#doctorPhoto").attr("src", $scope.data.avatar)
						} else {
							$("#doctorPhoto").attr("src", "img/pho_icon2@2x.png")
						}
						$timeout(function() {
							if($scope.data.status == -3) {

								$(".mask").css("display", "block")
							} else if($scope.data.status == 2) {

								$(".mask1").css("display", "block")
							} else if($scope.data.status == 1) {

							} else if($scope.data.status == 0) {

								$(".mask2").css("display", "block")
							} else if($scope.data.status == -2) {

								$(".mask3").css("display", "block")
							}
						}, 500)

					}).error(function(err) {
						console.log(err)
					})
					$http({
						method: "POST",
						headers: {
							"Content-Type": "application/json",
							"token": wex_token
						},
						url: 'http://www.dianneidna.com/diannei/doctor/gettodayvisit',
						data: {

						}
					}).success(function(res) {
						console.log(res);

						$scope.arr = res.data;
						console.log($scope.arr)						
					$.each($scope.arr, function(index, item) {
						if(item.gender==0){
							item.gender="女"
						}else{
							item.gender="男"
						}
						var d = new Date(item.visittime)
						h = d.getHours() + ':';
						m = d.getMinutes() + ':';
						s = d.getSeconds();
						var time = h + m + s

					var p = '<li class="patientItem"><a href="#/predictTable" visitId=" ' + item.visitid + '" class="patientWrap"><div class="patientContent"><div class="circle"></div><span class="patientName">' + item.realname + '</span><span class="patientAge">(' + item.gender + '&nbsp;' + item.curentage + '岁)</span><span class="patientDate">' + time + '</span></div><div class="patientWord"><span class="illnessDetail"><span class="illnessTitle">病情详述 : </span>' + item.patientbrife + '</span></div><div class="line"></div></a></li>';
						$(".patientDetail ").append(p);
					})
				$(".patientWrap").on("click", function() {

				 console.log($(this).attr("visitId"))
				sessionStorage.setItem("visitid", $(this).attr("visitId"))
			    window.location.href="http://www.dianneidna.com/weixin/doctor/index.html#/predictTable"
			    })
					}).error(function(err) {
						console.log(err)
					})
				}
				//微信授权相关信息============================================================================================
				//如果url没有code 调用后台获取url然后重定向到首页
			var getUrl = function() {
					var url = $location.absUrl();
					//					alert("getUrl====url===" + url)
					var toUrl = "http://www.dianneidna.com/wechat/api/v1/authorize/url?redirectUri=" + url;
					$http({
						method: "GET",
						headers: {
							"Content-Type": "application/json",
							"Access-Control-Allow-Origin": "*"
						},
						url: toUrl,

						data: {}
					}).success(function(res) {
						var serverUrl = res.url;
//						alert("getUrl====" + serverUrl);
						window.location = serverUrl;
					}).error(function(err) {
						console.log(err)
					})
				}
				//获取url中的code
			var getCode = function() {
					var url = $location.absUrl();
					//					alert("getCode====" + url);
					var n = url.indexOf('code=');
					if(n < 0) {
						getUrl();
					} else {
						n += 5;
						var m = url.indexOf('state=') - 1;
						var ssss = url.substring(n, m);
						if(ssss == "" || ssss == null) {
							getUrl();
						} else {
							getToken(ssss);
						}
					}

				}
				//根据code获取token
			var getToken = function(serverCode) {
					alert("getToken=====" + serverCode);
					$http({
						method: "POST",
						headers: {
							"Content-Type": "application/json"
						},
						url: "http://www.dianneidna.com/wechat/api/v1/authenticate",

						data: {
							code: serverCode
						}
					}).success(function(res) {
						var serverToken = res.token;
						if(serverToken == "") {} else {
							localStorage.setItem("wex_token", res.token);
							sessionStorage.setItem("wtoken", "11");
							var wex_token = localStorage.getItem("wex_token");
							getUserInfo();
						}
						console.log(res)
					}).error(function(err) {
						console.log(err)
					})
				}
				//判断是否授权
			var wtoken = sessionStorage.getItem("wtoken");
			if(wtoken == "11") {
				getUserInfo();
			} else {
				//判断本地是否缓存token
				var token = localStorage.getItem("wex_token");
				if(token == "" || token == null) {
					getCode();
				} else { //本地有token的时候
					getUserInfo();
				}
			}
			$rootScope.url = "http://www.dianneidna.com/diannei/";
			document.title = "我是医生";
			$css.remove("./css/e02_2patientManagement.css")

			var re = /^1([23578])\d{9}$/;
			var re1 = /\d{4}/;
			var token = localStorage.getItem("wex_token");
			console.log(token)
			$scope.mobileSave = function() {

				$http({
					method: "POST",
					headers: {
						"Content-Type": "application/json",
						"token": token

					},
					url: 'http://www.dianneidna.com/diannei/system/binddoctorphone',
					data: {
						"code": $scope.code,
						"phone": $scope.telphone,

					}
				}).success(function(res) {

					console.log(res)
					if(!re1.test($(".mobileNumberIpt3").val()) && re.test($(".mobileNumberIpt2").val())) {
						$(".warningWindow2").css("display", "block")
					} else if(res.code != 1000) {
						$(".code").html(res.message)
						console.log(res.message)
						$(".code").css("display", "block")
					} else if(re1.test($(".mobileNumberIpt3").val()) && re.test($(".mobileNumberIpt2").val())) {
						window.location.href = "http://www.dianneidna.com/weixin/doctor/index.html#/basicInformation"
					}
					$timeout(function() {
						$(".warningWindow2").css("display", "none")
						$(".warningWindow1").css("display", "none")
						$(".code").css("display", "none")
					}, 1000)
				}).error(function(err) {
					console.log(err)
				})
			}

			$scope.testGetCode = function() {
				var num = 59;
				if(!re.test($(".mobileNumberIpt2").val())) {
					$(".warningWindow1").css("display", "block")
				} else {
					var timer = $interval(function() {
						$(".mobileNumberIpt4").val(num)
						num--;
						if(num == -1) {
							$(".mobileNumberIpt4").val("点击获取")
							$(".mobileNumberIpt4").css({
								"background": "#27B4ED"
							})
							$interval.cancel(timer)
						}
					}, 1000)
					$(".mobileNumberIpt4").css({
						"background": "#aeaeae"
					})

				}
				$timeout(function() {
					$(".warningWindow1").css("display", "none")
				}, 1000)
				$http({
					method: "POST",
					headers: {
						"Content-Type": "application/json",
						"token": token
					},
					url: 'http://www.dianneidna.com/diannei/system/senddoctorsms',
					data: {
						"phone": $scope.telphone
					}
				}).success(function(res) {
					console.log(res)
					if(res.code == 1214) {
						$(".mobileNumberIpt4").val("点击获取")
						$(".mobileNumberIpt4").css({
							"background": "#27B4ED"
						})
						$interval.cancel(timer)
						$(".code").html("手机号已存在")

						$(".code").css("display", "block")
					}

				}).error(function(err) {
					console.log(err)
				})

			}

		}])
		.controller("myCollectionController", ["$scope", "$css", "$http", "$rootScope", function($scope, $css, $http, $rootScope) {
			$css.add("./css/e02-3_myCollection.css");
			$css.remove("./css/e02_2patientManagement.css")
			document.title = "我的收藏";
			var token = localStorage.getItem("wex_token");
			$http({
				method: "POST",
				headers: {
					"Content-Type": "application/json",
					"token": token
				},
				url: 'http://www.dianneidna.com/diannei/doctor/myfavoritelist',
				data: {

				}
			}).success(function(res) {
				console.log(res);
				$scope.arr = res.data;
				console.log($scope.arr.length)
				$.each($scope.arr, function(index, item) {
					console.log(item)
                    if(item.gender==0){
                    	item.gender="女"
                    	console.log(item.gender)
                    }else{
                    	item.gender="男"
                    	console.log(item.gender)
                    }
					var d = new Date(item.visittime)
					h = d.getHours() + ':';
					m = d.getMinutes() + ':';
					s = d.getSeconds();
					var time = h + m + s
					var p = '<a href="#/predictTable" class="patientWrap" collectId=" ' + item.visitid + ' " ><div class="patientContent"><div class="circle"></div><span class="patientName">' + item.realname + '</span><span class="patientAge">(' + item.gender + '&nbsp;' + item.curentage + '岁)</span><span class="patientDate">' + time + '</span></div><div class="patientWord"><span class="illnessDetail"><span class="illnessTitle">病情详述 : </span>' + item.patientbrife + '</span></div><div class="line"></div></a>';
					$(".patientDetail ").append(p);
				})
				$(".patientWrap").on("click", function() {
					console.log($(this).attr("collectId"))
					sessionStorage.setItem("collectId", $(this).attr("collectId"))
					sessionStorage.setItem("visitid", $(this).attr("collectId"))

				})

			}).error(function(err) {
				console.log(err)
			})

		}])
		.controller("todayMedicalController", ["$scope", "$css", "$http", "$rootScope", function($scope, $css, $http, $rootScope) {
			$css.add("./css/E01_1doctor.css");
			$css.remove("./css/e02_2patientManagement.css")
			document.title = "当日门诊";
			var token = localStorage.getItem("wex_token");
			$http({
				method: "POST",
				headers: {
					"Content-Type": "application/json",
					"token": token
				},
				url: 'http://www.dianneidna.com/diannei/doctor/gettodayvisitlist',
				data: {

				}
			}).success(function(res) {
				console.log(res)
				$scope.arr = res.data
				console.log($scope.arr)
				$.each($scope.arr, function(index, item){

					console.log(item)
					var daydate = item.daydate.split(" ")[1];
					console.log(daydate)

					var ul = '<ul class="patientDetail"><p class="detailDate">' + daydate + '时' + '</p></ul>';

					$.each(item.recordlist, function(index1, item2) {
						var d = new Date(item2.visittime)
						h = d.getHours() + ':';
						m = d.getMinutes() + ':';
						s = d.getSeconds();
						var time = h + m + s

						ul += '<li class="patientItem" style="background:#ffffff"><a href="#/predictTable" class="patientWrap"  visitId=" ' + item2.visitid + ' " ><div class="patientContent"><div class="circle"></div><span class="patientName">' + item2.realname + '</span><span class="patientAge">(' + item2.gender + '&nbsp;' + item2.curentage + '岁)</span><span class="patientDate">' + time + '</span></div><div class="patientWord"><span class="illnessDetail"><span class="illnessTitle">病情详述 : </span>' + item2.patientbrife + '</span></div><div class="line"></div></a></li>';
						// $(".patientDetail ").append(list); 

					})
					$(".medicalRecordst_content").append(ul);

				})
				$(".patientItem").on("click", function() {
					console.log($(this).children().attr("visitId"))
					sessionStorage.setItem("visitid", $(this).children().attr("visitId"))
				})

			}).error(function(err) {
				console.log(err)
			})
		}])
		.controller("patientManagementController", ["$scope", "$css", "$http", "$rootScope", "$timeout", function($scope, $css, $http, $rootScope, $timeout) {
			$css.add("./css/e02_2patientManagement.css");
			$css.remove("./css/e03_2choosePatient.css");
			$css.remove("./css/e03_4newPatient.css");
			document.title = "患者管理";
			var token = localStorage.getItem("wex_token");
			$http({
				method: "POST",
				headers: {
					"Content-Type": "application/json",
					"token": token
				},
				url: 'http://www.dianneidna.com/diannei/doctor/getmypatient',
				data: {

				}

			}).success(function(res) {
				console.log(res)
				$scope.data = res.data;

				$.each($scope.data, function(index, item) {
					console.log(index, item)
					var p = '<p class="FirstLetter">' + index + '</p>';
					var span = '<span class="searchLetter">' + index + '</span>';
					$('#last').before(span)
					$.each(item, function(index1, item1) {
						p += '<a href="#/patientInformation" class="addItem addWrap" archiveid="' + item1.archiveid + '"><img src=" ' + item1.avatar + ' " class="addPhoto addPatient"><span class="addIntrodation">' + item1.realname + '</span><span class="description">' + '(男,     ' + item1.currage + '岁)' + '</span></a>'

					})
					$(".letter1").append(p)

					$(".searchLetter").on("click", function() {
						$scope.value = $(this).html();
						console.log($scope.value)

						// var ind=$(".FirstLetter").indexOf($scope.value)
						//                                                           var a=$(".FirstLetter").eq(0);
						console.log($(".FirstLetter").eq(0).text())
						for(var i = 0; i < $(".FirstLetter").length; i++) {
							if($(".FirstLetter").eq(i).text() == $scope.value.toLowerCase()) {
								console.log(i)
								$scope.num = i;
								$scope.top = $(".FirstLetter").eq($scope.num).offset().top;
							}
						}
						if($scope.top <= 10) {
							return
						} else {
							console.log($scope.num, $scope.top, $(document).scrollTop());
							//                                                                  $("body").scrollTop($scope.top);
							$("body").animate({
									scrollTop: $scope.top
								}, 20)
								//                                                       $("body").scrollTop($scope.top);
								//                                                                  document.documentElement.scrollTop=900;
							console.log($("body").scrollTop())
						}

						console.log($(".box"))

						// console.log($(".FirstLetter").eq($scope.value)
						console.log($(".FirstLetter").eq($scope.num).html())

					})

				})
				$(".addItem").on("click", function() {
					console.log($(this).attr("archiveid"))
					sessionStorage.setItem("archiveid", $(this).attr("archiveid"))
//					sessionStorage.setItem("visitid", $(this).attr("archiveid"))
				})

			}).error(function(err) {
				console.log(err)
			})

		}])
		.controller("choosePatientController", ["$scope", "$css", "$http", "$rootScope", "$timeout", function($scope, $css, $http, $rootScope, $timeout) {
			$css.add("./css/e03_2choosePatient.css");
			$css.remove("./css/e02_2patientManagement.css")
			document.title = "搜索患者"
			var token = localStorage.getItem("wex_token");
			localStorage.removeItem("searchWord")
			$(".searchDelete").on("tap", function() {
				$(".searchWord").val("")
			})
			document.getElementById("searchWord").oninput = function() {
				console.log($(".searchWord").val())
				localStorage.setItem("searchWord", $(".searchWord").val())

			if($(".searchWord").val() == "") {
				$(".letter").empty()
				console.log(1)
			} else {
				$timeout(function() {
					$http({
						method: "POST",
						headers: {
							"Content-Type": "application/json",
							"token": token
						},
						url: 'http://www.dianneidna.com/diannei/doctor/getmypatient',
						data: {
							"searchkey": localStorage.getItem("searchWord")
						}
					}).success(function(res) {
						console.log(res)
						console.log(res.data)
						$scope.data = res.data
						var li = ' '
						$.each($scope.data, function(index, item) {
							console.log(index, item[0])
							$.each(item, function(index1, item1) {
								li += '<a href="#/patientInformation" class="addWrap addItem" archiveid="' + item1.archiveid + '"><img src=" ' + item1.avatar + ' " class="addPhoto addPatient"> <span class="addIntrodation">' + item1.realname + '</span><span class="description">' + '(男,     ' + item1.currage + '岁)' + '</span></a>';
								console.log(li)
							})
						})
						$(".letter").append(li);
						$(".addItem").on("click", function() {
								console.log($(this).attr("archiveid"))
								sessionStorage.setItem("archiveid", $(this).attr("archiveid"))
//								sessionStorage.setItem("visitid", $(this).attr("archiveid"))
					    })

					}).error(function(err) {
						console.log(err)
					})

				}, 10)
			}
		}
			$(".searchWord").focus(function() {
				$(".letter").empty()
			})

		}])
		.controller("patientInformationController", ["$scope", "$css", "$http", "$rootScope", "$timeout", function($scope, $css, $http, $rootScope, $timeout) {
			$css.add("./css/e03_3patientInformation.css");
			$css.remove("./css/e02_2patientManagement.css")
			var token = localStorage.getItem("wex_token");
			document.title = "患者信息"
			$timeout(function() {
				$http({
					method: "POST",
					headers: {
						"Content-Type": "application/json",
						"token": token
					},
					url: 'http://www.dianneidna.com/diannei/doctor/getarchiveinfo',
					data: {
						"archiveid": sessionStorage.getItem("archiveid")
					}
				}).success(function(res) {
					console.log(res)
					$scope.data = res.data;
					console.log($scope.data)
					var d = new Date($scope.data.birthday)

					Y = d.getFullYear() + '/';
					M = (d.getMonth() + 1 < 10 ? '0' + (d.getMonth() + 1) : d.getMonth() + 1) + '/';
					D = d.getDate() + ' ';
					$scope.birthday = Y + M + D
					if($scope.data.gender == 1) {
						$scope.gender = "男"
					} else {
						$scope.gender = "女"
					}
				}).error(function(err) {
					console.log(err)
				})
			}, 200)
             $(".deleteBtn").on("click",function(){
             	 $(".container2").css("display","block")
             	 
             })
             $(".backBtn").on("click",function(){
             	$(".container2").css("display","none")
             })
			$scope.delete = function() {
				$http({
					method: "POST",
					headers: {
						"Content-Type": "application/json",
						"token": token
					},
					url: 'http://www.dianneidna.com/diannei/doctor/delmypatient',
					data: {
						"archiveid": sessionStorage.getItem("archiveid")
					}
				}).success(function(res) {
					console.log(res)
					window.location.href = "http://www.dianneidna.com/weixin/doctor/index.html#/patientManagement"
					sessionStorage.removeItem("archiveid")
				}).error(function(err) {
					console.log(err)
				})
			}

		}])
		.controller("healthyInformationController", ["$scope", "$css", "$http", "$rootScope", function($scope, $css, $http, $rootScope) {
			$css.add("./css/e04_3healthyInformation.css");
			$css.remove("./css/E01_1doctor.css");
			$css.remove("./css/e04_6diagnoseDetails.css");
			$css.remove("./css/index.css")
			var token = localStorage.getItem("wex_token");
			document.title = "健康信息"
			$css.remove("./css/e02_2patientManagement.css")
			$http({
				method: "POST",
				headers: {
					"Content-Type": "application/json",
					"token": token
				},
				url: 'http://www.dianneidna.com/diannei/doctor/getarchiveinfo',
				data: {
					"archiveid": sessionStorage.getItem("archiveid")
				}
			}).success(function(res) {
				console.log(res)
				$scope.data = res.data
				if($scope.data.issmoking == 1) {
					$scope.issmoking = "是"
				} else {
					$scope.issmoking = "否"
				}
				if($scope.data.issmoked == 1) {
					$scope.issmoked = "是"
				} else {
					$scope.issmoked = "否"
				}
				if($scope.data.haslungdisease == 1) {
					$scope.haslungdisease = "是"
				} else {
					$scope.haslungdisease = "否"
				}
				if($scope.data.diseasename == 1) {
					$scope.diseasename = "肺气肿"
				} else if($scope.data.diseasename == 2) {
					$scope.diseasename = "慢性阻塞性肺病"
				} else if($scope.data.diseasename == 3) {
					$scope.diseasename = "慢性支气管炎"
				} else if($scope.data.diseasename == 12) {
					$scope.diseasename = "肺气肿 慢性阻塞性肺病"
				} else if($scope.data.diseasename == 13) {
					$scope.diseasename = "肺气肿 慢性支气管炎"
				} else if($scope.data.diseasename == 23) {
					$scope.diseasename = "慢性阻塞性肺病 慢性支气管炎"
				} else {
					$scope.diseasename = "肺气肿 慢性阻塞性肺病 慢性支气管炎"
				}

			}).error(function(err) {
				console.log(err)
			})
		}])
		.controller("medicalDetailsController", ["$scope", "$css", "$http", "$rootScope", function($scope, $css, $http, $rootScope) {
			$css.add("./css/e04_4medicalDetails.css");
			$css.remove("./css/e02_2patientManagement.css")
			$css.remove("./css/e05_2relatedImage.css");
			$css.remove("./css/e05_2relatedRecord.css");
			var token = localStorage.getItem("wex_token");
			document.title = "健康详情"
			$http({
				method: "POST",
				headers: {
					"Content-Type": "application/json",
					"token": token
				},
				url: 'http://www.dianneidna.com/diannei/doctor/getarchiveinfo',
				data: {
					"archiveid": sessionStorage.getItem("archiveid")
				}
			}).success(function(res) {
				console.log(res)
				$scope.data = res.data.picgroup;
				console.log($scope.data)
				var img1 = ' '
				var img2 = ' '
				$.each($scope.data, function(index, item) {
					if(item.pictype == 1) {
						$.each(item.groupurl, function(index, item) {
							$.each(item.picurl, function(index, item) {

								img1 += '<img src=" ' + item + ' "/>'

							})
						})
					} else {
						$.each(item.groupurl, function(index, item) {
							$.each(item.picurl, function(index, item) {

								img2 += '<img src=" ' + item + ' "/>'
							})
						})
					}
				})
				$(".ImageBox1").append(img1)
				$(".ImageBox2").append(img2)

			}).error(function(err) {
				console.log(err)
			})
		}])
		.controller("myCodeController", ["$scope", "$css", "$http", "$rootScope", function($scope, $css, $http, $rootScope) {
			$css.add("./css/e02_6myCode.css");
			$css.remove("./css/e02_2patientManagement.css")
			var token = localStorage.getItem("wex_token");
			document.title = "我的二维码"
			$http({
				method: "POST",
				headers: {
					"Content-Type": "application/json",
					"token": token
				},
				url: 'http://www.dianneidna.com/diannei/doctor/getdoctorinfo',
				data: {

				}
			}).success(function(res) {
				console.log(res)
				$scope.data = res.data.ercode
				var img = '<img src=" ' + $scope.data + ' "/>'
				$(".codeImage").append(img)
			}).error(function(err) {
				console.log(err)
			})
		}])
		.controller("newPatientController", ["$scope", "$css", "$http", "$rootScope", function($scope, $css, $http, $rootScope) {
			$css.add("./css/e03_4newPatient.css");
			$css.remove("./css/e02_2patientManagement.css")
			var token = localStorage.getItem("wex_token");
			document.title = "新增患者"
			$http({
				method: "POST",
				headers: {
					"Content-Type": "application/json",
					"token": token
				},
				url: 'http://www.dianneidna.com/diannei/doctor/getlatestpatient',
				data: {

				}
			}).success(function(res) {
				console.log(res)
				$scope.data = res.data
				var li = ' '
				$.each($scope.data, function(index, item) {
					console.log(item)
					if(item.gender == 1) {
						li += '<a href="#/patientInformation" class="addWrap addItem"><img src=" ' + item.avatar +
							' " class="addPhoto addPatient"> <span class="addIntrodation">' + item.realname + '</span><span class="description">' + '(男,     ' + item.currage + '岁)' + '</span></a>';

					} else {
						li += '<a href="#/patientInformation" class="addWrap addItem"><img src=" ' + item.avatar +
							' " class="addPhoto addPatient"> <span class="addIntrodation">' + item.realname + '</span><span class="description">' + '(女,     ' + item.currage + '岁)' + '</span></a>';
					}

				})
				$(".letter").append(li)

			}).error(function(err) {
				console.log(err)
			})

		}])
		.controller("relatedImageController", ["$scope", "$css", "$http", "$rootScope", "$timeout", function($scope, $css, $http, $rootScope, $timeout) {
			$css.add("./css/e05_2relatedImage.css");
			document.title = "详情"
			var token = localStorage.getItem("wex_token");
			$css.remove("./css/e04_4medicalDetails.css");
			$http({
				method: "POST",
				headers: {
					"Content-Type": "application/json",
					"token": token
				},
				url: 'http://www.dianneidna.com/diannei/doctor/getarchiveinfo',
				data: {
					"archiveid": sessionStorage.getItem("archiveid")
				}
			}).success(function(res) {
				console.log(res)
				$scope.data = res.data.picgroup

				$.each($scope.data, function(index, item) {
					if(item.pictype == 2) {

						$.each(item.groupurl, function(index1, item1) {
							console.log(this)
							var d = new Date(item1.createtime)
							Y = d.getFullYear() + '/';
							M = (d.getMonth() + 1 < 10 ? '0' + (d.getMonth() + 1) : d.getMonth() + 1) + '/';
							D = d.getDate() + ' ';
							$scope.time = Y + M + D
							var img = ''
							var div = '<p class="UcaseDate">' + '-' + $scope.time + '-' + '</p><div class="casesContent1_1box"><div class="caseBox"></div></div>'

							$.each(item1.picurl, function(index2, item2) {

								img += '<img src=" ' + item2 + ' " class="myImage"/>'

							})

							$(".UCaseBox").append(div)
								$(".caseBox").append(img)
								console.log(1)

						})

					} else {
						return
					}

				})

			}).error(function(err) {
				console.log(err)
			})

		}])
		.controller("relatedRecordController", ["$scope", "$css", "$http", "$rootScope", "$timeout", function($scope, $css, $http, $rootScope, $timeout) {
			$css.add("./css/e05_2relatedImage.css");
			$css.remove("./css/e04_4medicalDetails.css");
			document.title = "详情"
			$css.remove("./css/e04_4medicalDetails.css");
			var token = localStorage.getItem("wex_token");
			$http({
				method: "POST",
				headers: {
					"Content-Type": "application/json",
					"token": token
				},
				url: 'http://www.dianneidna.com/diannei/doctor/getarchiveinfo',
				data: {
					"archiveid": sessionStorage.getItem("archiveid")
				}
			}).success(function(res) {
				console.log(res)
				$scope.data = res.data.picgroup

				$.each($scope.data, function(index, item) {
					if(item.pictype == 1) {
						$.each(item.groupurl, function(index, item) {
							var d = new Date(item.createtime)
							Y = d.getFullYear() + '/';
							M = (d.getMonth() + 1 < 10 ? '0' + (d.getMonth() + 1) : d.getMonth() + 1) + '/';
							D = d.getDate() + ' ';
							$scope.time = Y + M + D
							var img = ''
							var div = '<p class="UcaseDate">' + '-' + $scope.time + '-' + '</p><div class="casesContent1_1box"><div class="caseBox"></div></div>'

							$.each(item.picurl, function(index, item) {

								img += '<img src=" ' + item + ' " class="myImage"/>'

							})

							$(".UCaseBox").append(div)
//							$timeout(function() {
								$(".caseBox").append(img)
								console.log(1)
//							}, 10)

						})

					} else {
						return
					}

				})

			}).error(function(err) {
				console.log(err)
			})
		}])
		.controller("diagnoseDetailsController", ["$scope", "$css", "$http", "$rootScope", "$timeout", function($scope, $css, $http, $rootScope, $timeout) {
			$css.add("./css/e04_6diagnoseDetails.css");
			$css.remove("./css/e02_2patientManagement.css")
			$css.remove("./css/E01_1doctor.css")
			var token = localStorage.getItem("wex_token");
			document.title = "详情";
			$http({
				method: "POST",
				headers: {
					"Content-Type": "application/json",
					"token": token
				},
				url: 'http://www.dianneidna.com/diannei/doctor/getvisitlistbypatient',
				data: {
					 "archiveid": sessionStorage.getItem("archiveid"),
				}
			}).success(function(res) {
				console.log(res)
				$scope.data = res.data
				console.log($scope.data)

				$.each($scope.data, function(index, item) {

					var ul = '<ul class="patientDetail"><p class="detailDate">' + item.daydate + '</p></ul>';

					$.each(item.recordlist, function(index1, item2) {
						if(item2.gender==0){
							item2.gender="女"
						}else{
							item2.gender="男"
						}
						var d = new Date(item2.visittime)
						h = d.getHours() + ':';
						m = d.getMinutes() + ':';
						s = d.getSeconds();
						var time = h + m + s

						ul += '<div class="patientBox2"><div class="patientItem2"><a href="#/predictTable" class="patientWrap" visitid=" '+item2.visitid+' "><div class="patientContent"><div class="circle"></div><span class="patientName">' +
							item2.realname + '</span><span class="patientAge">(' + item2.gender + '&nbsp;' + item2.curentage + '岁)</span><span class="patientDate">' + time +
							'</span></div><div class="patientWord"><span class="illnessDetail"><span class="illnessTitle">病情详述 : </span>' + item2.patientbrife +
							'</span></div><div class="line"></div></a><button class="medicalRecordstBtn">删除</button></div></div>';
						// $(".patientDetail ").append(list); 

					})
					$(".medicalRecordst_content").append(ul);
					$(".patientWrap").on("click	", function() {

					 console.log($(this).attr("visitId"))
						sessionStorage.setItem("visitid", $(this).attr("visitId"))
						window.location.href="http://www.dianneidna.com/weixin/doctor/index.html#/predictTable"
					 })
					

					$('.patientBox2').on('swipeleft', function() {
						$(this).children().animate({
							left: '-2.67rem'
						})
						console.log(2)
						console.log($(this).children())
					})
					$('.patientBox2').on('swiperight', function() {
						$(this).children().animate({
							left: 0
						})
					})

					touch.on('.medicalRecordstBtn', 'tap', function() {
						$(this).parent().parent().slideUp(500);
						$http({
							method: "POST",
							headers: {
								"Content-Type": "application/json",
								"token": token
							},
							url: 'http://www.dianneidna.com/diannei/patient/delmyvisitrecord',
							data: {
								"visitid": sessionStorage.getItem("ItemID"),
							}
						}).success(function(res) {
							console.log(res)
						}).error(function(err) {
							console.log(err)
						})
					})

				})

			}).error(function(err) {
				console.log(err)
			})

		}])
		.controller("predictTableController", ["$scope", "$css", "$http", "$rootScope", "$timeout", function($scope, $css, $http, $rootScope, $timeout) {
			$css.remove("./css/e02_2patientManagement.css")
			$css.add("./css/cd_1seeTable.css");
			$css.remove("./css/e02_4medicalRecords.css");
			var token = localStorage.getItem("wex_token");
			document.title = "详情";
			localStorage.removeItem("touxiang")
			var url1 = window.location.href;
//			alert(url1)
			var url2 = window.location.hash;
//			alert(url2)
			var str = url2.substr(0);
			strs = str.split("=");
			//			alert(strs[1])
			var collect = sessionStorage.getItem("visitid")
			console.log(collect)
			$('.heartImg').click(function() {
				$(".heartImg").css('display', 'none')
				$(".heartImg2").css('display', 'block')
				sessionStorage.setItem("collectId",sessionStorage.getItem("visitid"))
			})
			$('.heartImg2').click(function() {
				$(".heartImg2").css('display', 'none')
				$(".heartImg").css('display', 'block')
				sessionStorage.removeItem("collectId")
				
			})

            				//==================================雷达

			var leida = function() {
				var myChart = echarts.init(document.getElementById('main'));
				var dataBJ = [
					[
						$scope.data.firstvalue * 80,
						$scope.data.secondvalue * 80,
						$scope.data.thirdvalue * 80,
						$scope.data.fourvalue * 80,
						$scope.data.fifthvalue * 80,
						$scope.data.sixthvalue * 80
					]
				];
				var dataBJ_ = [
					[
						$scope.data.firstname,
						$scope.data.secondname,
						$scope.data.thirdname,
						$scope.data.fourname,
						$scope.data.fifthname,
						$scope.data.sixthname
					]
				];

				var lineStyle = {
					normal: {
						width: 3,
						opacity: 0.5
					}
				};

				option = {
					backgroundColor: 'transparent',
					title: {
						top: 5,
						text: '',
						left: 'center',
						textStyle: {
							color: '#000'
						}
					},
					legend: {
						bottom: 5,
						data: [],
						itemGap: 20,
						textStyle: {
							color: '#fff',
							fontSize: 14
						},
						selectedMode: 'single'
					},
					radar: {
						indicator: [{
							name: dataBJ_[0][0],
							max: 100
						}, {
							name: dataBJ_[0][1],
							max: 100
						}, {
							name: dataBJ_[0][2],
							max: 100
						}, {
							name: dataBJ_[0][3],
							max: 100
						}, {
							name: dataBJ_[0][4],
							max: 100
						}, {
							name: dataBJ_[0][5],
							max: 100
						}],
						shape: 'circle',
						splitNumber: 5,
						name: {
							textStyle: {
								color: 'rgb(34, 34, 34)' ////字体颜色
									,
								fontSize: 30
							}
						},
						splitLine: {
							lineStyle: {
								color: [
									'rgba(255, 255, 255, 1)', 'rgba(0,0,0,0.5)',
									'rgba(0,0,0,0.5)', 'rgba(0,0,0,0.5)',
									'rgba(0,0,0,0.5)', 'rgba(0,0,0,0.5)'
								].reverse()
							}
						},
						splitArea: {
							show: false
						},
						axisLine: {
							lineStyle: {
								color: 'rgba(0, 0, 0, 0.5)'
							}
						}
					},
					series: [{
						name: '',
						type: 'radar',
						lineStyle: lineStyle,
						data: dataBJ,
						symbol: 'none',
						itemStyle: {
							normal: {
								color: '#68b8f7' //===============中间阴影的颜色值
							}
						},
						areaStyle: {
							normal: {
								opacity: 0.2 //===============中间阴影的颜色的透明度
							}
						}
					}]
				};
				//使用刚指定的配置项和数据显示图表。
				myChart.setOption(option);
			}

			//==================================雷达

			if((window.location.hash).indexOf("?") == -1) {
					$(".hugeTitle").removeClass("findMore")
//					$timeout(function() {
						$http({
							method: "POST",
							headers: {
								"Content-Type": "application/json",
								"token": token
							},
							url: 'http://www.dianneidna.com/diannei/doctor/getmyvisitrecordinfo',
							data: {
								"visitid": sessionStorage.getItem("visitid")
							}
						}).success(function(res) {
							console.log(res)
							$scope.data = res.data
							leida();
							visitid = $scope.data.visitid
							sessionStorage.setItem("archiveid",$scope.data.archiveid)
							sessionStorage.setItem("visitid",$scope.data.visitid)
							if($scope.data.doctorbrife==null){
							    $(".doctorBrife").html("该患者没有对病情进行描述")
//							    alert(1)
							}else{
//								alert(2)
							}
							if($scope.data.isfavorite==0){
								$(".heartImg1").css("display", "block")
					            $(".heartImg2").css("display", "none")
							}else{
								$(".heartImg2").css("display", "block")
					            $(".heartImg1").css("display", "none")
							}
							if($scope.data.diseasename == 1) {
								$scope.diseasename = "肺气肿"
							} else if($scope.data.diseasename == 2) {
								$scope.diseasename = "慢性阻塞性肺病"
							} else if($scope.data.diseasename == 3) {
								$scope.diseasename = "慢性支气管炎"
							} else if($scope.data.diseasename == 12) {
								$scope.diseasename = "肺气肿 慢性阻塞性肺病"
							} else if($scope.data.diseasename == 13) {
								$scope.diseasename = "肺气肿 慢性支气管炎"
							} else if($scope.data.diseasename == 23) {
								$scope.diseasename = "慢性阻塞性肺病 慢性支气管炎"
							} else {
								$scope.diseasename = "肺气肿 慢性阻塞性肺病 慢性支气管炎"
							}
							if($scope.data.gender==1){
								 $scope.gender="男"
							}else{
								$scope.gender="女"
							}
							if($scope.data.haslungdisease==0){
								$scope.ok="否"
							}else{
								$scope.ok="是"
							}
							if($scope.data.hadothercancer==0){
								$scope.haha="否"
							}else{
								$scope.haha="是"
							}
							if($scope.data.hasrelativelungdisease==0){
								$scope.hehe="否"
							}else{
								$scope.hehe="是"
							}
							if($scope.data.issmoking==0){
								$scope.ha="否"
							}else{
								$scope.ha="是"
							}
							if($scope.data.issmoked==0){
								$scope.he="否"
							}else{
								$scope.he="是"
							}
							if($scope.data.status == 1) {
								$(".successBtn").html("就 诊")
								$(".successBtn").css("background", "#27B4ED")
							} else {
								$(".successBtn").html("已 就 诊")
								$(".successBtn").css("background", "#999999")
							}
							sessionStorage.setItem("itemID", JSON.stringify(visitid))
						var d = new Date($scope.data.birthday)
							A = d.getFullYear() + '/';
							B= (d.getMonth() + 1 < 10 ? '0' + (d.getMonth() + 1) : d.getMonth() + 1) + '/';
							C = d.getDate() + ' ';
						    $scope.birthday = A + B + C;
							var y = new Date($scope.data.visittime)
							Y = y.getFullYear() + '/';
							M = (y.getMonth() + 1 < 10 ? '0' + (y.getMonth() + 1) : y.getMonth() + 1) + '/';
							D = y.getDate() + ' ';
							h = y.getHours() + ':';
							m = y.getMinutes() + ':';
							s = y.getSeconds();
							$scope.now = Y + M + D + h + m + s;
							if($scope.data.picturerisk == null) {
								$(".nodeInformation").css("display", "none")
							}
							console.log($scope.data.pics)
//							var haha=$scope.data.pics.slice(0,3)
//							console.log(haha)
							var img = ''
							$.each($scope.data.pics, function(index, item) {
								console.log(item.picurl)
    
								img += '<img src=" ' + item.picurl + '/>'

							})
							$(".pictureBox").append(img)
							sessionStorage.removeItem("collectId")
						}).error(function(err) {
							console.log(err)
						})
//					}, 200)

			} else {
				$(".hugeTitle").removeClass("findMore")
//              alert("模板消息")
//              alert(strs[1])
				$http({
					method: "POST",
					headers: {
						"Content-Type": "application/json",
						"token": token
					},
					url: 'http://www.dianneidna.com/diannei/doctor/getmyvisitrecordinfo',
					data: {
						"visitid": strs[1]
					}
				}).success(function(res) {
					console.log(res)
					$scope.data = res.data
					leida();
					visitid = $scope.data.visitid
					if($scope.data.doctorbrife==null){
					  $(".doctorBrife").html("该患者没有对病情进行描述")
						 alert(1)
					  }else{
					   $(".doctorBrife").html($scope.data.doctorbrife)
					   alert(2)
				   	}
					sessionStorage.setItem("archiveid",$scope.data.archiveid)
					sessionStorage.setItem("visitid",$scope.data.visitid)
				     if($scope.data.isfavorite==0){
								$(".heartImg1").css("display", "block")
					            $(".heartImg2").css("display", "none")
					 }else{
								$(".heartImg2").css("display", "block")
					            $(".heartImg1").css("display", "none")
					 }
				if($scope.data.diseasename == 1) {
					$scope.diseasename = "肺气肿"
				} else if($scope.data.diseasename == 2) {
					$scope.diseasename = "慢性阻塞性肺病"
				} else if($scope.data.diseasename == 3) {
					$scope.diseasename = "慢性支气管炎"
				} else if($scope.data.diseasename == 12) {
					$scope.diseasename = "肺气肿 慢性阻塞性肺病"
				} else if($scope.data.diseasename == 13) {
					$scope.diseasename = "肺气肿 慢性支气管炎"
				} else if($scope.data.diseasename == 23) {
					$scope.diseasename = "慢性阻塞性肺病 慢性支气管炎"
				} else {
					$scope.diseasename = "肺气肿 慢性阻塞性肺病 慢性支气管炎"
				}
					if($scope.data.gender==1){
								 $scope.gender="男"
							}else{
								$scope.gender="女"
							}
							if($scope.data.haslungdisease==0){
								$scope.ok="否"
							}else{
								$scope.ok="是"
							}
							if($scope.data.hadothercancer==0){
								$scope.haha="否"
							}else{
								$scope.haha="是"
							}
							if($scope.data.hasrelativelungdisease==0){
								$scope.hehe="否"
							}else{
								$scope.hehe="是"
							}
							if($scope.data.issmoking==0){
								$scope.ha="否"
							}else{
								$scope.ha="是"
							}
							if($scope.data.issmoked==0){
								$scope.he="否"
							}else{
								$scope.he="是"
							}
					if($scope.data.status == 1) {
						$(".successBtn").html("就 诊")
						$(".successBtn").css("background", "#27B4ED")
					} else {
						$(".successBtn").html("已 就 诊")
						$(".successBtn").css("background", "#999999")
					}
					sessionStorage.setItem("itemID", JSON.stringify(visitid))
					var d = new Date($scope.data.birthday)
					A = d.getFullYear() + '/';
					B= (d.getMonth() + 1 < 10 ? '0' + (d.getMonth() + 1) : d.getMonth() + 1) + '/';
					C = d.getDate() + ' ';
				    $scope.birthday = A + B + C;
					var y = new Date($scope.data.visittime)
					Y = y.getFullYear() + '/';
					M = (y.getMonth() + 1 < 10 ? '0' + (y.getMonth() + 1) : y.getMonth() + 1) + '/';
					D = y.getDate() + ' ';
					h = y.getHours() + ':';
					m = y.getMinutes() + ':';
					s = y.getSeconds();
					$scope.now = Y + M + D + h + m + s;
					if($scope.data.picturerisk == null) {
						$(".nodeInformation").css("display", "none")
					}
					console.log($scope.data.pics)
					var img = ''
					$.each($scope.data.pics, function(index, item) {
						console.log(item.picurl)

						img += '<img src=" ' + item.picurl + '/>'

					})
					$(".pictureBox").append(img)

				}).error(function(err) {
					console.log(err)
				})

			}

			$scope.reset = function() {

				$http({
					method: "POST",
					headers: {
						"Content-Type": "application/json",
						"token": token
					},
					url: 'http://www.dianneidna.com/diannei/doctor/addtofavorite',
					data: {
						"visitid":sessionStorage.getItem("visitid")
					}
				}).success(function(res) {
					console.log(res)
				}).error(function(err) {
					console.log(err)
				})
			}
			$scope.doctor = function() {
				$http({
					method: "POST",
					headers: {
						"Content-Type": "application/json",
						"token": token
					},
					url: 'http://www.dianneidna.com/diannei/doctor/confirmvisit',
					data: {
						"visitid": sessionStorage.getItem("visitid")
					}
				}).success(function(res) {
					console.log(res)
					$(".successBtn").html("已 就 诊")
			    	$(".successBtn").css("background", "#999999")
				}).error(function(err) {
					console.log(err)
				})
			}

		}])

	.controller("AInformationController", ["$scope", "$css", "$rootScope", "$http", "$location", function($scope, $css, $rootScope, $http, $location) {
		$css.add("./css/AInformation.css");

		//////////////////初始化微信

		var initWex = function() {
			var url2 = $location.absUrl();
			//			var url3 = location.href.split("#")[0]
			//			alert(url3)
			var url_wex = "http://www.dianneidna.com/wechat/api/v1/jssdk/sign?url=" + url2;

			$http({
				method: "GET",
				headers: {
					"Content-Type": "application/json"

				},
				url: url_wex,
				data: {}
			}).success(function(res) {
				console.log("初始化微信基本信息config=" + res);
				var appid = res.app_id;
				var timestamp = res.timestamp;
				var nonceStr = res.nonceStr;
				var signature = res.signature;

				wx.config({
					debug: false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
					appId: appid,
					timestamp: timestamp,
					nonceStr: nonceStr,
					signature: signature,
					jsApiList: [
						'chooseImage',
						'previewImage',
						'uploadImage',
						'downloadImage',
					]
				});
			}).error(function(err) {
				console.log(err)
			})

			wx.ready(function() {

//				alert("微信初始化成功");
			});

			wx.error(function(res) {
				alert("微信初始化失败" + res);
				console.log("微信初始化返回的失败数据" + res);
			});
		}

		initWex();

		//////////////////初始化微信

		var token = localStorage.getItem("wex_token");
		$scope.chooseImg = function() {
			wx.chooseImage({
				count: 1, // 默认9
				sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
				sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
				success: function(res) {
					var localIds = res.localIds; // 返回选定照片的本地ID列表，localId可以作为img标签的src属性显示图片

					alert(localIds)
					if(localIds == null || localIds.length == 0) {
						alert('请选择一张图片');
					} else {
						for(var i = 0; i < localIds.length; i++) {
							$(".accountTouxiang").attr("src", localIds[i])
								//							alert("呵呵")
						}

						wx.uploadImage({
							localId: localIds[0], // 需要上传的图片的本地ID，由chooseImage接口获得
							isShowProgressTips: 1, // 默认为1，显示进度提示
							success: function(res) {
								var serverId = res.serverId; // 返回图片的服务器端ID
								//								alert(serverId);
								//								alert("成功")
								sessionStorage.setItem("serverId", serverId)
							}
						});

					}
				}
			});
		}

		$http({
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				"token": token
			},
			url: 'http://www.dianneidna.com/diannei/doctor/getdoctorinfo',
			data: {

			}
		}).success(function(res1) {
			console.log(res1)
			$scope.data = res1.data;
			if($scope.data.gender == 1) {
				$scope.gender = "男"
			} else {
				$scope.gender = "女"
			}
		}).error(function(err) {
			console.log(err)
		})

		$scope.saveBtn = function() {
			$http({
				method: "POST",
				headers: {
					"Content-Type": "application/json",
					"token": token
				},
				url: 'http://www.dianneidna.com/diannei/doctor/updatedoctoravatar',
				data: {
					"mediaid": sessionStorage.getItem("serverId")
				}
			}).success(function(res) {
				console.log(res)
				window.location.href = "http://www.dianneidna.com/weixin/doctor/index.html#/index"
			}).error(function(err) {
				console.log(err)
			})
		}

	}])

	.controller("medicalRecordsController", ["$scope", "$css", "$http", "$rootScope", function($scope, $css, $http, $rootScope) {
			$css.add("./css/e02_4medicalRecords.css");
			$css.remove("./css/e05_2relatedImage.css");
			$css.remove("./css/e04_6diagnoseDetails.css");
			var token = localStorage.getItem("wex_token");
			document.title = "详情";
			$http({
				method: "POST",
				headers: {
					"Content-Type": "application/json",
					"token": token
				},
				url: 'http://www.dianneidna.com/diannei/doctor/visitanalyst',
				data: {

				}
			}).success(function(res1) {
				console.log(res1)
				$scope.data = res1.data;
			}).error(function(err) {
				console.log(err)
			})

			$http({
				method: "POST",
				headers: {
					"Content-Type": "application/json",
					"token": token
				},
				url: 'http://www.dianneidna.com/diannei/doctor/getvisitrecord',
				data: {

				}
			}).success(function(res2) {
				console.log(res2)
				$scope.arr = res2.data;
				
				console.log($scope.arr)
				$.each($scope.arr, function(index, item) {

					var ul = '<ul class="patientDetail"><p class="detailDate">' + item.daydate + '</p></ul>';

					$.each(item.recordlist, function(index1, item2) {
						if(item2.gender==0){
						    item2.gender="女"
						}else{
						    item2.gender="男"
						}
						var d = new Date(item2.visittime)
						h = d.getHours() + ':';
						m = d.getMinutes() + ':';
						s = d.getSeconds();
						var time = h + m + s

						ul += '<li class="patientItem"><a href="#/predictTable" class="patientWrap" visitid=" ' + item2.visitid + ' "><div class="patientContent"><div class="circle"></div><span class="patientName">' + item2.realname + '</span><span class="patientAge">(' + item2.gender + '&nbsp;' + item2.curentage + '岁)</span><span class="patientDate">' + time + '</span></div><div class="patientWord"><span class="illnessDetail"><span class="illnessTitle">病情详述 : </span>' + item2.patientbrife + '</span></div><div class="line"></div></a></li>';
						// $(".patientDetail ").append(list); 

					})
					$(".medicalRecordst_content").append(ul);

				})
				$(".patientItem").on("click", function() {
					console.log($(this).children().attr("visitId"))
					sessionStorage.setItem("visitid", $(this).children().attr("visitId"))
				})
			}).error(function(err) {
				console.log(err)
			})

		}])
		.controller("heightWeightController", ["$scope", "$css", "$rootScope", "$http", function($scope, $css, $rootScope, $http) {
			$css.add("./css/c04_1heightWeightAdd.css");
			var token = localStorage.getItem("wex_token");
			$http({
				method: "POST",
				headers: {
					"Content-Type": "application/json",
					"token": token
				},
				url: 'http://www.dianneidna.com/diannei/doctor/getheightlist ',
				data: {
					"archiveid": sessionStorage.getItem("archiveid")
				}
			}).success(function(res) {
				console.log(res)
				console.log(res.data)
				var div = ''
				$.each(res.data, function(index, item) {
					var d = new Date(item.createtime)

					Y = d.getFullYear() + '/';
					M = (d.getMonth() + 1 < 10 ? '0' + (d.getMonth() + 1) : d.getMonth() + 1) + '/';
					D = d.getDate() + ' ';
					var time1 = Y + M + D;
					h = d.getHours() + ':';
					m = d.getMinutes() + ':';
					s = d.getSeconds();
					var time2 = h + m + s;

					div += '<div class="heightWeightContent1"><p class="heightWeightContent1_1"><span class="time">' + time1 + '</span><span class="time">' + time2 + '</span></p><p class="heightWeightContent1_2"><span>身高：' + item.height + 'cm</span><span>体重：' + item.weight + 'kg</span><span>BMI：' + item.bmi + '</span></p></div>'
				})
				$(".heightWeightbox").append(div)
			}).error(function(err) {
				console.log(err)
			})
		}])
		.controller("basicInformationController", ["$scope", "$css", "$rootScope", "$http","$location","$timeout",function($scope, $css, $rootScope, $http, $location,$timeout) {
			$css.add("./css/D00_1theBasicInformation.css");
			$css.remove("./css/D002_professionalInformation.css");
			$css.remove("./css/D003_professionalInformation2.css");
			$css.remove("./css/D004_professionalInformation3.css");
			$css.remove("./css/d01_1chooseHospital.css");
			$rootScope.url = "http://www.dianneidna.com/diannei/";
			//判断本地是否缓存token
			var token = localStorage.getItem("wex_token");
			var wtoken = sessionStorage.getItem("wtoken");
			//初始化微信基本信息配置信息=====================================================================================
			var initWex = function() {
				var url2 = $location.absUrl();
//				alert()
					//			var url3 = location.href.split("#")[0]
					//			alert(url3)
				var url_wex = "http://www.dianneidna.com/wechat/api/v1/jssdk/sign?url=" + url2;

				$http({
					method: "GET",
					headers: {
						"Content-Type": "application/json"

					},
					url: url_wex,
					data: {}
				}).success(function(res) {
					console.log("初始化微信基本信息config=" + res);
					var appid = res.app_id;
					var timestamp = res.timestamp;
					var nonceStr = res.nonceStr;
					var signature = res.signature;

					wx.config({
						debug: false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
						appId: appid,
						timestamp: timestamp,
						nonceStr: nonceStr,
						signature: signature,
						jsApiList: [
							'chooseImage',
							'previewImage',
							'uploadImage',
							'downloadImage',
						]
					});
				}).error(function(err) {
					console.log(err)
				})

				wx.ready(function() {

//					alert("微信初始化成功");
				});

				wx.error(function(res) {
					alert("微信初始化失败" + res);
					console.log("微信初始化返回的失败数据" + res);
				});
			}

			initWex();
			var token = localStorage.getItem("wex_token");
			//           console.log(token)
			//           alert(token)
			//微信授权相关信息============================================================================================
			$timeout(function() {
					$(".alert").css("display", "none")
				}, 1000)
		   $scope.next = function(){
				if($(".touxiang").attr("src") == "img/pho_icon2@2x.png") {
					$(".alert").css("display","block")
					$timeout(function() {
					$(".alert").css("display", "none")
				}, 1000)
				} else if($("#name").val() == "") {
					$(".alert").css("display","block")
					$timeout(function() {
					$(".alert").css("display", "none")
				}, 1000)
				} else if($(".chooseBut option:selected").val() == "点击选择") {
					$(".alert").css("display","block")
					$timeout(function() {
					$(".alert").css("display", "none")
				}, 1000)
				} else if($(".touxiang").attr("src") != "img/pho_icon2@2x.png" && $("#name").val() != "" && $(".chooseBut option:selected").val() != "点击选择") {
					var dname = $('#name').val();
					var dgender = $('.chooseBut').val();
					var davatar = $(".touxiang").attr("src")
					var mes1 = {
						name: dname,
						avatar: davatar,
						gender: dgender
					};
					localStorage.setItem('mes1', JSON.stringify(mes1))
					console.log(1)
                    $location.path('/professionalInformation/0/0')
					
				}
		    }
//		   $(".ture1").on("click",function(){
//		   	     $(".alert1").css("display","none")
//		   })
//		   $(".ture2").on("click",function(){
//		   	     $(".alert2").css("display","none")
//		   })
//		   $(".ture3").on("click",function(){
//		   	     $(".alert3").css("display","none")
//		   })
			$http({
				method: "POST",
				headers: {
					"Content-Type": "application/json",
					"token": token
				},
				url: 'http://www.dianneidna.com/diannei/doctor/getdoctorinfo',
				data: {

				}
			}).success(function(res) {
				console.log(res)
				$scope.data = res.data
				console.log($scope.data.phone)
			}).error(function(err) {
				console.log(err)
			})

			var firstMes = JSON.parse(localStorage.getItem('mes1'))
			if(firstMes) {
				$('#name').val(firstMes.name)
				$('.chooseBut').val(firstMes.gender)
				$(".touxiang").attr("src", firstMes.avatar)
			}
			//			$('#next').on('click', function() {
			//
			//				var dname = $('#name').val();
			//				var dgender = $('.chooseBut').val();
			//              var davatar=$(".touxiang").attr("src")
			//				var mes1 = {
			//					name: dname,
			//                  avatar:davatar,
			//					gender: dgender
			//				};
			//				localStorage.setItem('mes1', JSON.stringify(mes1))
			////				console.log(1)
			//
			//			})

			$scope.chooseImage = function() {
				wx.chooseImage({
					count: 1, // 默认9
					sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
					sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
					success: function(res) {
						var localIds = res.localIds; // 返回选定照片的本地ID列表，localId可以作为img标签的src属性显示图片
						alert(localIds)
						if(localIds == null || localIds.length == 0) {
							alert('请选择一张图片');
						} else {
							for(var i = 0; i < localIds.length; i++) {
								$(".touxiang").attr("src", localIds[i])
									//	alert("你瞅啥")

							}

							wx.uploadImage({
								localId: localIds[0], // 需要上传的图片的本地ID，由chooseImage接口获得
								isShowProgressTips: 1, // 默认为1，显示进度提示
								success: function(res) {
									var serverId = res.serverId; // 返回图片的服务器端ID
									//									alert(serverId);
									localStorage.setItem("avatarmediaid", serverId)
								}
							});
						}
					}
				});
			}

		}])

	.controller("professionalInformationController", ["$scope", "$css", "$rootScope", "$http","$routeParams","$location","$timeout",function($scope, $css,
			$rootScope,$http,$routeParams,$location,$timeout) {
			$css.add("./css/D002_professionalInformation.css");
			$css.remove("./css/D00_1theBasicInformation.css");
			$css.remove("./css/D003_professionalInformation2.css");
			$css.remove("./css/d01_1chooseHospital.css");
			console.log(1)
			var token = localStorage.getItem("wex_token");
//			if(sessionStorage.getItem("hospitalname") != null) {
//				$(".chooseButton").html(sessionStorage.getItem("hospitalname"))
//
//			} else {
//				return
//			}
			$scope.hospitalname=$routeParams.hospitalname;
			console.log($scope.hospitalname)
			if($scope.hospitalname==0){
				$(".chooseButton").html("点击选择")
			}else{
				$(".chooseButton").html($scope.hospitalname)
			}

            $scope.hospitalid = $routeParams.hospitalid;
            alert($scope.hospitalid)
            console.log($routeParams.hospitalid)
            console.log($scope.hospitalid)
			var a = JSON.parse(localStorage.getItem('mes2'))
			var arr1 = [];
			var arr2 = [];
			$http({
				method: "POST",
				headers: {
					"Content-Type": "application/json",
					"token": token
				},
				url: 'http://www.dianneidna.com/diannei/system/getsectioninfo',
				data: {
					"hospitalid": $scope.hospitalid
				}
			}).success(function(res) {
				console.log(res)
				$scope.section = res.data;
				// console.log($scope.section)

				var option = ''
				$.each($scope.section, function(index, item) {

					option += '<option value=' + item.sectionname + '>' + item.sectionname + '</option>'

					function ObjStory(id, name) //声明对象
					{
						this.id = id;
						this.name = name;
					}
					arr1.push(new ObjStory(item.sectionid, item.sectionname));

				})
				$('.select1').append(option)
				console.log($('#select1 option'))
				console.log(arr1)
				$rootScope.arrm1 = arr1;
				console.log($rootScope.arrm1)
				if(a) {
					$('.select1').val(a.ks)
				}

			}).error(function(err) {
				console.log(err)
			})

			$http({
				method: "POST",
				headers: {
					"Content-Type": "application/json",
					"token": token
				},
				url: 'http://www.dianneidna.com/diannei/system/getdict',
				data: {
					"typevalue": "rank"
				}
			}).success(function(res) {
				console.log(res)
				$scope.rank = res.data;
				var option1 = ''
				$.each($scope.rank, function(index, item) {
					// console.log(item)
					option1 += '<option value=' + item.dataname + '>' + item.dataname + '</option>'

					function ObjStory(id, name) //声明对象
					{
						this.id = id;
						this.name = name;
					}
					arr2.push(new ObjStory(item.datavalue, item.dataname));
				})
				$('.select2').append(option1)
				console.log($('.select2 option'))
				$rootScope.arrm2 = arr2;
				if(a) {
					$('.select2').val(a.work)
				}

			}).error(function(err) {
				console.log(err)
			})
            $(".ture4").on("click",function(){
		   	     $(".alert4").css("display","none")
		   })
		   $(".ture5").on("click",function(){
		   	     $(".alert4").css("display","none")
		   })
		   $(".ture6").on("click",function(){
		   	     $(".alert4").css("display","none")
		   })
		   	$timeout(function() {
					$(".alert").css("display", "none")
				}, 1000)
			$scope.next2=function(){
				if($(".chooseButton").html() == "点击选择") {
					$(".alert").css("display","block")
					$timeout(function() {
					$(".alert").css("display", "none")
				}, 1000)
					return;
				}
				if($(".select1 option:selected").val() == "点击选择") {
					$(".alert").css("display","block")
					$timeout(function() {
					$(".alert").css("display", "none")
				}, 1000)
					return;
				}
				if($(".select2 option:selected").val() == "点击选择") {
					$(".alert").css("display","block")
					$timeout(function() {
					$(".alert").css("display", "none")
				}, 1000)
					return;
				}
				if($(".chooseButton").html() != "点击选择" && $(".select1 option:selected").val() != "点击选择" && $(".select2 option:selected").val() != "点击选择") {
					
					var hosId = sessionStorage.getItem("hospitalid");
					console.log(hosId)
					var ks2 = $('.select1').val();
					console.log($('.select1').val())

					var workR = $('.select2').val();
					console.log(workR)
					var mes2 = {
						hosName: hosId,
						ks: ks2,
						work: workR
					};
					localStorage.setItem('mes2', JSON.stringify(mes2))
					console.log(1)
				    $location.path("/professionalInformation2")
				}

			}

		}])
		.controller("professionalInformation2Controller", ["$scope", "$css", "$http", "$rootScope", "$location", "$timeout",function($scope, $css, $http, $rootScope, $location,$timeout) {
			$css.add("./css/D003_professionalInformation2.css");
			$css.remove("./css/d01_1chooseHospital.css");
			$css.remove("./css/E01_1doctor.css")
			localStorage.setItem("certificatetype", "1")
			var initWex = function() {
				var url2 = $location.absUrl();
				//			var url3 = location.href.split("#")[0]
				//			alert(url3)
				var url_wex = "http://www.dianneidna.com/wechat/api/v1/jssdk/sign?url=" + url2;

				$http({
					method: "GET",
					headers: {
						"Content-Type": "application/json"

					},
					url: url_wex,
					data: {}
				}).success(function(res) {
					console.log("初始化微信基本信息config=" + res);
					var appid = res.app_id;
					var timestamp = res.timestamp;
					var nonceStr = res.nonceStr;
					var signature = res.signature;

					wx.config({
						debug: false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
						appId: appid,
						timestamp: timestamp,
						nonceStr: nonceStr,
						signature: signature,
						jsApiList: [
							'chooseImage',
							'previewImage',
							'uploadImage',
							'downloadImage',
						]
					});
				}).error(function(err) {
					console.log(err)
				})

				wx.ready(function() {

					alert("微信初始化成功");
				});

				wx.error(function(res) {
					alert("微信初始化失败" + res);
					console.log("微信初始化返回的失败数据" + res);
				});
			}

			initWex();
			var token = localStorage.getItem("wex_token");
			$(".formCircle1").on("click", function() {
				$(".rightImg1").css("display", "block");
				$(".rightImg2").css("display", "none");
				$(".mask1").removeClass("mask")
				$(".mask2").addClass("mask")
				localStorage.setItem("certificatetype", "1")
				$(".plus").attr("src", "img/3@2x.png")
				$("#gao3").css("display", "none")
				$("#gao4").css("display", "none")
				$("#xiang3").css("display", "none")
				$("#xiang4").css("display", "none")
			})
			$(".formCircle2").on("click", function() {
				$(".rightImg2").css("display", "block");
				$(".rightImg1").css("display", "none");
				$(".mask2").removeClass("mask")
				$(".mask1").addClass("mask")
				localStorage.setItem("certificatetype", "2")
				$(".plus").attr("src", "img/3@2x.png")
				$("#gao1").css("display", "none")
				$("#gao2").css("display", "none")
				$("#xiang1").css("display", "none")
				$("#xiang2").css("display", "none")

			})
            	$timeout(function() {
					$(".alert").css("display", "none")
				}, 1000)
			$scope.submit = function() {
				if(localStorage.getItem("certificatetype") == 1) {
					if($(".img1").attr("src") == "img/3@2x.png") {
						$(".alert").css("display","block")
							$timeout(function() {
							$(".alert").css("display", "none")
						}, 1000)
							return
					}
					if($(".img2").attr("src") == "img/3@2x.png") {
						$(".alert").css("display","block")
							$timeout(function() {
							$(".alert").css("display", "none")
						}, 1000)
						return
					}
					if($(".img1").attr("src") != "img/3@2x.png" && $(".img2").attr("src") != "img/3@2x.png") {
						
						var mes = JSON.parse(localStorage.getItem('mes1'));
						var name = mes.name;
						var tel = mes.tel;
						var gender = mes.gender;
						var genderId;
						if(gender == '男') {
							genderId = 1;
						} else {
							genderId = 0;
						}
						var mes2 = JSON.parse(localStorage.getItem('mes2'));
						var hosId = mes2.hosName;
						var ks = mes2.ks;
						var ksId;
						var arrm1 = $rootScope.arrm1;
						var arrm2 = $rootScope.arrm2;
						console.log(arrm1)
						for(var i = 0; i < arrm1.length; i++) {
							if(ks == arrm1[i].name) {
								ksId = arrm1[i].id
							}
						}
						console.log(ksId)
						var work = mes2.work;
						var workId;
						for(var i = 0; i < arrm2.length; i++) {
							if(work == arrm2[i].name) {
								workId = arrm2[i].id
							}
						}
						var one = localStorage.getItem("certificatetype")
						var two = localStorage.getItem("avatarmediaid")
						var three = localStorage.getItem("certifypicmediaid")
						var four = localStorage.getItem("idpicmediaid")
						$http({
							method: "POST",
							headers: {
								"Content-Type": "application/json",
								"token": token
							},
							url: 'http://www.dianneidna.com/diannei/doctor/adddoctorinfo',
							data: {

								"doctorname": name,
								"gender": genderId,
								"hospitalid": hosId,
								"phone": tel,
								"rankvalue": workId,
								"sectionid": ksId,
								"certificatetype": one,
								"avatarmediaid": two,
								"certifypicmediaid": three,
								"idpicmediaid": four
							}
						}).success(function(res) {
							console.log(res)
							localStorage.clear();
							sessionStorage.removeItem("hospitalid")
							sessionStorage.removeItem("hospitalname")
							$location.path("/professionalInformation3")
						}).error(function(err) {
							console.log(err)
						})
					}
				} else {
					if($(".img3").attr("src") == "img/3@2x.png") {
						$(".alert").css("display","block")
							$timeout(function() {
							$(".alert").css("display", "none")
						}, 1000)
						return
					}
					if($(".img4").attr("src") == "img/3@2x.png") {
						$(".alert").css("display","block")
							$timeout(function() {
							$(".alert").css("display", "none")
						}, 1000)
						return
					}
					if($(".img3").attr("src") != "img/3@2x.png" && $(".img4").attr("src") != "img/3@2x.png") {
						window.location.href = "http://www.dianneidna.com/weixin/doctor/index.html#/professionalInformation3"
						var mes = JSON.parse(localStorage.getItem('mes1'));
						var name = mes.name;
						var tel = mes.tel;
						var gender = mes.gender;
						var genderId;
						if(gender == '男') {
							genderId = 1;
						} else {
							genderId = 0;
						}
						var mes2 = JSON.parse(localStorage.getItem('mes2'));
						var hosId = mes2.hosName;
						var ks = mes2.ks;
						var ksId;
						var arrm1 = $rootScope.arrm1;
						var arrm2 = $rootScope.arrm2;
						console.log(arrm1)
						for(var i = 0; i < arrm1.length; i++) {
							if(ks == arrm1[i].name) {
								ksId = arrm1[i].id
							}
						}
						console.log(ksId)
						var work = mes2.work;
						var workId;
						for(var i = 0; i < arrm2.length; i++) {
							if(work == arrm2[i].name) {
								workId = arrm2[i].id
							}
						}
						var one = localStorage.getItem("certificatetype")
						var two = localStorage.getItem("avatarmediaid")
						var three = localStorage.getItem("certifypicmediaid")
						var four = localStorage.getItem("idpicmediaid")
						$http({
							method: "POST",
							headers: {
								"Content-Type": "application/json",
								"token": token
							},
							url: 'http://www.dianneidna.com/diannei/doctor/adddoctorinfo',
							data: {

								"doctorname": name,
								"gender": genderId,
								"hospitalid": hosId,
								"phone": tel,
								"rankvalue": workId,
								"sectionid": ksId,
								"certificatetype": one,
								"avatarmediaid": two,
								"certifypicmediaid": three,
								"idpicmediaid": four
							}
						}).success(function(res) {
							console.log(res)
							localStorage.clear();
							sessionStorage.removeItem("hospitalid")
							sessionStorage.removeItem("hospitalname")
							$location.path("/professionalInformation3")
						}).error(function(err) {
							console.log(err)
						})
					}
				}

			}
			$scope.chooseImg1 = function() {

				wx.chooseImage({
					count: 1, // 默认9
					sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
					sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
					success: function(res) {
						var localIds = res.localIds; // 返回选定照片的本地ID列表，localId可以作为img标签的src属性显示图片
						//						alert(localIds)
						if(localIds == null || localIds.length == 0) {
							alert('请选择一张图片');
						} else {
							for(var i = 0; i < localIds.length; i++) {
								$(".img1").attr("src", localIds[i])
								setTimeout(function() {
										$("#gao1").css("display", "block")
										$("#xiang1").css("display", "block")
									}, 500)
									//								alert("呵呵")

							}

							wx.uploadImage({
								localId: localIds[0], // 需要上传的图片的本地ID，由chooseImage接口获得
								isShowProgressTips: 1, // 默认为1，显示进度提示
								success: function(res) {
									var serverId = res.serverId; // 返回图片的服务器端ID
									localStorage.setItem("certifypicmediaid", serverId)
										//									alert(serverId);
								}
							});

						}
					}
				});
			}
			$scope.chooseImg2 = function() {

				wx.chooseImage({
					count: 1, // 默认9
					sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
					sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
					success: function(res) {
						var localIds = res.localIds; // 返回选定照片的本地ID列表，localId可以作为img标签的src属性显示图片
						//						alert(localIds)
						if(localIds == null || localIds.length == 0) {
							alert('请选择一张图片');
						} else {
							for(var i = 0; i < localIds.length; i++) {

								$(".img2").attr("src", localIds[i])
								setTimeout(function() {
										$("#gao2").css("display", "block")
										$("#xiang2").css("display", "block")
									}, 500)
									//								alert("呵呵")

							}

							wx.uploadImage({
								localId: localIds[0], // 需要上传的图片的本地ID，由chooseImage接口获得
								isShowProgressTips: 1, // 默认为1，显示进度提示
								success: function(res) {
									var serverId = res.serverId; // 返回图片的服务器端ID
									localStorage.setItem("idpicmediaid", serverId)
										//									alert(serverId);
								}
							});
						}
					}
				});
			}
			$scope.chooseImg3 = function() {

				wx.chooseImage({
					count: 1, // 默认9
					sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
					sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
					success: function(res) {
						var localIds = res.localIds; // 返回选定照片的本地ID列表，localId可以作为img标签的src属性显示图片
						alert(localIds)
						if(localIds == null || localIds.length == 0) {
							alert('请选择一张图片');
						} else {
							for(var i = 0; i < localIds.length; i++) {

								$(".img3").attr("src", localIds[i])
								setTimeout(function() {
									$("#gao3").css("display", "block")
									$("#xiang3").css("display", "block")
								}, 500)

							}

							wx.uploadImage({
								localId: localIds[0], // 需要上传的图片的本地ID，由chooseImage接口获得
								isShowProgressTips: 1, // 默认为1，显示进度提示
								success: function(res) {
									var serverId = res.serverId; // 返回图片的服务器端ID
									localStorage.setItem("certifypicmediaid", serverId)
										//									alert(serverId);
								}
							});
						}
					}
				});
			}
			$scope.chooseImg4 = function() {

				wx.chooseImage({
					count: 1, // 默认9
					sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
					sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
					success: function(res) {
						var localIds = res.localIds; // 返回选定照片的本地ID列表，localId可以作为img标签的src属性显示图片
						alert(localIds)
						if(localIds == null || localIds.length == 0) {
							alert('请选择一张图片');
						} else {
							for(var i = 0; i < localIds.length; i++) {

								$(".img4").attr("src", localIds[i])

								setTimeout(function() {
									$("#gao4").css("display", "block")
									$("#xiang4").css("display", "block")
								}, 500)

							}

							wx.uploadImage({
								localId: localIds[0], // 需要上传的图片的本地ID，由chooseImage接口获得
								isShowProgressTips: 1, // 默认为1，显示进度提示
								success: function(res) {
									var serverId = res.serverId; // 返回图片的服务器端ID
									localStorage.setItem("idpicmediaid", serverId)
										//									alert(serverId);
								}
							});
						}
					}
				});
			}

			$("#xiang1").on("click", function() {
				$(".img1").attr("src", "img/3@2x.png")

				$("#xiang1").css("display", "none")
				setTimeout(function() {
					$("#gao1").css("display", "none")
				}, 1000)
			})
			$("#xiang2").on("click", function() {
				$(".img2").attr("src", "img/3@2x.png")

				$("#xiang2").css("display", "none")
				setTimeout(function() {
					$("#gao2").css("display", "none")
				}, 1000)
			})
			$("#xiang3").on("click", function() {
				$(".img3").attr("src", "img/3@2x.png")

				$("#xiang3").css("display", "none")
				setTimeout(function() {
					$("#gao3").css("display", "none")
				}, 1000)
			})
			$("#xiang4").on("click", function() {
				$(".img4").attr("src", "img/3@2x.png")

				$("#xiang4").css("display", "none")
				setTimeout(function() {
					$("#gao4").css("display", "none")
				}, 1000)
			})

		}])
		.controller("professionalInformation3Controller", ["$scope", "$css", function($scope, $css) {
			$css.add("./css/D004_professionalInformation3.css");
			$css.remove("./css/D002_professionalInformation.css");
			$css.remove("./css/D003_professionalInformation2.css");
			$css.remove("./css/d01_1chooseHospital.css");
		}])
		.controller("chooseHospitalController", ["$scope", "$css", "$rootScope", "$http", function($scope, $css, $rootScope, $http) {
			$css.add("./css/d01_1chooseHospital.css");
			// $css.add("./css/e03_2choosePatient.css")
			var token = localStorage.getItem("wex_token");
			$http({
				method: "POST",
				headers: {
					"Content-Type": "application/json",
					"token": token
				},
				url: 'http://www.dianneidna.com/diannei/system/gethospitallist',
				data: {
					"searchkey": ""
				}
			}).success(function(res) {
				console.log(res)
				$scope.data = res.data;

				$.each($scope.data, function(index, item) {
					console.log(index, item)
					var p = '<p class="FirstLetter">' + index + '</p>';
					var span = '<span class="searchLetter">' + index + '</span>';
					$('#last').before(span)
					$.each(item, function(index1, item1) {
						p += '<a href="#/professionalInformation/'+item1.hospitalid+'/'+item1.hospitalname+'" class="addItem addWrap" hospitalid="' + item1.hospitalid + '"><span class="haha">' + item1.hospitalname + '</span></a>'

					})
					$(".letter1").append(p)

					$(".searchLetter").on("tap", function() {
						$scope.value = $(this).html();
						console.log($scope.value)

						console.log($(".FirstLetter").eq(0).text())
						for(var i = 0; i < $(".FirstLetter").length; i++) {
							if($(".FirstLetter").eq(i).text() == $scope.value.toLowerCase()) {
								console.log(i)
								$scope.num = i;
								$scope.top = $(".FirstLetter").eq($scope.num).offset().top;
							}
						}
						if($scope.top <= 10) {
							return
						} else {
							// console.log($scope.num,$scope.top,$(document).scrollTop()) ;
							$("body").animate({
									scrollTop: $scope.top
								}, 20)
								// console.log($("body").scrollTop())
						}

						// console.log($(".box"))
						// console.log($(".FirstLetter").eq($scope.num).html())

					})

				})
				$(".addItem").on("click", function() {
					console.log($(this).attr("hospitalid"))
					sessionStorage.setItem("hospitalid", $(this).attr("hospitalid"))
				})

			}).error(function(err) {
				console.log(err)
			})

		}])

	.controller("matchHospitalController", ["$scope", "$css", "$rootScope", "$http", "$timeout", function($scope, $css, $rootScope, $http, $timeout) {
		$css.add("./css/d01_2matchHospital.css");
		$css.remove("./css/d01_1chooseHospital.css");
		$rootScope.url = "http://www.dianneidna.com/diannei/";
		var token = localStorage.getItem("wex_token");
		document.getElementById("searchWord").oninput = function() {
			console.log($(".searchWord").val())
			localStorage.setItem("searchWord1", $(".searchWord").val())
			if($(".searchWord").val() == "") {
				$(".letter").empty()
				console.log(1)
			} else {
				console.log(1)
				$timeout(function() {

					$http({
						method: "POST",
						headers: {
							"Content-Type": "application/json",
							"token": token
						},
						url: 'http://www.dianneidna.com/diannei/system/gethospitallist',
						data: {
							"searchkey": localStorage.getItem("searchWord1")
						}
					}).success(function(res) {
						console.log(res)
						console.log(res.data)
						$scope.data = res.data
						var li = ' '
						$.each($scope.data, function(index, item) {
							console.log(index, item)
							$.each(item, function(index1, item1) {
								li += '<a href="" hospitalid="' + item1.hospitalid + '" class="addItem addWrap"><span class="haha">' + item1.hospitalname + '</span></a>';
								console.log(li)
							})
						})
						$(".letter").append(li);
						$(".addItem").on("click", function() {
							console.log($(this).children().html())
							sessionStorage.setItem("hospitalname", $(this).children().html())
							window.location.href = "http://www.dianneidna.com/weixin/doctor/index.html#/professionalInformation"
							console.log($(this).attr("hospitalid"))
							sessionStorage.setItem("hospitalid", $(this).attr("hospitalid"))

						})

					}).error(function(err) {
						console.log(err)
					})

				}, 10)
			}
		}
		$(".searchWord").focus(function() {
			$(".letter").empty()
		})

	}])
})