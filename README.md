# Autocompletion for Etherpad

![screeshot](http://i.imgur.com/2uqR3Tg.png)

It’s  alpha-ish, but works. 
Please contribute and/or file bugs. 

## Customization
In its preconfigured form it completes words (searches the document for words, suggests existing words if you type them again). This add-on will require configuration if you want it to autocomplete anything else. 

See the value `autocomp.config` in the  `ep_autocomp/static/js/autocomp.js` file
for customizing simple cases and the value `autocomp.getPossibleSuggestions` for more complex customizations.

Originally, this was written to autocomplete hashtags, you may want to complet from list of predefined keywords or from a hash of usernames after typing an *@* etc. There are some examples in the sourcecode. 

## Install
Open terminal, navigate  to your etherpad folder and: type `npm install ep_autocomp` OR type `git clone https://github.com/jdittrich/ep_autocomp.git node_modules/ep_autocomp`

# Autocompletion 

Enable under settings

#License
Copyright 2014, John McLear

Copyright 2014, Jan Dittrich


Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

   http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
