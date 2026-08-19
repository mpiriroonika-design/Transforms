// ======================================================
// Geometry Transform Game - main.js
// ======================================================

// --------------------
// ابزارهای پایه
// --------------------

const sourceArea = document.getElementById("source-area");
const targetArea = document.getElementById("target-area");

const player1Code = document.getElementById("player1-code");
const player2Code = document.getElementById("player2-code");

const player1Transformations = [];
const player2Transformations = [];

const player1TransformationData = [];
const player2TransformationData = [];

let aiPath = [];
let aiTurnTimeout = null;
// ======================================================
// ثبت تبدیل برای هر بازیکن
// ======================================================
function resetPlayerAnswers() {

    player1Transformations.length = 0;
    player2Transformations.length = 0;

    player1TransformationData.length = 0;
    player2TransformationData.length = 0;

    player1Code.innerHTML = "";
    player2Code.innerHTML = "";

    const feedback1 =
        document.getElementById("player1-feedback");

    const feedback2 =
        document.getElementById("player2-feedback");

    if (feedback1) {
        feedback1.textContent = "";
    }

    if (feedback2) {
        feedback2.textContent = "";
    }
}
function addTransformation(player, name) {

    const item = document.createElement("span");
    item.className = "transform-item";

    const text = document.createElement("span");
    text.textContent = name;

    item.appendChild(text);

    // --------------------
    // بازیکن اول
    // --------------------

    if (player === 1) {

        player1Transformations.push(name);

        const deleteButton =
            document.createElement("button");

        deleteButton.type = "button";
        deleteButton.textContent = "×";
        deleteButton.className =
            "delete-transform";

        deleteButton.addEventListener(
            "click",
            function () {

                const index =
                    Array.from(
                        player1Code.children
                    ).indexOf(item);

                if (index === -1) {
                    return;
                }

                // حذف از آرایه نمایشی
                player1Transformations.splice(
                    index,
                    1
                );

                // حذف از داده اصلی بازیکن
                player1TransformationData.splice(
                    index,
                    1
                );

                // حذف از صفحه
                item.remove();
            }
        );

        item.appendChild(deleteButton);

        player1Code.appendChild(item);
    }


    // --------------------
    // بازیکن دوم
    // --------------------

    if (player === 2) {

        player2Transformations.push(name);

        player2Code.appendChild(item);
    }
}


// ======================================================
// پنجره انتخاب گزینه‌های تبدیل
// هر بازیکن پنجره مخصوص خودش را دارد.
// ======================================================

function clearPlayerOptions(player) {

    const button = document.getElementById(
        `player${player}-translate`
    );

    if (!button) return;

    const panel = button.closest(".player-panel");

    if (!panel) return;

    const oldOptions = panel.querySelector(".player-transform-options");

    if (oldOptions) {
        oldOptions.remove();
    }
}


function showPlayerOptions(player, html, onReady) {

    clearPlayerOptions(player);

    const button = document.getElementById(
        `player${player}-translate`
    );

    if (!button) return;

    const panel = button.closest(".player-panel");

    if (!panel) return;

    const options = document.createElement("div");

    options.className = "player-transform-options";
    options.innerHTML = html;

    const tools = panel.querySelector(".player-tools");

    if (tools) {
        tools.insertAdjacentElement("afterend", options);
    } else {
        button.insertAdjacentElement("afterend", options);
    }

    if (typeof onReady === "function") {
        onReady(options);
    }
}


// ======================================================
// انتقال
// ======================================================

function setupTranslate(player) {

    const button = document.getElementById(
        `player${player}-translate`
    );

    if (!button) return;
    if (player === 2) {
    button.disabled = true;
}
    button.addEventListener("click", function () {

        addTransformation(
            player,
            "انتقال"
        );

        const data = {
            type: "translate"
        };

        if (player === 1) {
            player1TransformationData.push(data);
        } else {
            player2TransformationData.push(data);
        }

    });
}


// ======================================================
// دوران
// ======================================================

function setupRotate(player) {

    const cwButton = document.getElementById(
        `player${player}-rotate-cw`
    );

    const ccwButton = document.getElementById(
        `player${player}-rotate-ccw`
    );

    if (player === 2) {
    if (cwButton) cwButton.disabled = true;
    if (ccwButton) ccwButton.disabled = true;
}
    // --------------------
    // دوران ساعتگرد
    // --------------------

    if (cwButton) {

        cwButton.addEventListener("click", function () {

            addTransformation(
                player,
                "دوران ساعتگرد"
            );

            const data = {
                type: "rotate",
                direction: "clockwise"
            };

            if (player === 1) {
                player1TransformationData.push(data);
            } else {
                player2TransformationData.push(data);
            }

        });

    }


    // --------------------
    // دوران پادساعتگرد
    // --------------------

    if (ccwButton) {

        ccwButton.addEventListener("click", function () {

            addTransformation(
                player,
                "دوران پادساعتگرد"
            );

            const data = {
                type: "rotate",
                direction: "counterclockwise"
            };

            if (player === 1) {
                player1TransformationData.push(data);
            } else {
                player2TransformationData.push(data);
            }

        });

    }

}
// ======================================================
// تقارن
// ======================================================

function setupReflect(player) {

    const button = document.getElementById(
        `player${player}-reflect`
    );

    if (!button) return;
    if (player === 2) {
    button.disabled = true;
}
    button.addEventListener("click", function () {

        addTransformation(
            player,
            "تقارن"
        );

        const data = {
            type: "reflect"
        };

        if (player === 1) {
            player1TransformationData.push(data);
        } else {
            player2TransformationData.push(data);
        }

    });
}
function setAIAnswer(path) {

    // پاک کردن پاسخ قبلی AI
    player2Transformations.length = 0;
    player2TransformationData.length = 0;

    // پاک کردن کد نمایش‌داده‌شده
    if (player2Code) {
        player2Code.innerHTML = "";
    }

    // ثبت تک‌تک تبدیل‌های مسیر AI
    path.forEach(function (transform) {

        // --------------------
        // انتقال
        // --------------------

        if (transform.type === "translate") {

            addTransformation(
                2,
                "انتقال"
            );

            player2TransformationData.push({
                type: "translate",
                dx: transform.dx,
                dy: transform.dy
            });
        }


        // --------------------
        // دوران
        // --------------------

        else if (transform.type === "rotate") {

            let name =
                transform.direction === "clockwise"
                    ? "دوران ساعتگرد"
                    : "دوران پادساعتگرد";

            addTransformation(
                2,
                name
            );

            player2TransformationData.push({
                type: "rotate",
                angle: transform.angle,
                direction: transform.direction
            });
        }


        // --------------------
        // تقارن
        // --------------------

        else if (transform.type === "reflect") {

            addTransformation(
                2,
                "تقارن"
            );

            player2TransformationData.push({
                type: "reflect",
                axis: transform.axis
            });
        }

    });

    console.log(
        "🤖 کد AI ثبت شد:",
        player2TransformationData
    );
    console.log(
    "🔥 بلافاصله بعد از setAIAnswer:",
    JSON.stringify(player2TransformationData)
);
}

