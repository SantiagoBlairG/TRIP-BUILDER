// Curated demo content, not live travel advice. Re-run with npm run data:generate.
import { mkdir, writeFile } from "node:fs/promises";
import activityPhotos from "../src/data/activity-images.json" with { type: "json" };
import cityPhotos from "../src/data/city-images.json" with { type: "json" };

const countries = [
  [
    "colombia",
    "Colombia",
    "South America",
    "Caribbean colors, mountain mornings, and a warm welcome.",
    35,
    95,
  ],
  [
    "france",
    "France",
    "Europe",
    "Neighborhood cafés, grand galleries, and long summer evenings.",
    90,
    210,
  ],
  [
    "italy",
    "Italy",
    "Europe",
    "Coastal paths, living history, and meals worth lingering over.",
    75,
    185,
  ],
  [
    "japan",
    "Japan",
    "Asia",
    "Quiet gardens, bright city streets, and everyday rituals.",
    65,
    170,
  ],
  [
    "spain",
    "Spain",
    "Europe",
    "Late lunches, expressive architecture, and Mediterranean light.",
    65,
    155,
  ],
  [
    "greece",
    "Greece",
    "Europe",
    "Island afternoons, ancient stories, and tables by the sea.",
    60,
    155,
  ],
];

// City: ID, country, name, recommended days, latitude, longitude, description.
// Activity: name, category, duration in minutes, mock USD per person, description.
const seeds = [
  [
    [
      "medellin",
      "colombia",
      "Medellín",
      3,
      6.2442,
      -75.5812,
      "Creative neighborhoods in a green Andean valley.",
    ],
    [
      [
        "Comuna 13 street art walk",
        "culture",
        180,
        22,
        "Follow murals and neighborhood stories on a guided walk.",
      ],
      [
        "Plaza Botero sculpture stroll",
        "history",
        90,
        0,
        "Explore the open-air sculptures around the central plaza.",
      ],
      [
        "Jardín Botánico morning",
        "nature",
        120,
        0,
        "Spend a quiet morning among tropical plants and shaded paths.",
      ],
      [
        "Arví forest trail",
        "hiking",
        300,
        18,
        "Take a forest walk in the hills outside the city.",
      ],
      [
        "Laureles coffee tasting",
        "food",
        90,
        16,
        "Compare regional coffees in a neighborhood café.",
      ],
      [
        "El Poblado salsa evening",
        "nightlife",
        150,
        25,
        "Try a beginner-friendly dance session followed by live music.",
      ],
    ],
  ],
  [
    [
      "cartagena",
      "colombia",
      "Cartagena",
      3,
      10.391,
      -75.4794,
      "Colorful lanes and Caribbean afternoons inside old city walls.",
    ],
    [
      [
        "Walled City walking route",
        "history",
        150,
        0,
        "Wander plazas and shaded lanes in the historic center.",
      ],
      [
        "Getsemaní mural walk",
        "photography",
        120,
        0,
        "Look for painted facades and street art around the neighborhood.",
      ],
      [
        "Rosario Islands boat day",
        "beaches",
        480,
        85,
        "Set aside a full day for a boat excursion and beach time.",
      ],
      [
        "San Felipe fortress visit",
        "history",
        120,
        12,
        "Explore the fortress passages and city-facing viewpoints.",
      ],
      [
        "Cartagena arepa tasting",
        "food",
        90,
        18,
        "Taste coastal snacks with a local food guide.",
      ],
      [
        "Caribbean cooking workshop",
        "food",
        180,
        48,
        "Prepare a regional lunch in a small-group cooking session.",
      ],
    ],
  ],
  [
    [
      "bogota",
      "colombia",
      "Bogotá",
      3,
      4.711,
      -74.0721,
      "High-altitude art, neighborhood cafés, and mountain views.",
    ],
    [
      [
        "Gold Museum visit",
        "culture",
        150,
        8,
        "Explore galleries of metalwork and cultural history.",
      ],
      [
        "La Candelaria architecture walk",
        "history",
        150,
        0,
        "Trace old streets, courtyards, and colorful facades.",
      ],
      [
        "Monserrate viewpoint",
        "photography",
        180,
        18,
        "Make time for a broad view across the city from the mountain.",
      ],
      [
        "Paloquemao market tasting",
        "food",
        120,
        24,
        "Discover tropical fruit and a market breakfast.",
      ],
      [
        "Simón Bolívar park picnic",
        "family",
        150,
        12,
        "Bring a picnic and enjoy an easy afternoon outdoors.",
      ],
      [
        "Usaquén craft browsing",
        "shopping",
        120,
        0,
        "Browse small shops and artisan stalls around the neighborhood.",
      ],
    ],
  ],
  [
    [
      "santa-marta",
      "colombia",
      "Santa Marta",
      4,
      11.2408,
      -74.199,
      "A coastal base for forest trails and Caribbean coves.",
    ],
    [
      [
        "Tayrona day trip",
        "hiking",
        540,
        58,
        "Plan a full-day outing for coastal trails and forest scenery.",
      ],
      [
        "Taganga introductory dive",
        "adventure",
        240,
        90,
        "Join a guided introductory diving session off the coast.",
      ],
      [
        "Minca coffee outing",
        "food",
        360,
        45,
        "Head into the foothills for coffee and a slower afternoon.",
      ],
      [
        "Bahía Concha beach afternoon",
        "beaches",
        300,
        22,
        "Leave time for a beach outing and a simple coastal lunch.",
      ],
      [
        "Historic center evening walk",
        "history",
        90,
        0,
        "Explore plazas and old streets as the day cools.",
      ],
      [
        "Quinta de San Pedro gardens",
        "nature",
        150,
        14,
        "Walk through the historic estate and its green grounds.",
      ],
    ],
  ],
  [
    [
      "paris",
      "france",
      "Paris",
      4,
      48.8566,
      2.3522,
      "Neighborhood rituals, riverside walks, and extraordinary art.",
    ],
    [
      [
        "Louvre highlights visit",
        "culture",
        240,
        32,
        "Choose a small set of galleries for an unhurried museum visit.",
      ],
      [
        "Seine riverside walk",
        "photography",
        120,
        0,
        "Follow the river past bridges and changing city views.",
      ],
      [
        "Le Marais pastry walk",
        "food",
        120,
        30,
        "Taste pastries and take café breaks between neighborhood lanes.",
      ],
      [
        "Montmartre side streets",
        "history",
        150,
        0,
        "Explore stairways, small squares, and hillside streets.",
      ],
      [
        "Luxembourg Gardens afternoon",
        "family",
        120,
        0,
        "Slow down around the gardens and open-air spaces.",
      ],
      [
        "Saint-Germain bookshops",
        "shopping",
        120,
        0,
        "Browse independent shelves and neighborhood shops.",
      ],
    ],
  ],
  [
    [
      "lyon",
      "france",
      "Lyon",
      3,
      45.764,
      4.8357,
      "Old passageways and generous tables at the meeting of two rivers.",
    ],
    [
      [
        "Vieux Lyon passageways",
        "history",
        150,
        15,
        "Join a walk through the old quarter and its passageways.",
      ],
      [
        "Halles de Lyon tasting",
        "food",
        150,
        45,
        "Sample regional specialties in the covered food market.",
      ],
      [
        "Fourvière viewpoint walk",
        "photography",
        120,
        0,
        "Walk up to broad views over the city and rivers.",
      ],
      [
        "Parc de la Tête d’Or",
        "nature",
        180,
        0,
        "Follow lakeside paths and relax in the park.",
      ],
      [
        "Musée des Confluences visit",
        "culture",
        180,
        15,
        "Explore a museum where natural history meets human stories.",
      ],
      [
        "Croix-Rousse silk workshop",
        "shopping",
        120,
        25,
        "Discover textile traditions and local workshop displays.",
      ],
    ],
  ],
  [
    [
      "nice",
      "france",
      "Nice",
      3,
      43.7102,
      7.262,
      "Pebble beaches, old-town markets, and Riviera light.",
    ],
    [
      [
        "Promenade des Anglais walk",
        "beaches",
        120,
        0,
        "Enjoy an easy seafront walk with time by the water.",
      ],
      [
        "Cours Saleya market tasting",
        "food",
        120,
        28,
        "Try market snacks and explore the surrounding old town.",
      ],
      [
        "Castle Hill viewpoints",
        "photography",
        120,
        0,
        "Climb above the waterfront for layered coastal views.",
      ],
      [
        "Matisse Museum visit",
        "culture",
        120,
        15,
        "Set aside an afternoon for the artist’s work and surroundings.",
      ],
      [
        "Old Nice architecture walk",
        "history",
        120,
        0,
        "Wander narrow streets and small squares in the old quarter.",
      ],
      [
        "Coco Beach coastal stroll",
        "wellness",
        90,
        0,
        "Take a gentle waterside walk east of the port.",
      ],
    ],
  ],
  [
    [
      "bordeaux",
      "france",
      "Bordeaux",
      3,
      44.8378,
      -0.5792,
      "Riverfront stonework, neighborhood tables, and wine stories.",
    ],
    [
      [
        "Cité du Vin discovery",
        "culture",
        180,
        28,
        "Explore exhibitions about wine cultures and traditions.",
      ],
      [
        "Miroir d’Eau photo walk",
        "photography",
        90,
        0,
        "Look for riverfront reflections around the landmark square.",
      ],
      [
        "Marché des Capucins lunch",
        "food",
        120,
        28,
        "Build a relaxed lunch from the market’s food counters.",
      ],
      [
        "Saint-Pierre quarter walk",
        "history",
        120,
        0,
        "Discover old streets and lively neighborhood squares.",
      ],
      [
        "Jardin Public picnic",
        "family",
        120,
        15,
        "Take a picnic break among the gardens and open lawns.",
      ],
      [
        "Chartrons antique browsing",
        "shopping",
        120,
        0,
        "Browse antique shops and small galleries in the district.",
      ],
    ],
  ],
  [
    [
      "rome",
      "italy",
      "Rome",
      4,
      41.9028,
      12.4964,
      "Ancient landmarks and everyday neighborhood life.",
    ],
    [
      [
        "Colosseum and Forum visit",
        "history",
        240,
        38,
        "Set aside a morning for ancient monuments and archaeological paths.",
      ],
      [
        "Trastevere pasta workshop",
        "food",
        180,
        65,
        "Make fresh pasta and share a small-group meal.",
      ],
      [
        "Borghese Gallery visit",
        "culture",
        120,
        30,
        "Focus on sculptures and paintings in an intimate gallery setting.",
      ],
      [
        "Villa Borghese garden walk",
        "nature",
        150,
        0,
        "Find a green pause along the park’s broad pathways.",
      ],
      [
        "Testaccio market lunch",
        "food",
        120,
        25,
        "Build a lunch from the neighborhood’s market stalls.",
      ],
      [
        "Trevi early photo walk",
        "photography",
        90,
        0,
        "Start early for a quieter walk around the fountain and nearby streets.",
      ],
    ],
  ],
  [
    [
      "florence",
      "italy",
      "Florence",
      3,
      43.7696,
      11.2558,
      "Renaissance galleries, artisan streets, and Tuscan tables.",
    ],
    [
      [
        "Uffizi highlights visit",
        "culture",
        180,
        35,
        "Choose a gallery route through Renaissance paintings.",
      ],
      [
        "Duomo neighborhood walk",
        "history",
        120,
        0,
        "Explore cathedral-square details and the surrounding streets.",
      ],
      [
        "Mercato Centrale tasting",
        "food",
        120,
        30,
        "Sample Tuscan ingredients and prepared dishes at the market.",
      ],
      [
        "Piazzale Michelangelo sunset",
        "photography",
        120,
        0,
        "Walk up for the changing light over the river and rooftops.",
      ],
      [
        "Oltrarno artisan studios",
        "shopping",
        150,
        20,
        "Discover small workshops south of the river.",
      ],
      [
        "Boboli Gardens wander",
        "nature",
        180,
        18,
        "Explore landscaped paths, terraces, and garden sculpture.",
      ],
    ],
  ],
  [
    [
      "venice",
      "italy",
      "Venice",
      3,
      45.4408,
      12.3155,
      "Canals, quiet corners, and lagoon traditions.",
    ],
    [
      [
        "Doge’s Palace visit",
        "history",
        180,
        35,
        "Explore ceremonial rooms and Venetian history.",
      ],
      [
        "Rialto market morning",
        "food",
        120,
        25,
        "Browse market produce and stop for small local bites.",
      ],
      [
        "Dorsoduro art walk",
        "culture",
        180,
        22,
        "Pair a gallery visit with a quiet neighborhood walk.",
      ],
      [
        "Burano color walk",
        "photography",
        300,
        30,
        "Take a lagoon outing to streets lined with colorful houses.",
      ],
      [
        "Cannaregio canal stroll",
        "history",
        120,
        0,
        "Follow smaller canals through a residential neighborhood.",
      ],
      [
        "Lagoon rowing introduction",
        "adventure",
        120,
        70,
        "Try a guided introduction to Venetian rowing traditions.",
      ],
    ],
  ],
  [
    [
      "positano",
      "italy",
      "Positano",
      3,
      40.6281,
      14.4845,
      "Hillside lanes and long views along the Amalfi Coast.",
    ],
    [
      [
        "Fornillo Beach afternoon",
        "beaches",
        240,
        25,
        "Follow the coastal path for a relaxed afternoon by the water.",
      ],
      [
        "Path of the Gods hike",
        "hiking",
        360,
        35,
        "Allow time for transfers and a scenic hillside hiking outing.",
      ],
      [
        "Amalfi Coast boat outing",
        "adventure",
        240,
        95,
        "See the coastline from the water on a small-group excursion.",
      ],
      [
        "Positano lemon cooking class",
        "food",
        180,
        80,
        "Prepare a coastal menu with a bright citrus finish.",
      ],
      [
        "Santa Maria Assunta visit",
        "history",
        60,
        0,
        "Stop by the church and explore the surrounding lanes.",
      ],
      [
        "Hillside sunrise photo walk",
        "photography",
        90,
        0,
        "Find early light among stairways and coast-facing viewpoints.",
      ],
    ],
  ],
  [
    [
      "tokyo",
      "japan",
      "Tokyo",
      4,
      35.6762,
      139.6503,
      "Distinct neighborhoods, tiny restaurants, and city-scale energy.",
    ],
    [
      [
        "Sensō-ji and Asakusa walk",
        "history",
        150,
        0,
        "Explore temple surroundings and traditional shopping streets.",
      ],
      [
        "Tsukiji outer market breakfast",
        "food",
        120,
        30,
        "Taste a selection of market dishes over a slow morning.",
      ],
      [
        "Shinjuku Gyoen garden time",
        "nature",
        120,
        8,
        "Take a quiet break in spacious landscaped gardens.",
      ],
      [
        "Shibuya evening photo walk",
        "photography",
        120,
        0,
        "Explore illuminated streets and the neighborhood’s busy crossings.",
      ],
      [
        "Tokyo National Museum visit",
        "culture",
        180,
        12,
        "Discover art and historical objects in the museum galleries.",
      ],
      [
        "Shimokitazawa vintage shops",
        "shopping",
        180,
        0,
        "Browse independent clothing stores and pause at a café.",
      ],
    ],
  ],
  [
    [
      "kyoto",
      "japan",
      "Kyoto",
      4,
      35.0116,
      135.7681,
      "Temple paths, garden details, and seasonal rituals.",
    ],
    [
      [
        "Fushimi Inari morning walk",
        "hiking",
        180,
        0,
        "Follow shrine paths uphill at an unhurried pace.",
      ],
      [
        "Nishiki Market tasting",
        "food",
        120,
        28,
        "Sample small dishes while exploring the market streets.",
      ],
      [
        "Arashiyama riverside walk",
        "nature",
        180,
        0,
        "Pair riverside paths with a stroll through the surrounding area.",
      ],
      [
        "Higashiyama lane photography",
        "photography",
        150,
        0,
        "Look for architectural details along the historic hillside lanes.",
      ],
      [
        "Kyoto tea ceremony",
        "culture",
        90,
        35,
        "Join a guided introduction to tea preparation and etiquette.",
      ],
      [
        "Kyoto sentō relaxation",
        "wellness",
        90,
        10,
        "Set aside time for a neighborhood public-bath visit.",
      ],
    ],
  ],
  [
    [
      "osaka",
      "japan",
      "Osaka",
      3,
      34.6937,
      135.5023,
      "Street food, lively arcades, and welcoming neighborhoods.",
    ],
    [
      [
        "Dōtonbori street-food walk",
        "food",
        180,
        35,
        "Taste small dishes among the canal-side food streets.",
      ],
      [
        "Osaka Castle park walk",
        "history",
        180,
        10,
        "Explore the castle surroundings and their broad park paths.",
      ],
      [
        "Kuromon Market tasting",
        "food",
        120,
        28,
        "Try a market lunch from a few different stalls.",
      ],
      [
        "Osaka Aquarium visit",
        "family",
        180,
        25,
        "Spend an afternoon exploring marine-life exhibits.",
      ],
      [
        "Shinsekai evening lights",
        "nightlife",
        150,
        22,
        "Explore neighborhood dining and illuminated streets after dusk.",
      ],
      [
        "Nakanoshima riverside pause",
        "wellness",
        90,
        0,
        "Take a gentle walk between waterways and green spaces.",
      ],
    ],
  ],
  [
    [
      "hiroshima",
      "japan",
      "Hiroshima",
      2,
      34.3853,
      132.4553,
      "Reflective history, riverside spaces, and island day trips.",
    ],
    [
      [
        "Peace Memorial Museum",
        "culture",
        180,
        5,
        "Allow time for a thoughtful visit through the museum’s exhibits.",
      ],
      [
        "Peace Memorial Park walk",
        "history",
        120,
        0,
        "Walk through the memorial grounds at a reflective pace.",
      ],
      [
        "Miyajima island outing",
        "photography",
        480,
        35,
        "Set aside a day for ferry travel and island scenery.",
      ],
      [
        "Hiroshima okonomiyaki lesson",
        "food",
        150,
        40,
        "Learn to prepare a layered regional version of the dish.",
      ],
      [
        "Shukkeien garden stroll",
        "nature",
        90,
        5,
        "Follow garden paths around miniature landscapes and water.",
      ],
      [
        "Hondōri shopping walk",
        "shopping",
        120,
        0,
        "Browse the covered arcade and its side streets.",
      ],
    ],
  ],
  [
    [
      "barcelona",
      "spain",
      "Barcelona",
      4,
      41.3874,
      2.1686,
      "Expressive architecture between neighborhood squares and the sea.",
    ],
    [
      [
        "Sagrada Família visit",
        "history",
        150,
        38,
        "Explore the basilica’s light, structure, and architectural details.",
      ],
      [
        "Park Güell morning",
        "photography",
        150,
        22,
        "Walk through colorful architectural spaces and viewpoints.",
      ],
      [
        "Gràcia tapas evening",
        "food",
        180,
        45,
        "Share small plates around neighborhood squares.",
      ],
      [
        "Barceloneta beach pause",
        "beaches",
        180,
        0,
        "Set aside a relaxed afternoon along the seafront.",
      ],
      [
        "Picasso Museum visit",
        "culture",
        150,
        18,
        "Explore a focused collection in the old city.",
      ],
      [
        "Montjuïc garden walk",
        "nature",
        180,
        0,
        "Follow green paths above the harbor and city streets.",
      ],
    ],
  ],
  [
    [
      "madrid",
      "spain",
      "Madrid",
      3,
      40.4168,
      -3.7038,
      "Grand art collections and convivial neighborhood evenings.",
    ],
    [
      [
        "Prado Museum highlights",
        "culture",
        180,
        22,
        "Choose a manageable route through major painting galleries.",
      ],
      [
        "Retiro Park afternoon",
        "nature",
        150,
        0,
        "Make time for shaded paths and waterside benches.",
      ],
      [
        "La Latina tapas walk",
        "food",
        180,
        40,
        "Share a few small plates across neighborhood taverns.",
      ],
      [
        "Royal Palace visit",
        "history",
        150,
        22,
        "Explore ceremonial spaces and palace surroundings.",
      ],
      [
        "Malasaña independent shops",
        "shopping",
        150,
        0,
        "Browse small design and vintage stores around the district.",
      ],
      [
        "Madrid flamenco evening",
        "nightlife",
        120,
        45,
        "Plan an evening around an intimate performance.",
      ],
    ],
  ],
  [
    [
      "seville",
      "spain",
      "Seville",
      3,
      37.3891,
      -5.9845,
      "Shaded courtyards, tiled details, and late-evening walks.",
    ],
    [
      [
        "Real Alcázar gardens",
        "history",
        180,
        22,
        "Explore palace courtyards and landscaped gardens.",
      ],
      [
        "Triana ceramics walk",
        "shopping",
        120,
        10,
        "Discover tiled facades and ceramics workshops across the river.",
      ],
      [
        "Santa Cruz tapas tasting",
        "food",
        180,
        38,
        "Pair a neighborhood stroll with a relaxed tapas meal.",
      ],
      [
        "Plaza de España photo walk",
        "photography",
        120,
        0,
        "Look for tilework, arches, and reflections around the plaza.",
      ],
      [
        "María Luisa Park picnic",
        "family",
        150,
        15,
        "Find a shaded spot for an easy outdoor lunch.",
      ],
      [
        "Seville flamenco performance",
        "culture",
        90,
        35,
        "Spend an evening with music and dance in a small venue.",
      ],
    ],
  ],
  [
    [
      "valencia",
      "spain",
      "Valencia",
      3,
      39.4699,
      -0.3763,
      "Market mornings, futuristic forms, and long sandy beaches.",
    ],
    [
      [
        "Central Market tasting",
        "food",
        120,
        28,
        "Sample ingredients and snacks in the historic market hall.",
      ],
      [
        "Turia Gardens cycle",
        "adventure",
        180,
        22,
        "Rent a bike for a relaxed ride through the urban gardens.",
      ],
      [
        "Arts and Sciences photo walk",
        "photography",
        150,
        0,
        "Explore the complex’s exterior forms and water reflections.",
      ],
      [
        "Malvarrosa beach afternoon",
        "beaches",
        240,
        0,
        "Leave a free afternoon for the broad city beach.",
      ],
      [
        "Valencian paella workshop",
        "food",
        240,
        65,
        "Learn to prepare a regional rice dish in a guided class.",
      ],
      [
        "Silk Exchange visit",
        "history",
        90,
        5,
        "Explore the historic trading hall and its stonework.",
      ],
    ],
  ],
  [
    [
      "athens",
      "greece",
      "Athens",
      3,
      37.9838,
      23.7275,
      "Ancient hilltops and lively neighborhood tables.",
    ],
    [
      [
        "Acropolis morning visit",
        "history",
        180,
        35,
        "Allow a full morning for the hilltop monuments and views.",
      ],
      [
        "Acropolis Museum galleries",
        "culture",
        180,
        22,
        "Explore archaeological displays in the museum below the hill.",
      ],
      [
        "Monastiraki market browsing",
        "shopping",
        120,
        0,
        "Wander the market lanes and neighborhood shops.",
      ],
      [
        "Athens meze tasting",
        "food",
        180,
        40,
        "Share small plates and discover regional flavors.",
      ],
      [
        "Philopappos Hill walk",
        "photography",
        120,
        0,
        "Follow paths to broad views over the ancient city.",
      ],
      [
        "National Garden pause",
        "wellness",
        90,
        0,
        "Take a quiet break on shaded city-center paths.",
      ],
    ],
  ],
  [
    [
      "santorini",
      "greece",
      "Santorini",
      3,
      36.3932,
      25.4615,
      "Volcanic landscapes and villages above the Aegean.",
    ],
    [
      [
        "Fira to Oia coastal hike",
        "hiking",
        300,
        0,
        "Plan a long walk along the caldera-facing path.",
      ],
      [
        "Akrotiri archaeological visit",
        "history",
        150,
        22,
        "Explore the sheltered remains of an ancient settlement.",
      ],
      [
        "Perissa beach afternoon",
        "beaches",
        240,
        18,
        "Spend a slower afternoon beside volcanic sand and sea.",
      ],
      [
        "Santorini tomato cooking class",
        "food",
        180,
        75,
        "Prepare island-inspired dishes with seasonal ingredients.",
      ],
      [
        "Oia early photo walk",
        "photography",
        120,
        0,
        "Look for early light across village lanes and sea views.",
      ],
      [
        "Caldera sailing outing",
        "adventure",
        300,
        110,
        "Join a boat outing for a different view of the island.",
      ],
    ],
  ],
  [
    [
      "chania",
      "greece",
      "Chania",
      3,
      35.5138,
      24.018,
      "Harbor lanes and Cretan cooking with mountains nearby.",
    ],
    [
      [
        "Venetian harbor walk",
        "history",
        120,
        0,
        "Trace the old waterfront and its surrounding streets.",
      ],
      [
        "Cretan cooking workshop",
        "food",
        240,
        65,
        "Prepare a shared meal using regional ingredients.",
      ],
      [
        "Nea Chora beach pause",
        "beaches",
        180,
        0,
        "Take a relaxed break by the water close to town.",
      ],
      [
        "Chania archaeological museum",
        "culture",
        150,
        15,
        "Explore objects and stories from the surrounding region.",
      ],
      [
        "Theriso gorge outing",
        "hiking",
        300,
        40,
        "Set aside time for a guided outing into the nearby gorge area.",
      ],
      [
        "Old town artisan lanes",
        "shopping",
        120,
        0,
        "Browse local workshops along the narrow lanes.",
      ],
    ],
  ],
  [
    [
      "naxos",
      "greece",
      "Naxos",
      3,
      37.1036,
      25.3777,
      "Village paths, island produce, and broad sandy shores.",
    ],
    [
      [
        "Portara sunset walk",
        "photography",
        90,
        0,
        "Walk out to the marble gateway for evening island views.",
      ],
      [
        "Agios Prokopios beach day",
        "beaches",
        300,
        20,
        "Leave a generous stretch of time for sand and sea.",
      ],
      [
        "Naxian cheese tasting",
        "food",
        120,
        32,
        "Discover island cheeses in a guided tasting session.",
      ],
      [
        "Chalki village walk",
        "history",
        240,
        18,
        "Make an inland outing for village lanes and local architecture.",
      ],
      [
        "Mount Zas hiking outing",
        "hiking",
        360,
        45,
        "Join a guided mountain walk with time for transfers.",
      ],
      [
        "Agia Anna family afternoon",
        "family",
        180,
        15,
        "Combine a gentle beach afternoon with a simple seaside snack.",
      ],
    ],
  ],
];

