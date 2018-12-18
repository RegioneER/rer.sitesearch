from setuptools import setup, find_packages
import os

version = '3.1.2.dev0'

setup(
    name='rer.sitesearch',
    version=version,
    description="A product that change the base site search of Plone with some new features.",
    long_description=open("README.rst").read()
    + "\n"
    + open(os.path.join("docs", "HISTORY.rst")).read(),
    # Get more strings from
    # http://pypi.python.org/pypi?%3Aaction=list_classifiers
    classifiers=[
        "Framework :: Plone",
        "Framework :: Plone :: 5.0",
        "Framework :: Plone :: 5.1",
        "Programming Language :: Python",
    ],
    keywords='',
    author='RedTurtle Technology',
    author_email='sviluppoplone@redturtle.net',
    url='http://svn.plone.org/svn/collective/',
    license='GPL',
    packages=find_packages(exclude=['ez_setup']),
    namespace_packages=['rer'],
    include_package_data=True,
    zip_safe=False,
    extras_require={
        'test': [
            'plone.app.testing',
            # Plone KGS does not use this version, because it would break
            # Remove if your package shall be part of coredev.
            # plone_coredev tests as of 2016-04-01.
            'plone.testing>=5.0.0',
            'plone.app.contenttypes',
            'plone.app.robotframework[debug]',
        ]
    },
    install_requires=[
        'setuptools',
        'collective.z3cform.datagridfield',
        'plone.api',
    ],
    entry_points="""
      # -*- entry_points -*-
      [z3c.autoinclude.plugin]
      target = plone
      """,
)