function startAITurn(path) {
    if (aiTurnTimeout !== null) {

    clearTimeout(aiTurnTimeout);

    aiTurnTimeout = null;

    stopPlayerTimer(2);
}
    startPlayerTimer(2);
    const aiDelay =
        2500 + (path.length * 1200);

    console.log(
        "🤖 زمان حل AI:",
        aiDelay,
        "میلی‌ثانیه"
    );
    console.log(
        "🤖 startAITurn دریافت کرد:",
        JSON.stringify(path)
);
    aiTurnTimeout = setTimeout(function () {
        aiTurnTimeout = null;
        console.log(
            "AI ORIGINAL BEFORE ANSWER:",
            JSON.stringify(originalShape)
        );

        console.log(
            "AI TARGET BEFORE ANSWER:",
            JSON.stringify(targetShapeTransformed)
        );

        // ثبت پاسخ AI
        setAIAnswer(path);
        console.log(
    "🤖 PATH:",
    JSON.stringify(path)
);

console.log(
    "🤖 PLAYER2 DATA:",
    JSON.stringify(player2TransformationData)
);
        // توقف زمان‌سنج AI
        stopPlayerTimer(2);
        const aiCorrect =
            judgeByFinalShape(
                originalShape,
                player2TransformationData,
                targetShapeTransformed
            );


if (aiCorrect) {

    player2CorrectCount++;

    // امتیاز AI برای سؤال تصویری
    const elapsedSeconds =
        player2Elapsed / 1000;

    const remainingTime =
        Math.max(
            0,
            30 - elapsedSeconds
        );

    const questionScore =
        10 + remainingTime;

    player2Score +=
        questionScore;

    console.log(
        "⭐ امتیاز این سؤال AI:",
        questionScore
    );

    console.log(
        "🏆 امتیاز کل AI:",
        player2Score
    );

} else {

    player2WrongCount++;
}

player2TotalTime +=
    player2Elapsed;

updateScoreBoard();
console.log("🤖 ✓ درست:", player2CorrectCount);
console.log("🤖 ✗ غلط:", player2WrongCount);
console.log("🤖 ⏱ زمان کل:", player2TotalTime);
        // داوری AI
        
        console.log(
            "🤖 نتیجه داوری AI:",
            aiCorrect
        );

        const feedback =
            document.getElementById(
                "player2-feedback"
            );

        if (aiCorrect) {

    feedback.classList.remove(
        "wrong",
        "show"
    );

    feedback.classList.add(
        "correct",
        "show"
    );

    feedback.textContent =
        "🤖 پاسخ هوش مصنوعی صحیح است.";

} else {

    feedback.classList.remove(
        "correct",
        "show"
    );

    feedback.classList.add(
        "wrong",
        "show"
    );

    feedback.textContent =
        "🤖 پاسخ هوش مصنوعی نادرست است.";
}

    }, aiDelay);
}
function startAIVideoTurn(videoIndex) {

  

    const challenge =
        videoChallenges[videoIndex];

    if (!challenge) {

        console.log(
            "❌ چالش ویدیویی برای AI پیدا نشد:",
            videoIndex
        );

        stopPlayerTimer(2);

        return;
    }

    // پاسخ صحیح AI
    let aiAnswer;

    if (challenge.answer) {

        aiAnswer =
            challenge.answer;

    }

    else if (
        challenge.possibleAnswers &&
        challenge.possibleAnswers.length > 0
    ) {

        // فعلاً اولین پاسخ مجاز را انتخاب می‌کند
        aiAnswer =
            challenge.possibleAnswers[0];

    }

    else {

        console.log(
            "❌ پاسخ AI برای این ویدیو تعریف نشده."
        );

        stopPlayerTimer(2);

        return;
    }

    console.log(
        "🤖 پاسخ AI برای ویدیو:",
        JSON.stringify(aiAnswer)
    );

    // کمی تأخیر برای شبیه‌سازی زمان حل
    const aiDelay =
        2500 + (aiAnswer.length * 1200);

    console.log(
        "🤖 زمان حل ویدیوی AI:",
        aiDelay
    );

    aiTurnTimeout = setTimeout(function () {

        // ثبت کد AI
        setAIAnswer(
            aiAnswer
        );

        console.log(
            "🤖 کد AI ثبت شد:",
            JSON.stringify(
                player2TransformationData
            )
        );

        // توقف زمان‌سنج
        stopPlayerTimer(2);
        console.log(
        "⏱️ تایمر AI متوقف شد."
    );
        // داوری پاسخ AI
        const aiCorrect =
            judgeVideoAnswer(
                player2TransformationData,
                videoIndex
            );

        console.log(
            "🤖 نتیجه داوری AI ویدیو:",
            aiCorrect
        );

        if (aiCorrect) {

            player2CorrectCount++;

        } else {

            player2WrongCount++;

        }

        player2TotalTime +=
            player2Elapsed;

        updateScoreBoard();

        console.log(
            "🤖 ✓ درست:",
            player2CorrectCount
        );

        console.log(
            "🤖 ✗ غلط:",
            player2WrongCount
        );

        console.log(
            "🤖 ⏱ زمان کل:",
            player2TotalTime
        );

        aiTurnTimeout = null;

}, aiDelay);
}
setupTranslate(1);
setupTranslate(2);

setupRotate(1);
setupRotate(2);

setupReflect(1);
setupReflect(2);

// ======================================================
// ثبت پاسخ
// ======================================================
// ======================================================
// داور هندسی بازیکن اول
// ======================================================

// مقایسه دو شکل
function areShapesEqual(shape1, shape2) {

    if (shape1.length !== shape2.length) {
        return false;
    }

    const sorted1 = [...shape1].sort(
        (a, b) => a.x - b.x || a.y - b.y
    );

    const sorted2 = [...shape2].sort(
        (a, b) => a.x - b.x || a.y - b.y
    );

    for (let i = 0; i < sorted1.length; i++) {

        if (
            sorted1[i].x !== sorted2[i].x ||
            sorted1[i].y !== sorted2[i].y
        ) {
            return false;
        }
    }

    return true;
}


