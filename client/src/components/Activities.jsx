import React, { useState, useEffect } from 'react'
import { Label } from './ui/label';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { scheduleApi } from '@/api/scheduleApi';

function activities(props) {
    // const activitiesArray=props.activitiesArray;
    const [activitiesArray, setActivitiesArray] = useState([]);
    const [activityIndex, setActivityIndex] = useState(null)
    const updateActivityIndex = index => {
        setActivityIndex(index);
    }
    useEffect(() => {
        if (Array.isArray(props.activitiesArray)) {
            setActivitiesArray(props.activitiesArray);
        } else if (typeof props.activitiesArray === "object") {
            setActivitiesArray(Object.values(props.activitiesArray));
        } else {
            setActivitiesArray([]);
        }
    }, [props.activitiesArray]);

    const handleInputChange = (key, value) => {
    setActivitiesArray(prev => {
        const newArray = [...prev];
        const updatedActivity = { ...newArray[activityIndex], [key]: value };
        newArray[activityIndex] = updatedActivity;
        return newArray;
    });
    };
    const access_token=localStorage.getItem("access-token");
    return (
        <>
            <ul>
                {
                    activitiesArray.map((item, index) => (
                        <li key={index} onClick={(e) => { updateActivityIndex(index) }}>{item.title}</li>
                    ))
                }
            </ul>
            {activityIndex !== null && (
                <div className="space-y-6">
                    <div>
                        <Label htmlFor="title">Title</Label>
                        <Input
                            type="text"
                            id="title"
                            name="title"
                            value={activitiesArray[activityIndex].title || ""}
                            onChange={(e) => { handleInputChange("title", e.target.value) }}
                            placeholder="Enter a title"
                            className="w-full mt-2 p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    <div>
                        <Label htmlFor="start-time">Start Time</Label>
                        <Input
                            type="datetime-local"
                            id="start-time"
                            name="start_time"
                            value={
                                activitiesArray[activityIndex].start_time
                                    ? new Date(activitiesArray[activityIndex].start_time).toISOString().slice(0, 16)
                                    : ""
                            }
                            onChange={(e) => handleInputChange("start_time", e.target.value)}
                            className="w-full mt-2 p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    <div>
                        <Label htmlFor="end-time">End Time</Label>
                        <Input
                            type="datetime-local"
                            id="end-time"
                            name="end_time"
                            value={
                                activitiesArray[activityIndex].end_time
                                    ? new Date(activitiesArray[activityIndex].end_time).toISOString().slice(0, 16)
                                    : ""
                            }
                            onChange={(e) => handleInputChange("end_time", e.target.value)}
                            className="w-full mt-2 p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    <div>
                        <Label htmlFor="description">Description</Label>
                        <Textarea
                            id="description"
                            name="description"
                            value={activitiesArray[activityIndex].description || ""}
                            onChange={(e) => { handleInputChange("description", e.target.value) }}
                            placeholder="Enter a description"
                            className="w-full mt-2 p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    <div>
                        <Label htmlFor="tags">Tags</Label>
                        <Input
                            type="text"
                            id="tags"
                            name="tags"
                            value={activitiesArray[activityIndex].tags || ""}
                            onChange={(e) => { handleInputChange("tags", e.target.value) }}
                            placeholder="Enter tags (comma separated)"
                            className="w-full mt-2 p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    <div>
                        <Label htmlFor="deadline">Deadline</Label>
                        <Input
                            type="datetime-local"
                            id="deadline"
                            name="deadline"
                            value={
                            activitiesArray[activityIndex].deadline
                            ? new Date(activitiesArray[activityIndex].deadline).toISOString().slice(0, 16)
                            : ""
                            }
                            onChange={(e) => { handleInputChange("deadline", e.target.value) }}
                            className="w-full mt-2 p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                </div>
            )}
            <button onClick={(e) => {console.log(activitiesArray[activityIndex])
                scheduleApi(access_token, activitiesArray[activityIndex])
                } 
                }>Schedule</button>
        </>
    )
}

export default activities