from Products.Five.browser import BrowserView
from Products.CMFCore.utils import getToolByName

class ResultsDivision(BrowserView):
    
    def __init__(self,context,request):
        self.context=context
        self.translation_service=getToolByName(self.context,'translation_service')
        
    def getUids(self,results):
        return [x.UID for x in results]
    
    def getDividedResults(self,results):
        
        """Retrieves a dictionary of lists of results divided by type, ordered by ModificationDate
        """
        pt= getToolByName(self.context,'portal_types')
        
        tabs=['Document','File','News Item','Event','Link','Structured Document', 'FolderTaxonomy']
        divided_results = {}
        divided_results['All']={'title':self.translation_service.utranslate(msgid="label_all",
                                                                       domain='plone',
                                                                       default="All",
                                                                       context=self.context),
                                'id':'all',
                                'results':[],}
        for result in results:
#            if self.request.has_key('getSiteAreas'):
#                if result.getSiteAreas != self.request.get('getSiteAreas'):
#                    continue 
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
                title=self.translation_service.utranslate(msgid=portal_type,
                                                          domain='plone',
                                                          default=portal_type,
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

    def getTaxonomies(self,uids):
        catalog = getToolByName(self.context, 'portal_catalog')
        taxonomy_uids=self.getKeywordList(uids,'getSiteAreas')
        taxonomies=catalog(portal_type="FolderTaxonomy",UID=taxonomy_uids)
        list_results={}
        for res in taxonomies:
            list_results[res.Title]=res.UID
        return list_results
    
    def getFacetedList(self,uids):
        """
        check if rer.keywordsearch is installed
        """
        faceted_settings=self.getFacetedSettings()
        if not faceted_settings:
            return {}
        faceted_elements={}
        for keyword in faceted_settings['indexes']:
            key_info=keyword.split('|')
            index_title=self.translation_service.utranslate(msgid=key_info[1],
                                                            domain='rer.keywordsearch',
                                                            default=key_info[1],
                                                            context=self.context)
            faceted_elements[index_title]={'index_name':key_info[0],
                                           'indexes_list':self.getKeywordList(uids,key_info[0],faceted_settings['whitelist'])}
        return faceted_elements
    
    def showSubjects(self):
        faceted_settings=self.getFacetedSettings()
        if not faceted_settings:
            return True
        for keyword in faceted_settings['indexes']:
            key_info=keyword.split('|')
            if key_info[0] == 'Subject':
                return False
        return True
            
            
    def getFacetedSettings(self):
        portal_quickinstaller= getToolByName(self.context,'portal_quickinstaller')
        if not portal_quickinstaller.isProductInstalled('rer.keywordsearch'):
            return ()
        portal_properties = getToolByName(self.context, 'portal_properties')
        rer_properties = getattr(portal_properties, 'rer_properties')
        if not rer_properties:
            return {}
        if rer_properties.getProperty('indexes_in_search',()):
            keywords=rer_properties.getProperty('indexes_in_search',())
        else:
            if not rer_properties.hasProperty('keywordview_properties'):
                return {}
            keywords=rer_properties.getProperty('keywordview_properties',())
        whitelist=rer_properties.getProperty('type_whitelist',())
        return {'indexes':keywords,
                'whitelist':whitelist}
        
    def getKeywordList(self,uids,index_name,white_list=()):
        catalog = getToolByName(self.context, 'portal_catalog')
        allValues = catalog.uniqueValuesFor(index_name)
        # BBB: there is a better way to do this, istead of making many query as we find
        # different values?
        final_results = []
        for kw in allValues:
            params = {index_name: kw,
                      'UID':uids,
                      'sort_on':'sortable_title'}
            if white_list:
                params['portal_type']=white_list
            results = catalog(**params)
            if results:
                final_results.append(kw)
        return final_results