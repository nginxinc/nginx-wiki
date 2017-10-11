
.. meta::
   :description: The c/c++ service handler which built for listening to nginx fastcgi.

FastCGI Functional Handler
==========================

**fcgi_function** is a c/c++ programs which built as service function handler for listening to nginx fastcgi.

There are some core features:

#. Atomic Hashtable - lockfree table hashing a struct for multhreading read write operation..
#. Binary Array - is a struct array for your to add index for struct field member and it can be binary search When the field been indexed, it will auto sorted while inserting new node, please make sure the field has value pre-allocated memory, it is one time write operation only.
#. Signal Handler - It will auto handling the signal such as segfault segment, memory out of range and auto release the thread to avoid program exit unknowingly.
#. Multiple Workers based to handling heavy request.
#. Built in memory allocation pool :github:`details <Taymindis/fcgi-function/wiki/Allocating-memory-by-using-built-in-allocation-pool>`

The benchmarks test can be found :github:`here <Taymindis/fcgi-function#9--using-apache-benchmark-for-get-request-load-test>`

The step by step setup can be found :github:`here <Taymindis/fcgi-function#prerequisition-installed>`

Please visit :github:`github <Taymindis/fcgi-function>` or :github:`wiki <Taymindis/fcgi-function/wiki>` for more details.