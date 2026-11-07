"use strict";

const STORE_KEY = "dhaka-parking-v3";
const BAY_COUNT = 12;
const SIMULATION_MS = 6000;
const LOADED_AT = Date.now();
const PREPARED_BY = ["Afrin Sultana"];

// Sample fit rule: room for parking and doors, plus space to enter and exit.
const LENGTH_CLEARANCE_MM = 300;
const WIDTH_CLEARANCE_MM = 400;
const ACCESS_MM = 1000;
const LONG_CAR_MM = 4700;
const LONG_CAR_ACCESS_MM = 1200;

const CARS = [
  { id: "alto", name: "Suzuki Alto", length: 3395, width: 1475 },
  { id: "aqua", name: "Toyota Aqua", length: 3995, width: 1695 },
  { id: "probox", name: "Toyota Probox", length: 4245, width: 1690 },
  { id: "vezel", name: "Honda Vezel", length: 4330, width: 1790 },
  { id: "axio", name: "Toyota Corolla Axio", length: 4400, width: 1695 },
  { id: "fielder", name: "Toyota Corolla Fielder", length: 4400, width: 1695 },
  { id: "allion", name: "Toyota Allion", length: 4565, width: 1695 },
  { id: "premio", name: "Toyota Premio", length: 4595, width: 1695 },
  { id: "altis", name: "Toyota Corolla Altis", length: 4620, width: 1775 },
  { id: "xtrail", name: "Nissan X-Trail", length: 4690, width: 1820 },
  { id: "noah", name: "Toyota Noah", length: 4710, width: 1730 },
  { id: "hiace-gl", name: "Toyota Hiace GL", length: 4840, width: 1880 },
  { id: "pajero", name: "Mitsubishi Pajero", length: 4900, width: 1875 },
  { id: "prado", name: "Toyota Land Cruiser Prado", length: 4925, width: 1980 },
  { id: "hiace-long", name: "Toyota Hiace Commuter", length: 5915, width: 1950 }
];

const BAY_TYPES = {
  compact: { width: 2000, length: 3800 },
  standard: { width: 2300, length: 5000 },
  large: { width: 2600, length: 5500 },
  extra: { width: 2800, length: 6300 }
};

const BAY_LAYOUT = [
  "standard", "compact", "standard", "large", "standard", "large",
  "compact", "standard", "large", "standard", "extra", "standard"
];
const CLEARANCES = [1500, 1200, 1000, 2000, 1200, 800, 1500, 1000, 1200, 2000, 1500, 1000];
const OBSTACLES = ["none", "tree", "none", "none", "pole", "none", "none", "none", "tree", "none", "pole", "none"];

const AREAS = [
  { id: "gulshan", en: "Gulshan", bn: "গুলশান", roads: [
    { id: "gulshan-ave", en: "Gulshan Avenue", bn: "গুলশান অ্যাভিনিউ", rate: 60, pattern: "TFTTFTTFTTTF", lat: 23.7925, lng: 90.4078 },
    { id: "gulshan-north", en: "Gulshan North Avenue", bn: "গুলশান নর্থ অ্যাভিনিউ", rate: 50, pattern: "TTFTTTFTTFTT", lat: 23.7975, lng: 90.4135 }
  ] },
  { id: "banani", en: "Banani", bn: "বনানী", roads: [
    { id: "kemal", en: "Kemal Ataturk Avenue", bn: "কামাল আতাতুর্ক অ্যাভিনিউ", rate: 60, pattern: "TTTFTTTTFTTT", lat: 23.7915, lng: 90.4045 },
    { id: "chairman", en: "Chairman Bari Road", bn: "চেয়ারম্যান বাড়ি রোড", rate: 40, pattern: "FTFFTTFTFTTF", lat: 23.7985, lng: 90.4 }
  ] },
  { id: "dhanmondi", en: "Dhanmondi", bn: "ধানমন্ডি", roads: [
    { id: "satmasjid", en: "Satmasjid Road", bn: "সাতমসজিদ রোড", rate: 40, pattern: "TTFTFTTTFTTT", lat: 23.747, lng: 90.373 },
    { id: "mirpur", en: "Mirpur Road", bn: "মিরপুর রোড", rate: 50, pattern: "TTTTFTTTTTFT", lat: 23.744, lng: 90.383 },
    { id: "dhanmondi-27", en: "Dhanmondi Road 27", bn: "ধানমন্ডি রোড ২৭", rate: 50, pattern: "TTFTTFTTTFTT", lat: 23.7545, lng: 90.3745 }
  ] },
  { id: "motijheel", en: "Motijheel", bn: "মতিঝিল", roads: [
    { id: "dilkusha", en: "Dilkusha Road", bn: "দিলকুশা রোড", rate: 50, pattern: "TTTTFTTTFTTT", lat: 23.7268, lng: 90.4182 },
    { id: "toyenbee", en: "Toyenbee Circular Road", bn: "টয়েনবি সার্কুলার রোড", rate: 40, pattern: "TFTTTFTTFTTF", lat: 23.7285, lng: 90.4228 }
  ] },
  { id: "mirpur-area", en: "Mirpur", bn: "মিরপুর", roads: [
    { id: "rokeya", en: "Begum Rokeya Sarani", bn: "বেগম রোকেয়া সরণি", rate: 30, pattern: "FTTFTTFTTTFT", lat: 23.801, lng: 90.37 },
    { id: "pallabi", en: "Pallabi Main Road", bn: "পল্লবী মেইন রোড", rate: 20, pattern: "FFTFTTFFTFTF", lat: 23.8235, lng: 90.3645 }
  ] },
  { id: "uttara", en: "Uttara", bn: "উত্তরা", roads: [
    { id: "sonargaon", en: "Sonargaon Janapath", bn: "সোনারগাঁও জনপথ", rate: 30, pattern: "FFTFTFFTFTFF", lat: 23.869, lng: 90.393 },
    { id: "rabindra", en: "Rabindra Sarani", bn: "রবীন্দ্র সরণি", rate: 30, pattern: "TFFTFTFTTFFT", lat: 23.8745, lng: 90.397 }
  ] },
  { id: "badda", en: "Badda", bn: "বাড্ডা", roads: [
    { id: "pragati", en: "Pragati Sarani", bn: "প্রগতি সরণি", rate: 40, pattern: "TTFTTTFTFTTT", lat: 23.779, lng: 90.426 },
    { id: "badda-link", en: "Gulshan-Badda Link Road", bn: "গুলশান-বাড্ডা লিংক রোড", rate: 30, pattern: "TFTFTTFTTFTF", lat: 23.7805, lng: 90.4215 }
  ] },
  { id: "mohammadpur", en: "Mohammadpur", bn: "মোহাম্মদপুর", roads: [
    { id: "asad", en: "Asad Avenue", bn: "আসাদ অ্যাভিনিউ", rate: 30, pattern: "TTFTFTTFTTFT", lat: 23.7585, lng: 90.3645 },
    { id: "tajmahal", en: "Tajmahal Road", bn: "তাজমহল রোড", rate: 20, pattern: "FTFTTFTFFTTF", lat: 23.7625, lng: 90.36 }
  ] }
];

const DESTINATIONS = [
  { id: "dhanmondi-lake", en: "Dhanmondi Lake", bn: "ধানমন্ডি লেক", area: "dhanmondi", lat: 23.7465, lng: 90.377 },
  { id: "dhanmondi-27", en: "Dhanmondi Road 27", bn: "ধানমন্ডি রোড ২৭", area: "dhanmondi", lat: 23.7545, lng: 90.3745 },
  { id: "gulshan-1", en: "Gulshan 1 Circle", bn: "গুলশান ১ চত্বর", area: "gulshan", lat: 23.7808, lng: 90.4167 },
  { id: "gulshan-2", en: "Gulshan 2 Circle", bn: "গুলশান ২ চত্বর", area: "gulshan", lat: 23.7946, lng: 90.4142 },
  { id: "banani-11", en: "Banani Road 11", bn: "বনানী রোড ১১", area: "banani", lat: 23.7937, lng: 90.404 },
  { id: "shapla", en: "Motijheel Shapla Chattar", bn: "মতিঝিল শাপলা চত্বর", area: "motijheel", lat: 23.7294, lng: 90.4195 },
  { id: "mirpur-10", en: "Mirpur 10 Circle", bn: "মিরপুর ১০ গোলচত্বর", area: "mirpur-area", lat: 23.8069, lng: 90.3687 },
  { id: "house-building", en: "Uttara House Building", bn: "উত্তরা হাউস বিল্ডিং", area: "uttara", lat: 23.874, lng: 90.4005 },
  { id: "badda-link-dest", en: "Badda Link Road", bn: "বাড্ডা লিংক রোড", area: "badda", lat: 23.7805, lng: 90.423 },
  { id: "town-hall", en: "Mohammadpur Town Hall", bn: "মোহাম্মদপুর টাউন হল", area: "mohammadpur", lat: 23.7605, lng: 90.3615 },
  { id: "farmgate", en: "Farmgate", bn: "ফার্মগেট", area: "dhanmondi", lat: 23.7577, lng: 90.39 },
  { id: "bashundhara-city", en: "Bashundhara City", bn: "বসুন্ধরা সিটি", area: "dhanmondi", lat: 23.751, lng: 90.3905 },
  { id: "jamuna", en: "Jamuna Future Park", bn: "যমুনা ফিউচার পার্ক", area: "badda", lat: 23.8135, lng: 90.4245 },
  { id: "du", en: "Dhaka University", bn: "ঢাকা বিশ্ববিদ্যালয়", area: "motijheel", lat: 23.734, lng: 90.3925 }
];

