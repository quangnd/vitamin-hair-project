## Install

- Install packages: `npm install`
- Run: `gulp serve` (*Note: Only backend code and CSS Code is auto refresh. Frontend code NOT auto refresh after change - On processing*)
- Build: `npm run build`
- To setup mysql database, rename *env_example* to *.env* and change the values.

### Tech stacks

This project offers a rich development experience using the following technologies:

| **Tech** | **Description** |
|----------|-----------------|
| [NodeJS](https://nodejs.org/en/) | A JavaScript runtime built on Chrome's V8 JavaScript engine.  |
| [Express](https://expressjs.com/)  |   A rich framework for building applications and services with NodeJS|
| [AngularJS](https://angularjs.org/) |   a structural framework for dynamic web apps|
| [Satellizer](https://github.com/sahat/satellizer) | Token-based AngularJS Authentication|
| [CSS Framework](https://webflow.com/) |   Build responsive websites in your browser|
| [MySQL](https://github.com/mysqljs/mysql) |  A pure node.js JavaScript Client implementing the MySql protocol.  |
| [Knex](http://knexjs.org/) |  SQL query builder for MySQL  |
| [Bookshelf.js](http://bookshelfjs.org/) |  JavaScript ORM for Node.js, built on the Knex SQL query builder |
| [Mocha](https://mochajs.org) |  For Unit testing  |
| [Gulp](https://gulpjs.com) |  Build tool |
| [ESLint](http://eslint.org/)| Lint JS. Reports syntax and style issues.| 
| [Editor Config](http://editorconfig.org) | Enforce consistent editor settings (spaces vs tabs, etc). |

## Todo

- [ ] Support auto refresh browser after frontend code changed.
- [ ] Add eslint.
- [ ] Configure Mailgun.
- [ ] Configure Facebook app.

## Knex command

- *Create tables* `knex migrate:latest`
- *Drop all tables* `knex migrate:rollback`