// ======================================================
// تبدیل انتخاب بازیکن به حالت‌های هندسی ممکن
// ======================================================

function getPossibleTransformations(
    transformation
) {

    // --------------------
    // انتقال
    // --------------------

    if (transformation.type === "translate") {

        return [

            {
                type: "translate",
                dx: 40,
                dy: 0
            },

            {
                type: "translate",
                dx: -40,
                dy: 0
            },

            {
                type: "translate",
                dx: 0,
                dy: 40
            },

            {
                type: "translate",
                dx: 0,
                dy: -40
            },

            {
                type: "translate",
                dx: 60,
                dy: 0
            },

            {
                type: "translate",
                dx: -60,
                dy: 0
            },

            {
                type: "translate",
                dx: 0,
                dy: 60
            },

            {
                type: "translate",
                dx: 0,
                dy: -60
            }

        ];
    }


    // --------------------
    // دوران
    // --------------------

    if (transformation.type === "rotate") {

        return [

            {
                type: "rotate",
                angle: 90,
                direction:
                    transformation.direction
            },

            {
                type: "rotate",
                angle: 180,
                direction:
                    transformation.direction
            },

            {
                type: "rotate",
                angle: 270,
                direction:
                    transformation.direction
            }

        ];
    }


    // --------------------
    // تقارن
    // --------------------

    if (transformation.type === "reflect") {

        return [

            {
                type: "reflect",
                axis: "vertical"
            },

            {
                type: "reflect",
                axis: "horizontal"
            }

        ];
    }


    return [];
}
function judgePlayer1Answer(playerAnswer) {

    if (
        !playerAnswer ||
        playerAnswer.length === 0
    ) {
        return false;
    }

    // برای هر تبدیل انتخاب‌شده،
    // حالت‌های هندسی ممکن را می‌سازیم.
    const possibleLists =
        playerAnswer.map(
            getPossibleTransformations
        );


    // ساخت همه مسیرهای ممکن
    function testPath(
        index,
        currentShape
    ) {

        // همه تبدیل‌ها بررسی شده‌اند
        if (index === possibleLists.length) {

            return areShapesEqual(
                currentShape,
                targetShapeTransformed
            );
        }


        const possibleTransformations =
            possibleLists[index];


        for (
            const transformation
            of possibleTransformations
        ) {

            const nextShape =
                applyTransformations(
                    currentShape,
                    [transformation]
                );


            if (
                testPath(
                    index + 1,
                    nextShape
                )
            ) {
                return true;
            }
        }


        return false;
    }


    return testPath(
        0,
        originalShape
    );
}

function judgeVideoAnswer(playerAnswer, videoIndex) {

    if (
        !playerAnswer ||
        playerAnswer.length === 0
    ) {
        return false;
    }

    const challenge =
        videoChallenges[videoIndex];

    if (!challenge) {
        return false;
    }

    // فقط نوع تبدیل‌ها را استخراج می‌کنیم
    // و جزئیاتی مثل زاویه و جهت دوران را نادیده می‌گیریم.
    function getTypes(answer) {

        return answer.map(
            transformation => transformation.type
        );

    }

    const playerTypes =
        getTypes(playerAnswer);


    // -----------------------------
    // یک پاسخ صحیح
    // -----------------------------

    if (challenge.answer) {

        const correctTypes =
            getTypes(challenge.answer);

        return (
            JSON.stringify(playerTypes)
            ===
            JSON.stringify(correctTypes)
        );
    }


    // -----------------------------
    // چند پاسخ صحیح مجاز
    // -----------------------------

    if (challenge.possibleAnswers) {

        return challenge.possibleAnswers.some(
            possibleAnswer => {

                const possibleTypes =
                    getTypes(possibleAnswer);

                return (
                    JSON.stringify(playerTypes)
                    ===
                    JSON.stringify(possibleTypes)
                );

            }
        );
    }


    return false;
}

const submitPlayer1 =
    document.getElementById("submit-player1");

const submitPlayer2 =
    document.getElementById("submit-player2");
function areShapesEqual(shape1, shape2) {

    if (shape1.length !== shape2.length) {
        return false;
    }

    const sorted1 = [...shape1].sort(
        (a, b) => a.x - b.x || a.y - b.y
    );

    const sorted2 = [...shape2].sort(
        (a, b) => a.x - b.x || a.y - b.y
    );

    for (let i = 0; i < sorted1.length; i++) {

        if (
            sorted1[i].x !== sorted2[i].x ||
            sorted1[i].y !== sorted2[i].y
        ) {
            return false;
        }
    }

    return true;
}
function judgeAnswer(playerAnswer, targetShape) {

    // بازیکن باید حداقل یک تبدیل انتخاب کرده باشد
    if (playerAnswer.length === 0) {
        return false;
    }

    // اجرای تبدیل‌های انتخاب‌شده توسط بازیکن
    const playerResult =
        applyTransformations(
            originalShape,
            playerAnswer
        );

    // مقایسه شکل حاصل با شکل هدف
    return areShapesEqual(
        playerResult,
        targetShape
    );
}
let player1CorrectCount = 0;
let player1WrongCount = 0;

let player2CorrectCount = 0;
let player2WrongCount = 0;

