const { questionsList, questionDetailsList } = require("../model/drawQuestionsInMemory.js");

exports.questionsGet = (req, res) => {

  console.log(JSON.stringify(req.params))

  if (Object.keys(req.params).length === 0) {
    // send the questions names list only
    res.json(JSON.stringify(questionsList));
  } else {
    // send the question metadata
    const question = questionDetailsList[req.params.question];
    if (!question) {
      throw new Error("Question not found");
    }

    res.json(JSON.stringify(questionDetailsList[req.params.question]));
  }

}
