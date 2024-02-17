import { Request, Response } from "express";
import { spawn } from "child_process";

export async function runCommandController(req: Request, res: Response) {
  const body = req.body;
  const command = body.command;
  const options = body.options;
  if (!command) {
    res.status(400).json({ error: "No command provided" });
    return;
  }
  try {
    const result = await runShellCommand(command, options);
    if (typeof result !== "string") {
      throw result;
    }
    res.json({ result: result.trim().split("\n") });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
}

async function runShellCommand(command: string, options: string[]) {
  return new Promise<string | Error>((resolve, reject) => {
    const formattedOptions: string[] =
      options.length > 0 ? ["-" + options.join("")] : [];
    console.log({ command, options, formattedOptions });

    const child = spawn(command, formattedOptions);
    let stdout = "";
    let stderr = "";
    child.stdout.on("data", (data: string) => {
      stdout += data;
    });
    child.stderr.on("data", (data: string) => {
      stderr += data;
    });
    child.on("close", (code: number) => {
      console.log("Closing");
      if (code === 0) {
        resolve(stdout);
      } else {
        reject(new Error(stderr));
      }
    });
  });
}
