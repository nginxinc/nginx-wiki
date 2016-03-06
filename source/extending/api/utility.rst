Utility API
===========

Structures
----------

ngx_str_t
^^^^^^^^^

.. c:type:: ngx_str_t

   A structure containing a pointer to a character array and the length of the character array

  .. c:member:: size_t len

     The length of the character array

  .. c:member:: unsigned char *data

     A pointer to the character array

ngx_regex_compile_t
^^^^^^^^^^^^^^^^^^^

.. c:type:: ngx_regex_compile_t

   A structure to set up the parameters for a regular expression

   .. c:member:: ngx_str_t pattern

      The PCRE style regular expression to compile

   .. c:member:: ngx_pool_t *pool

      A memory pool to use for the regular expression

   .. c:member:: ngx_int_t options

      Options for the regular expression. At the moment the only valid option is ``NGX_REGEX_CASELESS`` which does a case-insensitive search.

   .. c:member:: ngx_str_t err

      A pre-allocated section of memory to store errors from the regular expression engine

Functions
---------

ngx_string
^^^^^^^^^^

.. c:function:: ngx_str_t ngx_string(const unsigned char str[])

   Returns a :c:type:`ngx_str_t` from a given ``NULL`` terminated character array.

   .. note:: this does not make a copy of the character array supplied. It also uses ``sizeof()`` to calculate length so will not work will dynamically allocated memory.

   :param str: The ``NULL`` terminated character array to convert
   :returns: A :c:type:`ngx_str_t` wrapper around the character string

ngx_null_string
^^^^^^^^^^^^^^^

.. c:function:: ngx_str_t ngx_null_string(void)

   Returns an empty :c:type:`ngx_str_t` terminated with ``NULL``.

   :returns: A ``NULL`` terminated empty :c:type:`ngx_str_t`

ngx_str_set
^^^^^^^^^^^

.. c:function:: void ngx_str_set(ngx_str_t *str, const unsigned char text[])

   Sets a :c:type:`ngx_str_t` to a given character array

   .. note:: this does not make a copy of the character array. It also uses ``sizeof()`` to calculate length so will not work will dynamically allocated pointers.

   :param str: The destination :c:type:`ngx_str_t`
   :param text: The source character array

ngx_str_null
^^^^^^^^^^^^

.. c:function:: void ngx_str_null(ngx_str_t *str)

   Sets a given :c:type:`ngx_str_t` to an empty ``NULL`` terminated string.

   :param str: The :c:type:`ngx_str_t` object to set.

ngx_tolower
^^^^^^^^^^^

.. c:function:: unsigned char ngx_tolower(unsigned char c)

   Sets an ASCII 'A' to 'Z' to lowercase. For other characters it returns the same character.

   :param c: The input character
   :returns: A lowercase 'a' to 'z' or the input character

ngx_toupper
^^^^^^^^^^^

.. c:function:: unsigned char ngx_toupper(unsigned char c)

   Sets an ASCII 'a' to 'z' to uppercase. For other characters it returns the same character.

   :param c: The input character
   :returns: An uppercase 'A' to 'Z' or the input character

ngx_strlow
^^^^^^^^^^

.. c:function:: void ngx_strlow(unsigned char *dst, unsigned char *src, size_t n)

   Runs :c:func:`ngx_tolower` on an entire string who's length is given. The destination should be pre-allocated to at least the same length as the source.

   :param dst: The destination string
   :param src: The source string
   :param n: The length of the source string

ngx_strncmp
^^^^^^^^^^^

.. c:function:: int ngx_strncmp(const char *s1, const char *s2, size_t n)

   An alias to the standard ``strncmp`` function

   :param s1: The first string to compare
   :param s2: The second string to compare
   :param n: The maximum length to compare
   :returns: 0 if the strings are equal, <0 if the first non-matching character in s1 is lower, >0 if the first non-matching character in s2 is higher

ngx_strcmp
^^^^^^^^^^

.. c:function:: int ngx_strcmp(const char *s1, const char *s2)

   An alias to the standard ``strcmp`` function

   :param s1: The first string to compare
   :param s2: The second string to compare
   :returns: 0 if the strings are equal, <0 if the first non-matching character in s1 is lower, >0 if the first non-matching character in s2 is higher

