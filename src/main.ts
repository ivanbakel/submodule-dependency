import * as core from '@actions/core'
import * as exec from '@actions/exec'
import * as github from '@actions/github'
import * as webhooks from '@octokit/webhooks'
import * as dependencies from './dependencies'

async function run(): Promise<void> {
  try {
    if (github.context.eventName == "pull_request") {

      core.startGroup("Looking for submodule dependencies")

      const pr = github.context.payload as webhooks.Webhooks.WebhookPayloadPullRequest;

      const deps = dependencies.get_submodule_dependencies(pr.pull_request.body);

      if (deps.length > 0) {
        for (var dep of deps) {
          core.info(`Detected a submodule dependency - pull request ${dep.depPR} on ${dep.depUser}/${dep.depRepo}`);
        }
      } else {
        core.info("No submodule dependencies found");
      }

      core.endGroup();

      if (deps.length == 0) {
        return;
      }

      core.startGroup("Update submodules")

      // Assumption: the submodule is in a folder of the same name (the name of the dependency repo)
      // TODO: use a better system

      for (var dep of deps) {
        const git_options = { cwd: `./${dep.depRepo}` };

        await exec.exec("git", ["remote", "add", "pullfrom", `https://github.com/${dep.depUser}/${dep.depRepo}.git`], git_options);

        await exec.exec("git", ["pull", "--no-edit", "pullfrom", `pull/${dep.depPR}/head`], git_options);

        core.info(`Updated submodule ${dep.depRepo} to ${dep.depUser}/${dep.depRepo}#${dep.depPR}`);
      }

      core.endGroup()
    } else {
      core.info("Not a pull request, ignoring.");
    }
  } catch (error) {
    core.setFailed(error.Message)
  }
}

run()
