# -*- coding: utf-8 -*-
"""
@author: andrea cecchi
"""
from plone.registry.interfaces import IRegistry
from Products.CMFCore.utils import getToolByName
from rer.sitesearch.custom_fields import TabsValueField, IndexesValueField
from rer.sitesearch.interfaces import IRERSiteSearchSettings
from zope.component import queryUtility
from zope.schema.interfaces import IVocabularyFactory


DEFAULT_HIDDEN_INDEXES = [('start', 'Event start'),
                          ('end', 'Event end'),
                          ('Creator', 'Author')]

DEFAULT_INDEXES = [('Subject', 'Subject')]

DEFAULT_TABS = [('Document', 'Documents'),
                 ('News Item', 'News'),
                 ('Event', 'Events'),
                 ('File', 'File'),
                 ('Link', 'Links')]


def post_install(context):
    if context.readDataFile('sitesearch_various.txt') is None:
        return
    portal = context.getSite()
    insertProperties(portal)

def uninstall(context):
    """ """

def insertProperties(context):
    """
    insert some properties
    """
    registry = queryUtility(IRegistry)
    settings = registry.forInterface(IRERSiteSearchSettings, check=False)
    # set search indexes
    indexes = setRegistyIndexes(context, DEFAULT_INDEXES)
    settings.available_indexes = indexes
    # set hidden indexes
    hidden_indexes = setRegistyIndexes(context, DEFAULT_HIDDEN_INDEXES)
    settings.hidden_indexes = hidden_indexes
    # set tabs
    tabs = setRegistryTabs(context)
    if tabs:
        settings.tabs_mapping = tabs
        tabs_order_dict = queryUtility(IVocabularyFactory, name="rer.sitesearch.vocabularies.SearchTabsVocabulary")
        tabs_order = tabs_order_dict(context).by_token.keys()
        settings.tabs_order = tuple(tabs_order)


def setRegistyIndexes(context, indexes_list):
    """
    """
    pc = getToolByName(context, 'portal_catalog')
    catalog_indexes = pc.indexes()
    new_items = []
    for index in indexes_list:
        index_id = index[0]
        index_title = index[1]
        if index_id in catalog_indexes:
            new_value = IndexesValueField()
            new_value.index = index_id
            new_value.index_title = index_title
            new_items.append(new_value)
    return tuple(new_items)


def setRegistryTabs(context):
    """
    """
    types_tool = getToolByName(context, 'portal_types')
    portal_types = types_tool.listContentTypes()
    new_tabs = []
    for tab in DEFAULT_TABS:
        tab_ptype = tab[0]
        tab_title = tab[1]
        if tab_ptype in portal_types:
            new_value = TabsValueField()
            new_value.tab_title = tab_title
            new_value.portal_types = (tab_ptype,)
            new_tabs.append(new_value)
    return tuple(new_tabs)
