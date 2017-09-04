/**
 * Background page that handles:
	* notifications, onMessage listening, install events
 *
 * Refactored by OiYouYeahYou on 2017/09/03
 */

var notifications = 0;
var listUrls = [
	"youtube.com/",
	"youtube.com.br/",
	"youtube.fr/",
	"youtube.jp/",
	"youtube.nl/",
	"youtube.pl/",
	"youtube.ie/",
	"youtube.co.uk/",
	"youtube.es/",
	"youtube.it/",
	"youtube.com",
	"youtube.com.br",
	"youtube.fr",
	"youtube.jp",
	"youtube.nl",
	"youtube.pl",
	"youtube.ie",
	"youtube.co.uk",
	"youtube.es",
	"youtube.it"
];

// sets the action for the icon click.
chrome.browserAction.onClicked.addListener( showOptions );

/**
 *	Message listener, this listens for a request and performs
 * 	the relevent action.
 */
chrome.runtime.onMessage.addListener( function ( req, sender, sendResponse ) {
	var meth = req.method;
	if ( meth === "notify" )
		notify( req.title, req.message, req.decay, req.noOpt );
	else if ( meth === "reviewNotify" ) reviewNotify( req.decay );
	else if ( meth === "requestXMLMsg" ) retrieveXML( req.url );
	else if ( meth === "getTabUrl" ) redirectYouTube();
	else if ( meth === "openYouTweakOptions" ) showOptions();
} );
/**
 *	Listener for when the extension is first installed or updated. This will
 * 	notify the user accordingly.
 */
chrome.runtime.onInstalled.addListener( function ( details ) {
	if ( details.reason == "install" )
		notify(
			"Welcome!",
			"Thanks for installing the extension. To get started please visit the options menu by clicking here.",
			-1
		);
	else if ( details.reason == "update" )
		notify(
			"Update installed!",
			"YouTweak has just been updated, please click here to visit the options menu & enable any new settings.",
			10000
		);

	var currentVersion = chrome.runtime.getManifest().version;
	console.log( "New Youtweak install, version = " + currentVersion );

	chrome.storage.sync.get(
		'extensionVersionCurrent',
		function ( setting ) {
			chrome.storage.sync.set(
				{
					'extensionVersionCurrent': currentVersion,
					'extensionVersionPrevious': setting.extensionVersionCurrent
				},
				function () {
					// QUESTION TODO? or noop?
					// Notify that we saved.
				}
			)
		}
	);
} );

/* QUESTION delete?
	chrome.webNavigation.onHistoryStateUpdated.addListener(
		function ( details ) {
			//Callback function
			alert( "Im in the onHistoryStateUpdated" );
		},
		{
			//Listener filter
			url: [ {
				hostEquals: "*youtube.com*"
			}]
		}
	);

	chrome.webNavigation.onCompleted.addListener(
		function ( details ) {
			//Callback function
			alert( "Im in the onCompleted" );
		},
		{
			//Listener filter
			url: [ {
				hostEquals: "*youtube.com*"
			}]
		}
	);
*/

/**
 *	Notify the user with a chrome notification.
 * @param {Object} title - the message title
 * @param {Object} message - the message content
 * @param {Object} decay - time the message shows for
 * @param {Object} onClick - function to call if the message is clicked
 */
function notify( title, message, decay, noOpt ) {
	// 30min = 1800000
	if ( !decay ) decay = 30000;

	var opt = {
		type: "basic",
		title: title,
		message: message,
		iconUrl: chrome.extension.getURL( 'images/icon.png' )
	};

	var notification = chrome.notifications.create( title, opt, noop );
	// chrome.notifications.create(chrome.extension.getURL('images/icon.png'), title, message);

	if ( !noOpt )
		chrome.notifications.onClicked.addListener( function ( id ) {
			if ( id !== title ) return;
			showOptions();
			// notification.cancel();
		} );
}

/**
 *	Asks the user to review the extension.
 * @param {Object} decay - time the message shows for.
 */
function reviewNotify( decay ) {
	if ( notifications !== 0 ) return;

	//30min = 1800000
	if ( !decay ) decay = 10000;

	var notification = webkitNotifications.createHTMLNotification(
		"../notifications/notificationReview.html"
	);

	//negative decay means the user will have to close the window manually.
	if ( decay != -1 )
		setTimeout( function () { notification.cancel(); }, decay );

	notification.show();
	notifications = 1;
}

/**
 *	Shows the options menu for the extension.
 */
