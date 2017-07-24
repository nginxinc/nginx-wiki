Memory Management API
=====================

Types
-----

ngx_pool_t
^^^^^^^^^^

.. c:type:: ngx_pool_t

   A object which represents a pool of memory for the NGINX pool allocator functions

ngx_buf_tag_t
^^^^^^^^^^^^^

.. c:type:: ngx_buf_tag_t

   An alias for ``void *`` to be used as a pointer to tag buffers with

Structures
----------

ngx_pool_cleanup_t
^^^^^^^^^^^^^^^^^^

.. c:type:: ngx_pool_cleanup_t

   A structure containing an allocation from the pool as well as a callback handler for the user to set upon cleanup of the pool. This is for use with :c:func:`ngx_pool_cleanup_add`

   .. c:member:: void (*ngx_pool_cleanup_pt)(void *data) handler

      The cleanup handler callback for the user to set

   .. c:member:: void *data

      The data allocated from the allocation request

ngx_array_t
^^^^^^^^^^^

.. c:type:: ngx_array_t

   A structure containing the details of an array allocated using :c:func:`ngx_array_create`. Since a continuous block is allocated it should be relative trivial to calculate where a given element in the array is based on size.

   .. c:member:: void *elts

      A pointer to the elements in the array

   .. c:member:: ngx_uint_t nelts

      The number of elements stored in the array

   .. c:member:: ngx_uint_t nalloc

      The number of allocated items in the array

   .. c:member:: size_t size

      The size of each element in the array

   .. c:member:: ngx_pool_t *pool

      A pointer to the pool used for the array

ngx_list_t
^^^^^^^^^^

.. c:type:: ngx_list_t

   A structure containing details of a linked-list allocated using :c:func:`ngx_list_create`.

   .. c:member:: ngx_list_part_t *last

      A pointer to the list part containing final block of elements on the list

   .. c:member:: ngx_list_part_t part

      The first part in the linked-list

   .. c:member:: size_t size

      The size of each element on the list

   .. c:member:: ngx_uint_t nalloc

      The number of allocated elements on the list

   .. c:member: ngx_pool_t *pool

      The memory pool used for the list

ngx_list_part_t
^^^^^^^^^^^^^^^

.. c:type:: ngx_list_part_t

   A structure containing the details of a block of elements in a c:type:`ngx_list_t` linked-list.

   .. c:member:: void *elts

      A pointer to the first element on this block

   .. c:member:: ngx_uint_t nelts

      The number of continuous elements stored in this block

   .. c:member:: ngx_list_part_t *next

      A pointer to the next part of this list

ngx_buf_t
^^^^^^^^^

.. c:type:: ngx_buf_t

   .. c:member:: unsigned char *pos

      Current position in a memory buffer window

   .. c:member:: unsigned char *last

      End of a memory buffer window

   .. c:member:: off_t file_pos

      Current position of a file buffer

   .. c:member:: off_t file_last

      End of a file buffer

   .. c:member:: unsigned char *start

      Beginning of a memory buffer

   .. c:member:: unsigned char *end

      End of a memory buffer

   .. c:member:: ngx_buf_tag_t tag

      A pointer to tag buffers with

   .. c:member:: ngx_file_t *file

      File pointer for a file buffer

   .. c:member:: unsigned temporary:1

      A writeable in-memory buffer

   .. c:member:: unsigned memory:1

      A read-only in-memory buffer

   .. c:member:: unsigned mmap:1

      A mmap()ed read-only buffer

   .. c:member:: unsigned recycled:1

      Buffer is reused after release

   .. c:member:: unsigned in_file:1

      Buffer is a file buffer

   .. c:member:: unsigned flush:1

      All buffered data has been flushed

   .. c:member:: unsigned last_buf:1

      Buffer is the last in a stream of data

   .. c:member:: unsigned last_in_chain:1

      Buffer is the last in a buffer chain

   .. c:member:: unsigned temp_file:1

      Buffer is a temporary file

ngx_bufs_t
^^^^^^^^^^

.. c:type:: ngx_bufs_t

   A structure to contain details about a required chain of buffers. Used by :c:func:`ngx_create_chain_of_bufs`

   .. c:member:: ngx_int_t num

      The number of links in the chain to create

   .. c:member:: size_t size

      The size of each buffer in the chain

ngx_chain_t
^^^^^^^^^^^

.. c:type:: ngx_chain_t

   A structure to contain a chain of memory buffers

   .. c:member:: ngx_buf_t *buf

      The buffer associated with this link in the chain

   .. c:member:: ngx_chain_t *next

      The next link in the chain

Allocation Functions
--------------------

ngx_alloc
^^^^^^^^^

.. c:function:: void *ngx_alloc(size_t size, ngx_log_t *log)

   A wrapper for malloc with error handling. Allocates memory of a given size and returns a pointer to that memory. Requires a pointer to a log file object for the error handling. Fires an emergency level error upon failure.

   :param size: The amount of memory to allocate in bytes
   :param log: The logging object to log errors with
   :returns: A pointer to the allocated memory or ``NULL`` upon failure

