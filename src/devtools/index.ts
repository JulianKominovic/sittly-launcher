import * as clipboard from "./api/clipboard";
import * as music from "./api/music";
import * as notifications from "./api/notifications";
import * as shell from "./api/shell";
import * as files from "./api/files";
import * as indicators from "./api/indicators";
import * as app from "./api/app";
import * as network from "./api/network";
import * as path from "./api/path";
import * as database from "./api/database";

import * as Badge from "./components/badge";
import * as Button from "./components/button";
import * as Checkbox from "./components/checkbox";
import * as Input from "./components/input";
import * as Textarea from "./components/textarea";
import * as Radio from "./components/radio";
import * as Slider from "./components/slider";
import * as Switch from "./components/switch";
import * as Command from "./components/own_command";
import * as Dialog from "./components/dialog";
import * as Fieldset from "./components/fieldset";
import * as Skeleton from "./components/skeletons";
import Select from "./components/select";

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
  Textarea: Textarea.default,
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
  Skeleton: {
    Custom: Skeleton.Skeleton,
    List: Skeleton.ListSkeleton,
  },
  Select: {
    ...Select,
  },
};

const api = {
  clipboard,
  music,
  notifications,
  shell,
  files,
  indicators,
  app,
  network,
  path,
  database,
};

const hooks = {
  ...context,
  ...localStorage,
  ...router,
};

const sittlyDevtools = { api, components, hooks, register, utils, types };

export default sittlyDevtools;
