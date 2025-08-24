import { generateInsight } from "./controller/llmController.js"; 

let inputText=`> From: Alice  
> Just a reminder — our review session is Monday at 2pm.  
> Thanks!

Also, can you add a quick call with Tom next Wednesday morning?
`

generateInsight(inputText);