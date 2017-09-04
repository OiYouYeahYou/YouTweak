/**
 * Contains common functions
 *
 * Refactored by OiYouYeahYou on 2017/09/02
 * TODO: Update to new layout
 * TODO: Move common variables
 */

var returnValue; // DELETE

/**
 * Function to retrieve settings from googles online storage, then calls
 * CallbackFunction with the result.
 */
function getStoredChromeSettings( KeyArray, cb ) {
	chrome.storage.sync.get( KeyArray, settingRetrieval );
	/**
	 * Handles the retrieval of settings
	 */
	function settingRetrieval( items ) {
		if ( !items )
			throw "There was a problem retrieving saved settings from google.";

		//See whats retrieved from chrome storage.
		// var options = [];
		// for ( var key in items )
		// 	if ( key in items )
		// 		options.push( key );

		// // DELETE:
		// console.debug( "Retrieved value list [" + options + "]." );

		// console.log( items );
		try { cb( items ); }
		catch ( err ) { console.error( err ); }
	}
}

function logError( err ) { console.error( "YouTweak Error: " + err.stack ); }

/**
 *
 *	This searches all children of an element recursively for a value of an attribute. At first call
 * 	set topLevel to true.
 */
function searchAllChildrenFor( root, attributeName, attributeValue, topLevel ) { // DELETE
	// console.log( arguments );
	if ( topLevel == true ) { returnValue = null; }

	if ( !root.children && !returnValue ) {
		for ( var i = 0; i < root.children.length; i++ ) {
			var element = root.children[ i ];

			if ( element.getAttribute( attributeName ) == null )
				searchAllChildrenFor(
					element,
					attributeName,
					attributeValue,
					false
				);
			else if (
					element
					.getAttribute( attributeName )
					.indexOf( attributeValue ) != -1
				) {
					returnValue = element;
					return element;
			}
			else
				searchAllChildrenFor(
					element,
					attributeName,
					attributeValue,
					false
				);
		}
	}

	//If nothing found then return null
	// QUESTION if this is null, why does there need to be a return
	return returnValue;
}

/**
 *	Searches the array of elements for those with the classname parameter.
 * @param {Object} array : Element - dom elements
 * @param {Object} className : String - the classname to search for
 */
function getElemByClassFromArray( array, className ) { // DELETE
	var elems = new Array();

	if ( Array.isArray( array ) )
		for ( var i = 0; i < array.length; i++ ) {
			try {
				if ( array[ i ].className.indexOf( className ) != -1 )
					elems.push( array[ i ] );
			}
			catch ( e ) { }
		}

	if ( elems.length > 0 )
		return elems;
}

/**
 * Returns all the elements with the tag and className in the current document.
 */
function searchForTagAndClass( tagName, className ) { // NOTE: one function dependant
	/* TODO: figure out tidier method for this ...
		neither
			document.getElementsByTagName( x ).getElementsByClassName( y )
		or
			document.getElementsByTagName( x ).filter( y )
		works
	*/
	var elems = Array.prototype.filter.call(
		document.getElementsByTagName( tagName ),
		elem => elem.classList.contains( className )
	)

	if ( elems.length > 0 )
		return elems;
}

function isUndef( val ) { // DELETE
	return val == null || val == 'undefined' || val == undefined;
}

/**
 * Returns an array of all video items on the page.
 */
function find_AllFeedVideos() {
	var videoList = searchForTagAndClass( "li", "yt-shelf-grid-item" );

	if ( videoList ) return videoList;

	videoList = searchForTagAndClass( "div", "feed-item-container" );

	if ( videoList ) return videoList;

	throw "findAllFeedVideos returned null.";
}

/**
 * Finds the hide button for a video element.
 */
function find_FeedVideoHideButton( videoElement ) {
	var elem;

	elem = videoElement.querySelectorAll( '[data-action="replace-enclosing-action"]' )[ 0 ];

	if ( elem )
		return elem
	else
		elem = videoElement.querySelectorAll( '[data-action="hide"]' )[ 0 ];

	if ( elem )
		return elem

	else throw "find_FeedVideoHideButton returned null.";
}

/**
 * Finds the associated dismissal message for a video element item.
 */
function find_FeedVideoDismissalMessage( videoElement ) { // DELETE If videoElement is passed, nothing is done, if noting is passed throw
	var returnVal = videoElement;
	if ( isUndef( returnVal ) ) {
		//20160424
		console.log( 'hi' );
		returnVal = searchAllChildrenFor( videoElement, "class", "feed-item-dismissal-notices", true );
	}

	//Check the value & return if we found something
	if ( isUndef( returnVal ) ) {
		throw "findFeedDismissalMessage returned null.";
	} else {
		return returnVal;
	}
}

/**
 *
 *	Adds a new menu button to the left context bar.
 *	@param {String} btnText - the text on the button
 * 	@param {function} onClickFunction - the function to call on click
 */
function addButton_MenuItem( btnText, onClickFunction ) {

	var parent = addMenu_Sidebar().firstElementChild;

	var listElem = document.createElement( "li" );
		listElem.className = "vve-check guide-channel";

	var link = listElem.appendChild( document.createElement( "a" ) );
		link.className = "guide-item yt-uix-sessionlink yt-valign spf-nolink ";
		link.onclick = function () {
			try { onClickFunction(); }
			catch ( err ) { logError( err ); }
		};
		// listElem.appendChild( link );

	var topSpan = document.createElement( "span" );
		topSpan.className = "yt-valign-container";

	var span = document.createElement( "span" );
		span.className = "display-name no-count";

	var textDetails = document.createElement( "span" );
		textDetails.title = btnText;
		textDetails.innerText = btnText;

	//Append it to the correct place.
	link.appendChild( topSpan );
	topSpan.appendChild( span );
	span.appendChild( textDetails );
	parent.insertBefore(
		listElem,
		parent.firstElementChild.nextElementSibling
	);
}

