
.. meta::
   :description: An example NGINX configuration that preloads Memcache.

Memcache Preload
================

Ingredients
-----------

.. warning::
    This setups is only a proof of concept = means: experimental, but works for me.

#. serve the requests

   * `NGINX <http://nginx.org/en/docs/http/ngx_http_memcached_module.html>`_: webserver with memcache api

   * `couchbase <http://www.couchbase.com/nosql-databases/downloads>`_: persistent memcache server

#. preload memcache

   * python: a programming language

   * fuse: file system in user space

   * `fuse.py <http://code.google.com/p/fusepy/source/browse/trunk/fuse.py>`_: python library for fuse

   * `memcache.py <http://bazaar.launchpad.net/~python-memcached-team/python-memcached/trunk/view/head:/memcache.py>`_: python library for memcache

   * ``memfis.py``: experimental fuse file system (new: symbolic links)

Server Setup
------------

Installation
^^^^^^^^^^^^

.. code-block:: bash

    apt-get install nginx-full
    cp /etc/nginx/sites-available/default /etc/nginx/sites-available/default.dpkg-dist
    vi /etc/nginx/sites-available/default
    dpkg -i membase-server-community_<arch>_<version>.deb
    # Browser: http://<hostname>:8091

/etc/nginx/sites-available/default
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

.. code-block:: nginx

    server {
            listen          80;
            server_name     <webserver>;
            root            /var/www/;

            location / {
                    index                   index.html;
                    default_type            text/plain;
                    set $memcached_key      memfis://<hostname>$uri;
                    memcached_pass          127.0.0.1:11211;
            }
    }

To do:
* full example with error and fallback
* scetch the goal of a complete system with php offloading

Preload Memcache
----------------

Preparation
^^^^^^^^^^^

.. code-block:: bash

    mkdir /mnt/memfis
    mkdir memfis.d
    cd memfis.d
    vi memfis.py fuse.py memcache.py
    chmod +x memfis.py

Mount, Preload, Unmount
^^^^^^^^^^^^^^^^^^^^^^^

