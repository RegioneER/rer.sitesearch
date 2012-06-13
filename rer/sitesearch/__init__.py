# -*- coding: utf-8 -*-
import logging
logger = logging.getLogger('rer.sitesearch')

from zope.i18nmessageid import MessageFactory
sitesearchMessageFactory = MessageFactory('rer.sitesearch')


def initialize(context):
    """Initializer called when used as a Zope 2 product."""
