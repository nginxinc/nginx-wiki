
.. meta::
   :description: This document will help guide you through the contribution process for the NGINX Wiki.

Submitting Contributions
========================

The NGINX Wiki is automatically generated from `reStructuredText files <https://en.wikipedia.org/wiki/ReStructuredText>`_ using `Sphinx Documentation Generator <http://www.sphinx-doc.org/en/stable/>`_. The source files are `stored in GitHub <https://github.com/nginxinc/nginx-wiki>`_ and are open to contributions via pull requests. This document will help guide you through this process.

Editing on GitHub
-----------------

Whilst viewing wiki you will find "Edit on GitHub" links in the sidebar on every page. Using this you can edit page content and submitting your edits will generate a pull request. This is a relatively simple way to make quick edits.

Editing on your local computer
------------------------------

These instructions are for Linux and Mac users, and assume you have a GitHub account and the ``git`` command-line tool is installed.

You also need *python-sphinx* installed; some Linux distributions have this in their repositories, while for others you can install it using ``pip``:

.. code-block:: bash

   $ sudo pip install -r requirements.txt

GitHub's Two-Factor Authentication
----------------------------------

If you use GitHub's `two-factor authentication <https://github.com/settings/two_factor_authentication/configure>`_ (highly recommended), you can use an access token instead of a password when accessing GitHub with the instructions outlined in this document. This can be obtained from your `application settings page <https://github.com/settings/applications>`_.

Alternatively, you can use SSH to access GitHub. Simply go to your `SSH keys page <https://github.com/settings/ssh>`_, add your key, and change the URLs in this document from ``https://github.com/<user>/nginx-wiki.git`` to ``git@github.com:<user>/nginx-wiki.git``.

Forking
-------

You need to create a *fork* of the source so that you have a working area for it. To do this go to the `NGINX Wiki GitHub page <https://github.com/nginxinc/nginx-wiki>`_, sign in, and click the *Fork* button near the top. Once you have forked you can get a local copy of this fork to work on. To do this, run the following command in your console (where <*user*> is your username):

.. code-block:: bash

   $ git clone https://github.com/<user>/nginx-wiki.git

You then need to associate your local clone with the upstream repository:

.. code-block:: bash

   $ cd nginx-wiki
   $ git remote add upstream https://github.com/nginxinc/nginx-wiki.git

Branch
------

Every new batch of additions/edits you want to merge into the Wiki needs its own branch. Before creating a new branch, first make sure your local copy is up to date:

.. code-block:: bash

   $ git checkout master
   $ git pull --ff-only upstream master
   $ git push

You can then create a new branch based on the master (replacing <*branch-name*> with the name you choose for the branch):

.. code-block:: bash

   $ git checkout -b <branch-name>

Hack on the Wiki!
-----------------

Hack away on the changes you wish to make. See :doc:`writing_docs` for more information.

Test
----

Once your edits are ready to test, run these commands to check that they build correctly:

.. code-block:: bash

   $ make dirhtml
   $ make linkcheck

If either command generates an error, your edits probably need fixing.

If you've recently run ``make linkcheck`` and many permanent redirects were found, you can automatically replace them all by running:

.. code-block:: bash

   $ make linkfix

This script is just a quick hack for the lazy, so make sure to check that it didn't break anything syntactically before you commit.

One way to preview the output is to use NGINX. The build system can already setup NGINX for you if you have it installed:

.. code-block:: bash

   $ make serve

Or if you have NGINX in a non-standard path (for example ``/opt/nginx/``) you can point to the path of the NGINX binary with:

.. code-block:: bash

   $ NGINX_PATH=/opt/nginx/sbin make serve

You can then use your web browser to go to ``http://localhost:8080/`` and view the result.

When you are done, **CTRL-C** will exit NGINX.

Commit and Push
---------------

When you are ready to submit your changes, you need to commit them in your cloned repository and then push them up to GitHub.

If you have never pushed code up to GitHub before, run these commands to register with ``git``:

.. code-block:: bash

   $ git config --global user.name "Real Name"
   $ git config --global user.email "me@me.com"

Use ``git add`` to add any new files to the respository, and then commit:

.. code-block:: bash

   $ git commit -a

Your default text editor pops up. Enter a commit message above the comments. The first (subject) line should describe the purpose of the commit in no more than 50 characters. The second line should be blank. The third line onwards can contain details, with no more than 72 characters per line.

If your commit fixes an issue, the first line might be something like this example for issue #45::

    Fixes nginxinc/nginx-wiki#45

Once all your commits are done, you might need to do a quick rebase to make sure your changes will merge correctly into the master branch:

.. code-block:: bash

   $ git fetch upstream
   $ git rebase -i upstream/master

Your editor should pop up again with a commit-style message that has *pick* as the first word. Save the message and the rebase will complete. If the rebase tells you there is a conflict, you will need to locate the problem using ``git diff``, fix it, and run these commands:

.. code-block:: bash

   $ git add <filename>
   $ git rebase --continue

If things look like they are going wrong, you can undo the rebase using the following command and then get in touch with the NGINX community team for help:

.. code-block:: bash

   $ git rebase --abort

You should now be ready to push up to GitHub:

.. code-block:: bash

   $ git push --set-upstream origin <branch-name>

Pull Request
------------

When you go to your repository on GitHub's website, you will see an option to file a *Pull Request*. Use this to submit a pull request upstream for your branch. You are welcome to make multiple commits in a branch before submitting the pull request.

.. todo:

   Travis CI will automatically test your branch and report back on the pull request; this typically takes up to 5 minutes. If there is a failure, you can commit more changes to correct the problem. When you push them up, Travis will automatically test them as part of the pull request. Your pull request will then be reviewed by a human, and merged if all is good. Feedback for you will be left on the pull request.
