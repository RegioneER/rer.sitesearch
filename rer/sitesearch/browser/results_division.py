from Products.Five.browser import BrowserView
from Products.CMFCore.utils import getToolByName

class ResultsDivision(BrowserView):
        
    def __init__(self, context, request):
        BrowserView.__init__(self, context, request)

    
    def getDividedResults(self,results):
        
        """Retrieves a dictionary of lists of results divided by type, ordered by ModificationDate
        """
        translation_service=getToolByName(self.context,'translation_service')
        pt= getToolByName(self.context,'portal_types')
        
        tabs=['Document','File','News Item','Event','Link','Structured Document', 'FolderTaxonomy']
        divided_results = {}
        divided_results['All']={'title':translation_service.utranslate(msgid="label_all",
                                                                       domain='plone',
                                                                       default="All",
                                                                       context=self.context),
                                'id':'all',
                                'results':[],}
        for result in results:
            result_type=result.portal_type
            divided_results['All']['results'].append(result)
            if result_type not in tabs:
                continue
            if result.portal_type == 'Structured Document':
                result_type='Document'
            if divided_results.has_key(result_type):
                l = divided_results[result_type]['results']
                l.append(result)
                divided_results[result_type]['results'] = l
            else:
                portal_type=pt.getTypeInfo(result_type).Title()
                title=translation_service.utranslate(msgid=portal_type,
                                                     domain='plone',
                                                     context=self.context)
                divided_results[result_type] = {'title':title,
                                                'id':portal_type.lower().replace(' ','-'),
                                                'results':[]}
                l = divided_results[result_type]['results']
                l.append(result)
                divided_results[result_type]['results'] = l
#        for key in divided_results.keys():
#            divided_results[key]['results'].sort(lambda y, x: cmp(x.ModificationDate , y.ModificationDate))
                
        return divided_results