const TEXT = {
  en: {
    brand: "SmartPark Dhaka", prototype: "Prototype: sample data", sample: "Sample",
    tagline: "AI-based parking detection, measurement and navigation",
    find: "Find", map: "Map", bookings: "Bookings", profile: "Profile",
    heading: "Where are you going?", destSearch: "Search destination, e.g. Dhanmondi", destination: "Destination",
    changeDest: "Change", popular: "Popular destinations", noDest: "No destination matches your search.",
    parkingNear: "Parking near {place}", allRoads: "All roads", fromDest: "{d} from destination", fromYou: "{d} from you",
    search: "Filter by road or area", useLocation: "Use my location",
    updateLocation: "Update my location", locating: "Finding your location...", all: "All",
    sortMost: "Most free", sortCheapest: "Cheapest", sortNearest: "Nearest", saved: "Saved",
    freeOf: "free of 12", noRoads: "No roads match your search.", savedRoad: "Save road", removeSaved: "Remove saved road",
    outsideDhaka: "You appear to be outside Dhaka, so these roads are far from you.",
    locationDenied: "Location permission was denied. Allow location for this site in Chrome, then try again.",
    locationMissing: "Your location could not be found. Turn on location and try again.",
    locationSlow: "Finding your location took too long. Please try again.",
    locationUnsupported: "This browser cannot share location.",
    perHour: "/hr", free: "free", backLabel: "Back", lastUpdate: "Last update",
    available: "Available", occupied: "Occupied", fits: "Fits", tooSmall: "Too small", tightAccess: "Tight access",
    legendAvailable: "Available", legendOccupied: "Occupied", legendUnsuitable: "Not suitable for your car",
    simOn: "Sensor simulation: On", simOff: "Sensor simulation: Off", chooseBay: "Choose an available bay",
    reserveBay: "Reserve bay {bay}", bayOccupied: "This bay is occupied", bayNotSuitable: "This bay does not suit your car",
    route: "Route to this road", detailsHint: "Tap any bay to see its measurements.", bayDetails: "details",
    status: "Parking status", availLength: "Available length", availWidth: "Available width",
    entryClear: "Entry clearance", exitClear: "Exit clearance", obstacle: "Nearby obstacle",
    obstacleNone: "None", obstacleTree: "Tree (measured around it)", obstaclePole: "Electric pole (measured around it)",
    permission: "Parking permission", approved: "Approved", detectedBy: "Detected by",
    sourceCamera: "AI camera (simulated)", sourceSensor: "IoT sensor (simulated)",
    mappedBy: "Location mapped by", mappedValue: "Satellite + GIS (sample)",
    fitCheckTitle: "Fit check for your car", carSizeLabel: "Car", extraLength: "Extra length", extraWidth: "Extra width",
    accessNeeded: "Entry/exit space needed", result: "Result", resultFits: "Fits safely",
    resultSmall: "Too small for this car", resultTight: "Not enough space to enter or exit",
    checkout: "Review booking", road: "Road", bay: "Bay", rate: "Sample rate",
    duration: "Duration", hour: "hr", vehicle: "Vehicle number", vehiclePlaceholder: "Example: Dhaka Metro Ga 12-3456",
    vehicleRequired: "Enter your vehicle number.", paymentMethod: "Payment method (demo)", methodMobile: "Mobile banking",
    methodCard: "Card", methodBay: "Pay at the bay", demoPayment: "Demo only. No money is charged and no payment details are collected.",
    total: "Total", confirm: "Confirm demo booking", confirmed: "Booking confirmed", code: "Booking code",
    timeLeft: "Time left", ended: "Ended", cancelled: "Cancelled", active: "Active", demoBooking: "This is a demo booking. No real bay has been reserved.",
    directions: "Route to parking", extend: "Add 1 hr", cancel: "Cancel", viewBookings: "View my bookings",
    activeBookings: "Active bookings", history: "History", noBookings: "No bookings yet.", findParking: "Find parking",
    yourProfile: "Your profile", name: "Name", language: "Language", switchLanguage: "বাংলা", install: "Install app",
    reset: "Clear demo data", resetConfirm: "Tap again to clear all demo data", about: "About this prototype",
    aboutText: "Your location is real when you allow it. Parking spaces, measurements, rates and bookings are sample data. A real system would use satellite mapping, AI cameras and IoT sensors.",
    mapTitle: "Parking map", mapOffline: "The map needs an internet connection. You can still use the Find tab.",
    keyAvailable: "Has available parking", keyNoFit: "Free, but none fit your car", keyFull: "Full",
    mapNumbersFree: "Numbers show available spaces.", mapNumbersFit: "Numbers show available spaces that fit your car.",
    approx: "Road positions are approximate.",
    yourCar: "Your car", chooseCar: "Choose your car", changeCar: "Change car", carSearch: "Search car name",
    noCars: "No car matches your search.", customCar: "Custom car", customSize: "Enter a custom size",
    lengthM: "Length (metres)", widthM: "Width (metres)", useSize: "Use this size", removeCar: "Remove selected car",
    customError: "Enter a length from 2 to 8 m and a width from 1 to 3 m.",
    fitCount: "fit your car", needs: "Needs {size} and {access} entry/exit space",
    clearanceNote: "The fit check adds 0.3 m to length and 0.4 m to width for parking and door space, and needs 1.0 m entry and exit clearance (1.2 m for cars longer than 4.7 m). Measurements are sample data.",
    selectCarHint: "Choose your car to check which bays fit.", car: "Car", notSelected: "Not selected", fitResult: "Fit check",
    howItWorks: "How SmartPark works",
    howIntro: "The full system would combine these technologies. This prototype simulates them with sample data.",
    tech1Title: "Satellite + GIS mapping", tech1: "Maps Dhaka roads and approved parking locations, measures road boundaries and parking areas, and builds the base map.",
    tech2Title: "AI + computer vision", tech2: "Detects cars in camera images, decides whether a space is occupied or vacant, and estimates its available length and width.",
    tech3Title: "IoT sensors", tech3: "Reports whether each slot has a car, updates occupancy live and monitors entry and exit.",
    tech4Title: "Database + validation", tech4: "Checks the car size, entry and exit space and legal parking permission before showing a space.",
    workflow: "System workflow",
    flow: ["Satellite images and road map", "AI detects and measures parking spaces", "Cameras and sensors update live status", "Database checks size, access and permission", "SmartPark app shows parking and the route"],
    whySatellite: "Satellite images are not live video and can be old, so live availability needs cameras or sensors. Satellite data is used for the base map and the space layout.",
    legalNote: "Only approved parking locations are shown. An empty roadside space is not shown unless parking is permitted there.",
    preparedBy: "Prepared by"
  },
  bn: {
    brand: "স্মার্টপার্ক ঢাকা", prototype: "প্রোটোটাইপ: নমুনা ডেটা", sample: "নমুনা",
    tagline: "AI-ভিত্তিক পার্কিং শনাক্তকরণ, পরিমাপ ও নেভিগেশন",
    find: "খুঁজুন", map: "ম্যাপ", bookings: "বুকিং", profile: "প্রোফাইল",
    heading: "আপনি কোথায় যাচ্ছেন?", destSearch: "গন্তব্য খুঁজুন, যেমন ধানমন্ডি", destination: "গন্তব্য",
    changeDest: "বদলান", popular: "জনপ্রিয় গন্তব্য", noDest: "এই নামে কোনো গন্তব্য পাওয়া যায়নি।",
    parkingNear: "{place}-এর কাছে পার্কিং", allRoads: "সব রাস্তা", fromDest: "গন্তব্য থেকে {d}", fromYou: "আপনার থেকে {d}",
    search: "রাস্তা বা এলাকা দিয়ে ফিল্টার করুন", useLocation: "আমার লোকেশন ব্যবহার করুন",
    updateLocation: "লোকেশন আপডেট করুন", locating: "লোকেশন খোঁজা হচ্ছে...", all: "সব",
    sortMost: "বেশি খালি", sortCheapest: "কম ভাড়া", sortNearest: "সবচেয়ে কাছে", saved: "সেভ করা",
    freeOf: "১২টির মধ্যে খালি", noRoads: "এই নামে কোনো রাস্তা পাওয়া যায়নি।", savedRoad: "রাস্তা সেভ করুন", removeSaved: "সেভ থেকে সরান",
    outsideDhaka: "আপনি সম্ভবত ঢাকার বাইরে আছেন, তাই এই রাস্তাগুলো আপনার থেকে দূরে।",
    locationDenied: "লোকেশনের অনুমতি দেওয়া হয়নি। Chrome-এ এই সাইটের জন্য অনুমতি দিয়ে আবার চেষ্টা করুন।",
    locationMissing: "লোকেশন পাওয়া যায়নি। লোকেশন চালু করে আবার চেষ্টা করুন।",
    locationSlow: "লোকেশন পেতে বেশি সময় লাগছে। আবার চেষ্টা করুন।",
    locationUnsupported: "এই ব্রাউজারে লোকেশন সুবিধা নেই।",
    perHour: "/ঘণ্টা", free: "খালি", backLabel: "ফিরে যান", lastUpdate: "শেষ আপডেট",
    available: "খালি", occupied: "ভরা", fits: "ধরবে", tooSmall: "ছোট", tightAccess: "জায়গা কম",
    legendAvailable: "খালি", legendOccupied: "ভরা", legendUnsuitable: "আপনার গাড়ির উপযুক্ত নয়",
    simOn: "সেন্সর সিমুলেশন: চালু", simOff: "সেন্সর সিমুলেশন: বন্ধ", chooseBay: "একটি খালি বে বাছুন",
    reserveBay: "বে {bay} রিজার্ভ করুন", bayOccupied: "এই বে ভরা", bayNotSuitable: "এই বে আপনার গাড়ির উপযুক্ত নয়",
    route: "এই রাস্তার রুট দেখুন", detailsHint: "মাপ দেখতে যেকোনো বে-তে চাপুন।", bayDetails: "বিস্তারিত",
    status: "পার্কিং অবস্থা", availLength: "খালি দৈর্ঘ্য", availWidth: "খালি প্রস্থ",
    entryClear: "ঢোকার জায়গা", exitClear: "বের হওয়ার জায়গা", obstacle: "কাছাকাছি বাধা",
    obstacleNone: "নেই", obstacleTree: "গাছ (বাদ দিয়ে মাপা)", obstaclePole: "বিদ্যুতের খুঁটি (বাদ দিয়ে মাপা)",
    permission: "পার্কিং অনুমতি", approved: "অনুমোদিত", detectedBy: "শনাক্ত করেছে",
    sourceCamera: "AI ক্যামেরা (সিমুলেটেড)", sourceSensor: "IoT সেন্সর (সিমুলেটেড)",
    mappedBy: "অবস্থান ম্যাপ করেছে", mappedValue: "স্যাটেলাইট + GIS (নমুনা)",
    fitCheckTitle: "আপনার গাড়ির মাপ যাচাই", carSizeLabel: "গাড়ি", extraLength: "বাড়তি দৈর্ঘ্য", extraWidth: "বাড়তি প্রস্থ",
    accessNeeded: "ঢোকা/বের হওয়ার দরকারি জায়গা", result: "ফলাফল", resultFits: "নিরাপদে ধরবে",
    resultSmall: "এই গাড়ির জন্য ছোট", resultTight: "ঢোকা বা বের হওয়ার জায়গা কম",
    checkout: "বুকিং যাচাই করুন", road: "রাস্তা", bay: "বে", rate: "নমুনা ভাড়া",
    duration: "সময়", hour: "ঘণ্টা", vehicle: "গাড়ির নম্বর", vehiclePlaceholder: "উদাহরণ: ঢাকা মেট্রো গ ১২-৩৪৫৬",
    vehicleRequired: "গাড়ির নম্বর লিখুন।", paymentMethod: "পেমেন্টের ধরন (ডেমো)", methodMobile: "মোবাইল ব্যাংকিং",
    methodCard: "কার্ড", methodBay: "বে-তে পরিশোধ", demoPayment: "এটি শুধু ডেমো। কোনো টাকা কাটা হবে না এবং কোনো পেমেন্ট তথ্য নেওয়া হবে না।",
    total: "মোট", confirm: "ডেমো বুকিং নিশ্চিত করুন", confirmed: "বুকিং নিশ্চিত হয়েছে", code: "বুকিং কোড",
    timeLeft: "বাকি সময়", ended: "শেষ", cancelled: "বাতিল", active: "চলমান", demoBooking: "এটি ডেমো বুকিং। আসলে কোনো বে সংরক্ষণ করা হয়নি।",
    directions: "পার্কিংয়ের রুট দেখুন", extend: "১ ঘণ্টা বাড়ান", cancel: "বাতিল করুন", viewBookings: "আমার বুকিং দেখুন",
    activeBookings: "চলমান বুকিং", history: "পুরোনো বুকিং", noBookings: "এখনো কোনো বুকিং নেই।", findParking: "পার্কিং খুঁজুন",
    yourProfile: "আপনার প্রোফাইল", name: "নাম", language: "ভাষা", switchLanguage: "English", install: "অ্যাপ ইনস্টল করুন",
    reset: "ডেমো ডেটা মুছুন", resetConfirm: "সব ডেমো ডেটা মুছতে আবার চাপুন", about: "এই প্রোটোটাইপ সম্পর্কে",
    aboutText: "আপনি অনুমতি দিলে লোকেশন আসল হয়। পার্কিংয়ের জায়গা, মাপ, ভাড়া ও বুকিং নমুনা ডেটা। আসল সিস্টেমে স্যাটেলাইট ম্যাপিং, AI ক্যামেরা ও IoT সেন্সর ব্যবহার হবে।",
    mapTitle: "পার্কিং ম্যাপ", mapOffline: "ম্যাপের জন্য ইন্টারনেট লাগবে। তবে খুঁজুন ট্যাব ব্যবহার করতে পারবেন।",
    keyAvailable: "খালি পার্কিং আছে", keyNoFit: "খালি আছে, কিন্তু আপনার গাড়ি ধরবে না", keyFull: "ভরা",
    mapNumbersFree: "সংখ্যা দিয়ে খালি জায়গা দেখানো হয়েছে।", mapNumbersFit: "সংখ্যা দিয়ে আপনার গাড়ি ধরবে এমন খালি জায়গা দেখানো হয়েছে।",
    approx: "রাস্তার অবস্থান আনুমানিক।",
    yourCar: "আপনার গাড়ি", chooseCar: "গাড়ি বাছুন", changeCar: "গাড়ি বদলান", carSearch: "গাড়ির নাম খুঁজুন",
    noCars: "এই নামে কোনো গাড়ি পাওয়া যায়নি।", customCar: "নিজের মাপের গাড়ি", customSize: "নিজের গাড়ির মাপ দিন",
    lengthM: "দৈর্ঘ্য (মিটার)", widthM: "প্রস্থ (মিটার)", useSize: "এই মাপ ব্যবহার করুন", removeCar: "বাছাই করা গাড়ি সরান",
    customError: "দৈর্ঘ্য ২ থেকে ৮ মিটার এবং প্রস্থ ১ থেকে ৩ মিটারের মধ্যে দিন।",
    fitCount: "টিতে আপনার গাড়ি ধরবে", needs: "দরকার {size} এবং ঢোকা/বের হওয়ার জন্য {access}",
    clearanceNote: "হিসাবে পার্কিং ও দরজা খোলার জন্য দৈর্ঘ্যে ০.৩ মিটার ও প্রস্থে ০.৪ মিটার যোগ করা হয়, আর ঢোকা ও বের হওয়ার জন্য ১.০ মিটার জায়গা লাগে (৪.৭ মিটারের বেশি লম্বা গাড়ির জন্য ১.২ মিটার)। সব মাপ নমুনা ডেটা।",
    selectCarHint: "কোন বে-তে ধরবে দেখতে আপনার গাড়ি বাছুন।", car: "গাড়ি", notSelected: "বাছাই করা হয়নি", fitResult: "মাপ যাচাই",
    howItWorks: "স্মার্টপার্ক কীভাবে কাজ করে",
    howIntro: "পুরো সিস্টেমে এই প্রযুক্তিগুলো একসঙ্গে কাজ করবে। এই প্রোটোটাইপে নমুনা ডেটা দিয়ে সেগুলো সিমুলেট করা হয়েছে।",
    tech1Title: "স্যাটেলাইট + GIS ম্যাপিং", tech1: "ঢাকার রাস্তা ও অনুমোদিত পার্কিংয়ের জায়গা ম্যাপ করে, রাস্তার সীমানা ও পার্কিং এলাকা মাপে, এবং বেস ম্যাপ তৈরি করে।",
    tech2Title: "AI + কম্পিউটার ভিশন", tech2: "ক্যামেরার ছবি থেকে গাড়ি শনাক্ত করে, জায়গা খালি না ভরা তা নির্ণয় করে, এবং খালি দৈর্ঘ্য-প্রস্থ অনুমান করে।",
    tech3Title: "IoT সেন্সর", tech3: "প্রতিটি স্লটে গাড়ি আছে কি না জানায়, লাইভ অবস্থা আপডেট করে, এবং ঢোকা-বের হওয়া পর্যবেক্ষণ করে।",
    tech4Title: "ডেটাবেস + যাচাই", tech4: "জায়গা দেখানোর আগে গাড়ির মাপ, ঢোকা-বের হওয়ার জায়গা ও পার্কিংয়ের আইনি অনুমতি যাচাই করে।",
    workflow: "সিস্টেমের ধাপ",
    flow: ["স্যাটেলাইট ছবি ও রোড ম্যাপ", "AI পার্কিংয়ের জায়গা শনাক্ত ও পরিমাপ করে", "ক্যামেরা ও সেন্সর লাইভ অবস্থা আপডেট করে", "ডেটাবেস মাপ, প্রবেশপথ ও অনুমতি যাচাই করে", "স্মার্টপার্ক অ্যাপ পার্কিং ও রুট দেখায়"],
    whySatellite: "স্যাটেলাইট ছবি লাইভ ভিডিও নয়, অনেক সময় পুরোনো হয়। তাই লাইভ খালি জায়গা জানতে ক্যামেরা বা সেন্সর লাগে। স্যাটেলাইট ব্যবহার হয় বেস ম্যাপ ও জায়গার লেআউটের জন্য।",
    legalNote: "শুধু অনুমোদিত পার্কিংয়ের জায়গা দেখানো হয়। রাস্তার পাশে খালি জায়গা থাকলেও অনুমতি না থাকলে দেখানো হয় না।",
    preparedBy: "প্রস্তুত করেছেন"
  }
};