ngx_calloc
^^^^^^^^^^

.. c:function:: void *ngx_calloc(size_t size, ngx_log_t *log)

   A wrapper for :c:func:`ngx_alloc` which additionally sets every byte allocated to ``0``.

   :param size: The amount of memory to allocate in bytes
   :param log: The logging object to log errors with
   :returns: A pointer to the allocated memory or ``NULL`` upon failure

ngx_free
^^^^^^^^

.. c:function:: void free (void* ptr)

   A defined alias for the standard ``free()`` function.

   :param ptr: A pointer to the memory to be freed

Memory Pool Functions
---------------------

ngx_create_pool
^^^^^^^^^^^^^^^

.. c:function:: ngx_pool_t *ngx_create_pool(size_t size, ngx_log_t *log)

   Creates a pool of memory of allocated memory which can be quickly freed and reused.

   The macro ``NGX_DEFAULT_POOL_SIZE`` is recommended for use in the size variable which amounts to 16KB

   :param size: The page size for the pool
   :param log: The logging object to log errors with
   :returns: A pointer to the newly created memory pool or ``NULL`` upon failure

ngx_destroy_pool
^^^^^^^^^^^^^^^^

.. c:function:: void ngx_destroy_pool(ngx_pool_t *pool)

   Destroys a pool, freeing all allocations associated with it.

   :param pool: The pool to be destroyed

ngx_reset_pool
^^^^^^^^^^^^^^

.. c:function:: void ngx_reset_pool(ngx_pool_t *pool)

   Resets a pool by marking all pages as free, additionally freeing any large allocations within it.

   :param pool: The pool to be reset

ngx_pnalloc
^^^^^^^^^^

.. c:function:: void *ngx_pnalloc(ngx_pool_t *pool, size_t size)

   Allocates a block of memory from a pool.

   .. note::

      If the requested size is greater than ``NGX_MAX_ALLOC_FROM_POOL`` (system page size - 1) it will be allocated separately as a large allocation and won't be freed until explicitly freed with :c:func:`ngx_pfree` the whole pool is reset (:c:func:`ngx_reset_pool`) or destroyed (:c:func:`ngx_destroy_pool`).

   :param pool: A pointer to the pool to allocate from
   :param size: The size of the allocation required
   :returns: A pointer to the memory requested or ``NULL`` upon failure

ngx_palloc
^^^^^^^^^^^

.. c:function:: void *ngx_palloc(ngx_pool_t *pool, size_t size)

   Similar to :c:func:`ngx_pnalloc` but allocates a block of memory from the pool aligned to ``NGX_ALIGNMENT``

   :param pool: A pointer to the pool to allocate from
   :param size: The size of the allocation required
   :returns: A pointer to the memory requested or ``NULL`` upon failure

ngx_pcalloc
^^^^^^^^^^^

.. c:function:: void *ngx_pcalloc(ngx_pool_t *pool, size_t size)

   A wrapper for :c:func:`ngx_palloc` which also sets every byte of the allocation to ``0``

   :param pool: A pointer to the pool to allocate from
   :param size: The size of the allocation required
   :returns: A pointer to the memory requested or ``NULL`` upon failure

ngx_pfree
^^^^^^^^^

.. c:function:: ngx_int_t ngx_pfree(ngx_pool_t *pool, void *p)

   Frees large allocations

   :param pool: A pointer to the pool to free memory from
   :param p: A pointer to the allocation to be freed
   :returns: ``NGX_OK`` upon success or ``NGX_DECLINED`` if the allocation cannot be found in the large allocations list of the pool

ngx_pool_cleanup_add
^^^^^^^^^^^^^^^^^^^^

.. c:function:: ngx_pool_cleanup_t *ngx_pool_cleanup_add(ngx_pool_t *p, size_t size)

   A wrapper for :c:func:`ngx_palloc` which returns a structure the user can add a cleanup handler to

   :param pool: A pointer to the pool to allocate from
   :param size: The size of the allocation required
   :returns: A pointer to a structure containing allocation and a variable to set as the cleanup callback

Array Functions
---------------

An NGINX array is an efficient way of maintaining a continuous block of memory for a small number of elements. It is particularly efficient if the size of the arry is not required to change often.

ngx_array_create
^^^^^^^^^^^^^^^^

.. c:function:: ngx_array_t *ngx_array_create(ngx_pool_t *p, ngx_uint_t n, size_t size)

   Creates an array from a memory pool and allocates an initial continuous block of memory for its elements

   :param p: A memory pool to use
   :param n: The number of elements in the array
   :param size: The size of each element in bytes
   :returns: A newly created array

ngx_array_destroy
^^^^^^^^^^^^^^^^^

.. c:function:: void ngx_array_destroy(ngx_array_t *a)

   Destroys a array, freeing allocations back to the pool

   :param a: The array to destroy

ngx_array_push
^^^^^^^^^^^^^^

.. c:function:: void *ngx_array_push(ngx_array_t *a)

   Creates a new element on the array and returns a pointer to this element

   .. note:: this may cause a re-allocation of the array depending on the current state of the pool which in-turn could cause a small performance hit

   :param a: The array to create a new element on
   :returns: a pointer to the new element on the array

