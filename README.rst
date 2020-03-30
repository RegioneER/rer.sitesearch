Introduction
============
A product that override basic plone search template and add some new features.
It has a left column with the search form and some additional fields to refine the search:

- A radio button for choose if search in the current path or all portal
- A list of indexes customizable from control panel

In the central frame there are the results, grouped in tabs (customized in the control panel)


Settings
========
In the control panel (RER Sitesearch) you can set some search parameters.
The most important are "tabs", "indexes" and "hidden indexes".

Tabs
----

There is always a generic tab "All" that shows all search results.
In this configuration panel, you can set a list of additional tabs that will group results by portal_type.

For example you can add a tab "Documents" that contains documents and files.
Another tab "News/events" may contain News Items and Events.

And so on.

You can also define the order of these tabs.

If you are a developer and provide a translation file with "rer.sitesearch" domain, you can translate the tabs
in different languages.

Indexes
-------
The search view shows a list of parameters (indexes in catalog) in the left column to refine the results.

In Sitesearch control-panel you can define which indexes to show, with which label and the order.


Hidden indexes
--------------
Sometimes the users came in the search form after clicking somewhere in the site, for example in a calendar portlet.
The generated url add some query parameters like "start" and "end" to perform the search and show only the events
in the selected dates.

The search engine of rer.sitesearch remove all indexes passed in the query that don't match with it's indexes configuration,
to avoid unwanted searches, so for example if you don't want to show some date filters in the sidebar, these filters (start and end)
will be stripped from the query and the search will be useful.

Hidden indexes configuration allows to define a set of indexes that needs to be kept for special searches like these.
So if a parameter matches this list will be included in the query and not stripped.


Development
===========

Resources are registered on a separate bundle, and are compiled and minified by a grunt task.

To setup node/grunt environment, first of all you need to launch this command::

  yarn install


When you need to change some resources, you need to recompile them, and you have two ways.

::

  yarn develop

this start a watch demon that listen to changes and recompile them automatically

::

  yarn compile

compile all resources


Dependencies
============

This product works only on Plone > 5.0

Previous versions (<3.0.0) still works with Plone4, but aren't on pypi (only on github on branch `plone4`).


Contribute
==========

- Issue Tracker: https://github.com/PloneGov-It/rer.sitesearch/issues
- Source Code: https://github.com/PloneGov-It/rer.sitesearch


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

.. image:: http://www.redturtle.net/redturtle_banner.png
   :alt: RedTurtle Technology Site
   :target: http://www.redturtle.net/
