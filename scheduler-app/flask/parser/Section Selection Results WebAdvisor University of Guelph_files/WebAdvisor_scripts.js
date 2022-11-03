var g_urlParameters = new Array();
var g_tokenIdx = "TOKENIDX";
var g_nullString = "NULL";
var g_cloneName = "CLONE";
var g_warnName = "WARN";
var g_lastToken = "LASTTOKEN";
var g_securityToken = ".SECURITYTOKEN";
var g_controlID = ".CONTROLID";
var g_guestStatus = ".GUEST";
var g_cookieCheck = "WA30_checkCookie";
var g_warning = "You are now logged out of WebAdvisor.\n\nTo ensure the security of data, you should now close your browser window.  To close your browser now, click OK";
var g_displayWindowMessage = "The maximum number of cookie values has been reached.\n\nIf other windows are currently open or were not closed using the 'CLOSE WINDOW' button, then you must close all current browser windows and re-login to avoid unpredictable behavior.";
var g_setWindowMessage = g_displayWindowMessage
		+ "\n\nThis window will now be closed.";
var g_clicks = 0;
var g_busyMessage = "Your request is currently processing. Please refresh the page to regain control.";

function initWindow() {
	var cookieValue = "cookieCheck";
	setCookie(g_cookieCheck, cookieValue);

	/* Make sure we can read the cookie back again */
	var cookie = getCookie(g_cookieCheck);

	if (cookie == cookieValue) {
		deleteCookie(g_cookieCheck);
	} else {
		alert("Cookies are not enabled");
		window.location.replace('./html/cookies.html');
	}

	window.focus();
}

function checkClicks() {
	if (g_clicks > 0) {
		initClickPrevention();
		window.status = g_busyMessage;
	} else {
		g_clicks += 1;
	}
}

function clickHandler(evt) {
	if (document.layers)
		return false;
	else if (evt.stopPropagation) {
		evt.stopPropagation();
		evt.preventDefault();
	} else if (window.event)
		return false;
}
function initClickPrevention() {
	if (document.layers) {
		window.captureEvents(Event.CLICK);
		window.onclick = clickHandler;
	} else if (document.all && !document.getElementById)
		document.onclick = clickHandler;
	else if (document.all)
		document.attachEvent('onclick', clickHandler);
	else if (document.addEventListener)
		document.addEventListener('click', clickHandler, true);
}

function resetClickPrevention() {
	if (document.all && !document.getElementById) {
		document.onpageshow = resetClicks;
	} else if (document.all) {
		document.attachEvent('onpageshow', resetClicks);
	} else if (document.addEventListener) {
		window.addEventListener('pageshow', resetClicks, true);
		window.addEventListener('pagehide', resetClicks, true);
	}
}

function resetClicks(evt) {
	g_clicks = 0;
}

function setWindowHTML(returnURL, tokenIndex) {
	var cookieValue = "cookieCheck";
	setCookie(g_cookieCheck, cookieValue);
	
	/* Make sure we can read the cookie back again */
	var cookie = getCookie(g_cookieCheck);

	if (cookie == cookieValue) {
		if (cookieLimitCheck(true, tokenIndex)) {
			deleteCookie(g_cookieCheck);

			readURLParameters();

			var _currentURL = window.location.href;
			window.name = tokenIndex;

			if (returnURL != "") {
				window.location.replace(returnURL);
			} else {
				if (containsParameter(g_cloneName)) {
					removeParameter(g_cloneName);
				}

				if (containsParameter("FORCEIDX")) {
					removeParameter("FORCEIDX");
				}

				setURLParameter(g_tokenIdx, window.name);
				_currentURL = getBaseURI(_currentURL) + '?'
						+ getURLParameters();
				
				window.location.replace(_currentURL);
			}
		}
	} else {
		alert("Cookies are not enabled");
		window.location.replace('./html/cookies.html');
	}

}

function getWindowHTML() {
	readURLParameters();

	var _currentURL = window.location.href;
	var _tokenValue = (window.name.length < 1) ? g_nullString : window.name;

	if (_currentURL.indexOf(g_tokenIdx) < 0) {
		setURLParameter(g_tokenIdx, _tokenValue);
		_currentURL = getBaseURI(_currentURL) + '?' + getURLParameters();
	}

	window.location.replace(_currentURL);
}

