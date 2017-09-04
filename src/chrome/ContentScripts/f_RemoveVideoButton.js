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