const ICONS = {
  find: '<path d="M21 21l-4.3-4.3"></path><circle cx="11" cy="11" r="7"></circle>',
  map: '<path d="M12 21s7-6.2 7-11a7 7 0 10-14 0c0 4.8 7 11 7 11z"></path><circle cx="12" cy="10" r="2.5"></circle>',
  bookings: '<rect x="4" y="5" width="16" height="16" rx="2"></rect><path d="M4 10h16M8 3v4M16 3v4"></path>',
  profile: '<circle cx="12" cy="8" r="4"></circle><path d="M4 21c1.5-4 4.5-6 8-6s6.5 2 8 6"></path>'
};

const STATUS_CLASS = {
  available: "available", fits: "available", occupied: "occupied", tooSmall: "unsuitable", tightAccess: "unsuitable"
};

const defaultStore = () => ({
  lang: "en",
  profile: { name: "", vehicle: "" },
  car: null,
  bookings: [],
  saved: []
});

function loadStore() {
  try {
    const raw = localStorage.getItem(STORE_KEY);
    return raw ? { ...defaultStore(), ...JSON.parse(raw) } : defaultStore();
  } catch {
    return defaultStore();
  }
}

const store = loadStore();

function saveStore() {
  try {
    localStorage.setItem(STORE_KEY, JSON.stringify(store));
  } catch {
    // The app still works for this visit if the browser blocks storage.
  }
}

