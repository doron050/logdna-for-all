<h1 align="center">
  <img src="https://github.com/doron050/logz-for-all/blob/master/resources/images/logDNA-Icon.png" alt="LogDNA Zeit Integration" width="150"></a>
  <br>
  LogDNA Zeit Integration
  <br>
</h1>

<h4 align="center">Connect your Zeit Now Projects to <a href="https://logdna.com/" target="_blank">LogDNA</a></h4>

<p align="center">
  <a href="https://paypal.me/doron050">
    <img src="https://img.shields.io/badge/$-donate-ff69b4.svg?maxAge=2592000&amp;style=flat">
  </a>
</p> 

<h5 align="center">Say goodbay to loggers!</a></h5>

<p align="center">
  • <a href="#Our-Vision">Our Vision</a> 
  • <a href="#Key-Features">Key Features</a>
  • <a href="#How-to-Use">How to Use</a>
  • <a href="#Setup-for-Development">Dev Setup</a>
  • <a href="#Support-and-Contact">Contact</a>
  • <a href="https://logdna.com/">LogDNA</a>
  • <a href="https://zeit.co">Zeit</a>
  
</p>

> *LogDNA For All* - `be smart`, `take responsibility`.

[![forthebadge](https://forthebadge.com/images/badges/built-with-love.svg)](https://forthebadge.com)
[![forthebadge](https://forthebadge.com/images/badges/check-it-out.svg)](https://forthebadge.com)

> **We are making our best efforts** to bring you the best loging integrations.<br/>
> If you like our integration, you can help us by <a href="https://paypal.me/doron050">donate and become a backer</a>.

:fireworks: [Try it out!](https://zeit.co/integrations/logdna-for-all) :fireworks:

## Our Vision
> Let **every devloper** to **_take responsibility_** over his creation by deliver **_the best integration_**<br/>to connect his project to _logging:chart_with_upwards_trend: & monitororing:traffic_light: service **easiest as possible**

## Key Features

* Integrate your Zeit Now with LogDNA :electric_plug:
  * Connect team projects :family:
  * Connect user projects :bowtie:
* Consistently transfer all your logs to your LogDNA project

#### Screenshot - Integration Configuration:
![Integration Configuration](https://github.com/doron050/logz-for-all/blob/master/resources/images/configuration.png?raw=true)

#### Screenshot - LogDNA:
![LogDNA](https://github.com/doron050/logz-for-all/blob/master/resources/images/dashboard1.png?raw=true)

## How to Use
* **Select one of the following:**
  * **The fastest way** :rocket: - Go [here](https://zeit.co/integrations/logdna-for-all/add)
  * `Or` Go to [Our integration page](https://zeit.co/integrations/logdna-for-all)
    * Press `add`
  * `Or manually` :hand: Go to the [markekplace](https://zeit.co/integrations):
    * Go to `[logging category](https://zeit.co/integrations?category=logging)` 
      * select our integration `LogDNA`
* Select which workspaces you want to connect to LogDNA -  `User or teams`
* Press `add`
* For each project of your worksapace that you want to connect:
  * Insert your *LogDNA token* :key: (get it via your project page on [LogDNA](https://logdna.com/)
  * Press `Connect`
* Now you are ready to go by yourself. Enjoy! :tada:
> We hope you have _the great Logging & Monitoring Experience of your life!_ :rainbow:

## Setup for Development

In order to develop locally you will need to open accounts on <a href="https://www.zeit.co/">Zeit</a>, <a href="https://www.mongodb.com/">MongoDB Cloud</a>

**Zeit integrations**
* Follow the instarations on <a href="https://zeit.co/docs/integrations/">Zeit Integration doc</a> in order to setup your integration and connect it to this integration code
* On your integration settings page:
  * Leave the redirect url empty
  * Set the ui-hooks url to: http://localhost:5005/ui-hooks
* Go to your integration page and add it to your user/team

**Mongo DB cloud**
* Register to mongo db cloud
* Create your cluster and get the connection details
* Make sure to set your mongo db connection detail in your env file (down)


```bash 
# Clone this repository
$ git clone https://github.com/doron050/logdna-for-all.git

# Go into the repository
$ cd logdna-for-all

# Install dependencies
$ npm install
```
* Set your `.env` file like that:
```diff
# DB
DB_USER_NAME=[your mongodb cloud user name]
DB_PASSWORD=[your mongodb cloud password]
DB_URL=[your mongodb url]
DB_SCHEME=[your mongodb scheme]
DB_NAME=[your mongodb db name]
DB_COLLECTION_NAME=[your mongodb collection name]

CONSUME_PROJECT_LOG_INTERVAL=[time between reading and sending logs - default is 3000]
SYNC_SUBSCRIBER_WITH_DB_INTERVAL=[time between sync with the mongo db - default is 6000]
```

**Run your zeit ui-hook page**
* Run your integration locally using `npm run zeit`
* go to your integration config page and you should see the page is working with your local integration server

> If you want to debug and change the configuration UI you are good to go!

> Every configuration you create will be saved on your mongodb and you will see we use this data in the following background node app

**Run your background node app**

> NOTE - since locally we can't provide the redirect logic you will be missing 2 critical properties on every mongo document (ZeitToken, teamId)

*In order to get the missing parameters do the following:*

* Upload your cloned repo to zeit (you already have our now.json) and set your integration redirect url to '<zeit-host-name>/redirect'
* don't forget all the secrets you need to set for the app to work (see now.json)
* Create another configuration and add it to you user/team
* Now get the missing params from the new complete document in the mongodb and copy them to all the other document


*Now you can run the background node*

* Run `npm start` this will load the node and it will start the sync

Now in your console you will see that the node will load all the configuration from from the mongo.<br/>
For every configuration the node will read the logs from zeit and send them to logDNA<br/>
<br/>

Keep Coding

### Our Team 
------

![LogDNA-For-All Team](https://github.com/doron050/logz-for-all/blob/master/resources/images/team.png?raw=true)
            
### Support and Contact
------

**LogDNA-For-All** © 2019+, DE, MB, NM Released under the [MIT License].<br>
Authored and maintained by DE, MB, NM. with help from contributors.


> GitHub [@Niv](https://github.com/nivm1) <br/>
> GitHub [@Doron Eli](https://github.com/doron050) <br/>
> GitHub [@Moshe Basher](https://github.com/moshebasher) <br/>
> Contact us via mail: <podcasts_for_all@yahoo.com>

[MIT License]: http://mit-license.org/
