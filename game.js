/* =========================================================
   ASTRA
   COSMIC RNG
   CLEAN UI EDITION
========================================================= */


/* =========================================================
   OBJECTS
========================================================= */

const objects = [

    {
        id: "moon",
        name: "Moon",
        rarity: "common",
        chance: 45,
        power: 1,
        color: "#bfc4d0",
        description: "Earth's natural satellite."
    },

    {
        id: "mars",
        name: "Mars",
        rarity: "common",
        chance: 30,
        power: 3,
        color: "#e15c38",
        description: "The red planet."
    },

    {
        id: "uranus",
        name: "Uranus",
        rarity: "uncommon",
        chance: 12,
        power: 12,
        color: "#82e1dc",
        description: "A distant ice giant."
    },

    {
        id: "neptune",
        name: "Neptune",
        rarity: "uncommon",
        chance: 7,
        power: 20,
        color: "#407cff",
        description: "The farthest major planet."
    },

    {
        id: "saturn",
        name: "Saturn",
        rarity: "rare",
        chance: 4,
        power: 75,
        color: "#e4b665",
        description: "The magnificent ringed planet."
    },

    {
        id: "supernova",
        name: "Supernova",
        rarity: "epic",
        chance: 1.5,
        power: 400,
        color: "#c95aff",
        description: "A star exploding in spectacular fashion."
    },

    {
        id: "blackhole",
        name: "Black Hole",
        rarity: "legendary",
        chance: 0.5,
        power: 2500,
        color: "#ff9c32",
        description: "A region of spacetime with extreme gravity."
    }

];


const rarityOrder = [
    "common",
    "uncommon",
    "rare",
    "epic",
    "legendary"
];


const rarityColors = {

    common: "#d9dce7",
    uncommon: "#62e69a",
    rare: "#5da5ff",
    epic: "#bd72ff",
    legendary: "#ffd45d"

};


/* =========================================================
   BANNERS
========================================================= */

const banners = [

    {
        name: "DEEP SPACE",

        description:
            "A scan route through the outer reaches of known space.",

        objects: [
            "moon",
            "mars",
            "uranus",
            "neptune",
            "saturn",
            "supernova",
            "blackhole"
        ]
    },

    {
        name: "SOLAR FRONTIER",

        description:
            "A dangerous expedition beyond the inner systems.",

        objects: [
            "mars",
            "moon",
            "uranus",
            "neptune",
            "saturn",
            "supernova",
            "blackhole"
        ]
    },

    {
        name: "UNKNOWN HORIZON",

        description:
            "Something strange waits beyond the observable horizon.",

        objects: [
            "moon",
            "mars",
            "neptune",
            "uranus",
            "saturn",
            "supernova",
            "blackhole"
        ]
    }

];


/* =========================================================
   PLAYER
========================================================= */

let player =
    JSON.parse(
        localStorage.getItem(
            "astraPlayer"
        )
    ) ||
    {
        stardust: 0,

        discovered: [
            "moon"
        ],

        equipped: "moon",

        totalDiscoveries: 1,

        rarest: "common"
    };


/* =========================================================
   HELPERS
========================================================= */

const $ =
    id =>
        document.getElementById(id);


function getObject(id) {

    return objects.find(
        object =>
            object.id === id
    );

}


function save() {

    localStorage.setItem(
        "astraPlayer",
        JSON.stringify(player)
    );

}


function wait(ms) {

    return new Promise(
        resolve =>
            setTimeout(
                resolve,
                ms
            )
    );

}


function formatNumber(number) {

    return number.toLocaleString();

}


/* =========================================================
   BASIC UI ELEMENTS
========================================================= */

const stardust =
    $("stardust");

const totalStardust =
    $("totalStardust");

const discoveredCount =
    $("discoveredCount");

const highestRarity =
    $("highestRarity");

const currentObject =
    $("currentObject");

const planetName =
    $("planetName");

const planetRarity =
    $("planetRarity");

const planetPower =
    $("planetPower");

