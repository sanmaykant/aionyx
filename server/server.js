import { Outcome } from "@google/generative-ai";
import { generateInsight, recieveMissingInfo, regenerateInsight } from "./controller/llmController.js";

let inputText = `> From: Alice  
> Just a reminder — our review session is Monday at 2pm.  
> Thanks!

Also, can you add a quick call with Tom next Wednesday morning?
`
let clarificationMessage=`The call with Tom can start at 9:00am and should be done by 9:30am.`

generateInsight(inputText).then(async output => {

  try {
    const cleaned = output
      .replace(/```json/g, '')  // remove opening ```
      .replace(/```/g, '')      // remove closing ```
      .trim();                  // remove extra whitespace
    const meetingData = JSON.parse(cleaned);
    console.log(meetingData)
    if (meetingData.missing_info.length > 0) {
      await recieveMissingInfo(meetingData.missing_info, inputText)
    }
  } catch (e) {
    console.error("Invalid JSON from model");
  }

});

regenerateInsight(inputText, clarificationMessage)