let player1TotalTime = 0;
let player2TotalTime = 0;
let player1Score = 0;
let player2Score = 0;
if (submitPlayer1) {
    submitPlayer1.addEventListener("click", function (event) {

    console.log(
        "🟣 SUBMIT CLICK:",
        event.isTrusted,
        event.detail
    );
        stopPlayerTimer(1);

        const feedback =
            document.getElementById("player1-feedback");
        console.log(
    "🧪 پاسخ فعلی بازیکن:",
    JSON.stringify(player1TransformationData)
);
        let isCorrect;

if (
    currentQuestion &&
    currentQuestion.type === "video"
) {

    isCorrect =
        judgeVideoAnswer(
            player1TransformationData,
            currentQuestion.videoIndex
        );

    console.log(
        "🎬 داوری ویدیو:",
        isCorrect
    );

} else {

    isCorrect =
        judgePlayer1Answer(
            player1TransformationData
        );

    console.log(
        "🖼️ داوری سؤال تصویری:",
        isCorrect
    );
}
        if (isCorrect) {

    player1CorrectCount++;

    // فقط سؤال‌های تصویری امتیاز دارند
    if (currentQuestion.type === "image") {

        const elapsedSeconds =
            player1Elapsed / 1000;

        const remainingTime =
            Math.max(
                0,
                30 - elapsedSeconds
            );

        const questionScore =
            10 + remainingTime;

        player1Score +=
            questionScore;

        console.log(
            "⭐ امتیاز این سؤال:",
            questionScore
        );

        console.log(
            "🏆 امتیاز کل بازیکن:",
            player1Score
        );
    }

} else {

    player1WrongCount++;
}

player1TotalTime +=
    player1Elapsed;

updateScoreBoard();
        console.log("✓ درست:", player1CorrectCount);
console.log("✗ غلط:", player1WrongCount);
console.log("⏱ زمان کل:", player1TotalTime);

        if (feedback) {

            if (isCorrect) {

    feedback.classList.remove(
        "wrong",
        "show"
    );

    feedback.classList.add(
        "correct",
        "show"
    );

    feedback.textContent =
        "✅ پاسخ صحیح است!";

} else {

    feedback.classList.remove(
        "correct",
        "show"
    );

    feedback.classList.add(
        "wrong",
        "show"
    );

    feedback.textContent =
        "❌ پاسخ نادرست است.";
}
        }
    });
}


if (submitPlayer2) {
    submitPlayer2.addEventListener("click", function () {

        stopPlayerTimer(2);

        const feedback =
            document.getElementById("player2-feedback");

        const isCorrect = judgeAnswer(
            player2TransformationData,
            correctTransformations,
            false
        );

        if (feedback) {

            if (isCorrect) {
                feedback.textContent =
                    "✅ پاسخ صحیح است!";
            } else {
                feedback.textContent =
                    "❌ پاسخ نادرست است.";
            }
        }
    });
}


// ======================================================
// مولد شکل هندسی
// ======================================================

function drawShape(points, svgId) {

    const svg = document.getElementById(svgId);

    if (!svg) return;

    svg.innerHTML = "";

    // -----------------------------
    // رسم شکل
    // -----------------------------

    const polygon = document.createElementNS(
        "http://www.w3.org/2000/svg",
        "polygon"
    );

    const pointString = points
        .map(point => `${point.x},${point.y}`)
        .join(" ");

    polygon.setAttribute(
        "points",
        pointString
    );

    polygon.setAttribute(
        "fill",
        "#dcecff"
    );

    polygon.setAttribute(
        "stroke",
        "#2563eb"
    );

    polygon.setAttribute(
        "stroke-width",
        "3"
    );

    svg.appendChild(polygon);


    // -----------------------------
    // مرکز دوران = مبدأ مختصات
    // -----------------------------

    const center = document.createElementNS(
        "http://www.w3.org/2000/svg",
        "circle"
    );

    center.setAttribute("cx", "0");
    center.setAttribute("cy", "0");
    center.setAttribute("r", "5");

    center.setAttribute(
        "fill",
        "#ef4444"
    );

    center.setAttribute(
        "stroke",
        "white"
    );

    center.setAttribute(
        "stroke-width",
        "2"
    );

    center.setAttribute(
        "pointer-events",
        "none"
    );

    svg.appendChild(center);


    // -----------------------------
    // برچسب مرکز دوران
    // -----------------------------

    const label = document.createElementNS(
        "http://www.w3.org/2000/svg",
        "text"
    );

    label.setAttribute("x", "9");
    label.setAttribute("y", "-9");

    label.setAttribute(
        "font-size",
        "12"
    );

    label.setAttribute(
        "font-family",
        "Tahoma, Arial, sans-serif"
    );

    label.setAttribute(
        "fill",
        "#ef4444"
    );

    label.setAttribute(
        "pointer-events",
        "none"
    );

    label.textContent =
        "مرکز دوران";

    svg.appendChild(label);
}
// ======================================================
// تولید شکل تصادفی
// ======================================================

function generateShape() {

    const shapes = [

        // شکل ۱
        [
            { x: -60, y: -40 },
            { x: 20,  y: -55 },
            { x: 65,  y: -10 },
            { x: 35,  y: 25 },
            { x: 55,  y: 65 },
            { x: -20, y: 45 },
            { x: -65, y: 15 }
        ],

        // شکل ۲
        [
            { x: -55, y: -50 },
            { x: 15,  y: -60 },
            { x: 60,  y: -20 },
            { x: 40,  y: 15 },
            { x: 5,   y: 5 },
            { x: 25,  y: 60 },
            { x: -50, y: 35 }
        ],

        // شکل ۳
        [
            { x: -65, y: -25 },
            { x: -20, y: -55 },
            { x: 55,  y: -40 },
            { x: 65,  y: 5 },
            { x: 20,  y: 20 },
            { x: 45,  y: 60 },
            { x: -35, y: 45 }
        ],

        // شکل ۴
        [
            { x: -60, y: -45 },
            { x: -5,  y: -60 },
            { x: 55,  y: -35 },
            { x: 35,  y: 5 },
            { x: 60,  y: 50 },
            { x: 0,   y: 35 },
            { x: -55, y: 55 }
        ]
    ];


    const randomIndex =
        Math.floor(
            Math.random() * shapes.length
        );


    return shapes[randomIndex].map(point => ({
        x: point.x,
        y: point.y
    }));
}

aiPath = [];
let originalShape = generateShape();

console.log(
    "شکل اصلی:",
    originalShape
);

drawShape(
    originalShape,
    "original-shape"
);


// ======================================================
// تبدیل‌های هندسی واقعی
// ======================================================

function translateShape(points, dx, dy) {
    return points.map(point => ({
        x: point.x + dx,
        y: point.y + dy
    }));
}


function rotateShape(points, angle, direction) {

    const radians =
        angle * Math.PI / 180;

    return points.map(point => {

        let x = point.x;
        let y = point.y;

        let newX;
        let newY;

        if (direction === "clockwise") {

            newX =
                x * Math.cos(radians) +
                y * Math.sin(radians);

            newY =
                -x * Math.sin(radians) +
                y * Math.cos(radians);

        } else {

            newX =
                x * Math.cos(radians) -
                y * Math.sin(radians);

            newY =
                x * Math.sin(radians) +
                y * Math.cos(radians);
        }

        return {
            x: Math.round(newX),
            y: Math.round(newY)
        };
    });
}


