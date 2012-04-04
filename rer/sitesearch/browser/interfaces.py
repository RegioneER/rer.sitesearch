from zope.interface import Interface


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
