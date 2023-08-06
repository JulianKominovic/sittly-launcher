# Sittly launcher

A Raycast app copy for Linux.

## Roadmap

### v1 (UI)

First version of the UI, with all the components needed to build a launcher.

- [x] Command component like [Cmdk](https://cmdk.paco.me/) but virtualized for maximum performance.
  - [x] List
  - [x] Grid
  - [x] Search (filtering)
  - [x] Items
- [x] Footer
  - [x] Async tasks indicator
  - [x] Context menu integration
  - [x] Status bar
- [x] Context menu
  - [x] Hook to set and get context menu items
  - [x] Global context menu open flag
  - [x] Context menu items
- [ ] Buttons
- [ ] Links
- [ ] Layouts

### v2 (Extensions)

Second version, with extensions support.

As we already have the UI, we can start adding extensions support.

Until v4, this extensions will be kept private in the same repository, but in the future, they will be moved to their own repositories.

- [ ] Extensions modeling
  - [ ] Metadata
  - [ ] Commands
  - [ ] Global context menu actions
  - [x] Pages (needs routing)
  - [x] Main actions (index screen)
  - [ ] Readme
- [x] Navigation
  - [x] Routing
  - [x] Back button
  - [ ] Forward button
  - [ ] Home button
  - [x] Keyboards events

### v3 (Hooks, SO integrations, services)

- [ ] Searchbar hooks
  - [ ] Value
  - [ ] Placeholder
- [ ] Clipboard hooks
  - [ ] Copy
  - [ ] Paste
  - [ ] Paste to current window
- [ ] Filesystem hooks
  - [ ] Open file
  - [ ] Open folder
  - [ ] Open terminal
  - [ ] Open with
- [ ] System hooks
  - [ ] Open url
  - [ ] Open app
- [ ] Router hooks
  - [ ] Go back
  - [ ] Go forward
  - [ ] Go home
- [ ] Async tasks
  - [ ] Async tasks indicator
  - [ ] Async tasks list
  - [ ] Async tasks cancel
  - [ ] Async wrapper to handle success, error, loading and cancel
- [ ] Notifications
  - [ ] Notification list
  - [ ] Send notifications

### v4 (Extension dev template, docs, devtools, api)

- [ ] Extension dev template
  - [ ] Github template
  - [ ] Npm template
- [ ] Docs
  - [ ] Nextjs docs or docusaurus
  - [ ] Extension examples
  - [ ] Extension dev guide
  - [ ] Extension api
  - [ ] Extension hooks
  - [ ] Extension services
  - [ ] Extension models
  - [ ] Extension components
  - [ ] Extension utils
  - [ ] Extension types
- [ ] Devtools
  - [ ] Move UI components, hooks, services, utils, types, models, etc to npm @sittly/devtools
  - [ ] @sitlly/devtools/components
  - [ ] @sitlly/devtools/hooks
  - [ ] @sitlly/devtools/services
  - [ ] @sitlly/devtools/utils
  - [ ] @sitlly/devtools/types
  - [ ] @sitlly/devtools/models