const cityData = [];
const activityData = [];
for (const [
  [cityId, countryId, name, recommendedDays, latitude, longitude, description],
  activities,
] of seeds) {
  const image = cityPhotos.find((photo) => photo.cityId === cityId)?.src;
  if (!image) throw new Error(`Missing city photograph: ${cityId}`);
  const cityActivities = activities.map(
    (
      [
        activityName,
        category,
        durationMinutes,
        estimatedCost,
        activityDescription,
      ],
      index,
    ) => ({
      id: `${cityId}-${String(index + 1).padStart(2, "0")}`,
      countryId,
      cityId,
      name: activityName,
      description: activityDescription,
      image:
        activityPhotos.find(
          (photo) =>
            photo.activityId ===
            `${cityId}-${String(index + 1).padStart(2, "0")}`,
        )?.src ?? image,
      category,
      tags: [
        index === 0
          ? "Must visit"
          : category === "culture"
            ? "Rainy day"
            : index === 5
              ? "Hidden gem"
              : "Optional",
      ],
      durationMinutes,
      estimatedCost,
      currency: "USD",
      // Coarse city-area pins for the simulated map, not attraction entrances or routing.
      coordinates: {
        latitude: Number((latitude + (index - 2) * 0.002).toFixed(4)),
        longitude: Number((longitude + ((index % 3) - 1) * 0.003).toFixed(4)),
      },
      rating: [4.8, 4.6, 4.7, 4.5, 4.9, 4.4][index],
      recommendedTimeOfDay: [
        category === "nightlife"
          ? "evening"
          : category === "hiking" || index === 0
            ? "morning"
            : "afternoon",
      ],
    }),
  );
  activityData.push(...cityActivities);
  cityData.push({
    id: cityId,
    countryId,
    name,
    description,
    image,
    recommendedDays,
    tags: [...new Set(cityActivities.map((activity) => activity.category))],
    coordinates: { latitude, longitude },
    activityIds: cityActivities.map((activity) => activity.id),
  });
}
const countryData = countries.map(
  ([id, name, continent, description, min, max]) => ({
    id,
    name,
    continent,
    description,
    image: `/images/${id}.jpg`,
    theme: id,
    tags: [
      ...new Set(
        cityData
          .filter((city) => city.countryId === id)
          .flatMap((city) => city.tags),
      ),
    ],
    dailyBudget: { min, max },
    cityIds: cityData
      .filter((city) => city.countryId === id)
      .map((city) => city.id),
  }),
);

