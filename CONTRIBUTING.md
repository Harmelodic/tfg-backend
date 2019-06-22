# Contributing

## Technologies

[npm](https://docs.npmjs.com/) is the package/dependency manager for JavaScript projects. Add dependencies, run scripts and application metadata to `package.json`.

[Express](https://expressjs.com/) is a framework for creating simple HTTP APIs in Node.js.

## Patterns / Project Structure

### Express Routes

Exposing HTTP endpoints in Express can be done in different ways. An easy way to split up an Express app into different sections to deal with different functionality, is to split up endpoints into sub-sections. These sub-sections are called **Routes**.  
For example, all health-check related functionality can be found under the `/health/*` Route.

All routes are found in `src/routes/`

### Repository Pattern

All calls to external systems, like APIs and Databases, should be made through interfaces defined using the [Repository Pattern](https://deviq.com/repository-pattern/).  
These interfaces/repositories should be put in `src/interfaces/`

## CI/CD

The CI/CD pipeline is tailored for GitLab and defined in the `.gitlab-ci.yml` file.

The app's JavaScript is built using Webpack.

The app is built into a Node Docker container, where the Docker config is defined in the `Dockerfile`.