const planetDescription =
    $("planetDescription");

const planetVisual =
    $("planetVisual");

const inventoryGrid =
    $("inventoryGrid");

const inventoryCount =
    $("inventoryCount");

const notification =
    $("notification");


/* =========================================================
   UI UPDATE
========================================================= */

function updateUI() {

    stardust.textContent =
        formatNumber(
            player.stardust
        );

    totalStardust.textContent =
        formatNumber(
            player.stardust
        );

    discoveredCount.textContent =
        player.discovered.length;

    inventoryCount.textContent =
        player.discovered.length;


    const equipped =
        getObject(
            player.equipped
        );


    if (!equipped)
        return;


    planetName.textContent =
        equipped.name;

    planetDescription.textContent =
        equipped.description;

    planetPower.textContent =
        "+" +
        formatNumber(
            equipped.power
        );

    planetRarity.textContent =
        equipped.rarity.toUpperCase();


    planetRarity.style.color =
        rarityColors[
            equipped.rarity
        ];

    planetPower.style.color =
        rarityColors[
            equipped.rarity
        ];

    highestRarity.textContent =
        player.rarest.toUpperCase();

    highestRarity.style.color =
        rarityColors[
            player.rarest
        ];

    currentObject.textContent =
        equipped.name;


    planetVisual.className =
        "celestial planet-" +
        equipped.id;


    renderInventory();

    save();

}


/* =========================================================
   PLANET CLICKING
========================================================= */

planetVisual.addEventListener(
    "click",
    collectStardust
);


function collectStardust() {

    const object =
        getObject(
            player.equipped
        );


    if (!object)
        return;


    player.stardust +=
        object.power;


    playCollectSound(
        object.rarity
    );


    floatingGain(
        "+" +
        formatNumber(
            object.power
        )
    );


    planetVisual.animate(

        [
            {
                transform:
                    "scale(1)"
            },

            {
                transform:
                    "scale(1.1)"
            },

            {
                transform:
                    "scale(.96)"
            },

            {
                transform:
                    "scale(1)"
            }
        ],

        {
            duration: 260,

            easing:
                "cubic-bezier(.16,1,.3,1)"
        }

    );


    updateUI();

}


/* =========================================================
   FLOATING STARDUST
========================================================= */

function floatingGain(
    text
) {

    const element =
        document.createElement(
            "div"
        );


    element.textContent =
        text;


    element.style.position =
        "fixed";

    element.style.left =
        "50%";

    element.style.top =
        "45%";

    element.style.zIndex =
        "600";

    element.style.pointerEvents =
        "none";

    element.style.fontSize =
        "20px";

    element.style.fontWeight =
        "950";


    document.body.appendChild(
        element
    );


    element.animate(

        [
            {
                opacity: 1,

                transform:
                    "translate(-50%,0)"
            },

            {
                opacity: 0,

                transform:
                    "translate(-50%,-55px)"
            }
        ],

        {
            duration: 600,

            easing:
                "cubic-bezier(.16,1,.3,1)"
        }

    );


    setTimeout(
        () =>
            element.remove(),
        650
    );

}


/* =========================================================
   INVENTORY
========================================================= */

function renderInventory() {

    inventoryGrid.innerHTML =
        "";


    player.discovered.forEach(
        id => {

            const object =
                getObject(id);


            if (!object)
                return;


            const card =
                document.createElement(
                    "div"
                );


            card.className =
                "inventory-item";


            card.innerHTML = `

                <div
                    class="inventory-visual"
                    style="
                        --object-color:
                        ${object.color};
                    "
                ></div>

                <div
                    class="inventory-rarity"
                    style="
                        --rarity:
                        ${rarityColors[object.rarity]};
                    "
                >
                    ${object.rarity.toUpperCase()}
                </div>

                <h3>
                    ${object.name}
                </h3>

                <p>
                    +${formatNumber(object.power)}
                    Stardust / click
                </p>

                <button
                    class="equip-button"
                    data-id="${object.id}"
                >
                    ${
                        object.id === player.equipped
                            ? "EQUIPPED"
                            : "EQUIP"
                    }
                </button>

            `;


            if (
                object.id ===
                player.equipped
            ) {

                card.style.borderColor =
                    rarityColors[
                        object.rarity
                    ];

            }


            inventoryGrid.appendChild(
                card
            );

        }
    );


    document
        .querySelectorAll(
            ".equip-button"
        )
        .forEach(
            button => {

                button.addEventListener(
                    "click",
                    () => {

                        player.equipped =
                            button.dataset.id;

                        playEquipSound();

                        updateUI();

                        showNotification(
                            getObject(
                                player.equipped
                            ).name +
                            " EQUIPPED"
                        );

                    }
                );

            }
        );

}


