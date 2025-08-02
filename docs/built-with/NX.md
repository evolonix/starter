## [Nx](https://nx.dev/)

```bash
npx create-nx-workspace@latest
```

Select the following options:

```
Where would you like to create your workspace? `~[ .starter.name ]~`
Which stack do you want to use? `react`
What framework would you like to use? `none`
Application name `web`
Would you like to use React Router for server-side rendering [https://reactrouter.com/]? `Yes`
Which unit test runner would you like to use? `vitest`
Test runner to use for end to end (E2E) tests `playwright`
Default stylesheet format `tailwind`
Would you like to use ESLint? `Yes`
Would you like to use Prettier for code formatting? `Yes`
Which CI provider would you like to use? `GitHub Actions`
```

Update [.github/workflows/ci.yml](../../.github/workflows/ci.yml) to temporarily disable e2e tests:

```yaml
# - run: npx playwright install --with-deps

- run: npx nx affected -t lint test build # e2e
```

To use Nx Cloud, you need to create an account and set up your project. Follow these steps:

1. Go to the [Nx Cloud website](https://nx.app/).
2. Sign up for a free account.
3. Once you are logged in, create a new project.
4. Follow the instructions to connect your GitHub repository to Nx Cloud.
5. After connecting your repository, configure the "Access control".
   - Set the "Access control" to "none" for the default access level.
   - Set the "Access control" to "read-only" for logged in users.
6. Generate two CI access tokens:
   - One for read-only access called `NX_CLOUD_ACCESS_TOKEN_RO`
   - One for read-write access called `NX_CLOUD_ACCESS_TOKEN_RW`
7. In your GitHub repository, go to `Settings` > `Secrets and variables` > `Actions` > `New repository secret`.
8. Name the secret `NX_CLOUD_ACCESS_TOKEN` and paste the read-only access token you received from Nx Cloud.
9. Next, `Manage environment secrets`.
10. Create a new secret for the `Staging` environment.
11. Name the secret `NX_CLOUD_ACCESS_TOKEN` and paste the read-write access token you received from Nx Cloud.
