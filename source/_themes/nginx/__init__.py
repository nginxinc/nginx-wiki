"""
Large parts taken from the Guzzle Sphinx Theme
https://github.com/guzzle/guzzle_sphinx_theme/blob/master/guzzle_sphinx_theme/__init__.py
"""

import os
import xml.etree.ElementTree as ET


def get_path():
    """
    Shortcut for users whose theme is next to their conf.py.
    """
    # Theme directory is defined as our parent directory
    return os.path.abspath(os.path.dirname(os.path.dirname(__file__)))


def setup(app):
    app.connect('html-page-context', add_html_link)
    #app.connect('build-finished', create_sitemap)
    app.sitemap_links = []
    return {'parallel_read_safe': True}

def add_html_link(app, pagename, templatename, context, doctree):
    """As each page is built, collect page names for the sitemap"""
    base_url = app.config['html_theme_options'].get('base_url', '')
    # Edit 09/29/19 Now using nx_sitemap_generator extension to generate sitemap links
    #if base_url:
    #    app.sitemap_links.append(base_url + pagename + ".html")


def html_theme_path():
    return [os.path.dirname(os.path.abspath(__file__))]

