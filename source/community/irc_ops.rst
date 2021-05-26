
.. meta::
   :description: Resources for operators on the NGINX IRC channel.

.. _community-irc_ops:

IRC Operator Guidelines
=======================

Here are some points to remember when enabling operator status:

* *Stay friendly*: Trolls, flooders, people with no social skills--they all
  visit from time to time. If someone is abusive, warn him or her. If someone won't
  learn or gets aggressive, remove the offender from the chat. If someone is
  (accidentally) flooding, mute or remove that person and give the URL to our
  pastebin. Don't forget to unmute when you think the flood is over. Never
  swear at people, though; always stay friendly. If you remove a very abusive
  person, don't respond to the cheering you will get. Don't be surprised at the
  abuse and swearing in private messages you will get either. 
* *Don't hold ops*: After you finish doing what you needed operator privileges for,
  de-op yourself. Staying +o for long periods is not really useful and you'll
  attract unneeded attention. A possible exception is when general commotion
  might be going on in the channel and staying +o might be useful to indicate
  to other members that you are around, so that they don't need to call !ops. 
* *Don't use ignore*: Even when people are very offensive to you in private
  chat, don't use your /ignore function. A soft-ignore (simply not
  responding) works nearly as well. If you /ignore too much, chances are you
  will miss problems in the channel. Libera Chat also has +g user mode, which 
  blocks private messages and notices but not channel activity. If someone is
  abusive in private, /mode <your_nick> +g can help; you can add exceptions with
  /accept command. Do not filter your channel info (joins/parts/klines etc).
  These also hold much info. 
* *Ban on sight*: So far there have been no very abusive users. In extreme
  cases, users can be added to a special list in ChanServ that prevents them from
  ever entering the channel again. If you think someone qualifies for this list,
  discuss it with the other operators in #nginx-master. 
* *Clean your bans regularly*: It is unavoidable that people will be banned.
  Make sure you don't simply forget these bans and never remove them. Users
  usually learn from their mistakes, and very often a long term ban is not
  needed. The IRC bot is a useful tool to review why a ban was put in place.
* *Comment on your bans*: ngxbot logs all kicks/bans/removes/mutes. You can
  comment on your actions in the ban tracker. This is really useful to keep
  track of both abusive users and bans that are around for a long time. Comments
  can also be used to alert other ops that a ban should not be removed before
  talking to you. Ngxbot sends you a query after you create a ban, telling you
  how to comment on that ban. This makes it both very easy and very efficient to
  add comments about bans, which makes managing future issues much easier. 
* *Don't retaliate*: If someone misbehaves, don't retaliate. Take only the
  appropriate actions to prevent further abuse (kick, ban, contact Libera Chat
  staff). Retaliation is against the :ref:`community-irc-coc` and makes us
  look bad as an operator team. As operators we expect users to retaliate when
  we reprimand them. This is what a ban is for and if users attempt to evade a
  ban we have further actions we can take. However, when operators retaliate it
  can become extremely disruptive in a channel, especially if two operators
  disagree. Retaliation from operators is unacceptable behavior. 

When to Ban/Kick Someone
------------------------

This is a summary of the current ad-hoc (generally accepted) guidelines used by
the operators.

* Flooding: mute
* Accidental flooding (pasting): mute and point to pastebin (remove mutes when
  you think the paste is over)
* Swearing/off-topic: warn
* Repeated swearing/off-topic: quiet
* Someone who comes back after a kick and continues misbehaving: ban
* Trolling: ban
* Personal attacks against people: kick/ban 

Examples of trolling:

* Repeatedly asking about other web servers or OSs
* Seeking for the limits of what's allowed
* A lot of CAPS
* Being only negative about NGINX or other topics 

Accidents Happen
----------------

After staying on IRC for a while, ops can get a bit trigger-happy. Don't forget
that accidents do happen. Please don't impose severe punishments on accidental
mishaps. In addition, users can make mistakes just as easily. It is expected
that operators can recognize when an accident happened and respond accordingly.
