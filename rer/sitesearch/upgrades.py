# -*- coding: utf-8 -*-
from plone import api
from plone.registry.interfaces import IRegistry
from rer.sitesearch.interfaces import IRERSiteSearchSettings
from zope.component import queryUtility

default_profile = 'profile-rer.sitesearch:default'
uninstall_profile = 'profile-rer.sitesearch:uninstall'


def migrateTo4000(context):
    """
    Replace Persistent Objects with standard list of dictionaries
    and collective.z3cform.datagridfield
    """

    def convert_persistent_data(data):
        return data.__Broken_state__

    setup_tool = api.portal.get_tool(name='portal_setup')
    setup_tool.runAllImportStepsFromProfile(
        'profile-collective.z3cform.datagridfield:default'
    )
    registry = queryUtility(IRegistry)
    settings = registry.forInterface(IRERSiteSearchSettings, check=False)

    tabs_order = settings.tabs_order
    tabs_mapping_value = map(convert_persistent_data, settings.tabs_mapping)
    available_indexes_value = map(
        convert_persistent_data, settings.available_indexes
    )
    hidden_indexes_value = map(convert_persistent_data, settings.hidden_indexes)
    # delete old records
    del registry.records[
        'rer.sitesearch.interfaces.IRERSiteSearchSettings.tabs_mapping'  # noqa
    ]
    del registry.records[
        'rer.sitesearch.interfaces.IRERSiteSearchSettings.available_indexes'  # noqa
    ]
    del registry.records[
        'rer.sitesearch.interfaces.IRERSiteSearchSettings.hidden_indexes'  # noqa
    ]

    # re-import
    setup_tool.runImportStepFromProfile(default_profile, 'plone.app.registry')

    # save new values
    settings.tabs_mapping = tabs_mapping_value
    settings.available_indexes = available_indexes_value
    settings.hidden_indexes = hidden_indexes_value
    settings.tabs_order = tabs_order

