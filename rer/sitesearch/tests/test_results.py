import unittest2 as unittest

from plone.app.testing import TEST_USER_NAME, TEST_USER_ID
from plone.app.testing import login
from plone.app.testing import setRoles
from zope.component import getMultiAdapter

from plone.app.contentlisting.interfaces import IContentListing
from Products.CMFCore.utils import getToolByName
from rer.sitesearch.testing import SITESEARCH_INTEGRATION_TESTING
from base import BaseTestCase


class TestSearch(BaseTestCase):
    """The name of the class should be meaningful. This may be a class that
    tests the installation of a particular product.
    """
    layer = SITESEARCH_INTEGRATION_TESTING

    def setUp(self):
        """
        """
        self.portal = self.layer['portal']
        self.request = self.layer['request']
        self.markRequestWithLayer()
        # login(self.portal, TEST_USER_NAME)
        # for i in range(0, 80):
        #     """
        #     create some documents
        #     """
        #     self.portal.invokeFactory('Document',
        #                          'my-page' + str(i),
        #                          text='spam spam ham eggs')
        # for i in range(0, 5):
        #     """
        #     create some news with a Subject
        #     """
        #     self.portal.invokeFactory('News Item',
        #                          'my-news' + str(i),
        #                          text='spam chocolate ham eggs',
        #                          subject=('apple', 'mango'))
        # for i in range(0, 5):
        #     """
        #     create some documents with a Subject
        #     """
        #     self.portal.invokeFactory('Document',
        #                          'categorized-page' + str(i),
        #                          text='spam chocolate ham eggs',
        #                          subject=('apple', 'kiwi'))

        # # Commit so that the test browser sees these objects
        # import transaction
        # transaction.commit()

    def test_blacklisted_types_in_results(self):
        """Make sure we don't break types' blacklisting in the new search
        results view.
        """
        sp = getToolByName(self.portal, "portal_properties").site_properties
        q = {'SearchableText': 'spam'}
        res = self.portal.restrictedTraverse('@@search').results(query=q,
                                                            batch=False)
        results = res.get('results', None)
        self.failUnless('my-page1' in [r.getId() for r in results],
                        'Test document is not found in the results.')

        # Now let's exclude 'Document' from the search results:
        sp.types_not_searched += ('Document', )
        res = self.portal.restrictedTraverse('@@search').results(query=q,
                                                            batch=False)
        results = res.get('results', None)
        self.failIf('my-page1' in [r.getId() for r in results],
                    'Blacklisted type "Document" has been found in search \
                     results.')

    def test_search_by_portal_type(self):
        """
        check if we pass "portal_type" filter in the query,
        this is used only if portal_type is an hidden index
        """
        q = {'SearchableText': 'spam', 'portal_type': 'News Item'}
        res = self.portal.restrictedTraverse('@@search').results(query=q,
                                                            batch=False)
        results = res.get('results', None)
        self.failUnless('my-page1' in [r.getId() for r in results],
                        'Test document is not found in the results.')

def test_suite():
    """This sets up a test suite that actually runs the tests in the class
    above
    """
    suite = unittest.TestSuite()
    suite.addTest(unittest.makeSuite(TestSearch))
    return suite
