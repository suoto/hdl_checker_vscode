# HDL Checker VC Code client

Simple client for [HDL Checker][hdl_checker]

You'll also need HDL Checker server:

```sh
pip install hdl_checker
```

## About HDL Checker

HDL Checker is a language server that wraps VHDL/Verilg/SystemVerilog tools that
aims to reduce the boilerplate code needed to set things up. It supports
[Language Server Protocol][LSP] or a custom HTTP interface; can infer library
VHDL files likely belong to, besides working out mixed language dependencies,
compilation order, interpreting some compilers messages and providing some
(limited) static checks.

[hdl_checker]: https://github.com/suoto/hdl_checker
[LSP]: https://en.wikipedia.org/wiki/Language_Server_Protocol
