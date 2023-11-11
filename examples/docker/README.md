# What is this?

Example of how to dockerize a solid-start project. Based on the solid-start bare example with a modified package.json.

## Docker

```bash
docker build -t bare .
```

```bash
docker run -p 3000:3000 bare
```

## Numbers

|Image|Image size (Uncompressed)|App size  |node_modules size|
|-----|-------------------------|----------|-----------------|
|node:lts-alpine3.16|174 MB     |1.6 MB    |72 KB            |

App size includes:
 - node_modules/
 - public/
 - package.json
 - package-lock.json
 - server.js

*Note: Because the modified package.json contains only dev dependencies, installing packages on the final build could be omitted.*
