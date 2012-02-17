from Products.Five.browser import BrowserView
from Products.CMFCore.utils import getToolByName
from zope.interface import implements
from rer.sitesearch.browser.interfaces import IRerSiteSearch
from urllib import urlencode
from DateTime import DateTime
from ZPublisher.HTTPRequest import record

class RerSiteSearchView(BrowserView):
    
    implements(IRerSiteSearch)
    
    def __init__(self,context,request):
        self.context=context
        self.translation_service=getToolByName(self.context,'translation_service')
        self.portal_properties = getToolByName(self.context, 'portal_properties')
        self.rer_properties = getattr(self.portal_properties, 'rer_properties',None)
        self.tabs_dict=self.setTabsDict()
        
    def getUids(self,results):
        """
        Return a list of uids for given results
        """
        return [x.UID for x in results]
    
    def setTabsDict(self):
        """
        Set the starting dict with all the infos about tabs and results
        """
        tabs_dict={'tabs_order':['all'],
                   'types_map':{},
                   'all':{'id':'all',
                          'title':"All",
                          'results':[]},
                   }
        if self.rer_properties:
            for elem in self.rer_properties.getProperty('tabs_list',()):
                values=elem.split('|')
                if len(values)==2:
                    tab_name=values[1].lower().replace(' ','-')
                    tabs_dict['types_map'][values[0]]=tab_name
                    if not tabs_dict.get(tab_name,{}):
                        tabs_dict[tab_name]={'id':tab_name,
                                             'portal_types':[values[0]],
                                             'title':values[1],
                                             'results':[]}
                    else:
                        tabs_dict[tab_name].get('portal_types',[]).append(values[1])
                    if tab_name not in tabs_dict['tabs_order']:
                        tabs_dict['tabs_order'].append(tab_name)
        return tabs_dict
    
    def getDividedResults(self,results):
        """
        Retrieves a dictionary of lists of results divided by type, ordered by serarchResults
        """
        for result in results:
            result_type=result.portal_type
            type_id=self.tabs_dict['types_map'].get(result_type,'')
            self.tabs_dict['all']['results'].append(result)
            if not type_id:
                continue
            self.tabs_dict[type_id]['results'].append(result)
        return self.tabs_dict

    def getAdditionalIndexesList(self,uids):
        """
        check if rer.keywordsearch is installed
        """
        additional_indexes_settings=self.additional_indexes_settings
        if not additional_indexes_settings:
            return {}
        additional_indexes_elements=[]
        for keyword in additional_indexes_settings['indexes']:
            key_info=keyword.split('|')
            index_title=self.translation_service.utranslate(msgid=key_info[1],
                                                            domain='rer.keywordsearch',
                                                            default=key_info[1],
                                                            context=self.context)
            additional_indexes_elements.append({'index_title':index_title,
                                                'index_name':key_info[0],
                                                'indexes_list':self.getKeywordList(uids,key_info[0],additional_indexes_settings['whitelist'])})
        return additional_indexes_elements
    
    def showSubjects(self):
        """
        Subject is the default index in the left column.
        If Subject is in additional_indexes, don't show default subject section
        """
        additional_indexes_settings=self.additional_indexes_settings
        if not additional_indexes_settings:
            return True
        for keyword in additional_indexes_settings['indexes']:
            key_info=keyword.split('|')
            if key_info[0] == 'Subject':
                return False
        return True
            
    @property   
    def additional_indexes_settings(self):
        portal_quickinstaller= getToolByName(self.context,'portal_quickinstaller')
        if not self.rer_properties:
            return {}
#        if not self.rer_properties.getProperty('indexes_in_search',()) and not portal_quickinstaller.isProductInstalled('rer.keywordsearch'):
#            return {}
            
        if self.rer_properties.getProperty('indexes_in_search',()):
            keywords=self.rer_properties.getProperty('indexes_in_search',())
        else:
            keywords=self.rer_properties.getProperty('keywordview_properties',())
        
        whitelist=self.rer_properties.getProperty('type_whitelist',())
        hiddenlist=self.rer_properties.getProperty('indexes_hiddenlist',())
        return {'indexes':keywords,
                'whitelist':whitelist,
                'hiddenlist':hiddenlist}
        
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
        folder=self.context.unrestrictedTraverse(path,None)
        if folder:
            return folder.Title()
        else:
            return path
    
    def getHiddenIndexes(self):
        hiddenlist=self.additional_indexes_settings.get('hiddenlist',[])
        request_keys=self.context.REQUEST.form.keys()
        hidden_dict={'index_titles':[],
                     'indexes_to_add':[]}
        if not hiddenlist:
            return hidden_dict
        for hidden_index in hiddenlist:
            index_info=hidden_index.split('|')
            index=index_info[0]
            if index not in request_keys:
                continue
            if len(index_info) == 1:
                hidden_dict['index_titles'].append(index_info[0])
            else:
                hidden_dict['index_titles'].append(index_info[1])
            index_id=index
            index_value=self.context.REQUEST.form[index]
            if isinstance(index_value,record):
                for query_part in index_value.keys():
                    index_id="%s.%s:record" %(index,query_part)
                    query_value=index_value[query_part]
                    if isinstance(query_value,list):
                        index_id += ":list"
                        for value_item in query_value:
                            if isinstance(value_item,DateTime):
                                index_id +=":date"
                                list_value=value_item.ISO()
                                hidden_dict['indexes_to_add'].append({'id':index_id,
                                                       'value':list_value})
                            else:
                                hidden_dict['indexes_to_add'].append({'id':index_id,
                                                       'value':query_value})
                    else:
                        hidden_dict['indexes_to_add'].append({'id':index_id,
                                               'value':query_value})
            else:
                hidden_dict['indexes_to_add'].append({'id':index_id,
                                       'value':index_value})
        return hidden_dict
    
    def getQueryString(self,request_dict):
        return urlencode(request_dict,True)
