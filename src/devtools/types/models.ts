export type File = {
  base64: string;
  file_type: string;
  is_dir: boolean;
  last_modified: {
    secs_since_epoch: number;
  };
  name: string;
  path: string;
  size: number;
};
