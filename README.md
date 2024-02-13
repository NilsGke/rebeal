# ReBeal

This is my webapp clone of the popular app [BeReal](https://bereal.com/).

## How are daily notifications sent?

I setup a cron job on my raspberry pi to ping the `api/checkTTRB` route every minute. This could be replaced with a vercel cron job, but the free plan only offers a cron job to run once a day. This is also what the `CUSTOM_COMMUNICATION_TOKEN`-environment variable is for.
The request requires this token to be as a url param (`.../?token="..."`)
The Raspberry PI script looks like this:

```bash
#!/bin/bash
key=$(cat ~/rebealCron/key.txt) # read out the key shared across the file and the env variable

start="https://rebeal.vercel.app/api/checkTTRB?token="

url=$start$key

curl $url
```
