// =========================================
// DAVID EXPLORA
// BASIC WEBSITE JAVASCRIPT
// =========================================
// ---------- TRIP PLANNER SELECTIONS ----------


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

// ---------- TRIP PLANNER ----------

const plannerSelections = {
    destination: "",
    interest: "",
    duration: ""
};


// ---------- PLANNER BUTTON SETUP ----------

function setupPlannerSelection(selector, key, dataKey) {

    const buttons = document.querySelectorAll(selector);

    buttons.forEach((button) => {

        button.addEventListener("click", () => {

            buttons.forEach((item) => {
                item.classList.remove("selected");
            });

            button.classList.add("selected");

            plannerSelections[key] =
                button.dataset[dataKey];

            console.log(
                `${key} selected:`,
                plannerSelections[key]
            );

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


// ---------- BUILD JOURNEY ----------

const buildJourneyButton =
    document.querySelector("#build-journey");

const journeyResult =
    document.querySelector("#journey-result");

const journeyMessage =
    document.querySelector("#journey-message");


buildJourneyButton.addEventListener("click", () => {

    const {
        destination,
        interest,
        duration
    } = plannerSelections;


    // ---------- VALIDATION ----------

    if (!destination || !interest || !duration) {

        journeyMessage.textContent =
            "Please choose a destination, experience type and trip length first.";

        journeyResult.classList.add("show");

        journeyResult.scrollIntoView({
            behavior: "smooth",
            block: "center"
        });

        return;
    }


    // ---------- TRAVEL PROFILE ----------

    const travelProfiles = {
        adventure: "Active Explorer",
        wildlife: "Wildlife Seeker",
        beach: "Island Escape",
        culture: "Culture Connector"
    };

    const travelProfile =
        travelProfiles[interest] ||
        "Tanzania Explorer";


    // ---------- JOURNEY PACE ----------

    const journeyPaces = {
        "3-4": "Focused Escape",
        "5-7": "Deep Experience",
        "8-10": "Multi-Experience Journey",
        "11-plus": "Slow Explorer"
    };

    const travelPace =
        journeyPaces[duration] ||
        "Flexible Journey";


    // ---------- DURATION ----------

    const durationDisplay = {
        "3-4": "3–4",
        "5-7": "5–7",
        "8-10": "8–10",
        "11-plus": "11+"
    };

    const displayDuration =
        durationDisplay[duration] ||
        duration;


    // ---------- DNA CODE ----------

    const destinationCode =
        destination.slice(0, 3).toUpperCase();

    const interestCode =
        interest.slice(0, 3).toUpperCase();

    const durationCode =
        duration === "11-plus"
            ? "11+"
            : duration.replace("-", "/");

    const tripCode =
        `${destinationCode}-${interestCode}-${durationCode}`;


    // ---------- MAIN MESSAGE ----------

    const journeyMessages = {

        kilimanjaro:
            `A ${displayDuration}-day Kilimanjaro adventure focused on trekking, hiking and active mountain experiences.`,

        safari:
            `A ${displayDuration}-day Tanzania safari focused on wildlife, national parks and unforgettable encounters.`,

        zanzibar:
            `A ${displayDuration}-day Zanzibar escape focused on beaches, marine life and island experiences.`,

        local:
            `A ${displayDuration}-day local Tanzania experience focused on culture, food, communities and nature.`
    };

    const message =
        journeyMessages[destination] ||
        `A ${displayDuration}-day Tanzania journey shaped around your interests.`;


    // ---------- JOURNEY INSIGHT ----------

    const journeyInsights = {

        kilimanjaro:
            "A strong match for travelers who want active days, mountain landscapes and a rewarding trekking experience.",

        safari:
            "A good match for travelers who want wildlife, open landscapes and time to explore Tanzania's national parks.",

        zanzibar:
            "A good match for travelers looking for beaches, marine experiences, island culture and a slower rhythm.",

        local:
            "A good match for travelers who want nature, culture, local communities and experiences beyond the main tourist routes."
    };

    const journeyInsight =
        journeyInsights[destination] ||
        "Your selections can be combined into a flexible Tanzania journey.";


    // ---------- JOURNEY STORY ----------

    const journeyStories = {

        kilimanjaro:
            `Begin your Tanzania story on the slopes of Kilimanjaro, surrounded by changing landscapes, fresh mountain air and the challenge of reaching higher.`,

        safari:
            `Your Tanzania story begins in the wild. Travel through open landscapes, discover Tanzania's wildlife and explore national parks through unforgettable wildlife experiences.`,

        zanzibar:
            `Slow down and discover the island side of Tanzania through beaches, marine experiences, island culture and the rhythm of Zanzibar.`,

        local:
            `Go beyond the famous sights and discover another side of Tanzania through local communities, nature, food and everyday experiences.`
    };

    const journeyStory =
        journeyStories[destination] ||
        "Your Tanzania story is shaped around the experiences you selected.";


    // ---------- EXPERIENCE PATH ----------

    const experiencePaths = {

        kilimanjaro: [
            "Prepare — Meet your guide and begin your mountain journey.",
            "Trek — Experience changing landscapes as you climb higher.",
            "Summit — Work toward the high point of your Kilimanjaro adventure."
        ],

        safari: [
            "Discover — Enter Tanzania's wildlife landscapes.",
            "Explore — Spend time observing wildlife and exploring national parks.",
            "Remember — Build unforgettable moments in the wild."
        ],

        zanzibar: [
            "Arrive — Begin your island experience.",
            "Explore — Discover beaches, marine life and island culture.",
            "Unwind — Slow down and enjoy the rhythm of Zanzibar."
        ],

        local: [
            "Connect — Meet local people and discover everyday Tanzania.",
            "Explore — Experience nature, communities and local landscapes.",
            "Taste — Discover local flavors, traditions and stories."
        ]
    };

    const experiencePath =
        experiencePaths[destination] || [
            "Discover — Start with the experiences that interest you most.",
            "Explore — Connect different sides of Tanzania.",
            "Remember — Create a journey shaped around your interests."
        ];


    // ---------- RECOMMENDATION ENGINE ----------

    const recommendedExperiences =
        experiences.filter((experience) => {

            return (
                experience.destination === destination &&
                experience.interest === interest
            );

        });


    // ---------- REMOVE PREVIOUS RESULT ----------

    const oldTripDNA =
        journeyResult.querySelector(".trip-dna");

    if (oldTripDNA) {
        oldTripDNA.remove();
    }


    // ---------- CREATE CURRENT RESULT ----------

    const tripDNA =
        document.createElement("div");

    tripDNA.className = "trip-dna";


    // ---------- TRIP DNA CONTENT ----------

    tripDNA.innerHTML = `

        <h4>Your Trip DNA</h4>

        <div class="dna-grid">

            <div>
                <span>Destination</span>
                <strong>${destination}</strong>
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
                <strong>${displayDuration} days</strong>
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

                    ? recommendedExperiences
                        .map((experience) => `

                            <div class="recommended-experience">

                                <h5>
                                    ${experience.name}
                                </h5>

                                <p>
                                    ${experience.description}
                                </p>

                            </div>

                        `)
                        .join("")

                    : `

                        <p>
                            We can create a personalized combination
                            based on your interests.
                        </p>

                    `
            }

        </div>


        <div class="journey-insight">

            <span>
                Why this journey fits you
            </span>

            <p>
                ${journeyInsight}
            </p>

        </div>


        <div class="journey-story">

            <span>
                Your Tanzania Story
            </span>

            <p>
                ${journeyStory}
            </p>

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


    // ---------- INSERT CURRENT RESULT ----------

    journeyResult.appendChild(tripDNA);


    // ---------- UPDATE MESSAGE ----------

    journeyMessage.textContent =
        message;


    journeyResult.classList.add("show");


    // ---------- DEBUG ----------

    console.log("Trip Planner:", {
        destination,
        interest,
        duration,
        tripCode
    });


    // ---------- SHOW RESULT ----------

    journeyResult.scrollIntoView({
        behavior: "smooth",
        block: "center"
    });

});
// ---------- PLAN THIS TRIP ----------
const planTripButton = document.querySelector("#plan-this-trip");

planTripButton?.addEventListener("click", () => {
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
        destinationMap[plannerSelections.destination] || "";

    durationField.value =
    durationMap[plannerSelections.duration] || "";

messageField.value =
    `I am interested in a ${plannerSelections.duration} Tanzania journey focused on ${plannerSelections.interest}. Please help me create the right itinerary for my trip.`;

    document.querySelector("#contact").scrollIntoView({
        behavior: "smooth",
        block: "start"
    });

});

// ---------- TRIP INQUIRY FORM ----------

const inquiryForm = document.querySelector("#trip-inquiry-form");

inquiryForm?.addEventListener("submit", (event) => {

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