from zope.interface import Interface
from zope import schema
from rer.sitesearch import sitesearchMessageFactory as _


class IRerSiteSearch(Interface):
    """Interface for SiteSearchView"""

    def getDividedResults(results):
        """
        Retrieves a dictionary of lists of results divided by type, ordered by serarchResults
        """

    def setTabUrl(template_id, tab_id):
        """
        Set the right tab url
        """

    def getTabClass(current_block_id, tab_ids, selected_tab, isFirst):
        """
        Return the current class of the tabs
        """

    def getFolderName(path):
        """
        Return folder Title, if exist
        """

    def getHiddenIndexes():
        """
        Return a list of hidden indexes to insert in the query
        """

    def getQueryString(request_dict):
        """
        Return the query string for RSS pourpose
        """

    def getFirstAvailableTab():
        """
        Return the first populated tab with results
        """


class IRerSiteSearchSettingsForm(Interface):
    """
    Marker interface
    """


class IRerSiteSearchSettings(Interface):
    """Interface for SiteSearch properties"""

    tabs_list  = schema.Text(
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
