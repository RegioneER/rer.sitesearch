# -*- coding: utf-8 -*-
from collective.z3cform.datagridfield.registry import DictRow
from zope.interface import Interface
from zope import schema

from rer.sitesearch import sitesearchMessageFactory as _

FOLDER_TYPES_VALUESTYPE = schema.Choice(
    vocabulary=u"plone.app.vocabularies.ReallyUserFriendlyTypes"
)


class ITabsValueField(Interface):
    tab_title = schema.ASCIILine(
        title=_("sitesearch_tab_title", default=u"Tab title"),
        description=_(
            "sitesearch_tab_title_help",
            default=u"Insert a title for this tab. You can provide translations for this title with a proper translation file for rer.sitesearch domain.",
        ),
        required=True,
    )
    portal_types = schema.Tuple(
        title=_("sitesearch_tab_portal_types", default=u"Portal types"),
        description=_(
            "sitesearch_tab_portal_types_help",
            default=u'Select which portal_types shows on this tab.',
        ),
        required=True,
        value_type=FOLDER_TYPES_VALUESTYPE,
    )


class IIndexesValueField(Interface):
    index_title = schema.ASCIILine(
        title=_("sitesearch_index_title", default=u"Index title"),
        description=_(
            "sitesearch_index_title_help",
            default=u"Insert a title for this search filter. You can provide translations for this title with a proper translation file for rer.sitesearch domain.",
        ),
        required=True,
    )
    index = schema.Choice(
        title=_(
            "sitesearch_allowable", default=u"Allowable indexes in catalog"
        ),
        description=_("sitesearch_allowable_help", default=u'Select an index.'),
        required=True,
        vocabulary=u"rer.sitesearch.vocabularies.IndexesVocabulary",
    )


class IRERSiteSearchGeneralSettings(Interface):
    """Settings used in the control panel for sitesearch: General settings
    """

    max_word_len = schema.Int(
        title=_(u'Maximum number of characters in a single word'),
        description=_(
            'help_max_word_len',
            default=u"Set what is the maximum length of a single search word. Longer words will be omitted from the search.",
        ),
        default=128,
        required=False,
    )

    max_words = schema.Int(
        title=_(u'Maximum number of words in search query'),
        description=_(
            'help_max_words',
            default=u"Set what is the maximum number of words in the search query. The other words will be omitted from the search.",
        ),
        default=32,
        required=False,
    )

    solr_search_enabled = schema.Bool(
        title=_(u'Enable search with SOLR'),
        description=_(
            'help_solr_search_enabled',
            default=u"If enabled and collective.solr is correctly set, SOLR search engine will be used instead Plone catalog.",
        ),
        required=False,
    )


class IRERSiteSearchTabsSettings(Interface):
    """Settings used in the control panel for sitesearch: Tab list
    """

    tabs_mapping = schema.List(
        title=_(u'Search tabs'),
        description=_(
            'help_tabs_mapping',
            default=u"Insert a list of tabs to show on search results. Each tab can contain different content_types.",
        ),
        value_type=DictRow(title=_(u"Search tab"), schema=ITabsValueField),
        required=False,
        default=[],
        missing_value=[],
    )

    tabs_order = schema.Tuple(
        title=_(u'Tabs order'),
        description=_(
            'help_tabs_order',
            default=u"Select the tabs that you want to show in the search and define an order.",
        ),
        value_type=schema.Choice(
            vocabulary=u"rer.sitesearch.vocabularies.SearchTabsVocabulary"
        ),
        required=False,
        default=("All",),
        missing_value=(),
    )


class IRERSiteSearchIndexesSettings(Interface):
    """Settings used in the control panel for sitesearch: Indexes to show
    """

    available_indexes = schema.List(
        title=_(u'Indexes for search'),
        description=_(
            'help_sitesearch_available_indexes',
            default=u"Insert a list of indexes that should be used for faceted navigation.",
        ),
        value_type=DictRow(
            title=_(u"Index in search"), schema=IIndexesValueField
        ),
        required=False,
        default=[],
        missing_value=[],
    )

    indexes_order = schema.Tuple(
        title=_(u'Indexes order'),
        description=_(
            'help_indexes_order',
            default=u"Select the indexes that you want to show for faceted navigation. You can define also the order. \"All\" tab shows all results.",
        ),
        value_type=schema.Choice(
            vocabulary=u"rer.sitesearch.vocabularies.SearchIndexesVocabulary"
        ),
        required=False,
        default=("Subject",),
        missing_value=(),
    )


class IRERSiteSearchHiddensIndexesSettings(Interface):
    """Settings used in the control panel for sitesearch: Hidden indexes
    """

    hidden_indexes = schema.List(
        title=_(u'Hidden indexes'),
        description=_(
            'help_sitesearch_hidden_indexes',
            default=u"Insert a list of indexes that can't be used for faceted search, but we need to keep.",
        ),
        value_type=DictRow(
            title=_(u"Hidden indexes"), schema=IIndexesValueField
        ),
        required=False,
        default=[],
        missing_value=[],
    )


class IRERSiteSearchSettings(
    IRERSiteSearchGeneralSettings,
    IRERSiteSearchTabsSettings,
    IRERSiteSearchIndexesSettings,
    IRERSiteSearchHiddensIndexesSettings,
):
    """
    Settings for Sitesearch
    """
