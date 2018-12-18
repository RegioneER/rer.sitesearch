# -*- coding: utf-8 -*-
"""Setup tests for this package."""
from plone import api
from plone.app.testing import setRoles
from plone.app.testing import TEST_USER_ID
from rer.sitesearch.interfaces import IRERSiteSearchSettings
from rer.sitesearch.setuphandlers import DEFAULT_HIDDEN_INDEXES
from rer.sitesearch.setuphandlers import DEFAULT_INDEXES
from rer.sitesearch.setuphandlers import DEFAULT_TABS
from rer.sitesearch.testing import RER_SITESEARCH_INTEGRATION_TESTING  # noqa

import unittest


class TestMethods(unittest.TestCase):
    """Test that rer.sitesearch is properly installed."""

    layer = RER_SITESEARCH_INTEGRATION_TESTING

    def setUp(self):
        """Custom shared utility setup for tests."""
        self.portal = self.layer['portal']
        self.request = self.layer['request']
        self.installer = api.portal.get_tool('portal_quickinstaller')
        self.view = api.content.get_view(
            name="search", context=self.portal, request=self.request
        )

    def test_tabs_mapping(self):
        """
        {
            'all': {'title': u'All'},
            'documents': {'portal_types': ('Document',), 'title': 'Documents'},
            'events': {'portal_types': ('Event',), 'title': 'Events'},
            'file': {'portal_types': ('File',), 'title': 'File'},
            'links': {'portal_types': ('Link',), 'title': 'Links'},
            'news': {'portal_types': ('News Item',), 'title': 'News'},
        }
        """

        tabs_mapping = self.view.tabs_mapping
        self.assertEquals(len(tabs_mapping.keys()), 6)
        self.assertTrue('documents' in tabs_mapping)
        self.assertTrue('news' in tabs_mapping)
        self.assertTrue('links' in tabs_mapping)
        self.assertTrue('file' in tabs_mapping)
        self.assertTrue('events' in tabs_mapping)
        self.assertEquals(
            tabs_mapping['documents']['portal_types'], ('Document',)
        )
        self.assertEquals(tabs_mapping['news']['portal_types'], ('News Item',))
        self.assertEquals(tabs_mapping['events']['portal_types'], ('Event',))

        # change settings
        old_settings = api.portal.get_registry_record(
            'tabs_mapping', interface=IRERSiteSearchSettings
        )
        new_settings = []
        for record in old_settings:
            if record.get('tab_title') in ['News', 'Events']:
                continue
            if record.get('tab_title') == 'Documents':
                new_settings.append(
                    {
                        'tab_title': record.get('tab_title'),
                        'portal_types': ('Document', 'Event', 'News Item'),
                    }
                )
            else:
                new_settings.append(record)
        api.portal.set_registry_record(
            'tabs_mapping', new_settings, interface=IRERSiteSearchSettings
        )

        tabs_mapping = self.view.tabs_mapping
        self.assertTrue('documents' in tabs_mapping)
        self.assertFalse('news' in tabs_mapping)
        self.assertTrue('links' in tabs_mapping)
        self.assertTrue('file' in tabs_mapping)
        self.assertFalse('events' in tabs_mapping)
        self.assertEquals(
            tabs_mapping['documents']['portal_types'],
            ('Document', 'Event', 'News Item'),
        )

        # go back to default
        api.portal.set_registry_record(
            'tabs_mapping', old_settings, interface=IRERSiteSearchSettings
        )

    def test_types_mapping(self):
        """
        {
            'Link': 'links',
            'Document': 'documents',
            'News Item': 'news',
            'Event': 'events',
            'File': 'file',
        }
        """

        types_mapping = self.view.types_mapping

        self.assertEquals(len(types_mapping.keys()), 5)
        self.assertEquals(types_mapping['Link'], 'links')
        self.assertEquals(types_mapping['Document'], 'documents')
        self.assertEquals(types_mapping['News Item'], 'news')
        self.assertEquals(types_mapping['Event'], 'events')
        self.assertEquals(types_mapping['File'], 'file')

        # change settings
        old_settings = api.portal.get_registry_record(
            'tabs_mapping', interface=IRERSiteSearchSettings
        )

        new_settings = []
        for record in old_settings:
            if record.get('tab_title') in ['News', 'Events']:
                continue
            if record.get('tab_title') == 'Documents':
                new_settings.append(
                    {
                        'tab_title': record.get('tab_title'),
                        'portal_types': ('Document', 'Event', 'News Item'),
                    }
                )
            else:
                new_settings.append(record)
        api.portal.set_registry_record(
            'tabs_mapping', new_settings, interface=IRERSiteSearchSettings
        )

        types_mapping = self.view.types_mapping

        self.assertEquals(len(types_mapping.keys()), 5)
        self.assertEquals(types_mapping['Link'], 'links')
        self.assertEquals(types_mapping['Document'], 'documents')
        self.assertEquals(types_mapping['News Item'], 'documents')
        self.assertEquals(types_mapping['Event'], 'documents')
        self.assertEquals(types_mapping['File'], 'file')

        # go back to default
        api.portal.set_registry_record(
            'tabs_mapping', old_settings, interface=IRERSiteSearchSettings
        )

    def test_available_indexes(self):
        """
        {'Subject': 'Subject'}
        """

        indexes = self.view.available_indexes
        self.assertEquals(indexes, {'Subject': 'Subject'})

    def test_hidden_indexes(self):
        indexes = self.view.hidden_indexes
        self.assertEquals(
            indexes,
            {'start': 'Event start', 'end': 'Event end', 'Creator': 'Author'},
        )

    def test_search_results(self):
        self.request.form['SearchableText'] = 'My page'
        results = self.view.results()
        self.assertEquals(results.get('tot_results_len', 0), 20)
        self.assertEquals(len(results.get('results', 0)), 20)
        self.assertEquals(results.get('tabs'), ['all', 'documents'])
        self.assertFalse('indexes_dict' in results)

        # let's find more results
        self.request.form['SearchableText'] = 'page'
        results = self.view.results()
        self.assertEquals(results.get('tot_results_len', 0), 25)
        self.assertEquals(len(results.get('results', 0)), 20)
        self.assertEquals(results.get('tabs'), ['all', 'documents'])
        self.assertTrue('indexes_dict' in results)
        subjects = results['indexes_dict']['Subject']
        self.assertEquals(subjects['values']['apple'], 3)
        self.assertEquals(subjects['values']['kiwi'], 2)

        # let's find more results from different types
        self.request.form['SearchableText'] = 'plone'
        results = self.view.results()
        self.assertEquals(results.get('tot_results_len', 0), 35)
        self.assertEquals(len(results.get('results', 0)), 20)
        self.assertEquals(
            results.get('tabs'), ['all', 'events', 'documents', 'news']
        )
        self.assertTrue('indexes_dict' in results)
        subjects = results['indexes_dict']['Subject']
        self.assertEquals(subjects['values']['apple'], 11)
        self.assertEquals(subjects['values']['mango'], 7)
        self.assertEquals(subjects['values']['kiwi'], 2)

    def test_search_results_faceted(self):
        self.request.form['SearchableText'] = 'plone'
        results = self.view.results()

        self.assertEquals(results.get('tot_results_len', 0), 35)
        self.assertEquals(len(results.get('results', 0)), 20)
        self.assertEquals(
            results.get('tabs'), ['all', 'events', 'documents', 'news']
        )
        self.assertTrue('indexes_dict' in results)
        subjects = results['indexes_dict']['Subject']
        self.assertEquals(subjects['values']['apple'], 11)
        self.assertEquals(subjects['values']['mango'], 7)
        self.assertEquals(subjects['values']['kiwi'], 2)

        self.request.form['Subject'] = 'apple'
        results = self.view.results()
        self.assertEquals(results.get('tot_results_len', 0), 11)
        self.assertEquals(len(results.get('results', 0)), 11)
        self.assertEquals(
            results.get('tabs'), ['all', 'events', 'documents', 'news']
        )
        self.assertTrue('indexes_dict' in results)
        subjects = results['indexes_dict']['Subject']
        self.assertEquals(subjects['values']['mango'], 5)
        self.assertFalse('kiwi' in subjects['values'])
        self.assertEquals(subjects['values']['apple'], 11)

        # only events has mango and apple Subject
        self.request.form['Subject'] = ['apple', 'mango']
        results = self.view.results()
        self.assertEquals(results.get('tot_results_len', 0), 5)
        self.assertEquals(len(results.get('results', 0)), 5)
        self.assertEquals(results.get('tabs'), ['all', 'events'])
        self.assertTrue('indexes_dict' in results)
        subjects = results['indexes_dict']['Subject']
        self.assertEquals(subjects['values']['mango'], 5)
        self.assertFalse('kiwi' in subjects['values'])
        self.assertEquals(subjects['values']['apple'], 5)