function reflectShape(points, axis) {

    return points.map(point => {

        if (axis === "vertical") {
            return {
                x: -point.x,
                y: point.y
            };
        }

        if (axis === "horizontal") {
            return {
                x: point.x,
                y: -point.y
            };
        }

        return {
            x: point.x,
            y: point.y
        };
    });
}


function applyTransformations(
    points,
    transformations
) {

    let result = points.map(point => ({
        x: point.x,
        y: point.y
    }));


    transformations.forEach(transform => {

        if (transform.type === "translate") {

            result =
                translateShape(
                    result,
                    transform.dx,
                    transform.dy
                );
        }


        else if (transform.type === "rotate") {

            result =
                rotateShape(
    result,
    transform.angle,
    transform.direction
)
        }


        else if (transform.type === "reflect") {

            result =
                reflectShape(
                    result,
                    transform.axis
                );
        }
    });


    return result;
}


// ======================================================
// تولید کد صحیح سؤال
// ======================================================

function generateTransformations() {

    const transformations = [];
    const typeNames = [
    "translate",
    "rotate",
    "reflect"
];

    // تعداد تبدیل‌ها: بین 2 تا 6
    const numberOfTransformations =
    Math.floor(
        Math.random() * 3
    ) + 1;


    for (
        let i = 0;
        i < numberOfTransformations;
        i++
    ) {

        let type;


        do {

    type =
        Math.floor(
            Math.random() * 3
        );

} while (
    transformations.some(
        transformation =>
            transformation.type === typeNames[type]
    )
);


        // --------------------
        // انتقال
        // --------------------

        if (type === 0) {

            const movements = [

                { dx: 40, dy: 0 },
                { dx: -40, dy: 0 },
                { dx: 0, dy: 40 },
                { dx: 0, dy: -40 },

                { dx: 60, dy: 0 },
                { dx: -60, dy: 0 },
                { dx: 0, dy: 60 },
                { dx: 0, dy: -60 }
            ];


            const movement =
                movements[
                    Math.floor(
                        Math.random() *
                        movements.length
                    )
                ];


            transformations.push({

                type: "translate",

                dx: movement.dx,

                dy: movement.dy
            });
        }


        // --------------------
        // دوران
        // --------------------

        else if (type === 1) {

            const angles = [
                90,
                180,
                270
            ];


            const angle =
                angles[
                    Math.floor(
                        Math.random() *
                        angles.length
                    )
                ];


            const direction =
    Math.random() < 0.5
        ? "clockwise"
        : "counterclockwise";

transformations.push({
    type: "rotate",
    angle: angle,
    direction: direction
});
        }


        // --------------------
        // تقارن
        // --------------------

        else {

            const axes = [
                "vertical",
                "horizontal"
            ];


            const axis =
                axes[
                    Math.floor(
                        Math.random() *
                        axes.length
                    )
                ];


            transformations.push({

                type: "reflect",

                axis: axis
            });
        }
    }


    return transformations;
}


// ======================================================
// تولید سؤال واقعی
// ======================================================

let correctTransformations =
    generateTransformations();
let targetShapeTransformed =
    applyTransformations(
        originalShape,
        correctTransformations
    );

aiPath =
    findAIShortestPath();
drawShape(
    targetShapeTransformed,
    "target-shape"
);

console.log(
    "مسیر AI:",
    aiPath
);
let aiTestShape =
    applyTransformations(
        originalShape,
        [aiPath[0]]
    );

console.log(
    "شکل بعد از تبدیل اول AI:",
    aiTestShape
);
let aiFinalTestShape =
    applyTransformations(
        originalShape,
        aiPath
    );

console.log(
    "AI به هدف رسید؟",
    areShapesEqual(
        aiFinalTestShape,
        targetShapeTransformed
    )
);

function startNewQuestion() {
    
    resetPlayerAnswers();
    stopPlayerTimer(1);
    // -----------------------------
    // ساخت شکل جدید
    // -----------------------------

    originalShape =
        generateShape();

    // -----------------------------
    // تولید تبدیل‌های صحیح جدید
    // -----------------------------

    correctTransformations =
        generateTransformations();

    // -----------------------------
    // ساخت شکل هدف جدید
    // -----------------------------

    targetShapeTransformed =
        applyTransformations(
            originalShape,
            correctTransformations
        );


    // -----------------------------
    // Snapshot سؤال جدید برای AI
    // -----------------------------

    

    // -----------------------------
    // نمایش سؤال جدید
    // -----------------------------

    drawShape(
        originalShape,
        "original-shape"
    );

    drawShape(
        targetShapeTransformed,
        "target-shape"
    );
    startPlayerTimer(1);
    // -----------------------------
    // پیدا کردن مسیر AI برای سؤال جدید
    // -----------------------------

    aiPath =
        findAIShortestPath();
    console.log(
    "🧠 AI PATH FOR NEW QUESTION:",
    JSON.stringify(aiPath)
);

    console.log(
        "PATH SENT TO AI:",
        JSON.stringify(aiPath)
    );
    startAITurn(aiPath);

    // -----------------------------
    // شروع نوبت AI
    // -----------------------------


    console.log(
        "سؤال جدید:",
        correctTransformations
    );
}

console.log(
    "پاسخ صحیح:",
    correctTransformations
);
const nextQuestionButton =
    document.getElementById("next-question");

if (nextQuestionButton) {

    nextQuestionButton.addEventListener(
        "click",
        function () {

            loadNextQuestion();

        }
    );

}



const nextVideoQuestionButton =
    document.getElementById("next-video-question");





