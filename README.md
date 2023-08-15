# Sittly launcher

Launcher for Linux (gnome) similar to Raycast, Spotlight, Albert...

## Devs!

Here you have instructions to setup and run the app in dev mode.

Below you have the instructions to create your own extensions.

### Pre-requisites

- X11 (Xorg) desktop environment (preferably ubuntu gnome). It may work on Wayland and other distros, but it's not tested.
- [Nodejs](https://nodejs.org/en/)
- [Pnpm](https://pnpm.io/)

### Install linux dependencies

- xsel
- xdotool

```bash
sudo apt install xsel xdotool
```

### Steps

- Clone repo
- Cd into repo
- Install dependencies
- Run tauri app in dev mode

```bash
git clone https://github.com/JulianKominovic/sittly-launcher.git sittly-launcher
cd sittly-launcher
npm i -g pnpm
pnpm i
pnpm run tauri dev
```

### Creating extensions

## Usage

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
- [x] Buttons
- [x] Badges
- [ ] Input fields
  - [ ] Select fields
  - [x] Input text
  - [x] Input password
  - [x] Input number
  - [x] Input files
  - [x] Checkbox
  - [x] Radio
  - [x] Switch
  - [x] Slider
  - [ ] Color picker
- [ ] Markdown renderer
- [ ] Links
- [ ] Layouts

### v2 (Extensions)

Second version, with extensions support.

As we already have the UI, we can start adding extensions support.

Until v4, this extensions will be kept private in the same repository, but in the future, they will be moved to their own repositories.

- [ ] Extensions modeling
  - [ ] Metadata
  - [x] No results items
  - [x] Global context menu actions
  - [x] Pages (needs routing)
  - [x] Main actions (index screen)
  - [ ] Readme
- [x] Navigation
  - [x] Routing
  - [x] Back button
  - [x] Forward button
  - [x] Home button
  - [x] Keyboards events

### v3 (Hooks, SO integrations, services)

- [x] Searchbar hooks
  - [x] Value
  - [x] Placeholder
- [x] Clipboard hooks
  - [x] Copy
  - [x] Paste
  - [x] Paste to current window
- [ ] Filesystem hooks
  - [x] Open file
  - [x] Open folder
  - [ ] Open terminal
  - [x] Open with
- [ ] System hooks
  - [x] Open url
  - [x] Open app
- [x] Router hooks
  - [x] Go back
  - [x] Go forward
  - [x] Go home
- [ ] Async tasks
  - [ ] Async tasks indicator
  - [ ] Async tasks list
  - [ ] Async tasks cancel
  - [ ] Async wrapper to handle success, error, loading and cancel
- [ ] Notifications
  - [ ] Notification list
  - [x] Send notifications

### v4 (Extension dev template, docs, devtools, api)

- [ ] Extension dev template
  - [x] Github template
  - [x] Github hosting compiled extensions
  - [ ] Version control
  - [ ] Fast refresh
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
- [x] Devtools
  - [x] Compilation scripts
  - [x] Move UI components, hooks, services, utils, types, models, etc to npm sittly-devtools
  - [ ] Find a better way of load extensions
    - [ ] A faster compilation
    - [ ] A secure way of load extensions
  - [x] sittly-devtools/components
  - [x] sittly-devtools/hooks
  - [x] sittly-devtools/api
  - [x] sittly-devtools/types
  - [x] sittly-devtools/lib/utils
