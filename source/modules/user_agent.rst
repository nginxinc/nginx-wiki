
.. meta::
   :description: The User Agent module is similar to NGINX's native ngx_http_browser_module, but provides more search options.

User Agent
==========

Description
-----------
**nginx-http-user-agent** -  similar to NGINX's native `ngx_http_browser_module <https://nginx.org/en/docs/http/ngx_http_browser_module.html>`_, but provides more search options.


Source Repository
-----------------

Get it from :github:`github <alibaba/nginx-http-user-agent>`.


Syntax
------

.. code-block:: nginx

  user_agent $variable_name {
      greedy name;

      name [([+|-]version) | (version1~version2)]  value;
  }

  if ($variable == value) {
      echo hello;
  }


Directives
----------

greedy
^^^^^^

We specify the keyword in the *user_agent* string from right to left, and this is more efficient. As usual, we use the greedy algorithm. It will return immediately after the keyword being found.

E.g 1. "Mozilla/5.0 (compatible; MSIE 10.0; Windows NT 6.1; WOW64; Trident/6.0)", this string is MSIE's user_agent string, we will return when we find the keyword "MSIE". But the truth is not alway like this:
E.g 2. "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_7_3) AppleWebKit/535.20 (KHTML, like Gecko) Chrome/19.0.1036.7 Safari/535.20", This is Chrome's user_agent. We will match Safari first. If we define safari is greedy, it scans the string in a reverse order. If a keyword is greedy, it will not return immediately when the keyword is matched for the first time, but rather continue to scan the string.

default
^^^^^^^

set the default value of this variable;

The directive format is like this in the block::

  name   version    value;

- *name* - The name of operating_system, browser, crawler and so on.
- *version* - It can be omitted, and it supports multiple formats.
- *value* - It is the value filled to the variable.

For example:

.. code-block:: nginx

  user_agent $example {

      #set default value
      default  msie;

      #define safari is greedy
      greedy  safari;

      #match exact version
      msie  6.0  1;

      #match interval
      msie  7.0~8.0  2;

      #match greater than version 9.0
      msie  9.0+  3;

      #match less than version 4.0 (include 4.0)
      msie  4.0-  4;

      #match all
      Chrome  5;
  }
