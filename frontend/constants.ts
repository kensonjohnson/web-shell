export type CommandOptionsMap = {
  [command: string]: Command;
};

export type Command = {
  acceptsArguments: boolean;
  requiresArguments: boolean;
  arguments?: string[];
  options: Record<string, Option>;
};

export type Option = {
  acceptsArguments: boolean;
  description: string;
};

export const COMMAND_OPTIONS_MAP: CommandOptionsMap = {
  ls: {
    acceptsArguments: true,
    requiresArguments: false,
    options: {
      l: { acceptsArguments: false, description: "Detailed list" },
      a: { acceptsArguments: false, description: "Show hidden files" },
      p: {
        acceptsArguments: false,
        description: "Add / to end of directories",
      },
    },
  },
  ps: {
    acceptsArguments: false,
    requiresArguments: false,
    options: {
      e: {
        acceptsArguments: false,
        description: "Show processes from all users",
      },
      x: {
        acceptsArguments: false,
        description: "Show processes without a controlling terminal",
      },
      c: { acceptsArguments: false, description: "Show the command only" },
      f: {
        acceptsArguments: false,
        description: "Show full (verbose) listing",
      },
    },
  },
  multipass: {
    acceptsArguments: true,
    requiresArguments: false,
    arguments: ["launch", "delete", "start", "stop"],
    options: {
      h: { acceptsArguments: false, description: "Show help" },
      v: { acceptsArguments: false, description: "Verbose output" },
    },
  },
};
