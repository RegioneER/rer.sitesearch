Introduction
============
A product that override basic plone search template and add some new features.
It has a left column with the search form and some additional fields to refine the search:

 * a radio button for choose if make the search in all the portal or in the current 
 path (this field is visible only if we aren't in the root)
 * some customizable indexes (the list of indexes can be set in site_properties->rer_properties)
 
In the central frame there are the results, splitted by portaly types 
('Document','File','News Item','Event','Link','Structured Document', 'FolderTaxonomy'),
but in the future these tabs will be customizables.


Settings
========
In the rer_properties you can set a list of indexes (one per row) to show in search ('indexes_in_search')
with this sintax: "indexName|User-friendly name".

If there aren't any indexes in this property, will be shown only the Subjects.

There is also another property called "tabs_order" that allows to define the order of the tabs.
The sintax is the same (one per row): "portal_type|User-friendly name"
If you want to group some portal_type in the same tab, you need to use the same User-friendly name. For example:

File|Attachments
Image|Attachments

At last, if you want translate user-friendly names in other languages, you only need to create a translation file 
in your product's locales folder with rer.sitesearch domain and a list of entries like this:

msgid "Attachments"
msgstr "Allegati"  