const state = {
  tab: "find",
  view: "tab",
  query: "",
  destQuery: "",
  destinationId: null,
  areaFilter: "all",
  mapArea: "gulshan",
  sort: "most",
  savedOnly: false,
  roadId: null,
  selected: null,
  overrides: {},
  updatedAt: {},
  simulation: true,
  simulationStep: 0,
  location: null,
  locationStatus: "idle",
  locationError: "",
  checkout: null,
  ticketId: null,
  resetArmed: false,
  carQuery: "",
  carReturn: "tab",
  customLength: "",
  customWidth: "",
  customError: ""
};

const app = document.getElementById("app");
const tabs = document.getElementById("tabs");
let installPrompt = null;
let leafletMap = null;

const t = (key) => TEXT[store.lang][key];
const fill = (key, values) => t(key).replace(/\{(\w+)\}/g, (_, name) => values[name]);
const named = (item) => item[store.lang];

function number(value) {
  const text = String(value);
  if (store.lang !== "bn") return text;
  return text.replace(/\d/g, (digit) => "০১২৩৪৫৬৭৮৯"[Number(digit)]);
}

function esc(value) {
  return String(value).replace(/[&<>"']/g, (char) => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
  })[char]);
}

const ROADS = AREAS.flatMap((area) => area.roads.map((road) => ({ road, area })));
const ROAD_INDEX = new Map(ROADS.map((entry, index) => [entry.road.id, index]));
const allRoads = () => ROADS.slice();
const findRoad = (id) => ROADS.find((entry) => entry.road.id === id);
const findArea = (id) => AREAS.find((area) => area.id === id);
const destination = () => DESTINATIONS.find((item) => item.id === state.destinationId) || null;
const bayName = (index) => `${index % 2 === 0 ? "A" : "B"}${Math.floor(index / 2) + 1}`;
const money = (value) => `${store.lang === "bn" ? "৳" : "Tk"} ${number(value)}`;
const metres = (mm) => number((Math.round(mm / 10) / 100).toFixed(2));
const metresShort = (mm) => number((mm / 1000).toFixed(1));
const signedMetres = (mm) => `${mm >= 0 ? "+" : "−"}${metres(Math.abs(mm))} m`;
const carName = (car) => car.custom ? t("customCar") : car.name;
const carSize = (car) => `${metres(car.length)} × ${metres(car.width)} m`;
const clock = (time) => number(new Date(time).toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" }));

function refreshBookings() {
  const now = Date.now();
  let changed = false;
  store.bookings.forEach((booking) => {
    if (booking.status === "active" && booking.endsAt <= now) {
      booking.status = "ended";
      changed = true;
    }
  });
  if (changed) saveStore();
}

function bookingFor(roadId, index) {
  return store.bookings.find(
    (booking) => booking.status === "active" && booking.roadId === roadId && booking.bayIndex === index
  );
}

function isTaken(road, index) {
  if (bookingFor(road.id, index)) return true;
  const key = `${road.id}:${index}`;
  return key in state.overrides ? state.overrides[key] : road.pattern[index] === "T";
}

function freeCount(road) {
  let free = 0;
  for (let index = 0; index < BAY_COUNT; index += 1) {
    if (!isTaken(road, index)) free += 1;
  }
  return free;
}

function bayInfo(road, index) {
  const offset = ROAD_INDEX.get(road.id);
  const type = BAY_TYPES[BAY_LAYOUT[(index + offset * 3) % BAY_COUNT]];
  return {
    width: type.width,
    length: type.length,
    entry: CLEARANCES[(index + offset) % BAY_COUNT],
    exit: CLEARANCES[(index + offset + 5) % BAY_COUNT],
    obstacle: OBSTACLES[(index + offset * 5) % BAY_COUNT],
    source: (index + offset) % 2 === 0 ? "camera" : "sensor"
  };
}

const accessNeeded = (car) => car.length > LONG_CAR_MM ? LONG_CAR_ACCESS_MM : ACCESS_MM;
const carNeedsLength = (car) => car.length + LENGTH_CLEARANCE_MM;
const carNeedsWidth = (car) => car.width + WIDTH_CLEARANCE_MM;

function fitCheck(car, bay) {
  const access = accessNeeded(car);
  const sizeOk = carNeedsLength(car) <= bay.length && carNeedsWidth(car) <= bay.width;
  const accessOk = bay.entry >= access && bay.exit >= access;
  return {
    access,
    sizeOk,
    accessOk,
    ok: sizeOk && accessOk,
    extraLength: bay.length - car.length,
    extraWidth: bay.width - car.width
  };
}

function bayState(road, index) {
  const info = bayInfo(road, index);
  const taken = isTaken(road, index);
  const fit = store.car ? fitCheck(store.car, info) : null;
  let status = "available";
  if (taken) status = "occupied";
  else if (fit && !fit.sizeOk) status = "tooSmall";
  else if (fit && !fit.accessOk) status = "tightAccess";
  else if (fit) status = "fits";
  return { info, taken, fit, status, bookable: !taken && (!fit || fit.ok) };
}

function fitCount(road) {
  let fitting = 0;
  for (let index = 0; index < BAY_COUNT; index += 1) {
    if (bayState(road, index).bookable) fitting += 1;
  }
  return fitting;
}

const availableCount = (road) => store.car ? fitCount(road) : freeCount(road);

function bayUpdated(road, index) {
  const key = `${road.id}:${index}`;
  if (state.updatedAt[key]) return state.updatedAt[key];
  const minutes = ((index * 7 + ROAD_INDEX.get(road.id) * 3) % 9) + 1;
  return LOADED_AT - minutes * 60000;
}

function roadUpdated(road) {
  let latest = 0;
  for (let index = 0; index < BAY_COUNT; index += 1) latest = Math.max(latest, bayUpdated(road, index));
  return latest;
}

function distanceKm(from, to) {
  const radians = (degrees) => degrees * Math.PI / 180;
  const latDelta = radians(to.lat - from.lat);
  const lngDelta = radians(to.lng - from.lng);
  const a = Math.sin(latDelta / 2) ** 2
    + Math.cos(radians(from.lat)) * Math.cos(radians(to.lat)) * Math.sin(lngDelta / 2) ** 2;
  return 6371 * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

function formatDistance(km) {
  if (km < 1) return `${number(Math.round(km * 1000))} ${store.lang === "bn" ? "মিটার" : "m"}`;
  if (km < 100) return `${number(km.toFixed(1))} ${store.lang === "bn" ? "কিমি" : "km"}`;
  return `${number(Math.round(km).toLocaleString("en"))} ${store.lang === "bn" ? "কিমি" : "km"}`;
}

const referencePoint = () => destination() || state.location;

function nearestRoadsTo(point) {
  return allRoads().sort((a, b) => distanceKm(point, a.road) - distanceKm(point, b.road));
}

function directionsUrl(roadId) {
  const { road, area } = findRoad(roadId);
  const place = encodeURIComponent(`${road.en}, ${area.en}, Dhaka`);
  return `https://www.google.com/maps/dir/?api=1&destination=${place}&travelmode=driving`;
}

function backButton(action) {
  return `
    <button class="back" data-action="${action}" aria-label="${t("backLabel")}">
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M15 5l-7 7 7 7"></path></svg>
    </button>
  `;
}

const renderCredit = () => `<p class="credit">${t("preparedBy")}: ${PREPARED_BY.join(", ")}</p>`;

function renderCarButton() {
  const car = store.car;
  return `
    <button class="car-button" data-action="openCar">
      <span class="road-text">
        <span class="road-meta">${t("yourCar")}</span>
        <span class="road-name">${car ? esc(carName(car)) : t("chooseCar")}</span>
        ${car ? `<span class="road-meta">${carSize(car)}</span>` : ""}
      </span>
      <span class="car-action">${car ? t("changeCar") : t("chooseCar")}</span>
    </button>
  `;
}

function renderCarList() {
  const query = state.carQuery.trim().toLowerCase();
  const cars = CARS.filter((car) => car.name.toLowerCase().includes(query));
  if (!cars.length) return `<p class="note">${t("noCars")}</p>`;
  return cars.map((car) => {
    const selected = store.car && store.car.id === car.id;
    return `
      <button class="car-option" data-action="pickCar" data-id="${car.id}" aria-pressed="${Boolean(selected)}">
        <span class="road-name">${car.name}</span>
        <span class="road-meta">${carSize(car)}</span>
      </button>
    `;
  }).join("");
}

function renderCar() {
  return `
    <div class="subheader">
      ${backButton("backFromCar")}
      <div class="subheader-title"><h2>${t("chooseCar")}</h2></div>
    </div>
    <input class="search" id="car-search" type="search" value="${esc(state.carQuery)}"
      placeholder="${t("carSearch")}" aria-label="${t("carSearch")}">
    <section class="section" id="car-list">${renderCarList()}</section>
    <section class="summary">
      <h3>${t("customSize")}</h3>
      <div class="custom-grid">
        <div class="field-group">
          <label for="custom-length">${t("lengthM")}</label>
          <input class="field" id="custom-length" type="number" inputmode="decimal" min="2" max="8" step="0.01" value="${esc(state.customLength)}">
        </div>
        <div class="field-group">
          <label for="custom-width">${t("widthM")}</label>
          <input class="field" id="custom-width" type="number" inputmode="decimal" min="1" max="3" step="0.01" value="${esc(state.customWidth)}">
        </div>
      </div>
      ${state.customError ? `<p class="error" role="alert">${state.customError}</p>` : ""}
      <button class="secondary" data-action="useCustom">${t("useSize")}</button>
    </section>
    ${store.car ? `<button class="secondary danger" data-action="clearCar">${t("removeCar")}</button>` : ""}
    <p class="note">${t("clearanceNote")}</p>
  `;
}

function renderDestList() {
  const query = state.destQuery.trim().toLowerCase();
  if (!query) {
    return `
      <div class="label">${t("popular")}</div>
      <div class="chips" role="group" aria-label="${t("popular")}">
        ${DESTINATIONS.map((item) => `<button class="chip" data-action="pickDest" data-id="${item.id}">${named(item)}</button>`).join("")}
      </div>
    `;
  }
  const matches = DESTINATIONS
    .filter((item) => [item.en, item.bn].some((value) => value.toLowerCase().includes(query)))
    .slice(0, 6);
  if (!matches.length) return `<p class="note">${t("noDest")}</p>`;
  return matches.map((item) => `
    <button class="dest-option" data-action="pickDest" data-id="${item.id}">
      <span class="road-name">${named(item)}</span>
      <span class="road-meta">${named(findArea(item.area))}</span>
    </button>
  `).join("");
}

function renderDestination() {
  const dest = destination();
  if (dest) {
    return `
      <div class="dest-card">
        <span class="road-text">
          <span class="road-meta">${t("destination")}</span>
          <span class="road-name">${named(dest)}</span>
        </span>
        <button class="chip" data-action="clearDest">${t("changeDest")}</button>
      </div>
    `;
  }
  return `
    <section class="section">
      <input class="search" id="dest-search" type="search" value="${esc(state.destQuery)}"
        placeholder="${t("destSearch")}" aria-label="${t("destSearch")}">
      <div class="section" id="dest-list">${renderDestList()}</div>
    </section>
  `;
}

function visibleRoads() {
  const query = state.query.trim().toLowerCase();
  const point = referencePoint();
  const entries = allRoads()
    .filter(({ area }) => state.areaFilter === "all" || area.id === state.areaFilter)
    .filter(({ road }) => !state.savedOnly || store.saved.includes(road.id))
    .filter(({ road, area }) => {
      if (!query) return true;
      return [road.en, road.bn, area.en, area.bn].some((value) => value.toLowerCase().includes(query));
    });
  const sorters = {
    most: (a, b) => availableCount(b.road) - availableCount(a.road),
    cheapest: (a, b) => a.road.rate - b.road.rate,
    nearest: (a, b) => distanceKm(point, a.road) - distanceKm(point, b.road)
  };
  return entries.sort(sorters[state.sort === "nearest" && !point ? "most" : state.sort]);
}

function renderRoadCards() {
  const entries = visibleRoads();
  if (!entries.length) return `<p class="note">${t("noRoads")}</p>`;
  const dest = destination();
  return entries.map(({ road, area }) => {
    const saved = store.saved.includes(road.id);
    let distance = "";
    if (dest) distance = ` · ${fill("fromDest", { d: formatDistance(distanceKm(dest, road)) })}`;
    else if (state.location) distance = ` · ${fill("fromYou", { d: formatDistance(distanceKm(state.location, road)) })}`;
    return `
      <div class="road-card">
        <button class="road-main" data-action="openRoad" data-id="${road.id}">
          <span class="road-text">
            <span class="road-name">${named(road)}</span>
            <span class="road-meta">${named(area)}${distance}</span>
            <span class="road-meta">${money(road.rate)}${t("perHour")} (${t("sample")})</span>
            ${store.car ? `<span class="road-meta fit-meta">${number(fitCount(road))} ${t("fitCount")}</span>` : ""}
            <span class="road-meta">${t("lastUpdate")} ${clock(roadUpdated(road))}</span>
          </span>
          <span class="road-free"><b>${number(freeCount(road))}</b><span>${t("freeOf")}</span></span>
        </button>
        <button class="star" data-action="toggleSaved" data-id="${road.id}" aria-pressed="${saved}"
          aria-label="${saved ? t("removeSaved") : t("savedRoad")}">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round" aria-hidden="true"><path d="M12 3.5l2.7 5.5 6 .9-4.3 4.2 1 6-5.4-2.8-5.4 2.8 1-6-4.3-4.2 6-.9z"></path></svg>
        </button>
      </div>
    `;
  }).join("");
}

function renderFind() {
  const dest = destination();
  const loading = state.locationStatus === "loading";
  const locationLabel = loading ? t("locating") : state.location ? t("updateLocation") : t("useLocation");
  const nearestRoad = state.location
    ? Math.min(...allRoads().map(({ road }) => distanceKm(state.location, road)))
    : 0;
  const areaChips = [{ id: "all", label: t("all") }]
    .concat(AREAS.map((area) => ({ id: area.id, label: named(area) })))
    .map((item) => `
      <button class="chip" data-action="areaFilter" data-id="${item.id}" aria-pressed="${state.areaFilter === item.id}">${item.label}</button>
    `).join("");
  const sortChips = [["most", "sortMost"], ["cheapest", "sortCheapest"], ["nearest", "sortNearest"]]
    .map(([id, label]) => `
      <button class="chip" data-action="sort" data-id="${id}" aria-pressed="${state.sort === id}">${t(label)}</button>
    `).join("");
  return `
    <div class="topbar">
      <span class="brand">${t("brand")}</span>
      <span class="badge">${t("prototype")}</span>
    </div>
    <p class="tagline">${t("tagline")}</p>
    <h1>${t("heading")}</h1>
    ${renderDestination()}
    ${renderCarButton()}
    <section class="section">
      <button class="secondary" data-action="locate" ${loading ? "disabled" : ""}>${locationLabel}</button>
      ${state.locationError ? `<p class="error" role="alert">${state.locationError}</p>` : ""}
      ${state.location && nearestRoad > 50 ? `<p class="note">${t("outsideDhaka")}</p>` : ""}
    </section>
    <input class="search" id="search" type="search" value="${esc(state.query)}"
      placeholder="${t("search")}" aria-label="${t("search")}">
    <div class="chips" role="group" aria-label="${t("all")}">${areaChips}</div>
    <div class="chips" role="group" aria-label="${t("sortMost")}">
      ${sortChips}
      <button class="chip" data-action="savedOnly" aria-pressed="${state.savedOnly}">${t("saved")}</button>
    </div>
    <h2 class="list-title">${dest ? fill("parkingNear", { place: named(dest) }) : t("allRoads")}</h2>
    <section class="section" id="road-list">${renderRoadCards()}</section>
    ${installPrompt ? `<button class="secondary" data-action="install">${t("install")}</button>` : ""}
    <button class="secondary" data-action="openHow">${t("howItWorks")}</button>
    ${renderCredit()}
  `;
}

function renderMapTab() {
  const dest = destination();
  const chips = (dest ? [{ id: "dest", label: t("destination") }] : [])
    .concat(AREAS.map((area) => ({ id: area.id, label: named(area) })));
  return `
    <div class="topbar">
      <h1>${t("mapTitle")}</h1>
      <span class="badge">${t("sample")}</span>
    </div>
    <div class="chips" role="group" aria-label="${t("mapTitle")}">
      ${chips.map((item) => `
        <button class="chip" data-action="mapArea" data-id="${item.id}" aria-pressed="${state.mapArea === item.id}">${item.label}</button>
      `).join("")}
    </div>
    <div id="map" role="region" aria-label="${t("mapTitle")}"></div>
    <p class="error" id="map-offline" role="status" hidden>${t("mapOffline")}</p>
    <div class="key">
      <span><i class="swatch available"></i>${t("keyAvailable")}</span>
      ${store.car ? `<span><i class="swatch unsuitable"></i>${t("keyNoFit")}</span>` : ""}
      <span><i class="swatch occupied"></i>${t("keyFull")}</span>
      ${dest ? `<span><i class="swatch dest"></i>${t("destination")}</span>` : ""}
    </div>
    <p class="note">${store.car ? t("mapNumbersFit") : t("mapNumbersFree")} ${t("approx")}</p>
    <button class="secondary" data-action="locate">${state.location ? t("updateLocation") : t("useLocation")}</button>
    ${state.locationError ? `<p class="error" role="alert">${state.locationError}</p>` : ""}
  `;
}

function mountMap() {
  if (leafletMap) {
    leafletMap.remove();
    leafletMap = null;
  }
  const element = document.getElementById("map");
  if (!element || !window.L) return;
  leafletMap = L.map(element, {
    zoomControl: true,
    zoomAnimation: false,
    fadeAnimation: false,
    markerZoomAnimation: false
  }).setView([23.79, 90.395], 12);
  const tiles = L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
    maxZoom: 19,
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
  }).addTo(leafletMap);
  tiles.on("tileerror", () => {
    const notice = document.getElementById("map-offline");
    if (notice) notice.hidden = false;
  });
  allRoads().forEach(({ road }) => {
    const free = freeCount(road);
    const shown = availableCount(road);
    const level = free === 0 ? "none" : shown === 0 ? "low" : "";
    const icon = L.divIcon({ className: `pin ${level}`, html: number(shown), iconSize: [38, 38], iconAnchor: [19, 19] });
    L.marker([road.lat, road.lng], { icon, title: named(road), alt: named(road) })
      .addTo(leafletMap)
      .on("click", () => openRoad(road.id));
  });
  const dest = destination();
  if (dest) {
    const icon = L.divIcon({
      className: "dest-pin",
      html: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M6 21V4h11l-2.5 4 2.5 4H6"></path></svg>',
      iconSize: [34, 34],
      iconAnchor: [17, 44]
    });
    L.marker([dest.lat, dest.lng], { icon, title: named(dest), alt: named(dest), keyboard: false, zIndexOffset: -1000 }).addTo(leafletMap);
  }
  if (state.location) {
    const icon = L.divIcon({ className: "me-pin", iconSize: [18, 18], iconAnchor: [9, 9] });
    L.marker([state.location.lat, state.location.lng], { icon, keyboard: false, interactive: false }).addTo(leafletMap);
  }
  let points;
  if (state.mapArea === "dest" && dest) {
    points = [[dest.lat, dest.lng]].concat(nearestRoadsTo(dest).slice(0, 3).map(({ road }) => [road.lat, road.lng]));
  } else {
    points = (findArea(state.mapArea) || AREAS[0]).roads.map((road) => [road.lat, road.lng]);
  }
  leafletMap.fitBounds(points, { padding: [50, 50], maxZoom: 15, animate: false });
}

