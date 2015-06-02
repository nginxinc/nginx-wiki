Submitting Contributions
========================

The Nginx Wiki is automatically generated from `reStructuredText files <https://en.wikipedia.org/wiki/ReStructuredText>`_ using `Sphinx Documentation Generator <http://sphinx-doc.org/>`_. The source files are `stored in GitHub <https://github.com/nginxinc/nginx-wiki>`_ and are open to contributions via. pull requests. This document will help guide you through this process.

These instructions are for Linux and Mac users and assumes you have a GitHub account and the ``git`` command line tool is installed.

You will also need *python-sphinx* installed, some linux distributions have this in their repositories, others can install it using `pip`:

.. code-block:: bash

   $ pip install -U Sphinx

GitHub's Two Factor Authentication
----------------------------------

If you use `two-factor authentication <https://github.com/settings/two_factor_authentication/configure>`_ with GitHub (highly recommended) you can access GitHub using the instructions outlined in this document with an access token instead of a password. This can be obtained from your `application settings page <https://github.com/settings/applications>`_.

Alternatively you can use SSH to access GitHub. Simply go to your `SSH keys page <https://github.com/settings/ssh>`_, add your key and change the URLs in this document from ``https://github.com/user/project.git`` to ``git@github.com:user/project.git``.

Forking
-------

You need to create a *fork* of the source so that you have a working area for it. To do this go to the `wiki GitHub page <https://github.com/nginxinc/nginx-wiki>`_, sign in and click the *Fork* button near the top. Once you have forked you can get a local copy of this fork to work on. To do this run the following in your console (where *user* is your username):

.. code-block:: bash

   $ git clone https://github.com/user/nginx-wiki.git

You then need to make your local clone aware of the upstream repository:

.. code-block:: bash

   $ cd nginx-wiki
   $ git remote add upstream https://github.com/nginxinc/nginx-wiki.git

Branch
------

Every new batch of additions/edits to be merged into the wiki needs its own branch. Before creating a new branch you should first make sure your local copy is up to date:

.. code-block:: bash

   $ git checkout master
   $ git pull --ff-only upstream master
   $ git push

You can then create a new branch from master to work on (replacing *name_for_branch* with what you want to call the branch):

.. code-block:: bash

   $ git checkout -b name_for_branch

Hack on the wiki!
-----------------

Hack away on the changes you wish to make. See :doc:`writing_docs` for more information.

Test
----

Once your edits are ready to test you can check to see if they build correctly using:

.. code-block:: bash

   $ make html
   $ make linkcheck

If either of these error then these edits will likely need fixing. The Nginx community team will be happy to assist you with this.

One way you could preview the output is to use PHP's built-in server:

.. code-block:: bash

   $ cd build/html/
   $ php -S localhost:8000

You can then use your web browser to go to ``http://localhost:8000/`` and view the result.

Commit and push
---------------

When you are ready to push up your changes you need to commit these and push them up to GitHub.

If you have never pushed code up to GitHub before then you need to setup git so that is knows you for the commit:

.. code-block:: bash

   $ git config --global user.name "Real Name"
   $ git config --global user.email "me@me.com"

Make sure you use `git add` to add any new files to the respository and then commit:

.. code-block:: bash

   $ git commit -a

Your default text editor will pop up to enter a commit message above the comments. The first line should be no more than 50 characters and should be a subject of the commit. The second line should be blank. The third line onwards can contain details and these should be no more than 72 characters long per line.

If your commit fixes an issue you can add the following (for issue #45 for example)::

    Fixes nginxinc/niginx-wiki#45

Once all your commits are done a quick rebase may be needed to make sure your changes will merge OK with what is now in master:

.. code-block:: bash

   $ git fetch upstream
   $ git rebase -i upstream/master

This should bring up a commit-style message in the editor with *pick* as the first word.  Save this and the rebase will complete.  If the rebase tells you there is a conflict you will need to locate the problem using ``git diff``, fix it and do:

.. code-block:: bash

   git add <filename>
   git rebase --continue

If things look like they are going wrong you can undo the rebase using the following and can get in touch with the Nginx Community team:

.. code-block:: bash

   git rebase --abort

You should now be ready to push up to GitHub:

.. code-block:: bash

   git push --set-upstream origin name_for_branch

Pull Request
------------

If you go to your repository on GitHub's website you will an option to file a *Pull Request*. Use this to submit a pull request upstream for your branch. You are welcome to make multiple commits in a branch before opening a pull request.

.. todo:

   Travis CI will automatically test your branch and report back on the pull request, this typically takes up to 5 minutes.  If there is a failure you can commit more changes and push them up, these will automatically be tested by Travis as part of the pull request.  Your pull request will then be reviewed by a human and if all is good it will be merged.  Feedback will be left on the pull request for you.
