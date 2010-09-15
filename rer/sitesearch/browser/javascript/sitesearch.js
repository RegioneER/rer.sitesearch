jq(document).ready(function() {
	jq("#search :radio, #search :checkbox").change(function() {
		if (this.id === 'sort_on-date') {
			jq('<input type="hidden" name="sort_order" value="reverse"/> ').insertBefore(jq('#sort_on-date'));
		}
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
});

function removeFacetedFilter(faceted){
	checkedFaceted = jq("#search :checkbox[name="+faceted+":list]:checked")
		if (checkedFaceted.size()) {
			checkedFaceted.removeAttr("checked");
			jq("#search :submit").click();
		}
}	
