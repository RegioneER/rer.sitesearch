from plone.indexer.decorator import indexer
from Products.ATContentTypes.interface import IATEvent
from Products.CMFCore.utils import getToolByName
from DateTime import DateTime

@indexer(IATEvent)
def Date(object, **kw):
    zone = DateTime().timezone()
    quickinstaller = getToolByName(object, 'portal_quickinstaller')
    if (quickinstaller.isProductInstalled('rer.sitesearch')):
        start_field = object.getField('startDate')
        if start_field:
            start=start_field.get(object)
            return start.toZone(zone).ISO()
    else:
        effective = object.getField('effectiveDate').get(object)
        if effective is None:
            effective = object.modified()
        return (effective is None and DateTime().toZone(zone) or
                effective.toZone(zone).ISO())