# -*- coding: utf-8 -*-

from Products.CMFCore.permissions import setDefaultRoles
from AccessControl import ModuleSecurityInfo

security = ModuleSecurityInfo("rer.sitesearch")

PROJECTNAME = 'rer.sitesearch'

#permission to manage sitesearch settings
security.declarePublic("ManageSitesearchSettings")
ManageLocalNewsletter = "rer.sitesearch: Manage Settings"
setDefaultRoles(ManageLocalNewsletter, ('Manager',))
