# -*- coding: utf-8 -*-

from __future__ import print_function

import os
import re
import sys
from datetime import datetime, timedelta

from sphinx.util.console import purple, darkgreen, darkred, white

LINE_RE = re.compile(r'^([^:]+):(\d+): \[([^\]]+)\] (\S+)(.*)$')
REASON_RE = re.compile(r'\s*(.+) (?:for|with) url:.+')

DOMAIN_ROLE_MAP = {
    'https://github.com/': 'github',
    'https://bitbucket.org/': 'bitbucket'
}


def error_exit(msg):
    print('linkfix: error: {}\n'.format(msg), file=sys.stderr)
    sys.exit(1)


def url_path(domain, url):
    result = url.split(domain, 1)[-1]
    result = result[:-1] if result.endswith('/') else result
    return result


def replace_roles(domain, text, src, dst):
    changed = 0
    role = DOMAIN_ROLE_MAP[domain]

    src_part = url_path(domain, src)
    dst_part = url_path(domain, dst)

    pttn = r':{}:`([^<`]+)<{}/?>`'.format(role, src_part)
    repl = r':{}:`\g<1><{}>`'.format(role, dst_part)
    text, n = re.subn(pttn, repl, text)
    changed += n

    pttn = r':{}:`{}/?`'.format(role, src_part)
    repl = r':{}:`{}`'.format(role, dst_part)
    text, n = re.subn(pttn, repl, text)
    changed += n

    return changed, text


def update_redirects(redirects):
    replacements_made = 0

    # for all files that redirects were found in...
    for filename, redirects in redirects.items():

        # read the entire text from the rst file
        rst_filename = os.path.join('source', filename)
        with open(rst_filename, 'r') as fp:
            text = fp.read()

        # for all redirects found in the rst file...
        esc_redirects = {}
        for src, dst in redirects.items():

            # if src url is in the file add add it to a redirects map
            if src in text:
                esc_redirects[re.escape(src)] = dst
                continue

            # check if src is actually written as a sphinx role in the file
            for domain in DOMAIN_ROLE_MAP:
                if src.startswith(domain) and dst.startswith(domain):
                    n, text = replace_roles(domain, text, src, dst)
                    replacements_made += n
                    break
            else:
                # if it wasn't a sphinx role then print an error message
                error_exit('{!r} not found in {!s}'.format(src, filename))

        # create a giant regex that matches all (non-role) urls to change
        pttn = re.compile('|'.join(esc_redirects))

        # search and replace all non-role redirects in the file
        text, n = pttn.subn(lambda m: esc_redirects[re.escape(m.group(0))], text)
        replacements_made += n

        # write the resulting text back into the file
        with open(rst_filename, 'w') as fp:
            fp.writelines(text)

    return replacements_made


def main():
    # check that the linkcheck file exists
    linkcheck_file = os.path.join('build', 'linkcheck', 'output.txt')
    if not os.path.exists(linkcheck_file):
        error_exit('no linkcheck output file; run make linkcheck')

    # check that it hasn't been more than a day since the last linkcheck
    last_linkcheck = datetime.fromtimestamp(os.path.getmtime(linkcheck_file))
    if datetime.now() - last_linkcheck > timedelta(days=1):
        error_exit('linkcheck output outdated; run make linkcheck')

    # parse each line of the linkcheck output.txt file
    with open(linkcheck_file) as fp:
        lines = fp.readlines()

    local = {}
    broken = {}
    perm_redirects = {}
    temp_redirects = {}

    for line in lines:
        m = LINE_RE.match(line)
        if m is None:
            error_exit('could not parse: {!r}'.format(line))
            continue

        filename, lineno, status, url, more = m.groups()

        # ignore links with certain status messages
        if '429' in more and 'Too Many Requests' in more.title():
            continue

        # gather data for broken urls
        elif status == 'broken':
            url = url.rstrip(':')
            m = REASON_RE.match(more)
            more = m.group(1) if m else more.strip()
            broken.setdefault(filename, {})[url] = more

        # gather local links
        elif status == 'local':
            local.setdefault(filename, set()).add(url)

        # gather data for permanent redirects
        elif status == 'redirected permanently':
            dst = more.split(' to ', 1)[-1].strip()
            perm_redirects.setdefault(filename, {})[url] = dst

        # gather data for ...other ...temporary? redirects
        elif status.startswith('redirected'):
            dst = more.split(' to ', 1)[-1].strip()
            temp_redirects.setdefault(filename, {})[url] = dst

    n = update_redirects(perm_redirects)

    print()
    urls = {x for urls in perm_redirects.values() for x in urls.items()}
    print(white('Found {} links returning 301s [{} replacements made]'.format(len(urls), n)))
    for src, dst in sorted(urls):
        print(src + darkgreen(' -> ' + dst))

    print()
    urls = {x for urls in temp_redirects.values() for x in urls.items()}
    print(white('Found {} links returning other 300 codes [no replacements made]'.format(len(urls))))
    for src, dst in sorted(urls):
        print(src + purple(' -> ' + dst))

    print()
    urls = {x for urls in broken.values() for x in urls.items()}
    print(white('Found {} links returning error codes (excluding 429)'.format(len(urls))))
    for url, reason in sorted(urls):
        print(url + darkred(' - ' + reason))


if __name__ == '__main__':
    main()