/* =========================================================
   BUILD GACHA GUI
========================================================= */

function buildGachaGUI() {

    const page =
        $("gachaPage");


    page.innerHTML = `

        <div class="page-header">

            <div>

                <div class="eyebrow">
                    DEEP SPACE SCANNER
                </div>

                <h1>GACHA</h1>

                <p>
                    Search the unknown.
                </p>

            </div>

        </div>


        <div class="gacha-layout">


            <aside
                class="expedition-panel"
            >

                <div class="panel-label">
                    CURRENT EXPEDITION
                </div>

                <h2
                    id="bannerNameNew"
                >
                    DEEP SPACE
                </h2>

                <p
                    class="expedition-description"
                    id="bannerDescriptionNew"
                ></p>


                <div
                    class="expedition-line"
                ></div>


                <div
                    class="banner-countdown"
                >

                    <span>
                        ROTATION
                    </span>

                    <strong
                        id="bannerTimerNew"
                    >
                        10:00
                    </strong>

                </div>


                <div
                    class="expedition-line"
                ></div>


                <div class="panel-label">
                    DISCOVERY ODDS
                </div>

                <div
                    class="rate-list"
                    id="rateList"
                ></div>

            </aside>


            <section
                class="gacha-scanner"
                id="gachaScanner"
            >

                <div
                    class="scanner-stars"
                ></div>

                <div
                    class="scanner-grid"
                ></div>

                <div
                    class="scanner-lens"
                ></div>

                <div
                    class="scanner-crosshair"
                ></div>

                <div
                    class="scanner-target"
                ></div>

                <div
                    class="scan-beam"
                ></div>

                <div
                    class="scanner-status"
                    id="scannerStatus"
                >
                    READY
                </div>

            </section>


            <aside
                class="gacha-controls-panel"
            >

                <div>

                    <div
                        class="control-heading"
                    >
                        OBSERVATORY CONTROL
                    </div>

                    <div
                        class="search-cost"
                    >

                        <span>
                            COST PER SCAN
                        </span>

                        <strong>
                            100 ✦
                        </strong>

                    </div>

                </div>


                <div>

                    <button
                        id="searchButtonNew"
                        class="search-button"
                    >
                        SCAN COSMOS
                    </button>

                    <p
                        class="control-note"
                    >
                        One scan searches deep space for a celestial object.
                    </p>

                </div>

            </aside>

        </div>

    `;


    return {

        scanner:
            $("gachaScanner"),

        status:
            $("scannerStatus"),

        button:
            $("searchButtonNew"),

        bannerName:
            $("bannerNameNew"),

        bannerDescription:
            $("bannerDescriptionNew"),

        timer:
            $("bannerTimerNew"),

        rateList:
            $("rateList")

    };

}


const gacha =
    buildGachaGUI();


/* =========================================================
   BANNER TIMER
========================================================= */

const BANNER_DURATION =
    10 * 60 * 1000;


let bannerStart =
    localStorage.getItem(
        "astraBannerStart"
    );


if (!bannerStart) {

    bannerStart =
        Date.now();

    localStorage.setItem(
        "astraBannerStart",
        bannerStart
    );

}


