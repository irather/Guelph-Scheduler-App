/*****************************
  Guelph Specific Functions
*****************************/
var errorFound = false;

// Returns the version of Internet Explorer or a -1
// (indicating the use of another browser).
function getInternetExplorerVersion() {
  var rv = -1; // Return value assumes failure.
  if (navigator.appName == 'Microsoft Internet Explorer')
  {
    var ua = navigator.userAgent;
    var re  = new RegExp("MSIE ([0-9]{1,}[\.0-9]{0,})");
    if (re.exec(ua) != null)
      rv = parseFloat( RegExp.$1 );
  }
  return rv;
}

// IE 7 and below does not allow "class" to be used to get the class attribute
// IE 7 and below does not allow "for" to be used to get the for attribute
if (navigator.appName == "Microsoft Internet Explorer" && getInternetExplorerVersion() < 8.0) {
	var attrClass = 'className';
	var attrFor = 'htmlFor';
} else {
	var attrClass = 'class';
	var attrFor = 'for';
}
var inString = '';
var $j;

// Intelliresponse
NORMALIZATION_TOKENS = '()|?! \ ".,';
sessionId="-1";
interfaceId="1";
var lastWordSubmitted;

function customLogOut() {
    // WA requires a two step logout process for SSO, one for the WA logout, and one for the SSO logout
    // Activate the WA default Log Out link within an iframe
    var waLogout = $j('div#acctToolbar li#acctLogout > a').attr('href');
	$('<iframe />', {
        name: 'frame1',
        id: 'frame1',
        width: '1px',
        height: '1px',
        src: waLogout
    }).appendTo('body');
    // Delay before SSO logout
    setTimeout(function(){
        // Send to the SSO logout link
    	window.location.href = 'https://idp.identity.uoguelph.ca/ssotools/uglogout.html'
    },2000);
}

function getSSURL() {
	var locHost = window.location.host;
	var ssURL = 'https://colleague-ss.uoguelph.ca/Student';
	if (locHost == 'webadvisor-dev.uoguelph.ca') {
		locPath = window.location.pathname;
		if (locPath == '/r18dev_lin/WebAdvisor') {
			ssURL = 'https://colleague-ss-dev.uoguelph.ca/Student/';
		} else if (locPath == '/r18test_lin/WebAdvisor') {
			ssURL = 'https://colleague-ss-test.uoguelph.ca/Student/';
		} else if (locPath == '/r18uat_lin/WebAdvisor') {
			ssURL = 'https://colleague-ss-uat.uoguelph.ca/Student/';
		}
	}
	return ssURL;
}

function getNewsURL() {
	var locHost = window.location.host;
	var newsURL = 'https://www.uoguelph.ca/webadvisor';
	if (locHost == 'webadvisor-dev.uoguelph.ca') {
		locPath = window.location.pathname;
		if (locPath == '/r18dev_lin/WebAdvisor') {
			newsURL = 'https://preview-ugconthub.gtsb.io/webadvisor';
		} else if (locPath == '/r18test_lin/WebAdvisor') {
			newsURL = 'https://preview-ugconthub.gtsb.io/webadvisor';
		} else if (locPath == '/r18uat_lin/WebAdvisor') {
			newsURL = 'https://preview-ugconthub.gtsb.io/webadvisor';
		}
	}
	return newsURL;
}

