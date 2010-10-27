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
    
    def getFacetedList(uids):
        """
        check if rer.keywordsearch is installed
        """
    
    def showSubjects():
        """
        """
            
            
    def getFacetedSettings():
        """
        """
        
    def getKeywordList(uids,index_name,white_list):
        """
        
        """
    
    def getClass(current_block_id,isFirst):
        """
        Return the current class of the tabs
        """
    
    def getFolderName(path):
        """
        Return the folder name
        """
    
    def getQueryString():
        """
        Return the query string for RSS pourpose
        """
    
    