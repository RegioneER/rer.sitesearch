# -*- coding: utf-8 -*-
from plone import api
from plone.api.exc import InvalidParameterError
from plone.restapi.search.handler import SearchHandler
from plone.restapi.search.utils import unflatten_dotted_dict
from plone.restapi.services import Service
from rer.sitesearch.restapi.utils import get_indexes_mapping
from rer.sitesearch.restapi.utils import get_types_groups

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
        query = self.request.form.copy()
        query = unflatten_dotted_dict(query)
        if HAS_SOLR:
            try:
                search_enabled = api.portal.get_registry_record(
                    "search_with_solr", interface=IRerSolrpushSettings
                )
            except (KeyError, InvalidParameterError):
                search_enabled = False
            if search_enabled:
                query["facets"] = True
                query["facet_fields"] = ["portal_type"]

                groups = get_types_groups()
                indexes = get_indexes_mapping()
                if indexes:
                    query["facet_fields"].extend(indexes["order"])

                data = SolrSearchHandler(self.context, self.request).search(
                    query
                )
                data["facets"] = self.remap_solr_facets(data, groups, indexes)
                return data
        return SearchHandler(self.context, self.request).search(query)

    def remap_solr_facets(self, data, groups, indexes):
        new_facets = {
            "groups": get_types_groups(),
            "indexes": get_indexes_mapping(),
        }
        for index_id, index_values in data["facets"].items():
            if index_id == "portal_type":
                # groups
                group_values = new_facets["groups"]["values"]
                for type_mapping in index_values:
                    for ptype, count in type_mapping.items():
                        for group in group_values.values():
                            if ptype in group["types"]:
                                group["count"] += count
            else:
                entry = new_facets["indexes"]["values"][index_id]
                for index_mapping in index_values:
                    for key, value in index_mapping.items():
                        entry["values"][key] = value
        return new_facets
