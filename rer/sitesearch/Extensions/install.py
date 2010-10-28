from Products.CMFCore.utils import getToolByName

def install(portal):
    setup_tool = portal.portal_setup
    setup_tool.setImportContext('profile-rer.sitesearch:default')
    setup_tool.runAllImportSteps()

def uninstall(portal, reinstall=False):
    if not reinstall:
        setup_tool = portal.portal_setup
        setup_tool.setImportContext('profile-rer.sitesearch:uninstall')
        setup_tool.runAllImportSteps()