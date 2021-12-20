Changelog
=========

4.0.0 (2021-12-20)
------------------

- New sitesearch layout and logic (included rer.solrpush support).
  [cekk]


3.2.6 (2020-09-21)
------------------

- Fix bug in query serialization.
  [cekk]


3.2.5 (2020-08-13)
------------------

- Fix query serialization and sort order.
  [cekk]


3.2.4 (2020-04-22)
------------------

- Sort by date now is for *modified* index.
  [cekk]
- Now take care also for sort_order.
  [cekk]


3.2.3 (2019-09-11)
------------------

- Fix translations.
  [cekk]

3.2.2 (2019-02-17)
------------------

- Remove unused upgrade-step for previous revert.
  [cekk]


3.2.1 (2019-01-17)
------------------

- Reverted changes for custom persistent fields. We have some problems with shared zeoserver.
  [cekk]


3.2.0 (2019-01-09)
------------------
- Fix solr support: now if solr is installed but disabled in the control panel,
  all searches doesn't pass through it
  [cekk]
- Remove custom persistent fields in registry.
  [cekk]
- a11y: Added role attribute for portalMessage
  [nzambello]


3.1.1 (2018-10-11)
------------------

- Updated mobile styles
  [pnicolli]
- Accessibility fixes
  [nzambello]


3.1.0 (2017-12-21)
------------------

- Move resources to a separate bundle
  [cekk]
- Improve IE11 compatibility
  [cekk]
- Improve documentation
  [cekk]


3.0.1 (2017-09-18)
------------------

- Fix query generation in sitesearch.js. Now doesn't include ajax_load in the url
  [cekk]


3.0.0 (2017-09-13)
------------------

- more like this
  [mamico]
- Plone 5 compatibility. Drop Plone 4. Use `plone4` branch.
  [cekk]

2.4.3 (2015-12-02)
------------------

- Fix tests
  [mamico]

- Plone 4.3 compatibility
  [cekk]


2.4.2 (2015-01-19)
------------------

- Fix controlpanel icon [cekk]


2.4.1 (2014-12-09)
------------------

- If search term string changes (searchableText) and the form is submitted,
  reset the all query and start with a new one
  [cekk]


2.4.0 (2014-11-24)
------------------

- Add support to collective.solr [cekk]
- Add configuration to limit word length and number of words in SearchableText
  [cekk]
- Rewrite html for search results [cekk]

2.3.3 (2014-02-20)
------------------

- Fixed search results structure [cekk]


2.3.2 (2014-01-13)
------------------

- Fixed timezone handling [cekk]


2.3.1 (2013-12-06)
------------------

- fixed tabs order results [cekk]
- fixed bug in Plone timezones handling for start and end dates [cekk]


2.3.0 (2013-07-08)
------------------

- refactored view to support plone.app.search [cekk]
- moved configuration from site_properties to registry [cekk]
- added tests [cekk]
- customized "skip_links" viewlet for search view [cekk]

2.2.1 (2012-10-12)
------------------

- fixed indexes column population [cekk]


2.2.0 (2012-10-08)
------------------

- refactoring for Plone 4: now the template is removed and replaced by a view [cekk]


2.1.1 (2012-10-04)
------------------

- fixed update step [cekk]
- fixed first tab selection [cekk]


2.1.0 (2012-10-04)
------------------

- moved search from skins to a view, for Plone4 compatibility (it isn't new-search like yet) [cekk]
- added uninstall profile to remove skins [cekk]


2.0.2 (2012-08-23)
------------------

- fixed style for results [cekk]


2.0.1 (2012-08-03)
------------------

- removed search_form.pt [cekk]


2.0.0 (2012-08-02)
------------------

- cleanup old Plone 3.2 garbage [keul]
- fixed search view styles [cekk]
- added configlet to manage sitesearch options [cekk]

1.5.1 (2012/04/23)
------------------

- added class to hidden indexes info div [cekk]
- fixed hidden indexes management [cekk]

1.5.0 (2012/04/16)
------------------

- refactoring sitesearch_view to speed up searches [cekk]

1.4.1 (2012/03/26)
------------------

- fix translation [cekk]

1.4.0 (2012/03/12)
------------------

- Customized Date index for events [cekk]
- Show date and location in events [cekk]
- Use Date index to sort on dates [cekk]
- Add "hidden indexes" configuration [cekk]

1.3.1 (2011/11/28)
------------------

- Fix error in title whent the path is incorrect [cekk]

1.3.0 (2011/11/28)
------------------

- Fix layout and css [nekorin]

1.2.0 (2011/06/20)
------------------

- Add tabs customization [cekk]

1.1.1 (2011/04/07)
------------------

- Remove alphabetical sorting for indexes. Now indexes are sorted in the configuration panel [cekk]

1.1.0 (2011/04/04)
------------------

- Remove taxonomies specific tab. Now needs to be set in the config panel [cekk]

1.0.6 (2010/11/08)
------------------

- Fix js for batching [cekk]

1.0.5 (2010/11/08)
------------------

- Categories are filtered beside the selected type [cekk]

1.0.4 (2010/11/04)
------------------

- Remove setup.cfg [cekk]

1.0.3 (2010/11/04)
------------------

- Refectoring for browser history [cekk]

1.0.2 (2010/10/28)
------------------

- Remove folder title in the view [cekk]

1.0.1 (2010/10/28)
------------------

- Remove searchSubject index [cekk]
- Change fieldname for sorting [cekk]
- Add header with folder name [jacopo e cekk]

1.0.0 (2010/09/23)
------------------

- Initial release
