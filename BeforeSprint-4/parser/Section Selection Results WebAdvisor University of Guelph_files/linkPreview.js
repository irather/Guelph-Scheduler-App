/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  *
  * Title : 		Preview Your Links with Unobtrusive JavaScript
  * Author : 		Chris Campbell
  * URL : 		http://particletree.com/features/preview-your-links
  *
  * Description :	Inspired by the TargetAlert Firefox extension that “provides visual cues for
  *			the destinations of hyperlinks” and Christian Heilmann’s Image previews with 
  *			DOM JavaScript, we wrote a simple set of unobtrusive JavaScript functions to 
  *			find links on a page that go to amazon product pages, pdfs, word documents or
  *			whatever destination that might slow down the browsing process and adds an 
  *			icon next to them to let you know what you might expect to find behind a link.
  *
  * Created : 	7/24/2005
  * Modified : 	7/27/2005
  *
 - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -*/


//code enters here
addEvent(window, 'load', linkPreview);

/*
  * Summary:	Attaches an event to the object passed in
  *			Script written by Christian Heilmann at http://www.onlinetools.org/articles/unobtrusivejavascript/chapter4.html
  * Parameters: 	Object to attach event to | type of event to attach | function call
  * Return: 		Boolean indicating success or failure
  */
function addEvent(obj, evType, fn){ 
	if (obj.addEventListener){ 
		obj.addEventListener(evType, fn, false); 
		return true; 
	} 
	else if (obj.attachEvent){ 
		var r = obj.attachEvent("on"+evType, fn); 
		return r; 
	}
	else { 
		return false; 
	} 
}

/*
  * Summary:	Grabs all non-image links from the page and calls checkLinks() if amazon.com is not located in the link 
  */
function linkPreview(){
	var links = document.getElementsByTagName("a");

	for (i=0; i<links.length; i++){
		var currentLink = links[i];
		var	images = currentLink.getElementsByTagName("img");
		
	 	// Check if the link is an image. We don't want icons next to images.
		if (images.length == 0){
			var linkHref = currentLink.href;
			
			// Find all links directed to amazon.com 
			if (linkHref.match(/mailto:/)){
				append(currentLink, "emailp");
			}
			else{
				checkLinks(linkHref, currentLink)
			}
		}
	}
}

/*
  * Summary:	Checks if the link goes to an external file (ie. .doc, .pdf) and calls append()
  * Parameters: 	The href of the link | the <a> object 
  */
function checkLinks(linkHref, currentLink){
	var linkHrefParts = linkHref.split(".");
	
	// extension is the last element in the LinkSplit array
	var extension = linkHrefParts[linkHrefParts.length - 1];
	
	// In some browsers there is a "/" placed after the link. removes the "/"
	extension = extension.replace("/","");
	
	if( extension in { doc:1, pdf:1, ppt:1, txt:1, wpd:1, rtf:1, xls:1, zip:1, wmv:1 } ){
		append(currentLink, extension );
	}
}

/*
  * Summary:	Creates a span after the object passed in and sets the class to the link type
  * Parameters: 	<a> object | external link type
  */
function append(currentLink, extension){
	var span = document.createElement('span');
	span.innerHTML = "&nbsp;";
	currentLink.parentNode.insertBefore(span,currentLink.nextSibling);
	span.className = extension;
}