function renderBay(road, index) {
  const bay = bayState(road, index);
  const selected = state.selected === index;
  const size = `${metresShort(bay.info.width)} × ${metresShort(bay.info.length)} m`;
  const label = t(bay.status);
  return `
    <button class="bay ${STATUS_CLASS[bay.status]} ${selected ? "selected" : ""}" data-action="pickBay" data-index="${index}"
      aria-pressed="${selected}" aria-label="${t("bay")} ${bayName(index)}, ${label}, ${size}">
      <b>${bayName(index)}</b><span>${label}</span><small>${size}</small>
    </button>
  `;
}

function renderBayDetails(road) {
  if (state.selected === null) return `<p class="note">${t("detailsHint")}</p>`;
  const bay = bayState(road, state.selected);
  const row = (label, value) => `<div class="summary-row"><span>${label}</span><span>${value}</span></div>`;
  const obstacles = { none: t("obstacleNone"), tree: t("obstacleTree"), pole: t("obstaclePole") };
  let fitRows = "";
  if (bay.fit) {
    const resultKey = bay.fit.ok ? "resultFits" : !bay.fit.sizeOk ? "resultSmall" : "resultTight";
    fitRows = `
      <h3>${t("fitCheckTitle")}</h3>
      ${row(t("carSizeLabel"), `${esc(carName(store.car))}, ${carSize(store.car)}`)}
      ${row(t("extraLength"), signedMetres(bay.fit.extraLength))}
      ${row(t("extraWidth"), signedMetres(bay.fit.extraWidth))}
      ${row(t("accessNeeded"), `${metresShort(bay.fit.access)} m`)}
      <div class="summary-row total"><span>${t("result")}</span><span class="result ${bay.fit.ok ? "ok" : "bad"}">${t(resultKey)}</span></div>
    `;
  }
  return `
    <section class="summary bay-details" aria-live="polite">
      <h3>${t("bay")} ${bayName(state.selected)}: ${t("bayDetails")}</h3>
      ${row(t("status"), `<i class="dot ${bay.taken ? "occupied" : "available"}"></i>${bay.taken ? t("occupied") : t("available")}`)}
      ${row(t("availLength"), `${metresShort(bay.info.length)} m`)}
      ${row(t("availWidth"), `${metresShort(bay.info.width)} m`)}
      ${row(t("entryClear"), `${metresShort(bay.info.entry)} m`)}
      ${row(t("exitClear"), `${metresShort(bay.info.exit)} m`)}
      ${row(t("obstacle"), obstacles[bay.info.obstacle])}
      ${row(t("permission"), t("approved"))}
      ${row(t("detectedBy"), t(bay.info.source === "camera" ? "sourceCamera" : "sourceSensor"))}
      ${row(t("mappedBy"), t("mappedValue"))}
      ${row(t("lastUpdate"), clock(bayUpdated(road, state.selected)))}
      ${fitRows}
    </section>
  `;
}

