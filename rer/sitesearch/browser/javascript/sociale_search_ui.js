/**
 * Advanced search UI controls
 */

jQuery.fn.ploneHide = function() {
	return this.each(function() {
		jQuery(this).addClass("hiddenStructure");
	});
};

jQuery.fn.ploneShow = function() {
	return this.each(function() {
		var e = jQuery(this);
		if (e.is(":hidden")) e.show();
		e.removeClass("hiddenStructure");
	});
};

jq(document).ready(function() {
	jq('.searchData:not(:first)').ploneHide();
	jq('dl.searchResults > dt:first a').addClass('groupSelected');
	jq('dl.searchResults h3').ploneHide();
	jq('dl.searchResults > dt').each(function (index) {
		var i = index;
		jq(this).click(function(e) {
			jq('dl.searchResults > dt a').removeClass('groupSelected');
			jq('dl.searchResults > dd').ploneHide().removeClass('firstSearchBlock');
			jq("#searchDataBlock"+(i+1)).ploneShow().addClass('firstSearchBlock');
			jq('dl.searchResults > dt:eq('+i+') a').addClass('groupSelected');
			e.preventDefault();
		});
	});
});
