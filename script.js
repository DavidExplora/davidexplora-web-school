// =========================================
// DAVID EXPLORA
// BASIC WEBSITE JAVASCRIPT
// =========================================
// ---------- TRIP PLANNER SELECTIONS ----------

let selectedDestination = "";
let selectedInterest = "";
let selectedDuration = "";

// ---------- EXPERIENCE DATA ----------

const experiences = [
    {
        name: "Kilimanjaro Trek",
        destination: "kilimanjaro",
        interest: "adventure",
        description: "Trek through changing mountain landscapes toward the roof of Africa."
    },

    {
        name: "Tanzania Wildlife Safari",
        destination: "safari",
        interest: "wildlife",
        description: "Explore Tanzania's national parks and experience wildlife in the wild."
    },

    {
        name: "Zanzibar Island Escape",
        destination: "zanzibar",
        interest: "beach",
        description: "Enjoy beaches, marine experiences, island culture and the rhythm of Zanzibar."
    },

    {
        name: "Local Tanzania Experience",
        destination: "local",
        interest: "culture",
        description: "Discover local communities, nature, food and experiences beyond the main tourist routes."
    }
];

// ---------- MOBILE NAVIGATION ----------

const menuToggle = document.querySelector(".menu-toggle");
const mainNav = document.querySelector(".main-nav");

menuToggle.addEventListener("click", () => {

    mainNav.classList.toggle("active");

});


// ---------- CLOSE MENU AFTER CLICK ----------

const navLinks = document.querySelectorAll(".main-nav a");

navLinks.forEach((link) => {

    link.addEventListener("click", () => {

        mainNav.classList.remove("active");

    });

});


// ---------- CURRENT YEAR ----------
const yearElement = document.querySelector("#current-year");
const currentYear = new Date().getFullYear();
yearElement.textContent = currentYear;

// ---------- TRIP PLANNER SELECTIONS ----------

// Current planner selections
const plannerSelections = {
    destination: "",
    interest: "",
    duration: ""
};

// Reusable function for planner buttons
function setupPlannerSelection(selector, key, dataKey) {
    const buttons = document.querySelectorAll(selector);

    buttons.forEach((button) => {
        button.addEventListener("click", () => {

            // Remove selected state from this group
            buttons.forEach((item) => {
                item.classList.remove("selected");
            });

            // Mark clicked option as selected
            button.classList.add("selected");

            // Save selected value
            plannerSelections[key] = button.dataset[dataKey];

            // Keep the existing variables connected
            if (key === "destination") {
                selectedDestination = plannerSelections.destination;
            }

            if (key === "interest") {
                selectedInterest = plannerSelections.interest;
            }

            if (key === "duration") {
                selectedDuration = plannerSelections.duration;
            }

            console.log(`${key} selected:`, plannerSelections[key]);
        });
    });
}


// ---------- DESTINATION ----------
setupPlannerSelection(
    '.planner-options button[data-destination]',
    "destination",
    "destination"
);


// ---------- INTEREST ----------
setupPlannerSelection(
    '.planner-options button[data-interest]',
    "interest",
    "interest"
);


// ---------- DURATION ----------
setupPlannerSelection(
    '.planner-options button[data-duration]',
    "duration",
    "duration"
);

// ---------- BUILD TANZANIA JOURNEY ----------
const buildJourneyButton = document.querySelector("#build-journey");
const journeyResult = document.querySelector("#journey-result");
const journeyMessage = document.querySelector("#journey-message");

