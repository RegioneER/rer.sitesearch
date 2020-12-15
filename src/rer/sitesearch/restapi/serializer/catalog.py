# -*- coding: utf-8 -*-
from copy import deepcopy
from plone import api
from plone.indexer.interfaces import IIndexableObject
from plone.registry.interfaces import IRegistry
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
from zope.component import getUtility
from zope.component import queryMultiAdapter
from zope.i18n import translate
from zope.interface import implementer

try:
    # rer.agidtheme overrides site tile field
    from rer.agidtheme.base.interfaces import IRERSiteSchema as ISiteSchema
    from rer.agidtheme.base.utility.interfaces import ICustomFields

    RER_THEME = True
except ImportError:
    from Products.CMFPlone.interfaces.controlpanel import ISiteSchema

    RER_THEME = False


import Missing
import six


@implementer(ISerializeToJson)
@adapter(Lazy, IRERSiteSearchLayer)
class LazyCatalogResultSerializer(BaseSerializer):
    def __call__(self, metadata_fields=(), fullobjects=False):
        data = super(LazyCatalogResultSerializer, self).__call__(
            metadata_fields=metadata_fields, fullobjects=fullobjects
        )
        # add facets informations
        data.update(
            {"facets": self.extract_facets(brains=self.lazy_resultset)}
        )
        data.update({"path_infos": self.add_path_infos()})
        return data

    def extract_facets(self, brains):
        pc = api.portal.get_tool(name="portal_catalog")
        facets = {
            "groups": self.get_groups_facets(brains=brains),
            "indexes": get_indexes_mapping(),
        }
        for brain in brains:
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

    def get_groups_facets(self, brains):
        """
        We need to have the right count for groups facets because these are
        not proper facets, and the number of results should be the same also
        if we select a different group (groups only needs to show grouped
        informations, not to filter).
        If we are filtering by type, this means that we need to do an another
        catalog search for get the proper counters for each group.
        """
        query = self.request.form.copy()
        query = unflatten_dotted_dict(query)
        groups = get_types_groups()
        all_label = translate(
            _("all_types_label", default=u"All content types"),
            context=self.request,
        )
        portal_types = query.get("portal_type", "")
        if portal_types:
            new_query = deepcopy(query)
            if "portal_type" in new_query:
                del new_query["portal_type"]
            brains_to_iterate = api.content.find(**new_query)
        else:
            brains_to_iterate = brains
        for brain in brains_to_iterate:
            for group in groups.get("values", {}).values():
                if brain.portal_type in group.get("types", []):
                    group["count"] += 1
        groups["values"][all_label][
            "count"
        ] = brains_to_iterate.actual_result_count
        return groups

    def add_path_infos(self):
        query = self.request.form.copy()
        query = unflatten_dotted_dict(query)

        if "path" not in query:
            return {}
        registry = getUtility(IRegistry)
        site_settings = registry.forInterface(
            ISiteSchema, prefix="plone", check=False
        )
        site_title = getattr(site_settings, "site_title") or ""
        if RER_THEME:
            fields_value = getUtility(ICustomFields)
            site_title = fields_value.titleLang(site_title)
        if six.PY2:
            site_title = site_title.decode("utf-8")

        path = query["path"]
        if isinstance(path, dict):
            path = path.get("query", "")
        root_path = "/".join(api.portal.get().getPhysicalPath())

        data = {
            "site_name": site_title,
            "root": "/".join(api.portal.get().getPhysicalPath()),
        }
        if path != root_path:
            folder = api.content.get(path)
            if folder:
                data["path_title"] = folder.title
        return data