function renderRoad() {
  const { road, area } = findRoad(state.roadId);
  const rows = Array.from({ length: BAY_COUNT / 2 }, (_, row) => `
    <div class="bay-row">
      ${renderBay(road, row * 2)}
      <div class="lane" aria-hidden="true"></div>
      ${renderBay(road, row * 2 + 1)}
    </div>
  `).join("");
  const selected = state.selected === null ? null : bayState(road, state.selected);
  let nextLabel = t("chooseBay");
  if (selected && selected.taken) nextLabel = t("bayOccupied");
  else if (selected && !selected.bookable) nextLabel = t("bayNotSuitable");
  else if (selected) nextLabel = fill("reserveBay", { bay: bayName(state.selected) });
  const car = store.car;
  return `
    <div class="subheader">
      ${backButton("backToTab")}
      <div class="subheader-title">
        <h2>${named(road)}</h2>
        <div class="label" role="status">${named(area)}, ${number(freeCount(road))} ${t("free")} · ${money(road.rate)}${t("perHour")}</div>
        <div class="road-meta">${t("lastUpdate")} ${clock(roadUpdated(road))}</div>
      </div>
      <span class="badge">${t("sample")}</span>
    </div>
    ${car ? `
      <button class="fit-banner" data-action="openCar">
        <b>${esc(carName(car))}: ${number(fitCount(road))} ${t("fitCount")}</b>
        <span>${fill("needs", { size: `${metres(carNeedsWidth(car))} × ${metres(carNeedsLength(car))} m`, access: `${metresShort(accessNeeded(car))} m` })}</span>
      </button>
    ` : `<button class="fit-banner" data-action="openCar"><b>${t("chooseCar")}</b><span>${t("selectCarHint")}</span></button>`}
    <div class="key">
      <span><i class="swatch available"></i>${t("legendAvailable")}</span>
      <span><i class="swatch occupied"></i>${t("legendOccupied")}</span>
      ${car ? `<span><i class="swatch unsuitable"></i>${t("legendUnsuitable")}</span>` : ""}
    </div>
    <div class="bays">${rows}</div>
    ${renderBayDetails(road)}
    <div class="actions">
      <button class="secondary" data-action="toggleSimulation" aria-pressed="${state.simulation}">${state.simulation ? t("simOn") : t("simOff")}</button>
      <a class="secondary" href="${directionsUrl(road.id)}" target="_blank" rel="noopener">${t("route")}</a>
      <button class="primary" data-action="startCheckout" ${selected && selected.bookable ? "" : "disabled"}>${nextLabel}</button>
    </div>
  `;
}