buildJourneyButton.addEventListener("click", () => {

    // Make sure all choices have been selected
    if (!selectedDestination || !selectedInterest || !selectedDuration) {
        journeyMessage.textContent =
            "Please choose a destination, experience type and trip length first.";

        journeyResult.classList.add("show");

        journeyResult.scrollIntoView({
            behavior: "smooth",
            block: "center"
        });

        return;
    }

    // Show the selections in the console
    console.log("Destination:", selectedDestination);
    console.log("Interest:", selectedInterest);
    console.log("Duration:", selectedDuration);

    // Create a personalized message
    let message = "";

    if (
        selectedDestination === "kilimanjaro" &&
        selectedInterest === "adventure"
    ) {
        message = `A ${selectedDuration.replace("-", "–")} day
        Kilimanjaro adventure focused on trekking, hiking and active
        experiences.`;
    }

    else if (
        selectedDestination === "safari" &&
        selectedInterest === "wildlife"
    ) {
        message = `A ${selectedDuration.replace("-", "–")} day
        Tanzania safari focused on wildlife, national parks and
        unforgettable encounters.`;
    }

    else if (
        selectedDestination === "zanzibar" &&
        selectedInterest === "beach"
    ) {
        message = `A ${selectedDuration.replace("-", "–")} day
        Zanzibar escape focused on beaches, marine life and island
        experiences.`;
    }

    else if (
        selectedDestination === "local" &&
        selectedInterest === "culture"
    ) {
        message = `A ${selectedDuration.replace("-", "–")} day
        local Tanzania experience focused on culture, food, communities
        and nature.`;
    }

    else {
        message = `A ${selectedDuration.replace("-", "–")} day
        Tanzania journey combining ${selectedInterest} experiences
        around ${selectedDestination}.`;
    }

    // Display the result
    journeyMessage.textContent = message;

    journeyResult.classList.add("show");

    // ---------- TRAVEL PROFILE ----------
let travelProfile = "";
let travelPace = "";

if (selectedInterest === "adventure") {
    travelProfile = "Active Explorer";
} else if (selectedInterest === "wildlife") {
    travelProfile = "Wildlife Seeker";
} else if (selectedInterest === "beach") {
    travelProfile = "Island Escape";
} else if (selectedInterest === "culture") {
    travelProfile = "Culture Connector";
} else {
    travelProfile = "Tanzania Explorer";
}

if (selectedDuration === "3-4") {
    travelPace = "Focused Escape";
} else if (selectedDuration === "5-7") {
    travelPace = "Deep Experience";
} else if (selectedDuration === "8-10") {
    travelPace = "Multi-Experience Journey";
} else if (selectedDuration === "11-plus") {
    travelPace = "Slow Explorer";
} else {
    travelPace = "Flexible Journey";
}

// ---------- TRIP DNA ----------
const tripDNA = document.createElement("div");

tripDNA.className = "trip-dna";

// ---------- JOURNEY DNA CODE ----------
const durationCode =
    selectedDuration === "11-plus"
        ? "11+"
        : selectedDuration.replace("-", "/");

const tripCode =
    `${selectedDestination.slice(0, 3).toUpperCase()}-` +
    `${selectedInterest.slice(0, 3).toUpperCase()}-` +
    `${durationCode}`;

    // ---------- RECOMMENDATION ENGINE ----------

const recommendedExperiences = experiences.filter((experience) => {
    return (
        experience.destination === selectedDestination &&
        experience.interest === selectedInterest
    );
});

   // ---------- JOURNEY INSIGHT ----------
let journeyInsight = "";

if (selectedDestination === "kilimanjaro") {
    journeyInsight =
        "A strong match for travelers who want active days, mountain landscapes and a rewarding trekking experience.";
} else if (selectedDestination === "safari") {
    journeyInsight =
        "A good match for travelers who want wildlife, open landscapes and time to explore Tanzania's national parks.";
} else if (selectedDestination === "zanzibar") {
    journeyInsight =
        "A good match for travelers looking for beaches, marine experiences, island culture and a slower rhythm.";
} else if (selectedDestination === "local") {
    journeyInsight =
        "A good match for travelers who want nature, culture, local communities and experiences beyond the main tourist routes.";
} else {
    journeyInsight =
        "Your selections can be combined into a flexible Tanzania journey.";
}

// ---------- JOURNEY STORY ----------
let journeyStory = "";

if (selectedDestination === "kilimanjaro") {
    journeyStory =
        `Begin your Tanzania story on the slopes of Kilimanjaro, surrounded by changing landscapes, fresh mountain air and the challenge of reaching higher. Your ${selectedDuration} day journey is designed for travelers who want an active and rewarding experience.`;
} else if (selectedDestination === "safari") {
    journeyStory =
        `Your Tanzania story begins in the wild. Travel through open landscapes, discover Tanzania's wildlife and enjoy the freedom of exploring national parks at your own pace. Your ${selectedDuration} day journey is built around unforgettable wildlife experiences.`;
} else if (selectedDestination === "zanzibar") {
    journeyStory =
        `Slow down and discover the island side of Tanzania. Your journey brings together beaches, marine experiences, island culture and moments to simply enjoy the rhythm of Zanzibar. Your ${selectedDuration} day escape is designed for travelers looking for a tropical experience.`;
} else if (selectedDestination === "local") {
    journeyStory =
        `Go beyond the famous sights and discover another side of Tanzania. Meet local communities, explore nature, taste local flavors and experience places that connect you with everyday Tanzania. Your ${selectedDuration} day journey is designed around authentic experiences.`;
} else {
    journeyStory =
        `Your Tanzania story is built around the experiences you selected, giving you a flexible ${selectedDuration} day journey to discover Tanzania your way.`;
}

// ---------- SUGGESTED EXPERIENCE PATH ----------
let experiencePath = [];

if (
    selectedDestination === "kilimanjaro" &&
    selectedInterest === "adventure"
) {
    experiencePath = [
        "Prepare — Meet your guide and begin your mountain journey.",
        "Trek — Experience changing landscapes as you climb higher.",
        "Summit — Work toward the high point of your Kilimanjaro adventure."
    ];
} else if (
    selectedDestination === "safari" &&
    selectedInterest === "wildlife"
) {
    experiencePath = [
        "Discover — Enter Tanzania's wildlife landscapes.",
        "Explore — Spend time observing wildlife and exploring national parks.",
        "Remember — Build unforgettable moments in the wild."
    ];
} else if (
    selectedDestination === "zanzibar" &&
    selectedInterest === "beach"
) {
    experiencePath = [
        "Arrive — Begin your island experience.",
        "Explore — Discover beaches, marine life and island culture.",
        "Unwind — Slow down and enjoy the rhythm of Zanzibar."
    ];
} else if (
    selectedDestination === "local" &&
    selectedInterest === "culture"
) {
    experiencePath = [
        "Connect — Meet local people and discover everyday Tanzania.",
        "Explore — Experience nature, communities and local landscapes.",
        "Taste — Discover local flavors, traditions and stories."
    ];
} else {
    experiencePath = [
        "Discover — Start with the experiences that interest you most.",
        "Explore — Connect different sides of Tanzania.",
        "Remember — Create a journey shaped around your interests."
    ];
}
tripDNA.innerHTML = `
    <h4>Your Trip DNA</h4>

    <div class="dna-grid">

        <div>
            <span>Destination</span>
            <strong>${selectedDestination}</strong>
        </div>

        <div>
            <span>Travel Profile</span>
            <strong>${travelProfile}</strong>
        </div>

        <div>
            <span>Journey Pace</span>
            <strong>${travelPace}</strong>
        </div>

        <div>
            <span>Duration</span>
            <strong>${selectedDuration} days</strong>
        </div>

        <div class="dna-code">
            <span>DNA Code</span>
            <strong>${tripCode}</strong>
        </div>

    </div>

    <div class="recommendations">
        <span>Recommended for you</span>

        ${
            recommendedExperiences.length > 0
                ? recommendedExperiences.map((experience) => `
                    <div class="recommended-experience">

                        <h5>${experience.name}</h5>

                        <p>${experience.description}</p>

                        <button
                            type="button"
                            class="explore-recommended"
                            data-destination="${experience.destination}">
                            Explore This Experience →
                        </button>

                    </div>
                `).join("")
                : `
                    <p>
                        We can create a personalized combination
                        based on your interests.
                    </p>
                `
        }
    </div>

    <div class="journey-insight">
        <span>Why this journey fits you</span>

        <p>${journeyInsight}</p>
    </div>

    <div class="journey-story">
        <span>Your Tanzania Story</span>

        <p>${journeyStory}</p>
    </div>

    <div class="experience-path">

        <span class="path-title">
            Your Suggested Experience Path
        </span>

        <div class="path-steps">

            <div class="path-step">
                <span>01</span>
                <p>${experiencePath[0]}</p>
            </div>

            <div class="path-step">
                <span>02</span>
                <p>${experiencePath[1]}</p>
            </div>

            <div class="path-step">
                <span>03</span>
                <p>${experiencePath[2]}</p>
            </div>

        </div>

    </div>
`;
journeyResult.appendChild(tripDNA);

const exploreButton = tripDNA.querySelector(".explore-recommended");

exploreButton.addEventListener("click", () => {
    const destination = exploreButton.dataset.destination;

    const destinationLinks = {
        kilimanjaro: "#experiences",
        safari: "#experiences",
        zanzibar: "#experiences",
        local: "#experiences"
    };

    const target = destinationLinks[destination];

    if (target) {
        document.querySelector(target).scrollIntoView({
            behavior: "smooth",
            block: "start"
        });
    }
});

    // Smoothly move to the result
    journeyResult.scrollIntoView({
        behavior: "smooth",
        block: "center"
    });
});

