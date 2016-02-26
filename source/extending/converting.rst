Converting Static Modules to Dynamic Modules
============================================

In NGINX 1.9.11 onwards a new way of loading modules dynamically has been introduced. This means that selected modules can be loaded into NGINX at runtime based on configuration files. They can also be unloaded by editing the configuration files and reloading NGINX.

The modules API is the same for both the original static modules and dynamic modules, but the ``config`` file and how you compile them is slightly different. These changes will be outlined in this document.

Pre-requisites
--------------

Not every module can be converted to a Dynamic Module. The following are some of the things to watch out for:

* Modules which patch the NGINX source code are not advised to be converted. They definitely won't work when out-of-source compilation is supported.

* Try to only use parts of the NGINX API which are explicitly designed to be used for modules. In some cases touching NGINX internals will not work with Dynamic Modules.

In addition any dynamic module that previously required to be installed in a specific order should now use the :ini:key:`ngx_module_order` variable to set the required order.

If you hit unexpected issues please contact the `NGINX development mailing list <http://mailman.nginx.org/mailman/listinfo/nginx-devel>`_

.. _compiling-dynamic:

Compiling a Dynamic Module
--------------------------

A new configure option has been created to add a module as a dynamic module. Instead of using ``--add-module`` you use ``--add-dynamic-module``. For example:

.. code-block:: bash

   $ ./configure --add-dynamic-module=/opt/source/ngx_my_module/

Modules are compiled along with NGINX by running the ``make`` command. Alternatively you can ask NGINX to just build the modules by doing:

.. code-block:: bash

   $ make -f objs/Makefile modules

It is possible to run configure with the same paraters as before with an additional module, compiling as above and using the resulting module binary with the NGINX that has already been built with the source. If you change other configure options or the NGINX source you will need to recompile everything since there is no API/ABI compatibility at present.

During compilation the module binary will be created as a ``.so`` file in the ``objs`` directory. This ``.so`` file is then installed into the ``modules`` sub-directory of NGINX's installation path.

Loading a Dynamic Module
------------------------

Modules can be loaded into NGINX with the new ``load_module`` directive. For example:

.. code-block:: nginx

   load_module modules/ngx_my_module.so;

.. note::
   There is a hard limit of 128 dynamic modules that can be loaded at one time, as defined by ``NGX_MAX_DYNAMIC_MODULES`` in the NGINX source. This hard limit can be increased by editing this constant.

Converting a config file
------------------------

The following is an example of an old-style ``config`` file for the 3rd party `ngx_http_response_module <https://github.com/catap/ngx_http_response_module>`_:

.. code-block:: bash

   ngx_addon_name=ngx_http_response_module
   HTTP_MODULES="$HTTP_MODULES ngx_http_response_module"
   NGX_ADDON_SRCS="$NGX_ADDON_SRCS $ngx_addon_dir/ngx_http_response_module.c"

The new method uses a build script called ``auto/module`` to setup many things so that the new-style configuration can be used with both dynamic and static modules. This will process options in the ``config`` file. The new-style version for ``ngx_http_response_module`` would be:

.. code-block:: bash

   ngx_addon_name=ngx_http_response_module

   if test -n "$ngx_module_link"; then
       ngx_module_type=HTTP
       ngx_module_name=ngx_http_response_module
       ngx_module_srcs="$ngx_addon_dir/ngx_http_response_module.c"

       . auto/module
   else
       HTTP_MODULES="$HTTP_MODULES ngx_http_response_module"
       NGX_ADDON_SRCS="$NGX_ADDON_SRCS $ngx_addon_dir/ngx_http_response_module.c"
   fi

This incorporates the old-style ``config`` file as well so that older versions of NGINX will be compatible with the module. For a more detailed explaination of these options see :doc:`new_config`

Complex Example
---------------

Some modules are actually multiple module types in one package. These can be a little more complex to convert. They need to be split into individual modules when compiling as static modules but can be a single ``.so`` file for Dynamic Modules. For the following example we will look at `ngx_rtmp_module <https://github.com/arut/nginx-rtmp-module>`_ which contains CORE and HTTP modules inside of it.

The end conversion looks like this:

.. code-block:: bash

    ngx_addon_name="ngx_rtmp_module"
    RTMP_CORE_MODULES="                                         \
                    ngx_rtmp_module                             \
                    ngx_rtmp_core_module                        \
                    ngx_rtmp_cmd_module                         \
                    ngx_rtmp_codec_module                       \
                    ngx_rtmp_access_module                      \
                    ngx_rtmp_record_module                      \
                    ngx_rtmp_live_module                        \
                    ngx_rtmp_play_module                        \
                    ngx_rtmp_flv_module                         \
                    ngx_rtmp_mp4_module                         \
                    ngx_rtmp_netcall_module                     \
                    ngx_rtmp_relay_module                       \
                    ngx_rtmp_exec_module                        \
                    ngx_rtmp_auto_push_module                   \
                    ngx_rtmp_notify_module                      \
                    ngx_rtmp_log_module                         \
                    ngx_rtmp_limit_module                       \
                    ngx_rtmp_hls_module                         \
                    ngx_rtmp_dash_module                        \
                    "
    RTMP_HTTP_MODULES="                                         \
                    ngx_rtmp_stat_module                        \
                    ngx_rtmp_control_module                     \
                    "
    RTMP_DEPS="                                                 \
                    $ngx_addon_dir/ngx_rtmp_amf.h               \
                    $ngx_addon_dir/ngx_rtmp_bandwidth.h         \
                    $ngx_addon_dir/ngx_rtmp_cmd_module.h        \
                    $ngx_addon_dir/ngx_rtmp_codec_module.h      \
                    $ngx_addon_dir/ngx_rtmp_eval.h              \
                    $ngx_addon_dir/ngx_rtmp.h                   \
                    $ngx_addon_dir/ngx_rtmp_version.h           \
                    $ngx_addon_dir/ngx_rtmp_live_module.h       \
                    $ngx_addon_dir/ngx_rtmp_netcall_module.h    \
                    $ngx_addon_dir/ngx_rtmp_play_module.h       \
                    $ngx_addon_dir/ngx_rtmp_record_module.h     \
                    $ngx_addon_dir/ngx_rtmp_relay_module.h      \
                    $ngx_addon_dir/ngx_rtmp_streams.h           \
                    $ngx_addon_dir/ngx_rtmp_bitop.h             \
                    $ngx_addon_dir/ngx_rtmp_proxy_protocol.h    \
                    $ngx_addon_dir/hls/ngx_rtmp_mpegts.h        \
                    $ngx_addon_dir/dash/ngx_rtmp_mp4.h          \
                    "
    RTMP_CORE_SRCS="                                            \
                    $ngx_addon_dir/ngx_rtmp.c                   \
                    $ngx_addon_dir/ngx_rtmp_init.c              \
                    $ngx_addon_dir/ngx_rtmp_handshake.c         \
                    $ngx_addon_dir/ngx_rtmp_handler.c           \
                    $ngx_addon_dir/ngx_rtmp_amf.c               \
                    $ngx_addon_dir/ngx_rtmp_send.c              \
                    $ngx_addon_dir/ngx_rtmp_shared.c            \
                    $ngx_addon_dir/ngx_rtmp_eval.c              \
                    $ngx_addon_dir/ngx_rtmp_receive.c           \
                    $ngx_addon_dir/ngx_rtmp_core_module.c       \
                    $ngx_addon_dir/ngx_rtmp_cmd_module.c        \
                    $ngx_addon_dir/ngx_rtmp_codec_module.c      \
                    $ngx_addon_dir/ngx_rtmp_access_module.c     \
                    $ngx_addon_dir/ngx_rtmp_record_module.c     \
                    $ngx_addon_dir/ngx_rtmp_live_module.c       \
                    $ngx_addon_dir/ngx_rtmp_play_module.c       \
                    $ngx_addon_dir/ngx_rtmp_flv_module.c        \
                    $ngx_addon_dir/ngx_rtmp_mp4_module.c        \
                    $ngx_addon_dir/ngx_rtmp_netcall_module.c    \
                    $ngx_addon_dir/ngx_rtmp_relay_module.c      \
                    $ngx_addon_dir/ngx_rtmp_bandwidth.c         \
                    $ngx_addon_dir/ngx_rtmp_exec_module.c       \
                    $ngx_addon_dir/ngx_rtmp_auto_push_module.c  \
                    $ngx_addon_dir/ngx_rtmp_notify_module.c     \
                    $ngx_addon_dir/ngx_rtmp_log_module.c        \
                    $ngx_addon_dir/ngx_rtmp_limit_module.c      \
                    $ngx_addon_dir/ngx_rtmp_bitop.c             \
                    $ngx_addon_dir/ngx_rtmp_proxy_protocol.c    \
                    $ngx_addon_dir/hls/ngx_rtmp_hls_module.c    \
                    $ngx_addon_dir/dash/ngx_rtmp_dash_module.c  \
                    $ngx_addon_dir/hls/ngx_rtmp_mpegts.c        \
                    $ngx_addon_dir/dash/ngx_rtmp_mp4.c          \
                    "
    RTMP_HTTP_SRCS="                                            \
                    $ngx_addon_dir/ngx_rtmp_stat_module.c       \
                    $ngx_addon_dir/ngx_rtmp_control_module.c    \
                    "
    ngx_module_incs=$ngx_addon_dir
    ngx_module_deps=$RTMP_DEPS

    if [ $ngx_module_link = DYNAMIC ] ; then
        ngx_module_name="$RTMP_CORE_MODULES $RTMP_HTTP_MODULES"
        ngx_module_srcs="$RTMP_CORE_SRCS $RTMP_HTTP_SRCS"
        . auto/module
    elif [ $ngx_module_link = ADDON ] ; then
        ngx_module_type=CORE
        ngx_module_name=$RTMP_CORE_MODULES
        ngx_module_srcs=$RTMP_CORE_SRCS
        . auto/module
        ngx_module_type=HTTP
        ngx_module_name=$RTMP_HTTP_MODULES
        ngx_module_srcs=$RTMP_HTTP_SRCS
        . auto/module
    fi

    USE_OPENSSL=YES

When compiling a module ``$ngx_module_link`` is set to ``ADDON`` for compiling a module as a static module and ``DYNAMIC`` when compiling as a Dynamic Module. The static compilation calls ``auto/module`` twice, once for the CORE module and once for the HTTP module. Whereas the dynamic compilation happens in a single module.
