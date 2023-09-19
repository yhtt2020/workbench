const fluentEmojis = {
    "[Kiss]": "Face Blowing a Kiss.png",
    "[Tears]": "Face with Tears of Joy.png",
    "[Cry]": "Loudly Crying Face.png",
    "[Smiling]": "Smiling Face with Open Hands.png",
    "[Confound]": "Confounded Face.png",
    "[Mask]": "Face with Medical Mask.png",
    "[Zany]": "Zany Face.png",
    "[Vomit]": "Face Vomiting.png",
    "[Kissing]": "Kissing Face.png",
    "[Fearful]": "Fearful Face.png",
    "[Pleading]": "Pleading Face.png",
    "[Scream]": "Face Screaming in Fear.png",
    "[AngryFace]": "Angry Face.png",
    "[Zipper]": "Zipper-Mouth Face.png",
    "[Expressionless]": "Expressionless Face.png",
    "[SpiralEyes]": "Face with Spiral Eyes.png",
    "[Shushing]": "Shushing Face.png",
    "[MoneyMouth]": "Money-Mouth Face.png",
    "[ThumbsUp]": "Thumbs Up Light Skin Tone.png",
    "[ThumbsDown]": "Thumbs Down Light Skin Tone.png",
    "[Victory]": "Victory Hand Light Skin Tone.png",
    "[Ok]": "OK Hand Light Skin Tone.png",
    "[Pingching]": "Pinching Hand Light Skin Tone.png",
    "[Hands]": "Folded Hands Light Skin Tone.png",
    "[Clap]": "Clapping Hands Light Skin Tone.png",
    "[OpenHands]": "Open Hands Light Skin Tone.png",
    "[Waing]": "Waving Hand Light Skin Tone.png",
    "[Writing]": "Writing Hand Light Skin Tone.png",
    "[PigFace]": "Pig Face.png",
    "[Cat]": "Cat with Wry Smile.png",
    "[Blowfish]": "Blowfish.png",
    "[Yen]": "Yen Banknote.png",
    "[Triangular]": "Triangular Flag.png",
    "[Heart]": "Beating Heart.png",
    "[Broken]": "Broken Heart.png",
    "[1st]": "1st Place Medal.png",
    "[2nd]": "2nd Place Medal.png",
    "[3rd]": "3rd Place Medal.png",
    "[Selfie]": "Selfie Light Skin Tone.png",
    "[Teacup]": "Teacup Without Handle.png",
    "[New]": "New Button.png",
    "[Check]": "Check Mark Button.png",
    "[Anger]": "Anger Symbol.png",
    "[Acceptable]": 'Japanese Acceptable Button.png',
    "[Hundred]": "Hundred Points.png",
    "[Crab]": "Crab.png",
    "[MoneyBag]": "Money Bag.png",
    "[Zzz]": "Zzz.png",
    "[Bomb]": "Bomb.png",
}
// 用于在动态和评论中使用的表情
// str.replace(/\[([^(\]|\[)]*)\]/g,(item,index) => {})
// https://sad.apps.vip/public/static/emoji/emojistatic/
const emojiReplace=(str)=>{
    let result = str.replace(/\[([^(\]|\[)]*)\]/g, (item, index) => {
        let emojiValue;
        Object.entries(fluentEmojis).forEach(([key, value]) => {
            if (key == item) {
                emojiValue = value;
            }
        });

        if (emojiValue) {
            let url = `https://sad.apps.vip/public/static/emoji/emojistatic/${emojiValue}`;
            return `<img src="${url}" class=" w-[22px] h-[22px]">`;
        }

        return item;
    });

    return result;
}

export default emojiReplace
    