// Need to override the OK/SUBMIT button on remaining forms due to RETURN.URL issues
function fixOKSubmitReturnURL(event) {
	switch (curScreen) {
		// Screens with OK Button only can always return to the SS menu
		// Co-op Work Terms (XWSS010)
		// Admission Status (WESTS004)
		// Transfer Credits (XWSS003A)
		// Academic Restrictions (XWSS050A)
		// My Documents (WBCOS01)
		// Residence Deposit/Deposits Summary (XWSS009A)
		// Service Selections (XWSS040D)
		// Application for Graduation (XWSS080B)
		// Convocation Ceremonies Cancellation (XWSS011B3)
		// Convocation Ceremonies Gown (XWSS011D)
		// Confirm Intent to Register (XWSS070B)
		// Convocation Ceremonies No Graduation Record (XWSS011A)
		//
		// Screens with SUBMIT Button that really behaves like OK Button
		// Current Academic Standing (G82.STANDING.PAGE)
		// Graduate Class Level (XWGRF01)
		// Student Transcripts (G82WESTS01C)
		// Graduate Settlement Sponsorship (XWSS070E)
		case 'XWSS010':
		case 'WESTS004':
		case 'XWSS003A':
		case 'XWSS050A':
		case 'WBCOS01':
		case 'XWSS009A':
		case 'XWSS040D':
		case 'XWSS080B':
		case 'G82.STANDING.PAGE':
		case 'XWGRF01':
		case 'XWSS011B3':
		case 'XWSS011D':
		case 'XWSS070B':
		case 'XWSS011A':
		case 'G82WESTS01C':
		case 'XWSS070E':
			// Disable the default submit handler
			event.preventDefault();
			// Redirect
			window.location.href = getSSURL();
			break;
		// Additional screens handled individually
		//
		// Graduate Settlement (XWSS070D)
		case 'XWSS070D':
			// Checkboxes are hidden (display: none;) if options already submitted
			var gsPayroll = $j('input#VAR13');
			var gsTrust = $j('input#VAR14');
			var gsAwards = $j('input#VAR17');
			var gsSponsorship = $j('input#VAR16');
			if (gsPayroll.css('display') == 'none' && gsTrust.css('display') == 'none' && gsAwards.css('display') == 'none'&& gsSponsorship.css('display') == 'none') {
				// If all the checkboxes are hidden then redirect to SS
				// Disable the default submit handler
				event.preventDefault();
				// Redirect
				window.location.href = getSSURL();
			} else {
				if (gsPayroll.prop('checked') || gsTrust.prop('checked') || gsAwards.prop('checked') || gsSponsorship.prop('checked')) {
					// Allow the default submit handler when something is checked
				} else {
					// Disable the default submit handler when nothing is checked
					// Disable the default submit handler
					event.preventDefault();
					// Reset button
					$j('input[name="SUBMIT2"]').prop('disabled', false).attr('value', 'SUBMIT');
				}
			}
			break;
		// Convocation Ceremonies Selection (XWSS011B2)
		// Convocation Ceremonies Change Ceremony (XWSS011E1)
		case 'XWSS011B2':
		case 'XWSS011E1':
			var convChecked = $j('input[name="LIST.VAR3_RADIO"]').is(':checked');
			if (!convChecked) {
				// Disable the default submit handler when nothing is checked
				// Disable the default submit handler
				event.preventDefault();
				// Reset button
				$j('input[name="SUBMIT2"]').prop('disabled', false).attr('value', 'SUBMIT');
			}
			break;
		// Convocation Ceremonies Register (XWSS011C)
		case 'XWSS011C':
			var convRegister = $j('select#VAR2 option:selected').val();
			if (convRegister == 'N') {
				// Disable the default submit handler when nothing is checked
				// Disable the default submit handler
				event.preventDefault();
				// Not ideal in this situation but redirect back to SS
				// Redirect
				window.location.href = getSSURL();
			}
			break;
		// Convocation Ceremonies Changes (XWSS011B)
		case 'XWSS011B':
			var convChange = $j('input[name="LIST.VAR10_RADIO"]:checked').val();
			if (convChange == 'LIST.VAR10_1') {
				// Disable the default submit handler when "Do nothing" is checked
				// Disable the default submit handler
				event.preventDefault();
				// Redirect
				window.location.href = getSSURL();
			}
			break;
		// Convocation Ceremonies Additional Tickets (XWSS011C1)
		case 'XWSS011C1':
			var convTickets = $j('input#VAR18');
			// Check if number of tickets changed
			if (convTickets.attr('value') == convTickets.val()) {
				// Disable the default submit handler when additional tickets not changed
				// Disable the default submit handler
				event.preventDefault();
				// Reset button
				$j('input[name="SUBMIT2"]').prop('disabled', false).attr('value', 'SUBMIT');
			}
			break;
		// Convocation Ceremonies Ticket Change (XWSS011C2)
		// Convocation Ceremonies Changes (XWSS011E2)
		case 'XWSS011C2':
		case 'XWSS011E2':
			var convChange = $j('input[name="LIST.VAR10_RADIO"]:checked').val();
			if (convChange == 'LIST.VAR10_2') {
				// Disable the default submit handler when "Do nothing" is checked
				// Disable the default submit handler
				event.preventDefault();
				// Redirect
				window.location.href = getSSURL();
			}
			break;
		default:
			// Allow the default submit handler
	}

}

