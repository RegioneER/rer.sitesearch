from plone.app.content.browser.i18n import i18njs as BaseView
from plone import api
from rer.sitesearch.interfaces import IRERSiteSearchSettings

import logging
import json

logger = logging.getLogger(__name__)


class View(BaseView):
    def get_value_from_registry(self, field):
        try:
            return api.portal.get_registry_record(
                field, interface=IRERSiteSearchSettings
            )
        except KeyError:
            return None

    def __call__(self, domain=None, language=None):
        if language is None:
            language = self.request["LANGUAGE"]
        if domain is None:
            catalog = {}
        else:
            catalog = self._gettext_catalog(domain, language)
        if self.request.form.get("sitesearch_domains", False):
            additional_domains = self.get_value_from_registry(
                field="i18n_additional_domains"
            )
            for additional_domain in additional_domains:
                catalog.update(
                    self._gettext_catalog(domain=additional_domain, language=language)
                )
        response = self.request.response
        response.setHeader("Content-Type", "application/json; charset=utf-8")
        response.setBody(json.dumps(catalog))
        return response
