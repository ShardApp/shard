
0.24.1 / 2016-07-28
==================

  * add way to autojoin people to specific team/channel after LDAP auth
  * correctly install ldap lib in docker

0.24.0 / 2016-07-27
==================

  * allow extending auth strategies with extensions
  * add ldap auth extension
  * fix typeahead triggering
  * fix generation of in-app notifications

0.23.2 / 2016-07-26
==================

  * update server widget rendering with new code
  * use correct http codes to fail invites
  * disallow setting self as parent channel

0.23.1 / 2016-07-25
==================

  * use shouldComponentUpdate for redraw optimizations
  * add 24h ttl for notifications
  * increase push debounce to 500ms
  * autosize of forwarded messages
  * use fixed size widgets
  * minor bugfixes

0.23.0 / 2016-07-20
==================

  * add some babel-loader optimizations
  * add icon to manifest for chrome
  * add icon files + add favicon
  * only insert linebreak when forward message is present
  * allow using html tags in markdown
  * use ping interval for db to make sure connections are alive

0.22.0 / 2016-07-05
==================

  * add simple system shard bot that can programmatically dispatch messages
  * add remember me checkbox that extends live of auth token
  * only build/deploy from master
  * add auto-deploy via ssh step
  * align message menu by right side to fix out of bounds drawing when infobar is undocked
  * autoresize widgets when possible

0.21.0 / 2016-06-30
==================

  * add simple trello extension
  * persist undocked infobar size
  * correctly update calendar instead of just creating new ones every time
  * update location path upon channel and team name changes
  * fix showing undocked sidebar when selecting the same view
  * fix additional slash commands not being added

0.20.0 / 2016-06-27
==================

* add calendar sidebar extension
* fix slash commands sorting
* add way for extensions to add custom client slash commands
* correctly handle chat history resets on channel switch
* set correct page titles
* use fixed widget height, open embedded messages link in new window

0.19.0 / 2016-06-22
==================

  * add hotkeys to team menu
  * add basic hotkeys help page
  * add basic markdown cheatsheet
  * allow executing slash commands on the client side + add /description command
  * separate extension added to chat menu with a separator
  * add slight delay before scrolling to message in chat to compensate for widget resizing
  * better styling for widgets
  * autosize widgets using js
  * fix cookie expiration date
  * fix issue with comparing time while adding first message in chat

0.18.0 / 2016-06-21
==================

  * add forward functionality
  * add users sidebar with live updates
  * prevent unnecessary refreshes of team-, side- and infobars
  * discard updated messages that are not on screen
  * remember last selected infobar panel and restore it on page reload
  * navigate to home during errorless logout using location to reset connections

0.17.0 / 2016-06-17
==================

  * basic messages multiselect
  * embedding messages (prepared for forward functionality)
  * basic password reset functionality
  * allow editing notification settings for private conversations
  * fix creation of notifications for private conversations
  * add way to see who read the message
  * hide attach button until attachments are implemented
  * change page title on channel/team switch
  * autofocus on username input after selecting login/register
  * correctly filter out self from notification targets
  * correctly clear auth/register errors on switch
  * re-focus on input after saving edit too
  * allow using esc to cancel edit and re-focus on input afterwards
  * only use arrow up to edit when input is not multiline
  * do not start editing when no owned messages available
  * default private conversation notifications to "all"

0.16.0 / 2016-06-16
==================

  * allow switching between sidebar and dock and persist choice for user
  * allow resizing infobar
  * correctly sort notifications and limit them to last 20

0.15.0 / 2016-06-13
==================

  * fix initial unread count setting
  * remove dead push subscriptions from user profile
  * remove notifyjs and only use serviceworker for notifications
  * allow clicking on push notifications to open corresponding channel
  * debounce notifications and show count when more than one comes in 300ms
  * only try to register for notifications if request was signed
  * better no channels message
  * use correct protocols while on https
  * use correct dockerignore for local db volume
  * add gitlab-ci file

0.14.0 / 2016-06-10
==================

  * implement background push notifications
  * add basic notifications display widget
  * allow specifying basic notification settings
  * basic notifications creation on user messages
  * disallow negative unread counts
  * fix error that appeared while closing team edit dialogue
  * always put me-team on top of list

0.13.0 / 2016-06-09
==================

  * unread counts for team, channels and private conversations
  * remove unneeded local css class
  * rename docker db folder to evade names clash with db subfolder
  * use correct icons for conversations in command palette
  * add me team to command palette
  * match full usernames, not just start

0.12.0 / 2016-06-08
==================

  * implement user conversations
  * do not scale widgets for now at all
  * fix loading indication issue for empty channels
  * change tagline
  * fix fetching older history
  * correctly handle history cleaning

0.11.0 / 2016-06-06
==================

  * add changelog display in app
  * fix issue with status display during history fetching
  * fix push notifications

0.10.0 / 2016-06-03
==================

  * add updates stream and handle dynamic team and channel updates
  * use update socket for dynamic updates, remove polling
  * check rights for channel and team invites separately
  * reset auth error on login

0.9.0 / 2016-06-03
==================

  * display team description in join dialogue
  * allow editing team info and add team descriptions
  * do not render description in join channels when there is none
  * focus on chat input on channel switch
  * reload public channels on subsequent join dialogue opens
  * show loading indication when loading public teams and channels
  * rewrite subchannels
  * allow using double-click to start message edit

0.8.0 / 2016-06-02
==================

  * allow joining public teams and channels
  * allow using commandpalette to switch channels and teams
  * allow creating public/private teams and channels
  * correctly size message edit textarea, allow committing with enter

0.7.0 / 2016-05-31
==================

  * allow using arrow up for editing last message
  * allow editing messages and replies
  * show loader during team load
  * correctly handle replies to more messages
  * do not render chat parts if no channel is selected
  * extract styles into main.css for production

0.6.0 / 2016-05-30
==================

  * better message menu
  * allow editing and deleting channels
  * load hint.css after bulma to stop it from breaking lists

0.5.0 / 2016-05-27
==================

  * add /invite command
  * add /rename command to rename channels
  * allow editing description
  * add fourth column for infobar
  * split chat component into header, messages and input
  * correctly scroll to end on channel change
  * fix channel switching when coming from url
  * fix display for empty descriptions

0.4.0 / 2016-05-26
==================

  * allow using arrow keys to select typeahead result
  * limit typeahead size
  * basic slash commands support
  * show chat input only if channel is selected
  * add basic userbar component and logout button
  * channel names are now lowercase unique
  * correctly de-authorize on token expiration
  * variety of minor bugfixes

0.3.0 / 2016-05-25
==================

  * add desktop notifications about new unread messages
  * only mark unread if user is active
  * add autosizable multiline input
  * use momentjs for better timestamp formatting
  * allow loading previous messages from history
  * add babel-react-optimize for production

0.2.0 / 2016-05-24
==================

  * better production compilation
  * fix read message updates
  * display errors when available
  * reset channels on team switch and show loading indicator
  * better message, channel and team validation and sanity checks
  * disallow empty messages
  * focus chat input in various cases
  * better typeahead styling
  * correctly size content to hide scrollbars
  * allow using enter to submit various forms
  * general code refactoring
  * better logging
  * persist development db upon restarts

0.1.0 / 2016-05-20
==================
  * initial version with basic functionality
