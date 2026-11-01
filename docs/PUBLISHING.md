# Publish reviewed shared source

Publisher: Merwan Massa. Live URL: https://math-race-arcade.merwanmassa.chatgpt.site/
Sites project: appgprj_6ac4522eee148191adf3ef2f44811522. Audience remains public.

GitHub is the canonical collaboration repository. Sites also maintains its own publication-source repository; that is a release mirror, not a second place for independent feature work. No GitHub Actions deployment or permanent hosting token is configured.

## Release procedure
1. Merge the approved pull request into GitHub main.
2. In a clean shared checkout, fetch origin and update main with git pull --ff-only. Verify local main equals origin/main and record its SHA. Never publish from an old ZIP, stale branch or uncommitted workspace.
3. Run npm test and check the changed screens in the local browser.
4. Read the Sites skill and get the existing project. Open its managed source with a fresh short-lived write credential using the supported source helper. Do not replace hosting ownership or create a new Site.
5. Compare any newer Sites publication against the reviewed GitHub revision. If Sites contains changes absent from GitHub, reconcile those into a reviewed GitHub pull request first. Do not overwrite them.
6. Copy the exact reviewed tracked runtime dist and .openai/hosting.json into that release checkout. Ensure removed runtime files are also removed from the release mirror after verifying paths, so the archive represents the reviewed runtime. Do not copy .git or credentials.
7. Use the supported Sites helper to commit, push and package the release snapshot. Save and deploy that exact verified source SHA and archive to the existing project. GitHub and Sites commit SHAs can differ; both should identify the same dist file contents.
8. Verify deployment succeeds and record the GitHub SHA, Sites SHA, version, date and URL in docs/RELEASES.md.

Do not put short-lived credentials in files, command arguments, browser JavaScript, workflow secrets or output. A push to GitHub main is not confirmation of a live deployment.
