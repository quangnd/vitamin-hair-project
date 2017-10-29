## Install

- Install packages: `npm install`
- Run: `npm run dev` (*Note: Only backend code and CSS Code is auto refresh. Frontend code NOT auto refresh after change - On processing*)
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

## Development process

To contribute to this project. you MUST follow below development process:

### 1. Create a [Pivotal](https://www.pivotaltracker.com/n/projects/2120676) story

Story should explain purpose of contribution, must provide:
- Description of the need of this contribution/code change
- Type of story (bug, feature,...)
- Owner

### 2. Start story on Pivotal tracker


### 3. Refresh local repo before start coding a future or fix bug

``
$ git checkout develop
$ git pull origin develop
``

### 4. Create branch and implement code

- Branch will be checked-out from branch `develop` not `master`.
- Each story/feature/bugs fix MUST be implemented on a single branch.
- Branch name MUST be `VH + story ID`. E.g

``
$ git checkout -b VH-129104975
``
- Implement your code.

### 5. Commit your code

- Only commit when your code passed tests.
- One commit solves one ticket.
- Add following at the end of your commit message: [(Finishes|Fixes|Delivers) #STORY_ID]

### 6. Push code and send Pull request (PR)
- Push your commit to your own repo
- Send PR from your feature branch to develop branch in main repo
- Your PR will ber reviewed and merge if qualify.

E.g:

```
$ git commit -m 'Implement login feature [Finishes #129104975]'

$ git commit -m 'Fix bug unable to send notification email [Fixes #122342543]'
```

### 7. Push code to remote repository

``
$ git push origin VH-129104975
``

### 8. Create a pull request.

- Make a PR from your repo to branch `develop`.
- PR will be merged only if there is a Review from `quangnd`.

### 9. (Optional) re-implement after code review

- Repeat step 6, commit message can be adjusted but must always have story id.

### 10. Finish story

## Todo

- [ ] Support auto refresh browser after frontend code changed.
- [ ] Add eslint.
- [ ] Configure Mailgun.
- [ ] Configure Facebook app.

## Knex command

- *Create tables* `knex migrate:latest`
- *Drop all tables* `knex migrate:rollback`
