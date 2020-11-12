# -*- coding: utf-8 -*-
from plone import api
from plone.restapi.services import Service
from zope.interface import implementer
from zope.publisher.interfaces import IPublishTraverse
from rer.sitesearch.interfaces import IRERSiteSearchSettings


@implementer(IPublishTraverse)
class SearchFiltersGet(Service):
    def reply(self):
        params = {
            "grouping": self.get_values_from_registry(field="types_grouping"),
            "indexes": self.get_values_from_registry(
                field="available_indexes"
            ),
        }
        return params

    def get_values_from_registry(self, field):
        values = api.portal.get_registry_record(
            field, interface=IRERSiteSearchSettings, default=[]
        )
        res = []
        for value in values:
            data = {}
            for k, v in value.items():
                if k == "label":
                    data[k] = self.extract_label(v)
                else:
                    data[k] = v
            res.append(data)
        return res

    def extract_label(self, value):
        string_value = ""
        if len(value) == 1:
            string_value = value[0]
        else:
            current_lang = api.portal.get_current_language()
            string_value = ""
            for option in value:
                lang, label = option.split("|")
                if lang and lang == current_lang:
                    string_value = label
                    break
        return string_value
