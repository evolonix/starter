## [Fly.io Deployments](https://fly.io/)

Install the flyctl CLI tool and set up your Fly.io account and app:

```bash
brew install flyctl
flyctl auth login
flyctl launch --org ~~_starter.org_name_~~ --name ~~_starter.org_name_~~-~~_starter.name_~~ --no-deploy
mv fly.toml apps/web/fly.production.toml
rm -rf Dockerfile
rm -rf .github/workflows/fly-deploy.yml
```

Update [apps/web/fly.production.toml](../../apps/web/fly.production.toml) with the following:

```toml
...
[build]
  dockerfile = './Dockerfile.production'

[env]
  PORT = '3000'

[http_service]
  internal_port = 3000
...
```

Create a Fly.io config for Staging by running the following:

```bash
flyctl launch --org ~~_starter.org_name_~~ --name ~~_starter.org_name_~~-~~_starter.name_~~-staging --no-deploy
mv fly.toml apps/web/fly.staging.toml
rm -rf Dockerfile
rm -rf .github/workflows/fly-deploy.yml
```

Update [apps/web/fly.staging.toml](../../apps/web/fly.staging.toml) with the following:

```toml
...
[build]
  dockerfile = './Dockerfile.staging'

[env]
  PORT = '3000'

[http_service]
  internal_port = 3000
...
```

Create a Fly.io config for PR Previews by running the following:

```bash
cp apps/web/fly.staging.toml apps/web/fly.preview.toml
```

Update [apps/web/fly.preview.toml](../../apps/web/fly.preview.toml) with the following:

```toml
# [Remove comments at the top of the file]
...
app = 'web-staging' # Remove this line since the app name will be set dynamically in the CI workflow

[build]
  dockerfile = './Dockerfile.preview'
...
```

Update [apps/web/package.json](../../apps/web/package.json) with the following:

```json
{
  ...
  "nx": {
    "targets": {
      ...
      "deploy": {
        "command": "YELLOW='\\033[0;33m' RESET='\\033[0m'; echo \"${YELLOW}Development deployment is not supported.${RESET}\"",
        "configurations": {
          "production": {
            "command": "flyctl deploy --config apps/web/fly.production.toml --image-label ~~_starter.org_name_~~-~~_starter.name_~~-v$(npm --prefix apps/web pkg get version | tr -d '\"')"
          },
          "staging": {
            "command": "flyctl deploy --config apps/web/fly.staging.toml"
          },
          "preview": {
            "command": "flyctl deploy --config apps/web/fly.preview.toml"
          }
        }
      }
    }
  }
}
```

In a browser, visit the [Fly.io dashboard](https://fly.io/dashboard).
Create or select the `~~_starter.display_name_~~` organization.
Scroll down and select `Tokens`.
Enter `GitHub` as the `token name` and leave the `expiration` field blank.
Click `Create Organization Token` and copy the token.

In your GitHub repository, go to `Settings` > `Secrets and variables` > `Actions` > `New repository secret`.
Name the secret `FLY_API_TOKEN` and paste the token you copied from the Fly.io dashboard.