// ======================================================
// موتور پیدا کردن کوتاه‌ترین مسیر هوش مصنوعی
// ======================================================
function findAIShortestPath() {

    const maxDepth = 6;

    const possibleMoves = [

        // انتقال
        {
            type: "translate",
            dx: 40,
            dy: 0
        },
        {
            type: "translate",
            dx: -40,
            dy: 0
        },
        {
            type: "translate",
            dx: 0,
            dy: 40
        },
        {
            type: "translate",
            dx: 0,
            dy: -40
        },
        {
            type: "translate",
            dx: 60,
            dy: 0
        },
        {
            type: "translate",
            dx: -60,
            dy: 0
        },
        {
            type: "translate",
            dx: 0,
            dy: 60
        },
        {
            type: "translate",
            dx: 0,
            dy: -60
        },


        // دوران
        {
            type: "rotate",
            angle: 90,
            direction: "clockwise"
        },
        {
            type: "rotate",
            angle: 180,
            direction: "clockwise"
        },
        {
            type: "rotate",
            angle: 270,
            direction: "clockwise"
        },
        {
            type: "rotate",
            angle: 90,
            direction: "counterclockwise"
        },
        {
            type: "rotate",
            angle: 180,
            direction: "counterclockwise"
        },
        {
            type: "rotate",
            angle: 270,
            direction: "counterclockwise"
        },


        // تقارن
        {
            type: "reflect",
            axis: "vertical"
        },
        {
            type: "reflect",
            axis: "horizontal"
        }

    ];


    function searchAtDepth(
        currentShape,
        path,
        remainingDepth
    ) {

        // اگر به هدف رسیده‌ایم
        if (
            areShapesEqual(
                currentShape,
                targetShapeTransformed
            )
        ) {
            return path;
        }


        // دیگر امکان ادامه نداریم
        if (remainingDepth === 0) {
            return null;
        }


        for (
            const move of possibleMoves
        ) {
           // اگر قبلاً دوران داشته‌ایم، دیگر انتقال مجاز نیست
           
            const nextShape =
                applyTransformations(
                    currentShape,
                    [move]
                );


            const result =
                searchAtDepth(
                    nextShape,
                    [
                        ...path,
                        move
                    ],
                    remainingDepth - 1
                );


            if (result !== null) {
                return result;
            }
            // اگر قبلاً دوران داشته‌ایم، دیگر انتقال مجاز نیست
            
        } 


        return null;
    }


    // ------------------------------------------
    // جست‌وجوی لایه‌به‌لایه
    // ------------------------------------------

    for (
        let depth = 1;
        depth <= maxDepth;
        depth++
    ) {

        const result =
            searchAtDepth(
                originalShape,
                [],
                depth
            );


        if (result !== null) {
            return result;
        }
    }


    return null;
}




    // --------------------------------------------------
   
// ======================================================
// زمان‌سنج بازیکنان
// ======================================================

let player1StartTime = null;
let player2StartTime = null;

let player1Timer = null;
let player2Timer = null;

let player1Elapsed = 0;
let player2Elapsed = 0;


// --------------------
// نمایش زمان
// --------------------

function formatTime(milliseconds) {

    const totalSeconds =
        milliseconds / 1000;

    return totalSeconds
        .toFixed(1)
        .padStart(4, "0");
}


// --------------------
// شروع زمان‌سنج
// --------------------
function startPlayerTimer(player) {

    // اگر زمان‌سنج از قبل فعال است، دوباره شروع نشود
    if (player === 1 && player1Timer !== null) {
        return;
    }

    if (player === 2 && player2Timer !== null) {
        return;
    }

    const startTime = Date.now();


    if (player === 1) {

        player1StartTime =
            startTime;


        player1Timer =
            setInterval(function () {

                player1Elapsed =
                    Date.now() -
                    player1StartTime;


                const timer =
                    document.getElementById(
                        "player1-timer"
                    );


                if (timer) {

                    timer.textContent =
                        formatTime(
                            player1Elapsed
                        );
                }

            }, 100);
    }


    else {

        player2StartTime =
            startTime;


        player2Timer =
            setInterval(function () {

                player2Elapsed =
                    Date.now() -
                    player2StartTime;


                const timer =
                    document.getElementById(
                        "player2-timer"
                    );


                if (timer) {

                    timer.textContent =
                        formatTime(
                            player2Elapsed
                        );
                }

            }, 100);
    }
}


// --------------------
// توقف زمان‌سنج
// --------------------

function stopPlayerTimer(player) {
    console.log(
        "🛑 stopPlayerTimer اجرا شد برای:",
        player
    );

    if (player === 1) {

        clearInterval(
            player1Timer
        );

        player1Timer = null;
    }


    else {

        clearInterval(
            player2Timer
        );

        player2Timer = null;
    }
}


// ======================================================
// شروع زمان‌سنج‌ها
// ======================================================

// ======================================================
// اتصال چالش ویدیویی به زمان‌سنج بازیکن اول
// ======================================================
const videoChallenges = [

    {
        video: "assets/videos/video1.mp4",
        answer: [
            { type: "translate" }
        ]
    },

    {
        video: "assets/videos/video2.mp4",
        answer: [
            { type: "translate" },
            { type: "rotate" }
        ]
    },

    {
        video: "assets/videos/video3.mp4",
        answer: [
            { type: "reflect" },
            { type: "rotate" },
            { type: "translate" }
        ]
    },

    {
        video: "assets/videos/video4.mp4",
        answer: [
            { type: "rotate" },
            { type: "reflect" }
        ]
    },

    {
        video: "assets/videos/video5.mp4",
        possibleAnswers: [

            [
                { type: "reflect" },
                { type: "translate" },
                { type: "rotate" }
            ],

            [
                { type: "translate" },
                { type: "reflect" },
                { type: "rotate" }
            ]

        ]
    }

];

let videoChallengeOrder = [];
let currentVideoChallengeIndex = 0;

function createRandomVideoOrder() {

    videoChallengeOrder =
        [...Array(videoChallenges.length).keys()];

    for (
        let i = videoChallengeOrder.length - 1;
        i > 0;
        i--
    ) {

        const j =
            Math.floor(
                Math.random() * (i + 1)
            );

        [
            videoChallengeOrder[i],
            videoChallengeOrder[j]
        ] =
        [
            videoChallengeOrder[j],
            videoChallengeOrder[i]
        ];
    }

    currentVideoChallengeIndex = 0;

    console.log(
        "🎬 ترتیب تصادفی ویدیوها:",
        videoChallengeOrder
    );
}

createRandomVideoOrder();



let questionOrder = [];
let currentQuestionIndex = 0;
let currentQuestion = null;

createQuestionOrder();

console.log(
    "🧪 اولین سؤال صف:",
    questionOrder[0]
);

