**ep_autocomp is currently unmaintained**



# Autocompletion for Etherpad

![screeshot](http://i.imgur.com/2uqR3Tg.png)

It’s beta, but works.
Please contribute and/or file bugs.

## Customization
In its preconfigured form it completes words (searches the document for words, suggests existing words if you type them again). This add-on will require configuration if you want it to autocomplete anything else.

### Pre-configured flags

* `processKeyEvent`: define if ep_autocomp should handle ace key events (arrow keys, ENTER, etc). Default: true
* `processEditEvent`: define if ep_autocomp should handle ace edit events (user editing a word). Default: true
* `showOnEmptyWords`: define if suggestions should be displayed even when user didn't type any word. Useful for plugins that control when suggestions are displayed or not. Default: false
* `ignoreLatinCharacters`: define if Latin characters should be considered the same as their non-Latin equivalents. Ex: user types "a", suggestions include words like "ál", "ão", etc. Default: false
* `enableShowSuggestionWithCtrlAndSpace`: define if ep_autocomp should display the suggestions when user presses
the shortcut CTRL + SPACE. Default: true


### Advanced customization

Include stuff in settings.json

```
  "ep_autocomp":{
    "hardcodedSuggestions":[], //NOTE: insert your static suggestions here, e.g. a list of keywords. Must be a flat array with string values.
    "regexToFind":"[/(\\S+)/g]",
    "suggestWordsInDocument": true, // Use words in document to built a dictionary
    "enabled": false, // Enabled by default?
    "updateFromSourceObject": false, // Update the autocomplete suggestions from a different object
    "caseSensitiveMatch": true // Define if suggestions should respect case of typed words. Default: true
    //EXAMPLE REGEXES:
    // /(#\\w+)+/g  chains of hashtags. if you got "abc #first#second" you'll get "#first#second"
    // /(#\\w+)/g  get words with hash. if you got "abc #first#second" you'll get "#first","#second"
    //natural word matches:  /(\\w+)+/g
    //words in code (all non-whitespace, so strings with $, % etc, included) /(\\S+)/g
  }
```

for customizing simple cases and the value `autocomp.getPossibleSuggestions` for more complex customizations.

Originally, this was written to autocomplete hashtags, you may want to complete from list of predefined keywords or from a hash of usernames after typing an *@* etc. There are some examples in the sourcecode.

## Install
Open terminal, navigate  to your etherpad folder and: type `npm install ep_autocomp` OR type `git clone https://github.com/jdittrich/ep_autocomp.git node_modules/ep_autocomp`

## Enable 

Enable under pad settings (the gear icon) 

# License
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