function addMenu_Sidebar() {
	// Check if we've already added it
	var section = document.getElementById( "YouTweak-guide-section" );
	if ( section ) return section;

	// Get guide menu
	var guide_toplevel = document.getElementsByClassName( "guide-toplevel" )[ 0 ];

	// Get options page URL
	var optionsPage = chrome.extension.getURL( "OptionsPage/options.html" );

	// Create youtweak menu
	section = document.createElement( "li" );
	section.className = "guide-section";
	section.id = "YouTweak-guide-section";
	var guide_item_container = document.createElement( "div" );
		guide_item_container.className = "guide-item-container personal-item";
	var menu_header = document.createElement( "h3" );
	var title_link = document.createElement( "a" );
		title_link.onclick = function () {
			chrome.runtime.sendMessage(
				{ method: "openYouTweakOptions" },
				function () { }
			);
		};
		title_link.className = "yt-uix-sessionlink g-hovercard";
		title_link.innerText = "YouTweak";
	var menuList = document.createElement( "ul" );
		menuList.className = "guide-user-links yt-uix-tdl yt-box";
		menuList.role = "menu";
	var sep = document.createElement( "hr" );
		sep.className = "guide-section-separator";

	guide_toplevel.insertBefore(
		section,
		guide_toplevel.firstElementChild.nextElementSibling
	);
	section.appendChild( guide_item_container );
	guide_item_container.appendChild( menu_header );
	menu_header.appendChild( title_link );
	guide_item_container.appendChild( menuList );
	guide_item_container.appendChild( sep );

	return section;
}

function addCSS_Rule( sheet, selector, rules, index ) {
	if ( !index ) index = 0;

	if ( "insertRule" in sheet )
		sheet.insertRule( selector + "{" + rules + "}", index );
	else if ( "addRule" in sheet )
		sheet.addRule( selector, rules, index );
 }

function addCSS_Sheet() {
	// TODO: cache sheet globally and return that, instead of creating new sheet on every call ... also means that current pattern no longer needs to pass new sheet to addCSS_rule()
	var style = document.createElement( "style" );
		style.class = "YouTweak_CSS_Sheet";

		// Add a media (and/or media query) here if you'd like!
		// style.setAttribute("media", "screen")
		// style.setAttribute("media", "only screen and (max-width : 1024px)")

		// WebKit hack :(
		style.appendChild( document.createTextNode( "" ) );

	document.head.appendChild( style );

	return style.sheet;
}

/**
 * Gets the 'feed list' of the page. This is all of the video elements
 */
function find_FeedList() { // TODO: delete?
	var feedlist = document.getElementById( "browse-items-primary" ).getElementsByClassName( 'section-list' );

	if ( feedlist.length > 0 )
		return feedlist;
}

/**
 * Function to embed a listener to completed AJAX calls into the document. Supplied with a callback function
 * which has 1 argument (string) which is the url of the AJAX callback. This can be checked to ensure the callback
 * matches the event you wish to intercept.
 * @type {Array}
 */
// QUESTION //
// var defined in an if statement will attach the variable to the scope above,
// therefore this line defines an empty variable, tests if emmpty, then puts something in it
if ( isUndef( ajaxReturnCallbacks ) ) var ajaxReturnCallbacks = [];
function addListener_AjaxReturn( callback ) { // DELETE
	ajaxReturnCallbacks.push( callback );

	var main = function () {
		( function ( open ) {

			XMLHttpRequest.prototype.open = function ( method, url, async, user, pass ) {

				this.addEventListener( "readystatechange", function () {
					if ( this.readyState == 4 ) {
						var myEvent = document.createEvent( 'CustomEvent' );
						myEvent.initCustomEvent( 'AjaxCallbackEvent', true, true, url );
						document.body.dispatchEvent( myEvent );
						console.log( "TEST" );
					}
				}, false );

				open.call( this, method, url, async, user, pass );
			};

		} )( XMLHttpRequest.prototype.open );
	};

	// Lets create the script objects
	var injectedScript = document.createElement( 'script' );
	injectedScript.type = 'text/javascript';
	injectedScript.text = '(' + main + ')("");';
	( document.body || document.head ).appendChild( injectedScript );

	document.body.addEventListener( 'AjaxCallbackEvent', function ( ajaxURL ) {
		for ( var i = 0; i < ajaxReturnCallbacks.length; i++ ) {
			ajaxReturnCallbacks[ i ]( ajaxURL.detail );
		}
	} );
}

function addListener_LoadMoreVideos( callbackFunction, callbackDescription ) {
	//Add a listener for a new page of videos being added.
	var feedPagesParent = "browse-items-primary";
	document.getElementById( feedPagesParent )
		.addEventListener(
			"DOMNodeInserted",
			function ( event ) {
				if ( event.target.parentElement.id == feedPagesParent ) {
					console.log( "YouTweak: detected a new video page. " + callbackDescription );
					callbackFunction();
				}
			}
		);
};
