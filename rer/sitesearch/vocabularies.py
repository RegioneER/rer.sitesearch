from Acquisition import aq_get
from zope.interface import implements
from zope.schema.interfaces import IVocabularyFactory
from zope.schema.vocabulary import SimpleVocabulary
from zope.schema.vocabulary import SimpleTerm
from zope.site.hooks import getSite
from Products.CMFCore.utils import getToolByName
from rer.sitesearch.interfaces import IRERSiteSearchSettings
from zope.component import queryUtility
from plone.registry.interfaces import IRegistry


class IndexesVocabulary(object):
    """
    Vocabulary factory for allowable indexes in catalog.
    """
    implements(IVocabularyFactory)

    def __call__(self, context):
        site = getSite()
        pc = getToolByName(site, 'portal_catalog')
        indexes = pc.indexes()
        indexes.sort()
        indexes = [SimpleTerm(i, i, i) for i in indexes]
        return SimpleVocabulary(indexes)

IndexesVocabularyFactory = IndexesVocabulary()


class SearchTabsVocabulary(object):
    """
    Vocabulary factory for selected tabs.
    """
    implements(IVocabularyFactory)

    def __call__(self, context):
        registry = queryUtility(IRegistry)
        settings = registry.forInterface(IRERSiteSearchSettings, check=False)
        tabs_mapping = getattr(settings, 'tabs_mapping', ())
        tabs_list = ['All']
        available_tabs = [x.tab_title for x in tabs_mapping]
        available_tabs.sort()
        tabs_list.extend(available_tabs)
        tabs_list = [SimpleTerm(i.lower().replace(' ', '-'), i.lower().replace(' ', '-'), i) for i in tabs_list]
        return SimpleVocabulary(tabs_list)

SearchTabsVocabularyFactory = SearchTabsVocabulary()


class SearchIndexesVocabulary(object):
    """
    Vocabulary factory for selected indexes.
    """
    implements(IVocabularyFactory)

    def __call__(self, context):
        registry = queryUtility(IRegistry)
        settings = registry.forInterface(IRERSiteSearchSettings, check=False)
        indexes_mapping = getattr(settings, 'available_indexes', ())
        available_indexes = [x.index for x in indexes_mapping]
        available_indexes.sort()
        indexes_list = [SimpleTerm(i, i, i) for i in available_indexes]
        return SimpleVocabulary(indexes_list)

SearchIndexesVocabularyFactory = SearchIndexesVocabulary()
