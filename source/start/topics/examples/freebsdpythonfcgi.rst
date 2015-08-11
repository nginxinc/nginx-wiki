FreeBSD Python FCGI Init Script
===============================

.. code-block:: bash

    #!/bin/sh
    #### Script wrote by Jose Amengual
    # PROVIDE: python fcgi start up script

    . /etc/rc.subr

    name="python_fcgi"
    rcvar=${name}_enable

    project_path="/path_to_your_python_project/code/foo"
    pidfile=/var/run/python-fcgi.pid

    load_rc_config ${name}

    # add python_fcgi_enable="YES" to rc.conf
    [ -z "$python_fcgi_enable" ]      && python_fcgi_enable="NO"

    command=/usr/local/bin/python
    # change maxchildren, maxspare, minspare to whatever you need
    command_args="${project_path}/manage.py runfcgi maxchildren=10 maxspare=5 minspare=2 \
    method=prefork socket=/tmp/python_fcgi.sock pidfile=${pidfile} --pythonpath=${project_path}"

    deqq_client_stop() {
        echo "Stopping $name."
        pids=`cat /var/run/python_fcgi.pid`
        kill ${pids}
        wait_for_pids $pids
    }

    run_rc_command "$1"
    # changing permission the the socket so nginx can talk to it
    chown www:www /tmp/python_fcgi.sock

