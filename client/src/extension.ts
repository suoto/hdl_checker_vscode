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
let compilerPath: string;

// export function workspace.onDidChangeTextEditorOptions: Event<TextEditorOptionsChangeEvent> {
// }
workspace.onDidChangeConfiguration(e => logEvent(e));
// workspace.onWillSaveTextDocument(e => logEvent(e));

function logEvent(event) {
  if (!client) {
    console.log("No client, nothing to do");
    return;
  }

  let restart = false;

  if (
    compilerPath != workspace.getConfiguration().get("hdlChecker.compilerPath")
  ) {
    restart = true;
  }

  if (!restart) {
    return;
  }

  console.log("Configuratino has changed, we should restart the server");
}

export function activate(context: ExtensionContext) {
  // The server is implemented in node
  let serverCommand = "hdl_checker";
  let serverArgs = ["--lsp"];

  compilerPath = workspace.getConfiguration().get("hdlChecker.compilerPath");

  let debugArgs = [];

  // The debug options for the server
  if (context.logPath) {
    debugArgs = [
      "--log-stream",
      context.logPath.toString(),
      "--log-level",
      "DEBUG"
    ];
  }

  // Add the configured compiler path if it has been set
  let serverEnv = process.env;

  if (compilerPath) {
    serverEnv.PATH = compilerPath + ":" + serverEnv.PATH;
    console.log("Adding " + compilerPath + " to the server startup path");
  }

  // If the extension is launched in debug mode then the debug server options are used
  // Otherwise the run options are used
  let serverOptions: ServerOptions = {
    run: {
      command: serverCommand,
      args: serverArgs,
      options: { env: serverEnv }
    },
    debug: {
      command: serverCommand,
      args: serverArgs.concat(debugArgs),
      options: { env: serverEnv }
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
  console.log("Stopping client");
  return client.stop();
}
