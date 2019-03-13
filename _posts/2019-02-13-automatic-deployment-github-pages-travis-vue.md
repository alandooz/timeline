---
layout: post
title: "Automatic Deployment on GitHub Pages | with Travis CI and VueJs"
categories: tech
---

# Automatic Deployment on GitHub Pages | with Travis CI and VueJs

## Setup

1. [How to quickly set up a build process for a static site](https://medium.freecodecamp.org/how-to-quickly-set-up-a-build-process-for-a-static-site-1a6e7923e105)

### Deploy the entire app at a sub-path

Create the file "vue.config.js" in the project root, in same the level that package.json, with the following:

```javascript
module.exports = {
  baseUrl: '/yoursubfolder/'
}
```

1. [Hosting from a subdirectory](https://github.com/vuejs-templates/webpack-simple/issues/189)
1. [vue.config.js](https://cli.vuejs.org/config/#vue-config-js)

### Deploying a subfolder to GitHub Pages

1. [Deploying a subfolder to GitHub Pages](https://gist.github.com/cobyism/4730490)
1. [Deploying your JS App to Github Pages the easy way (or not)](https://medium.com/linagora-engineering/deploying-your-js-app-to-github-pages-the-easy-way-or-not-1ef8c48424b7)
1. [Git: How to push dist directory to a separate branch of the same repository](https://stackoverflow.com/questions/52574481/git-how-to-push-dist-directory-to-a-separate-branch-of-the-same-repository)