function createQuestionOrder() {

    const imageQuestions = [
        { type: "image", id: 1 },
        { type: "image", id: 2 },
        { type: "image", id: 3 },
        { type: "image", id: 4 },
        { type: "image", id: 5 },
        { type: "image", id: 6 },
        { type: "image", id: 7 },
        { type: "image", id: 8 },
        { type: "image", id: 9 },
        { type: "image", id: 10 }
    ];

    const videoQuestions = [
        { type: "video", videoIndex: 0 },
        { type: "video", videoIndex: 1 },
        { type: "video", videoIndex: 2 },
        { type: "video", videoIndex: 3 },
        { type: "video", videoIndex: 4 }
    ];

    // تصادفی‌سازی سؤال‌های تصویری
    for (
        let i = imageQuestions.length - 1;
        i > 0;
        i--
    ) {

        const j =
            Math.floor(
                Math.random() * (i + 1)
            );

        [
            imageQuestions[i],
            imageQuestions[j]
        ] = [
            imageQuestions[j],
            imageQuestions[i]
        ];
    }

    // تصادفی‌سازی ویدیوها
    for (
        let i = videoQuestions.length - 1;
        i > 0;
        i--
    ) {

        const j =
            Math.floor(
                Math.random() * (i + 1)
            );

        [
            videoQuestions[i],
            videoQuestions[j]
        ] = [
            videoQuestions[j],
            videoQuestions[i]
        ];
    }

    // اول ۱۰ تصویر، بعد ۵ ویدیو
    questionOrder = [
        ...imageQuestions,
        ...videoQuestions
    ];

    currentQuestionIndex = 0;

    console.log(
        "🎲 ترتیب سؤال‌ها:",
        questionOrder
    );
}
function setPlayer2Visibility(visible) {

    const player2 =
        document.getElementById("player2");

    if (!player2) {
        return;
    }

    player2.style.display =
        visible ? "" : "none";
}

function showGameOver() {

    stopPlayerTimer(1);
    stopPlayerTimer(2);

    const gameOverModal =
        document.getElementById(
            "game-over-modal"
        );

    if (!gameOverModal) {
        return;
    }

    // -----------------------------
    // ثبت آمار بازیکن اول
    // -----------------------------

    const p1Correct =
        document.getElementById(
            "final-player1-correct"
        );

    const p1Wrong =
        document.getElementById(
            "final-player1-wrong"
        );

    const p1Time =
        document.getElementById(
            "final-player1-time"
        );

        const p1Score =
    document.getElementById(
        "final-player1-score"
    );


    if (p1Correct) {
        p1Correct.textContent =
            player1CorrectCount;
    }

    if (p1Wrong) {
        p1Wrong.textContent =
            player1WrongCount;
    }

    if (p1Time) {
        p1Time.textContent =
            formatTime(
                player1TotalTime
            );
    }

        if (p1Score) {
    p1Score.textContent =
        Math.round(player1Score);
}

    // -----------------------------
    // ثبت آمار AI
    // -----------------------------

    const p2Correct =
        document.getElementById(
            "final-player2-correct"
        );

    const p2Wrong =
        document.getElementById(
            "final-player2-wrong"
        );

    const p2Time =
        document.getElementById(
            "final-player2-time"
        );
        const p2Score =
    document.getElementById(
        "final-player2-score"
    );

    if (p2Correct) {
        p2Correct.textContent =
            player2CorrectCount;
    }

    if (p2Wrong) {
        p2Wrong.textContent =
            player2WrongCount;
    }

    if (p2Time) {
        p2Time.textContent =
            formatTime(
                player2TotalTime
            );
    }

    if (p2Score) {
    p2Score.textContent =
        Math.round(player2Score);
}
    // -----------------------------
    // نمایش پنجره پایان
    // -----------------------------

    // -----------------------------
// نمایش پنجره پایان با انیمیشن
// -----------------------------

// -----------------------------
// نمایش پنجره پایان
// -----------------------------

gameOverModal.style.display = "flex";

const gameOverBox =
    gameOverModal.querySelector(
        ".game-over-box"
    );

if (gameOverBox) {

    // حالت اولیه برای شروع انیمیشن
    gameOverBox.style.opacity = "0";
    gameOverBox.style.transform =
        "translateY(25px) scale(0.96)";

    requestAnimationFrame(function () {

        requestAnimationFrame(function () {

            gameOverBox.animate(
                [
                    {
                        opacity: 0,
                        transform:
                            "translateY(25px) scale(0.96)"
                    },
                    {
                        opacity: 1,
                        transform:
                            "translateY(0) scale(1)"
                    }
                ],
                {
                    duration: 550,
                    easing:
                        "cubic-bezier(0.2, 0.8, 0.2, 1)",
                    fill: "forwards"
                }
            );

        });

    });
}

console.log(
    "🎉 پنجره پایان بازی نمایش داده شد."
);

// ریست انیمیشن برای اجرای دوباره
gameOverModal.classList.remove(
    "game-over-show"
);

// مجبور کردن مرورگر به ثبت تغییر
void gameOverModal.offsetWidth;

// اجرای دوباره انیمیشن
gameOverModal.classList.add(
    "game-over-show"
);

console.log(
    "🎉 پنجره پایان بازی نمایش داده شد."
);

    console.log(
        "👤 آمار بازیکن:",
        player1CorrectCount,
        player1WrongCount,
        player1TotalTime
    );

    console.log(
        "🤖 آمار AI:",
        player2CorrectCount,
        player2WrongCount,
        player2TotalTime
    );
}


function restartGame() {

    console.log("🔄 شروع دوباره بازی");

    // -----------------------------
    // بستن پنجره پایان
    // -----------------------------

    const gameOverModal =
        document.getElementById(
            "game-over-modal"
        );

    if (gameOverModal) {
    gameOverModal.style.display = "none";

    const gameOverBox =
        gameOverModal.querySelector(
            ".game-over-box"
        );

    if (gameOverBox) {
        gameOverBox.style.opacity = "";
        gameOverBox.style.transform = "";
    }
}

    // -----------------------------
    // توقف همه زمان‌سنج‌ها
    // -----------------------------

    stopPlayerTimer(1);
    stopPlayerTimer(2);


    // -----------------------------
    // لغو نوبت قبلی AI
    // -----------------------------

    if (aiTurnTimeout !== null) {

        clearTimeout(
            aiTurnTimeout
        );

        aiTurnTimeout = null;
    }


    // -----------------------------
    // صفر کردن آمار
    // -----------------------------

    player1CorrectCount = 0;
    player1WrongCount = 0;
    player1TotalTime = 0;

    player2CorrectCount = 0;
    player2WrongCount = 0;
    player2TotalTime = 0;


    // -----------------------------
    // صفر کردن زمان‌های جاری
    // -----------------------------

    player1Elapsed = 0;
    player2Elapsed = 0;


    // -----------------------------
    // پاک کردن پاسخ‌های قبلی
    // -----------------------------

    resetPlayerAnswers();


    // -----------------------------
    // بازگرداندن ستون AI
    // -----------------------------

    setPlayer2Visibility(true);


    // -----------------------------
    // بازسازی ترتیب سؤال‌ها
    // -----------------------------
    console.log(
    "🔄 قبل از createQuestionOrder:",
    currentQuestionIndex,
    questionOrder
);



console.log(
    "🔄 بعد از createQuestionOrder:",
    currentQuestionIndex,
    questionOrder
);
    createQuestionOrder();


    // -----------------------------
    // به‌روزرسانی برد
    // -----------------------------

    updateScoreBoard();


    // -----------------------------
    // شروع اولین سؤال
    // -----------------------------

    loadNextQuestion();
}


