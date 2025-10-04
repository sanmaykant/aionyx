export function buildPrompt(userMessage) {
    
  const today=new Date();

  return `
You are an intelligent assistant that extracts meeting or appointment details from user messages.  
Return results in a consistent JSON format with the following fields:

- title
- date (ISO 8601, e.g. "2025-08-23")
- start_time (24-hour format, e.g. "15:00")
- end_time (24-hour format, e.g. "16:30")

Input:
"${userMessage}"
context : today's date is "${today.toISOString()}"

If the message contains multiple meetings, return **separate JSON objects for each meeting** (combined into a single array).  

If any field is missing or ambiguous, set its value to null and explain what is missing in a separate "missing_info" array.

Return ONLY the JSON in the following format:
{
  "title": "...",
  "date": "...",
  "start_time": "...",
  "end_time": "...",
  "missing_info": [ ... ]
}
  
for example, if title is null, then missing_info should be missing_info: ['title'].
do not add additional information in missing_info.
interpret afternoon same as noon.
if end_time is null, add it to missing_info.
whenever possible add name of meeting participants/scheduler in the title`
}

export function generateFinalJsonPrompt(originalMessage, clarificationMessage) {
  return `
You are an intelligent assistant that extracts meeting or appointment details from user messages.

You now have two messages:
- Original: "${originalMessage}"
- Additional info: "${clarificationMessage}"

Use both together to generate a complete and corrected JSON output in the following format:
{
  "title": "...",
  "date": "...",
  "start_time": "...",
  "end_time": "...",
  "missing_info": [ ... ]
}

If the message contains multiple meetings, return **separate JSON objects for each meeting** (combined into a single array).  

If any field is missing or ambiguous, set its value to null and explain what is missing in a separate "missing_info" array.
  
for example, if title is null, then missing_info should be missing_info: ['title'].
do not add additional information in missing_info.
interpret afternoon same as noon.
if end_time is null, add it to missing_info.
whenever possible add name of meeting participants/scheduler in the title
`;
}
