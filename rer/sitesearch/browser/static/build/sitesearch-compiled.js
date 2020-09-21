"use strict";

require(["jquery"], function ($) {
  "use strict";

  var query,
      pushState,
      generateQuery,
      popState,
      popped,
      initialURL,
      Search = {};

  //update search viewlet value. This is need, if some search terms was deleted by length check
  if ($("input#searchGadget").length === 1) {
    $("input#searchGadget").val($("input#SearchableText").attr("value"));
  } else {
    $("input#nolivesearchGadget").val($("input#SearchableText").attr("value"));
  }
  // The globally available method to pull the search results for the
  // 'query' into the element, on which the method is invoked
  $.fn.pullSearchResults = function (query) {
    return this.each(function () {
      var $container = $(this);
      //$container.fadeOut("slow")
      // var searchQuery = $.extend({ ajax_load: 1 }, query);
      var searchQuery = query + "&ajax_load=1";
      $container.addClass("searchingLoader");
      $.get("@@updated_search?" + searchQuery, function (data) {
        $container.hide();

        // Before assigning any variable we need to make sure we
        // have the returned data available (returned somewhere to
        // the DOM tree). Otherwise we will not be able to select
        // elements from the returned HTML.
        if ($("#ajax-search-res").length === 0) {
          // Create temporary container for the HTML structure,
          // returned by our AJAX request
          $("body").append('<div id="ajax-search-res"></div>');
        }
        $("#ajax-search-res").html(data);

        var $data_res = $("#ajax-search-res #search-results > *"),
            data_search_term = $("#ajax-search-res #updated-search-term input#SearchableText").attr("value"),
            search_results_bar = $("#search-results-bar", data).html(),
            search_results_text = $("#search-results-text", data).html(),
            data_path_opt = $("#ajax-search-res #updated-path-options").html(),
            data_sorting_opt = $("#ajax-search-res #updated-sorting-options").html(),
            data_tab_opt = $("#ajax-search-res #updated-tab-options").html(),
            data_indexes_opt = $("#ajax-search-res #updated-indexes-options").html();
        $container.removeClass("searchingLoader");
        $container.html($data_res);
        $container.fadeIn();

        $("input#SearchableText").attr("value", data_search_term);
        if ($("input#searchGadget").length === 1) {
          $("input#searchGadget").val(data_search_term);
        } else {
          $("input#nolivesearchGadget").val(data_search_term);
        }
        $("#search-results-bar").html(search_results_bar);
        $("#search-results-text").html(search_results_text);
        if (data_path_opt === null) {
          $("#path-options").remove();
        }
        $("#sorting-options").html(data_sorting_opt);
        $("#tab-options").html(data_tab_opt);
        $("#indexes-options").html(data_indexes_opt);
        if (data_indexes_opt === null) {
          $("#indexes-options").hide();
        } else {
          $("#indexes-options").show();
        }
        // Clean after ourselves — empty the ajax results container.
        // No need to remove the item itself — probably there will
        // be more search requests for filtering, sorting, etc. So,
        // we can avoid re-creating the node every time
        $("#ajax-search-res").empty();

        $("#rss-subscription a.link-feed").attr("href", function () {
          // IE11 fix..seems that he doesn't see previous definitions
          var portalUrl = $("body").data("portal-url");
          var navigation_root_url = $("meta[name=navigation_root_url]").attr("content") || window.navigation_root_url || portalUrl;
          return navigation_root_url + "/search_rss?" + query;
        });
        // TODO: con delegate/on/live questo non servirebbe
        init_rersolr_mlt();
      });
    });
  };

  generateQuery = function generateQuery() {
    return $("form.searchPage").serialize();

    // var query = {};
    // var notAddableIndexes = [
    //   // 'created.query:record:list:date',
    //   // 'created.range:record',
    //   "_authenticator",
    // ];
    // queryArray.map(function (field) {
    //   if (notAddableIndexes.indexOf(field.name) === -1 && field.value !== "") {
    //     query[field.name] = field.value;
    //   }
    // });
    // return query;
  };

  pushState = function pushState(query) {
    var portalUrl = $("body").data("portal-url");
    var navigation_root_url = $("meta[name=navigation_root_url]").attr("content") || window.navigation_root_url || portalUrl;
    var url = navigation_root_url + "/@@search?" + query;
    history.pushState(null, null, url);
  };

  // THE HANDLER FOR 'POPSTATE' EVENT IS COPIED FROM PJAX.JS
  // https://github.com/defunkt/jquery-pjax

  // Used to detect initial (useless) popstate.
  // If history.state exists, assume browser isn't going to fire initial popstate.
  popped = "state" in window.history;
  initialURL = location.href;

  // popstate handler takes care of the back and forward buttons
  //
  // No need to wrap 'popstate' event handler for window object with
  // Modernizr check up since popstate event will contain any data only if
  // a state has been created with history.pushState() that is wrapped in
  // Modernizr checkup above.
  $(window).bind("popstate", function (event) {
    var initialPop, str;
    // Ignore inital popstate that some browsers fire on page load
    initialPop = !popped && location.href === initialURL;
    popped = true;
    if (initialPop) {
      return;
    }

    if (!location.search) {
      return;
    }

    query = location.search.split("?")[1];
    // We need to make sure we update the search field with the search
    // term from previous query when going back in history
    str = query.match(/SearchableText=[^&]*/)[0];
    str = str.replace(/\+/g, " "); // we remove '+' used between words
    // in search queries.

    // Now we have something like 'SearchableText=test' in str
    // variable. So, we know when the actual search term begins at
    // position 15 in that string.
    $('#search-field input[name="SearchableText"], input#searchGadget').val(str.substr(15, str.length));

    $("#search-results").pullSearchResults(query);
  });

  $('#search-filter input.searchPage[type="submit"]').hide();

  // We don't submit the whole form with all the fields when only the
  // search term is being changed.
  // If we change the search term, we reset all query and start a new search
  $("#search-field input.searchButton").click(function (e) {
    var st,

    // queryString,
    queryParameters = {};
    st = $('#search-field input[name="SearchableText"]').val();
    queryParameters["SearchableText"] = st;
    // queryString = $.param(queryParameters);
    $("#search-results").pullSearchResults(queryParameters);
    pushState(queryParameters);
    e.preventDefault();
  });
  $("form.searchPage").submit(function (e) {
    var st,

    // queryString,
    queryParameters = {};
    st = $('#search-field input[name="SearchableText"]').val();
    queryParameters["SearchableText"] = st;
    // queryString = $.param(queryParameters);
    $("#search-results").pullSearchResults(queryParameters);
    pushState(queryParameters);
    e.preventDefault();
  });

  // We need to update the site-wide search field (at the top right in
  // stock Plone) when the main search field is updated
  $('#search-field input[name="SearchableText"]').keyup(function () {
    if ($("input#searchGadget").length === 1) {
      $("input#searchGadget").val($(this).val());
    } else {
      $("input#nolivesearchGadget").val($(this).val());
    }
  });

  // When we click any option in the Filter menu, we need to prevent the
  // menu from being closed as it is dictaded by dropdown.js for all
  // dl.actionMenu > dd.actionMenuContent
  $("#search-results-bar dl.actionMenu > dd.actionMenuContent").click(function (e) {
    e.stopImmediatePropagation();
  });

  // Now we can handle the actual menu options and update the search
  // results after any of them has been chosen.
  $(document).on("change", "#search-filter .field input, #search-filter select", function (e) {
    query = generateQuery();
    $("#search-results").pullSearchResults(query);
    pushState(query);
    e.preventDefault();
  });

  // Since we replace the whole sorting options with HTML, coming in
  // AJAX response, we should bind the click event with live() in order
  // for this to keep working with the HTML elements, coming from AJAX
  // respons
  $(document).on("click", "#sorting-options a", function (e) {
    if ($(this).attr("data-sort")) {
      $("form.searchPage input[name='sort_on']").val($(this).attr("data-sort"));
    } else {
      $("form.searchPage input[name='sort_on']").val("");
    }
    if ($(this).attr("data-sort_order")) {
      $("form.searchPage input[name='sort_order']").val($(this).attr("data-sort_order"));
    } else {
      $("form.searchPage input[name='sort_order']").val("");
    }
    // query = this.search.split('?')[1];
    query = generateQuery();
    $("#search-results").pullSearchResults(query);
    pushState(query);
    e.preventDefault();
  });

  // Handle clicks in the batch navigation bar. Load those with Ajax as
  // well.
  $(document).on("click", "#search-results nav.pagination a", function (e) {
    e.preventDefault();
    var queryString = this.search.split("?")[1];
    var b_start = "";
    var batchStr = "b_start:int=";
    if (queryString.length > 0) {
      b_start = queryString.split("&").reduce(function (acc, field) {
        if (field.indexOf(batchStr) === 0) {
          return field.substr(batchStr.length);
        }
        return acc;
      }, 0);
    }
    query = generateQuery();
    if (b_start.length) {
      query += "&b_start:int=" + parseInt(b_start, 10);
    }
    // query["b_start:int"] = parseInt(b_start, 10);
    $("#search-results").pullSearchResults(query);
    pushState(query);
  });

  // Handle clicks for tabs. Load those with Ajax like sorting options
  $(document).on("click", "#tab-options a", function (e) {
    e.preventDefault();
    if ($(this).attr("data-tab")) {
      $("form.searchPage input[name='filter_tab']").val($(this).attr("data-tab"));
    } else {
      $("form.searchPage input[name='filter_tab']").val("all");
    }
    query = generateQuery();
    $("#search-results").pullSearchResults(query);
    pushState(query);
  });

  // Handle clicks for remove filters link. updates form an query with Ajax like sorting options.
  $(document).on("click", "a.linkRemoveFilters", function (e) {
    $(this).parent().find("input:checked").each(function () {
      $(this).attr("checked", false);
    });
    if ($(this).attr("class").indexOf("linkRemoveFilters") >= 0) {
      $(this).parent().remove();
    }
    // query = $('form.searchPage').serialize();
    query = generateQuery();
    $("#search-results").pullSearchResults(query);
    pushState(query);
    e.preventDefault();
  });

  // MLT - preso da rer.solr
  var spinner = $('<img src="/++plone++rer.sitesearch/images/loader.gif">');

  function reset_solr_mlt() {
    $(".solr_result_item .solrMLTPlaceHolder").fadeOut(500).html("").show();
    $(".solr_result_item .solrMLTHideTarget:hidden").show();
    $("a.more_like_this:hidden").show();
  }

  function init_rersolr_mlt() {
    function init_rersolr_mlt_link(idx, el) {
      var el_obj = $(el);
      var container_li = el_obj.parents(".solr_result_item");
      var mlt_url = $(this).attr("href");

      function present_mlt(event) {
        reset_solr_mlt();
        var spinner_clone = spinner.clone();
        el_obj.append(spinner_clone);
        event.preventDefault();
        $.ajax({
          url: mlt_url,
          data: {
            ajax_include_head: "1",
            ajax_load: "1"
          },
          success: function success(data) {
            container_li.find(".solrMLTHideTarget").hide();
            container_li.find(".solrMLTPlaceHolder").hide().html($("#content-more-like-this", data).html()).fadeIn(500);
            spinner_clone.remove();
            el_obj.hide();
          },
          error: function error() {
            spinner_clone.remove();
          }
        });
      }
      $(el).click(present_mlt);
    }
    $("a.more_like_this").each(init_rersolr_mlt_link);
    // $('#search-results').delegate('a.more_like_this' ...
  }

  $(document).ready(init_rersolr_mlt);

  // Expand / collapse filters on mobile
  $(document).on("click", "#search-filter button.refineSearch", function () {
    $("#search-results-wrapper .search-filters").slideToggle("fast");
    $("#search-filter button.refineSearch").toggleClass("open");
    $("#search-filter button.refineSearch").attr("aria-expanded", $("#search-filter button.refineSearch").attr("aria-expanded") === "false");
  });
});

define("rer/sitesearch/browser/static/sitesearch.js", function () {});

//# sourceMappingURL=sitesearch-compiled.js.map
//# sourceMappingURL=sitesearch-compiled.js.map
