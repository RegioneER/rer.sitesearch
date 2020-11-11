# -*- coding: utf-8 -*-
from zope.interface import Interface
from zope import schema
from zope.schema import SourceText
from rer.sitesearch import _


class IRERSiteSearchGeneralSettings(Interface):
    """Settings used in the control panel for sitesearch: General settings
    """

    max_word_len = schema.Int(
        title=_(u"Maximum number of characters in a single word"),
        description=_(
            "help_max_word_len",
            default=u"Set what is the maximum length of a single search word. Longer words will be omitted from the search.",
        ),
        default=128,
        required=False,
    )

    max_words = schema.Int(
        title=_(u"Maximum number of words in search query"),
        description=_(
            "help_max_words",
            default=u"Set what is the maximum number of words in the search query. The other words will be omitted from the search.",
        ),
        default=32,
        required=False,
    )

    solr_search_enabled = schema.Bool(
        title=_(u"Enable search with SOLR"),
        description=_(
            "help_solr_search_enabled",
            default=u"If enabled and collective.solr is correctly set, SOLR search engine will be used instead Plone catalog.",
        ),
        required=False,
    )


class IRERSiteSearchTabsSettings(Interface):
    """Settings used in the control panel for sitesearch: Tab list
    """

    tabs_mapping = SourceText(
        title=_(u"Search tabs"),
        description=_(
            "help_tabs_mapping",
            default=u"Insert a list of tabs to show on search results. Each tab can contain different content_types.",
        ),
        required=False,
        default=u"",
    )


class IRERSiteSearchIndexesSettings(Interface):
    """Settings used in the control panel for sitesearch: Indexes to show
    """

    available_indexes = SourceText(
        title=_(u"Indexes for search"),
        description=_(
            "help_sitesearch_available_indexes",
            default=u"Insert a list of indexes that should be used for faceted navigation.",
        ),
        required=False,
        default=u"",
    )


class IRERSiteSearchSettings(
    IRERSiteSearchGeneralSettings,
    IRERSiteSearchTabsSettings,
    IRERSiteSearchIndexesSettings,
):
    """
    Settings for Sitesearch
    """
