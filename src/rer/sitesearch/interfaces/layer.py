from zope.interface import Interface
from z3c.form.interfaces import IForm


class IRERSiteSearchLayer(Interface):
    """A layer specific for rer.sitesearch
    """


class IRerSiteSearchSettingsForm(IForm):
    """
    Marker interface
    """
