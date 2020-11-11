# -*- coding: utf-8 -*-
from Products.Five import BrowserView
from rer.sitesearch.browser.interfaces import IRerSiteSearch
from zope.interface import implementer

import logging

logger = logging.getLogger(__name__)


@implementer(IRerSiteSearch)
class View(BrowserView):
    """
    """
