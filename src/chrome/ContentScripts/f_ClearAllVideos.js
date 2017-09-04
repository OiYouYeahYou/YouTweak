/**
 * Adds sidebar button that removes all videos from subscription feed
 *
 * Created by Mattie432 on 24/04/2016.
 * Refactored by OiYouYeahYou on 2017/09/02
 * TODO: Update to new layout
 */

getStoredChromeSettings( 'clearAllVideos', clearAllVideos_init );

/**
 *	Adds the button to remove all videos to the left context bar.
 */
function clearAllVideos_init( settings ) {
	if ( settings.clearAllVideos )
		addButton_MenuItem(
			"Clear all videos",
			function () {
				var confirmWindow = confirm( "Clearing all videos may take a \nfew moments. This cannot be undone! Continue?" );
				if ( !confirmWindow ) return;

				document.body.style.cursor = "wait";

				loadAllVideos( clearAllVideos );
			}
		);
}

/**
 *	Removes all videos from the youtube homescreen.
 */
function clearAllVideos() {
	// Find all the video elements
	var videoItems = find_AllFeedVideos();

	// For each video
	for ( var i = 0; i < videoItems.length; i++ ) {
		// get the hide button
		var vidHideBtn = find_FeedVideoHideButton( videoItems[ i ] );
		vidHideBtn.click();
		videoItems[ i ].remove();
	}

	// scroll to top
	try { window.scrollTo( 0, 0 ); }
	catch ( e ) { console.log( "scroll error..." ); }

	window.location.reload();
	document.body.style.cursor = "default";
	alert( "All videos removed." );
}
