/**
 * Advanced search UI controls
 */

function modifyBatchLinks(tab_id){
	var batch_links = jq('div.listingBar a');
	if (batch_links) {
		batch_links.each(function(index){
			var current_href = jq(this).attr('href');
			var selected_start = current_href.indexOf("selected_id=");
			if (selected_start === -1) {
				jq(this).attr('href', current_href + '&selected_id=searchDataBlock-' + tab_id);
				return;
			}
			var selected_end=current_href.indexOf("&",selected_start);
			if (selected_end === -1) {
				selected_end = current_href.length;
			}
			var old_selected_value = unescape(current_href.substring(selected_start+'selected_id='.length,selected_end));
			jq(this).attr('href', current_href.replace(old_selected_value, 'searchDataBlock-' + tab_id));
		});
	}
}

function setSelectedTab(e){
	var tab_id = jq(this).attr('id');
	var new_selected_block = jq('dd#searchDataBlock-'+tab_id);
	var current_selected=jq('dd.selectedSearchBlock');
	var selected_id = current_selected.attr('id');
	var old_tab_id=selected_id.substr('searchDataBlock-'.length);
	jq('dl.searchResults dt#'+old_tab_id+' a').removeClass('groupSelected');
	current_selected.removeClass('selectedSearchBlock');
	current_selected.hide();
	jq(this).children().addClass('groupSelected');
	new_selected_block.show();
	new_selected_block.addClass('selectedSearchBlock');
	modifyBatchLinks(tab_id);
	e.preventDefault();
	}

jq(document).ready(function() {
	jq('dd.searchData').each(function (index) {
		jq(this).children('h3').children().hide();
		if (jq(this).hasClass('selectedSearchBlock')) {
			var id = jq(this).attr('id');
			var tab_id=id.substr('searchDataBlock-'.length);
			jq('dl.searchResults dt#'+tab_id+' a').addClass('groupSelected');
			modifyBatchLinks(tab_id);
		}
		else{
			jq(this).hide();
		}
	
	});
	jq('dl.searchResults > dt').each(function (index) {
		jq(this).click(setSelectedTab);
	});
});