ngx_strlen
^^^^^^^^^^

.. c:function:: size_t strlen(const char *s)

   An alias to the standard ``strlen`` function

   :param s: The ``NULL`` terminated string
   :returns: The length of the string

ngx_strstr
^^^^^^^^^^

.. c:function:: char *ngx_strstr (const char *s1, const char *s2)

   An alias to the standard ``strstr`` function

   :param s1: The string to search within
   :param s2: The sequence of characters to match
   :returns: A pointer to the first match or ``NULL`` on no match

ngx_strchr
^^^^^^^^^^

.. c:function:: char *strchr (const char *s1, int c)

   An alias to the standard ``strchr`` function

   :param s1: The string to search within
   :param c: The character to find in the string
   :returns: A pointer to first match or ``NULL`` on no match

ngx_strlchr
^^^^^^^^^^^

.. c:function:: unsigned char *ngx_strlchr(unsigned char *p, unsigned char *last, unsigned char c)

   Searches a string based on the pointer to the beginning and end of the string for a given character. Returns a pointer to the first match of that character.

   :param p: A pointer to the start of the string
   :param last: A pointer to the end of the string
   :param c: The character to find in the string
   :returns: A pointer to the first match or ``NULL`` on no match

ngx_memzero
^^^^^^^^^^^

.. c:function:: void memzero(void *buf, size_t n)

   Sets every byte of a given section of memory to zero

   :param buf: The pointer to the memory
   :param n: The length of the memory to set to zero

ngx_memset
^^^^^^^^^^

.. c:function:: void memset(void *buf, int c, size_t n)

   An alias for the standard ``memset`` function

   :param buf: The pointer to the memory
   :param c: The character to fill the memory with
   :param n: The length of the memory

ngx_memcpy
^^^^^^^^^^

.. c:function:: void ngx_memcpy(void *dst, const void *src, size_t n)

   An alias for the standard ``memcpy`` function but does not return the pointer to the destination

   :param dst: The destination memory pointer
   :param src: The source memory pointer
   :param n: The amount of bytes to copy

ngx_copy
^^^^^^^^

.. c:function:: void *ngx_copy(void *dst, const void *src, size_t n)

   A wrapper for the standard ``memcpy`` function which returns the pointer of the destination after the copy (``dst`` + ``n``)

   :param dst: The destination memory pointer
   :param src: The source memory pointer
   :param n: The amount of bytes to copy
   :returns: The pointer of ``dst`` + ``n``

ngx_memmove
^^^^^^^^^^^

.. c:function:: void *ngx_memmove(void *dst, const void *src, size_t n)

   An alias for the standard ``memmove`` function but does not return the pointer to the destination

   :param dst: The destination memory pointer
   :param src: The source memory pointer
   :param n: The number of bytes to move

ngx_movemem
^^^^^^^^^^^

.. c:function:: void *ngx_movemem(void *dst, const void *src, size_t n)

   A wrapper for the standard ``memmove`` function which returns the pointer of the destination after the copy (``dst`` + ``n``)

   :param dst: The destination memory pointer
   :param src: The source memory pointer
   :param n: The number of bytes to move
   :returns: The pointer of ``dst`` + ``n``

ngx_memcmp
^^^^^^^^^^

.. c:function:: int ngx_memcmp(const void *s1, const void *s2, size_t n)

   An alias for the standard memcmp function.

   :param s1: The first string to compare
   :param s2: The second string to compare
   :returns: 0 if the strings are equal, <0 if the first non-matching character in s1 is lower, >0 if the first non-matching character in s2 is higher

ngx_cpystrn
^^^^^^^^^^^

.. c:function:: unsigned char *ngx_cpystrn(unsigned char *dst, unsigned char *src, size_t n)

   Copies information from one memory location to another. Stops when ``n`` bytes are copied or a ``NULL`` terminator is hit. Returns the pointer pointer of ``dst`` at the point where the copy has finished.

   :param dst: The destination memory pointer
   :param src: The source memory pointer
   :param n: The number of bytes to copy
   :returns: The pointer of ``dst`` plus the number of bytes copied

ngx_pstrdup
^^^^^^^^^^^