ngx_array_push_n
^^^^^^^^^^^^^^^^

.. c:function:: void *ngx_array_push_n(ngx_array_t *a, ngx_uint_t n)

   Creates a number of new elements on the array and returns a pointer to the first of these elements

   .. note:: this may cause a re-allocation of the array depending on the current state of the pool which in-turn could cause a small performance hit

   :param a: The array to create new elements on
   :param n: The number of new elements to create on the array
   :returns: a pointer to the first new element

List Functions
--------------

A linked-list in NGINX is used to maintain a growing list of items which can be iterated through. NGINX stores these in blocks called 'parts', each part can contain several elements on the list.

ngx_list_create
^^^^^^^^^^^^^^^

.. c:function:: ngx_list_t *ngx_list_create(ngx_pool_t *pool, ngx_uint_t n, size_t size)

   Creates a linked-list from a memory pool and allocates an initial block of memory for the list

   :param pool: The pool to allcate the list on
   :param n: The number of elements to initially allocate on the pool
   :param size: The size of each element
   :returns: A newly allocated linked-list

ngx_list_push
^^^^^^^^^^^^^

.. c:function:: void *ngx_list_push(ngx_list_t *list)

   Allocates and adds a new element onto the linked-list in the memory pool

   :param list: The linked-list to add to
   :returns: The newly allocated element on the list

Buffer Functions
----------------

ngx_alloc_buf
^^^^^^^^^^^^^

.. c:function:: ngx_buf_t *ngx_alloc_buf(ngx_pool_t *pool)

   A macro which creates a :c:type:`ngx_buf_t` structure in a memory pool

   :param pool: The pool to create the structure in
   :returns: A pointer to the buffer

ngx_calloc_buf
^^^^^^^^^^^^^^

.. c:function:: ngx_buf_t *ngx_calloc_buf(ngx_pool_t *pool)

   A macro which creates a cleared :c:type:`ngx_buf_t` structure in a memory pool

   :param pool: The pool to create the structure in
   :returns: A pointer to the buffer

ngx_create_temp_buf
^^^^^^^^^^^^^^^^^^^

.. c:function:: ngx_buf_t *ngx_create_temp_buf(ngx_pool_t *pool, size_t size)

   Creates a temporary buffer of a given size

   :param pool: The pool to create the buffer in
   :param size: The required size for the buffer
   :returns: A newly created temporary buffer

Buffer Chain Functions
----------------------

ngx_alloc_chain_link
^^^^^^^^^^^^^^^^^^^^

.. c:function:: ngx_chain_t *ngx_alloc_chain_link(ngx_pool_t *pool)

   Allocates memory for a link in the chain from a given memory pool. It will automatically link this to other chains in the pool

   :param pool: The pool to add the chain link to
   :returns: The new chain link

ngx_create_chain_of_bufs
^^^^^^^^^^^^^^^^^^^^^^^^

.. c:function:: ngx_chain_t *ngx_create_chain_of_bufs(ngx_pool_t *pool, ngx_bufs_t *bufs)

   Allocates a chain of links and the buffers inside of them from a given memory pool

   :param pool: The pool to add the chain to
   :param bufs: The buffer details for the chain
   :returns: The first link in the new chain

ngx_chain_get_free_buf
^^^^^^^^^^^^^^^^^^^^^^

.. c:function:: ngx_chain_t *ngx_chain_get_free_buf(ngx_pool_t *p, ngx_chain_t **free)

   Finds the first free buffer link in the chain and returns it. If there are no free links it allocates one and returns it

   :param pool: The pool to get the chained buffer from
   :param free: A pointer to pointer of the chain of buffers
   :returns: The first free chain link

ngx_free_chain
^^^^^^^^^^^^^^

.. c:function:: void ngx_free_chain(ngx_pool_t *pool, ngx_chain_t *cl)

   Releases a link in the chain

   :param pool: The pool the link is in
   :param cl: The link to free

ngx_chain_add_copy
^^^^^^^^^^^^^^^^^^

.. c:function:: ngx_int_t ngx_chain_add_copy(ngx_pool_t *pool, ngx_chain_t **chain, ngx_chain_t *in)

   Copies one chain to the end of another chain without copying the buffered contents. Essentially adding links into pre-existing chain.

   :param pool: The pool the new chains should go into
   :param chain: The chain where the new links should go
   :param in: The chain to copy
   :returns: ``NGX_OK`` on success, ``NGX_ERROR`` if an error occurs

ngx_chain_update_chains
^^^^^^^^^^^^^^^^^^^^^^^

.. c:function:: void ngx_chain_update_chains(ngx_chain_t **free, ngx_chain_t **busy, ngx_chain_t **out, ngx_buf_tag_t tag)

   Moves the buffers from the ``out`` to ``busy`` and processed chains in ``busy`` with ``tag`` to the ``free`` chain.

   :param free: A chain of free buffers
   :param out: A chain of output buffers
   :param busy: A chain of busy buffers
   :param tag: A tag to identify buffers to be freed