function currentBanner() {

    const elapsed =
        Date.now() -
        Number(
            bannerStart
        );


    const index =
        Math.floor(
            elapsed /
            BANNER_DURATION
        )
        %
        banners.length;


    return banners[index];

}


function updateBanner() {

    const elapsed =
        Date.now() -
        Number(
            bannerStart
        );


    const banner =
        currentBanner();


    gacha.bannerName.textContent =
        banner.name;

    gacha.bannerDescription.textContent =
        banner.description;


    const remaining =
        BANNER_DURATION -
        (
            elapsed %
            BANNER_DURATION
        );


    const totalSeconds =
        Math.floor(
            remaining /
            1000
        );


    const minutes =
        Math.floor(
            totalSeconds /
            60
        );


    const seconds =
        totalSeconds %
        60;


    gacha.timer.textContent =
        String(minutes)
            .padStart(2,"0")
        +
        ":" +
        String(seconds)
            .padStart(2,"0");


    /*
        Show one row per rarity.
    */

    const shown =
        new Set();


    gacha.rateList.innerHTML =
        "";


    banner.objects.forEach(
        id => {

            const object =
                getObject(id);


            if (
                shown.has(
                    object.rarity
                )
            )
                return;


            shown.add(
                object.rarity
            );


            const row =
                document.createElement(
                    "div"
                );


            row.className =
                "rate-row";


            row.innerHTML = `

                <div
                    class="rate-name"
                >

                    <span
                        class="rate-dot"
                        style="
                            --rarity:
                            ${rarityColors[object.rarity]};
                        "
                    ></span>

                    ${object.rarity.toUpperCase()}

                </div>

                <span
                    class="rate-value"
                >
                    ${object.chance}%
                </span>

            `;


            gacha.rateList.appendChild(
                row
            );

        }
    );

}


updateBanner();

setInterval(
    updateBanner,
    1000
);


/* =========================================================
   RANDOM OBJECT
========================================================= */

function weightedRandom() {

    const banner =
        currentBanner();


    const available =
        banner.objects.map(
            id =>
                getObject(id)
        );


    let total =
        available.reduce(
            (
                sum,
                object
            ) =>
                sum +
                object.chance,
            0
        );


    let random =
        Math.random() *
        total;


    for (
        const object
        of available
    ) {

        random -=
            object.chance;


        if (
            random <= 0
        ) {

            return object;

        }

    }


    return available[0];

}


/* =========================================================
   CINEMATIC
========================================================= */

function createCinematic() {

    const element =
        document.createElement(
            "div"
        );


    element.id =
        "gachaCinematic";


    element.className =
        "gacha-cinematic";


    element.innerHTML = `

        <div
            class="cinematic-space"
        ></div>

        <div
            class="cinematic-stars"
        ></div>

        <div
            class="cinematic-stars layer2"
        ></div>

        <div
            class="cinematic-stars layer3"
        ></div>

        <div
            class="cinematic-nebula"
        ></div>

        <div
            class="cinematic-lens"
        ></div>

        <div
            class="cinematic-reticle"
        ></div>

        <div
            class="search-particles"
            id="searchParticles"
        ></div>

        <div
            class="cinematic-target"
            id="cinematicTarget"
        ></div>

        <div
            class="cinematic-energy"
            id="cinematicEnergy"
        ></div>

        <div
            class="cinematic-object"
            id="cinematicObject"
        ></div>

        <div
            class="cinematic-result"
            id="cinematicResult"
        >

            <div
                class="cinematic-result-rarity"
                id="resultRarity"
            ></div>

            <div
                class="cinematic-result-name"
                id="resultName"
            ></div>

        </div>

        <div
            class="cinematic-corners"
        ></div>

        <div
            class="cinematic-status"
            id="cinematicStatus"
        ></div>

    `;


    document.body.appendChild(
        element
    );


    return element;

}


const cinematic =
    createCinematic();


const cinematicTarget =
    $("cinematicTarget");

const cinematicEnergy =
    $("cinematicEnergy");

const cinematicObject =
    $("cinematicObject");

