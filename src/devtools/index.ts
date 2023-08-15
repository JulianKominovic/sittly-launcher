import * as clipboard from "./api/clipboard";
import * as music from "./api/music";
import * as notifications from "./api/notifications";
import * as shell from "./api/shell";

import * as Badge from "./components/badge";
import * as Button from "./components/button";
import * as Checkbox from "./components/checkbox";
import * as Input from "./components/input";
import * as Radio from "./components/radio";
import * as Slider from "./components/slider";
import * as Switch from "./components/switch";
import * as Command from "./components/own_command";
import * as Dialog from "./components/dialog";
import * as Fieldset from "./components/fieldset";

import * as context from "./hooks/context";
import * as localStorage from "./hooks/localStorage";
import * as router from "./hooks/router";

import register from "./register";

import * as utils from "./lib/utils";

import * as types from "./types";

const components = {
  Badge: Badge.Badge,
  Button: Button.Button,
  Checkbox: Checkbox.Checkbox,
  Input: Input.default,
  Radio: {
    Group: Radio.RadioGroup,
    GroupItem: Radio.RadioGroupItem,
  },
  Slider: Slider.default,
  Switch: Switch.default,
  Command: Command.default,
  Dialog: {
    ...Dialog.default,
    Root: Dialog.default.Dialog,
  },
  Fieldset: Fieldset.default,
};

const api = {
  clipboard,
  music,
  notifications,
  shell,
};

const hooks = {
  ...context,
  ...localStorage,
  ...router,
};

const sittlyDevtools = { api, components, hooks, register, utils, types };

export default sittlyDevtools;