.. c:function:: unsigned char *ngx_pstrdup(ngx_pool_t *pool, ngx_str_t *src)

   Creates a copy of a string into a newly allocated string in a memory pool created with :c:func:`ngx_create_pool`

   :param pool: The memory pool to use
   :param src: The source string
   :returns: A pointer to the copy of the string

ngx_sprintf
^^^^^^^^^^^

.. c:function:: unsigned char *ngx_sprintf(unsigned char *buf, const char *fmt, ...)

   An ``sprintf`` style wrapper around :c:func:`ngx_vslprintf`

   :param buf: The destination pointer
   :param fmt: The text and format description to use
   :returns: A pointer to the destination

ngx_snprintf
^^^^^^^^^^^^

.. c:function:: unsigned char *ngx_snprintf(unsigned char *buf, size_t max, const char *fmt, ...)

   An ``snprintf`` style wrapper around :c:func:`ngx_vslprintf`

   :param buf: The destination pointer
   :param max: The maximum size of the destination
   :param fmt: The text and format description to use
   :returns: A pointer to the destination

ngx_slprintf
^^^^^^^^^^^^

.. c:function:: unsigned char *ngx_slprintf(unsigned char *buf, unsigned char *last, const char *fmt, ...)

   A wrapper around :c:func:`ngx_vslprintf` similar to ``snprintf`` but instead of a maximum length specifier it takes a pointer to the end of the destination memory buffer.

   :param buf: The destination pointer
   :param last: A pointer to the end of the destination buffer
   :param fmt: The text and format description to use
   :returns: A pointer to the destination

ngx_vslprintf
^^^^^^^^^^^^^

.. c:function:: unsigned char *ngx_vslprintf(unsigned char *buf, unsigned char *last, const char *fmt, va_list args)

   A function similar to the standard ``vsnprintf`` but has additional possible format specifiers. It also takes a pointer to the end of the destination memory buffer instead of a length specifier.

   ========= =================================================
   Specifier Description
   ========= =================================================
   ``%P``    The contents of a :c:type:`ngx_pid_t`
   ``%M``    The contents of a :c:type:`ngx_msec_t`
   ``%V``    The data of a :c:type:`ngx_str_t`
   ``%v``    The data of a :c:type:`ngx_http_variable_value_t`
   ========= =================================================

   :param buf: The destination pointer
   :param max: The maximum size of the destination
   :param fmt: The text and format description to use
   :param args: A variable arguments list

ngx_vsnprintf
^^^^^^^^^^^^^

.. c:function:: unsigned char *ngx_vsnprintf(unsigned char *buf, size_t max, const char *fmt, va_list args)

   A function similar to the standard ``vsnprintf`` which is implemented as a wrapper around :c:func:`ngx_vslprintf`

   :param buf: The destination pointer
   :param last: A pointer to the end of the destination buffer
   :param fmt: The text and format description to use
   :param args: A variable arguments list

ngx_strcasecmp
^^^^^^^^^^^^^^

.. c:function:: ngx_int_t ngx_strcasecmp(unsigned char *s1, unsigned char *s2)

   An optimised function similar to the standard ``strcasecmp``

   :param s1: The first string to compare
   :param s2: The second string to compare
   :returns: 0 if the strings are equal, <0 if the first non-matching character in s1 is lower, >0 if the first non-matching character in s2 is higher

ngx_strncasecmp
^^^^^^^^^^^^^^^

.. c:function:: ngx_int_t ngx_strncasecmp(unsigned char *s1, unsigned char *s2, size_t n)

   An optimised function similar to the standard ``strncasecmp``

   :param s1: The first string to compare
   :param s2: The second string to compare
   :param n: The maximum number of characters to compare
   :returns: 0 if the strings are equal, <0 if the first non-matching character in s1 is lower, >0 if the first non-matching character in s2 is higher

ngx_strnstr
^^^^^^^^^^^

.. c:function:: unsigned char *ngx_strnstr(unsigned char *s1, char *s2, size_t n)

   A function similar to the standard ``strstr`` but with a maximum search length.

   :param s1: The string to search within
   :param s2: The sequence of characters to match
   :param n: The maximum number of characters to search in ``s1``
   :returns: A pointer to the first match or ``NULL`` on no match

ngx_strstrn
^^^^^^^^^^^

