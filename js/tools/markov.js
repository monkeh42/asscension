

/**
 * Markov pseudo-class
 *
 * @type {{chain_cache: {}, namesets: {default: string[]}, init: markov.init, handleChatMessage: markov.handleChatMessage, generateName: markov.generateName, markov_chain: markov.markov_chain, construct_chain: markov.construct_chain, incr_chain: markov.incr_chain, scale_chain: markov.scale_chain, markov_name: markov.markov_name, select_link: markov.select_link}}
 */
 var markov =
 {
     /**
      * Helper function to transform a string into an array with a given separator
      *
      * @param fullString - the string to convert
      * @param separator - what separates each word or element (e.g. "," to use the comma as a deliminator)
      * @return {Array}
      */
     listToArray: function(fullString, separator)
     {
         'use strict';
 
         var fullArray = [];
         if (fullString !== undefined)
         {
             if (fullString.indexOf(separator) === -1)
             {
                 fullArray.push(fullString);
             }
             else
             {
                 fullArray = fullString.split(separator);
             }
         }
         return fullArray;
     },
 
     /**
      * Default names seed for markov to generate new names from
      *
      * @type {string[]}
      */
     defaultNames:
         [
             "Afghanistan", "Albania", "Algeria", "American Samoa", "Andorra", "Angola", "Anguilla", "Antarctica", "Antigua And Barbuda", "Argentina", 
             "Armenia", "Aruba", "Australia", "Austria", "Azerbaijan", "Bahamas", "Bahrain", "Bangladesh", "Barbados", "Belarus", "Belgium", "Belize", "Benin", 
             "Bermuda", "Bhutan", "Bolivia", "Bosnia And Herzegovina", "Botswana", "Bouvet Island", "Brazil", "British Indian Ocean Territory", "Brunei Darussalam", 
             "Bulgaria", "Burkina Faso", "Burundi", "Cambodia", "Cameroon", "Canada", "Cape Verde", "Cayman Islands", "Central African Republic", "Chad", "Chile", 
             "China", "Christmas Island", "Cocos (keeling) Islands", "Colombia", "Comoros", "Congo", "The Democratic Republic Of The Congo", "Cook Islands", 
             "Costa Rica", "Cote D'ivoire", "Croatia", "Cuba", "Cyprus", "Czech Republic", "Denmark", "Djibouti", "Dominica", "Dominican Republic", "East Timor", 
             "Ecuador", "Egypt", "El Salvador", "Equatorial Guinea", "Eritrea", "Estonia", "Ethiopia", "Falkland Islands (malvinas)", "Faroe Islands", "Fiji", 
             "Finland", "France", "French Guiana", "French Polynesia", "French Southern Territories", "Gabon", "Gambia", "Georgia", "Germany", "Ghana", "Gibraltar", 
             "Greece", "Greenland", "Grenada", "Guadeloupe", "Guam", "Guatemala", "Guinea", "Guinea-bissau", "Guyana", "Haiti", "Heard Island And Mcdonald Islands", 
             "Holy See (vatican City State)", "Honduras", "Hong Kong", "Hungary", "Iceland", "India", "Indonesia", "Islamic Republic Of Iran", "Iraq", "Ireland", 
             "Israel", "Italy", "Jamaica", "Japan", "Jordan", "Kazakstan", "Kenya", "Kiribati", "Democratic People's Republic Of Korea", "Republic Of Korea", "Kosovo", 
             "Kuwait", "Kyrgyzstan", "Lao People's Democratic Republic", "Latvia", "Lebanon", "Lesotho", "Liberia", "Libyan Arab Jamahiriya", "Liechtenstein", 
             "Lithuania", "Luxembourg", "Macau", "The Former Yugoslav Republic Of Macedonia", "Madagascar", "Malawi", "Malaysia", "Maldives", "Mali", "Malta", 
             "Marshall Islands", "Martinique", "Mauritania", "Mauritius", "Mayotte", "Mexico", "Federated States Of Micronesia", "Republic Of Moldova", "Monaco", "Mongolia", 
             "Montserrat", "Montenegro", "Morocco", "Mozambique", "Myanmar", "Namibia", "Nauru", "Nepal", "Netherlands", "Netherlands Antilles", "New Caledonia", 
             "New Zealand", "Nicaragua", "Niger", "Nigeria", "Niue", "Norfolk Island", "Northern Mariana Islands", "Norway", "Oman", "Pakistan", "Palau", "Occupied Palestinian Territory", 
             "Panama", "Papua New Guinea", "Paraguay", "Peru", "Philippines", "Pitcairn", "Poland", "Portugal", "Puerto Rico", "Qatar", "Reunion", "Romania", 
             "Russian Federation", "Rwanda", "Saint Helena", "Saint Kitts And Nevis", "Saint Lucia", "Saint Pierre And Miquelon", "Saint Vincent And The Grenadines", 
             "Samoa", "San Marino", "Sao Tome And Principe", "Saudi Arabia", "Senegal", "Serbia", "Seychelles", "Sierra Leone", "Singapore", "Slovakia", "Slovenia", 
             "Solomon Islands", "Somalia", "South Africa", "South Georgia And The South Sandwich Islands", "Spain", "Sri Lanka", "Sudan", "Suriname", "Svalbard And Jan Mayen", 
             "Swaziland", "Sweden", "Switzerland", "Syrian Arab Republic", "Taiwan", "Tajikistan", "United Republic Of Tanzania", "Thailand", "Togo", 
             "Tokelau", "Tonga", "Trinidad And Tobago", "Tunisia", "Turkey", "Turkmenistan", "Turks And Caicos Islands", "Tuvalu", "Uganda", "Ukraine", "United Arab Emirates", 
             "United Kingdom", "United States", "Uruguay", "Uzbekistan", "Vanuatu", "Venezuela", "Viet Nam", "Wallis And Futuna", "Western Sahara", "Yemen", "Zambia"
         ],
 
     chain_cache: {},
     namesets: {default: this.defaultNames},
 
     /**
      * Called from the page ready event
      */

     getNames: function() {
        return this.defaultNames;
     },
      

      generateCountry: function()
      {
        return markov.generateName();
      },
 
     /**
      * Sends help text to the requester.
      * 
      * @param msg
      */
     sendHelpText: function(msg)
     {
         var helpText = 
             '/w "' + msg.who + '" Markov usage:<br/>' +
             '<pre>' +
             '!markov [-? | help] | [-w] [nameset(s)]' +
             '</pre><br/>' +
             'All arguments are optional.<br/>' +
             ' **-? or help**: whispers you this help text. Ignores any other arguments.<br/>' +
             ' **-w**: whisper results<br/>' +
             '**nameset(s)**: any number of namesets, separated by spaces<br/><br/>' +
             '**Examples** <br/>' +
             markov.formatExamples([
                 ['!markov', 'This will generate a name from the default nameset and enter it to chat.'],
                 ['!markov -?', 'This will whisper this helpful content to you.'],
                 ['!markov help', 'Also whispers this help text to you.'],
                 ['!markov -w', 'This will generate a name from the default list and whisper it to you.'],
                 ['!markov setA setB', 'This will generate a name from setA and a name from setB and send them to chat.<br/><i>Useful if you have a nameset for first names and another for last names.</i>'],
                 ['!markov -w setA setB setC', 'This will generate a name from setA, setB, and setC and whisper them to you.']
             ]);
             if(playerIsGM(msg.playerid))
             {
                 helpText += '<br/><br/>For information on how to set up custom namesets, check out the '+
                     '<a href="https://github.com/Roll20/roll20-api-scripts/blob/master/Markov/README.md" target="_blank" style="color:blue; text-decoration:underline">'+
                     'README'+
                     '</a>.';
             }
         sendChat('', helpText);
     },
 
     /**
      * Produce HTML which properly formats the examples for the help text.
      * 
      * @param examples - Expected to be an array of tuples, where the first item is the command, and the second item is the description of output.
      * @return string - The HTML string containing the examples.
      */
     formatExamples: function(examples)
     {
             return '<ul>' + examples.map(function(example)
             {
                     return  '<li><p>'+
                                     '<pre style="display:block;">' + example[0] + 
                                     '</pre><span style="display:block; padding-left:10px">' + example[1] + '</span>'+
                                     '</p></li>';
             }).join('') + '</ul>';  
     },
     
     /**
      * Create a new name using Markov's logic
      *
      * @param languageName - will either be 'default', or the name of the handout that contains the nameset
      * @return string - the new name, or a message indicating failure.
      */
     generateName: function()
     {
         'use strict';
         //if (!this.namesets[languageName])
         //{
         //    return 'Unknown Language (name-set) or handout notes are not valid: ' + languageName;
         //}
 
         // Use markov's logic to generate a name using the names in languageName as a seed
         var chain = this.construct_chain(this.defaultNames);
         this.chain_cache["default"] = chain;
         if (chain)
         {
             return this.markov_name(chain);
         }
         return '';
     },
 
     /**
      * https://en.wikipedia.org/wiki/Markov_chain
      *
      * @param type
      * @return {*}
      */
     markov_chain: function(type)
     {
         'use strict';
 
         var chain = this.chain_cache[type];
 
         if (chain)
         {
             return chain;
         }
         else
         {
             var list = this.namesets[type];
             if (list)
             {
                 chain = this.construct_chain(list);
                 if (chain)
                 {
                    this.chain_cache[type] = chain;
                     return chain;
                 }
             }
         }
         return false;
     },
 
     /**
      * https://en.wikipedia.org/wiki/Markov_chain
      *
      * @param list
      * @return {*}
      */
     construct_chain: function(list)
     {
         'use strict';
 
         var chain = {};
 
         for (var i = 0; i < list.length; i++)
         {
             var names = list[i].split(/\s+/);
             chain = this.incr_chain(chain, 'parts', names.length);
 
             for (var j = 0; j < names.length; j++)
             {
                 var name = names[j];
                 chain= this.incr_chain(chain, 'name_len', name.length);
 
                 var c = name.substr(0, 1);
                 chain = this.incr_chain(chain, 'initial', c);
 
                 var string = name.substr(1);
                 var last_c = c;
 
                 while (string.length > 0)
                 {
                     c = string.substr(0, 1);
                     chain = this.incr_chain(chain, last_c, c);
 
                     string = string.substr(1);
                     last_c = c;
                 }
             }
         }
         return this.scale_chain(chain);
     },
 
     /**
      * https://en.wikipedia.org/wiki/Markov_chain
      *
      * @param chain
      * @param key
      * @param token
      * @return {*}
      */
     incr_chain: function(chain, key, token)
       {
           'use strict';
 
         if (chain[key])
         {
             if (chain[key][token])
             {
                 chain[key][token]++;
             }
             else
             {
                 chain[key][token] = 1;
             }
         }
         else
         {
             chain[key]= {};
             chain[key][token] = 1;
         }
         return chain;
     },
 
     /**
      * https://en.wikipedia.org/wiki/Markov_chain
      *
      * @param chain
      * @return {*}
      */
     scale_chain: function(chain)
     {
         'use strict';
 
         var table_len = {};
         for (var key in chain)
         {
             table_len[key] = 0;
 
             for (var token in chain[key])
             {
                 var count= chain[key][token];
                 var weighted = Math.floor(Math.pow(count, 1.3));
 
                 chain[key][token] = weighted;
                 table_len[key] += weighted;
             }
         }
         chain.table_len = table_len;
         return chain;
     },
 
     /**
      * https://en.wikipedia.org/wiki/Markov_chain
      *
      * @param chain
      * @return {string}
      */
     markov_name: function(chain)
     {
         'use strict';
 
         var parts = this.select_link(chain, 'parts');
         var names = [];
 
         for (var i = 0; i < parts; i++)
         {
             var name_len = this.select_link(chain, 'name_len');
             var c= this.select_link(chain, 'initial');
             var name = c;
             var last_c= c;
 
             while (name.length < name_len)
             {
                 c = this.select_link(chain, last_c);
                 name += c;
                 last_c = c;
             }
             names.push(name);
         }
         return names.join(' ');
     },
 
     /**
      * https://en.wikipedia.org/wiki/Markov_chain
      *
      * @param chain
      * @param key
      * @return {*}
      */
     select_link: function(chain, key)
     {
         'use strict';
 
         var len = chain.table_len[key];
         var idx = Math.floor(Math.random() * len);
 
         var t = 0;
         for (var token in chain[key])
         {
             t += chain[key][token];
             if (idx < t)
             {
                 return token;
             }
         }
         return '-';
     }
 };
 
