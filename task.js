const express = require("express");
const BadWordsFilter = require("bad-words");

const app = express();
app.use(express.json());

const badWords = new BadWordsFilter();

function checkForInappropriateContent(text, isProfanityEnabled) {
  // Split the text into an array of words
  const words = text.split(" ");
  // Check each word for inappropriate content
  const inappropriateWords = words.filter((word) => badWords.isProfane(word));
  // If inappropriate content is detected, return a response with the offending words and the clean text
  if (isProfanityEnabled && inappropriateWords.length > 0) {
    const cleanText = words
      .filter((word) => !badWords.isProfane(word))
      .join(" ");
    return {
      foundProfanity: true,
      cleanText: cleanText,
      inappropriateWords: inappropriateWords,
    };
  }
  // If no inappropriate content is detected, return a response indicating that the text is clean
  // return { foundProfanity: false, cleanText: text };
}

app.post("/user-input", (req, res) => {
  const isProfanityEnabled = req.body.isProfanityEnabled;
  const text = req.body.text;

  if (
    isProfanityEnabled &&
    checkForInappropriateContent(text, isProfanityEnabled).foundProfanity
  ) {
    const checkResult = checkForInappropriateContent(text, isProfanityEnabled);
    res.status(200).send({
      foundProfanity: true,
      cleanText: checkResult.cleanText,
      inappropriateWords: checkResult.inappropriateWords,
    });
  }
});

app.listen(3000, () => {
  console.log("Server listening on port 3000");
});
