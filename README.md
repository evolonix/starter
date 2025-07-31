# Starter

To get started with this project, you need to set up a few things.

## Nx Cloud

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
