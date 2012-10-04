# -*- coding: utf-8 -*-
from Products.CMFCore.utils import getToolByName
from rer.sitesearch import logger

default_profile = 'profile-rer.sitesearch:default'
uninstall_profile = 'profile-rer.sitesearch:uninstall'


def upgrade(upgrade_product, version):
    """ Decorator for updating the QuickInstaller of a upgrade """
    def wrap_func(fn):
        def wrap_func_args(context, *args):
            p = getToolByName(context, 'portal_quickinstaller').get(upgrade_product)
            setattr(p, 'installedversion', version)
            return fn(context, *args)
        return wrap_func_args
    return wrap_func


@upgrade('rer.sitesearch', '1.6.0')
def to_1_6_0(context):
    """
    """
    logger.info('Upgrading rer.sitesearch to version 1.6.0')
    context.runImportStepFromProfile(default_profile, 'rolemap')
    context.runImportStepFromProfile(default_profile, 'controlpanel')
    logger.info('Reinstalled rolemap and controlpanel')


@upgrade('rer.sitesearch', '2.0.3')
def to_2(context):
    """
    """
    logger.info('Upgrading rer.sitesearch to version 2')
    context.runImportStepFromProfile(default_profile, 'browserlayer')
    context.runImportStepFromProfile(uninstall_profile, 'skins')
    logger.info('Removed skins')