function displayFormHTML(focusField) {
	window.focus();
	
	resetClickPrevention();

	readURLParameters();

	if (document.forms != null) {
		for (i = 0; i < document.forms.length; i++) {
			if (document.forms[i] != null) {
				if (document.forms[i].elements != null
						&& document.forms[i].elements["JS_ENABLED"] != null) {
					document.forms[i].elements["JS_ENABLED"].value = "Y";
				}
			}
		}
	}

	var _currentURL = window.location.href;
	var _tokenValue;
	cookieLimitCheck(false, null);
	if (window.name != getURLParameter(g_tokenIdx)
			&& getURLParameter("PDF_REPORT") == null
			&& getURLParameter("username") == null) {
		if (window.name == '') {

			if (containsParameter(g_cloneName)) {
				removeParameter(g_cloneName);
			} else {
				setURLParameter(g_tokenIdx, g_nullString);
			}

			_currentURL = getBaseURI(_currentURL) + '?' + getURLParameters();

			if (containsParameter(g_cloneName))
				window.name = g_tokenIdx;
			else
				window.location.replace(_currentURL);

			return;
		} else if (_currentURL.indexOf('?') > 0) {
			if (self == top) {
				// Launch new window only if WA page is not in a frame. This supports portals.
				window.open(_currentURL, getURLParameter(g_tokenIdx));
			}
		}
	} else {
		if (containsParameter(g_warnName)) {
			if (confirm(g_warning)) {
				forceCloseWindow();
			}
		}

		if (focusField && document.forms[0] != null
				&& document.forms[0].elements[0] != null
				&& !document.forms[0].elements[0].disabled
				&& document.forms[0].elements[0].type != "hidden"
				&& document.forms[0].elements[0].type != "submit")
			document.forms[0].elements[0].focus();
	}
}

function cookieLimitCheck(closeWindow, tokenIndex) {
	var bites = document.cookie.split("; "); // break cookie into array of bites

	if (bites.length > 18) {
		if (tokenIndex != null) {
			deleteCookie(tokenIndex);
		}

		if (closeWindow) {
			alert(g_setWindowMessage);
			self.close();
		} else {
			alert(g_displayWindowMessage);
		}
		return false;
	} else {
		return true;
	}
}

function clearCookies(tokenIndex) {
	var bites = document.cookie.split("; "); // break cookie into array of bites
	var newCookie;
	for ( var i = 0; i < bites.length; i++) {
		var nextbite = bites[i].split("="); // break into name and value
		if (nextbite[0].indexOf(tokenIndex) > -1) {
			deleteCookie(nextbite[0]);
		}
	}
}

function forceCloseWindow() {
	removeParameter(g_warnName);
	_currentURL = getBaseURI(window.location.href) + '?' + getURLParameters();
	popup = window.open(_currentURL, getURLParameter(g_tokenIdx));
	popup.close();
}

function getBaseURI(url) {
	if (url != null) {
		if (url.indexOf("?") > -1) {
			var _tempArray = url.split("?");
			return _tempArray[0];
		}
	}

	return url;
}

function buildURLParameter(name, value, prefix) {
	if (prefix == null)
		prefix = '&';

	str = prefix + name + '=' + value;

	return str;
}

function readURLParameters() {
	_url = window.location.href;

	if (_url.indexOf("?") > -1) {
		_urlArray = _url.split("?");
		if (_url.indexOf('&') > -1) {
			_parameterArray = _urlArray[1].split('&');

			for (i = 0; i < _parameterArray.length; i++) {
				if (_parameterArray[i].length > 0){
					var equalsIndex = _parameterArray[i].indexOf('=');
					if (equalsIndex > -1){
						setURLParameter(_parameterArray[i].substring(0,equalsIndex), _parameterArray[i].substring((equalsIndex + 1)));

					} else {
						setURLParameter(_parameterArray[i], '');
					}
				}
			}
		}
	}
}

function getURLParameter(name) {
	return g_urlParameters[name];
}

function setURLParameter(name, value) {
	g_urlParameters[name] = value;
}

function getURLParameters() {
	var _urlString = new String();
	var counter = 0;

	for ( var i in g_urlParameters) {
		var _delim = '&';

		if (counter < 1)
			_delim = '';

		if (g_urlParameters[i] != null)
			_urlString = _urlString
					+ buildURLParameter(i, g_urlParameters[i], _delim);

		counter++;
	}

	return _urlString;
}

function containsParameter(name) {
	url = getURLParameters();

	if (url.indexOf(name + "=") > -1)
		return true;
	else
		return false;
}

function removeParameter(name) {
	setURLParameter(name, null);
}

/*
 * name - name of the cookie value - value of the cookie [expires] - expiration
 * date of the cookie (defaults to end of current session) [path] - path for
 * which the cookie is valid (defaults to path of calling document) [domain] -
 * domain for which the cookie is valid (defaults to domain of calling document)
 * [secure] - Boolean value indicating if the cookie transmission requires a
 * secure transmission an argument defaults when it is assigned null as a
 * placeholder a null placeholder is not required for trailing omitted arguments
 */