function showOptions() {
	var options = chrome.extension.getURL( "../OptionsPage/options.html" );
	window.open( options, '_newtab' );
}

/**
 *	Http get request for the url specified
 * @param {Object} theUrl
 */
function httpGet( theUrl ) { // DELETE this shouldn't even work
	var xmlHttp = new XMLHttpRequest();
		xmlHttp.open( "GET", theUrl, false );
		xmlHttp.send( null );
		xmlHttp.overrideMimeType( 'text/xml' );

	return xmlHttp.responseText;
}

/**
 *	Checks the message provided in XML format
 * @param {Object} xml1
 */
function checkMsg( xml1 ) {
	chrome.storage.sync.get(
		'lastMessageNum',
		function ( settings ) {
			var response = parseXML(
				xml1, settings.lastMessageNum ? settings.lastMessageNum : -1
			);

			if ( !( response.show == "true" && response.num != -1 ) ) return;

			notify(
				"Alert!",
				"New message recieved about YouTweak! To read it head over to the options page or click on this notification.",
				60000,
				"showOptionsPage"
			);
			updateReadMsg( response.num );
		}
	);
}

/**
 *	Gets the XML from the url provided.
 * @param {Object} url
 */
function retrieveXML( url ) {
	// QUESTION could this compromise sec? TODO: check if accesible from web
	var xhr = new XMLHttpRequest();
		xhr.onreadystatechange = function () {
			// TODO: use onloadend
			// TODO: test if respnse is 404 etc
			if ( xhr.readyState == 4 ) checkMsg( xhr );
		};
		xhr.open( "GET", url, true );
		xhr.send();
}

/**
 *	Gets all messages from the XML
 * @param {Object} xml1
 * @param {Object} msgNum
 */
function parseXML( xml1, msgNum ) { // TODO: dry out // TODO: Simplify

	var xml = xml1.responseXML.childNodes[ 0 ];
	var messages = xml.childNodes;

	var num = -1, date, text, ttl, tempnum, tempdate, temptext, tempttl;

	// Walk nodes
	for ( var i = 0; i < messages.length; i++ ) {
		var msg = messages[ i ];
		if ( msg.nodeName !== "message" ) continue;

		// Walk child nodes, and set values
		for ( var j = 0; j < msg.childNodes.length; j++ ) {
			var node = msg.childNodes[ j ]

			if ( node.nodeName == "num" ) tempnum = node.textContent;
			else if ( node.nodeName == "date" ) tempdate = node.textContent;
			else if ( node.nodeName == "text" ) temptext = node.textContent;
			else if ( node.nodeName == "ttl" ) tempttl = node.textContent;
		}

		// If ___ return values
		if ( ( msgNum == undefined || tempnum > msgNum ) && tempnum > num ) {
			num = tempnum;
			date = tempdate;
			text = temptext;
			ttl = tempttl;

			return {
				show: msg.nodeName == "show" ? msg.textContent : undefined,
				num: num,
				date: date,
				message: text,
				ttl: ttl
			};
		} // if
	} // loop
} // func

/**
 *	Updates the count for the most recently read message.
 * @param {Object} msgNum
 */
function updateReadMsg( msgNum ) {
	chrome.storage.sync.set(
		{ 'lastMessageNum': msgNum },
		// Notify that we saved.
		function () { console.log( "Message number updated" ); }
	);
}

/**
 *	Redirects the url in the address bar if it is the youtube homepage and the
 * 	option to do so has been set in the options menu.
 */
function redirectYouTube() {
	chrome.tabs.getSelected( null, function ( tab ) {
		if ( !urlMatch( tab.url ) ) return;

		chrome.storage.sync.get( [ 'redirectYouTube', 'iconURLTxt' ], function ( settings ) {
			if ( !settings.redirectYouTube ) return;

			var url = settings.iconURLTxt ? settings.iconURLTxt : defaultURL;
			chrome.tabs.update( tab.id, { url } );
		} );
	} );
}

/**
 *	Checks if the url matches any of youtubes url's
 * @param {Object} url
 */
function urlMatch( url ) {
	for ( var i = 0; i < listUrls.length; i++ )
		if ( url.endsWith( listUrls[ i ] ) )
			return true;

	return false;
}

/**
 *	Adds the endsWith method to the string class.
 * @param {Object} s - the string to check if it ends with
 */
String.prototype.endsWith = function(s) {
	return (
		this.length >= s.length
		&& this.substr(this.length - s.length) == s
	);
};

function noop() {}
