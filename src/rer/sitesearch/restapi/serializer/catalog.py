# -*- coding: utf-8 -*-
from copy import deepcopy
from plone import api
from plone.indexer.interfaces import IIndexableObject
from plone.restapi.interfaces import ISerializeToJson
from plone.restapi.search.utils import unflatten_dotted_dict
from plone.restapi.serializer.catalog import (
    LazyCatalogResultSerializer as BaseSerializer,
)
from Products.ZCatalog.Lazy import Lazy
from rer.sitesearch import _
from rer.sitesearch.interfaces import IRERSiteSearchLayer
from rer.sitesearch.restapi.utils import get_indexes_mapping
from rer.sitesearch.restapi.utils import get_types_groups
from zope.component import adapter
from zope.component import queryMultiAdapter
from zope.i18n import translate
from zope.interface import implementer

import Missing


@implementer(ISerializeToJson)
@adapter(Lazy, IRERSiteSearchLayer)
class LazyCatalogResultSerializer(BaseSerializer):
    def __call__(self, fullobjects=False):
        data = super(LazyCatalogResultSerializer, self).__call__(
            fullobjects=fullobjects
        )
        # add facets informations
        data.update({"facets": self.extract_facets(brains=self.lazy_resultset)})
        return data

    def extract_facets(self, brains):
        pc = api.portal.get_tool(name="portal_catalog")
        facets = {
            "groups": self.get_groups_facets(brains=brains),
            "indexes": get_indexes_mapping(),
        }
        for brain in brains:
            for index_id, index_settings in facets["indexes"].get("values", {}).items():
                if index_settings.get("type", "") == "DateIndex":
                    # skip it, we need to set some dates in the interface
                    continue
                try:
                    value = getattr(brain, index_id)
                except AttributeError:
                    # index is not a brain's metadata. Load item object
                    # (could be painful)
                    item = brain.getObject()
                    adapter = queryMultiAdapter((item, pc), IIndexableObject)
                    value = getattr(adapter, index_id, None)
                if not value or value == Missing.Value:
                    if not isinstance(value, bool) and not isinstance(value, int):
                        # bool and numbers can be False or 0
                        continue
                if isinstance(value, list) or isinstance(value, tuple):
                    for single_value in value:
                        if single_value not in index_settings["values"]:
                            index_settings["values"][single_value] = 1
                        else:
                            index_settings["values"][single_value] += 1
                else:
                    if value not in index_settings["values"]:
                        index_settings["values"][value] = 1
                    else:
                        index_settings["values"][value] += 1
        return facets

    def get_groups_facets(self, brains):
        """
        We need to have the right count for groups facets because these are
        not proper facets, and the number of results should be the same also
        if we select a different group (groups only needs to show grouped
        informations, not to filter).
        If we are filtering by type, this means that we need to do an another
        catalog search for get the proper counters for each group.
        """
        query = deepcopy(self.request.form)
        query = unflatten_dotted_dict(query)
        groups = get_types_groups()
        all_label = translate(
            _("all_types_label", default=u"All content types"),
            context=self.request,
        )

        for key, value in query.items():
            if value in ["false", "False"]:
                query[key] = False
            if value in ["true", "True"]:
                query[key] = True

        for index in ["metadata_fields", "portal_type"]:
            if index in query:
                del query[index]

        # fix portal types
        types = query.get("portal_type", [])
        if "query" in types:
            types = types["query"]
        query["portal_type"] = self.filter_types(types)

        portal_catalog = api.portal.get_tool(name="portal_catalog")
        brains_to_iterate = portal_catalog(**query)
        for brain in brains_to_iterate:
            for group in groups.get("values", {}).values():
                if brain.portal_type in group.get("types", []):
                    group["count"] += 1

        groups["values"][all_label]["count"] = getattr(
            brains_to_iterate, "actual_result_count", len(brains_to_iterate)
        )
        return groups

    def filter_types(self, types):
        """
        Search only in enabled types in control-panel
        """
        plone_utils = api.portal.get_tool(name="plone_utils")
        if not isinstance(types, list):
            types = [types]
        return plone_utils.getUserFriendlyTypes(types)
