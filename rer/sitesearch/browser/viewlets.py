# -*- coding: utf-8 -*-
from plone.app.layout.viewlets.common import SkipLinksViewlet
from Products.Five.browser.pagetemplatefile import ViewPageTemplateFile
from rer.sitesearch.browser.interfaces import IRerSiteSearch
from zope.component import getMultiAdapter


class RERSkipLinksViewlet(SkipLinksViewlet):
    """
    custom viewlet with custom links
    """
    index = ViewPageTemplateFile('templates/skip_links.pt')

    def update(self):
        context_state = getMultiAdapter((self.context, self.request),
                                        name=u'plone_context_state')
        self.current_page_url = context_state.current_page_url
        is_search_view = False
        for item in self.aq_chain:
            if IRerSiteSearch.providedBy(item):
                is_search_view = True
                break
        if is_search_view:
            self.content_id = "search-results"
            self.navigation_id = "search-filter"
        else:
            self.content_id = "content"
            self.navigation_id = "portal-globalnav"
