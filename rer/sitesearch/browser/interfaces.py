from zope.interface import Interface
from plone.app.layout.globals.interfaces import IViewView


class IRERSiteSearchLayer(Interface):
    """A layer specific for rer.sitesearch
    """


class IRerSiteSearch(IViewView):
    """Interface for SiteSearchView"""


class IRerSiteSearchSettingsForm(Interface):
    """
    Marker interface
    """
