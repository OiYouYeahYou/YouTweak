/**
 * Redircts the YouTube logo to to subs feed instead of recomendations
 *
 * Refactored by OiYouYeahYou on 2017/09/02
 * TODO: Update to new layout
 */

var defaultURL = "http://www.youtube.com/feed/subscriptions";

getStoredChromeSettings( [ 'changeIconURL', 'iconURLTxt' ], redirect_init );

/**
 *	Initialisation for the class.
 */
function redirect_init( s ) {
	if ( !s.changeIconURL ) return;

	var url = s.iconURLTxt == null || s.iconURLTxt == 'undefined'
		? defaultURL : s.iconURLTxt;

	document.getElementById( "logo-container" ).setAttribute( "href", url );

	var areas = document.getElementsByTagName( "area" );

	for ( var i = 0; i < areas.length; i++ )
		areas[ i ].setAttribute( "href", url );
}
