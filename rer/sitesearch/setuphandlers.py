# -*- coding: utf-8 -*-
"""
@author: andrea cecchi
"""
from plone import api
from plone.registry.interfaces import IRegistry
from Products.CMFCore.utils import getToolByName
from Products.CMFPlone.interfaces import INonInstallable
from rer.sitesearch.interfaces import IRERSiteSearchSettings
from zope.component import queryUtility
from zope.interface import implementer
from zope.schema.interfaces import IVocabularyFactory


DEFAULT_HIDDEN_INDEXES = [
    {'index': 'start', 'index_title': 'Event start'},
    {'index': 'end', 'index_title': 'Event end'},
    {'index': 'Creator', 'index_title': 'Author'},
]

DEFAULT_INDEXES = [{'index_title': 'Subject', 'index': 'Subject'}]

DEFAULT_TABS = [
    {'portal_types': ('Document',), 'tab_title': 'Documents'},
    {'portal_types': ('News Item',), 'tab_title': 'News'},
    {'portal_types': ('Event',), 'tab_title': 'Events'},
    {'portal_types': ('File',), 'tab_title': 'File'},
    {'portal_types': ('Link',), 'tab_title': 'Links'},
]


@implementer(INonInstallable)
class HiddenProfiles(object):
    def getNonInstallableProfiles(self):
        """Hide uninstall profile from site-creation and quickinstaller"""
        return ['rer.sitesearch:uninstall']


def post_install(context):
    portal = api.portal.get()
    insertProperties(portal)


def uninstall(context):
    """ """


def insertProperties(context):
    """
    insert some properties
    """
    registry = queryUtility(IRegistry)
    settings = registry.forInterface(IRERSiteSearchSettings, check=False)
    settings.available_indexes = DEFAULT_INDEXES
    settings.hidden_indexes = DEFAULT_HIDDEN_INDEXES
    settings.tabs_mapping = DEFAULT_TABS
    tabs_order_dict = queryUtility(
        IVocabularyFactory,
        name="rer.sitesearch.vocabularies.SearchTabsVocabulary",
    )
    tabs_order = tabs_order_dict(context).by_token.keys()
    settings.tabs_order = tuple(tabs_order)
