# GetSlackToken
An example slack integration that uses OAUTH for authentication and generate token

### Preparation
---
1. Clone this repository
2. Login to IBM Bluemix, verify if you can create App in the space where you'll be running your code

### Getting Started
---
1. Clone this repository.
2. Login to [Slack team App management](https://api.slack.com/slack-apps), click the green __Create your Slack app__ button to create your app and fill in the details if necessary.
3. On the screen you'll see your `Client ID` and `Client Secret` values. __Do NOT share your secret with anyone__.
4. Input redirect URL in `OAUTH & Permissions` section.
5. Add `Collaborators` if you're working with others and want them to be able to edit your app definition/configuration.
6. Click on `Bot users`. Create a bot user and give it a name.
7. Open `manifest.yml` and change the `name` attribute something of your choosing (maybe the name you picked for your Slack App).
8. If you're deploying your app to the US South region of Bluemix, you won't need to change your `domain` value. If you're deploying to the United Kingdom region, change the `domain` value to `eu-gb.mybluemix.net`. If you're using the Sydney region, make `domain` set to `au-syd.mybluemix.net`.
9. Last thing for the manifest: Update the `REDIRECTURI`, `OAUTHCLIENT` and `OAUTHSECRET` environment variables to match the `Client ID` and `Client Secret` values you plucked from __step 3__ above. 
10. You should now be ready to push your project to Bluemix using the `cf push` command.

Refer to: https://github.ibm.com/jtpape/secure-susie

