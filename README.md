# 🚀 Getting started with Masari Strapi

### `develop`

Start your Strapi application with autoReload enabled.

```
yarn run dev
```

### `start`

Start your Strapi application with autoReload disabled.

```
yarn start
```

### `build`

Build your admin panel.

```
yarn build
```

## 📚 Learn more

to start strapi :

```
cd /opt/bsf-backend
git pull
NODE_ENV=staging/production depending on the env yarn build
pm2 restart strapi:start

```

to export configuration from stage:
```
yarn run config-sync export
```

to import configuration to prod
```
yarn run config-sync import
```

