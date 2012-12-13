# -*- coding: utf-8 -*-

from Products.statusmessages.interfaces import IStatusMessage

from plone.app.registry.browser import controlpanel

from z3c.form import button
from z3c.form import group
from z3c.form import field

from rer.sitesearch.interfaces import IRERSiteSearchSettings, IRERSiteSearchTabsSettings, IRERSiteSearchIndexesSettings, IRERSiteSearchHiddensIndexesSettings
from rer.sitesearch import sitesearchMessageFactory as _


class FormTabs(group.Group):
    label = _(u"Tabs settings")
    fields = field.Fields(IRERSiteSearchTabsSettings)


class FormIndexes(group.Group):
    label = _(u"Indexes settings")
    fields = field.Fields(IRERSiteSearchIndexesSettings)


class FormHiddenIndexes(group.Group):
    label = _(u"Hidden indexes settings")
    fields = field.Fields(IRERSiteSearchHiddensIndexesSettings)


class RERSiteSearchSettingsEditForm(controlpanel.RegistryEditForm):
    """Media settings form.
    """
    schema = IRERSiteSearchSettings
    groups = (FormTabs, FormIndexes, FormHiddenIndexes)
    id = "RERSiteSearchSettingsEditForm"
    label = _(u"Site Search settings")
    description = _(u"help_sitesearch_settings_editform",
                    default=u"Set site search configurations")

    @button.buttonAndHandler(_('Save'), name='save')
    def handleSave(self, action):
        data, errors = self.extractData()
        if errors:
            self.status = self.formErrorsMessage
            return
        changes = self.applyChanges(data)
        IStatusMessage(self.request).addStatusMessage(_(u"Changes saved"),
                                                      "info")
        self.context.REQUEST.RESPONSE.redirect("@@sitesearch-settings")

    @button.buttonAndHandler(_('Cancel'), name='cancel')
    def handleCancel(self, action):
        IStatusMessage(self.request).addStatusMessage(_(u"Edit cancelled"),
                                                      "info")
        self.request.response.redirect("%s/%s" % (self.context.absolute_url(),
                                                  self.control_panel_view))


class RERSiteSearchSettingsControlPanel(controlpanel.ControlPanelFormWrapper):
    """Analytics settings control panel.
    """
    form = RERSiteSearchSettingsEditForm
