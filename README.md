# Starter

To get started with this project, you need to set up a few things.

First thing first, search and replace all occurences of `starter` and `Starter` in the codebase with your project name.

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

## Fly.io API Token and Deployment Environments

You need to set up a Fly.io API token to deploy your application. You can create a token by following these steps:

1. Go to the [Fly.io dashboard](https://fly.io/dashboard).
2. Click on the "Account" menu item in the top right corner and select "Settings".
3. Go to the "Tokens" section and click "Create Token".
4. Enter "GitHub" as the token name and leave the expiration field blank.
5. Copy the generated token and store it in a safe place.

Once you have your API token, you can use it to deploy your application.

In your GitHub repository, go to `Settings` > `Secrets and variables` > `Actions` > `New repository secret`.
Name the secret `FLY_API_TOKEN` and paste the token you copied from the Fly.io dashboard.

Create three environments in your GitHub repository:

1. **Preview**: For PR previews.
2. **Staging**: For staging deployments.
   Restrict to the `main` branch under `Deployment branches and tags`
3. **Production**: For production deployments.
   Restrict to the `v*.*.*` tag under `Deployment branches and tags`

## Flagsmith

In a browser, visit the [Flagsmith](https://flagsmith.com/) website and sign up for a free account.

Once you have signed up, create a new project.
You will start with the default environment of `Development`.

Create the following environments:

- **Preview**: This environment is used for preview deployments.
- **Staging**: This environment is used for staging deployments.
- **Production**: This environment is used for production deployments.

You will need the environment ID from each environment to configure your application.

In your GitHub repository, go to `Settings` > `Secrets and variables` > `Actions` > `Manage environment secrets`.
Create the following secrets for each environment:

- `VITE_FLAGSMITH_ENVIRONMENT_ID`: The environment ID for the associated environment in Flagsmith.

Configure your development environment by creating a `.env.local` file in the root of the "web" project with the following content:

```dotenv
VITE_FLAGSMITH_ENVIRONMENT_ID=your_development_environment_id
```

## Other

After installing or updating any dependencies, run the following command to ensure the web app has the latest dependencies when deploying with Docker while omitting devDependencies:

```bash
npm run update-deps
```
