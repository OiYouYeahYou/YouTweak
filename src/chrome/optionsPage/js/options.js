/**
 * JS for Options page
 *
 * Refactored by OiYouYeahYou on 2017/09/03
 */

var setDays, //Date used to check if can review yet.
	xmlURL = "https://mattie432.com/YouTweak/message.xml",
	subsFeedURL = "http://www.youtube.com/feed/subscriptions",
	lastOpenedOptionsPage,
	debug = false,
	aggregateMonths = [
		0, // January
		31, // February
		31 + 28, // March
		31 + 28 + 31, // April
		31 + 28 + 31 + 30, // May
		31 + 28 + 31 + 30 + 31, // June
		31 + 28 + 31 + 30 + 31 + 30, // July
		31 + 28 + 31 + 30 + 31 + 30 + 31, // August
		31 + 28 + 31 + 30 + 31 + 30 + 31 + 31, // September
		31 + 28 + 31 + 30 + 31 + 30 + 31 + 31 + 30, // October
		31 + 28 + 31 + 30 + 31 + 30 + 31 + 31 + 30 + 31, // November
		31 + 28 + 31 + 30 + 31 + 30 + 31 + 31 + 30 + 31 + 30, // December
	];

document.addEventListener( 'DOMContentLoaded', opts_init );
window.onbeforeunload = function () { save_options(); };

function opts_init() {
	setValue( "iconURL", subsFeedURL );
	addClick( "resetTxt", _ => setValue( "iconURL", subsFeedURL ) );
	addClick( "deleteWatchedVids", toggleDeleteWatchedVidsAutomatic );

	//For the automatically remove videos button
	addClick( 'deleteWatchedVids', function () {
		// TODO: Ipmlement classList toggle and dry out
		var removeButton = byid( "deleteWatchedVids" );
		var automated = byid( "deleteWatchedVidsAutomated" );

		if ( removeButton.checked == true ) {
			automated.removeAttribute( "disabled" );
		} else {
			automated.setAttribute( "disabled", "" );
			automated.checked = false
		}
	} );

	//for the collapse subscriptions groups buttons
	addClick( "collapseSubscriptionVideos", function () {
		// TODO: Ipmlement classList toggle and dry out
		var automated = byid( "collapseStartOldHidden" );
		var collapseSubscriptionVideos = byid( "collapseSubscriptionVideos" );

		if ( collapseSubscriptionVideos.checked == true )
			automated.removeAttribute( "disabled" );

		else {
			automated.setAttribute( "disabled", "" );
			automated.checked = false
		}
	} );

	restore_options(); // TODO: flatten?
	checkForDate(); // TODO: flatten?

	chrome.storage.sync.get( 'lastOpenedOptionsPage', checkMessages );
};

function checkMessages( settings ) {
	var hoursBetweenChecks = 2;
	var t = settings.lastOpenedOptionsPage + ( 60 * 60 * hoursBetweenChecks );
	var currentTime = new Date().getTime() / 1000;

	if ( debug ) {
		//enables always download message
		t = currentTime - 1000;
		//empty local message
		chrome.storage.local.set( { "keyMessage": null, "keyDate": null } );
	}

	// QUESTION Should these be | or ||
	if ( !( isNaN( t ) | t == undefined | t == null | t == "" | t < currentTime ) ) {
		chrome.storage.local.get(
			[ "keyMessage", "keyDate" ],
			function ( result ) {
				//show cached message
				if ( result.keyMessage && result.keyDate )
					addMessageToPage( result.keyMessage, result.keyDate );
			}
		);

		return;
	}

	var xhr = new XMLHttpRequest();
		xhr.open( "GET", xmlURL, true );
		xhr.onreadystatechange = function () {
			if ( xhr.readyState !== 4 ) return;

			var res = parseXML( xhr );

			// alert(
			// 	"checkttl =" + checkTTL( response.date, response.ttl )
			// 	+ "\n response.date=" + response.date
			// 	+ "\nttl = " + response.ttl
			// )

			var go = res.show == "true" && checkTTL( res.date, res.ttl );
			if ( go || debug == true ) {
				addMessageToPage( res.message, res.date );
				//save message locally
				chrome.storage.local.set(
					{ "keyMessage": res.message, "keyDate": res.date }
				);
			}
			else //empty local message
				chrome.storage.local.set(
					{ "keyMessage": null, "keyDate": null }
				);
		};
		xhr.send();

	lastOpenedOptionsPage = new Date().getTime() / 1000;
}

