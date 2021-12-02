```bash
git clone https://github.com/<YOUR_USERNAME>/kibana.git kibana
cd kibana

# better use a stable version like:
git clone --branch 7.13 https://github.com/<YOUR_USERNAME>/kibana.git kibana-7.13
cd kibana-7.13
```

Reference: https://www.elastic.co/guide/en/kibana/current/development-getting-started.html


### How to do Kibana development dynamically

(If ``nvm`` has not been installed) Install ``nvm``:
```
curl -o- https://raw.githubusercontent.com/creationix/nvm/v0.33.0/install.sh | bash
```

Go to the ``kibana`` folder:
```bash
nvm use
```

(Optional) If the specified version has not been installed, follow the instructions to install it and run the previous command again:
```bash
nvm install x.x.x
nvm use
```

In the ``kibana`` folder:
```bash
yarn kbn bootstrap
```

(Optional) If yarn has not been installed, install ``yarn`` (which is used for package management) and then bootstrap:
```bash
npm install --global yarn
yarn kbn bootstrap
```

If you encounter something wrong, clean and rerun:
```bash
yarn kbn clean
yarn kbn bootstrap
```

To run Kibana to develop and debug, make sure you have an Elasticsearch server running, then open a terminal and also in ``kibana`` folder:
```bash
yarn start
yarn start --dev
yarn start --run-examples
```
Then you can develop and see the changes dynamically.


### How to specify which Elasticsearch to use

There are three choices.

1. Run a release version

You can use **an Elasticsearch distributable** by running ``bin/elasticsearch`` by yourself, as long as it is the right version.

2. Run a Kibana default version

Run Elasticsearch in default in ``kibana`` folder using ``yarn``. Open one terminal and in ``kibana`` folder:
```bash
yarn es snapshot
# The above one provides BASIC license, which doesn't include xpack
# If you want to use all the TRIAL functions, run:
yarn es snapshot --license trial
```

Then open another terminal and go to ``.es/8.0.0`` folder to run:
```bash
bin/elasticsearch
```

3. Run an archive version

Specify a Elasticsearch server you are running in ``kibana`` folder:
```bash
yarn es archive <full_path_to_archive>
```

Reference: https://www.elastic.co/guide/en/kibana/current/running-elasticsearch.html


### How to develop your own plugins

To create a plugin, in ``kibana`` folder:
```bash
node scripts/generate_plugin
# Or
node scripts/generate_plugin <my_plugin_name>
```

It will ask you some questions to generate a plugin template you want. The questions are like:
```
? Plugin name (use camelCase) <my_plugin_name>
? Will this plugin be part of the Kibana repository? No
? Should an UI plugin be generated? Yes
? Should a server plugin be generated? Yes
```

To build plugin distributable, in your plugin folder, like in ``plugins/my_plugin_name`` folder, run:
```bash
yarn build
```
It will generate a ``zip`` file in ``kibana/plugins/my_plugin_name/build/`` folder.

Reference: https://www.elastic.co/guide/en/kibana/current/plugin-tooling.html


### How to install external plugins

Reference: https://www.elastic.co/guide/en/kibana/current/kibana-plugins.html#install-plugin


### How to add packages to your plugins

In your plugin folder, like in ``plugins/my_plugin_name`` folder, run:
```bash
yarn add vis-data vis-network
# which is equal to ``npm install -save vis-data vis-network``
```

If you want to remove the packages:
```bash
yarn remove vis-data vis-network
# which is equal to ``npm uninstall -save vis-data vis-network``
```