.. code-block:: bash

    ./memfis.py /mnt/memfis
    cp -a <source>/* /mnt/memfis
    sudo unmount /mnt/memfis

MemFiS Filesystem
^^^^^^^^^^^^^^^^^

.. code-block:: python

    #!/usr/bin/env python
    # -*- coding: utf-8 -*-
    """memcache filesystem, v.20120415"""
    """(c) 2011-2012, titusx at gmx.de"""


    from time   import time, strftime
    from sys    import argv, exit
    from socket import gethostname
    from os     import getuid, getgid
    from errno  import *
    from stat   import S_IFDIR, S_IFREG, S_IFLNK
    from fuse   import FUSE, FuseOSError, Operations
    from json   import dumps, loads
    import memcache as mc


    # a class with preferences an handy functions
    class Auxiliary(object):

        # custom ini
        def ini(self):
            # debug switch (off="None") and path
            self.debugp = '/tmp/memfis-debug.log'
            # connection to the memcache server
            self.server = ["127.0.0.1:11211"]
            # hook for the (open) memcache object
            self.mcache = None
            # don't use "access time"
            self.noatim = True
            # prefix for each database entry
            self.prefix = "memfis://" + gethostname()
            # prefix of the file counter
            self.countr = self.prefix + "/?cntr"
            # prefix of the validation counter
            self.erased = self.prefix + "/?free"
            # init time of the filesystem
            self.initim = self.now()
            # owner of the filessystem
            self.iniuid = getuid()
            self.inigid = getgid()

        # the time function of the file system
        def now(self):
            return time()

        # constructs a default attribute
        def mka(self):
            Attr = dict(
                st_ino     = 0,
                #st_dev     = 0, # currently unused
                #st_rdev    = 0, # currently unused
                st_blksize = 1024, #20000000
                st_blocks  = 1,
                st_nlink   = 2, # currently wrong used
                st_size    = 4,
                st_mode    = 0,
                st_uid     = self.iniuid,
                st_gid     = self.inigid,
                st_atime   = self.initim,
                st_mtime   = self.initim,
                st_ctime   = self.initim )
            return Attr

        # writes debug lines into log file
        def dbg(self, dmsg):
            if self.debugp:
                stamp = strftime("%Y%m%d-%H:%M.%S")
                log = open(self.debugp, 'a')
                log.write("[%s] %s\n" % (stamp, dmsg))
                log.close()
            return

        # generate the attribute key from a given path
        def p2a(self, path):
            return self.prefix + path + "?attr"

        # generate the extended key from a given path
        def p2x(self, path):
            return self.prefix + path + "?xttr"

        # generate the data key from a given path
        def p2d(self, path):
            return self.prefix + path

        # generate the node key from a given counter
        def c2n(self, cntr):
            return self.prefix + "/?node=%08i" % (cntr)

        # splits a file path into parent directory and file name
        def par(self, path):
            if path == "/":
                return None
            Splt = path.rsplit("/",1)
            if Splt[0] == "":
                Splt[0] = "/"
            return Splt

        # adds a pointer, increases and returns the counter
        def cnt(self, path):
            Cntr = self.mcache.incr(self.countr)
            try:
                self.mcache.add(self.c2n(Cntr), path)
            except:
                raise FuseOSError(EEXIST)
            return Cntr

        # increments the counter of erased objects, return pointer
        def fre(self, cntr):
            self.mcache.incr(self.erased)
            return self.c2n(cntr)

        # encodes a complex object into a string
        def enc(self, pobj):
            return dumps(pobj, sort_keys=True, indent=1)

        # decodes a string into a complex object
        def dec(self, strg):
            return loads(strg)

        # adds a node to the file system
        def mkn(self, path, mode, size):
            self.dbg("%-9s %s (mode: '%s'=%i)" % ("addnode:", path, oct(mode), mode))
            JAttr = self.mcache.get(self.p2a(path))
            if JAttr != None:
                raise FuseOSError(EEXIST) # datei existiert
            # a. processing the parent directory
            Splt = self.par(path)
            if Splt != None:
                Attr = self.dec(self.mcache.get(self.p2a(Splt[0])))
                List = self.dec(self.mcache.get(self.p2d(Splt[0])))
                List.append(Splt[1])
                List.sort()
                Attr['st_size']  = len(self.enc(List))
                Attr['st_mtime'] = self.now()
                Attr['st_atime'] = Attr['st_mtime']
                if S_IFDIR & mode:
                    Attr['st_nlink'] += 1
                self.mcache.set(self.p2a(Splt[0]), self.enc(Attr))
                self.mcache.set(self.p2d(Splt[0]), self.enc(List))
            # b. processing the new node itself
            Attr = self.mka()
            Attr['st_ino']   = self.cnt(path) # new inode
            Attr['st_uid']   = self.iniuid
            Attr['st_gid']   = self.inigid
            Attr['st_ctime'] = self.now()
            Attr['st_mtime'] = Attr['st_ctime']
            Attr['st_atime'] = Attr['st_ctime']
            Attr['st_mode']  = mode
            Attr['st_size']  = size
            if S_IFDIR & mode:
                Attr['st_nlink'] = 2
            else:
                Attr['st_nlink'] = 1
            self.mcache.set(self.p2a(path), self.enc(Attr))
            return Attr['st_ino']

        # deletes a node from the file system
        def rmn(self, path, dire):
            self.dbg("%-9s %s" % ("delnode:", path))
            if path == "/":
                raise FuseOSError(EPERM) # nicht berechtigt
            JAttr = self.mcache.get(self.p2a(path))
            if JAttr == None:
                raise FuseOSError(ENOENT) # daten nicht gefunden
            else:
                Attr = self.dec(JAttr)
            if dire == True and Attr['st_nlink'] > 2:
                raise FuseOSError(ENOTEMPTY) # verzeichnis nicht leer
            if dire == False and Attr['st_nlink'] != 1:
                raise FuseOSError(ENOSYS) # nicht implementiert
            # deleting attribues, data and inode pointer
            self.mcache.delete_multi([self.p2a(path), self.p2d(path), self.fre(Attr['st_ino'])])
            Splt = self.par(path)
            if Splt != None:
                Attr = self.dec(self.mcache.get(self.p2a(Splt[0])))
                List = self.dec(self.mcache.get(self.p2d(Splt[0])))
                # removing entry from parent directory
                List.remove(Splt[1])
                Attr['st_size']  = len(self.enc(List))
                Attr['st_mtime'] = self.now()
                Attr['st_atime'] = Attr['st_mtime']
                if dire == True:
                    Attr['st_nlink'] -= 1
                self.mcache.set(self.p2a(Splt[0]), self.enc(Attr))
                self.mcache.set(self.p2d(Splt[0]), self.enc(List))


    # the fuse file system class
    class MemFiS(Operations, Auxiliary):

        # initialises the file system
        #def __init__(self, *args, **kw):
        def init(self, path):
            # load the preferences (incl. debug)
            self.ini()
            # generate a log entry
            self.dbg("__INIT__")
            # connect to a server and store the hook
            self.mcache = mc.Client(self.server)
            # ONLY FOR TESTING - REMOVE FOR PRODUCTION
            # deletes the whole database at startup
            #if self.debugp:
            #    self.mcache.flush_all()
            # start a new file system if nothin exitst
            Cntr = self.mcache.get(self.countr)
            if Cntr == None:
                self.mcache.set(self.countr, 0)
                self.mcache.set(self.erased, 0)
            Attr = self.mcache.get(self.p2a("/"))
            if Attr == None:
                self.mkdir("/", 493)

        #def __del__(self):
        def destroy(self, path):
            self.dbg("__DEL__")
            # ONLY FOR TESTING - REMOVE FOR PRODUCTION
            # delete the whole database at shutdown
            #if self.debugp:
            #    self.mcache.flush_all()
            # disconnect from the server
            self.mcache.disconnect_all()

        def access(self, path, mode):
            self.dbg("%-9s %s (mode: '%s'=%i)" % ("ACCESS:", path, oct(mode), mode))
            return 0

        def chmod(self, path, mode):
            self.dbg("%-9s %s (mode: '%s'=%i)" % ("CHMOD:", path, oct(mode), mode))
            # load the attributes
            JAttr = self.mcache.get(self.p2a(path))
            # decode attributes if exists
            if JAttr == None:
                raise FuseOSError(ENOENT) # daten nicht gefunden
            else:
                Attr = self.dec(JAttr)
            # adjust changed mode and save it
            if Attr['st_mode'] != mode:
                Attr['st_mode'] = mode
                Attr['st_mtime'] = self.now()
                self.mcache.set(self.p2a(path), self.enc(Attr))

        def chown(self, path, usid, grid):
            self.dbg("%-9s %s (uid: %i, gid: %i)" % ("CHOWN:", path, usid, grid))
            JAttr = self.mcache.get(self.p2a(path))
            if JAttr == None:
                raise FuseOSError(ENOENT) # daten nicht gefunden
            else:
                Attr = self.dec(JAttr)
            Dirt = False
            # adjust user id
            if Attr['st_uid'] != usid and usid >= 0:
                Attr['st_uid'] = usid
                Dirt = True
            # adjust group id
            if Attr['st_gid'] != grid and grid >= 0:
                Attr['st_gid'] = grid
                Dirt = True
            # save changed attributes
            if Dirt != False:
                Attr['st_mtime'] = self.now()
                self.mcache.set(self.p2a(path), self.enc(Attr))

        # creates an inode with file attributes
        def create(self, path, mode):
            self.dbg("%-9s %s (mode: '%s'=%i)" % ("CREATE:", path, oct(mode), mode))
            return self.mkn(path, S_IFREG|mode, 0)

        # loads the attributes object
        def getattr(self, path, fhdl=None):
            self.dbg("%-9s %s" % ("GETATTR:", path))
            JAttr = self.mcache.get(self.p2a(path))
            if JAttr == None:
                raise FuseOSError(ENOENT) # daten nicht gefunden
            else:
                return self.dec(JAttr)

        # creates a new directory
        def mkdir(self, path, mode):
            self.dbg("%-9s %s (mode: '%s'=%i)" % ("MKDIR:", path, oct(mode), mode))
            Data = self.enc(['.', '..'])
            self.mkn(path, S_IFDIR|mode, len(Data))
            self.mcache.set(self.p2d(path), Data)

        def read(self, path, size, oset, fhdl):
            self.dbg("%-9s %s (size: %i, offset: %i)" % ("READ:", path, size, oset))
            if oset != 0:
                # to do
                raise FuseOSError(ENOSYS) # nicht implementiert
            JAttr = self.mcache.get(self.p2a(path))
            if JAttr == None:
                raise FuseOSError(ENOENT) # daten nicht gefunden
            else:
                Attr = self.dec(JAttr)
            #if Attr['st_size'] != size:
            #    raise FuseOSError(EINVAL) # ungültiges argument
            if self.noatim == False:
                Attr['st_atime'] = self.now()
                self.mcache.set(self.p2a(path), self.enc(Attr))
            return self.mcache.get(self.p2d(path))

        def readdir(self, path, fhdl):
            self.dbg("%-9s %s" % ("READDIR:", path))
            List = []
            for e in self.dec(self.read(path, 0, 0, fhdl)):
                List.append( e.encode('ascii') )
            return List

        def readlink(self, path):
            self.dbg("%-9s %s" % ("READLINK:", path))
            return self.mcache.get(self.p2d(path))

        def rmdir(self, path):
            self.dbg("%-9s %s" % ("RMDIR:", path))
            self.rmn(path, True)

        def symlink(self, path, orig):
            self.dbg("%-9s %s (path: %s)" % ("SYMLINK:", path, orig))
            self.mkn(path, S_IFLNK|511, len(orig))
            self.mcache.set(self.p2d(path), orig)

        # adjusts file size
        def truncate(self, path, leng, fhdl):
            self.dbg("%-9s %s (len: %i)" % ("TRUNCATE:", path, leng))
            JAttr = self.mcache.get(self.p2a(path))
            if JAttr == None:
                raise FuseOSError(ENOENT) # daten nicht gefunden
            else:
                Attr = self.dec(JAttr)
                Attr['st_size'] = leng
                self.mcache.replace(self.p2a(path), self.enc(Attr))

        def write(self, path, buff, oset, fhdl):
            self.dbg("%-9s %s (buffer: %i, offset: %i)" % ("WRITE:", path, len(buff), oset))
            JAttr = self.mcache.get(self.p2a(path))
            if JAttr == None:
                raise FuseOSError(ENOENT) # daten nicht gefunden
            else:
                Attr = self.dec(JAttr)
            #if oset != Attr['st_size']:
            #    raise FuseOSError(ESPIPE) # unzulaessige suche
            if Attr['st_size'] + len(buff) > 20000000:
                raise FuseOSError(EFBIG) # datei zu gross
            Attr['st_size'] += len(buff)
            Attr['st_mtime'] = self.now()
            Attr['st_atime'] = Attr['st_mtime']
            self.mcache.replace(self.p2a(path), self.enc(Attr))
            if oset == 0:
                self.mcache.add(self.p2d(path), buff)
            else:
                self.mcache.append(self.p2d(path), buff)
            return len(buff)

        def unlink(self, path):
            self.dbg("%-9s %s" % ("UNLINK:", path))
            self.rmn(path, False)


    if __name__ == '__main__':
        if len(argv) != 2:
            print 'usage: %s <mountpoint>' % argv[0]
            exit(1)
        fuse = FUSE(MemFiS(), argv[1], foreground=False)

