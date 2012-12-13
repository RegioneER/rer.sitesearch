from Products.Five.browser import BrowserView
from Products.CMFCore.utils import getToolByName
from zope.interface import implements
from rer.sitesearch.browser.interfaces import IRerSiteSearch
from urllib import urlencode
from DateTime import DateTime
from ZPublisher.HTTPRequest import record
from zope.i18n import translate


class RerSiteSearchView(BrowserView):

    implements(IRerSiteSearch)

    def __init__(self, context, request):
        self.context = context
        self.request = request
        self.translation_service = getToolByName(self.context, 'translation_service')
        self.portal_properties = getToolByName(self.context, 'portal_properties')
        self.rer_properties = getattr(self.portal_properties, 'rer_properties', None)
        self.tabs_dict = self.setTabsDict()

    def setTabsDict(self):
        """
        Set the starting dict with all the infos about tabs and results
        """
        additional_indexes_settings = self.additional_indexes_settings
        subject_label = self.translation_service.utranslate(msgid='label_category',
                                                              domain='rer.keywordsearch',
                                                              default='Category',
                                                              context=self.context)
        tabs_dict = {'tabs_order': [],
                     'uids': [],
                     'indexes_dict': {'indexes_order': additional_indexes_settings.get('indexes_order', []),
                                      'Subject': {'title': subject_label,
                                                  'indexes': []},
                                     },
                     'types_map': {},
                     'all': {'id': 'all',
                             'title': "All",
                             'results': []},
                   }
        if self.rer_properties:
            for elem in self.rer_properties.getProperty('tabs_list', ()):
                values = elem.split('|')
                if len(values) == 2:
                    tab_name = values[1].lower().replace(' ', '-')
                    tabs_dict['types_map'][values[0]] = tab_name
                    if not tabs_dict.get(tab_name, {}):
                        tabs_dict[tab_name] = {'id': tab_name,
                                             'portal_types': [values[0]],
                                             'title': values[1],
                                             'results': []}
                    else:
                        tabs_dict[tab_name].get('portal_types', []).append(values[0])
                    if tab_name not in tabs_dict['tabs_order']:
                        tabs_dict['tabs_order'].append(tab_name)
        tabs_dict['tabs_order'].append('all')
        return tabs_dict

    def getDividedResults(self, results):
        """
        Retrieves a dictionary of lists of results divided by type, ordered by serarchResults
        """
        active_tab = self.context.REQUEST.form.get('selected_tab', '')
        for result in results:
            result_type = result.portal_type
            type_id = self.tabs_dict['types_map'].get(result_type, '')
            self.tabs_dict['all']['results'].append(result)
            if type_id:
                self.tabs_dict[type_id]['results'].append(result)
            if self.tabs_dict['types_map'].get(result_type, '') == active_tab or active_tab == 'all' or not active_tab:
                self.setIndexesListForItem(result)
        return self.tabs_dict

    def setIndexesListForItem(self, brain):
        """
        Update results dict with indexes values of the given brain
        """
        indexes_dict = self.tabs_dict.get('indexes_dict', {})
        self.updateIndexesList(brain.Subject, 'Subject')
        additional_indexes_settings = self.additional_indexes_settings
        if not additional_indexes_settings:
            return {}
        for keyword in additional_indexes_settings['indexes']:
            key_info = keyword.split('|')
            index_id = key_info[0]
            index_title = key_info[1]
            brain_value = getattr(brain, key_info[0], '')
            if brain_value:
                if index_id not in indexes_dict and index_id != 'Subject':
                    #indexes_dict['indexes_order'].append(index_id)
                    index_title_translated = self.translation_service.utranslate(msgid=index_title.decode('utf-8'),
                                                              domain='rer.keywordsearch',
                                                              default=index_title,
                                                              context=self.context)
                    indexes_dict[index_id] = {'title': index_title_translated, 'indexes': []}
                elif index_id == 'Subject' and index_title != 'Category':
                    new_subject_label = self.translation_service.utranslate(msgid=index_title,
                                                                            domain='rer.keywordsearch',
                                                                            default=index_title,
                                                                            context=self.context)
                    indexes_dict['Subject']['title'] = new_subject_label
                if index_id != 'Subject':
                    self.updateIndexesList(brain_value, index_id)

    def updateIndexesList(self, index_value, index_id):
        """
        Update results dict with given index value
        """
        indexes_dict = self.tabs_dict.get('indexes_dict', {})
        if isinstance(index_value, tuple) or isinstance(index_value, list):
            for value in index_value:
                if value not in indexes_dict[index_id]['indexes']:
                    indexes_dict[index_id]['indexes'].append(value)
        else:
            if index_value not in indexes_dict[index_id]['indexes']:
                indexes_dict[index_id]['indexes'].append(index_value)
        indexes_dict[index_id]['indexes'].sort()

    @property
    def additional_indexes_settings(self):
        """
        return indexes configuration
        """
        if not self.rer_properties:
            return {}
        if self.rer_properties.getProperty('indexes_in_search', ()):
            keywords = self.rer_properties.getProperty('indexes_in_search', ())
        else:
            keywords = self.rer_properties.getProperty('keywordview_properties', ())
        indexes_order = []
        if keywords:
            for index in keywords:
                key_info = index.split('|')
                indexes_order.append(key_info[0])
        else:
            indexes_order.append('Subject')
        whitelist = self.rer_properties.getProperty('type_whitelist', ())
        hiddenlist = self.rer_properties.getProperty('indexes_hiddenlist', ())
        return {'indexes': keywords,
                'indexes_order': indexes_order,
                'whitelist': whitelist,
                'hiddenlist': hiddenlist}

    def setTabUrl(self, template_id, tab_id):
        """
        Set the right tab url
        """
        new_request = self.context.REQUEST.form.copy()
        new_request['selected_tab'] = tab_id
        if 'b_start' in new_request:
            del new_request['b_start']
        query_string = self.getQueryString(new_request)
        return '%s/@@%s?%s' % (self.context.absolute_url(), template_id, query_string)

    def getTabClass(self, current_block_id, tab_ids, selected_tab, first_available_tab):
        """
        Return the current class of the tabs
        """
        if 'selected_tab' not in self.context.REQUEST.form:
            if current_block_id == first_available_tab:
                return 'linetab groupSelected'
            return 'linetab'
        selected_tab = self.context.REQUEST.form.get('selected_tab')
        if selected_tab not in tab_ids:
            if current_block_id == first_available_tab:
                self.context.REQUEST.form['selected_tab'] = current_block_id
                return 'linetab groupSelected'
            return 'linetab'
        if selected_tab == current_block_id:
                return 'linetab groupSelected'
        return 'linetab'

    def getFolderName(self, path):
        """
        Return folder Title, if exist
        """
        folder = self.context.unrestrictedTraverse(path, None)
        if folder:
            return folder.Title()
        else:
            return path

    def getHiddenIndexes(self):
        """
        Return a list of hidden indexes to insert in the query
        """
        hiddenlist = self.additional_indexes_settings.get('hiddenlist', [])
        hidden_dict = {'index_titles': [],
                     'indexes_to_add': []}
        if not hiddenlist:
            return hidden_dict
        for hidden_index in hiddenlist:
            register_index = False
            index_info = hidden_index.split('|')
            index = index_info[0]
            index_value = self.context.REQUEST.form.get(index, '')
            if not index_value:
                continue
            index_id = index
            if isinstance(index_value, record):
                register_index = self.setHiddenRecord(index_value, index, hidden_dict)
            elif isinstance(index_value, list):
                register_index = self.setHiddenList(index_value, index, hidden_dict)
            else:
                register_index = True
                hidden_dict['indexes_to_add'].append({'id': index_id,
                                       'value': index_value})
            if register_index:
                if len(index_info) == 1:
                    hidden_dict['index_titles'].append(index_info[0])
                else:
                    hidden_dict['index_titles'].append(index_info[1])
        return hidden_dict

    def setHiddenList(self, index_value, index, hidden_dict):
        """
        set the hidden index if is a list
        """
        has_values = False
        for value in index_value:
            if value:
                has_values = True
                index_id = "%s:list" % (index)
                hidden_dict['indexes_to_add'].append({'id': index_id,
                                           'value': value})
        return has_values

    def setHiddenRecord(self, index_value, index, hidden_dict):
        """
        set the hidden index if is a record
        """
        has_values = False
        if index_value.get('query', '') in ['', ['', '']]:
            return has_values
        for query_part in index_value.keys():
            index_id = "%s.%s:record" % (index, query_part)
            query_value = index_value[query_part]
            if not query_value:
                continue
            has_values = True
            if isinstance(query_value, list):
                index_id += ":list"
                for value_item in query_value:
                    if isinstance(value_item, DateTime):
                        index_id += ":date"
                        list_value = value_item.ISO()
                        hidden_dict['indexes_to_add'].append({'id': index_id,
                                               'value': list_value})
                    else:
                        hidden_dict['indexes_to_add'].append({'id': index_id,
                                               'value': value_item})
            else:
                hidden_dict['indexes_to_add'].append({'id': index_id,
                                       'value': query_value})
        return has_values

    def getQueryString(self, request_dict):
        """
        Return the query string for RSS pourpose
        """
        return urlencode(request_dict, True)

    def getFirstAvailableTab(self):
        """
        Return the first populated tab with results
        """
        for tab_id in self.tabs_dict['tabs_order']:
            if self.tabs_dict[tab_id].get('results', []):
                return tab_id
        return ''
