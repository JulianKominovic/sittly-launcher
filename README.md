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

Call to action for bored devs.

## Usage

