<h1 align="center">
  <img src="https://github.com/doron050/logz-for-all/blob/master/resources/images/logService/on-icon.png" alt="LogDNA Zeit Integration" width="150"></a>
  <br>
  LogDNA ZEIT Integration
  <br>
</h1>

<h4 align="center">Connect your ZEIT Now Projects to <a href="https://logdna.com/" target="_blank">LogDNA</a></h4>

<p align="center">
  <a href="https://paypal.me/doron050">
    <img src="https://img.shields.io/badge/$-donate-ff69b4.svg?maxAge=2592000&amp;style=flat">
  </a>
</p> 

<h5 align="center">Say goodbye to loggers!</a></h5>

<p align="center">
  • <a href="#Our-Vision">Our Vision</a> 
  • <a href="#Key-Features">Key Features</a>
  • <a href="#How-to-Use">How to Use</a>
  • <a href="#Setup-for-Development">Dev Setup</a>
  • <a href="#Support-and-Contact">Contact</a>
  • <a href="https://logdna.com/">LogDNA</a>
  • <a href="https://zeit.co">ZEIT</a>
  
</p>

> *LogDNA For All* - `be smart`, `take responsibility`.

[![forthebadge](https://forthebadge.com/images/badges/built-with-love.svg)](https://forthebadge.com)
[![forthebadge](https://forthebadge.com/images/badges/check-it-out.svg)](https://forthebadge.com)

> **We are making our best efforts** to bring you the best logging integrations.<br/>
> If you like our integration, you can help us by <a href="https://paypal.me/doron050">donate and become a backer</a>.

:fireworks: [Try it out!](https://zeit.co/integrations/logdna-for-all) :fireworks:

## Our Vision
> Allow **every developer** to **_take responsibility_** over their creation by delivering **_the best integration_**<br/>to connect their project for _logging:chart_with_upwards_trend: & monitoring:traffic_light: service.

## Key Features

* Integrate your ZEIT Now project with LogDNA :electric_plug:
  * Connect team projects :family:
  * Connect user projects :bowtie:
* Consistently transfer all your logs to your LogDNA project

#### Screenshot - Integration Configuration:
![Integration Configuration](https://github.com/doron050/logz-for-all/blob/master/resources/images/configuration.png?raw=true)

#### Screenshot - LogDNA:
![LogDNA](https://github.com/doron050/logz-for-all/blob/master/resources/images/dashboardV4.png?raw=true)

## How to Use
* **Select one of the following:**
  * **The fastest way** :rocket: - Go [here](https://zeit.co/integrations/logdna-for-all/add)
  * `Or` Go to [Our integration page](https://zeit.co/integrations/logdna-for-all)
    * Press `add`
  * `Or manually` :hand: Go to the [marketplace](https://zeit.co/integrations):
    * Go to `[logging category](https://zeit.co/integrations?category=logging)` 
      * select our integration `LogDNA`
* Select which workspaces you want to connect to LogDNA -  `User or teams`
* Press `add`
* For each project of your workspaces that you want to connect:
  * Insert your *LogDNA token* :key: (get it via your project page on [LogDNA](https://logdna.com/)
  * Press `Connect`
* Now you are ready to go by yourself. Enjoy! :tada:
> We hope you have _the great Logging & Monitoring Experience of your life!_ :rainbow:

## Setup for Development

In order to contribute you will need the following accounts :bookmark::
* <a href="https://www.zeit.co/">ZEIT</a>
* <a href="https://www.mongodb.com/cloud/atlas">MongoDB Cloud</a>
* <a href="https://logdna.com/">LogDNA</a>

#### Get our code ####

```bash 
# Clone this repository
$ git clone https://github.com/doron050/logdna-for-all.git

# Go into the repository
$ cd logdna-for-all

# Install dependencies
$ npm install
```

#### ZEIT integrations ####
* Follow the instructions on the <a href="https://zeit.co/docs/integrations/">ZEIT Integrations documentation</a> to setup your integration
* On your integration settings page:
  * Leave the `redirect url` empty
  * Set the `ui-hook url` to: http://localhost:5005/ui-hooks
* Go to your integration page and add it to your user/team
* Add your logDNA token :key:

#### MongoDB cloud ####
* Register for MongoDB cloud
* Create your cluster and get the connection details :bookmark_tabs:
* Make sure you set your `.env` file :pencil2:: 
```diff
# DB
+ DB_USER_NAME=[your mongodb cloud user name]
+ DB_PASSWORD=[your mongodb cloud password]
+ DB_URL=[your mongodb url]
+ DB_SCHEME=[your mongodb scheme]
+ DB_NAME=[your mongodb db name]
+ DB_COLLECTION_NAME=[your mongodb collection name]
```
#### Advanced .env ####
Specify what environment you are targeting:
```diff
# ENV
+ ENVIRONMENT=[production / development]
```
If you want to, you can control some of our intervals :clock1::
```diff
+ CONSUME_PROJECT_LOG_INTERVAL=[time between reading and sending logs - default is 3000]
+ SYNC_SUBSCRIBER_WITH_DB_INTERVAL=[time between sync with the metadata inside the db - default is 6000]
```
If you want your integration to send logs to [LogzIO]() you need to configure this setting:
```diff
# LOGGER
+ LOGGER_TOKEN=[LogzIO token]
```

#### Run the integration ####
* Run your integration locally using `npm run zeit`
* Use your browser and go to your integration configuration page :scroll:
* You should now see the integration configuration page _(it is connected to your localhost)_

_**:warning:notice!**_
> If you want to debug and change the configuration UI you are good to go!
> Every configuration you create will be saved inside your database. You use this data in the following background node app.

#### Run your background node app ####

_**:warning:notice!**_
> Since we cannot use our localhost as the redirect endpoint for the oauth proccess<br/>you will miss 2 critical fields on every database document (ZeitToken, teamId) :sweat:

In order to get over it :muscle:: 
* Upload your app to ZEIT using the `now` command (the `now.json` file is provided for you) :outbox_tray:
* Set your integrations `redirect url` to `<zeit-host-name>/redirect`
* Set the following `secret`s :closed_lock_with_key:: 
```diff
# Zeit 
+ INTEGRATION_CLIENT_ID=[Your app auth client id]
+ INTEGRATION_CLIENT_SECRET=[Your app secret]
```
* Now you should follow the <a href="#How-to-Use">How to Use</a> steps in order to use your integration :sweat_smile:

_**Now you can run the background node!**_
* Use `npm start` in order to start the sync

<br/>
Have fun. Keep Coding. :computer:

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
> Contact us via mail: <logs_for_all@yahoo.com>

[MIT License]: http://mit-license.org/