$j = jQuery;
$(document).ready(function() {
	//$j('div#acctToolbar li#acctLogout > a > span.label').text('Modified Log Out');
	$j('div#acctToolbar li#acctLogout > a').attr('onclick', 'customLogOut(); return false;');

	// get the SS url for a given environment
	var ssURL = getSSURL();
	// Set the home link
	$j('div#acctToolbar li#home > a').attr('href', ssURL);
	// Capture form submit to handle OK/SUBMIT issues
	$j('form[name="datatelform"]').submit(function(event) {
		// remove the onsubmit and execute here to control the order
		fixOKSubmitReturnURL(event);
	});

	// If one of the four menus is requested we want to forward to SS
	if (formTitle == 'Main Menu' || formTitle == 'Applicants' || formTitle == 'Students' || formTitle == 'Faculty') {
		window.location.href = getNewsURL();
	}

	if (curScreen == 'XWSS090B') {
		$j('div.XWSS090B table.mainTable > tbody > tr:first-child td hr').css('display', 'none');
		var sMother = $j('select#G82STU_MOTHER_EDU');
		var sFather = $j('select#G82STU_FATHER_EDU');
		var cDecline = $j('input#G82STU_PARENTS_EDU_DECLINE');
		sMother.change(function() {
			cDecline.attr('checked', false);
		});
		sFather.change(function() {
			cDecline.attr('checked', false);
		});
		cDecline.click(function() {
			sMother.val('');
			sFather.val('');
		});
	}
	if (curScreen == 'XWSS090C') {
		$j('div.XWSS090C table.mainTable > tbody > tr:nth-child(2) td hr').css('display', 'none');
		var sAborig = $j('select#G82STU_ABORIG');
		var sRelease = $j('select#VAR10');
		var cDecline = $j('input#G82STU_ABORIG_DECLINE');
		sAborig.change(function() {
			cDecline.attr('checked', false);
			if (sAborig.find('option:selected').val() == 'NO') {
				sRelease.val('N');
			}
		});
		sRelease.change(function() {
			cDecline.attr('checked', false);
		});
		cDecline.click(function() {
			sAborig.val('');
			sRelease.val('');
		});
	}

	// Intelliresponse
	$j("#question")
		.autocomplete({
			source: function (request, response) {
				var inputString = request.term;
				var tokens = inputString.split(/[()|?! \".,]/);
				var newString = tokens[tokens.length-1].replace("lastWordSubmitted","");
				if ((newString.length > 3) || (NORMALIZATION_TOKENS.indexOf(inputString.charAt(inputString.length-1))!=-1 && NORMALIZATION_TOKENS.indexOf(inputString.charAt(inputString.length-2))==-1) ) {
					lastWordSubmitted=tokens[tokens.length-1];
					$j.getJSON("https://uoguelph.intelliresponse.com/IntelliSuggest?callback=?", {term: inputString, SESSIONID:
					sessionId, interfaceID: interfaceId}, function(data) {
						response(data);
					});
				}
			},
			select: function (event, ui) {
				$j("#questionForm input#respId").val(ui.item.secret);
				$j("#questionForm input#sourceId").val(9);
				$j("#questionForm input#question").val(ui.item.value);
				setTimeout(function () {
					$j("#questionForm input#AskButton").click();
					}, 500);
				return false;
			},
			delay:200,
			minLength:2,
			focus: function() {
				return false;
			},
			appendTo: "form#questionForm",
			create: function(event, ui) {
				$j(this).data("ui-autocomplete")._renderItem = function(ul, item) {
					return $j("<li>")
					.data("item.autocomplete", item)
					.append("<a>"+ item.label + "</a>")
					.appendTo(ul);
				};
			},
	});
	
});

addEvent(window, 'load', checkForErrors);
addEvent(window, 'load', addAnalytics);
addEvent(window, 'unload', popupClose);

if (parent.frames.length > 0) {
	parent.location.href = location.href
}


function addEvent(obj, evType, fn){ 
 if (obj.addEventListener){ 
   obj.addEventListener(evType, fn, false); 
   return true; 
 } else if (obj.attachEvent){ 
   var r = obj.attachEvent("on"+evType, fn); 
   return r; 
 } else { 
   return false; 
 } 
}

function detectClose(wnd, wndname) {
	setTimeout(function(){ // setTimeout is for IE
		if (wnd.closed && getCookie(wndname) != null) {
			deleteCookie(wndname);
		}
	}, 10);
}

function popupClose() {
	if (window.opener) {
		window.opener.detectClose(window, window.name);
	}
}

function addAnalytics() {
	var sidebarDiv = document.getElementById('sidebar');
	if (sidebarDiv != null) {
		var menuLinks = sidebarDiv.getElementsByTagName('a');
		for (i = 0; i < menuLinks.length; i++) {
			addEvent(menuLinks.item(i), 'click', clickAnalytics)
		}
	}
	var localDiv = document.getElementById('local');
	if (localDiv) {
		var menuLinks = localDiv.getElementsByTagName('a');
		for (i = 0; i < menuLinks.length; i++) {
			addEvent(menuLinks.item(i), 'click', clickAnalytics)
		}
	}
}

function clickAnalytics(e) {
	var theTarget = e.target ? e.target : e.srcElement;
	var linkName = "menu/" + theTarget.firstChild.nodeValue;
	_uacct = "UA-1659282-5";
	urchinTracker(linkName);
}

function ulink(url) {
	ulinkwin = window.open(url, 'ulinkwin', 'width=900,height=550,resizable=yes,scrollbars=yes,menubar=yes,toolbar=yes,status=yes,location=yes');
	ulinkwin.focus();
}
/*
function showHelp() {
	var searchDiv = document.getElementById('help');
	//searchDiv.style.visibility = 'visible';
	searchDiv.style.display = 'block';
	var searchDiv = document.getElementById('contexthelp');
	//searchDiv.style.visibility = 'visible';
	searchDiv.style.display = 'block';
	var searchDiv = document.getElementById('showhelp');
	//searchDiv.style.visibility = 'hidden';
	searchDiv.style.display = 'none';
	var searchDiv = document.getElementById('hidehelp');
	//searchDiv.style.visibility = 'visible';
	searchDiv.style.display = 'inline';
}

function hideHelp() {
	var searchDiv = document.getElementById('help');
	//searchDiv.style.visibility = 'hidden';
	searchDiv.style.display = 'none';
	var searchDiv = document.getElementById('showhelp');
	//searchDiv.style.visibility = 'visible';
	searchDiv.style.display = 'inline';
	var searchDiv = document.getElementById('hidehelp');
	//searchDiv.style.visibility = 'hidden';
	searchDiv.style.display = 'none';

}
*/
function showMore(itemId) {
	var more = document.getElementById(itemId);
	more.style.display = 'block';
}

function hideMore(itemId) {
	var more = document.getElementById(itemId);
	more.style.display = 'none';
}

function sendError() {
	var list = document.getElementById('chooseq');
	var errorMsg = 'webadv: ' + list.options[list.selectedIndex].value;
	errorMsg = errorMsg.replace(/\w{2,4}\*\w{4}(\*\w{2,5})?/g, '[specificcoursecode]');
	url = 'https://uoguelph.intelliresponse.com/index.jsp?requestType=NormalRequest&interfaceID=1&source=100&question=' + escape(errorMsg.substring(0,250));
	ulink(url);
	return false;
}

function checkForErrors() {
	var errorMsg = '';
	var contentBody = document.getElementById('content');
	if (contentBody) {
		var cells = contentBody.getElementsByTagName('div');
		for (i = 0; i < cells.length; i++) {
			cell = cells.item(i);
			if (cell.getAttribute(attrClass) == 'errorText') {
				var errorCell = cell;
				if (errorCell.firstChild) {
					errorCell.setAttribute('id', 'errormsg');
					errorMsg += trim(errorCell.firstChild.nodeValue) + '\n';
				}
			}
		}
		if (errorMsg && trim(errorMsg) != '') {
			errorFound = true;
			errors = errorMsg.split(/(\. |\.$|: |\n)/);
			var newDiv = document.createElement('div');
			newDiv.setAttribute(attrClass, 'errorask');
			var newForm = document.createElement('form');
			var newSelect = document.createElement('select');
			newSelect.setAttribute('id', 'chooseq');
			for (x = 0; x < errors.length; x++) {
				errorText = trim(errors[x]);
				if (errorText != '' && errorText != '.' & errorText != ':') {
					var newOption = document.createElement('option');
					newOption.setAttribute('value', errorText);
					if (errorText.length > 60) {
						var optionText = errorText.substring(0, 57) + '...';
					} else {
						var optionText = errorText;
					}
					newOption.appendChild(document.createTextNode(optionText));
					newSelect.appendChild(newOption);
				}
			}
			/*var newA = domCreateA('javascript: sendError();', '', '', 'askbtn');*/
			var newImg = domCreateImg('stylesheets/themes/GUELPH/images/askgryph.gif', '62', '46', 'Ask Gryph Logo');
			/*var newBtn = domCreateImg('stylesheets/themes/GUELPH/images/askgryph_button.jpg', '80', '23', 'Ask Gryph');*/
			var newInput = domCreateInput('button', 'Ask Gryph');
			newInput.onclick = sendError;
			var newBr = document.createElement('br');
			/*newA.appendChild(newBtn);*/
			newDiv.appendChild(newImg);
			newForm.appendChild(newSelect);
			newForm.appendChild(newBr);
			newForm.appendChild(newInput);
			newDiv.appendChild(newForm);
			/*newDiv.appendChild(newA);*/
			errorCell.appendChild(newDiv);
		}
	}
}

function ltrim(inString) {
	if (!inString) {
		return '';
	} else {
		outString = trimNBSP(inString.replace(/^(\s+|\n+|\r+)/g, ''));
		return outString;
	}
}

function rtrim(inString) {
	if (!inString) {
		return '';
	} else {
		outString = trimNBSP(inString.replace(/(\s+|\n+|\r+)$/g, ''));
		return outString
	}
}

function trim(inString) {
	if (!inString) {
		return '';
	} else {
		outString = trimNBSP(ltrim(rtrim(inString)));
		//outString = inString.replace(/^(\s+|\n+|\r+)?(.*\S)?(\s+|\n+|\r+)?$/, '$2');
		return outString;
	}
}

function trimNBSP(inString) {
	// Get rid of &nbsp;
	outString = escape(inString);
	outString = outString.replace(/%A0/g, '');
	outString = unescape(outString);
	return outString;
}

/* DOM related functions */

function domCreateA(href, text, title, htmlClass) {
	var newA = document.createElement('a');
	newA.setAttribute('href', href);
	if (title != '') {
		newA.setAttribute('title', title);
	}
	if (htmlClass != '') {
		newA.setAttribute(attrClass, htmlClass);
	}
	if (text != '') {
		newA.appendChild(document.createTextNode(text));
	}
	return newA;
}

function domCreateInput(type, value, click) {
	var newInput = document.createElement('input');
	newInput.setAttribute('type', type);
	if (value != '') {
		newInput.setAttribute('value', value);
	}
	if (click != '') {
		newInput.setAttribute('onclick', click);
	}
	/*
	if (htmlClass != '') {
		newInput.setAttribute(attrClass, htmlClass);
	}
	if (text != '') {
		newInput.appendChild(document.createTextNode(text));
	}
	*/
	return newInput;
}

function domCreateImg(src, width, height, alt) {
	var newImg = document.createElement('img');
	newImg.setAttribute('src', src);
	newImg.setAttribute('width', width);
	newImg.setAttribute('height', height);
	newImg.setAttribute('alt', alt);
	newImg.setAttribute('border', '0');
	return newImg;
}
/*
function zebraTable() {
	var contentBody = document.getElementById('bodyForm');
	var tables = contentBody.getElementsByTagName('table');
	for (t = 0; t < tables.length; t++) {
		attrSummary = tables[t].getAttribute('summary');
		if (attrSummary == 'Schedule') { //attrSummary == 'Section Results' || attrSummary == 'Select Section(s)' || attrSummary == 'Student Name') {
			var rows = tables[t].getElementsByTagName('tr');
			// Start at 1 to skip header row
			for (i = 1; i < rows.length; i++) {
				if ((i - 1) % 2 == 0) {
					rows[i].setAttribute(attrClass, 'even');
				} else {
					rows[i].setAttribute(attrClass, 'odd');
				}
			}
		}
	}
}
*/
/*
function makeRadio() {
	var contentBody = document.getElementById('contentbody');
	var tables = contentBody.getElementsByTagName('table');
	for (t = 0; t < tables.length; t++) {
		attrSummary = tables[t].getAttribute('summary');
		if (attrSummary == 'Select from the following list of terms' || attrSummary == 'Select from the following list of courses') {
			var inputs = tables[t].getElementsByTagName('input');
			for (i = 0; i < inputs.length; i++) {
				inputs[i].onclick = checkSingleSelect;
			}
		}
	}
}

function checkSingleSelect() {
	var contentBody = document.getElementById('contentbody');
	var tables = contentBody.getElementsByTagName('table');
	for (t = 0; t < tables.length; t++) {
		attrSummary = tables[t].getAttribute('summary');
		if (attrSummary == 'Select from the following list of terms' || attrSummary == 'Select from the following list of courses') {
			var inputItems = tables[t].getElementsByTagName('input');
			var selectedItems = 0;
			for (i = 0; i < inputItems.length; i++) {
				if (inputItems[i].checked == true) {
					selectedItems++;
				}
			}
			if (selectedItems > 1) {
				alert('Please limit your selection to one item.');
			} else if (selectedItems == 1) {
				for (i = 0; i < inputItems.length; i++) {
					if (inputItems[i].checked == false) {
						inputItems[i].disabled = true;
						//inputItems[i].style.visibility = 'hidden';
					}
				}
			} else {
				for (i = 0; i < inputItems.length; i++) {
					if (inputItems[i].checked == false) {
						inputItems[i].disabled = false;
						//inputItems[i].style.visibility = 'visible';
					}
				}
			}
		}
	}
}
*/
function setConfirmDrop() {
	var contentBody = document.getElementById('content');
	var inputs = contentBody.getElementsByTagName('input');
	for (i = 0; i < inputs.length; i++) {
		attrType = inputs[i].getAttribute('type');
		if (attrType == 'submit') {
			inputs[i].onclick = confirmDrop;
		}
	}
	
}

function confirmDrop() {
	var contentBody = document.getElementById('content');
	var tables = contentBody.getElementsByTagName('table');
	var showConfirm = false;
	for (t = 0; t < tables.length; t++) {
		attrSummary = tables[t].getAttribute('summary');
		if (attrSummary == 'Registered Sections') {
			var inputs = tables[t].getElementsByTagName('input');
			for (i = 0; i < inputs.length; i++) {
				if (inputs[i].checked == true) {
					showConfirm = true;
				}
			}
		}
	}
	if (showConfirm) {
		var response = confirm('You have selected some courses to drop during this transaction, would you like to proceed?');
		if (response == false) {
			return false;
		}
	}
}

/*
 * Document Refresh
 * Added on 2016-09-27
 */
function UpdateDocumentList(){
	//Isolate the token from the query string
	var token = window.location.search.replace(/\?.*TOKENIDX=/, "").replace(/&.*/, "");
	//Build the query string for the redirector that builds the cache
	var queryStr = "?TOKENIDX=" + token + "&CONSTITUENCY=WBAP&type=P&pid=CORE-WBCOS01";
	var newURL = window.location.protocol + "//" + window.location.hostname + window.location.pathname + queryStr;
	//Cause the page to refresh through the redirector
	window.location.href = newURL;
}
 
//In the child window use window.opener.postMessage("Update", "*");
window.addEventListener('message', function(evt){
	//Verify that we trust the origin, this comes from the browser so we can trust it.
	if(evt.origin.match(/.*\.uoguelph\.ca$/) !== null && (evt.data == "Update" || evt.data == "G82Update")){
		//The origin is on our domain, so go ahead and execute the update.
		UpdateDocumentList();
	} else {
		//Untrusted origin, so just return without doing anything
		return;
	}
});