const cinematicResult =
    $("cinematicResult");

const resultRarity =
    $("resultRarity");

const resultName =
    $("resultName");

const cinematicStatus =
    $("cinematicStatus");

const searchParticles =
    $("searchParticles");


/* =========================================================
   PARTICLES
========================================================= */

function particles(
    color,
    amount
) {

    searchParticles.innerHTML =
        "";


    for (
        let i = 0;
        i < amount;
        i++
    ) {

        const particle =
            document.createElement(
                "div"
            );


        particle.className =
            "search-particle";


        particle.style.color =
            color;


        particle.style.setProperty(
            "--x",
            `${Math.random() * 100}%`
        );


        particle.style.setProperty(
            "--y",
            `${Math.random() * 100}%`
        );


        particle.style.animationDelay =
            `${Math.random() * .25}s`;


        searchParticles.appendChild(
            particle
        );

    }

}


/* =========================================================
   SET OBJECT VISUAL
========================================================= */

function setCinematicObject(
    object
) {

    cinematicObject.className =
        "cinematic-object";


    cinematicObject.style
        .setProperty(
            "--object-color",
            object.color
        );


    cinematicObject.style.background =
        `
        radial-gradient(
            circle at 30% 25%,
            white 0%,
            ${object.color} 36%,
            #050611 100%
        )
        `;


    cinematicObject.style.boxShadow =
        `
        0 0 110px
        ${object.color},

        0 0 220px
        ${object.color}55
        `;


    if (
        object.id ===
        "blackhole"
    ) {

        cinematicObject.style.background =
            `
            radial-gradient(
                circle,
                #000 0 23%,
                #ff6200 29%,
                #ffcf4c 37%,
                #8b27ff 50%,
                #16051e 68%,
                #000 80%
            )
            `;

    }


    if (
        object.id ===
        "supernova"
    ) {

        cinematicObject.style.background =
            `
            radial-gradient(
                circle,
                white 0%,
                #fff6a6 10%,
                #ff8245 27%,
                #d93aff 52%,
                #3a0955 72%,
                #05010b
            )
            `;

    }


    if (
        object.id ===
        "saturn"
    ) {

        cinematicObject.style.background =
            `
            radial-gradient(
                circle at 32% 25%,
                #fff4bf,
                #d2a35c 43%,
                #76512b 78%,
                #21130b
            )
            `;

    }

}


/* =========================================================
   GACHA
========================================================= */

let rolling =
    false;


gacha.button.addEventListener(
    "click",
    startGacha
);


async function startGacha() {

    if (rolling)
        return;


    const cost =
        100;


    if (
        player.stardust <
        cost
    ) {

        showNotification(
            "YOU NEED 100 STARDUST"
        );

        playErrorSound();

        return;

    }


    rolling =
        true;


    gacha.button.disabled =
        true;


    player.stardust -=
        cost;


    updateUI();


    const result =
        weightedRandom();


    await runGachaAnimation(
        result
    );


    finishGacha(
        result
    );

}


/* =========================================================
   SHORTER CINEMATIC
========================================================= */

