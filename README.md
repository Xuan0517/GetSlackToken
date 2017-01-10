# GetSlackToken
An example slack integration that uses OAUTH for authentication and generate token

### Getting Started
---
1. Clone this repository.
Visit the Slack docs for [Building an App](https://api.slack.com/slack-apps).
2. Click the green __Create your Slack app__ button to create your app and fill in the details. You don't have to choose the option about adding your App to the catalog if you don't want to. __Make sure you're signed into the Slack team that you want to add this App to.__
3. You now have a new Slack App defined. On the screen you'll see your `Client ID` and `Client Secret` values. These are important and are used to identify your specific app to Slack during the OAUTH authentication process. __Do NOT share your secret with anyone__.
4. Note the options listed on the left nav. Input redirect URL in `OAUTH & Permissions` section.
5. Check out `Collaborators` if you're working with others and want them to be able to edit your app definition/configuration.
6. Click on `Bot users`. Click the button to create a bot user and give it a name.
7. For the purposes of this sample integration, leave the other options alone for now.
8. Assuming that you'll be deploying this integration to Bluemix, so let's get our `manifest.yml` file fixed up.
9. Open `manifest.yml` and change the `name` attribute something of your choosing (maybe the name you picked for your Slack App).
10. If you're deploying your app to the US South region of Bluemix, you won't need to change your `domain` value. If you're deploying to the United Kingdom region, change the `domain` value to `eu-gb.mybluemix.net`. If you're using the Sydney region, make `domain` set to `au-syd.mybluemix.net`.
11. Note the `services` section of the manifest file. It defines a service called __etcd__. We'll create this service later. This example uses the __Compose for etcd__ service to hold some state about the relationship our App has with the Slack team you've added it to. 
12. Last thing for the manifest: Update the `REDIRECTURI`, `OAUTHCLIENT` and `OAUTHSECRET` environment variables to match the `Client ID` and `Client Secret` values you plucked from __step 3__ above. 
13. Save and close `manifest.yml`.
14. Now, login to Bluemix and create a new instance of the __Compose for etcd__ service in the space where you'll be running your sample integration code. Be sure to name it `etcd` so it'll match the `manifest.yml` content.
15. You should now be ready to push your project to Bluemix using the `cf push` command. __Remember to push from the repo directory where the `manifest.yml` file is located.__

### Technical Details

```
Node.js 6.9.1 (with Harmony) with a sprinkle of eslint to keep it sane, Express/Pug for web ui, etcd for Slack state persistence.
```

Refer to: https://github.ibm.com/jtpape/secure-susie

