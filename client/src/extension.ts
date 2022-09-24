/* --------------------------------------------------------------------------------------------
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 * ------------------------------------------------------------------------------------------ */

import * as path from "path";
import { workspace, ExtensionContext } from "vscode";
import os = require('os');

import {
  LanguageClient,
  LanguageClientOptions,
  ServerOptions
} from "vscode-languageclient/node";

let client: LanguageClient;
let cfgCompilerPath: string;

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
    cfgCompilerPath != workspace.getConfiguration().get("hdlChecker.compilerPath")
  ) {
    restart = true;
  }

  if (!restart) {
    return;
  }

  console.log("Configuration has changed, we should restart the server");
}

export function activate(context: ExtensionContext) {
  // The server is implemented in node
  let serverCommand = "hdl_checker";
  let serverArgs = ["--lsp"];

  cfgCompilerPath = workspace.getConfiguration().get("hdlChecker.compilerPath");
  let cfgLogPath = workspace.getConfiguration().get("hdlChecker.logPath");
  let cfgLogLevel = workspace.getConfiguration().get("hdlChecker.logLevel");

  let debugRunArgs = [];
  
  // The debug options for the server
  if (context.logPath) {
    debugRunArgs = [
      "--log-stream",
      context.logPath.toString(),
      "--log-level",
      "DEBUG"
    ];
  }
    
  let extraRunArgs = [];
    
  if (cfgLogPath) {
    extraRunArgs = [
      "--log-stream",
      cfgLogPath.toString(),
    ];
  }

  if (cfgLogLevel) {
    extraRunArgs = extraRunArgs.concat(
      [
        "--log-level",
        cfgLogLevel.toString().toUpperCase()
      ]
    );
  }

  // Add the configured compiler path if it has been set
  let serverEnv = process.env;

  if (cfgCompilerPath) {
    if ( os.platform() == "win32" ) {
      serverEnv.PATH = cfgCompilerPath + ";" + serverEnv.PATH;
    } else {
      serverEnv.PATH = cfgCompilerPath + ":" + serverEnv.PATH;
    }
    console.log("Adding " + cfgCompilerPath + " to the server startup path");
  }

  // If the extension is launched in debug mode then the debug server options are used
  // Otherwise the run options are used
  let serverOptions: ServerOptions = {
    run: {
      command: serverCommand,
      args: serverArgs.concat(extraRunArgs),
      options: { env: serverEnv }
    },
    debug: {
      command: serverCommand,
      args: serverArgs.concat(debugRunArgs),
      options: { env: serverEnv }
    }
  };

  console.log("Server options: run: " + serverOptions.run.command + " " + serverOptions.run.args.join(" "));
  console.log("Server options: debug: " + serverOptions.debug.command + " " + serverOptions.debug.args.join(" "));

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
