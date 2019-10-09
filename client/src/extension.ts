/* --------------------------------------------------------------------------------------------
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 * ------------------------------------------------------------------------------------------ */

import * as path from "path";
import { workspace, ExtensionContext } from "vscode";
import vscode = require("vscode");

import {
  LanguageClient,
  LanguageClientOptions,
  ServerOptions
} from "vscode-languageclient";

let client: LanguageClient;

export function activate(context: ExtensionContext) {
  // The server is implemented in node
  let serverCommand = "hdl_checker";

  // The debug options for the server
  // --inspect=6009: runs the server in Node's Inspector mode so VS Code can attach to the server for debugging
  let cfgLogFile = workspace.getConfiguration().get("hdlChecker.cfgLogFile");

  let debugOptions = ["--log-level", "DEBUG"];

  if (cfgLogFile) {
    debugOptions = debugOptions.concat(["--log-stream", cfgLogFile.toString()]);
  }

  // If the extension is launched in debug mode then the debug server options are used
  // Otherwise the run options are used
  let serverOptions: ServerOptions = {
    run: { command: serverCommand, args: ["--lsp"] },
    debug: {
      command: serverCommand,
      args: ["--lsp"].concat(debugOptions)
    }
  };

  // Options to control the language client
  let clientOptions: LanguageClientOptions = {
    // Register the server for plain text documents
    documentSelector: [
      { scheme: "file", language: "vhdl" },
      { scheme: "file", language: "verilog" },
      { scheme: "file", language: "systemverilog" }
    ],
    synchronize: {
      // Notify the server about file changes to '.clientrc files contained in the workspace
      fileEvents: workspace.createFileSystemWatcher("**/.clientrc")
    }
  };

  // Create the language client and start the client.
  client = new LanguageClient(
    "hdlChecker",
    "HDL Checker",
    serverOptions,
    clientOptions
  );

  // Start the client. This will also launch the server
  client.start();
}

export function deactivate(): Thenable<void> | undefined {
  if (!client) {
    return undefined;
  }
  return client.stop();
}
