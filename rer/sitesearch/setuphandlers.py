# -*- coding: utf-8 -*-
"""
@author: andrea cecchi
"""
from Products.CMFCore.utils import getToolByName

DEFAULT_HIDDEN_INDEXES = ('getEventType|Event type',
                          'start|Event start',
                          'end|Event end',
                          'creator|Author')

def Handlers(context):
    if context.readDataFile('sitesearch_various.txt') is None:
        return
    portal = context.getSite()
    insertProperties(context)
 
def insertProperties(context):
    """
    insert some properties
    """
    portal=context.getSite()
    portal_properties = getToolByName(context, 'portal_properties')
    rer_properties = getattr(portal_properties, 'rer_properties',None)
    if not rer_properties:
        portal_properties.addPropertySheet(id='rer_properties',title="Rer properties")
        portal.plone_log("Added rer_properties property-sheet")
        rer_properties = getattr(portal_properties, 'rer_properties',None)
    if not rer_properties.hasProperty('indexes_in_search'):
        rer_properties.manage_addProperty(id='indexes_in_search',value='',type='lines')
        portal.plone_log("Added indexes_in_search property")
    if not rer_properties.hasProperty('tabs_list'):
        rer_properties.manage_addProperty(id='tabs_list',
                                          value=('Document|Documents',
                                                 'News Item|News',
                                                 'Event|Events',
                                                 'File|File',
                                                 'Link|Links'),
                                          type='lines')
        portal.plone_log("Added tabs_list property")
    if not rer_properties.hasProperty('indexes_hiddenlist'):
        rer_properties.manage_addProperty(id='indexes_hiddenlist',
                                          value=DEFAULT_HIDDEN_INDEXES,
                                          type='lines')
        portal.plone_log("Added indexes_hiddenlist property")
    
