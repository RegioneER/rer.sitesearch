# -*- coding: utf-8 -*-
from collective.z3cform.datagridfield.registry import DictRow
from plone.app.z3cform.widget import AjaxSelectFieldWidget
from plone.autoform import directives
from plone.supermodel import model
from rer.sitesearch import _
from zope import schema
from zope.interface import Interface


class ITypesMappingRowSchema(model.Schema):
    label = schema.List(
        title=_("types_mapping_label_label", default=u"Label"),
        description=_(
            "types_mapping_label_help",
            default=u"Insert the label for this group. One per row. "
            u"If the site has only one language, type the simple name. "
            u"If it has multiple languages, insert one row per language in "
            u"the following format: lang|label. For example: it|Documenti",
        ),
        required=True,
        value_type=schema.TextLine(),
    )
    types = schema.Tuple(
        title=_("types_mapping_types_label", default=u"Portal types"),
        description=_(
            "types_mapping_types_help",
            default=u"Select which portal_types to show in this group.",
        ),
        required=True,
        value_type=schema.TextLine(),
    )
    directives.widget(
        "types",
        AjaxSelectFieldWidget,
        vocabulary=u"plone.app.vocabularies.ReallyUserFriendlyTypes",
    )


class IIndexesRowSchema(model.Schema):
    label = schema.List(
        title=_("available_indexes_label_label", default=u"Label"),
        description=_(
            "available_indexes_label_help",
            default=u"Insert the label for this index. One per row. "
            u"If the site has only one language, type the simple name. "
            u"If it has multiple languages, insert one row per language in "
            u"the following format: lang|label. For example: it|Keywords",
        ),
        required=True,
        value_type=schema.TextLine(),
    )
    index = schema.Choice(
        title=_("available_indexes_index_label", default=u"Index"),
        description=_(
            "available_indexes_index_help",
            default=u"Select which catalog index to use as filter.",
        ),
        required=True,
        vocabulary=u"rer.sitesearch.vocabularies.IndexesVocabulary",
    )


class IRERSiteSearchSettings(Interface):
    """
    """

    max_word_len = schema.Int(
        title=_(u"Maximum number of characters in a single word"),
        description=_(
            "help_max_word_len",
            default=u"Set what is the maximum length of a single search word. "
            u"Longer words will be omitted from the search.",
        ),
        default=128,
        required=False,
    )

    max_words = schema.Int(
        title=_(u"Maximum number of words in search query"),
        description=_(
            "help_max_words",
            default=u"Set what is the maximum number of words in the search "
            u"query. The other words will be omitted from the search.",
        ),
        default=32,
        required=False,
    )

    types_grouping = schema.List(
        title=_("types_grouping_label", default=u"Types grouping"),
        description=_(
            "types_grouping_help",
            default=u"If you fill this field, you can group search results by "
            u"content-types.",
        ),
        required=False,
        value_type=DictRow(title=u"", schema=ITypesMappingRowSchema),
    )

    available_indexes = schema.List(
        title=_("available_indexes_label", default=u"Available indexes"),
        description=_(
            "available_indexes_help",
            default=u"Select which additional filters to show in the column.",
        ),
        required=False,
        value_type=DictRow(title=u"", schema=IIndexesRowSchema),
    )
