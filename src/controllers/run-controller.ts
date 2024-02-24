import { Request, Response } from "express";
import { spawn } from "child_process";

type Option = { name: string };

export async function runCommandController(req: Request, res: Response) {
  const body = req.body;
  const command = body.command;
  const options: Option[] = body.options;
  const args = body.args;
  if (!command) {
    res.status(400).json({ error: "No command provided" });
    return;
  }
  try {
    const result = await runShellCommand(command, args, options, res);
    if (typeof result !== "string") {
      throw result;
    }
    // res.json({ result: result.trim().split("\n") });
  } catch (error: any) {
    res.json({ error: error.message });
  }
}

async function runShellCommand(
  command: string,
  args: string,
  options: Option[],
  res: Response
) {
  return new Promise<string | Error>((resolve, reject) => {
    const formattedOptions: string[] =
      options.length > 0
        ? [
            options.reduce((prev, current) => {
              return prev + current.name;
            }, "-"),
          ]
        : [];
    if (args) {
      args.split(" ").forEach((arg) => {
        formattedOptions.push(arg);
      });
    }

    const child = spawn(command, formattedOptions);
    let stdout = "";
    let stderr = "";
    child.stdout.on("data", (data: string) => {
      res.write(data);
      stdout += data;
    });
    child.stderr.on("data", (data: string) => {
      stderr += data;
    });
    child.on("error", (error: Error) => {
      reject(error);
    });
    child.on("close", (code: number) => {
      if (code === 0) {
        res.write("\n\n");
        res.end();
        resolve(stdout);
      } else {
        reject(new Error(stderr));
      }
    });
  });
}
