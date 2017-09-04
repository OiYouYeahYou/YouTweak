/**
 * Removes watched videos from subs feed, either automatically or with a sidebar button
 *
 * Created by Mattie432 on 24/04/2016.
 * Refactored by OiYouYeahYou on 2017/09/02
 * TODO: Update to new layout
 */

var removedWatchedVideos = 0;

getStoredChromeSettings(
	[ 'removeWatchedVideos', 'deleteWatchedVidsAutomated' ],
	batchWatchedRemoval_init
);

function batchWatchedRemoval_init( settings ) {
	if ( !settings.removeWatchedVideos ) return;

	if ( settings.deleteWatchedVidsAutomated )
		// Auto remove
		autoRemoveWatched();
	else
		// User initiated
		addButton_MenuItem( "Clear watched videos", removeWatched );
}

/**
 *	Removes all watched videos on the page. This is used by the automated system option.
 */
function autoRemoveWatched() {
	// Remove all watched now.
	removeWatched();

	// Callback when loading more videos
	addListener_LoadMoreVideos(
		function () {
			var feedlist = find_FeedList();

			for ( var i = 0; i < feedlist.length; i++ ) {
				// QUESTION why is this in a loop, it doesn't seem to do anything with the iteration
				var feedListElem = feedlist[ i ];

				if ( feedlist.length <= removedWatchedVideos )
					continue;

				// alert(feedPages.length);
				removeWatched( window.scrollY );
				removedWatchedVideos = feedlist.length;
			}
		},
		"Removing watched videos automatically."
	);
}

/**
 * Remove all watched videos from the homescreen.
 * @param {Object} scrollToTop : Boolean - scroll to top of page after.
 */
function removeWatched( scrollToTop, cb ) {
	// Find all the video elements
	var videoItems = find_AllFeedVideos();

	for ( var i = 0; i < videoItems.length; i++ ) {
		var video = videoItems[ i ];

		// Video has not been watched
		if ( video.getElementsByClassName( 'watched-badge' ).length === 0 )
			continue;

		// Click hide & Remove dissmisal
		find_FeedVideoHideButton( video ).click();
		video.remove();
	}

	if ( scrollToTop ) {
		try { window.scrollTo( 0, window.scrollY ); }
		catch ( e ) { console.log( "scroll error..." ); }
	}

	if ( typeof cb == 'function' ) cb();
}
