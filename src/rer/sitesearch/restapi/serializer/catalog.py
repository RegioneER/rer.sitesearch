# -*- coding: utf-8 -*-
from plone.restapi.interfaces import ISerializeToJson
from Products.ZCatalog.Lazy import Lazy
from zope.component import adapter
from zope.interface import implementer
from plone.restapi.serializer.catalog import (
    LazyCatalogResultSerializer as BaseSerializer,
)
from rer.sitesearch.interfaces import IRERSiteSearchLayer
from plone import api
from rer.sitesearch.restapi.utils import get_types_groups
from rer.sitesearch.restapi.utils import get_indexes_mapping
from plone.indexer.interfaces import IIndexableObject
from zope.component import queryMultiAdapter

import Missing


@implementer(ISerializeToJson)
@adapter(Lazy, IRERSiteSearchLayer)
class LazyCatalogResultSerializer(BaseSerializer):
    def __call__(self, metadata_fields=(), fullobjects=False):
        data = super(LazyCatalogResultSerializer, self).__call__(
            metadata_fields=metadata_fields, fullobjects=fullobjects
        )

        # add facets informations
        facets = self.extract_facets(brains=self.lazy_resultset)
        data.update({"facets": facets})
        return data

    def extract_facets(self, brains):
        pc = api.portal.get_tool(name="portal_catalog")
        facets = {
            "groups": get_types_groups(),
            "indexes": get_indexes_mapping(),
        }
        for brain in brains:
            for group in facets["groups"].get("values", {}).values():
                if brain.portal_type in group["types"]:
                    group["count"] += 1
            for index_id, index_settings in (
                facets["indexes"].get("values", {}).items()
            ):
                try:
                    value = getattr(brain, index_id)
                except AttributeError:
                    # index is not a brain's metadata. Load item object
                    # (could be painful)
                    item = brain.getObject()
                    adapter = queryMultiAdapter((item, pc), IIndexableObject)
                    value = getattr(adapter, index_id, None)
                if not value or value == Missing.Value:
                    continue
                else:
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