.. c:function:: unsigned char *ngx_strstrn(unsigned char *s1, char *s2, size_t n)

   A function similar to the standard ``strstr`` but with a length specifier for the ``s2`` parameter.

   :param s1: The string to search within
   :param s2: The sequence of characters to match
   :param n: The length of the ``s2`` parameter
   :returns: A pointer to the first match or ``NULL`` on no match

ngx_strcasestrn
^^^^^^^^^^^^^^^

.. c:function:: unsigned char *ngx_strcasestrn(unsigned char *s1, char *s2, size_t n)

   A function similar to the standard ``strcasestr`` but with a length specifier for the ``s2`` parameter.

   :param s1: The string to search within
   :param s2: The sequence of characters to match
   :param n: The length of the ``s2`` parameter
   :returns: A pointer to the first match or ``NULL`` on no match

ngx_strlcasestrn
^^^^^^^^^^^^^^^^

.. c:function:: unsigned char *ngx_strlcasestrn(unsigned char *s1, unsigned char *last, unsigned char *s2, size_t n)

   A function similar to the standard ``strcasestr`` but with a pointer to the last character in the search string and a length specifier for the ``s2`` parameter.

   :param s1: The string to search within
   :param last: A pointer to the last character in the ``s1`` string
   :param s2: The sequence of characters to match
   :param n: The length of the ``s2`` parameter
   :returns: A pointer to the first match or ``NULL`` on no match

ngx_rstrncmp
^^^^^^^^^^^^

.. c:function:: ngx_int_t ngx_rstrncmp(unsigned char *s1, unsigned char *s2, size_t n)

   A function similar to the standard ``strncmp`` but starts at the end of the string.

   :param s1: The first string to compare
   :param s2: The second string to compare
   :param n: The maximum length to compare
   :returns: 0 if the strings are equal, <0 if the first non-matching character in s1 is lower, >0 if the first non-matching character in s2 is higher

ngx_rstrncasecmp
^^^^^^^^^^^^^^^^

.. c:function:: ngx_int_t ngx_rstrncasecmp(unsigned char *s1, unsigned char *s2, size_t n)

   A function similar to the standard ``strncasecmp`` but starts at the end of the string.

   :param s1: The first string to compare
   :param s2: The second string to compare
   :param n: The maximum length to compare
   :returns: 0 if the strings are equal, <0 if the first non-matching character in s1 is lower, >0 if the first non-matching character in s2 is higher

ngx_memn2cmp
^^^^^^^^^^^^

.. c:function:: ngx_int_t ngx_memn2cmp(unsigned char *s1, unsigned char *s2, size_t n1, size_t n2)

   Compares two length specified segments of memory.

   :param s1: The first memory location to compare
   :param s2: The second memory location to compare
   :param n1: The length of the first memory location
   :param n2: The length of the second memory location
   :returns: 0 if the strings are equal, <0 if the first non-matching character in s1 is lower, >0 if the first non-matching character in s2 is higher

ngx_dns_str_cmp
^^^^^^^^^^^^^^^

.. c:function:: ngx_int_t ngx_dns_strcmp(unsigned char *s1, unsigned char *s2)

   A function similar to :c:func:`ngx_strcmp` but compares two DNS entries.

   :param s1: The first string to compare
   :param s2: The second string to compare
   :returns: 0 if the strings are equal, <0 if the first non-matching character in s1 is lower, >0 if the first non-matching character in s2 is higher

ngx_filename_cmp
^^^^^^^^^^^^^^^^

.. c:function:: ngx_int_t ngx_filename_cmp(unsigned char *s1, unsigned char *s2, size_t n)

   A function similar to :c:func:`ngx_strncmp` but compares two paths

   :param s1: The first path to compare
   :param s2: The second path to compare
   :param n: The number of bytes to compare
   :returns: 0 if the strings are equal, <0 if the first non-matching character in s1 is lower, >0 if the first non-matching character in s2 is higher

ngx_atoi
^^^^^^^^

.. c:function:: ngx_int_t ngx_atoi(unsigned char *line, size_t n)

   A function similar to ``atoi`` but has a string length specifier

   :param line: The text to convert
   :param n: The length of ``line``
   :returns: An integer representation of the input

ngx_atofp
^^^^^^^^^

