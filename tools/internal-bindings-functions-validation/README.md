When a function is defined in the C++ layer, it can be registered to an internal binding, making it accessible from the JavaScript layer. The scripts in this directory provide automated validation for this process. Specifically, there are two scripts:

- `usage.mjs`: Verifies that every function registered to an internal binding is utilized in at least one JavaScript file, either in the [lib directory](../../lib) or the [test directory](../../test).
- `typings.mjs`: Ensures that every function registered to an internal binding has a corresponding type defined in the [typings directory](../../typings).

Note: This validation is a best-effort approach that relies on reading file contents and using regular expressions for the checks. It can be enhanced over time if necessary.
