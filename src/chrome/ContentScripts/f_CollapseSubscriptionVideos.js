/**
 * Adds ability to collapse subscription feed shelves
 *
 * Created by Mattie432 on 01/05/2016.
 * Refactored by OiYouYeahYou on 2017/09/02
 * TODO: Update to new layout
 */

var collapseStartOldHidden = false;

getStoredChromeSettings(
	[ 'collapseSubscriptionVideos', 'collapseStartOldHidden' ],
	collapseShelves_init
);

function collapseShelves_init( settings ) {
	if ( 'collapseStartOldHidden' in settings )
		collapseStartOldHidden = settings.collapseStartOldHidden;

	if ( settings.collapseSubscriptionVideos ) {
		insertCSS( addCSS_Sheet() );
		updateFeedListWithCollapseButtons();
		addListener_LoadMoreVideos(
			updateFeedListWithCollapseButtons,
			"Updating collapse buttons."
		);
	}
}

function updateFeedListWithCollapseButtons() {
	var sections = document.getElementsByClassName( 'item-section' );

	for ( var i = 0; i < sections.length; i++ ) {
		var section = sections[ i ];

		if ( section.hasAttribute( "YouTweakCollapsed" ) )
			continue;

		var headingElem = firstInClass( 'branded-page-module-title-text', section );
		var headingText = headingElem.innerText;
		var shelf = firstInClass( 'multirow-shelf', section );

		if ( !shelf || !headingText )
			continue;

		var defaultToHide = isHiddenByDefault( headingText )
		if ( defaultToHide )
			shelf.style.display = "none";

		addButton_ToggleCollapse( headingElem, i, shelf, defaultToHide );

		section.setAttribute( "YouTweakCollapsed", true );
	}
}

function insertCSS( sheet ) {
	//see http://www.realcombiz.com/2014/01/how-to-expand-collapse-toggle-div-layer.html

	addCSS_Rule(
		sheet
		, ".shelf-title-table .toggle-box"
		, "display: none;"
	);

	addCSS_Rule(
		sheet
		, ".shelf-title-table .toggle-box + label"
		, "cursor: pointer;"
		+ "display: inline;"
		+ "font-weight: bold;"
		+ "line-height: 21px;"
		+ "margin-bottom: 5px;"
	);

	addCSS_Rule(
		sheet
		, ".shelf-title-table .toggle-box + label:before"
		, "background-color: #4F5150;"
		+ "-webkit-border-radius: 10px;"
		+ "-moz-border-radius: 10px;"
		+ "border-radius: 10px;"
		+ "color: #FFFFFF;"
		+ "content: '+';"
		+ "display: block;"
		+ "float: left;"
		+ "font-weight: bold;"
		+ "height: 20px;"
		+ "line-height: 20px;"
		+ "margin-right: 5px;"
		+ "text-align: center;"
		+ "width: 20px;"
	);

	addCSS_Rule(
		sheet
		, ".shelf-title-table .toggle-box:checked + label:before"
		, "content: '\\2212';"
	);
}

function addButton_ToggleCollapse( appendTo, i, shelf, startCollapsed ) {
	var id = "YouTweak_Collapse_" + i;

	var input = document.createElement( "input" );
		input.className = "toggle-box";
		input.id = id;
		input.type = "checkbox";
		//Note: this is reversed because of the way the CSS is implemented.
		input.defaultChecked = !startCollapsed;
		input.addEventListener( "change", function () {
			shelf.style.display = shelf.style.display == 'none'
				? 'block' : 'none'
		} );

	var label = document.createElement( "label" );
		label.htmlFor = id;

	appendTo.appendChild( input );
	appendTo.appendChild( label );
}

function findNameOfFeedList( feedsList ) { // DELETE
	console.log( findFeedListTitleBar( feedsList ) );
	return findFeedListTitleBar( feedsList )[0].innerText;
}

function findFeedListTitleBar( feedsList ) { // DELETE
	return feedsList.getElementsByClassName( 'branded-page-module-title-text' );

	return searchAllChildrenFor(
		feedsList,
		"class",
		"branded-page-module-title-text",
		true
	);
}

function findFeedListContentDiv( feedsList ) { // DELETE
	return searchAllChildrenFor(
		feedsList,
		"class",
		"multirow-shelf",
		true
	);
}

function isHiddenByDefault( text ) {
	return (
		collapseStartOldHidden
		&& (
			text != "Today"
			&& text != "Yesterday"
			&& text != "This week"
			&& text != "Recent"
		)
	);
}

function firstInClass( className, parent ) {
	return (
		( parent ? parent : document ).getElementsByClassName( className )[ 0 ]
	);
}
