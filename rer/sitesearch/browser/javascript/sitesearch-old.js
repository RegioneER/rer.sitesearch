function removeAdditionalIndexFilter(index){
	/*
	 * Remove the filters for a given index
	 */
	checkedIndex = jq("#search :checkbox[name="+index+":list]:checked")
		if (checkedIndex.size()) {
			checkedIndex.removeAttr("checked");
			jq("#search :submit").click();
		}
}	

function removeHiddenFilters(event){
	event.preventDefault();
	jq(".hiddenIndex").each(function (index) {
		jq(this).remove();
	});
	jq("#search :submit").click();
		
}

function doTabSearch(event){
	event.preventDefault();
	var select_id=jq(this).parent().attr('id');
	jq('input#selected_tab').val(select_id);
	jq('input#b_start').val("0");
	jq("#search :submit").click();
}

function doBatchSearch(event){
	event.preventDefault();
	var batch_href=jq(this).attr('href');
	var b_start=batch_href.indexOf('b_start');
	if (b_start === -1) {
		jq("#search :submit").click();
	}
	var end_batch=batch_href.indexOf("&",b_start);
	if (end_batch === -1) {
		end_batch = batch_href.length;
	}
	var batch_val=unescape(batch_href.substring(b_start+'b_start:int='.length,end_batch));
	jq('input#b_start').val(batch_val);
	jq("#search :submit").click();
}

jq(document).ready(function() {
	jq("#search :radio, #search :checkbox").click(function() {
		if (this.id === 'sort_on-date') {
			jq('#sortOrderField').attr('value','reverse');
		}
		jq('input#b_start').val("0");
		jq("#search :submit").click();
	});
	jq('#deselect-subjects').click(function(event) {
		event.preventDefault();
		var checkedCategorie = jq("#search :checkbox[name=Subject:list]:checked");
		if (checkedCategorie.size()) {
			checkedCategorie.removeAttr("checked");
			jq("#search :submit").click();
		}
	});
	jq('#deselect-siteareas').click(function(event) {
		event.preventDefault();
		var checkedSiteAreas = jq("#search :checkbox[name=getSiteAreas:list]:checked");
		if (checkedSiteAreas.size()) {
			checkedSiteAreas.removeAttr("checked");
			jq("#search :submit").click();
		}
	});
	jq('ul.searchTabs a.linetab').each(function (index) {
		jq(this).bind('click',doTabSearch);
	});
	jq('div.searchData .listingBar a').each(function (index) {
		jq(this).bind('click',doBatchSearch);
	});
	jq('#deselect-hidden').each(function (index) {
		jq(this).bind('click',removeHiddenFilters);
	});
	
});

