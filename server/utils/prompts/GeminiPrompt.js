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
if end_time is null, add it to missing_info, and set end_time 45 mins after start time.
whenever possible add name of meeting participants/scheduler in the title`
}
