# -*- coding: utf-8 -*-
"""Setup tests for this package."""
from plone import api
from plone.app.testing import setRoles
from plone.app.testing import TEST_USER_ID
from plone.registry.interfaces import IRegistry
from rer.sitesearch.interfaces import IRERSiteSearchSettings
from rer.sitesearch.setuphandlers import DEFAULT_HIDDEN_INDEXES
from rer.sitesearch.setuphandlers import DEFAULT_INDEXES
from rer.sitesearch.setuphandlers import DEFAULT_TABS
from rer.sitesearch.testing import RER_SITESEARCH_INTEGRATION_TESTING  # noqa
from zope.component import queryUtility

import unittest


class TestSetup(unittest.TestCase):
    """Test that rer.sitesearch is properly installed."""

    layer = RER_SITESEARCH_INTEGRATION_TESTING

    def setUp(self):
        """Custom shared utility setup for tests."""
        self.portal = self.layer['portal']
        self.installer = api.portal.get_tool('portal_quickinstaller')

    def test_product_installed(self):
        """Test if rer.sitesearch is installed."""
        self.assertTrue(self.installer.isProductInstalled('rer.sitesearch'))

    def test_browserlayer(self):
        """Test that IRERSiteSearchLayer is registered."""
        from rer.sitesearch.browser.interfaces import IRERSiteSearchLayer
        from plone.browserlayer import utils

        self.assertIn(IRERSiteSearchLayer, utils.registered_layers())

    def test_default_configuration(self):
        """
        test if the registry is set correctly
        """
        registry = queryUtility(IRegistry)
        settings = registry.forInterface(IRERSiteSearchSettings, check=False)
        available_indexes = settings.available_indexes
        hidden_indexes = settings.hidden_indexes
        tabs_mapping = settings.tabs_mapping
        self.assertEqual(len(available_indexes), len(DEFAULT_INDEXES))
        self.assertEqual(available_indexes[0].index, DEFAULT_INDEXES[0][0])
        self.assertEqual(len(hidden_indexes), len(DEFAULT_HIDDEN_INDEXES))
        self.assertEqual(hidden_indexes[0].index, DEFAULT_HIDDEN_INDEXES[0][0])
        self.assertEqual(len(tabs_mapping), len(DEFAULT_TABS))
        self.assertEqual(tabs_mapping[0].portal_types, (DEFAULT_TABS[0][0],))
        self.assertEqual(
            settings.tabs_order,
            ('all', 'documents', 'links', 'file', 'news', 'events'),
        )


class TestUninstall(unittest.TestCase):

    layer = RER_SITESEARCH_INTEGRATION_TESTING

    def setUp(self):
        self.portal = self.layer['portal']
        self.installer = api.portal.get_tool('portal_quickinstaller')
        roles_before = api.user.get_roles(TEST_USER_ID)
        setRoles(self.portal, TEST_USER_ID, ['Manager'])
        self.installer.uninstallProducts(['rer.sitesearch'])
        setRoles(self.portal, TEST_USER_ID, roles_before)

    def test_product_uninstalled(self):
        """Test if rer.sitesearch is cleanly uninstalled."""
        self.assertFalse(self.installer.isProductInstalled('rer.sitesearch'))

    def test_browserlayer_removed(self):
        """Test that IRERSiteSearchLayer is removed."""
        from rer.sitesearch.browser.interfaces import IRERSiteSearchLayer
        from plone.browserlayer import utils

        self.assertNotIn(IRERSiteSearchLayer, utils.registered_layers())
