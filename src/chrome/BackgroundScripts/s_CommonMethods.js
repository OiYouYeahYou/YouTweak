/**
 * Contains common functions
 *
 * Refactored by OiYouYeahYou on 2017/09/02
 * TODO: Update to new layout
 * TODO: Move common variables
 */


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
			throw new Error( "There was a problem retrieving saved settings from google." )

		//See whats retrieved from chrome storage.
		// var options = [];
		// for ( var key in items )
		// 	if ( key in items )
		// 		options.push( key );

		// console.log( items );

			}
	}
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

/**
 * Returns an array of all video items on the page.
 */
function find_AllFeedVideos() {
	var videoList = searchForTagAndClass( "li", "yt-shelf-grid-item" );

	if ( videoList ) return videoList;

	videoList = searchForTagAndClass( "div", "feed-item-container" );

	if ( videoList ) return videoList;

	throw new Error( "findAllFeedVideos returned null." );
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

	else throw new Error( "find_FeedVideoHideButton returned null.");
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