//add days to date
function addDays( date, days ) {
	var result = new Date( date );
		result.setDate( result.getDate() + days );
	return result;
}
/*
 * Checks if the current date is within the response date & the time to live of the message.
 */
function checkTTL( responseDate, ttl ) {
	var responseSplit = responseDate.split( " " );
	var responseDay = responseSplit[ 0 ].substring( 0, responseSplit[ 0 ].length - 2 );
	var responseMonth;

	var cache = responseSplit[ 1 ].toLowerCase();
	if ( cache.indexOf( "jan" ) > -1 ) responseMonth = 0;
	else if ( cache.indexOf( "feb" ) > -1 ) responseMonth = 1;
	else if ( cache.indexOf( "mar" ) > -1 ) responseMonth = 2;
	else if ( cache.indexOf( "apr" ) > -1 ) responseMonth = 3;
	else if ( cache.indexOf( "may" ) > -1 ) responseMonth = 4;
	else if ( cache.indexOf( "jun" ) > -1 ) responseMonth = 5;
	else if ( cache.indexOf( "jul" ) > -1 ) responseMonth = 6;
	else if ( cache.indexOf( "aug" ) > -1 ) responseMonth = 7;
	else if ( cache.indexOf( "sep" ) > -1 ) responseMonth = 8;
	else if ( cache.indexOf( "oct" ) > -1 ) responseMonth = 9;
	else if ( cache.indexOf( "nov" ) > -1 ) responseMonth = 10;
	else if ( cache.indexOf( "dec" ) > -1 ) responseMonth = 11;

	var dateFrom = new Date( responseSplit[ 2 ], responseMonth, responseDay );
	//dateFrom = dateFrom.getTime();

	//Need to set the date this way, adding time, other ways are buggy.
	var dateTo = new Date();
		dateTo.setTime( dateFrom.getTime() + parseInt( ttl ) * 86400000 );

	var today = new Date().getTime();

	if ( today >= dateFrom && today <= dateTo )
		return true;

	return false;
}

function addMessageToPage( message, messageDate ) {
	var child = document.createElement( "div" );
		child.classList.add( "alert alert-dismissable alert-danger" );

	var container = child.appendChild( document.createElement( "div" ) );

	var icon = document.createElement( "div" ); // QUESTION What is this for
		icon.classList.add( "alertIcon" );

	var text = container.appendChild( document.createElement( "div" ) );
		text.classList.add( "alertText" );
		text.innerHTML = linkify( message );

	var date = container.appendChild( document.createElement( "h4" ) );
		date.innerHTML = "<strong>Alert!</strong> - " + messageDate;

	var note = byid( "AlertsAddedBelowHere" );
		note.insertBefore( child, note.firstElementChild );
}

