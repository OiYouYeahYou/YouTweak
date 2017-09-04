/**
 * Checks for latest verion
 *
 * Refactored by OiYouYeahYou on 2017/09/03
 */

var xmlURL = "https://mattie432.com/YouTweak/message.xml";
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
//checkReview();
//requestMsg();
chrome.runtime.sendMessage( { method: "checkReview" }, noop );

/**
 *	Sends a request to the listener in the eventpage class.
 * 	Asks for it to check for new messages on the web.
 */
function requestMsg() {
	chrome.runtime.sendMessage(
		{ method: "requestXMLMsg", url: xmlURL },
		noop
	);
}

/**
 *	Checks the last time user was asked to review or if they have already
 * 	and asks again if nessesary.
 */
function checkReview() {
	chrome.storage.sync.get(
		[ 'reviewed', 'reviewDateDays' ],
		function ( settings ) {
			if ( settings.reviewed != true && settings.reviewDateDays !== undefined ) {
				//there is a valid date
				var date = new Date();
				var currDaysNum
					= date.getDate() + aggregateMonths[ date.getMonth() ];
				var daysBetween = currDaysNum - settings.reviewDateDays;

				//ask to review
				if ( daysBetween < 0 ) askToReview();
				//over 1 week
				else if ( daysBetween >= 7 ) askToReview();
				//always call, used for testing
				// else askToReview();
			}
		}
	);
}

/**
 *	Sends a request to eventpage asking for a review notification
 */
function askToReview() {
	chrome.runtime.sendMessage(
		{
			method: "reviewNotify",
			title: '',
			message: '',
			decay: '-1'
		},
		noop
	);
}

function noop() { }
