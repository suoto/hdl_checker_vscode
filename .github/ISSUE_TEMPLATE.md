# Issue details

For questions or help, consider using [gitter.im](https://gitter.im/suoto/hdl_checker)

When opening an issue, make sure you provide

* Output of `hdl_checker -V`
* Python version used
* OS
* Compiler and version, one of
  * `vsim -version`
  * `ghdl --version`
  * `xvhdl -version`
* HDL Checker log output if possible (*please note that this typically includes filenames, compiler name and version and some design unit names!*). To enable logging:
  1. Open your [settings.json](https://code.visualstudio.com/docs/getstarted/settings#_settings-file-locations)
  2. Add `hdlChecker.logPath` and `hdlChecker.logLevel` keys:
      ```
      {
        ...
          "hdlChecker.logPath": "<some/path>",
          "hdlChecker.logLevel": "DEBUG",
      }
      ```
  3. Restart VS Code
* Contents of the Output and Debug Console if any

Please note that the issue will have to be reproduced to be fixed, so adding a minimal reproducible example goes a long way.