function demoTrip(id, name, countryId, stops, startDate, status, priorities) {
  const route = stops.map(([cityId, days], index) => ({
    id: `${id}-stop-${index + 1}`,
    cityId,
    days,
  }));
  const totalDays = route.reduce((sum, stop) => sum + stop.days, 0);
  const endDate = startDate
    ? new Date(Date.parse(startDate) + (totalDays - 1) * 86_400_000)
        .toISOString()
        .slice(0, 10)
    : undefined;
  let dayNumber = 0;
  const itinerary = route.flatMap((stop) =>
    Array.from({ length: stop.days }, (_, index) => {
      dayNumber += 1;
      const activity = activityData.find(
        (item) => item.id === `${stop.cityId}-01`,
      );
      return {
        id: `${id}-day-${dayNumber}`,
        dayNumber,
        cityId: stop.cityId,
        activities:
          index === 0 && status !== "draft"
            ? [
                {
                  id: `${id}-scheduled-${dayNumber}`,
                  activityId: activity.id,
                  startTime: "09:00",
                  durationMinutes: activity.durationMinutes,
                  costPerPerson: activity.estimatedCost,
                  status: "planned",
                  notes: "Demo plan — confirm details before travel.",
                },
              ]
            : [],
      };
    }),
  );
  return {
    id,
    name,
    status,
    countryIds: [countryId],
    route,
    ...(startDate ? { startDate, endDate } : {}),
    totalDays,
    travelers: [
      { id: `${id}-traveler-1`, name: "Alex", type: "adult" },
      { id: `${id}-traveler-2`, name: "Sam", type: "adult" },
    ],
    travelerType: "couple",
    budget: { level: "balanced", currency: "USD" },
    theme: countryId,
    travelStylePriorities: priorities,
    savedActivityIds: route.flatMap((stop) => [
      `${stop.cityId}-01`,
      `${stop.cityId}-02`,
    ]),
    itinerary,
  };
}
const demoTrips = [
  demoTrip(
    "japan-spring",
    "Japan Spring Escape",
    "japan",
    [
      ["tokyo", 4],
      ["kyoto", 4],
      ["osaka", 2],
    ],
    "2027-04-05",
    "upcoming",
    ["food", "culture", "photography"],
  ),
  demoTrip(
    "france-summer",
    "Summer in France",
    "france",
    [
      ["paris", 4],
      ["lyon", 2],
      ["nice", 3],
    ],
    "2027-07-10",
    "upcoming",
    ["culture", "food", "beaches"],
  ),
  demoTrip(
    "colombian-caribbean",
    "Colombian Caribbean",
    "colombia",
    [
      ["cartagena", 3],
      ["santa-marta", 4],
    ],
    undefined,
    "draft",
    ["beaches", "hiking", "food"],
  ),
  demoTrip(
    "italian-food",
    "Italian Food Tour",
    "italy",
    [
      ["rome", 3],
      ["florence", 3],
      ["positano", 3],
    ],
    "2026-06-01",
    "past",
    ["food", "history", "beaches"],
  ),
];

const destination = new URL("../src/data/", import.meta.url);
await mkdir(destination, { recursive: true });
for (const [name, data] of [
  ["countries", countryData],
  ["cities", cityData],
  ["activities", activityData],
  ["demo-trips", demoTrips],
]) {
  await writeFile(
    new URL(`${name}.json`, destination),
    `${JSON.stringify(data, null, 2)}\n`,
  );
}
console.log(
  `Wrote ${countryData.length} countries, ${cityData.length} cities, ${activityData.length} activities, and ${demoTrips.length} trips.`,
);
