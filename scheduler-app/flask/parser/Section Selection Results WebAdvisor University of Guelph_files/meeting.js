var delimitedMeetingInfo = new Array();

function formatMeetingInfo() {
	//zebraTable();
	var errorMsg = '';
	var course = '';
	var doFormat = false;
	var contentBody = document.getElementById('content');
	var tables = contentBody.getElementsByTagName('table');
	var h1s = contentBody.getElementsByTagName('h1');
	var pageTitle = h1s.item(0).firstChild.nodeValue;
	
	var termVar, statusVar, courseVar, meetVar;
	for (i = 0; i < tables.length; i++) {
		var headerRows = 2;
		table = tables.item(i);
		attrSummary = table.getAttribute('summary');

		doFormat = false;
		if (attrSummary == 'Schedule') {
			/* Class Schedule Screen - WESTS13b */
			courseVar = 'LIST_VAR6';
			meetVar = 'LIST_VAR12';
			doFormat = true;
		} else if (attrSummary == 'Sections' && pageTitle == 'Section Search Results') {
			/* Applicants Search for Sections - WESTS16b */
			meetVar = 'SEC_MEETING_INFO';
			doFormat = true;
		} else if (attrSummary == 'Sections' && pageTitle == 'Section Selection Results') {
			/* Search for Sections - WESTS12b */
			meetVar = 'SEC_MEETING_INFO';
			statusVar = 'LIST_VAR1';
			doFormat = true;
		} else if (attrSummary == 'WSS.COURSE.SECTIONS' && pageTitle == 'Section Selection Results') {
			/* Search and Register for Sections - WESTS04B (W011) */
			meetVar = 'SEC_MEETING_INFO';
			statusVar = 'LIST_VAR2';
			headerRows = 1;
			doFormat = true;
		} else if (attrSummary == 'Preferred') {
			/* Register and Drop Sections - WESTS04C (WRGS) */
			meetVar = 'SEC_MEETING_INFO';
			termVar = 'SEC_TERM';
			doFormat = true;
		} else if (attrSummary == 'Registered Sections') {
			/* Register and Drop Sections - WESTS04C (WRGS) */
			meetVar = 'CSVIEW1_MEETING_INFO';
			termVar = 'CSVIEW1_TERM';
			doFormat = true;
		} else if (pageTitle == 'Section Information') {
			/* Search and Register for Sections - WESTS13C */
			meetVar = 'LIST_VAR12';
			doFormat = true;
		} else if (attrSummary == 'WSS.COURSE.SECTIONS' && pageTitle == 'Registration Results') {
			/* Registration Results - WESTI901 */
			meetVar = 'SEC_MEETING_INFO';
			statusVar = 'LIST_VAR2';
			termVar = 'WSS_COURSE_SECTIONS';
			headerRows = 1;
			doFormat = true;
		} else if (attrSummary == 'Current Registration') {
			/* Registration Results - WESTI901 */
			meetVar = 'CSVIEW1_MEETING_INFO';
			statusVar = null;
			termVar = 'WSS_COURSE_SECTIONS_2';
			doFormat = true;
		} else if (attrSummary == 'Waitlisted Sections') {
			/* Registration Results - WESTI901 */
			meetVar = 'CSVIEW2_MEETING_INFO';
			statusVar = null;
			termVar = 'WSS_COURSE_SECTIONS_3';
			doFormat = true;
		} else if (attrSummary == 'LIST.VAR2' && pageTitle == 'Class Roster Select Section') {
			/* Class Roseter Select Section - WESTS015 (WCLR)*/
			meetVar = 'LIST_VAR6';
			headerRows = 1;
			doFormat = true;
		} else if (attrSummary == 'Course Name and Title' && pageTitle == 'Class Roster') {
			/* Class Roseter Select Section - WESTS015B */
			meetVar = 'LIST_VAR14';
			headerRows = 1;
			doFormat = true;
		}
		
		if (doFormat) {
			tableRows = table.getElementsByTagName('tr');
			for (j = headerRows; j < tableRows.length; j++) {
				tableRow = tableRows.item(j);
				var rowNum = j - headerRows + 1;
		
				if (termVar) {
					termId = termVar + '_' + rowNum;
					termInfo = document.getElementById(termId);
					termBlob = trim(termInfo.firstChild.nodeValue);
					termBlobParts = termBlob.split(' ');
					termText = termBlobParts[0].toLowerCase();
					if (termText == 'winter') {
						tableRow.setAttribute(attrClass, 'winter');
					}
					if (termText == 'summer') {
						tableRow.setAttribute(attrClass, 'summer');
					}
					if (termText == 'fall') {
						tableRow.setAttribute(attrClass, 'fall');
					}
				}
				
				if (statusVar) {
					statusId = statusVar + '_' + rowNum;
					statusInfo = document.getElementById(statusId);
					statusText = trim(statusInfo.firstChild.nodeValue);
					if (statusText == 'Closed') {
						tableRow.setAttribute(attrClass, 'closed');
					}
				}
				
				if (courseVar) {
					courseId = courseVar + '_' + rowNum;
					courseInfo = document.getElementById(courseId);
					courseBlob = trim(courseInfo.firstChild.nodeValue);
					courseBlobParts = courseBlob.split(' ');
					course = courseBlobParts[0];
				}
				
				if (meetVar) {
					meetId = meetVar + '_' + rowNum;
					meetingInfo = document.getElementById(meetId);
					if (meetingInfo) {
						replaceCell = meetingInfo.parentNode;
						/* String replace because IE doesn't handle \n in nodeValue */
						//meetingBlob = trim(meetingInfo.firstChild.nodeValue.replace(/( |\n)(\d{4}\/\d{2}\/\d{2})/g, '^$2'));
						// Problems with line below so required fix
						// 2007/09/10-2007/12/14 LEC Days TBA, Times TBA, Room TBA /  /  -/  /   EXAM Days TBA, Times TBA, Room TBA
						meetingBlob = trim(meetingInfo.firstChild.nodeValue.replace(/( |\n)(\d{4}\/\d{2}\/\d{2}|\/  \/  )/g, '^$2'));
						meetingBlobParts = meetingBlob.split('^');
						replaceCell.removeChild(meetingInfo);
						for (k = 0; k < meetingBlobParts.length; k++) {
								meetingText = meetingBlobParts[k];
								if (meetingText.match(/^(\d{4}\/\d{2}\/\d{2})-(\d{4}\/\d{2}\/\d{2})$/)) {
									// 2004/09/13-2004/12/17
									delimited = meetingText.replace(/^(\d{4}\/\d{2}\/\d{2})-(\d{4}\/\d{2}\/\d{2})$/, '$1|$2');
								} else {
									// 2004/09/13-2004/12/17 LEC Mon, Wed, Fri 10:30AM - 11:20AM, ROZH, Room 104
									//delimited = meetingText.replace(/^(\d{4}\/\d{2}\/\d{2})-(\d{4}\/\d{2}\/\d{2}) (LEC|LAB|SEM|EXAM) ((Mon,? ?|Tues,? ?|Wed,? ?|Thur,? ?|Fri,? ?|Sat,? ?|Sun,? ?|Days TBA){1,7}),? (\d{2}:\d{2}[AP]M - \d{2}:\d{2}[AP]M|Times TBA), (.*Room[^,]*)$/, '$1|$2|$3|$4|$6|$7');
									// 2007/09/10-2007/12/14 LEC Days TBA, Times TBA, Room TBA /  /  -/  /   EXAM Days TBA, Times TBA, Room TBA
									//delimited = meetingText.replace(/^(\d{4}\/\d{2}\/\d{2})-(\d{4}\/\d{2}\/\d{2}) (LEC|LAB|SEM|EXAM|Distance Education|Electronic) ((Mon,? ?|Tues,? ?|Wed,? ?|Thur,? ?|Fri,? ?|Sat,? ?|Sun,? ?|Days TBA|Days to be Announced){1,7}),? ?(\d{2}:\d{2}[AP]M - \d{2}:\d{2}[AP]M|Times TBA|Times to be Announced), (.*Room[^,]*)$/, '$1|$2|$3|$4|$6|$7');
									// 2020/05/07-2020/08/14 Distance Education Days TBA Days TBA, Times TBA Times TBA, Room TBA Room TBA
									delimited = meetingText.replace('Days TBA Days TBA', 'Days TBA').replace('Times TBA Times TBA', 'Times TBA').replace('Room TBA Room TBA', 'Room TBA').replace(/^(\d{4}\/\d{2}\/\d{2})-(\d{4}\/\d{2}\/\d{2}) (LEC|LAB|SEM|EXAM|Distance Education|Electronic) ((Mon,? ?|Tues,? ?|Wed,? ?|Thur,? ?|Fri,? ?|Sat,? ?|Sun,? ?|Days TBA|Days to be Announced){1,7}),? ?(\d{2}:\d{2}[AP]M - \d{2}:\d{2}[AP]M|Times TBA|Times to be Announced),? ?(.*Room[^,]*)$/, '$1|$2|$3|$4|$6|$7');
								}
								var fulldelimited = rowNum + '|' + course + '|' + delimited;
								//alert(fulldelimited);
								// Create an array for use later for extra meeting information.
								delimitedMeetingInfo[delimitedMeetingInfo.length] = fulldelimited;
								var parts = fulldelimited.split('|');
								newDiv = document.createElement('div');
								
								var meetDatesOnly = getMeetDatesOnly(parts);
								var meetMethod = getMeetMethod(parts);
								var meetDays = getMeetDays(parts);
								var meetTime = getMeetTime(parts);
								var meetEnd = getMeetEnd(parts);
								var meetBuilding = getMeetBuilding(parts);
								var meetRoom = getMeetRoom(parts);
								
								classText = 'meet';
								if (!meetDatesOnly) {
									classText += ' ' + meetMethod;
								}
								newDiv.setAttribute(attrClass, classText);
								//alert(meetMethod);
								if (!meetDatesOnly && (!meetMethod || !meetDays || !meetTime || !meetRoom)) {
									newDiv.appendChild(document.createTextNode(meetingText));
								} else if (!meetDatesOnly) {
									divTypeDays = document.createElement('div');
									textTypeDays = document.createTextNode(meetMethod + ' ' + meetDays);
									divTypeDays.appendChild(textTypeDays);
									divTimes = document.createElement('div');
									if (meetMethod == 'EXAM') {						
										textTimes = document.createTextNode(meetTime + ' (' + meetEnd + ')');
									} else {
										textTimes = document.createTextNode(meetTime);
									}
									divTimes.appendChild(textTimes);
									divLocation = document.createElement('div');
									if (meetBuilding != false) {
										var href = "javascript: ulink('http://www.uoguelph.ca/registrar/registrar/apps/redirects/index.cfm?type=building&redirect=" + meetBuilding + "');";
										aBuilding = domCreateA(href, meetBuilding, "Building Information and Location", '');
										divLocation.appendChild(aBuilding);
										textLocation = document.createTextNode(', ' + meetRoom);
									} else {
										textLocation = document.createTextNode(meetRoom);
									}
									divLocation.appendChild(textLocation);
									newDiv.appendChild(divTypeDays);
									newDiv.appendChild(divTimes);
									newDiv.appendChild(divLocation)
								}
								replaceCell.appendChild(newDiv);
						}
					}
				}
				
			}
		}
	}
}
