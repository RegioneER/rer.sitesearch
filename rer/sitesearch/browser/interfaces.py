from zope.interface import Interface

class IRerSiteSearch(Interface):
    """Interface for SiteSearchView"""
    
    def getUids(results):
        """
        Return a list of uids for given results
        """
    
    def setTabsDict():
        """
        Set the starting dict with all the infos about tabs and results
        """
    
    def getDividedResults(results):
        """
        Retrieves a dictionary of lists of results divided by type, ordered by serarchResults
        """
    
    def getAdditionalIndexesList(uids):
        """
        check if rer.keywordsearch is installed
        """
    
    def showSubjects():
        """
        Subject is the default index in the left column.
        If Subject is in additional_indexes, don't show default subject section
        """
            
    def getAdditionalIndexesSettings():
        """
        """
        
    def getKeywordList(uids,index_name,white_list):
        """
        
        """
    
    def setTabUrl(template_id,tab_id):
        """
        """
        
    def getTabClass(current_block_id,tab_ids,selected_tab,isFirst):
        """
        Return the current class of the tabs
        """
        
    def getFolderName(path):
        """
        Return the folder name
        """
    
    def getHiddenIndexes():
        """
        """
    
    def getQueryString(request_dict):
        """
        Return the query string for RSS pourpose
        """
    
    