function linkify( inputText ) {
	var result = inputText.replace(
		// URLs starting with http://, https://, or ftp://
		/(\b(https?|ftp):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/gim,
		'<a href="$1" target="_blank">$1</a>'
	)
	.replace(
		// URLs starting with "www." (without // before it, or it'd re-link the ones done above).
		/(^|[^\/])(www\.[\S]+(\b|$))/gim,
		'$1<a href="http://$2" target="_blank">$2</a>'
	)
	.replace(
		// Change email addresses to mailto:: links.
		/(([a-zA-Z0-9\-\_\.])+@[a-zA-Z\_]+?(\.[a-zA-Z]{2,6})+)/gim,
		'<a href="mailto:$1">$1</a>'
	);

	return result;
}

/**
 *	Gets all messages from the XML
 * @param {Object} xml1
 * @param {Object} msgNum
 */
function parseXML( xml1, msgNum ) { // TODO: dry out
	var xml = xml1.responseXML.childNodes[ 0 ];
	if ( !(xml !== undefined && xml !== null) ) return;

	var messages = xml.childNodes;

	var num = -1, date, text, ttl, show;

	for ( var i = 0; i < messages.length; i++ ) {
		if ( messages[ i ].nodeName == "show" ) {
			//show msg
			show = messages[ i ].textContent;
		}

		if ( messages[ i ].nodeName !== "message" ) continue;

		var tempnum, tempdate, temptext, tempttl;

		for ( var j = 0; j < messages[ i ].childNodes.length; j++ ) {
			var node = messages[ i ].childNodes[ j ]

			if ( node.nodeName == "num" ) tempnum = node.textContent;
			else if ( node.nodeName == "date" ) tempdate = node.textContent;
			else if ( node.nodeName == "text" ) temptext = node.textContent;
			else if ( node.nodeName == "ttl" ) tempttl = node.textContent;
		}

		if ( ( msgNum == undefined || tempnum > msgNum ) && tempnum > num ) {
			num = tempnum;
			date = tempdate;
			text = temptext;
			ttl = tempttl;

			return {
				show: show,
				num: num,
				date: date,
				message: text,
				ttl: ttl
			};
		}
	}
}

// Saves options to localStorage.
function save_options() {
	var iconURL = iconURL;

	if ( isValidURL( iconURL.value ) ) {
		var options = {
			'reviewed': "false",
			'lastOpenedOptionsPage': lastOpenedOptionsPage,// TODO: evaluate
			'reviewDateDays': setDays,// TODO: evaluate
			'deleteSubsBtn': elemChecked( "deleteSubsBtn" ),
			'changeIconURL': elemChecked( "changeIconURL" ),
			'removeWatchedVideos': elemChecked( "deleteWatchedVids" ),
			'iconURLTxt': iconURL.value,
			'clearAllVideos': elemChecked( "clearAllVideos" ),
			'loadAllVideos': elemChecked( "loadAllVideos" ),
			'deleteWatchedVidsAutomated': elemChecked( "deleteWatchedVidsAutomated" ),
			// 'removeRecomendedChannels': elemChecked( "removeRecomendedChannels" ),
			// 'redirectYouTube': elemChecked( "redirectYouTube" ),
			// 'autoLike': elemChecked( "autoLike" ),
			// 'autoLikeNames': elemValue( "autoLikeTextBox" )
			// 	.replace( " ", "" )
			// 	.replace( ",", "" )
			// 	.replace( /[\n\r]/g, "," ),
			// 'extensionVersionToUse': elemValue( "selectVersionCombobox" ),
			'collapseSubscriptionVideos': elemChecked( "collapseSubscriptionVideos" ),
			'collapseStartOldHidden': elemChecked( "collapseStartOldHidden" )
		};

		chrome.storage.sync.set(
			options,
			function () {
				// QUESTION TODO? or should this be noop
				// Notify that we saved.
			}
		);

		iconURL.classList.add( "error" );
	} else {
		// QUESTION User has closed the window ... They can't see this!!
		alert( "URL not valid!" );
		iconURL.classList.add( "error" );
		iconURL.focus();
	}
}

// Restores select box state to saved value from localStorage.
function restore_options() {
	if ( !debug )
		chrome.storage.sync.set(
			{ 'extensionVersionPrevious': null },
			function () {
				// QUESTION TODO? or should this be noop
				// Notify that we saved.
			}
		);

	var settings = [ 'changeIconURL', 'removeWatchedVideos', 'linksInHD', 'deleteSubsBtn', 'iconURLTxt', 'pauseVideos', 'installDate', 'loadAllVideos', 'clearAllVideos', 'deleteWatchedVidsAutomated', 'removeRecomendedChannels', 'qualitySelect', 'repeatVideos', 'redirectYouTube', 'setVideoSize', 'centerHomePage', 'autoLike', 'autoLikeNames', 'lastOpenedOptionsPage', 'extensionVersionToUse', 'extensionVersionPrevious', 'collapseSubscriptionVideos', 'collapseStartOldHidden' ];

	chrome.storage.sync.get( settings, appplySettingsHTML );
}

function appplySettingsHTML( r ) {
	lastOpenedOptionsPage = r.lastOpenedOptionsPage;
	// setChecked( "autoLike", r.autoLike );
	// setValue(
	// 	"autoLikeTextBox",
	// 	r.autoLikeNames ? r.autoLikeNames.replace( ",", /\n/ ) : ''
	// );
	setChecked( "changeIconURL", r.changeIconURL );
	setChecked( "deleteSubsBtn", r.deleteSubsBtn );
	setChecked( "clearAllVideos", r.clearAllVideos );
	setChecked( "loadAllVideos", r.loadAllVideos );
	setChecked( "deleteWatchedVidsAutomated", r.deleteWatchedVidsAutomated );
	// setChecked( "removeRecomendedChannels", r.removeRecomendedChannels );
	// setChecked( "redirectYouTube", r.redirectYouTube );
	setChecked( "collapseSubscriptionVideos", r.collapseSubscriptionVideos );
	setChecked( "collapseStartOldHidden", r.collapseStartOldHidden );
	if ( r.collapseSubscriptionVideos )
		byid( "collapseStartOldHidden" ).removeAttribute( "disabled" );
	setValue( "iconURL", r.iconURLTxt ? r.iconURLTxt : subsFeedURL );

	setChecked( "deleteWatchedVids", r.removeWatchedVideos );
	if ( r.removeWatchedVideos )
		byid( "deleteWatchedVidsAutomated" ).removeAttribute( "disabled" );

	// if ( r.extensionVersionToUse )
	// 	setValue( "selectVersionCombobox", r.extensionVersionToUse );
	// if ( r.extensionVersionPrevious ) {
	// 	var versions = byid( "selectVersionCombobox" ).children;

	// 	for ( var i = 0; i < versions.length; i++ ) {
	// 		var version = versions[i];
	// 		if ( version.value !== r.extensionVersionPrevious ) continue;

	// 		version.text += " (Previously installed version)";
	// 		break;
	// 	}
	// }
}

function checkForDate() {
	chrome.storage.sync.get(
		[ 'reviewed', 'reviewDateDays' ],
		settings =>
			setDays = !settings.reviewed && !settings.reviewDateDays
				? convertDateToDays( new Date() )
				: settings.reviewDateDays
	);
}

function convertDateToDays( date ) {
	return date.getDate() + aggregateMonths[ date.getMonth() ];
}

function isValidURL( url ) {
	var RegExp = /^(([\w]+:)?\/\/)?(([\d\w]|%[a-fA-f\d]{2,2})+(:([\d\w]|%[a-fA-f\d]{2,2})+)?@)?([\d\w][-\d\w]{0,253}[\d\w]\.)+[\w]{2,4}(:[\d]+)?(\/([-+_~.\d\w]|%[a-fA-f\d]{2,2})*)*(\?(&?([-+_~.\d\w]|%[a-fA-f\d]{2,2})=?)*)?(#([-+_~.\d\w]|%[a-fA-f\d]{2,2})*)?$/;

	return RegExp.test( url );
}

function toggleDeleteWatchedVidsAutomatic() {
	// TODO: convert to classList based function and propagate
	var autoDeleteWatched = byid( 'deleteWatchedVidsAutomated' );

	if ( byid( "deleteWatchedVids" ).checked )
		autoDeleteWatched.removeAttribute( "disabled" );
	else
		autoDeleteWatched.setAttribute( "disabled", "true" );
}

function byid( id ) { return document.getElementById( id ); }
function elemChecked( id ) { return document.getElementById( id ).checked; }
function elemValue( id ) { return document.getElementById( id ).value; }

function setChecked( id, value ) { return byid( id ).checked = value; }
function setValue( id, value ) { return byid( id ).value = value; }
function addClick( id, func ) {
	return byid( id ).addEventListener( 'click', func );
}
