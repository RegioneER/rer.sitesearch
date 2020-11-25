Introduction
============
A product that override basic Plone search template.

It has a left column with the search form and some additional fields to refine the search:

- Group results by content-types
- List of facets to refine the search

These are all configurable through Plone control panel.


Settings
========
In the control panel (RER Sitesearch) you can set some search parameters.

Types grouping
--------------

You can create groups of portal_types (with custom label) to filter results by type.

For example you can add a "Documents" group that contains Document and File contents.
Another tab "News and Events" that may contain News Items and Events.

And so on.

Indexes
-------
The search view shows a list of parameters (indexes in catalog) in the left column to refine the results.

In Sitesearch control-panel you can define which indexes to show, with which label and the order.


Advanced filters for groups
===========================

In each group types you can select an advanced filter.

Advanced filters are a list of preset filters that allow to add some extra filters when that group is selected in search.

In rer.sitesearch there are only one advanced filter called "Events" that add start and end date filters, but you can add more
presets in your custom package.

Register new advanced filters
-----------------------------

Advanced filters are a list of named adapters, so you can add more and override existing ones if needed.

You just need to register a new named adapter::

    <adapter
      factory = ".my_filters.MyNewFilters"
      name= "my-filters"
    />

And you adapter should have a `label` attribute (needed to show a human-readable name in sitesearch-settings view) and 
return the schema for the additional indexes::

    from zope.component import adapter
    from zope.interface import implementer
    from rer.sitesearch.interfaces import ISiteSearchCustomFilters
    from zope.interface import Interface
    from my.package import _
    from zope.i18n import translate


    @adapter(Interface, Interface)
    @implementer(ISiteSearchCustomFilters)
    class MyNewFilters(object):
    """
    """

    label = _("some_labelid", default=u"Additional filters")

    def __init__(self, context, request):
        self.context = context
        self.request = request

    def __call__(self):
        return {
            "index_a": {
                "type": "string",
                "label": translate(
                    _("filter_index_a_label", default=u"Index A"),
                    context=self.request,
                ),
            },
            "index_b": {
                "type": "date",
                "label": translate(
                    _("filter_index_b_label", default=u"Index B"),
                    context=self.request,
                ),
            },
        }

Where `index_a` and `index_b` are Plone's catalog indexes.

 
Restapi endpoint
================

@search-filters
---------------

There is an helper api endpoint that returns the list of available groups and indexes for the search interface: *@search-filters*::

    > curl -i http://localhost:8080/Plone/@search-filters -H 'Accept: application/json'

And will return a response like this::

    {
      "grouping": [
        {
          "label":
            "Documents"
          ],
          "types": [
            "Document",
            "File"
          ]
        },
        {
          "label": "News and Events",
          "types": [
            "News Item",
            "Event"
          ]
        },
      ],
      "indexes": [
        {
          "label": [
            "Type"
          ],
          "index": "portal_type"
        },
        {
          "label": "Keywords",
          "index": "Subject"
        },
      ]
    }

Dependencies
============

This product works only on Plone > 5.1 and with Python 2 and 3.

Since version 4.0.0, we made an hard rewrite of the package and we now use plone.restapi `@search` endpoint
and React.

Contribute
==========

- Issue Tracker: https://github.com/RegioneER/rer.sitesearch/issues
- Source Code: https://github.com/RegioneER/rer.sitesearch


Credits
=======

Developed with the support of

.. image:: http://www.regione.emilia-romagna.it/rer.gif
   :alt: Regione Emilia-Romagna
   :target: http://www.regione.emilia-romagna.it/

Regione Emilia Romagna supports the `PloneGov initiative`__.

__ http://www.plonegov.it/

Authors
=======

This product was developed by RedTurtle Technology team.

.. image:: https://avatars1.githubusercontent.com/u/1087171?s=100&v=4
   :alt: RedTurtle Technology Site
   :target: http://www.redturtle.net/
