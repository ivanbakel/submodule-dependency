# `submodule-dependency` - Mark submodule pull requests as requirements

The `submodule-dependency` action allows PR authors to mark pull requests against submodules as necessary changes in order to compile a new pull request. The action automatically checks out those submodule changes, based on the contents of the pull request body.

## Declaring a dependency

A submodule pull-request dependency can be declared by putting "Requires <GitHub user>/<repository>#<PR number>" anywhere in the pull request body.