async function runGachaAnimation(
    object
) {

    setCinematicObject(
        object
    );


    /*
        Reset.
    */

    cinematic.classList.remove(
        "zooming"
    );

    cinematicTarget.classList.remove(
        "found"
    );

    cinematicEnergy.classList.remove(
        "fire"
    );

    cinematicObject.classList.remove(
        "reveal"
    );

    cinematicResult.classList.remove(
        "show"
    );


    document
        .querySelectorAll(
            ".cinematic-stars"
        )
        .forEach(
            stars => {

                stars.style.opacity =
                    "";

                stars.style.animationDuration =
                    "";

            }
        );


    /*
        ENTER
        0.0s -> 0.4s
    */

    cinematic.classList.add(
        "active"
    );


    await wait(350);


    /*
        ZOOM
        0.4s -> 1.8s
    */

    cinematic.classList.add(
        "zooming"
    );


    cinematicStatus.textContent =
        "";


    playTelescopeStartSound();


    document
        .querySelectorAll(
            ".cinematic-stars"
        )
        .forEach(
            stars => {

                stars.style.animationDuration =
                    "3s";

            }
        );


    await wait(900);


    /*
        SEARCH
        1.8s -> 3.0s
    */

    particles(
        "#ffffff",
        45
    );


    playScanningSound();


    await wait(650);


    cinematicTarget.classList.add(
        "found"
    );


    playSignalSound();


    await wait(450);


    /*
        RARITY
        3.0s -> 4.0s
    */

    document
        .querySelectorAll(
            ".cinematic-stars"
        )
        .forEach(
            stars => {

                stars.style.opacity =
                    ".08";

            }
        );


    cinematicEnergy.style.background =
        `
        radial-gradient(
            circle,
            white 0%,
            ${rarityColors[object.rarity]} 20%,
            transparent 70%
        )
        `;


    cinematicEnergy.classList.remove(
        "fire"
    );


    void cinematicEnergy.offsetWidth;


    cinematicEnergy.classList.add(
        "fire"
    );


    particles(
        rarityColors[
            object.rarity
        ],

        object.rarity === "legendary"
            ? 100
            : object.rarity === "epic"
                ? 70
                : 40
    );


    playRaritySound(
        object.rarity
    );


    await wait(850);


    /*
        REVEAL
        4.0s -> 5.2s
    */

    cinematicTarget.classList.remove(
        "found"
    );


    cinematicObject.classList.add(
        "reveal"
    );


    playRevealSound(
        object.rarity
    );


    await wait(1050);


    /*
        RESULT
    */

    resultRarity.textContent =
        object.rarity.toUpperCase();


    resultRarity.style.color =
        rarityColors[
            object.rarity
        ];


    resultName.textContent =
        object.name;


    cinematicResult.classList.add(
        "show"
    );


    await wait(900);


    /*
        EXIT
    */

    cinematic.classList.remove(
        "active"
    );


    await wait(450);


    cinematicResult.classList.remove(
        "show"
    );

    cinematicObject.classList.remove(
        "reveal"
    );

    cinematicEnergy.classList.remove(
        "fire"
    );

    searchParticles.innerHTML =
        "";

}


/* =========================================================
   FINISH
========================================================= */

function finishGacha(
    object
) {

    const owned =
        player.discovered.includes(
            object.id
        );


    if (!owned) {

        player.discovered.push(
            object.id
        );

        player.totalDiscoveries++;


        if (
            rarityOrder.indexOf(
                object.rarity
            ) >
            rarityOrder.indexOf(
                player.rarest
            )
        ) {

            player.rarest =
                object.rarity;

        }


        showNotification(
            "NEW DISCOVERY — " +
            object.name
        );

    }
    else {

        showNotification(
            object.name +
            " DISCOVERED AGAIN"
        );

    }


    /*
        Pull reward.
    */

    player.stardust +=
        object.power;


    /*
        Automatically equip.
    */

    player.equipped =
        object.id;


    rolling =
        false;


    gacha.button.disabled =
        false;


    updateUI();

}


/* =========================================================
   NAVIGATION
========================================================= */

document
    .querySelectorAll(
        ".nav-button"
    )
    .forEach(
        button => {

            button.addEventListener(
                "click",
                () => {

                    if (rolling)
                        return;


                    switchPage(
                        button.dataset.page
                    );

                }
            );

        }
    );


function switchPage(
    page
) {

    document
        .querySelectorAll(
            ".page"
        )
        .forEach(
            element => {

                element.classList.remove(
                    "active"
                );

            }
        );


    $(page)
        .classList.add(
            "active"
        );


    document
        .querySelectorAll(
            ".nav-button"
        )
        .forEach(
            button => {

                button.classList.toggle(
                    "active",
                    button.dataset.page ===
                    page
                );

            }
        );


    /*
        Refresh leaderboard when opened.
    */

    if (
        page ===
        "leaderboardPage"
    ) {

        renderLeaderboard();

    }

}


