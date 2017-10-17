# Deploy app to Heroku

1. `heroku login`
2. `heroku create nameapp`
3. `git push heroku master`
4. `heroku ps:scale web=1`
5. `heroku open` (see webpage)

## Add ClearDB MySQL

1. **Add addon ClearDB** `heroku addons:create cleardb:ignite`.
2. **Retrieve your database URL** `heroku config | grep CLEARDB_DATABASE_URL`
3. **Copy the value of the CLEARDB_DATABASE_URL config variable**
`heroku config:set DATABASE_URL='mysql://adffdadf2341:adf4234@us-cdbr-east.cleardb.com/heroku_db?reconnect=true'`
- **DB Host**: us-cdbr-east.cleardb.com
- **DB Name** heroku_db
- **Username**: adffdadf2341
- **Password**: adf4234

## Useful commands

- **View all app's config vars**: `heroku config`
- `heroku config:set TOKEN='abc'`
- `heroku config:unset TOKEN`
