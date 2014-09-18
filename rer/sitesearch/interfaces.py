# -*- coding: utf-8 -*-
from zope.interface import Interface
from zope import schema

from rer.sitesearch import sitesearchMessageFactory as _
from rer.sitesearch.custom_fields import ITabsValueField, IIndexesValueField, PersistentObject


class IRERSiteSearchGeneralSettings(Interface):
    """Settings used in the control panel for sitesearch: General settings
    """

    max_word_len = schema.Int(
            title=_(u'Maximum number of characters in a single word'),
            description=_('help_max_word_len',
                          default=u"Set what is the maximum length of a single search word. Longer words will be omitted from the search."),
            default=128,
            required=False,
        )

    max_words = schema.Int(
            title=_(u'Maximum number of words in search query'),
            description=_('help_max_words',
                          default=u"Set what is the maximum number of words in the search query. The other words will be omitted from the search."),
            default=32,
            required=False,
        )

    solr_search_enabled = schema.Bool(
            title=_(u'Enable search with SOLR'),
            description=_('help_solr_search_enabled',
                          default=u"If enabled and collective.solr is correctly set, SOLR search engine will be used instead Plone catalog."),
            required=False,
        )


class IRERSiteSearchTabsSettings(Interface):
    """Settings used in the control panel for sitesearch: Tab list
    """

    tabs_mapping = schema.Tuple(
            title=_(u'Search tabs'),
            description=_('help_tabs_mapping',
                          default=u"Insert a list of tabs to show on search results. Each tab can contain different content_types."),
            value_type=PersistentObject(ITabsValueField, title=_(u"Search tab")),
            required=False,
            default=(),
            missing_value=()
        )

    tabs_order = schema.Tuple(
            title=_(u'Tabs order'),
            description=_('help_tabs_order',
                          default=u"Select the tabs that you want to show in the search and define an order."),
            value_type=schema.Choice(vocabulary=u"rer.sitesearch.vocabularies.SearchTabsVocabulary"),
            required=False,
            default=("All",),
            missing_value=()
        )


class IRERSiteSearchIndexesSettings(Interface):
    """Settings used in the control panel for sitesearch: Indexes to show
    """

    available_indexes = schema.Tuple(
            title=_(u'Indexes for search'),
            description=_('help_sitesearch_available_indexes',
                          default=u"Insert a list of indexes that should be used for faceted navigation."),
            value_type=PersistentObject(IIndexesValueField, title=_(u"Index in search")),
            required=False,
            default=(),
            missing_value=()
        )

    indexes_order = schema.Tuple(
            title=_(u'Indexes order'),
            description=_('help_indexes_order',
                          default=u"Select the indexes that you want to show for faceted navigation. You can define also the order. \"All\" tab shows all results."),
            value_type=schema.Choice(vocabulary=u"rer.sitesearch.vocabularies.SearchIndexesVocabulary"),
            required=False,
            default=("Subject",),
            missing_value=()
        )


class IRERSiteSearchHiddensIndexesSettings(Interface):
    """Settings used in the control panel for sitesearch: Hidden indexes
    """

    hidden_indexes = schema.Tuple(
            title=_(u'Hidden indexes'),
            description=_('help_sitesearch_hidden_indexes',
                          default=u"Insert a list of indexes that can't be used for faceted search, but we need to keep."),
            value_type=PersistentObject(IIndexesValueField, title=_(u"Hidden indexes")),
            required=False,
            default=(),
            missing_value=()
        )


class IRERSiteSearchSettings(IRERSiteSearchGeneralSettings, IRERSiteSearchTabsSettings, IRERSiteSearchIndexesSettings, IRERSiteSearchHiddensIndexesSettings):
    """
    Settings for Sitesearch
    """
