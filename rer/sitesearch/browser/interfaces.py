from zope.interface import Interface
from zope import schema
from rer.sitesearch import sitesearchMessageFactory as _
from plone.app.layout.globals.interfaces import IViewView


class IRERSiteSearchLayer(Interface):
    """A layer specific for rer.sitesearch
    """


class IRerSiteSearch(IViewView):
    """Interface for SiteSearchView"""


class IRerSiteSearchSettingsForm(Interface):
    """
    Marker interface
    """


class IRerSiteSearchSettings(Interface):
    """Interface for SiteSearch properties"""

    tabs_list = schema.Text(
        title=_('tabs_list_label',
                default=u'Tabs list'),
        required=False,
        description=_('tabs_list_help',
                      default=u'Insert a list of tabs to divide results. One per row. Every row should have a couple of portal_type and title divided by "pipe" character. For example "Document|Documents". You can also group some types using the same title.'),
    )
    indexes_in_search = schema.Text(
        title=_('indexes_in_search_label',
                default=u'Indexes in search'),
        required=False,
        description=_('indexes_in_search_help',
                      default=u'Insert a list of indexes to show in search results column. One per row. Every row should have a couple of index and title divided by "pipe" character. For example "Subject|Category"'),
    )

    indexes_hiddenlist = schema.Text(
        title=_('indexes_hiddenlist_label',
                default=u'Hidden indexes'),
        required=False,
        description=_('indexes_hiddenlist_help',
                      default=u'Insert a list of indexes that are not shown in the column, but need to be set in request. One per row. Every row should have a couple of index and title divided by "pipe" character. For example "Subject|Category"'),
    )
