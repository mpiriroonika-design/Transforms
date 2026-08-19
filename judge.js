// ======================================================
// داور بازی تبدیلات هندسی
// ======================================================

function judgeAnswer(
    playerAnswer,
    correctAnswer,
    isVideoQuestion = false
) {

    // اگر تعداد تبدیل‌ها متفاوت باشد، پاسخ غلط است
    if (playerAnswer.length !== correctAnswer.length) {
        return false;
    }

    // سؤال ویدیویی → ترتیب تبدیل‌ها مهم است
    if (isVideoQuestion) {

        for (let i = 0; i < correctAnswer.length; i++) {

            if (!isSameTransformation(
                playerAnswer[i],
                correctAnswer[i]
            )) {
                return false;
            }
        }

        return true;
    }

    // سؤال معمولی → ترتیب مهم نیست
    const remaining = [...correctAnswer];

    for (const playerTransformation of playerAnswer) {

        const index = remaining.findIndex(
            correctTransformation =>
                isSameTransformation(
                    playerTransformation,
                    correctTransformation
                )
                
        );

        if (index === -1) {
            return false;
        }
function judgeByFinalShape(
    originalShape,
    playerAnswer,
    targetShape
) {

    const finalShape = applyTransformations(
        originalShape,
        playerAnswer
    );

    return areShapesEqual(
        finalShape,
        targetShape
    );
}
        remaining.splice(index, 1);
    }

    return true;
}


// ======================================================
// مقایسه دو تبدیل
// ======================================================

function isSameTransformation(player, correct) {

    // --------------------
    // انتقال
    // --------------------
    // فقط نوع تبدیل مهم است
    if (
        player.type === "translate" &&
        correct.type === "translate"
    ) {
        return true;
    }


    // --------------------
    // دوران
    // --------------------
    // فقط جهت دوران مهم است
    // زاویه مهم نیست
    if (
        player.type === "rotate" &&
        correct.type === "rotate"
    ) {
        return (
            player.direction === correct.direction
        );
    }


    // --------------------
    // تقارن
    // --------------------
    // فقط نوع تبدیل مهم است
    // محور تقارن مهم نیست
    if (
        player.type === "reflect" &&
        correct.type === "reflect"
    ) {
        return true;
    }


    // --------------------
    // هیچ تطابقی وجود ندارد
    // --------------------
    return false;
}
function judgeByFinalShape(
    originalShape,
    playerAnswer,
    targetShape
) {

    const finalShape = applyTransformations(
        originalShape,
        playerAnswer
    );

    return areShapesEqual(
        finalShape,
        targetShape
    );
}