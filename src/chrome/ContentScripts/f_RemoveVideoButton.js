/**
 * Adds a `remove` to each video in subs feed
 *
 * Created by Mattie432 on 24/04/2016.
 * Refactored by OiYouYeahYou on 2017/09/02
 * TODO: Update to new layout
 */

getStoredChromeSettings( 'deleteSubsBtn', setting_Removal );

/*
 * Initial startup method for the class.
 * @param returnedSettings : Object - returned settings.
 */
function setting_Removal( settings ) {
	if ( !settings.deleteSubsBtn ) return;

	// Add css styles to the page
	addCSSRemoveVideoButton();

	// Add removal btn
	initRemoveSingleVideo();

	// New video elements listener
	addListener_LoadMoreVideos(
		initRemoveSingleVideo,
		"Adding more remove buttons."
	);
}

function addCSSRemoveVideoButton() {
	var sheet = addCSS_Sheet();

	addCSS_Rule(
		sheet
		, ".contains-addto:hover .video-actions-leftAlign"
		, "right: 172px;"
	);

	addCSS_Rule(
		sheet
		, ".addto-button-Delete:before"
		, "background: no-repeat url(//s.ytimg.com/yts/imgbin/www-hitchhiker-vflsIkBw3.webp) -60px -1008px;"
		+ "background-size: auto;"
		+ "height: 13px;"
		+ "width: 13px;"
	);
}

/*
*	Adds a remove button to all videos on the homepage.
*/
function initRemoveSingleVideo() {
	// Find all the video elements
	var videoItems = find_AllFeedVideos();

	// For each video
	for ( var i = 0; i < videoItems.length; i++ ) {
		var item = videoItems[ i ];

		if ( item.hasAttribute( 'youtweak-processed' ) ) continue;

		// Place where the new btn will be added.
		var appendTo = item.getElementsByClassName( 'contains-addto' )[ 0 ];
		if ( !appendTo ) continue;

		var clickableHideBtn = find_FeedVideoHideButton( item );
		if ( !clickableHideBtn ) continue;

		appendTo.appendChild(
			createButton_RemoveVideo2( clickableHideBtn, item )
		);

		// Used to signify that this video has already had a btn added.
		item.setAttribute( 'youtweak-processed', 'true' );
	}
}

/**
 *
 *	Adds the 'remove' button to all the video elements.
 * @param {Object} videoElement : li element - expects the li of the video on the homepage
 * @param {Object} clickableHideBtn : element - expects the hideBtn of that video.
 */
function addButton_RemoveVideo( item ) { // DELETE
	// Place where the new btn will be added.
	var appendTo = item.getElementsByClassName( 'contains-addto' )[ 0 ];
	if ( !appendTo ) return false;
	var clickableHideBtn = find_FeedVideoHideButton( item );
	if ( !clickableHideBtn ) return false;

	var btn = createButton_RemoveVideo2( clickableHideBtn, item );

	// Used to signify that this video has already had a btn added.
	// TODO: use custom attribute instead of node spam
	var doneSpan = document.createElement( "DONE" );

	// The div that surrounds the btn, used for css placement DELETE
	var enclosingDiv = document.createElement( "div" );
		enclosingDiv.className = "enclosingDiv";
		enclosingDiv.style.height = "20px";
		enclosingDiv.appendChild( btn );

	appendTo.appendChild( btn );
	item.appendChild( doneSpan );
}

/**
 * Find the location to append the rmo
 */
function find_RemoveButtonAppendLocation( videoElem ) { // DELETE
	var elem = videoElem.getElementsByClassName( 'contains-addto' );

	if ( elem.length > 0 )
		return elem[ 0 ]
}

/**
 *	Creates a remove button element.
 * @return {element} - remove button object.
 */
function createButton_RemoveVideo1() { // DELETE
	var btn = document.createElement( "input" );
		btn.type = "button";
		btn.className = "RemoveVideo";
		btn.value = "Remove Video";
		btn.style.cursor = "pointer";
		btn.style.fontFamily = "arial,sans-serif";
		btn.style.fontWeight = "bold";
		btn.style.fontSize = "11px";

		// Style
		btn.style.marginTop = "1px";
		btn.style.position = "absolute";
		btn.style.right = "10px";
		btn.style.bottom = "10px";


		btn.style.height = "20";
		btn.style.width = "75";
		btn.style.backgroundColor = "#B51D1D";
		btn.style.color = "#fff";
		// btn.style.marginLeft = "420px";

	return btn;
}

function createButton_RemoveVideo2( clickableHideBtn, videoElement ) {
	var btn = document.createElement( "button" );
		btn.type = "button";
		btn.id = "THisIsTheRighOne";
		btn.style.width = "20px";
		btn.style.height = "20px";
		btn.style.padding = "0px";
		btn.setAttribute( "data-tooltip-text", "Delete Video" );
		btn.onclick = function () {
			try {
				clickableHideBtn.click();
				videoElement.remove();
			}
			catch ( ex ) { console.log( "Error clicking remove button." ); }

			videoElement.remove();
		};
		btn.className = "yt-uix-button yt-uix-button-size-small yt-uix-button-default yt-uix-button-empty yt-uix-button-has-icon video-actions no-icon-markup spf-nolink hide-until-delayloaded yt-uix-tooltip video-actions-leftAlign addto-button-Delete youtweak-btn-removal";
		// addto-button addto-queue-button addto-tv-queue-button video-actions
	return btn;
}
