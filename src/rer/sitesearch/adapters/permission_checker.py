from AccessControl import getSecurityManager
from plone.app.z3cform.interfaces import IPloneFormLayer
from plone.autoform.interfaces import WIDGETS_KEY
from plone.autoform.interfaces import WRITE_PERMISSIONS_KEY
from plone.autoform.utils import resolveDottedName
from plone.dexterity.interfaces import IDexterityContent
from plone.dexterity.utils import iterSchemata
from plone.supermodel.utils import mergedTaggedValueDict
from z3c.form.interfaces import IFieldWidget
from z3c.form.interfaces import IForm
from zope.component import adapter
from zope.component import queryMultiAdapter
from zope.component import queryUtility
from zope.deprecation import deprecated
from zope.interface import implementer
from zope.publisher.browser import TestRequest
from zope.security.interfaces import IPermission
from plone.app.dexterity.permissions import GenericFormFieldPermissionChecker
from rer.sitesearch.interfaces import IRerSiteSearchSettingsForm

import six

try:
    from plone.app.z3cform.interfaces import IFieldPermissionChecker
except ImportError:
    # bbb for < plone 5.2rc2
    from plone.app.widgets.interfaces import IFieldPermissionChecker


@adapter(IRerSiteSearchSettingsForm)
@implementer(IFieldPermissionChecker)
class SiteSearchSettingsPermissionChecker(GenericFormFieldPermissionChecker):
    """
    """

    def validate(self, field_name, vocabulary_name=None):
        if field_name in ["types"]:
            return True
        return super(SiteSearchSettingsPermissionChecker, self).validate(
            field_name, vocabulary_name
        )