/* =========================================================
   LEADERBOARD
========================================================= */

const fakePlayers = [

    {
        name: "Nova",
        stardust: 4829402,
        rarity: "legendary",
        discoveries: 41
    },

    {
        name: "Stellar",
        stardust: 3910281,
        rarity: "epic",
        discoveries: 36
    },

    {
        name: "Cosmo",
        stardust: 2839012,
        rarity: "epic",
        discoveries: 31
    },

    {
        name: "Orbit",
        stardust: 1938291,
        rarity: "rare",
        discoveries: 28
    },

    {
        name: "Astrid",
        stardust: 1204822,
        rarity: "rare",
        discoveries: 25
    }

];


let leaderboardMode =
    "stardust";


document
    .querySelectorAll(
        ".leader-tab"
    )
    .forEach(
        button => {

            button.addEventListener(
                "click",
                () => {

                    document
                        .querySelectorAll(
                            ".leader-tab"
                        )
                        .forEach(
                            b =>
                                b.classList.remove(
                                    "active"
                                )
                        );


                    button.classList.add(
                        "active"
                    );


                    leaderboardMode =
                        button.dataset.board;


                    renderLeaderboard();

                }
            );

        }
    );


function renderLeaderboard() {

    const players = [

        ...fakePlayers,

        {
            name: "YOU",

            stardust:
                player.stardust,

            rarity:
                player.rarest,

            discoveries:
                player.discovered.length
        }

    ];


    if (
        leaderboardMode ===
        "stardust"
    ) {

        players.sort(
            (a,b) =>
                b.stardust -
                a.stardust
        );

    }


    if (
        leaderboardMode ===
        "discoveries"
    ) {

        players.sort(
            (a,b) =>
                b.discoveries -
                a.discoveries
        );

    }


    if (
        leaderboardMode ===
        "rarity"
    ) {

        players.sort(
            (a,b) =>
                rarityOrder.indexOf(
                    b.rarity
                )
                -
                rarityOrder.indexOf(
                    a.rarity
                )
        );

    }


    $("leaderboardList")
        .innerHTML =
        "";


    players
        .slice(0,10)
        .forEach(
            (playerData,index) => {

                const row =
                    document.createElement(
                        "div"
                    );


                row.className =
                    "leader-row";


                let score;


                if (
                    leaderboardMode ===
                    "stardust"
                ) {

                    score =
                        formatNumber(
                            playerData.stardust
                        ) +
                        " ✦";

                }


                if (
                    leaderboardMode ===
                    "discoveries"
                ) {

                    score =
                        playerData.discoveries +
                        " OBJECTS";

                }


                if (
                    leaderboardMode ===
                    "rarity"
                ) {

                    score =
                        playerData.rarity
                            .toUpperCase();

                }


                row.innerHTML = `

                    <div
                        class="leader-rank"
                    >
                        #${index + 1}
                    </div>

                    <div
                        class="leader-player"
                    >
                        ${playerData.name}
                    </div>

                    <div
                        class="leader-score"
                    >
                        ${score}
                    </div>

                `;


                $("leaderboardList")
                    .appendChild(
                        row
                    );

            }
        );

}


renderLeaderboard();


/* =========================================================
   NOTIFICATIONS
========================================================= */

let notificationTimeout;


function showNotification(
    text
) {

    notification.textContent =
        text;


    notification.classList.add(
        "show"
    );


    clearTimeout(
        notificationTimeout
    );


    notificationTimeout =
        setTimeout(
            () => {

                notification.classList.remove(
                    "show"
                );

            },
            1700
        );

}


/* =========================================================
   AUDIO
========================================================= */

let audioContext =
    null;


function audio() {

    if (!audioContext) {

        audioContext =
            new (
                window.AudioContext ||
                window.webkitAudioContext
            )();

    }


    if (
        audioContext.state ===
        "suspended"
    ) {

        audioContext.resume();

    }


    return audioContext;

}


