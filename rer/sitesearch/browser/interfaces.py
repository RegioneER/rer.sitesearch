from zope.interface import Interface

class IRerSiteSearch(Interface):
    """Interface for SiteSearchView"""
    
    def getUids(results):
        """
        """
    
    def getDividedResults(results):
        
        """Retrieves a dictionary of lists of results divided by type, ordered by ModificationDate
        """

    def getTaxonomies(uids):
        """
        """
    
    def getAdditionalIndexesList(uids):
        """
        check if rer.keywordsearch is installed
        """
    
    def showSubjects():
        """
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
    
    def getQueryString(request_dict):
        """
        Return the query string for RSS pourpose
        """
    
    