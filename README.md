# `submodule-dependency` - Mark submodule pull requests as requirements

The `submodule-dependency` action allows PR authors to mark pull requests against submodules as necessary changes in order to compile a new pull request. The action automatically checks out those submodule changes, based on the contents of the pull request body.

## Declaring a dependency

A submodule pull-request dependency can be declared by putting "Requires \<GitHub user\>/\<repository\>#\<PR number\>" anywhere in the pull request body. You can also use "Depends on" with the same format.

## Limitations

  * The action assumes that the corresponding submodule is located in a folder of the same name in the root directory of the repository.
  * The action assumes that the dependency can be fetched over HTTPS.
  * The action assumes that the `pullfrom` remote name is not in use in the submodule.
