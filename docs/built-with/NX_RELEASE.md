## Nx Release

Set initial version in `apps/web/package.json`:

```bash
npm --prefix apps/web pkg set version=0.0.0
```

Update [nx.json](../../nx.json) with the following:

```json
{
  ...
  "release": {
    "projects": ["!**/*-e2e"],
    "version": {
      "conventionalCommits": true,
      "versionActionsOptions": {
        "skipLockFileUpdate": true
      },
      "fallbackCurrentVersionResolver": "disk"
    },
    "changelog": {
      "workspaceChangelog": {
        "createRelease": "github"
      },
      "automaticFromRef": true
    }
  },
  "sync": {
    "applyChanges": true
  }
}
```
