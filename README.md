# HDL Checker VC Code client

Simple client for [HDL Checker][hdl_checker]

| ![Compilation order on hover](images/report_compilation_sequence.png)                                                                                      |
| :---:                                                                                                                                                      |
| HDL Checker can infer the compilation sequence even without a project file. This sequence can also be inspected by hovering over the name of a design unit |

| ![Go to definition](images/report_path_and_library_on_hover.png)                   |
| :---:                                                                              |
| Inferred libraries and files can be inspected by hovering over their instantiation |

| ![Go to definition](images/report_definition.png) |
| :---:                                             |
| Go to definition                                  |

You'll also need HDL Checker server:

```sh
pip install hdl-checker --upgrade
```

or

```sh
pip install hdl-checker --upgrade --user
```

(when using `--user` remember to add `~/.local/bin` to your `PATH` environment variable!)

## About HDL Checker

HDL Checker is a language server that wraps VHDL/Verilg/SystemVerilog tools that
aims to reduce the boilerplate code needed to set things up. It supports
[Language Server Protocol][LSP] or a custom HTTP interface; can infer library
VHDL files likely belong to, besides working out mixed language dependencies,
compilation order, interpreting some compilers messages and providing some
(limited) static checks.

[hdl_checker]: https://github.com/suoto/hdl_checker
[LSP]: https://en.wikipedia.org/wiki/Language_Server_Protocol
