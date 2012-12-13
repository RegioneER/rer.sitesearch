# -*- coding: utf-8 -*-

from zope import schema
from zope.interface import Interface, implements

from z3c.form.object import registerFactoryAdapter
from plone.registry.field import PersistentField
from rer.sitesearch import sitesearchMessageFactory as _
import sys
if sys.version_info < (2, 6):
    # Plone 3
    FOLDER_TYPES_VALUESTYPE = schema.TextLine()
else:
    FOLDER_TYPES_VALUESTYPE = schema.Choice(vocabulary=u"plone.app.vocabularies.ReallyUserFriendlyTypes")


class ITabsValueField(Interface):
    tab_title = schema.ASCIILine(title=_("sitesearch_tab_title", default=u"Tab title"),
                                 description=_("sitesearch_tab_title_help",
                                               default=u"Insert a title for this tab. You can provide translations for this title with a proper translation file for rer.sitesearch domain."),
                                 required=True)
    portal_types = schema.Tuple(
            title=_("sitesearch_tab_portal_types", default=u"Portal types"),
            description=_("sitesearch_tab_portal_types_help",
                          default=u'Select which portal_types shows on this tab.'),
            required=False,
            value_type=FOLDER_TYPES_VALUESTYPE,
    )


class TabsValueField(object):
    implements(ITabsValueField)


class IIndexesValueField(Interface):
    index_title = schema.ASCIILine(title=_("sitesearch_index_title", default=u"Index title"),
                                   description=_("sitesearch_index_title_help",
                                                 default=u"Insert a title for this search filter. You can provide translations for this title with a proper translation file for rer.sitesearch domain."),
                                   required=True)
    index = schema.Choice(
            title=_("sitesearch_allowable", default=u"Allowable indexes in catalog"),
            description=_("sitesearch_allowable_help",
                          default=u'Select an index.'),
            required=False,
            vocabulary=u"rer.sitesearch.vocabularies.IndexesVocabulary",
    )


class IndexesValueField(object):
    implements(IIndexesValueField)


class PersistentObject(PersistentField, schema.Object):
    pass

registerFactoryAdapter(ITabsValueField, TabsValueField)
registerFactoryAdapter(IIndexesValueField, IndexesValueField)