function renderCheckout() {
  const checkout = state.checkout;
  const { road, area } = findRoad(checkout.roadId);
  const hours = [1, 2, 3, 4].map((value) => `
    <button class="chip" data-action="setHours" data-value="${value}" aria-pressed="${checkout.hours === value}">${number(value)} ${t("hour")}</button>
  `).join("");
  const methods = [["mobile", "methodMobile"], ["card", "methodCard"], ["bay", "methodBay"]].map(([id, label]) => `
    <button class="chip" data-action="setMethod" data-value="${id}" aria-pressed="${checkout.method === id}">${t(label)}</button>
  `).join("");
  return `
    <div class="subheader">
      ${backButton("backToRoad")}
      <div class="subheader-title"><h2>${t("checkout")}</h2></div>
      <span class="badge">${t("sample")}</span>
    </div>
    <section class="summary">
      <div class="summary-row"><span>${t("road")}</span><span>${named(road)}, ${named(area)}</span></div>
      <div class="summary-row"><span>${t("bay")}</span><span>${bayName(checkout.bayIndex)}</span></div>
      <div class="summary-row"><span>${t("car")}</span><span>${store.car ? `${esc(carName(store.car))} (${carSize(store.car)})` : t("notSelected")}</span></div>
      ${store.car ? `<div class="summary-row"><span>${t("fitResult")}</span><span>${t("resultFits")}</span></div>` : ""}
      <div class="summary-row"><span>${t("rate")}</span><span>${money(road.rate)}${t("perHour")}</span></div>
      <div class="summary-row total"><span>${t("total")}</span><span id="total">${money(road.rate * checkout.hours)}</span></div>
    </section>
    <section class="section">
      <div class="label">${t("duration")}</div>
      <div class="options">${hours}</div>
    </section>
    <div class="field-group">
      <label for="vehicle">${t("vehicle")}</label>
      <input class="field" id="vehicle" autocomplete="off" value="${esc(checkout.vehicle)}" placeholder="${t("vehiclePlaceholder")}">
      ${checkout.error ? `<p class="error" role="alert">${checkout.error}</p>` : ""}
    </div>
    <section class="section">
      <div class="label">${t("paymentMethod")}</div>
      <div class="methods">${methods}</div>
      <p class="note">${t("demoPayment")}</p>
    </section>
    <button class="primary" data-action="confirmBooking">${t("confirm")}</button>
  `;
}

function countdownText(booking) {
  const seconds = Math.max(0, Math.floor((booking.endsAt - Date.now()) / 1000));
  const hours = String(Math.floor(seconds / 3600)).padStart(2, "0");
  const minutes = String(Math.floor((seconds % 3600) / 60)).padStart(2, "0");
  const rest = String(seconds % 60).padStart(2, "0");
  return number(`${hours}:${minutes}:${rest}`);
}

function renderTicket() {
  const booking = store.bookings.find((item) => item.id === state.ticketId);
  const { road, area } = findRoad(booking.roadId);
  return `
    <div class="ticket-check">
      <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12.5l4.5 4.5L19 7.5"></path></svg>
    </div>
    <h1>${t("confirmed")}</h1>
    <section class="summary">
      <div class="summary-row"><span>${t("code")}</span><span>${booking.code}</span></div>
      <div class="summary-row"><span>${t("road")}</span><span>${named(road)}, ${named(area)}</span></div>
      <div class="summary-row"><span>${t("bay")}</span><span>${bayName(booking.bayIndex)}</span></div>
      <div class="summary-row"><span>${t("vehicle")}</span><span>${esc(booking.vehicle)}</span></div>
      ${booking.carLabel ? `<div class="summary-row"><span>${t("car")}</span><span>${esc(booking.carLabel)}</span></div>` : ""}
      <div class="summary-row total"><span>${t("total")}</span><span>${money(booking.cost)}</span></div>
    </section>
    <div class="section">
      <div class="label">${t("timeLeft")}</div>
      <div class="countdown" data-countdown="${booking.id}">${countdownText(booking)}</div>
    </div>
    <p class="note">${t("demoBooking")}</p>
    <div class="actions">
      <a class="primary" href="${directionsUrl(booking.roadId)}" target="_blank" rel="noopener">${t("directions")}</a>
      <button class="secondary" data-action="viewBookings">${t("viewBookings")}</button>
    </div>
  `;
}

function renderBookingCard(booking) {
  const { road, area } = findRoad(booking.roadId);
  const active = booking.status === "active";
  const statusLabel = { active: t("active"), ended: t("ended"), cancelled: t("cancelled") }[booking.status];
  return `
    <article class="booking-card">
      <div class="row">
        <h3>${named(road)}</h3>
        <span class="status ${active ? "active" : ""}">${statusLabel}</span>
      </div>
      <div class="road-meta">${named(area)} · ${t("bay")} ${bayName(booking.bayIndex)} · ${booking.code}</div>
      <div class="road-meta">${esc(booking.vehicle)} · ${money(booking.cost)}</div>
      ${active ? `
        <div class="countdown" data-countdown="${booking.id}">${countdownText(booking)}</div>
        <a class="primary" href="${directionsUrl(booking.roadId)}" target="_blank" rel="noopener">${t("directions")}</a>
        <div class="buttons">
          <button class="secondary" data-action="extendBooking" data-id="${booking.id}">${t("extend")}</button>
          <button class="secondary danger" data-action="cancelBooking" data-id="${booking.id}">${t("cancel")}</button>
        </div>
      ` : ""}
    </article>
  `;
}

function renderBookings() {
  const active = store.bookings.filter((booking) => booking.status === "active");
  const past = store.bookings.filter((booking) => booking.status !== "active");
  return `
    <div class="topbar">
      <h1>${t("bookings")}</h1>
      <span class="badge">${t("sample")}</span>
    </div>
    ${store.bookings.length ? "" : `
      <p class="note">${t("noBookings")}</p>
      <button class="primary" data-action="goFind">${t("findParking")}</button>
    `}
    ${active.length ? `<section class="section"><div class="label">${t("activeBookings")}</div>${active.map(renderBookingCard).join("")}</section>` : ""}
    ${past.length ? `<section class="section"><div class="label">${t("history")}</div>${past.map(renderBookingCard).join("")}</section>` : ""}
  `;
}

function renderProfile() {
  return `
    <h1>${t("yourProfile")}</h1>
    <div class="field-group">
      <label for="profile-name">${t("name")}</label>
      <input class="field" id="profile-name" data-profile="name" autocomplete="name" value="${esc(store.profile.name)}">
    </div>
    <div class="field-group">
      <label for="profile-vehicle">${t("vehicle")}</label>
      <input class="field" id="profile-vehicle" data-profile="vehicle" autocomplete="off"
        value="${esc(store.profile.vehicle)}" placeholder="${t("vehiclePlaceholder")}">
    </div>
    ${renderCarButton()}
    <section class="section">
      <div class="label">${t("language")}</div>
      <button class="secondary" data-action="toggleLanguage">${t("switchLanguage")}</button>
    </section>
    ${installPrompt ? `<button class="secondary" data-action="install">${t("install")}</button>` : ""}
    <section class="summary">
      <h3>${t("about")}</h3>
      <p class="note">${t("aboutText")}</p>
    </section>
    <button class="secondary" data-action="openHow">${t("howItWorks")}</button>
    <button class="secondary danger" data-action="resetData">${state.resetArmed ? t("resetConfirm") : t("reset")}</button>
    ${renderCredit()}
  `;
}

function renderHow() {
  const tech = [1, 2, 3, 4].map((n) => `
    <section class="summary tech">
      <h3>${t(`tech${n}Title`)}</h3>
      <p class="note">${t(`tech${n}`)}</p>
    </section>
  `).join("");
  return `
    <div class="subheader">
      ${backButton("backFromHow")}
      <div class="subheader-title"><h2>${t("howItWorks")}</h2></div>
    </div>
    <p class="note">${t("howIntro")}</p>
    ${tech}
    <section class="section">
      <h3>${t("workflow")}</h3>
      <ol class="flow">${t("flow").map((step) => `<li>${step}</li>`).join("")}</ol>
    </section>
    <p class="note">${t("whySatellite")}</p>
    <p class="note">${t("legalNote")}</p>
    ${renderCredit()}
  `;
}

function renderTabs() {
  tabs.hidden = state.view !== "tab";
  tabs.setAttribute("aria-label", t("brand"));
  tabs.innerHTML = ["find", "map", "bookings", "profile"].map((tab) => `
    <button class="tab" data-action="setTab" data-id="${tab}" ${state.tab === tab ? 'aria-current="page"' : ""}>
      <svg width="23" height="23" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${ICONS[tab]}</svg>
      <span>${t(tab)}</span>
    </button>
  `).join("");
}

