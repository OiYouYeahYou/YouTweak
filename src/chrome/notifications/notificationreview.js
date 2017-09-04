/**
 * ????????
 *
 * Refactored by OiYouYeahYou on 2017/09/03
 */

document.addEventListener( 'DOMContentLoaded', notifcationReview_init );

var aggregateMonths = [
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

function notifcationReview_init() {
	document.getElementById( "textContent" ).onclick = openReviewPage;
	document.getElementById( "icon" ).onclick = openReviewPage;
	document.getElementById( "noBtn" ).onclick = no;
	document.getElementById( "reviewBtn" ).onclick = review;
	document.getElementById( "laterBtn" ).onclick = later;
}

function openReviewPage() {
	var options = "https://chrome.google.com/webstore/detail/youtweak-for-youtube/cfgpigllcihcpkbokdnmpkjobnebflgh/reviews";
	window.open( options, '_newtab' );
	window.close();
}

function no() {
	chrome.storage.sync.set(
		{ 'reviewed': true },
		function () {
			// QUESTION todo? or noop?
			// Notify that we saved.
		}
	);
	window.close();
}

function later() {
	//sets install date to today.
	var date = new Date();
	var setDays = date.getDate() + aggregateMonths[ date.getMonth() ];

	chrome.storage.sync.set(
		{ 'reviewed': false, 'reviewDateDays': setDays },
		function () {
			// QUESTION todo? or noop?
			// Notify that we saved.
		}
	);

	window.close();
}

function review() {
	//sets install date to today.
	var setDays = convertDateToDays( new Date() );

	chrome.storage.sync.set(
		{ 'reviewed': true },
		function () {
			// QUESTION todo? or noop?
			// Notify that we saved.
		}
	);
	openReviewPage();
	window.close();
}
