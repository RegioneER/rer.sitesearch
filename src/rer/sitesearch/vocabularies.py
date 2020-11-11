# -*- coding: utf-8 -*-
from Products.CMFCore.utils import getToolByName
from zope.interface import implements
from zope.schema.interfaces import IVocabularyFactory
from zope.schema.vocabulary import SimpleTerm
from zope.schema.vocabulary import SimpleVocabulary
from zope.site.hooks import getSite


class IndexesVocabulary(object):
    """
    Vocabulary factory for allowable indexes in catalog.
    """

    implements(IVocabularyFactory)

    def __call__(self, context):
        site = getSite()
        pc = getToolByName(site, "portal_catalog")
        indexes = pc.indexes()
        indexes.sort()
        indexes = [SimpleTerm(i, i, i) for i in indexes]
        return SimpleVocabulary(indexes)


IndexesVocabularyFactory = IndexesVocabulary()
