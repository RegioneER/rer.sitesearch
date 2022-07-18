# -*- coding: utf-8 -*-
from zope.interface import Interface


class ISiteSearchAdditionalTemplatesProvider(Interface):
    """Marker interface"""

    def __init__(context, request):
        """Adapts context and the request."""

    def __call__():
        """ """