function tone(
    frequency,
    duration,
    type = "sine",
    volume = .04,
    delay = 0
) {

    const ctx =
        audio();


    const oscillator =
        ctx.createOscillator();

    const gain =
        ctx.createGain();


    oscillator.type =
        type;

    oscillator.frequency.value =
        frequency;


    gain.gain.setValueAtTime(
        0,
        ctx.currentTime +
        delay
    );


    gain.gain.linearRampToValueAtTime(
        volume,
        ctx.currentTime +
        delay +
        .01
    );


    gain.gain.exponentialRampToValueAtTime(
        .001,
        ctx.currentTime +
        delay +
        duration
    );


    oscillator.connect(
        gain
    );

    gain.connect(
        ctx.destination
    );


    oscillator.start(
        ctx.currentTime +
        delay
    );


    oscillator.stop(
        ctx.currentTime +
        delay +
        duration +
        .05
    );

}


function playCollectSound(
    rarity
) {

    const base =
        rarity === "legendary"
            ? 700
            : rarity === "epic"
                ? 500
                : 360;


    tone(
        base,
        .08,
        "sine",
        .03
    );

    tone(
        base * 1.5,
        .12,
        "sine",
        .022,
        .05
    );

}


function playEquipSound() {

    tone(
        420,
        .08,
        "triangle",
        .025
    );

    tone(
        620,
        .12,
        "triangle",
        .025,
        .06
    );

}


function playErrorSound() {

    tone(
        120,
        .15,
        "sawtooth",
        .035
    );

}


function playTelescopeStartSound() {

    tone(
        120,
        .3,
        "sine",
        .025
    );

    tone(
        180,
        .4,
        "sine",
        .018,
        .14
    );

}


function playScanningSound() {

    tone(
        250,
        .35,
        "triangle",
        .018
    );

    tone(
        330,
        .4,
        "triangle",
        .014,
        .15
    );

}


function playSignalSound() {

    tone(
        500,
        .08,
        "sine",
        .035
    );

    tone(
        800,
        .12,
        "sine",
        .04,
        .08
    );

}


function playRaritySound(
    rarity
) {

    if (
        rarity ===
        "common"
    ) {

        tone(
            440,
            .12,
            "sine",
            .025
        );

    }


    if (
        rarity ===
        "uncommon"
    ) {

        tone(
            440,
            .1,
            "sine",
            .025
        );

        tone(
            660,
            .15,
            "sine",
            .03,
            .07
        );

    }


    if (
        rarity ===
        "rare"
    ) {

        tone(
            500,
            .1,
            "sine",
            .03
        );

        tone(
            750,
            .13,
            "sine",
            .035,
            .08
        );

        tone(
            1000,
            .18,
            "sine",
            .04,
            .16
        );

    }


    if (
        rarity ===
        "epic"
    ) {

        tone(
            400,
            .15,
            "triangle",
            .03
        );

        tone(
            600,
            .16,
            "triangle",
            .035,
            .08
        );

        tone(
            900,
            .24,
            "triangle",
            .04,
            .16
        );

    }


    if (
        rarity ===
        "legendary"
    ) {

        tone(
            300,
            .25,
            "sine",
            .035
        );

        tone(
            500,
            .25,
            "sine",
            .04,
            .14
        );

        tone(
            750,
            .3,
            "sine",
            .045,
            .28
        );

        tone(
            1100,
            .45,
            "sine",
            .05,
            .42
        );

    }

}


function playRevealSound(
    rarity
) {

    const multiplier =
        rarity === "legendary"
            ? 2
            : rarity === "epic"
                ? 1.5
                : 1;


    tone(
        220 * multiplier,
        .28,
        "sine",
        .035
    );

    tone(
        330 * multiplier,
        .32,
        "sine",
        .035,
        .06
    );

    tone(
        550 * multiplier,
        .4,
        "sine",
        .045,
        .12
    );

}


/* =========================================================
   START
========================================================= */

updateUI();

updateBanner();

renderLeaderboard();
