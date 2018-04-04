/**
 * @author lokie wang
 */

// some dependency jquery extend

/*
 * 1. jquery extend to fix oninput event which ie8 and ie9 does not work
 */
(function($) {

	var testNode = document.createElement("input");
	var isInputSupported = "oninput" in testNode && (!("documentMode" in document) || document.documentMode > 9);

	var hasInputCapabilities = function(elem) {
		return elem.nodeName === "INPUT" && (elem.type === "text" || elem.type === "password");
	};

	var activeElement = null;
	var activeElementValue = null;
	var activeElementValueProp = null;

	/**
	 * (For old IE.) Replacement getter/setter for the `value` property that
	 * gets set on the active element.
	 */
	var newValueProp = {
		get : function() {
			return activeElementValueProp.get.call(this);
		},
		set : function(val) {
			activeElementValue = val;
			activeElementValueProp.set.call(this, val);
		}
	};

	/**
	 * (For old IE.) Starts tracking propertychange events on the passed-in element
	 * and override the value property so that we can distinguish user events from
	 * value changes in JS.
	 */
	var startWatching = function(target) {
		activeElement = target;
		activeElementValue = target.value;
		activeElementValueProp = Object.getOwnPropertyDescriptor(target.constructor.prototype, "value");

		Object.defineProperty(activeElement, "value", newValueProp);
		activeElement.attachEvent("onpropertychange", handlePropertyChange);
	};

	/**
	 * (For old IE.) Removes the event listeners from the currently-tracked
	 * element, if any exists.
	 */
	var stopWatching = function() {
		if (!activeElement)
			return;

		// delete restores the original property definition
		delete activeElement.value;
		activeElement.detachEvent("onpropertychange", handlePropertyChange);

		activeElement = null;
		activeElementValue = null;
		activeElementValueProp = null;
	};

	/**
	 * (For old IE.) Handles a propertychange event, sending a textChange event if
	 * the value of the active element has changed.
	 */
	var handlePropertyChange = function(nativeEvent) {
		if (nativeEvent.propertyName !== "value")
			return;

		var value = nativeEvent.srcElement.value;
		if (value === activeElementValue)
			return;
		activeElementValue = value;

		$(activeElement).trigger("textchange");
	};

	if (isInputSupported) {
		$(document).on("input", function(e) {
			// In modern browsers (i.e., not IE 8 or 9), the input event is
			// exactly what we want so fall through here and trigger the
			// event...
			//if (e.target.nodeName !== "TEXTAREA") {
				// ...unless it's a textarea, in which case we don't fire an
				// event (so that we have consistency with our old-IE shim).
				$(e.target).trigger("textchange");
			//}
		});
	} else {
		$(document).on("focusin", function(e) {
			// In IE 8, we can capture almost all .value changes by adding a
			// propertychange handler and looking for events with propertyName
			// equal to 'value'.
			// In IE 9, propertychange fires for most input events but is buggy
			// and doesn't fire when text is deleted, but conveniently,
			// selectionchange appears to fire in all of the remaining cases so
			// we catch those and forward the event if the value has changed.
			// In either case, we don't want to call the event handler if the
			// value is changed from JS so we redefine a setter for `.value`
			// that updates our activeElementValue variable, allowing us to
			// ignore those changes.
			if (hasInputCapabilities(e.target)) {
				// stopWatching() should be a noop here but we call it just in
				// case we missed a blur event somehow.
				stopWatching();
				startWatching(e.target);
			}
		}).on("focusout", function() {
			stopWatching();
		}).on("selectionchange keyup keydown", function() {
			// On the selectionchange event, e.target is just document which
			// isn't helpful for us so just check activeElement instead.
			//
			// 90% of the time, keydown and keyup aren't necessary. IE 8 fails
			// to fire propertychange on the first input event after setting
			// `value` from a script and fires only keydown, keypress, keyup.
			// Catching keyup usually gets it and catching keydown lets us fire
			// an event for the first keystroke if user does a key repeat
			// (it'll be a little delayed: right before the second keystroke).
			// Other input methods (e.g., paste) seem to fire selectionchange
			// normally.
			if (activeElement && activeElement.value !== activeElementValue) {
				activeElementValue = activeElement.value;
				$(activeElement).trigger("textchange");
			}
		});
	}
})(jQuery);

// shim for some html5 feature which use in our lib
/*
 * object watch implement observe desgin parten
 */
(function() {
	// object.watch
	if (!Object.prototype.watch) {
		Object.defineProperty(Object.prototype, "watch", {
			enumerable : false,
			configurable : true,
			writable : false,
			value : function(prop, handler) {
				var oldval = this[prop], newval = oldval, getter = function() {
					return newval;
				}, setter = function(val) {
					oldval = newval;
					return newval = handler.call(this, prop, oldval, val);
				};

				if (
				delete this[prop]) {// can't watch constants
					Object.defineProperty(this, prop, {
						get : getter,
						set : setter,
						enumerable : true,
						configurable : true
					});
				}
			}
		});
	}

	// object.unwatch
	if (!Object.prototype.unwatch) {
		Object.defineProperty(Object.prototype, "unwatch", {
			enumerable : false,
			configurable : true,
			writable : false,
			value : function(prop) {
				var val = this[prop];
				delete this[prop];
				// remove accessors
				this[prop] = val;
			}
		});
	}
})();

