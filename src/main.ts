import * as core from '@actions/core'
import * as exec from '@actions/exec'
import * as github from '@actions/github'
import * as webhooks from '@octokit/webhooks'

async function run(): Promise<void> {
  try {
    if (github.context.eventName == "pull_request") {

      core.startGroup("Looking for submodule dependencies")

      // TODO: Support more than one dependency
      var depUser = null;
      var depRepo = null;
      var depPR = null;

      const pr = github.context.payload as webhooks.Webhooks.WebhookPayloadPullRequest;

      const submodule_dependency_pattern
        = /requires (?<depUser>[a-zA-Z0-9_-]+)\/(?<depRepo>[a-zA-Z0-9_-]+)#(?<depPR>[0-9]+)/i;

      const results = submodule_dependency_pattern.exec(pr.pull_request.body);

      if (results != null && results.groups != undefined) {
        depUser = results.groups["depUser"];
        depRepo = results.groups["depRepo"];
        depPR = results.groups["depPR"];

        core.info(`Detected a submodule dependency - pull request ${depPR} on ${depUser}/${depRepo}`);

      } else {
        core.info("No submodule dependencies found");
      }

      core.endGroup();

      if (depUser == null || depRepo == null || depPR == null) {
        return;
      }

      core.startGroup("Update submodules")

      // Assumption: the submodule is in a folder of the same name (the name of the dependency repo)
      // TODO: use a better system

      const git_options = { cwd: `./${depRepo}` };

      await exec.exec("git", ["remote", "add", "pullfrom", `https://github.com/${depUser}/${depRepo}.git`], git_options);

      await exec.exec("git", ["pull", "--no-edit", "pullfrom", `pull/${depPR}/head`], git_options);

      core.info(`Updated submodule ${depRepo} to ${depUser}/${depRepo}#${depPR}`);

      core.endGroup()
    } else {
      core.info("Not a pull request, ignoring.");
    }
  } catch (error) {
    core.setFailed(error.Message)
  }
}

run()
