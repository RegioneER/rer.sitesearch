# -*- coding: utf-8 -*-
from plone import api
from plone.app.registry.browser import controlpanel
from Products.statusmessages.interfaces import IStatusMessage
from rer.sitesearch import sitesearchMessageFactory as _
from rer.sitesearch.interfaces import IRERSiteSearchGeneralSettings
from rer.sitesearch.interfaces import IRERSiteSearchHiddensIndexesSettings
from rer.sitesearch.interfaces import IRERSiteSearchIndexesSettings
from rer.sitesearch.interfaces import IRERSiteSearchSettings
from rer.sitesearch.interfaces import IRERSiteSearchTabsSettings
from rer.sitesearch.widgets.blockdatagridfield import BlockDataGridFieldFactory
from z3c.form import button
from z3c.form import field
from z3c.form import group
from z3c.form.interfaces import HIDDEN_MODE


class FormGeneral(group.Group):
    label = _(u"General settings")
    fields = field.Fields(IRERSiteSearchGeneralSettings)


class FormTabs(group.Group):
    label = _(u"Tabs")
    fields = field.Fields(IRERSiteSearchTabsSettings)
    fields['tabs_mapping'].widgetFactory = BlockDataGridFieldFactory


class FormIndexes(group.Group):
    label = _(u"Indexes")
    fields = field.Fields(IRERSiteSearchIndexesSettings)
    fields['available_indexes'].widgetFactory = BlockDataGridFieldFactory


class FormHiddenIndexes(group.Group):
    label = _(u"Hidden indexes")
    fields = field.Fields(IRERSiteSearchHiddensIndexesSettings)
    fields['hidden_indexes'].widgetFactory = BlockDataGridFieldFactory


class RERSiteSearchSettingsEditForm(controlpanel.RegistryEditForm):
    """Media settings form.
    """

    schema = IRERSiteSearchSettings
    groups = (FormGeneral, FormTabs, FormIndexes, FormHiddenIndexes)
    id = "RERSiteSearchSettingsEditForm"
    label = _(u"Site Search settings")
    description = _(
        u"help_sitesearch_settings_editform",
        default=u"Set site search configurations",
    )

    def updateWidgets(self):
        """
        Hide some fields
        """
        super(RERSiteSearchSettingsEditForm, self).updateWidgets()

        qi = api.portal.get_tool(name='portal_quickinstaller')
        if not qi.isProductInstalled('collective.solr'):
            # hide solr enable setting, if collective.solr isn't installed
            for group in self.groups:
                solr_search = group.fields.get('solr_search_enabled')
                if solr_search:
                    solr_search.mode = HIDDEN_MODE

    @button.buttonAndHandler(_('Save'), name='save')
    def handleSave(self, action):
        for k, v in self.request.form.items():
            if ".AA" in k:
                self.request.form[k.replace('.AA', '.0')] = v
                del self.request.form[k]
        data, errors = self.extractData()
        if errors:
            self.status = self.formErrorsMessage
            return
        self.applyChanges(data)
        IStatusMessage(self.request).addStatusMessage(
            _(u"Changes saved"), "info"
        )
        self.context.REQUEST.RESPONSE.redirect("@@sitesearch-settings")

    @button.buttonAndHandler(_('Cancel'), name='cancel')
    def handleCancel(self, action):
        IStatusMessage(self.request).addStatusMessage(
            _(u"Edit cancelled"), "info"
        )
        self.request.response.redirect(
            "%s/%s" % (self.context.absolute_url(), self.control_panel_view)
        )


class RERSiteSearchSettingsControlPanel(controlpanel.ControlPanelFormWrapper):
    """Sitesearch settings control panel.
    """

    form = RERSiteSearchSettingsEditForm
