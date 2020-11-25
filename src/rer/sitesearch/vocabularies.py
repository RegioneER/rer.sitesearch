# -*- coding: utf-8 -*-
from Products.CMFCore.utils import getToolByName
from rer.sitesearch.interfaces import ISiteSearchCustomFilters
from zope.component import getGlobalSiteManager
from zope.globalrequest import getRequest
from zope.i18n import translate
from zope.interface import implementer
from zope.schema.interfaces import IVocabularyFactory
from zope.schema.vocabulary import SimpleTerm
from zope.schema.vocabulary import SimpleVocabulary
from zope.site.hooks import getSite

from rer.sitesearch.utils import GROUP_ICONS


@implementer(IVocabularyFactory)
class IndexesVocabulary(object):
    """
    Vocabulary factory for allowable indexes in catalog.
    """

    def __call__(self, context):
        site = getSite()
        pc = getToolByName(site, "portal_catalog")
        indexes = list(pc.indexes())
        indexes.sort()
        indexes = [SimpleTerm(i, i, i) for i in indexes]
        return SimpleVocabulary(indexes)


IndexesVocabularyFactory = IndexesVocabulary()


@implementer(IVocabularyFactory)
class AdvancedFiltersVocabulary(object):
    """
    Vocabulary factory for list of advanced filters
    """

    def __call__(self, context):

        sm = getGlobalSiteManager()
        request = getRequest()
        adapters = [
            {
                "name": x.name,
                "label": translate(x.factory.label, context=request),
            }
            for x in sm.registeredAdapters()
            if x.provided == ISiteSearchCustomFilters
        ]
        terms = [
            SimpleTerm(value=i["name"], token=i["name"], title=i["label"],)
            for i in sorted(adapters, key=lambda i: i["label"])
        ]
        return SimpleVocabulary(terms)


AdvancedFiltersVocabularyFactory = AdvancedFiltersVocabulary()


@implementer(IVocabularyFactory)
class GroupIconsVocabulary(object):
    """
    Vocabulary factory for list of available icons
    """

    def __call__(self, context):
        request = getRequest()
        terms = [
            SimpleTerm(
                value=i["id"],
                token=i["id"],
                title=translate(i["label"], context=request),
            )
            for i in GROUP_ICONS
        ]
        return SimpleVocabulary(terms)


GroupIconsVocabularyFactory = GroupIconsVocabulary()