.. c:function:: ngx_int_t ngx_atofp(unsigned char *line, size_t n, size_t point)

   Converts a floating point number in a string to an integer representation. For example: ``ngx_atofp("10.2", 4, 2)`` returns ``1020``

   :param line: The text to convert
   :param n: The length of ``line``
   :param point: The number of decimal places to convert
   :returns: An integer representing the input

ngx_atosz
^^^^^^^^^

.. c:function:: ssize_t ngx_atosz(unsigned char *line, size_t n)

   Converts a number in a text string to a ``ssize_t``

   :param line: The text to convert
   :param n: The length of ``line``
   :returns: A ``ssize_t`` representation of the input

ngx_atoof
^^^^^^^^^

.. c:function:: off_t ngx_atoof(unsigned char *line, size_t n)

   Converts a number in a text string to an ``off_t``

   :param line: The text to convert
   :param n: The length of ``line``
   :returns: A ``off_t`` representation of the input

ngx_atotm
^^^^^^^^^

.. c:function:: time_t ngx_atotm(unsigned char *line, size_t n)

   Converts a number in a text string to a ``time_t``

   :param line: The text to convert
   :param n: The length of ``line``
   :returns: A ``time_t`` representation of the input

ngx_hextoi
^^^^^^^^^^

.. c:function:: ngx_int_t ngx_hextoi(unsigned char *line, size_t n)

   Converts a hexadecimal number in a text string to an integer

   :param line: The text to convert
   :param n: The length of ``line``
   :returns: An integer representation of the hexadecimal input

ngx_hex_dump
^^^^^^^^^^^^

.. c:function:: unsigned char *ngx_hex_dump(unsigned char *dst, unsigned char *src, size_t len)

   Converts binary data to a printable hexadecimal representation of the string

   .. note:: ``dst`` should be allocated to ``2*len``. ``dst`` will not be ``NULL`` terminated by this function.

   :param dst: The destination string
   :param src: The source binary data
   :param len: The length of ``src``
   :returns: A pointer to ``dst + (2*len)``

ngx_base64_encoded_length
^^^^^^^^^^^^^^^^^^^^^^^^^

.. c:function:: int ngx_base64_encoded_length(int len)

   A macro to calculate the base64 encoded length of a string. Evaluates to ``(((len + 2) / 3) * 4)``. Any int type can be used.

   :param len: The input length
   :returns: The output length

ngx_base64_decoded_length
^^^^^^^^^^^^^^^^^^^^^^^^^

.. c:function:: int ngx_base64_decoded_length(int len)

   A macro to calculate the base64 decoded length of a string. Evaluates to ``(((len + 3) / 4) * 3)``. Any int type can be used.

   :param len: The input length
   :returns: The output length

ngx_encode_base64
^^^^^^^^^^^^^^^^^

.. c:function:: void ngx_encode_base64(ngx_str_t *dst, ngx_str_t *src)

   Base64 encodes a given input text.

   .. note:: :c:func:`ngx_base64_encoded_length` should be used to calculate how much memory should be allocated for ``dst``

   :param dst: The destination buffer
   :param src: The source data

ngx_encode_base64url
^^^^^^^^^^^^^^^^^^^^

.. c:function:: void ngx_encode_base64url(ngx_str_t *dst, ngx_str_t *src)

   Base64 encodes a given input URL

   .. note:: :c:func:`ngx_base64_encoded_length` should be used to calculate how much memory should be allocated for ``dst``

   :param dst: The destination buffer
   :param src: The source data

ngx_decode_base64
^^^^^^^^^^^^^^^^^

.. c:function:: ngx_int_t ngx_decode_base64(ngx_str_t *dst, ngx_str_t *src)

   Base64 decodes a given input

   .. note:: :c:func:`ngx_base64_decoded_length` should be used to calculate how much memory should be allocated for ``dst``

   :param dst: The destination buffer
   :param src: The source data
   :returns: ``NGX_OK`` on success, ``NGX_ERROR`` on failure

ngx_decode_base64url
^^^^^^^^^^^^^^^^^^^^

.. c:function:: ngx_int_t ngx_decode_base64url(ngx_str_t *dst, ngx_str_t *src)

   Base64 decodes a given input URL

   .. note:: :c:func:`ngx_base64_decoded_length` should be used to calculate how much memory should be allocated for ``dst``

   :param dst: The destination buffer
   :param src: The source data
   :returns: ``NGX_OK`` on success, ``NGX_ERROR`` on failure

