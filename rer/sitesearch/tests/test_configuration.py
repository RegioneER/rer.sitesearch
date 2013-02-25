# -*- coding: utf-8 -*-
from zope.component import queryUtility, getMultiAdapter
from plone.registry.interfaces import IRegistry
from rer.sitesearch.interfaces import IRERSiteSearchSettings
from rer.sitesearch.testing import SITESEARCH_INTEGRATION_TESTING
from base import BaseTestCase
from rer.sitesearch.setuphandlers import DEFAULT_INDEXES, DEFAULT_HIDDEN_INDEXES, setRegistyIndexes
from plone.app.testing import logout


class TestConfiguration(BaseTestCase):

    layer = SITESEARCH_INTEGRATION_TESTING

    def setUp(self):
        """
        """
        self.portal = self.layer['portal']
        self.request = self.layer['request']
        self.markRequestWithLayer()

    def test_default_configuration(self):
        """
        test if the registry is set correctly
        """
        registry = queryUtility(IRegistry)
        settings = registry.forInterface(IRERSiteSearchSettings, check=False)
        indexes = setRegistyIndexes(self.portal, DEFAULT_INDEXES)
        hidden_indexes = setRegistyIndexes(self.portal, DEFAULT_HIDDEN_INDEXES)
        self.assertEqual(len(settings.available_indexes), len(indexes))
        self.assertEqual(settings.available_indexes[0].index, "Subject")
        self.assertEqual(len(settings.hidden_indexes), len(hidden_indexes))
        self.assertEqual(settings.hidden_indexes[0].index, "start")
        self.assertEqual(settings.tabs_order, ('all', 'documents', 'links', 'file', 'news', 'events'))

    def test_sitesearch_controlpanel_view(self):
        """
        test if there is settings view
        """
        view = getMultiAdapter((self.portal, self.request), name="sitesearch-settings")
        view = view.__of__(self.portal)
        self.failUnless(view())

    def test_sitesearch_controlpanel_view_protected(self):
        """
        test if the settings view is protected
        """
        from AccessControl import Unauthorized
        logout()
        self.assertRaises(Unauthorized, self.portal.restrictedTraverse, '@@sitesearch-settings')
