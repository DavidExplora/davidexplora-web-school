// =========================================
// DAVID EXPLORA
// BASIC WEBSITE JAVASCRIPT
// =========================================
// ---------- TRIP PLANNER SELECTIONS ----------

let selectedDestination = "";
let selectedInterest = "";
let selectedDuration = "";

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

// DESTINATION
const destinationButtons = document.querySelectorAll(
    '.planner-options button[data-destination]'
);

destinationButtons.forEach((button) => {
    button.addEventListener("click", () => {

        destinationButtons.forEach((item) => {
            item.classList.remove("selected");
        });

        button.classList.add("selected");

        const destination = button.dataset.destination;
        selectedDestination = destination;
        console.log("Selected destination:", destination);
    });
});


// INTEREST
const interestButtons = document.querySelectorAll(
    '.planner-options button[data-interest]'
);

interestButtons.forEach((button) => {
    button.addEventListener("click", () => {

        interestButtons.forEach((item) => {
            item.classList.remove("selected");
        });

        button.classList.add("selected");

        const interest = button.dataset.interest;

selectedInterest = interest;

console.log("Selected interest:", selectedInterest);
    });
});


// DURATION
const durationButtons = document.querySelectorAll(
    '.planner-options button[data-duration]'
);

durationButtons.forEach((button) => {
    button.addEventListener("click", () => {

        durationButtons.forEach((item) => {
            item.classList.remove("selected");
        });

        button.classList.add("selected");

        const duration = button.dataset.duration;

        selectedDuration = duration;

        console.log("Selected duration:", selectedDuration);
    });
});

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

    </div>

    <div>
    <span>DNA Code</span>
    <strong>${tripCode}</strong>
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
    <span class="path-title">Your Suggested Experience Path</span>

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
    // Smoothly move to the result
    journeyResult.scrollIntoView({
        behavior: "smooth",
        block: "center"
    });
});

// ---------- PLAN THIS TRIP ----------
const planTripButton = document.querySelector("#plan-this-trip");
planTripButton.addEventListener("click", () => {
    const message = `Hello David Explora! I would like to plan a Tanzania trip.

Destination: ${selectedDestination}
Experience: ${selectedInterest}
Duration: ${selectedDuration}

Please help me create an itinerary and provide the available options and price.`;

    const whatsappURL =
        "https://wa.me/255778321400?text=" + encodeURIComponent(message);

    window.open(whatsappURL, "_blank");
});