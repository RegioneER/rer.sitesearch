from Products.CMFPlone.CatalogTool import registerIndexableAttribute

def searchSubject(obj,portal,vars):
    """A silly method for indexing things in a meaningless way
    """
    type = obj.getTypeInfo().getId()
    if type != 'Folder' and type != 'FolderTaxonomy':
        return obj.Subject()
    else:
        raise AttributeError

def initialize(context):
    """Initializer called when used as a Zope 2 product."""
    registerIndexableAttribute('searchSubject',searchSubject)
