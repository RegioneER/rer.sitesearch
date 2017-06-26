# -*- coding: utf-8 -*-
import json
import urllib

from collective.solr.interfaces import ISolrConnectionManager
from Products.Five.browser import BrowserView
from zope.component import getUtility

from rer.sitesearch.browser.rer_search import RerSearchMixin


class MLTView(BrowserView, RerSearchMixin):
    _mlt_defaults = {
        'mlt': 'true',
        'mlt.fl': 'title,text,url',
        'mlt.qf': 'title^3.0 text^5.0 url^20.0',
        'mlt.count': '3',
    }


    def more_like_this(self):
        params = self._mlt_defaults.copy()
        params['wt'] = 'json'
        # for mlt_arg in self.solr_settings.mlt_args:
        #     query[mlt_arg.arg_key] = mlt_arg.value_oneline
        # q should not be cleaned by self.clean_query:
        # it contains // in http://...
        params['q'] = self.request.form.get('query')
        if not params['q']:
            return []
        manager = getUtility(ISolrConnectionManager)
        connection = manager.getConnection()
        params = urllib.urlencode(params, doseq=True)
        import logging; logging.info("MLT %s/select?%s", connection.solrBase, params)
        response = connection.doGet(connection.solrBase + '/select?' + params, {})
        results = json.loads(response.read())

        # handler = solr.SearchHandler(self.solr, "/select")
        # results = self.do_action(handler, **query)

        mlt = results.get('moreLikeThis', {})
        for key in mlt:
            return mlt[key]
        return []