ngx_utf8_decode
^^^^^^^^^^^^^^^

.. c:function:: uint32_t ngx_utf8_decode(unsigned char **p, size_t n)

   Validates a UTF8 character. The character pointer pointed to with ``p`` is moved to the end of the character. The following table shows the return values:

   ===================== ===================
   Value                 Meaning
   ===================== ===================
   0x80 - 0x10ffff       valid character
   0x110000 - 0xfffffffd invalid sequence
   0xfffffffe            incomplete sequence
   0xffffffff            error
   ===================== ===================

   :param p: A pointer to a pointer for the UTF8 sequence
   :param n: The length of the sequence
   :returns: The status in the table above

ngx_utf8_length
^^^^^^^^^^^^^^^

.. c:function:: size_t ngx_utf8_length(unsigned char *p, size_t n)

   Returns the number of UTF8 characters in a given string.

   :param p: The character string to count
   :param n: The length of the string
   :returns: The number of UTF8 characters in the string or an error from :c:func:`ngx_utf8_decode`

ngx_utf8_cpystrn
^^^^^^^^^^^^^^^^

.. c:function:: unsigned char *ngx_utf8_cpystrn(unsigned char *dst, unsigned char *src, size_t n, size_t len)

   Copies a valid UTF8 sequence from one string to another, ignoring invalid characters

   :param dst: The destination string
   :param src: The source string
   :param n: The maximum length of ``dst``
   :param len: The length of the ``src``
   :returns: The position of ``dst`` plus the characters copied

ngx_escape_uri
^^^^^^^^^^^^^^

.. c:function:: uintptr_t ngx_escape_uri(unsigned char *dst, unsigned char *src, size_t size, ngx_uint_t type)

   Escapes a URI. Different types use slightly different escape algorithms. A ``dst`` of ``NULL`` will return the number of characters that would fill ``dst``. Otherwise a pointer to the end of data in ``dst`` is returned.

   ============================ ================================
   Type                         Definition
   ============================ ================================
   ``NGX_ESCAPE_URI``           Escape a standard URI
   ``NGX_ESCAPE_ARGS``          Escape query arguments
   ``NGX_ESCAPE_URI_COMPONENT`` Escape the URI after the domain
   ``NGX_ESCAPE_HTML``          Escape a URI for an SSI include
   ``NGX_ESCAPE_REFRESH``       Escape a URI in a refresh header
   ``NGX_ESCAPE_MEMCACHED``     Escape a memcached URI
   ``NGX_ESCAPE_MAIL_AUTH``     Escape a mail authentication URI
   ============================ ================================

   :param dst: A destination memory location, or ``NULL`` for a length count
   :param src: The source string
   :param size: The length of the source string
   :param type: The type of escape algorithm to use
   :returns: A pointer to the end of the used ``dst`` or the output count if ``dst`` is ``NULL``

ngx_unescape_uri
^^^^^^^^^^^^^^^^

.. c:function:: void ngx_unescape_uri(unsigned char **dst, unsigned char **src, size_t size, ngx_uint_t type)

   Unescapes a URI. Different types use slightly different unescape algorithms.

   ========================= =======================
   Type                      Definition
   ========================= =======================
   ``NGX_UNESCAPE_URI``      Unescape a standard URI
   ``NGX_UNESCAPE_REDIRECT`` Unescape a redirect URI
   ========================= =======================

   :param dst: A destination memory location
   :param src: The source string
   :param size: The length of the source string
   :param type: The type of escape algorithm to use

ngx_escape_html
^^^^^^^^^^^^^^^

.. c:function:: uintptr_t ngx_escape_html(unsigned char *dst, unsigned char *src, size_t size)

   Escapes HTML entities ``<``, ``>``, ``&`` and ``"``. A ``dst`` of ``NULL`` will return the number of characters that would fill ``dst``. Otherwise a pointer to the end of data in ``dst`` is returned.

   :param dst: A destination memory location, or ``NULL`` for a length count
   :param src: The source string
   :param size: The length of the source string
   :returns: A pointer to the end of the used ``dst`` or the output count if ``dst`` is ``NULL``

