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

Tabs grouping
--------------

You can create groups of portal_types (with custom label) to filter results by type.

For example you can add a "Documents" group that contains Document and File contents.
Another tab "News and Events" that may contain News Items and Events.

And so on.


Indexes
-------
The search view shows a list of parameters (indexes in catalog) in the left column to refine the results.

In Sitesearch control-panel you can define which indexes to show, with which label and the order.


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
