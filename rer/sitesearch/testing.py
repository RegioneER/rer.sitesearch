# -*- coding: utf-8 -*-

from zope.configuration import xmlconfig

from plone.testing import z2

from plone.app.testing import PLONE_FIXTURE
from plone.app.testing import PloneSandboxLayer
from plone.app.testing import IntegrationTesting
from plone.app.testing import FunctionalTesting
from plone.app.testing import applyProfile
from plone.app.testing import setRoles
from plone.app.testing import TEST_USER_NAME, TEST_USER_ID
from plone.app.testing import login
from plone.app.testing.selenium_layers import SELENIUM_PLONE_FUNCTIONAL_TESTING


class SiteSearch(PloneSandboxLayer):

    defaultBases = (PLONE_FIXTURE, )

    def setUpZope(self, app, configurationContext):
        # Load ZCML for this package
        import rer.sitesearch
        xmlconfig.file('configure.zcml',
                       rer.sitesearch,
                       context=configurationContext)
        z2.installProduct(app, 'rer.sitesearch')

    def setUpPloneSite(self, portal):
        applyProfile(portal, 'rer.sitesearch:default')
        setRoles(portal, TEST_USER_ID, ['Member', 'Manager'])
        for i in range(0, 80):
            """
            create some documents
            """
            portal.invokeFactory('Document',
                                 'my-page' + str(i),
                                 title='My page %s' % str(i),
                                 text='spam spam ham eggs')
        for i in range(0, 5):
            """
            create some news with a Subject
            """
            portal.invokeFactory('News Item',
                                 'my-news' + str(i),
                                 title='My news %s' % str(i),
                                 text='spam chocolate ham eggs',
                                 subject=('apple', 'mango'))
        for i in range(0, 5):
            """
            create some documents with a Subject
            """
            portal.invokeFactory('Document',
                                 'categorized-page' + str(i),
                                 title='Categorized page %s' % str(i),
                                 text='spam chocolate ham eggs',
                                 subject=('apple', 'kiwi'))


class SearchSeleniumLayer(SiteSearch):
    """Install rer.sitesearch"""

    defaultBases = (PLONE_FIXTURE, )


SITESEARCH_FIXTURE = SiteSearch()
SELENIUM_SITESEARCH_FIXTURE = SearchSeleniumLayer()

SITESEARCH_INTEGRATION_TESTING = \
    IntegrationTesting(bases=(SITESEARCH_FIXTURE, ),
                       name="SiteSearch:Integration")
SITESEARCH_FUNCTIONAL_TESTING = \
    FunctionalTesting(bases=(SITESEARCH_FIXTURE, ),
                       name="SiteSearch:Functional")
SELENIUM_SITESEARCH_TESTING = \
    FunctionalTesting(bases=(SELENIUM_SITESEARCH_FIXTURE,
                             SELENIUM_PLONE_FUNCTIONAL_TESTING),
                             name="SiteSearch:Selenium")