function render() {
  refreshBookings();
  document.documentElement.lang = store.lang;
  document.title = t("brand");
  const tabViews = { find: renderFind, map: renderMapTab, bookings: renderBookings, profile: renderProfile };
  const views = { road: renderRoad, checkout: renderCheckout, ticket: renderTicket, car: renderCar, how: renderHow };
  const showMap = state.view === "tab" && state.tab === "map";
  if (leafletMap && !showMap) {
    leafletMap.remove();
    leafletMap = null;
  }
  app.classList.toggle("no-tabs", state.view !== "tab");
  app.innerHTML = state.view === "tab" ? tabViews[state.tab]() : views[state.view]();
  renderTabs();
  if (showMap) mountMap();
}

function openRoad(id) {
  state.roadId = id;
  state.selected = null;
  state.view = "road";
  render();
  window.scrollTo(0, 0);
}

function locate() {
  if (!("geolocation" in navigator)) {
    state.locationError = t("locationUnsupported");
    return;
  }
  state.locationStatus = "loading";
  state.locationError = "";
  navigator.geolocation.getCurrentPosition(
    (position) => {
      state.location = { lat: position.coords.latitude, lng: position.coords.longitude };
      state.locationStatus = "ready";
      state.sort = "nearest";
      if (state.mapArea !== "dest") state.mapArea = nearestRoadsTo(state.location)[0].area.id;
      render();
    },
    (error) => {
      const messages = { 1: "locationDenied", 2: "locationMissing", 3: "locationSlow" };
      state.locationStatus = "idle";
      state.locationError = t(messages[error.code] || "locationMissing");
      render();
    },
    { enableHighAccuracy: true, timeout: 10000, maximumAge: 60000 }
  );
}

const actions = {
  setTab(button) {
    state.tab = button.dataset.id;
    state.view = "tab";
    state.resetArmed = false;
  },
  goFind() {
    state.tab = "find";
    state.view = "tab";
  },
  locate,
  pickDest(button) {
    state.destinationId = button.dataset.id;
    state.destQuery = "";
    state.sort = "nearest";
    state.areaFilter = "all";
    state.savedOnly = false;
    state.mapArea = "dest";
  },
  clearDest() {
    state.destinationId = null;
    if (state.mapArea === "dest") state.mapArea = "gulshan";
    if (state.sort === "nearest" && !state.location) state.sort = "most";
  },
  areaFilter(button) {
    state.areaFilter = button.dataset.id;
  },
  mapArea(button) {
    state.mapArea = button.dataset.id;
  },
  sort(button) {
    state.sort = button.dataset.id;
    if (button.dataset.id === "nearest" && !referencePoint()) locate();
  },
  savedOnly() {
    state.savedOnly = !state.savedOnly;
  },
  openHow() {
    state.view = "how";
    window.scrollTo(0, 0);
  },
  backFromHow() {
    state.view = "tab";
  },
  openCar() {
    state.carReturn = state.view;
    state.carQuery = "";
    state.customError = "";
    state.view = "car";
    window.scrollTo(0, 0);
  },
  backFromCar() {
    state.view = state.carReturn;
  },
  pickCar(button) {
    store.car = { ...CARS.find((car) => car.id === button.dataset.id) };
    saveStore();
    state.view = state.carReturn;
  },
  useCustom() {
    const length = Number(state.customLength);
    const width = Number(state.customWidth);
    if (!(length >= 2 && length <= 8 && width >= 1 && width <= 3)) {
      state.customError = t("customError");
      return;
    }
    store.car = { id: "custom", custom: true, length: Math.round(length * 1000), width: Math.round(width * 1000) };
    saveStore();
    state.customError = "";
    state.view = state.carReturn;
  },
  clearCar() {
    store.car = null;
    saveStore();
    state.view = state.carReturn;
  },
  toggleSaved(button) {
    const id = button.dataset.id;
    store.saved = store.saved.includes(id)
      ? store.saved.filter((item) => item !== id)
      : [...store.saved, id];
    saveStore();
  },
  openRoad(button) {
    openRoad(button.dataset.id);
  },
  backToTab() {
    state.view = "tab";
    state.roadId = null;
    state.selected = null;
  },
  backToRoad() {
    state.view = "road";
  },
  pickBay(button) {
    const index = Number(button.dataset.index);
    state.selected = state.selected === index ? null : index;
  },
  toggleSimulation() {
    state.simulation = !state.simulation;
  },
  startCheckout() {
    const { road } = findRoad(state.roadId);
    if (state.selected === null || !bayState(road, state.selected).bookable) return;
    state.checkout = {
      roadId: state.roadId,
      bayIndex: state.selected,
      hours: 1,
      method: "mobile",
      vehicle: store.profile.vehicle,
      error: ""
    };
    state.view = "checkout";
    window.scrollTo(0, 0);
  },
  setHours(button) {
    state.checkout.hours = Number(button.dataset.value);
  },
  setMethod(button) {
    state.checkout.method = button.dataset.value;
  },
  confirmBooking() {
    const checkout = state.checkout;
    const vehicle = checkout.vehicle.trim();
    if (!vehicle) {
      checkout.error = t("vehicleRequired");
      return;
    }
    const { road } = findRoad(checkout.roadId);
    const now = Date.now();
    const booking = {
      id: String(now),
      code: `SP-${now.toString(36).slice(-6).toUpperCase()}`,
      roadId: road.id,
      bayIndex: checkout.bayIndex,
      hours: checkout.hours,
      rate: road.rate,
      cost: road.rate * checkout.hours,
      method: checkout.method,
      vehicle,
      carLabel: store.car ? carName(store.car) : "",
      startedAt: now,
      endsAt: now + checkout.hours * 3600000,
      status: "active"
    };
    store.bookings.unshift(booking);
    store.profile.vehicle = vehicle;
    saveStore();
    state.ticketId = booking.id;
    state.checkout = null;
    state.selected = null;
    state.view = "ticket";
    window.scrollTo(0, 0);
  },
  viewBookings() {
    state.tab = "bookings";
    state.view = "tab";
    state.roadId = null;
  },
  extendBooking(button) {
    const booking = store.bookings.find((item) => item.id === button.dataset.id);
    booking.hours += 1;
    booking.cost += booking.rate;
    booking.endsAt += 3600000;
    saveStore();
  },
  cancelBooking(button) {
    const booking = store.bookings.find((item) => item.id === button.dataset.id);
    booking.status = "cancelled";
    const key = `${booking.roadId}:${booking.bayIndex}`;
    state.overrides[key] = false;
    state.updatedAt[key] = Date.now();
    saveStore();
  },
  toggleLanguage() {
    store.lang = store.lang === "en" ? "bn" : "en";
    saveStore();
  },
  resetData() {
    if (!state.resetArmed) {
      state.resetArmed = true;
      return;
    }
    const lang = store.lang;
    Object.assign(store, defaultStore(), { lang });
    state.overrides = {};
    state.updatedAt = {};
    state.resetArmed = false;
    saveStore();
  },
  async install() {
    if (!installPrompt) return;
    await installPrompt.prompt();
    installPrompt = null;
  }
};

document.addEventListener("click", async (event) => {
  const button = event.target.closest("button[data-action]");
  if (!button) return;
  await actions[button.dataset.action](button);
  if (button.dataset.action !== "openRoad") render();
});

app.addEventListener("input", (event) => {
  const target = event.target;
  if (target.id === "search") {
    state.query = target.value;
    document.getElementById("road-list").innerHTML = renderRoadCards();
  } else if (target.id === "dest-search") {
    state.destQuery = target.value;
    document.getElementById("dest-list").innerHTML = renderDestList();
  } else if (target.id === "car-search") {
    state.carQuery = target.value;
    document.getElementById("car-list").innerHTML = renderCarList();
  } else if (target.id === "custom-length") {
    state.customLength = target.value;
  } else if (target.id === "custom-width") {
    state.customWidth = target.value;
  } else if (target.id === "vehicle") {
    state.checkout.vehicle = target.value;
  } else if (target.dataset.profile) {
    store.profile[target.dataset.profile] = target.value;
    saveStore();
  }
});

function simulateSensor() {
  if (state.view !== "road" || !state.simulation) return;
  const { road } = findRoad(state.roadId);
  const index = (state.simulationStep * 5 + 2) % BAY_COUNT;
  state.simulationStep += 1;
  if (bookingFor(road.id, index)) return;
  const key = `${road.id}:${index}`;
  state.overrides[key] = !isTaken(road, index);
  state.updatedAt[key] = Date.now();
  render();
}

function tickCountdowns() {
  document.querySelectorAll("[data-countdown]").forEach((element) => {
    const booking = store.bookings.find((item) => item.id === element.dataset.countdown);
    if (booking) element.textContent = countdownText(booking);
  });
  const finished = store.bookings.some((item) => item.status === "active" && item.endsAt <= Date.now());
  if (finished && state.view === "tab" && state.tab === "bookings") render();
}

setInterval(simulateSensor, SIMULATION_MS);
setInterval(tickCountdowns, 1000);

window.addEventListener("beforeinstallprompt", (event) => {
  event.preventDefault();
  installPrompt = event;
  if (state.view === "tab" && (state.tab === "find" || state.tab === "profile")) render();
});

if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("sw.js").catch((error) => console.error(error));
  });
}

render();
