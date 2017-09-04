/**
 * Adds menu button that loads all videos in subscription feed
 *
 * Created by Mattie432 on 24/04/2016.
 * Refactored by OiYouYeahYou on 2017/09/02
 * TODO: Update to new layout
 */

var prevPage = -1;
var pageCount1 = 0;
var loadAllInterval;

getStoredChromeSettings( 'loadAllVideos', loadAll_init );

function loadAll_init( settings ) {
	if ( settings.loadAllVideos )
		addButton_MenuItem( "Load all videos", menuItem_LoadAll );
}

/**
 * Loads all videos on the homescreen into view.
 */
function menuItem_LoadAll() {
	var confirmWindow = confirm( "Loading all videos may take a \nfew moments. Continue?" )
	if ( !confirmWindow ) return;

	document.body.style.cursor = "wait";

	loadAllVideos()
}

function loadAllVideos( cb ) {
	loadAllInterval = setInterval( function loadingAllVideos() {
		var feedlist = find_FeedList();
		pageCount1 = feedlist.length;

		var loadContainer = document
			.getElementsByClassName( "load-more-button" )[ 0 ];

		if ( loadContainer && loadContainer.classList.contains( "loading" ) ) {
			//currently loading
			var a = 1; // QUESTION Why is this here?
		}

		else if ( pageCount1 == prevPage ) {
			//done loading
			window.clearInterval( loadAllInterval );
			document.body.style.cursor = "default";

			alert( "Subscriptions fully loaded." );

			//Finished, invoke callback
			if ( typeof cb == 'function' ) cb();
		}

		else {
			//not loading
			prevPage = feedlist.length;
			if ( loadContainer != null )
				loadContainer.firstElementChild.click();
		}
	} );
}
