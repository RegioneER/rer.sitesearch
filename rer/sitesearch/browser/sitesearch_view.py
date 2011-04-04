from Products.Five.browser import BrowserView
from Products.CMFCore.utils import getToolByName
from zope.interface import implements
from rer.sitesearch.browser.interfaces import IRerSiteSearch
from urllib import urlencode

class RerSiteSearchView(BrowserView):
    
    implements(IRerSiteSearch)
    
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
        divided_results['all']={'title':self.translation_service.utranslate(msgid="label_all",
                                                                       domain='plone',
                                                                       default="All",
                                                                       context=self.context),
                                'id':'all',
                                'results':[],}
        for result in results:
            result_type=result.portal_type
            divided_results['all']['results'].append(result)
            if result_type not in tabs:
                continue
            if result_type == 'Structured Document':
                result_type='Document'
            type_id=result_type.lower().replace(' ','-')
            if divided_results.has_key(type_id):
                l = divided_results[type_id]['results']
                l.append(result)
                divided_results[type_id]['results'] = l
            else:
                portal_type=pt.getTypeInfo(result_type).Title()
                title=self.translation_service.utranslate(msgid=portal_type,
                                                          domain='plone',
                                                          default=portal_type,
                                                          context=self.context)
                divided_results[type_id] = {'title':title,
                                                'id':type_id,
                                                'results':[]}
                l = divided_results[type_id]['results']
                l.append(result)
                divided_results[type_id]['results'] = l
                
        return divided_results

    def getAdditionalIndexesList(self,uids):
        """
        check if rer.keywordsearch is installed
        """
        additional_indexes_settings=self.getAdditionalIndexesSettings()
        if not additional_indexes_settings:
            return {}
        additional_indexes_elements={}
        for keyword in additional_indexes_settings['indexes']:
            key_info=keyword.split('|')
            index_title=self.translation_service.utranslate(msgid=key_info[1],
                                                            domain='rer.keywordsearch',
                                                            default=key_info[1],
                                                            context=self.context)
            additional_indexes_elements[index_title]={'index_name':key_info[0],
                                           'indexes_list':self.getKeywordList(uids,key_info[0],additional_indexes_settings['whitelist'])}
        return additional_indexes_elements
    
    def showSubjects(self):
        additional_indexes_settings=self.getAdditionalIndexesSettings()
        if not additional_indexes_settings:
            return True
        for keyword in additional_indexes_settings['indexes']:
            key_info=keyword.split('|')
            if key_info[0] == 'Subject':
                return False
        return True
            
            
    def getAdditionalIndexesSettings(self):
        
        portal_quickinstaller= getToolByName(self.context,'portal_quickinstaller')
        portal_properties = getToolByName(self.context, 'portal_properties')
        rer_properties = getattr(portal_properties, 'rer_properties')
        if not rer_properties:
            return {}
        if not rer_properties.getProperty('indexes_in_search',()) and not portal_quickinstaller.isProductInstalled('rer.keywordsearch'):
            return {}
            
        if rer_properties.getProperty('indexes_in_search',()):
            keywords=rer_properties.getProperty('indexes_in_search',())
        else:
            keywords=rer_properties.getProperty('keywordview_properties',())
        
        whitelist=rer_properties.getProperty('type_whitelist',())
        return {'indexes':keywords,
                'whitelist':whitelist}
        
    def getKeywordList(self,uids,index_name,white_list=()):
        catalog = getToolByName(self.context, 'portal_catalog')
        try:
            allValues = catalog.uniqueValuesFor(index_name)
        except KeyError:
            return []
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
    
    def setTabUrl(self,template_id,tab_id):
        new_request=self.context.REQUEST.form.copy()
        new_request['selected_tab']=tab_id
        if new_request.has_key('b_start'):
             del new_request['b_start']
        query_string=self.getQueryString(new_request)
        
        return '%s/%s?%s' %(self.context.absolute_url(),template_id,query_string)
    
    def getTabClass(self,current_block_id,tab_ids,selected_tab,isFirst=None):
        if not self.context.REQUEST.form.has_key('selected_tab'):
            if isFirst:
                return 'linetab groupSelected'
            return 'linetab'
        selected_tab=self.context.REQUEST.form.get('selected_tab')
        if selected_tab not in tab_ids:
            if isFirst:
                self.context.REQUEST.form['selected_tab']=current_block_id
                return 'linetab groupSelected'
            return 'linetab'
        if selected_tab == current_block_id:
                return 'linetab groupSelected'
        return 'linetab'
        
    def getFolderName(self,path):
        return self.context.unrestrictedTraverse(path).Title()
    
    def getQueryString(self,request_dict):
        return urlencode(request_dict,True)