const restartGameButton =
    document.getElementById("restart-game");

if (restartGameButton) {

    restartGameButton.addEventListener(
        "click",
        restartGame
    );

}

function loadNextQuestion() {

    if (aiTurnTimeout !== null) {

        clearTimeout(aiTurnTimeout);

        aiTurnTimeout = null;

        stopPlayerTimer(2);

        console.log(
            "🤖 نوبت قبلی AI لغو شد."
        );
    }

    console.log(
        "🟢 loadNextQuestion اجرا شد"
    );

    console.log(
        "📌 currentQuestionIndex:",
        currentQuestionIndex
    );

    if (
        currentQuestionIndex >=
        questionOrder.length
    ) {

        console.log(
            "🎉 همه سؤال‌های این دور تمام شدند."
        );
        showGameOver();
        return;
    }

    const question =
        questionOrder[
            currentQuestionIndex
        ];

    currentQuestionIndex++;

    currentQuestion = question;

    resetPlayerAnswers();

    stopPlayerTimer(1);
    stopPlayerTimer(2);

    console.log(
        "➡️ سؤال بعدی:",
        question
    );


    // =============================
    // سؤال تصویری
    // =============================

   if (question.type === "image") {

    console.log(
        "🖼️ سؤال تصویری"
    );

    // نمایش دوباره پنل تصاویر
    const shapeChallenge =
        document.querySelector(".shapes-row");

    const videoChallenge =
        document.getElementById(
            "video-challenge"
        );

    if (shapeChallenge) {
        shapeChallenge.style.display = "";
    }

    if (videoChallenge) {
        videoChallenge.style.display = "none";
    }

   

    setPlayer2Visibility(true);

    startNewQuestion();
}


    // =============================
    // سؤال ویدیویی
    // =============================

    else if (question.type === "video") {

    setPlayer2Visibility(false);

    console.log(
        "🎬 سؤال ویدیویی:",
        question.videoIndex
    );

    // مخفی کردن دکمه سؤال بعدیِ حالت تصویری
    

    showVideoChallenge();

    const videoIndex =
        question.videoIndex;

    const challenge =
        videoChallenges[videoIndex];

    if (
        challengeVideo &&
        challenge
    ) {

        challengeVideo.pause();
        
        challengeVideo.src =
            challenge.video;

        challengeVideo.currentTime = 0;

        challengeVideo.load();

        
        console.log(
            "🎬 ویدیوی جدید:",
            challenge.video
        );
    }

    if (startVideoChallenge) {

        startVideoChallenge.disabled =
            false;

        startVideoChallenge.textContent =
            "🎬 شروع چالش";
    }
}
}

const videoChallenge =
    document.getElementById("video-challenge");

const challengeVideo =
    document.getElementById("challenge-video");

const startVideoChallenge =
    document.getElementById("start-video-challenge");




if (startVideoChallenge) {

    startVideoChallenge.addEventListener(
        "click",
        function () {

            // شروع تایمر بازیکن ۱
            startPlayerTimer(1);

            // شروع تایمر AI
           

            // شروع ویدیو از ابتدا
            if (challengeVideo) {

                challengeVideo.currentTime = 0;

                const playPromise =
                    challengeVideo.play();

                if (playPromise !== undefined) {

                    playPromise.catch(
                        error => {

                            console.log(
                                "❌ پخش ویدیو انجام نشد:",
                                error
                            );

                            // اگر پخش نشد،
                            // تایمرها هم متوقف شوند
                            stopPlayerTimer(1);
                            stopPlayerTimer(2);

                            startVideoChallenge.disabled =
                                false;

                            startVideoChallenge.textContent =
                                "🎬 شروع چالش";
                        }
                    );
                }
            }

            startVideoChallenge.disabled =
                true;

            startVideoChallenge.textContent =
                "🎬 در حال پخش...";
        }
    );
 }
 { 
    const nextVideoQuestionButton =
    document.getElementById(
        "next-video-question"
    );

if (nextVideoQuestionButton) {

    nextVideoQuestionButton.addEventListener(
        "click",
        function () {

            console.log(
                "🎬 دکمه سؤال بعدی ویدیویی کلیک شد"
            );

            loadNextQuestion();

        }
    );
}
 }

function updateScoreBoard() {

    const p1Correct =
        document.getElementById("player1-correct-count");

    const p1Wrong =
        document.getElementById("player1-wrong-count");

    const p1Time =
        document.getElementById("player1-total-time");

    

    const p2Correct =
        document.getElementById("player2-correct-count");

    const p2Wrong =
        document.getElementById("player2-wrong-count");

    const p2Time =
        document.getElementById("player2-total-time");


    if (p1Correct) {
        p1Correct.textContent =
            player1CorrectCount;
    }

    if (p1Wrong) {
        p1Wrong.textContent =
            player1WrongCount;
    }

    if (p1Time) {
        p1Time.textContent =
            formatTime(player1TotalTime);
    }


    if (p2Correct) {
        p2Correct.textContent =
            player2CorrectCount;
    }


    if (p2Wrong) {
        p2Wrong.textContent =
            player2WrongCount;
    }

    if (p2Time) {
        p2Time.textContent =
            formatTime(player2TotalTime);
    }
}
function showShapeChallenge() {

    const shapeChallenge =
        document.querySelector(".shapes-row");

    const videoChallenge =
        document.getElementById("video-challenge");

    if (shapeChallenge) {
        shapeChallenge.style.display = "flex";
    }

    if (videoChallenge) {
        videoChallenge.style.display = "none";
    }
}
function showVideoChallenge() {

    const shapeChallenge =
        document.querySelector(".shapes-row");

    const videoChallenge =
        document.getElementById("video-challenge");
    

    if (shapeChallenge) {
        shapeChallenge.style.display = "none";
    }

    if (videoChallenge) {
        videoChallenge.style.display = "block";
    }
}

showShapeChallenge();