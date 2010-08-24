from Products.Five.browser import BrowserView

class ResultsDivision(BrowserView):
        
    def __init__(self, context, request):
        BrowserView.__init__(self, context, request)

    
    def getDividedResults(self,results):
        """Retrieves a dictionary of lists of results divided by type, ordered by ModificationDate
        """
        
        divided_results = {}
         
        for result in results:
            if divided_results.has_key(result.portal_type):
                l = divided_results[result.portal_type]
                l.append(result)
                divided_results[result.portal_type] = l
            else:
                divided_results[result.portal_type] = []
                l = divided_results[result.portal_type]
                l.append(result)
                divided_results[result.portal_type] = l
             
        for key in divided_results.keys():
            divided_results[key].sort(lambda y, x: cmp(x.ModificationDate , y.ModificationDate))
                
        return divided_results
