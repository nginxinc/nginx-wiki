"""
Some parts are taken from the Guzzle Sphinx Theme
https://github.com/guzzle/guzzle_sphinx_theme/blob/master/guzzle_sphinx_theme/__init__.py
"""

import os
import xml.etree.ElementTree as ET
import os.path
import datetime


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
    #base_url = untrailingslashit( base_url )
    #base_url = base_url + "/"
    item =  { "link":"", "lastmod":"" }
    
    if base_url:
        if app.builder.name == 'dirhtml':
            new_pagename = rchop(pagename, '/index')
            if new_pagename == 'index':
                item['url'] = "/"
            else:
                item['url'] = "/" + new_pagename
            
        else:
            item['url'] = "/" + pagename + ".html"

        if item['url'] in ['/', '/search']:
            #get system time
            item['lastmod'] = get_system_time()
        elif 'sourcename' in context and context['sourcename']:
            sourcename = rchop( context['sourcename'], ".txt" )
            sourcepath = app.srcdir+"/"+sourcename
            item['lastmod'] = get_file_modified_time( sourcepath )

            
    app.sitemap_links.append(item)

        


def create_sitemap(app, exception):
    """Generates the sitemap.xml from the collected HTML page links"""
    if (not app.config['html_theme_options'].get('base_url', '') or
           exception is not None or
           not app.sitemap_links):
        return

    filename = app.outdir + "/sitemap.xml"
    print("Generating sitemap.xml in %s" % filename)

    base_url = app.config['html_theme_options'].get('base_url', '')
    base_url = untrailingslashit( base_url )

    priority_list = get_priority_dictionary( app.srcdir+"/sitemap_priority_list.txt" )
    exlude_list = get_exclude_list( app.srcdir+"/sitemap_exclude_list.txt" )
    root = ET.Element("urlset")
    root.set("xmlns", "http://www.sitemaps.org/schemas/sitemap/0.9")
    root.set("xmlns:xsi", "http://www.w3.org/2001/XMLSchema-instance")
    root.set("xsi:schemaLocation", "http://www.sitemaps.org/schemas/sitemap/0.9 http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd")

    for item in app.sitemap_links:
        rel_link = "/"
        if item['url'] =="/":
            rel_link = "/"
            link = base_url +"/"
        else:
            rel_link = untrailingslashit( item['url'] )
            link = base_url + rel_link

        if app.builder.name == 'dirhtml':
            link = trailingslashit( link )

        if not is_exluded( rel_link, exlude_list ):
            url = ET.SubElement(root, "url")
            ET.SubElement(url, "loc").text = link
            ET.SubElement(url, "lastmod").text = item['lastmod']
            ET.SubElement(url, "changefreq").text = "daily"
            priority_val = "0.5"
            if rel_link in priority_list and priority_list[rel_link]:
                priority_val = priority_list[rel_link]
            ET.SubElement(url, "priority").text = priority_val

    #ET.ElementTree(root).write(filename, xml_declaration=True,encoding='utf-8', method="xml")
    ET.ElementTree(root).write(filename)
    #add header string
    
    base_url = base_url + "/"
    xml_declaration_string = '<?xml version="1.0" encoding="UTF-8"?>\n<?xml-stylesheet type="text/xsl" href="'+base_url+'sitemap.xsl"?>\n'
    f = open(filename,'r')
    xmldata = f.read()
    f.close()
    f = open(filename, 'w')
    f.write(xml_declaration_string + xmldata )
    f.close()
    create_stylesheet_file( app.outdir + "/sitemap.xsl" )



def rchop(thestring, ending):
    '''
    remove substring only at the end of string
    '''
    if thestring.endswith(ending):
        return thestring[:-len(ending)]
    return thestring

def get_file_modified_time(file):
    '''
    Get file modification time
    '''
    mtime = int( os.path.getmtime(file) )
    return datetime.datetime.fromtimestamp(mtime).strftime('%Y-%m-%dT%H:%M:%SZ')
    #return datetime.datetime.fromtimestamp(mtime).isoformat()
def get_system_time():
    now = datetime.datetime.now()
    return now.strftime('%Y-%m-%dT%H:%M:%SZ')

def get_priority_dictionary(filename):
    d = {}
    if os.path.exists(filename) and os.path.getsize(filename) > 0:
        with open(filename) as f:
            for line in f:
                line = line.strip()
                if line !="":
                    split_list = line.split(" ")
                    if len(split_list) == 2:
                        (val, key) = split_list
                        if key !="/":
                            key = untrailingslashit(key)
                        d[key] = val
    return d
    #end function

def create_stylesheet_file(filename):
    __location__ = os.path.realpath( os.path.join(os.getcwd(), os.path.dirname(__file__)))
    backupfile = os.path.join(__location__, 'sitemap.xsl');
    f = open( backupfile , 'r')
    data= f.read()
    f.close()
    f = open( filename, 'w')
    f.write( data )
    f.close()

def get_exclude_list(filename):
    L = []
    if os.path.exists(filename) and os.path.getsize(filename) > 0:
        with open(filename) as f:
            for line in f:
                line = line.strip()
                if line !="":
                    if( line !="/"):
                        line = untrailingslashit(line)
                    L.append(line)
    return L
    #end function

def is_exluded(str, exclude_list):
    for item in exclude_list:
        if str == item:
            return True
        elif item.endswith("/*"):
            t = item.replace("/*", "/")
            if str.startswith(t):
                return True
    return False
    #end function        




def trailingslashit(url):
    url = untrailingslashit(url)
    url = url + "/"
    return url

def untrailingslashit(url):
    url = rchop(url , "/")
    return url