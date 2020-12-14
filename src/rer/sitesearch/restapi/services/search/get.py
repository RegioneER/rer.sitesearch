# -*- coding: utf-8 -*-
from plone import api
from plone.api.exc import InvalidParameterError
from plone.restapi.search.handler import SearchHandler
from plone.restapi.search.utils import unflatten_dotted_dict
from plone.restapi.services import Service
from rer.sitesearch.restapi.utils import get_indexes_mapping
from rer.sitesearch.restapi.utils import get_types_groups
from rer.sitesearch import _
from zope.i18n import translate
from copy import deepcopy

try:
    from rer.solrpush.interfaces.settings import IRerSolrpushSettings
    from rer.solrpush.restapi.services.solr_search.solr_search_handler import (
        SolrSearchHandler,
    )

    HAS_SOLR = True
except ImportError:
    HAS_SOLR = False


class SearchGet(Service):
    def reply(self):
        query = deepcopy(self.request.form)
        query = unflatten_dotted_dict(query)
        if "group" in query:
            groups = get_types_groups()
            for group_id, group_data in groups.get("values", {}).items():
                if query["group"] == group_id and group_data["types"]:
                    query["portal_type"] = group_data["types"]

            del query["group"]
        if HAS_SOLR:
            try:
                search_enabled = api.portal.get_registry_record(
                    "active", interface=IRerSolrpushSettings
                )
            except (KeyError, InvalidParameterError):
                search_enabled = False
            if search_enabled:
                query["facets"] = True
                query["facet_fields"] = ["portal_type", "site_name"]

                indexes = get_indexes_mapping()
                if indexes:
                    query["facet_fields"].extend(indexes["order"])
                if "metadata_fields" not in query:
                    query["metadata_fields"] = ["Description"]
                else:
                    if "Description" not in query["metadata_fields"]:
                        query["metadata_fields"].append("Description")
                data = SolrSearchHandler(self.context, self.request).search(
                    query
                )
                data["facets"] = self.remap_solr_facets(data=data, query=query)
                return data
        return SearchHandler(self.context, self.request).search(query)

    def remap_solr_facets(self, data, query):
        new_facets = {
            "groups": get_types_groups(),
            "indexes": get_indexes_mapping(),
            "sites": {"order": [], "values": {}},
        }
        for index_id, index_values in data["facets"].items():
            if index_id == "site_name":
                entry = new_facets["sites"]["values"]
                self.handle_sites_facet(
                    sites=entry, index_values=index_values, query=query,
                )
                new_facets["sites"]["order"] = sorted(entry.keys())
            elif index_id == "portal_type":
                # groups
                self.handle_groups_facet(
                    groups=new_facets["groups"]["values"],
                    index_values=index_values,
                    query=query,
                )
            else:
                entry = new_facets["indexes"]["values"][index_id]
                for index_mapping in index_values:
                    for key, count in index_mapping.items():
                        if count:
                            entry["values"][key] = count
        return new_facets

    def handle_groups_facet(self, groups, index_values, query):
        portal_types = query.get("portal_type", "")
        if portal_types:
            # we need to do a second query in solr, to get the results
            # unfiltered by types
            new_query = deepcopy(query)
            del new_query["portal_type"]
            # simplify returned result data
            new_query["facet_fields"] = ["portal_type"]
            new_query["metadata_fields"] = ["UID"]
            new_data = SolrSearchHandler(self.context, self.request).search(
                new_query
            )
            indexes = new_data["facets"]["portal_type"]
        else:
            indexes = index_values
        all_label = translate(
            _("all_types_label", default=u"All content types"),
            context=self.request,
        )
        for type_mapping in indexes:
            for ptype, count in type_mapping.items():
                for group in groups.values():
                    if ptype in group["types"]:
                        group["count"] += count
                groups[all_label]["count"] += count

    def handle_sites_facet(self, sites, index_values, query):
        site = query.get("site_name", "")
        if site:
            # we need to do an additional query in solr, to get the results
            # unfiltered by site_name
            new_query = deepcopy(query)
            del new_query["site_name"]
            # simplify returned result data
            new_query["facet_fields"] = ["site_name"]
            new_query["metadata_fields"] = ["UID"]
            new_data = SolrSearchHandler(self.context, self.request).search(
                new_query
            )
            indexes = new_data["facets"]["site_name"]
        else:
            indexes = index_values
        for site_mapping in indexes:
            for name, count in site_mapping.items():
                if count:
                    sites[name] = count
