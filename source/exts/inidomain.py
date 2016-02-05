# -*- coding: utf-8 -*-
"""
    inidomain
    ~~~~~~~~~

    An INI file domain.

    This domain provides `ini:key` directive and role.

    :copyright: 2015 by Andrew Hutchings (andrew@linuxjedi.co.uk)
    :license: BSD, see LICENSE for details.
"""

__version__ = "0.1.0"
# for this module's sphinx doc
release = __version__
version = release.rsplit('.', 1)[0]

from domaintools import custom_domain
import re

def setup(app):
    app.add_domain(custom_domain('IniDomain',
        name  = 'ini',
        label = "INI File", 

        elements = dict(
            key = dict(
                objname      = "INI Key",
                indextemplate = "pair: %s; INI Key",
            )
        )))

# vim: ts=4 : sw=4 : et
