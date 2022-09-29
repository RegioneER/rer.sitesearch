# -*- coding: utf-8 -*-
from plone.restapi.interfaces import ISerializeToJsonSummary
from plone.restapi.serializer.summary import DefaultJSONSummarySerializer
from rer.sitesearch.interfaces import IRERSiteSearchLayer
from rer.sitesearch.interfaces import ISiteSearchAdditionalTemplatesProvider
from zope.component import adapter
from zope.component import queryMultiAdapter
from zope.interface import implementer
from zope.interface import Interface


@implementer(ISerializeToJsonSummary)
@adapter(Interface, IRERSiteSearchLayer)
class SiteSearchJSONSummarySerializer(DefaultJSONSummarySerializer):
    def __call__(self):
        data = super(SiteSearchJSONSummarySerializer, self).__call__()
        adapter = queryMultiAdapter(
            (self.context, self.request),
            interface=ISiteSearchAdditionalTemplatesProvider,
            name=self.context.portal_type,
        )
        if adapter:
            data["additional_html"] = adapter()
        return data