function setCookie(name, value, expires, path, domain, secure) {
	var curCookie = name + "=" + escape(value)
			+ ((expires) ? "; expires=" + expires.toGMTString() : "")
			+ ((path) ? "; path=" + path : "")
			+ ((domain) ? "; domain=" + domain : "")
			+ ((secure) ? "; secure" : "");
	document.cookie = curCookie;
}

/*
 * name - name of the desired cookie return string containing value of specified
 * cookie or null if cookie does not exist
 */
function getCookie(name) {
	var dc = document.cookie;
	var prefix = name + "=";
	var begin = dc.indexOf("; " + prefix);
	if (begin == -1) {
		begin = dc.indexOf(prefix);
		if (begin != 0)
			return null;
	} else
		begin += 2;
	var end = document.cookie.indexOf(";", begin);
	if (end == -1)
		end = dc.length;
	return unescape(dc.substring(begin + prefix.length, end));
}

/*
 * name - name of the cookie [path] - path of the cookie (must be same as path
 * used to create cookie) [domain] - domain of the cookie (must be same as
 * domain used to create cookie) path and domain default if assigned null or
 * omitted if no explicit argument proceeds
 */
function deleteCookie(name, path, domain) {
	if (getCookie(name)) {
		document.cookie = name
				+ "="
				+ ((path) ? "; path=" + path : "")
				+ ((domain) ? "; domain=" + domain : "")
				+ ";expires="
				+ (new Date((new Date()).getTime() + (1000 * -10)))
						.toGMTString();
	}
}

function disableAndSubmit(theButton) {
	disableButton(theButton);
}

function submitAndDisable(theButton) {
	disableButton(theButton);
}

var g_formSubmitted = false;

function disableButton() {
	// Capture form submission
	g_formSubmitted = true;
	var button = null;
	var theButton;
	var arrayLength = disableButton.arguments.length;
	
	// Cycle through submit buttons to disable
	for (j = 0; j < arrayLength; j++) {
		var theButton = disableButton.arguments[j];
		if (document.forms != null) {
			for (i = 0; i < document.forms.length; i++) {
				if (document.forms[i] != null) {
					if (document.forms[i].elements != null
							&& document.forms[i].elements[theButton] != null) {
						button = document.forms[i].elements[theButton];
					}
				}
			}
		}

		if (button != null && button != undefined) {
			button.value = "Please Wait...";
			button.disabled = true;
			button.className = "buttonPress";
		}

		button = null;
	}
}

function keyDown(event, __button) {
	var nn = (document.layers) ? true : false;
	var ie = (document.all) ? true : false;
	var evt = (event) ? event : (window.event) ? window.event : null;
	if (evt) {
		if (__button) {
			var key = (evt.charCode) ? evt.charCode
					: ((evt.keyCode) ? evt.keyCode : ((evt.which) ? evt.which
							: 0));
			if (key == "13") {
				if (document.forms != null) {
					for (i = 0; i < document.forms.length; i++) {
						if (document.forms[i] != null) {
							if (document.forms[i].elements != null) {
								for (j = 0; j < document.forms[i].elements.length; j++) {
									if (document.forms[i].elements[j].name == __button) {
										document.forms[i].elements[j].focus();
										return;
									}
								}
							}
						}
					}
				}
			}
		}
	}
}

function refreshReport(delay) {
  setTimeout( function() { window.location.reload(true); }, (delay * 1000));	
}

// WA 3.1.6 - support for payment processing
function navigateToPaymentProcessor(URL, RURL){
	var finalURL = URL + '&RU=' + escape(RURL);
	window.location.href = finalURL;
}


// Preserve existing button properties
const buttonProperties = {};

// Disable all buttons on the page until reCAPTCHA verification
function reCaptchaInit() {
	// Only disable buttons if the form has not been submitted
	if (g_formSubmitted === false) {
		// Find all buttons on the page
		const buttons = document.querySelectorAll("input[type=submit]");
		
		// Iterate over the button list
		for(let i = 0, button; button = buttons[i++];) {
			// Preserve button properties
			buttonProperties[button.name] = {
				className: button.className
			};
			// Disable the button element
			button.disabled = true;
			
			// Add disabled button styling
			button.className += " buttonPress";
		}
	}
}

// Enable all buttons on the page after reCAPTCHA verification
function reCaptchaSuccess() {
	// Only enable buttons if the form has not been submitted
	if (g_formSubmitted === false) {
		// Find all buttons on the page
		const buttons = document.querySelectorAll("input[type=submit]");
		
		// Iterate over the button list
		for(let i = 0, button; button = buttons[i++];) {
			// Restore the previous class names
			button.className = buttonProperties[button.name].className;
			
			// Enable the button element
			button.disabled = false;
		}
	}
}