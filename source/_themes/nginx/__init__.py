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
    app.connect('build-finished', create_sitemap)
    app.sitemap_links = []
    return {'parallel_read_safe': True}

def add_html_link(app, pagename, templatename, context, doctree):
    """As each page is built, collect page names for the sitemap"""
    base_url = app.config['html_theme_options'].get('base_url', '')
    # Edit 09/29/19 Now using nx_sitemap_generator extension to generate sitemap links
    #if base_url:
    #    app.sitemap_links.append(base_url + pagename + ".html")


def create_sitemap(app, exception):
    """Generates the sitemap.xml from the collected HTML page links"""
    if (not app.config['html_theme_options'].get('base_url', '') or
           exception is not None or
           not app.sitemap_links):
        return

    filename = app.outdir + "/sitemap.xml"
    print("Generating sitemap.xml in %s" % filename)

    root = ET.Element("urlset")
    root.set("xmlns", "http://www.sitemaps.org/schemas/sitemap/0.9")

    for link in app.sitemap_links:
        url = ET.SubElement(root, "url")
        ET.SubElement(url, "loc").text = link

    ET.ElementTree(root).write(filename)


def html_theme_path():
    return [os.path.dirname(os.path.abspath(__file__))]