// ---------- PLAN THIS TRIP ----------
const planTripButton = document.querySelector("#plan-this-trip");
planTripButton.addEventListener("click", () => {

    const destinationField =
        document.querySelector("#trip-destination");

    const durationField =
        document.querySelector("#trip-duration");

    const messageField =
        document.querySelector("#trip-message");

    const destinationMap = {
        kilimanjaro: "Kilimanjaro",
        safari: "Safari",
        zanzibar: "Zanzibar",
        local: "Local Tanzania"
    };

    const durationMap = {
        "3-4": "3-4 days",
        "5-7": "5-7 days",
        "8-10": "8-10 days",
        "11-plus": "11+ days"
    };

    destinationField.value =
        destinationMap[selectedDestination] || "";

    durationField.value =
        durationMap[selectedDuration] || "";

    messageField.value =
        `I am interested in a ${selectedDuration} day Tanzania journey focused on ${selectedInterest}. Please help me create the right itinerary for my trip.`;

    document.querySelector("#contact").scrollIntoView({
        behavior: "smooth",
        block: "start"
    });

});

// ---------- TRIP INQUIRY FORM ----------

const inquiryForm = document.querySelector("#trip-inquiry-form");

inquiryForm.addEventListener("submit", (event) => {

    event.preventDefault();

    const customerName =
        document.querySelector("#customer-name").value.trim();

    const customerEmail =
        document.querySelector("#customer-email").value.trim();

    const customerWhatsApp =
        document.querySelector("#customer-whatsapp").value.trim();

    const travelDate =
        document.querySelector("#travel-date").value;

    const travelerCount =
        document.querySelector("#traveler-count").value;

    const destination =
        document.querySelector("#trip-destination").value;

    const tripDuration =
        document.querySelector("#trip-duration").value;

    const tripMessage =
        document.querySelector("#trip-message").value.trim();

    const whatsappMessage =
    ` NEW TANZANIA TRIP INQUIRY

Traveler: ${customerName}
Email: ${customerEmail}
WhatsApp: ${customerWhatsApp}

Preferred Travel Date: ${travelDate || "Not specified"}
Travelers: ${travelerCount}
Destination: ${destination}
Trip Length: ${tripDuration}

TRAVELER'S IDEA
${tripMessage || "No additional travel idea provided."}

NEXT STEP
Please help me design this journey, recommend suitable options, and provide the available pricing.`;

    const whatsappURL =
        "https://wa.me/255778321400?text=" +
        encodeURIComponent(whatsappMessage);

    window.open(whatsappURL, "_blank");

});