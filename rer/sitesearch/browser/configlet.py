from plone.z3cform.layout import FormWrapper
from Products.CMFCore.utils import getToolByName
from rer.sitesearch import sitesearchMessageFactory as _
from rer.sitesearch.browser.interfaces import IRerSiteSearchSettings, IRerSiteSearchSettingsForm
from z3c.form import form, field
from z3c.form.browser.textarea import TextAreaWidget
from z3c.form.widget import FieldWidget
from zope.interface import implements


def TextAreaFieldWidget(field, request):
    """IFieldWidget factory for TextWidget."""
    taw = TextAreaWidget(request)
    taw.rows = 10
    return FieldWidget(field, taw)


class PropertySheetProperty(object):
    """
    Gets and sets a value on a property sheet based on a schema field.
    """

    def __init__(self, field, prop_type):
        self._field = field
        self._prop_type = prop_type

    def __get__(self, instance, owner):
        lines_list = []
        lines = instance.context.getProperty(self._field.__name__,
            getattr(self._field, 'default', None))
        for line in lines:
            if not isinstance(line, unicode):
                line = line.decode('utf8')
            line = line.strip()
            if line and line not in lines_list:
                lines_list.append(line)
        return u"\n".join(sorted(lines_list))

    def __set__(self, instance, value):
        if self._prop_type == 'string' and value is None:
            value = u''
        if instance.context.hasProperty(self._field.__name__):
            value = value or u''
            if isinstance(value, unicode):
                value = value.encode('utf8')
            lines = value.splitlines()
            lines_set = set()
            for line in lines:
                line = line.strip()
                if line:
                    lines_set.add(line)
            instance.context.manage_changeProperties(**{self._field.__name__: lines})
        else:
            instance.context.manage_addProperty(self._field.__name__, value,
                self._prop_type)


class SitesearchSettingsAdapter(object):
    """
    """
    def __init__(self, context):
        pprop = getToolByName(context, 'portal_properties')
        self.context = pprop.rer_properties
        self.encoding = pprop.site_properties.default_charset

    tabs_list = PropertySheetProperty(IRerSiteSearchSettings['tabs_list'], 'list')
    indexes_in_search = PropertySheetProperty(IRerSiteSearchSettings['indexes_in_search'], 'list')
    indexes_hiddenlist = PropertySheetProperty(IRerSiteSearchSettings['indexes_hiddenlist'], 'list')


class SitesearchConfig(form.EditForm):
    """
    Fieldset for Like button settings.
    """

    label = _(u'RER:Sitesearch settings')
    fields = field.Fields(IRerSiteSearchSettings)
    fields['tabs_list'].widgetFactory = TextAreaFieldWidget
    fields['indexes_in_search'].widgetFactory = TextAreaFieldWidget
    fields['indexes_hiddenlist'].widgetFactory = TextAreaFieldWidget


class SitesearchSettings(FormWrapper):

    implements(IRerSiteSearchSettingsForm)

    form = SitesearchConfig
