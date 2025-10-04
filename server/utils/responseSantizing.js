

export const generateClarificationMessage = (meetings) => {
    for (const meeting of meetings) 
    {
        let missing_info=meeting.missing_info;
        for (const missing_var of missing_info) 
        {
            const fieldQuestions = {
                title: "What is the title or purpose of the meeting?",
                date: "What date should the meeting take place?",
                start_time: "What time should the meeting start?",
                end_time: "What time should the meeting end?",
            };

            const questions = missing_info
                .map(field => missing_var[field] || `Can you provide the ${field} for the appointment?`)
                .join('\n');
        }
    }
}