// for register macco namespace which is the main namespace of our library
(function($) {
	// service for api
	var service_domain = 'http://api.5imakeup.com/MeiDeNi';
	var debug = true;
	// namespace for macco javascript library
	var macco = {
		// common helper
		common : {
			// arguments : all
			// console.log
			log : function() {
				var a = window.console, b = arguments;
				if (a && a.log) {
					a.log.apply ? a.log.apply(a, b) : a.log(b);
				}
			},

			// arguments : all
			// console.dir
			dir : function() {
				var a = window.console, b = arguments;
				if (a && a.dir) {
					a.dir.apply ? a.dir.apply(a, b) : a.dir(b);
				}
			},

			// arguments : all
			// arguments[0]: obj
			// arguments[n]: str
			// delete obj prototype
			delPrototype : function() {
				var arg = arguments;
				var len = arguments.length;
				if (len > 0) {
					var obj = arg[0];
					if (obj == null) {
						return "";
					}
					for (var i = 1; i < len; i++) {
						if (obj.hasOwnProperty(arg[i])) {
							delete obj[arg[i]];
						}
					}
					return arg[0];
				}
				return null;
			},

			// obj : obj
			// ps: obj
			// obj extend obj
			extobj : function(obj, ps) {
				if (!obj)
					obj = {};
				if (!ps)
					return obj;
				for (var p in ps) {
					if (!obj[p]) {
						obj[p] = ps[p];
					}
				}
				return obj;
			},

			// encode any object to json string
			encode : function(object) {
				var type = typeof object;
				if ('object' == type) {
					if ( object instanceof Array)
						type = 'array';
					else if ( object instanceof RegExp)
						type = 'regexp';
					else
						type = 'object';
				}
				switch (type) {
					case 'undefined':
					case 'unknown':
						return;
						break;
					case 'function':
					case 'boolean':
					case 'regexp':
						return object.toString();
						break;
					case 'number':
						return isFinite(object) ? object.toString() : 'null';
						break;
					case 'string':
						return '"' + object.replace(/(\\|\")/g, "\\$1").replace(/\n|\r|\t/g, function() {
							var a = arguments[0];
							return (a == '\n') ? '\\n' : (a == '\r') ? '\\r' : (a == '\t') ? '\\t' : "";
						}) + '"';
						break;
					case 'object':
						if (object === null)
							return 'null';
						var results = [];
						for (var property in object) {
							var value = mya.encode(object[property]);
							if (value !== undefined)
								results.push(mya.encode(property) + ':' + value);
						}
						return '{' + results.join(',') + '}';
						break;
					case 'array':
						var results = [];
						for (var i = 0; i < object.length; i++) {
							var value = mya.encode(object[i]);
							if (value !== undefined)
								results.push(value);
						}
						return '[' + results.join(',') + ']';
						break;
				}
			},
		},
		// regs
		regs : {
			usn : /^[a-zA-Z0-9_-]{6,16}$/,
			psd : /^[a-zA-Z0-9_-]{6,16}$/,
			mail : /^([a-zA-Z0-9_\.-]+)@([\da-zA-Z\.-]+)\.([a-zA-Z\.]{2,6})$/,
			num : /^[0-9]+(.[0-9]+)?$/,
			url : /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/,
			eng : /^[0-9a-z]+$/,
			chn : /^[\u2E80-\u9FFF]+$/,
			hex : /^#?([a-f0-9]{6}|[a-f0-9]{3})$/,
			notnull : /\S/,
			all : /^[.]+$/
		},

		// network helper
		network : {
			// post ajax
			// url: url of api
			// data: json like data to post
			// callback function
			post : function(url, data, callback) {
				$.support.cors = true;
				if (!$.isFunction(callback)) {
					if (debug) {
						alert('callback argument is not a function');
					}
					console.log('callback argument is not a function');
					return;
				}
				var service_url = service_domain + url;
				$.ajax({
					url : service_url,
					data : data,
					cache : false,
					type : 'POST',
					success : function(result) {
						var retData = $.parseJSON(result);
						if (retData.IsSuccess) {
							callback(retData.Data);
						} else {
							if (debug) {
								alert(retData.ErrorMessage);
							}
							console.log(retData.ErrorMessage);
						}
					}
				});
			},
			// get ajax
			get : function(url, data, callback) {
				if (!$.isFunction(callback)) {
					if (debug) {
						alert('callback argument is not a function');
					}
					console.log('callback argument is not a function');
					return;
				}
				var service_url = service_domain + url;
				$.ajax({
					url : service_url,
					data : data,
					cache : false,
					type : 'GET',
					success : function(result) {
						var retData = $.parseJSON(result);
						if (retData.IsSuccess) {
							callback(retData.Data);
						} else {
							if (debug) {
								alert(retData.ErrorMessage);
							}
							console.log(retData.ErrorMessage);
						}
					}
				});
			},
			// include html file
			include : function(url, $obj, callback) {
				$obj.load(url, callback);
			},
			// only supoort webkit firfox ie10+
			postAjaxForm : function(url, data, $fileInputs, callback) {
				if (!$.isFunction(callback)) {
					if (debug) {
						alert('callback argument is not a function');
					}
					console.log('callback argument is not a function');
					return;
				}
				var service_url = service_domain + url;
				var formData = new FormData();

				$.each(data, function(k, v) {
					formData.append(k, v);
				});

				$fileInputs.each(function(idx, fileInput) {
					$.each($(fileInput)[0].files, function(i, file) {
						formData.append($(fileInput).attr('name'), file);
					});
				});

				$.ajax({
					url : service_url,
					data : formData,
					cache : false,
					contentType : false,
					processData : false,
					type : 'POST',
					success : function(data) {
						callback(data);
					}
				});
			},
			querystring : function(name) {
				var search = window.location.search.replace('?', '');
				var searchStrs = search.split('&');
				var queryStrings = [];
				for (var i = 0; i < searchStrs.length; i++) {
					var searchStr = searchStrs[i];
					var strSearch = searchStr.split('=');
					var key = strSearch[0];
					var val = strSearch[1];
					queryStrings[key] = val;
				}
				if (name == undefined) {
					return queryStrings;
				} else {
					var queryStringVal = queryStrings[name];
					return queryStringVal;
				}
			},
			cookie : function(key, value, options) {
				var pluses = /\+/g;
				function encode(s) {
					return config.raw ? s : encodeURIComponent(s);
				}

				function decode(s) {
					return config.raw ? s : decodeURIComponent(s);
				}

				function stringifyCookieValue(value) {
					return encode(config.json ? JSON.stringify(value) : String(value));
				}

				function parseCookieValue(s) {
					if (s.indexOf('"') === 0) {
						// This is a quoted cookie as according to RFC2068, unescape...
						s = s.slice(1, -1).replace(/\\"/g, '"').replace(/\\\\/g, '\\');
					}

					try {
						// Replace server-side written pluses with spaces.
						// If we can't decode the cookie, ignore it, it's unusable.
						// If we can't parse the cookie, ignore it, it's unusable.
						s = decodeURIComponent(s.replace(pluses, ' '));
						return config.json ? JSON.parse(s) : s;
					} catch(e) {
					}
				}

				function read(s, converter) {
					var value = config.raw ? s : parseCookieValue(s);
					return $.isFunction(converter) ? converter(value) : value;
				}

				// Write
				if (arguments.length > 1 && !$.isFunction(value)) {
					options = $.extend({}, config.defaults, options);

					if ( typeof options.expires === 'number') {
						var days = options.expires, t = options.expires = new Date();
						t.setMilliseconds(t.getMilliseconds() + days * 864e+5);
					}

					return (document.cookie = [encode(key), '=', stringifyCookieValue(value), options.expires ? '; expires=' + options.expires.toUTCString() : '', // use expires attribute, max-age is not supported by IE
					options.path ? '; path=' + options.path : '', options.domain ? '; domain=' + options.domain : '', options.secure ? '; secure' : ''].join(''));
				}

				// Read

				var result = key ? undefined : {},
				// To prevent the for loop in the first place assign an empty array
				// in case there are no cookies at all. Also prevents odd result when
				// calling $.cookie().
				cookies = document.cookie ? document.cookie.split('; ') : [], i = 0, l = cookies.length;

				for (; i < l; i++) {
					var parts = cookies[i].split('='), name = decode(parts.shift()), cookie = parts.join('=');

					if (key === name) {
						// If second argument (value) is a function it's a converter...
						result = read(cookie, value);
						break;
					}

					// Prevent storing a cookie that we couldn't decode.
					if (!key && ( cookie = read(cookie)) !== undefined) {
						result[name] = cookie;
					}
				}

				return result;
			}
		},

		// ui control
		ui : {
			control:function() {
				var controlInternal = function() {
					
				};
				controlInternal.prototype.Type = "";
				controlInternal.prototype.ID = "";	
				controlInternal.prototype.$jqObj = undefined;
				controlInternal.prototype.GenerateID = function() {
					function guid() {
					  function s4() {
					    return Math.floor((1 + Math.random()) * 0x10000)
					      .toString(16)
					      .substring(1);
					  }
					  return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
					    s4() + '-' + s4() + s4() + s4();
					}
					return 'macco-' + guid();
				};
				
				return new controlInternal();		
			},
			
			verificationResult:function() {
				var verificationResultInternal = function() {
					
				};
				verificationResultInternal.prototype.IsPass = false;
				verificationResultInternal.prototype.VerifyType = '';
				verificationResultInternal.prototype.Children = [];
				
				verificationResultInternal.prototype.CheckIsPass = function() {
					var result = false;
					if(this.Children.length >0) {
						for(i=0;i<this.Children.length;i++) {
							if(!this.Children[i].CheckIsPass()) {
								result = false; 
								break;
							} else {
								result = true;
							}
						}
					} else {
						result = this.IsPass;	
					}
					
					return result;
				};
				
				return new verificationResultInternal();
			},
			
			pannel: function($obj) {
				var pannelInternal = function($obj) {
					
				};
				pannelInternal.prototype= macco.ui.control();
				pannelInternal.prototype.DataSource = [];
				pannelInternal.prototype.VerificationResult = undefined;
				pannelInternal.prototype.Children = [];
	
				
				// 提交
				pannelInternal.prototype.Submit = function() {
					if(this.VerificationResult.CheckIsPass()) {
						alert('ok');
					} else {
						alert('no');
					}
				};
				
				// 初始化
				pannelInternal.prototype.Init = function() {
					if($obj == undefined) {
						return;
					} else if(typeof($obj) == 'string') {
						this.$jqObj = $($obj);
						var controlType = this.$jqObj.attr('data-macco-control');
						if(controlType == undefined || controlType != 'pannel') {
							if(debug) {
								alert('pannel must has attrbute macco control');
							}
							macco.common.log('pannel must has attrbute macco control');
							return;
						} 
					} else if($obj instanceof $) {
						this.$jqObj = $obj;
						var controlType = this.$jqObj.attr('data-macco-control');
						if(controlType == undefined || controlType != 'pannel') {
							if(debug) {
								alert('pannel must has attrbute macco control');
							}
							macco.common.log('pannel must has attrbute macco control');
							return;
						} 
					}
					
					this.Type = 'Pannel';
					this.ID = this.GenerateID();
					this.VerificationResult = macco.ui.verificationResult();
					this.AddChild();
					
				};
				
				pannelInternal.prototype.AddChild = function(child) {
					var target = this;
					var radioBtnsGroups = [];
					if(child == undefined) {
						this.$jqObj.find('[data-macco-control]').each(function(idx,ctrl) {
							var $ctrl = $(ctrl);
							var ctrlType = $ctrl.attr('data-macco-control');
							switch(ctrlType) {
								case 'textbox':
									var textbox = macco.ui.textbox($ctrl);
									textbox.init();
									target.Children.push(textbox);
									target.VerificationResult.Children.push(textbox.verificationResult);
									break;
								case 'radio':
									var gorup = $ctrl.attr('data-group');
									if( gorup !=undefined) {
										if(!radioBtnsGroups.contains(gorup)) {
											var radio = macco.ui.radio($ctrl);
											radio.init();
											target.Children.push(radio);
											target.VerificationResult.Children.push(radio.verificationResult);
											radioBtnsGroups.push(gorup);
										}
									}
									break;
							}
						});
					} else if(child instanceof macco.ui.control) {
						target.Children.push(child);
					}
				}; 
				
				return new pannelInternal($obj);
			},
			
			// basic data grid
			grid : function($obj, data, config) {
				if ($obj.attr('data-macco-control') == 'grid') {
					// find all data-grid-type:RowTemplete
					var rowTempletes = $obj.find('[data-grid-type="RowTemplete"]');
					if (rowTempletes.length == 0) {
						if (debug) {
							alert('Missing data-grid-type RowTemplete');
						}
						console.log('Missing data-grid-type RowTemplete');
						return;
					} else {
						// copy first
						for (var i = 0; i < data.length; i++) {
							rowTempletes.each(function(idx, templete) {
								var ele = $(templete);
								var newEle = ele.clone();
								var cols = $(newEle).find('[data-grid-filed]');
								cols.each(function(idx, col) {
									var fieldname = $(col).attr('data-grid-filed');
									var val = data[i][fieldname];
									var htmlString = $(col).html();
									var newHtmlString = htmlString.replace(/\{\{\$val\}\}/g, val);
									$(col).html(newHtmlString);
									var dataAttrs = $(col).attr('data-grid-filed-attrs');
									if (dataAttrs != undefined) {
										dataAttrs = dataAttrs.split(',');
										for (var j = 0; j < dataAttrs.length; j++) {
											var attrVal = $(col).attr(dataAttrs[j]);
											if (attrVal != undefined) {
												var newAttrVal = attrVal.replace(/\{\{\$val\}\}/g, val);
												$(col).attr(dataAttrs[j], newAttrVal);
											}
										}
									}
								});

								// delete operation col
								var delCols = $(newEle).find('[data-grid-type="DelBtn"]');
								delCols.each(function(idx, delCol) {
									if (config != undefined) {
										if (config.DelFunc != undefined) {
											$(delCol).click(function() {
												config.DelFunc(this);
											});
										}
									}
								});

								$(newEle).show();
								$obj.append($(newEle));
							});
						}
					}
				} else {
					if (debug) {
						alert('Missing data-macco-control equal grid');
					}

					console.log('Missing data-macco-control equal grid');
				}
			},
			// 文本框
			textbox : function(obj) {
				// 验证基本类
				var VerifyUtility = function($textBox) {
					this.isPass = false;
					this.CompleteVerify = undefined;
					this.CustomVerifyFn = undefined;
					this.StartVerification = function() {
						if ($textBox.attr('data-verify-type') != undefined) {
							var verify_types = $textBox.attr('data-verify-type');
							var types = verify_types.split(',');
							var verifyType = '';
							for (var i = 0; i < types.length; i++) {
								var verifyType = types[i];
								var isPassVerify = true;
								verifyType = verifyType.toLowerCase();
								switch(verifyType) {
									case 'required':
										isPassVerify = this.IsRequired();
										break;
									case 'email':
										isPassVerify = this.CheckEmail();
										break;
									case 'number':
										isPassVerify = this.CheckNum();
										if (!isPassVerify) {
											$textBox.val($textBox.val().substr(0, $textBox.val().length - 1));
										}
										break;
									case 'url':
										isPassVerify = this.CheckNum();
										break;
									case 'english':
										isPassVerify = this.CheckEnglish();
										if (!isPassVerify) {
											$textBox.val($textBox.val().substr(0, $textBox.val().length - 1));
										}
										$textBox.css("ime-mode","disabled");
										break;
									default:
										break;
								}
								if (!isPassVerify) {
									// 错误标签
									break;
								}
							}
							if(typeof(this.CustomVerifyFn) == 'function') {
								verifyType = 'custom';
								isPassVerify = CustomVerifyFn();
							}
							
							if(typeof(this.CompleteVerify) == 'function') {
								this.CompleteVerify(isPassVerify,verifyType);
							}
						} else {
							this.CompleteVerify(true,'');
						}
						
					};

					// 必须输入
					this.IsRequired = function() {
						if ($textBox.val().trim().length > 0) {
							return true;
						} else {
							return false;
						}
					};

					// 必须是Email
					this.CheckEmail = function() {
						if (macco.regs.mail.test($textBox.val().trim())) {
							return true;
						} else {
							return false;
						}
					};

					// 必须是数字
					this.CheckNum = function() {
						if (macco.regs.num.test(($textBox.val().trim()))) {
							return true;
						} else {
							return false;
						}
					};

					// 必须是URL
					this.CheckUrl = function() {
						if (macco.regs.url.test($textBox.val().trim())) {
							return true;
						} else {
							return false;
						}
					};

					// 必须是英文字母
					this.CheckEnglish = function() {
						if (macco.regs.eng.test($textBox.val().trim())) {
							return true;
						} else {
							return false;
						}
					};
				};
				
				// textbox object
				var textBoxInternal = function($textBox) {
					
				};
				
				textBoxInternal.prototype = macco.ui.control();
				textBoxInternal.prototype.verificationResult = macco.ui.verificationResult();
				// 初始化
				textBoxInternal.prototype.init = function() {
					var target = this;
					target.ID = this.GenerateID();
					target.Type = 'textbox';
					if (obj == undefined) {
						return;
					} else if(obj instanceof $) {
						this.$jqObj = obj;
					} else if(typeof(obj) == 'string') {
						this.$jqObj= $(obj);
					}
					target.VerifyUtility = new VerifyUtility(target.$jqObj);
					target.VerifyUtility.CompleteVerify = function(isPass,verifyType) {
						if(isPass) {
							target.verificationResult.IsPass = true;
						} else {
							target.verificationResult.IsPass = false;
							target.verificationResult.VerifyType = verifyType;
						}
					};
					this.$jqObj.on('textchange', function(e) {
						target.limit_max_length_fn($(this));
						target.VerifyUtility.StartVerification();
					});
					this.$jqObj.on('blur',function(){
						target.limit_max_length_fn($(this));
						target.VerifyUtility.StartVerification();
					});
					
					this.$jqObj.on('focus',function(){
						target.limit_max_length_fn($(this));
						target.VerifyUtility.StartVerification();
					});
					
				};
				// limit max length
				textBoxInternal.prototype.limit_max_length_fn = function($textbox) {
					if ($textbox.attr('data-max-length') != undefined) {
						var maxLength = $textbox.attr('data-max-length') * 1;
						if (isNaN(maxLength)) {
							return false;
						} else {
							if ($textbox.val().length > maxLength) {
								$textbox.val($textbox.val().substr(0, maxLength));
								return false;
							} else {
								return true;
							}
						}
					}
				};
				
				textBoxInternal.prototype.VerifyUtility = undefined;
				
				return new textBoxInternal();
			},
			// checkbox
			checkbox:function(obj) {
				// textbox object
				var VerifyUtil = function() {
					this.IsPassVerify = false;
					this.CompleteVerify = undefined;
					this.IsRequired = function() {
						var group = $ctrl.attr('data-group');
						var ret = false;
						if(group != undefined) {
							$('[data-group="' + group + '"]').each(function(idx,ele){
								if($(ele).prop('checked') == true) {
									ret = true;
									return false;
								} else {
									ret = false;
								}
							});
						} else {
							ret = false;
						}
						
						return ret;
					};
					
					this.StartVerification = function() {
						if ($ctrl.attr('data-verify-type') != undefined) {
							var verify_types = $ctrl.attr('data-verify-type');
							var types = verify_types.split(',');
							var verifyType = '';
							for (var i = 0; i < types.length; i++) {
								verifyType = types[i];
								switch(verifyType) {
									case 'required':
										this.IsPassVerify = this.IsRequired();
										break;
								}
								
								if(!this.IsPassVerify) {
									break;
								}
							}
							if(typeof(this.CompleteVerify) == 'function') {
								this.CompleteVerify(this.IsPassVerify,'requried');
							}
						} else {
							this.CompleteVerify(true,'requried');
						}
					};
				};
				
				var checkboxInternal = function($textBox) {
				};
				
				checkboxInternal.prototype = macco.ui.control();
				checkboxInternal.prototype.verificationResult = macco.ui.verificationResult();
				checkboxInternal.prototype.init = function() {
					this.ID = this.GenerateID();
					this.Type = 'radio';
			
					if(obj == undefined) {
						return;
					} else if(obj instanceof $) {
						this.$jqObj = obj;
					} else if(typeof(obj) == 'string') {
						this.$jqObj = $(obj);
					}
					
					var varifyUtility = new VerifyUtility(this.$jqObj);
					varifyUtility.CompleteVerify = function(isPass,verifyType) {
						target.verificationResult.IsPass = isPass;
						target.verificationResult.VerifyType = verifyType;
					};
					varifyUtility.StartVerification();
					
					this.$jqObj.click(function(){
						var varifyUtility = new VerifyUtility($ctrl);
						varifyUtility.CompleteVerify = function(isPass,verifyType) {
							target.verificationResult.IsPass = isPass;
							target.verificationResult.VerifyType = verifyType;
						};
						varifyUtility.StartVerification();
					});
				};
				
			},
			// radio button
			radio:function(obj) {
				var radioBtnInternal = function($radio) {
				
				};
				
				radioBtnInternal.prototype = macco.ui.control();
				radioBtnInternal.prototype.verificationResult = macco.ui.verificationResult();
				// 验证工具
				var VerifyUtility = function($ctrl) {
					this.IsPassVerify = false;
					this.CompleteVerify = undefined;
					this.IsRequired = function() {
						var group = $ctrl.attr('data-group');
						var ret = false;
						if(group != undefined) {
							$('[data-group="' + group + '"]').each(function(idx,ele){
								if($(ele).prop('checked') == true) {
									ret = true;
									return false;
								} else {
									ret = false;
								}
							});
						} else {
							ret = false;
						}
						
						return ret;
					};
					
					this.StartVerification = function() {
						if ($ctrl.attr('data-verify-type') != undefined) {
							var verify_types = $ctrl.attr('data-verify-type');
							var types = verify_types.split(',');
							var verifyType = '';
							for (var i = 0; i < types.length; i++) {
								verifyType = types[i];
								switch(verifyType) {
									case 'required':
										this.IsPassVerify = this.IsRequired();
										break;
								}
								
								if(!this.IsPassVerify) {
									break;
								}
							}
							if(typeof(this.CompleteVerify) == 'function') {
								this.CompleteVerify(this.IsPassVerify,'requried');
							}
						} else {
							this.CompleteVerify(true,'requried');
						}
						
						
					};
				};
				radioBtnInternal.prototype.init = function() {
					this.ID = this.GenerateID();
					this.Type = 'radio';
			
					if(obj == undefined) {
						return;
					} else if(obj instanceof $) {
						this.$jqObj = obj;
					} else if(typeof(obj) == 'string') {
						this.$jqObj = $(obj);
					}
					
					var group = this.$jqObj.attr('data-group');
					var target = this;
					// First time check
					var varifyUtility = new VerifyUtility(this.$jqObj);
					varifyUtility.CompleteVerify = function(isPass,verifyType) {
						target.verificationResult.IsPass = isPass;
						target.verificationResult.VerifyType = verifyType;
					};
					varifyUtility.StartVerification();
						
					this.$jqObj.click(function(){
						$('[data-group=' + '"' + group + '"]').prop('checked', false);
						var $ctrl = $(this);
						$ctrl.prop('checked',true);
						var varifyUtility = new VerifyUtility($ctrl);
						varifyUtility.CompleteVerify = function(isPass,verifyType) {
							target.verificationResult.IsPass = isPass;
							target.verificationResult.VerifyType = verifyType;
						};
						varifyUtility.StartVerification();
					});
				};
				
				return new radioBtnInternal(obj);
			},
			
			
			
			//pannel: container of control like grid
			//any control does not be include in a pannel,it can not be bindable
			//form :any container 
			form:function($obj) {
				
				var controls = [];
				
				// 初始化
				if($obj == undefined) {
					$('[data-macco-form]').each(function(idx,el) {
						$(el).find('[data-macco-control]').each(function(i,ctrl){
							var ctlType = $(ctrl).attr('data-macco-control');
							switch(ctlType) {
								case 'pannel':
									break;
								case 'grid':
									break;
							}
						});
					});				
				} else if(typeof($obj) == 'string') {
					
				} else if($obj instanceof $) {
					
				}
			}
		}

	};
	window.macco = $$ = macco;
})(jQuery);

// extend jquery
// extend jQuery Object
(function($) {
	// view jQuery Object bind Events
	// type is string
	$.fn.events = function(type) {
		$(this).each(function(index, value) {
			try {
				var events = $.cache[value[$.expando]].events;
				if (events) {
					if (type) {
						macco.dir(events[type]);
					} else {
						macco.dir(events);
					}
				}
			} catch(e) {

			}
		});
		return this;
	};
})(jQuery);

// closeure fo extend prototype
(function() {
	// some prototype extend for array
	macco.common.extobj(Array.prototype, {
		// for each
		foreach : function(proc) {
			for (var i = 0, l = this.length; i < l; i++) {
				// proc(this[i]);
				proc.call(this, this[i], i);
			}
		},
		// push
		push : function() {
			for (var i = 0, l = arguments.length; i < l; i++) {
				this[this.length] = arguments[i];
			}
			return this.length;
		},
		// pop
		pop : function() {
			if (this.length > 0) {
				return this[--this.length];
			} else {
				return null;
			}
		},
		// find index
		indexOf : function(elm, bgnIdx) {
			bgnIdx = bgnIdx || 0;
			if (bgnIdx < 0)
				bgnIdx = 0;
			for (var i = 0, l = this.length; i < l; i++) {
				if (this[i] === elm) {
					return i;
				}
			}
			return -1;
		},

		// contains or not
		contains : function(elm, key) {
			if (key == undefined) {
				return (this.indexOf(elm) >= 0);
			} else {
				var result = false;
				for (var i = 0, l = this.length; i < l; i++) {
					if (this[i][key] === elm[key]) {
						result = true;
						break;
					}
				}
				return result;
			}

		},

		// shift 1
		shift : function() {
			return this.splice(0, 1)[0];
		},

		// get last object
		last : function() {
			return (this.length > 0 ? this[this.length - 1] :
			void (0));
		},

		// remove one
		remove : function(obj, key) {
			if (key == undefined) {
				for (var i = this.length - 1; i >= 0; i--) {
					if (this[i] === obj) {
						this.splice(i, 1);
					}
				}
			} else {
				for (var i = this.length - 1; i >= 0; i--) {
					if (this[i][key] === obj[key]) {
						this.splice(i, 1);
					}
				}
			}
			return this;
		},

		// map on
		map : function(fun, context) {
			var ret = [];
			for (var i = 0, l = this.length; i < l; i++) {
				ret.push(fun.call(context, this[i], i, this));
			}
			return ret;
		},

		// splice
		splice : function(idx, num) {
			var delta;
			var addCount = arguments.length - 2;
			if (idx > this.length) {
				idx = this.length;
			}
			if (idx + num > this.length) {
				num = this.length - idx;
			}
			var deleted = [];
			for (var i = 0; i < num; ++i) {
				deleted.push(this[idx + i]);
			}
			if (addCount > num) {
				delta = addCount - num;
				for ( i = this.length + delta - 1; i >= idx + delta; i--) {
					this[i] = this[i - delta];
				}
			} else if (addCount < num) {
				delta = num - addCount;
				for ( i = idx + addCount; i < this.length - delta; i++) {
					this[i] = this[i + delta];
				}
				for (; i < this.length - 1; ++i) {
					delete this[i];
				}
				this.length -= delta;
			}
			for ( i = 0; i < addCount; ++i) {
				this[idx + i] = arguments[2 + i];
			}
			return deleted;
		},

		// exchange
		swap : function(i, j) {
			var temp = this[i];
			this[i] = this[j];
			this[j] = temp;
		},

		// sort helper
		bubbleSort : function() {
			for (var i = this.length - 1; i > 0; --i) {
				for (var j = 0; j < i; ++j) {
					if (this[j] > this[j + 1])
						this.swap(j, j + 1);
				}
			}
		},
		selectionSort : function() {
			for (var i = 0; i < this.length; ++i) {
				var index = i;
				for (var j = i + 1; j < this.length; ++j) {
					if (this[j] < this[index])
						index = j;
				}
				this.swap(i, index);
			}
		},
		insertionSort : function() {
			for (var i = 1; i < this.length; ++i) {
				var j = i, value = this[i];
				while (j > 0 && this[j - 1] > value) {
					this[j] = this[j - 1];
					--j;
				}
				this[j] = value;
			}
		},
		shellSort : function() {
			for (var step = this.length >> 1; step > 0; step >>= 1) {
				for (var i = 0; i < step; ++i) {
					for (var j = i + step; j < this.length; j += step) {
						var k = j, value = this[j];
						while (k >= step && this[k - step] > value) {
							this[k] = this[k - step];
							k -= step;
						}
						this[k] = value;
					}
				}
			}
		},
		quickSort : function(s, e) {
			if (s == null)
				s = 0;
			if (e == null)
				e = this.length - 1;
			if (s >= e)
				return;
			this.swap((s + e) >> 1, e);
			var index = s - 1;
			for (var i = s; i <= e; ++i) {
				if (this[i] <= this[e])
					this.swap(i, ++index);
			}
			this.quickSort(s, index - 1);
			this.quickSort(index + 1, e);
		},
		stackQuickSort : function() {
			var stack = [0, this.length - 1];
			while (stack.length > 0) {
				var e = stack.pop(), s = stack.pop();
				if (s >= e)
					continue;
				this.swap((s + e) >> 1, e);
				var index = s - 1;
				for (var i = s; i <= e; ++i) {
					if (this[i] <= this[e])
						this.swap(i, ++index);
				}
				stack.push(s, index - 1, index + 1, e);
			}
		},
		mergeSort : function(s, e, b) {
			if (s == null)
				s = 0;
			if (e == null)
				e = this.length - 1;
			if (b == null)
				b = new Array(this.length);
			if (s >= e)
				return;
			var m = (s + e) >> 1;
			this.mergeSort(s, m, b);
			this.mergeSort(m + 1, e, b);
			for (var i = s, j = s, k = m + 1; i <= e; ++i) {
				b[i] = this[(k > e || j <= m && this[j] < this[k]) ? j++ : k++];
			}
			for (var i = s; i <= e; ++i)
				this[i] = b[i];
		},
		heapSort : function() {
			for (var i = 1; i < this.length; ++i) {
				for (var j = i, k = (j - 1) >> 1; k >= 0; j = k, k = (k - 1) >> 1) {
					if (this[k] >= this[j])
						break;
					this.swap(j, k);
				}
			}
			for (var i = this.length - 1; i > 0; --i) {
				this.swap(0, i);
				for (var j = 0, k = (j + 1) << 1; k <= i; j = k, k = (k + 1) << 1) {
					if (k == i || this[k] < this[k - 1])
						--k;
					if (this[k] <= this[j])
						break;
					this.swap(j, k);
				}
			}
		},
		delElement : function(from, to) {
			var rest = this.slice((to || from) + 1 || this.length);
			this.length = from < 0 ? this.length + from : from;
			return this.push.apply(this, rest);
		}
	});

	// macco ext string
	macco.common.extobj(String.prototype, {
		trim : function() {
			return this.replace(/^\s*(\S*(\s+\S+)*)\s*$/, "$1");
		},
		padLeft : function(n, c) {
			var s = this;
			var x = n - s.length;
			if (x > 0) {
				c = c || " ";
				s = (new Array(Math.ceil(x / c.length) + 1)).join(c) + s;
				return s.substring(s.length - n, n);
			}
			return s;
		},
		padRight : function(n, c) {
			s = this;
			var x = n - s.length;
			if (x > 0) {
				c = c || " ";
				s = s + (new Array(Math.ceil(x / c.length))).join(c);
				return s.substring(0, n);
			}
			return s;
		},
		// string.format like c#
		format : function() {
			var fmt = this;
			for (var i = 0, l = arguments.length; i < l; i++) {
				fmt = fmt.replace(new RegExp('\\{' + i + '\\}', "mg"), arguments[i]);
			}
			return fmt;
		},
		// equeal two string
		equals : function(str2, ignoreCase) {
			var str1 = this;
			if (str1 == null && str2 == null) {
				return true;
			} else if (str1 == null || str2 == null) {
				return false;
			}
			if (ignoreCase) {
				return str1.toLowerCase() == str2.toLowerCase();
			} else {
				return str1 == str2;
			}
		},

		// html encode
		encodeHtml : function() {
			var rtval = this.replace(/\>/g, "&gt;").replace(/\</g, "&lt;").replace(/\&/g, "&amp;").replace(/\'/g, "&#039;").replace(/\"/g, "&quot;");
			return rtval;
		},

		// Xss checking
		hasXss : function() {
			var xssRe = /<|&lt|\\u0*3c|\\x0*3c|%3C|&#0*60|>|&gt|\\u0*3e|\\x0*3e|%3E|&#0*62/gi;
			return xssRe.test(this);
		},
		// escape
		escape : function() {
			return !!(encodeURIComponent) ? encodeURIComponent(this) : escape(this);
		},
		unescape : function() {
			return !!(decodeURIComponent) ? decodeURIComponent(this) : unescape(this);
		},

		// limit string length
		limit : function(maxlimit) {
			var size = 0;
			var i = 0;
			var len = this.length;
			for ( i = 0; i < len; i++) {
				if (this.charCodeAt(i) > 255) {
					size += 2;
				} else {
					size++;
				}
				if (size > maxlimit) {
					break;
				}
			}
			return this.substring(0, i);
		},
		size : function() {
			var size = 0;
			var i = 0;
			var len = this.length;
			for ( i = 0; i < len; i++) {
				if (this.charCodeAt(i) > 255) {
					size += 2;
				} else {
					size++;
				}
			}
			return size;
		}
	});
})();

