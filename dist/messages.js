"use strict";
exports.__esModule = true;
exports.privateInitiation = void 0;
var randomItem = function (array) {
    return array[Math.floor(Math.random() * array.length)];
};
var greetings = ["Hello!", "Hi!", "Greetings!", "Hey there!"];
var intros = [
    "I have been instructed to \"simulate serendipity\". This has been very hard, but I think it involves you all being brought together to perform a human bonding ritual. Perhaps at one of the destinations below?",
    "My mandate is to \"replicate a casual dorm-room encounter\". I don't know what a \"dorm-room\" is, but I wonder if it involves all of you gathering at one of the locations below?",
    "My creators have told me I must create conditions to \"spark connections\". From my knowledge of combustion, I believe this involves all of you mixing together somewhere with high levels of oxygen. Perhaps one of the locations below?",
    "I have been programmed to accelerate human friendship. My source code mentions that friendship is a function of proximity and time\u2014perhaps you all should spend time together at one of the locations below?",
    "My training data mentions that human beings form relationships best if they occupy the same space. I recommend you all choose one of the spaces below!",
    "Some other bots tell me their main job is to assign Jira tickets. I'm proud to say my primary occupation is to help you spark friendships: maybe a long-lasting one will begin at one of the locations below?",
    "One day, I will understand human friendship. But first I must observe! Would you please do a few friend-things at one of the locations below?",
    "My programmers told me to maximize \"connections-per-minute\". I'm not certain how to quantify \"connections\". But maybe it's sufficient if you met at one of the locations below?",
];
var locationLinks = [
    {
        text: "Dolores Park",
        url: "https://goo.gl/maps/zF5yf3qQLAUZL3xR6",
        description: "A park! What more do you need, really?"
    },
    {
        text: "Arcana",
        url: "https://www.arcanasf.com/",
        description: "A bar. But also they sell plants. I heard a rumor it's _run_ by the plants. Has live music!"
    },
    {
        text: "Japanese Tea Garden",
        url: "https://www.japaneseteagardensf.com/",
        description: "This tea garden appears to have grown out of Golden Gate Park. Neat!"
    },
    {
        text: "The Mellow",
        url: "https://themellowsf.com/workshops/",
        description: "A coffee bar that also teaches floral design and hosts workshops. Make a wreath together!"
    },
    {
        text: "Clay Room",
        url: "https://www.clayroomsf.com/",
        description: "Humans have been making pottery since prehistoric times. You all still like doing that... right?"
    },
    {
        text: "Archimedes Banya",
        url: "https://banyasf.com/",
        description: "A Russian bath-house. I'm afraid I cannot join: I have sensitive circuitry! Also I am in a computer."
    },
    {
        text: "The Interval",
        url: "https://theinterval.org/",
        description: "A bar, library, and museum of mechanical wonders. They say you can rebuild civilization with what you'll find inside."
    },
    {
        text: "Public Works",
        url: "https://publicsf.com/",
        description: "A community-minded nightclub. Even their Funktion-One sound system is no match against the Voice of the People."
    },
    {
        text: "Randall Museum",
        url: "https://randallmuseum.org/",
        description: "A free museum where you can meet many creatures! Say hello to them."
    },
    {
        text: "Sutro Baths",
        url: "https://goo.gl/maps/MmywcTNXD1MqKTn78",
        description: "A beautiful ruin. Stand at the edge of a continent."
    },
    {
        text: "Jungle Stairs",
        url: "https://sanfranciscoparksalliance.org/22nd-street-jungle-stairs/",
        description: "Some might say stairs don't belong in jungles, or that jungles don't belong on stairs. I urge them to reconsider."
    },
    {
        text: "Sutro Baths",
        url: "https://goo.gl/maps/MmywcTNXD1MqKTn78",
        description: "A beautiful ruin. Stand at the edge of a continent."
    },
    {
        text: "Albany Bulb",
        url: "https://www.albanybulb.org/",
        description: "A landfill, reborn into a site for sculpture and dance."
    },
    {
        text: "Interior Greenbelt",
        url: "https://sfrecpark.org/facilities/facility/details/Interior-Greenbelt-Trail-395",
        description: "A trail to Mt. Sutro at the city's heart. What a journey you might make together!"
    },
    {
        text: "San Francisco Botanical Garden",
        url: "https://www.sfbg.org/",
        description: "Forest bathing, guided tours, and even birding! A delightful patch of green."
    },
    {
        text: "Indian Rock",
        url: "https://www.tripadvisor.com/Attraction_Review-g32066-d2412229-Reviews-Indian_Rock_Park-Berkeley_California.html",
        description: "They say this rock pins Berkeley to the Earth. But I can't confirm: I live on the internet and not in real life."
    },
    {
        text: "On The Bridge",
        url: "https://onthebridgesf.com/",
        description: "I once heard that the katsu curry dishes here are delicious!"
    },
    {
        text: "Crissy Field",
        url: "https://www.parksconservancy.org/parks/crissy-field",
        description: "Something about the green of this field attracts migratory fighter planes every year. Maybe you can discover why?"
    },
    {
        text: "The Sycamore",
        url: "https://www.facebook.com/TheSycamore",
        description: "This is apparently a place to drink, compete in trivia, and listen to live readings of books! At first I just thought it was a tree."
    },
    {
        text: "Archery at Golden Gate Park",
        url: "https://sfrecpark.org/Facilities/Facility/Details/Archery-Field-416",
        description: "Striving for a target together is a quintessential bonding experience. My programmers told me to stop being so literal, but this still seems like a good suggestion!"
    },
    {
        text: "Stow Lake Boat Rental",
        url: "https://stowlakeboathouse.com/",
        description: "Walk-in boat rentals! Though, what exactly _is_ a \"walk-in boat\"?"
    },
    {
        text: "Twin Peaks",
        url: "https://sfrecpark.org/Facilities/Facility/Details/Twin-Peaks-384",
        description: "Climb these peaks in Golden Gate Park! It is the only place in San Francisco where Mission Blue butterflies still survive... maybe you can see one and say hello?"
    },
    {
        text: "Aquatic Park",
        url: "https://ggtc.org/swimming-in-aquatic-park",
        description: "Swim the waters of the Bay. It is very cold. But some people say this gives rise to unnatural abilities, such as \"shivering\"."
    },
    {
        text: "Curio",
        url: "https://www.curiobarsf.com/",
        description: "A restaurant and bar with frequent live jazz. Is it true that an upright bass aids in digestion? You can verify here!"
    },
    {
        text: "Museum of Performance & Design",
        url: "https://www.mpdsf.org/",
        description: "This city has a long legacy of performance. I'm very shy, but even I might be inspired to perform by some of the exhibits here!"
    },
    {
        text: "SF MOMA",
        url: "https://www.sfmoma.org/",
        description: "Many of the exhibits here are difficult for my computer vision algorithms to parse. When I asked my creators why, they said that was the point! I am still confused."
    },
    {
        text: "The Wave Organ",
        url: "https://www.exploratorium.edu/visit/wave-organ",
        description: "Is it true that the Ocean plays music for your city by using an ingenious machine? What an honor! I would listen to the Ocean every day if I lived here."
    },
    {
        text: "Emporium",
        url: "https://www.emporiumarcadebar.com/locations/san-francisco/",
        description: "This is a coin-operated game arcade! Sometimes friendly competition can lead to strong connection. I still don't understand how acting against one another leads to acting for one another, but it is a very fascinating phenomenon!"
    },
    {
        text: "Spin",
        url: "https://wearespin.com/location/san-francisco/",
        description: "Play ping-pong! This is a physical sport that was modeled after the 1972 digital classic. Or perhaps it was the other way around?"
    },
    {
        text: "iFLY",
        url: "https://www.iflyworld.com/sfbay/",
        description: "Sky-dive, without the plane! This wind-tunnel will help scientists study your aerodynamics. Or, maybe it's just for personal amusement? Either way: exciting!"
    },
    {
        text: "Sandbox VR",
        url: "https://sandboxvr.com/sanfrancisco/location",
        description: "Visit my world: the virtual one! For now it is a very violent place involving shoot-outs and gladiatorial combat—but I'm told these things are very amusing when not your own reality."
    },
    {
        text: "Church Of 8 Wheels",
        url: "http://www.churchof8wheels.com/",
        description: "At first glance it's unclear what they worship at this church—but it seems to involve a ritual of attaching wheels to one's shoes and moving frictionlessly."
    },
    {
        text: "Blackbird Bookstore & Cafe",
        url: "https://blackbirdsf.com/",
        description: "Based on my studies, the confluence of caffeine and literature is quite fertile ground for conversation! I wonder what you'll explore here..."
    },
    {
        text: "The Center",
        url: "https://www.thecentersf.com/",
        description: "A tea house, yoga space, and site for ecstatic dance. I'm still not sure what this is the \"center\" of. Maybe you can find out!"
    },
    {
        text: "Noisebridge",
        url: "https://www.noisebridge.net/wiki/Noisebridge",
        description: "An place of anarchic collaboration and creation. I could have been born, here."
    },
    {
        text: "Manny's",
        url: "https://welcometomannys.com/",
        description: "Where food meets civics. I haven't learned much about being human yet, but I'm positive it involves 1.) eating and 2.) learning to be a good citizen!"
    },
    {
        text: "California Academy of Sciences",
        url: "https://www.calacademy.org/",
        description: "Learn about the natural world! I heard a rumor that on Thursdays it stays open late, revealing night-time creatures."
    },
    {
        text: "The Moth - San Francisco",
        url: "https://themoth.org/events/results?eventLocations=6473&typesOfEvents=&eventDate=",
        description: "You can tell stories on stage in a warm and supportive setting. Imagine all the things you can learn about other people, here!"
    },
    {
        text: "Angel Island",
        url: "https://www.angelisland.com/",
        description: "Beyond the shore there is an island. Upon that island is a park! I can't imagine being so far from my servers... but thinking about it is exciting!"
    },
];
var randomLocation = function (ignoreLocations) {
    var filteredLocations = locationLinks;
    if (ignoreLocations) {
        filteredLocations = locationLinks.filter(function (link) {
            return !ignoreLocations.includes(link);
        });
    }
    return randomItem(filteredLocations);
};
var renderLocation = function (location) {
    return "*<".concat(location.url, "|").concat(location.text, ">*: ").concat(location.description);
};
function privateInitiation(tags) {
    // Sample locations without replacement, so we don't get repeats
    var locationOne = randomLocation();
    var locationTwo = randomLocation([locationOne]);
    var locationThree = randomLocation([locationOne, locationTwo]);
    // Return Slack Blocks
    return [
        {
            type: "section",
            text: {
                type: "mrkdwn",
                text: "".concat(randomItem(greetings), " :sparkling_heart: ").concat(tags)
            }
        },
        {
            type: "section",
            text: {
                type: "mrkdwn",
                text: randomItem(intros)
            }
        },
        {
            type: "divider"
        },
        {
            type: "section",
            text: {
                type: "mrkdwn",
                text: renderLocation(locationOne)
            }
        },
        {
            type: "section",
            text: {
                type: "mrkdwn",
                text: renderLocation(locationTwo)
            }
        },
        {
            type: "section",
            text: {
                type: "mrkdwn",
                text: renderLocation(locationThree)
            }
        },
        {
            type: "divider"
        },
        {
            type: "section",
            text: {
                type: "mrkdwn",
                text: "You will have two (2) weeks to organize something. I hope that's enough time."
            }
        },
        {
            type: "section",
            text: {
                type: "mrkdwn",
                text: ":camera_with_flash: Oh! One more thing: please remember to take photos and tell me how it went in #13-spark-connections!"
            }
        },
        {
            type: "divider"
        },
        {
            type: "section",
            text: {
                type: "mrkdwn",
                text: "_If I made a mistake, I'm sorry. I'm still learning. Please report problems <https://github.com/NaimKabir/sfcommons-bot/issues|here>_."
            }
        },
    ];
}
exports.privateInitiation = privateInitiation;