ngx_escape_json
^^^^^^^^^^^^^^^

.. c:function:: uintptr_t ngx_escape_json(unsigned char *dst, unsigned char *src, size_t size)

   Escapes the JSON entites ``\``, ``"`` and 0x1f. A ``dst`` of ``NULL`` will return the number of characters that would fill ``dst``. Otherwise a pointer to the end of data in ``dst`` is returned.

   :param dst: A destination memory location, or ``NULL`` for a length count
   :param src: The source string
   :param size: The length of the source string
   :returns: A pointer to the end of the used ``dst`` or the output count if ``dst`` is ``NULL``

ngx_sort
^^^^^^^^

.. c:function:: void ngx_sort(void *base, size_t n, size_t size, ngx_int_t (*cmp)(const void *, const void *))

   An insertion sort algorithm with a template similar to the standard C ``qsort`` function. Sorts fixed-length data based on the results of a comparitor callback ``cmp``. ``cmp`` should return ``-1`` to left, ``1`` to shift right and 0 to not shift.

   :param base: The pointer to an array of pointers to be sorted
   :param n: The number of elements in ``base`` to be sorted
   :param size: The size of each element in ``base``
   :param cmp: The callback executed on each compare

ngx_qsort
^^^^^^^^^

.. c:function:: void ngx_qsort (void* base, size_t num, size_t size, int (*compar)(const void*,const void*))

   An alias to the standard ``qsort`` function

   :param base: The pointer to an array of pointers to be sorted
   :param num: The number of elements in ``base`` to be sorted
   :param size: The size of each element in ``base``
   :param compar: The callback executed on each compare

ngx_hash
^^^^^^^^

.. c:function:: ngx_uint_t ngx_hash(ngx_uint_t key, unsigned char c)

   A macro that generates a hash of a single character. Defined as:

   .. code-block:: c

      ((ngx_uint_t) key * 31 + c)

   It is designed to be run over an entire string to generate a full hash

   :param key: The key to update with the hash of a new character
   :param c: The character to add to the hash
   :returns: An updated key

ngx_hash_strlow
^^^^^^^^^^^^^^^

.. c:function:: ngx_uint_t ngx_hash_strlow(unsigned char *dst, unsigned char *src, size_t n)

   Sets a given string to lowercase using :c:func:`ngx_tolower` on every character, stores it in ``dst`` and generates a hash from that string using :c:func:`ngx_hash`

   :param dst: The destination of the lowercase string
   :param src: The source string
   :param n: The length of the source string
   :returns: A hash key based on the ``dst``

ngx_regex_init
^^^^^^^^^^^^^^

.. c:function:: ngx_int_t ngx_regex_compile(ngx_regex_compile_t *rc)

   Compile a regular expression based on a pre-definied :c:type:`ngx_regex_compile_t` structure.

   :param rc: The regular expression to compile
   :returns: ``NGX_OK`` on success, ``NGX_ERROR`` on failure

ngx_regex_exec
^^^^^^^^^^^^^^

.. c:function:: int ngx_regex_exec(ngx_regex_compile_t *re, ngx_str_t *s, int *captures, int size)

   A macro wrapper around ``pcre_exec`` to execute the regular expression

   :param rc: A regular expression compiled with :c:func:`ngx_regex_compile`
   :param s: A string to execute the regular expression against
   :param captures: A pre-allocated array of integers that will be used to identify the captured strings in ``s``
   :param size: The number of elements allocated for ``captures``
   :result: ``0`` on success, ``NGX_REGEX_NOMATCH`` if there are no matches, ``< -1`` on error

ngx_regex_exec_array
^^^^^^^^^^^^^^^^^^^^

.. c:function:: ngx_int_t ngx_regex_exec_array(ngx_array_t *a, ngx_str_t *s, ngx_log_t *log)

   Execute an array of regular expressions against a string. This only returns whether or not there is a match, no details of the match

   :param a: The array of :c:type:`ngx_regex_compile_t` regular expressions
   :param s: A string to execute the regular expressions against
   :param log: The log object to send error messages to
   :returns: ``NGX_OK`` on a match found, ``NGX_DECLINED`` if no match is found, ``NGX_ERROR`` if an error occurred.


