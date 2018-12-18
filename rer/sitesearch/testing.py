# -*- coding: utf-8 -*-
from plone.app.contenttypes.testing import PLONE_APP_CONTENTTYPES_FIXTURE
from plone.app.robotframework.testing import REMOTE_LIBRARY_BUNDLE_FIXTURE
from plone.app.testing import applyProfile
from plone.app.testing import FunctionalTesting
from plone.app.testing import IntegrationTesting
from plone.app.testing import PloneSandboxLayer
from plone.app.testing import setRoles
from plone.app.testing import TEST_USER_ID
from plone.testing import z2

import rer.sitesearch
import collective.z3cform.datagridfield


class RERSitesearchLayer(PloneSandboxLayer):

    defaultBases = (PLONE_APP_CONTENTTYPES_FIXTURE,)

    def setUpZope(self, app, configurationContext):
        # Load any other ZCML that is required for your tests.
        # The z3c.autoinclude feature is disabled in the Plone fixture base
        # layer.
        self.loadZCML(package=collective.z3cform.datagridfield)
        self.loadZCML(package=rer.sitesearch)

    def setUpPloneSite(self, portal):
        applyProfile(portal, 'rer.sitesearch:default')
        setRoles(portal, TEST_USER_ID, ['Member', 'Manager'])
        # create some example contents
        for i in range(0, 20):
            """
            create some documents
            """
            portal.invokeFactory(
                'Document',
                'my-page-{0}'.format(str(i)),
                title='My page plone {0}'.format(str(i)),
            )
        for i in range(0, 5):
            """
            create some news with a Subject
            """
            portal.invokeFactory(
                'News Item',
                'my-news-{0}'.format(str(i)),
                title='My news plone {0}'.format(str(i)),
                subject=i % 2 == 0 and ['apple'] or ['mango'],
            )
        for i in range(0, 5):
            """
            create some news with a Subject
            """
            portal.invokeFactory(
                'Event',
                'my-event-{0}'.format(str(i)),
                title='My event plone {0}'.format(str(i)),
                subject=['apple', 'mango'],
            )
        for i in range(0, 5):
            """
            create some documents with a Subject
            """
            portal.invokeFactory(
                'Document',
                'categorized-page-{0}'.format(str(i)),
                title='Categorized page plone {0}'.format(str(i)),
                text='spam chocolate ham eggs',
                subject=i % 2 == 0 and ['apple'] or ['kiwi'],
            )


RER_SITESEARCH_FIXTURE = RERSitesearchLayer()


RER_SITESEARCH_INTEGRATION_TESTING = IntegrationTesting(
    bases=(RER_SITESEARCH_FIXTURE,),
    name='RERSitesearchLayer:IntegrationTesting',
)


RER_SITESEARCH_FUNCTIONAL_TESTING = FunctionalTesting(
    bases=(RER_SITESEARCH_FIXTURE,), name='RERSitesearchLayer:FunctionalTesting'
)


RER_SITESEARCH_ACCEPTANCE_TESTING = FunctionalTesting(
    bases=(
        RER_SITESEARCH_FIXTURE,
        REMOTE_LIBRARY_BUNDLE_FIXTURE,
        z2.ZSERVER_FIXTURE,
    ),
    name='RERSitesearchLayer:AcceptanceTesting',
)
