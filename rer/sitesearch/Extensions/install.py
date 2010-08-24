from Products.CMFCore.utils import getToolByName

def install(portal):
    setup_tool = portal.portal_setup
    setup_tool.setImportContext('profile-rer.sitesearch:default')
    setup_tool.runAllImportSteps()

    pc = getToolByName(portal, 'portal_catalog')
    indexes = pc.indexes()
    my_index = ["searchSubject"]
    for indice in my_index:
        if indice in indexes:
            portal.plone_log("Found the '%s' index in the catalog, nothing changed." %indice)
        else:
            pc.addIndex(name=indice,type="KeywordIndex")
            portal.plone_log("Added '%s' (KeywordIndex) to the catalog." %indice)

def uninstall(portal, reinstall=False):
    if not reinstall:
        setup_tool = portal.portal_setup
        setup_tool.setImportContext('profile-rer.sitesearch:uninstall')
        setup_tool.runAllImportSteps()