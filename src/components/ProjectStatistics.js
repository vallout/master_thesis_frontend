import React from 'react';
import { useEffect, useReducer } from 'react';
import { Row, Col } from 'reactstrap';
import {XAxis, YAxis, AreaChart, Area, Tooltip, CartesianGrid, Legend, Label} from 'recharts';
import FetchClass from '../fetching';
import moment from 'moment';
import { useState } from 'react';


  

const toPercent = (decimal, fixed = 0) => {
    return decimal * 100 + "%";
};

function ProjectStatistics(props) {

    
    const initialState = [];

    const reducer = (stateIn, action) => {
        return [action.tasksCreated, action.tasksFinished, action.tasksLiked]
    };

    const [state, dispatch] = useReducer(reducer, initialState);

    const fetchProject = () => {
        FetchClass.getProjectStatistics("6010345abcdba01475985932").then(
            result => {
                dispatch(result);
            }
        ).catch(
            error => {
                // DO something
            }
        )
    }

    useEffect(() => {
        fetchProject();
    }, [])

    useEffect(() => {
        // console.log(state);
    }, [state])


    const renderProjectStatistics = () => {
        let projectStatistics = []
        let titles = ["Tasks created", "Tasks finished", "Liked tasks"]
        for (let i = 0; i < state.length; i++) {
            
            projectStatistics.push(
                <Col xs="4" key={state.timestamp}>
                    <ProjectStatistic title={titles[i]} data={state[i]} allUsers={props.allUsers}/>
                </Col>
            );
        }
        return projectStatistics;
    }

    return (
        <Row>
            {renderProjectStatistics()}
        </Row>
    );
}

function ProjectStatistic(props) {

    const [weeklyNumbers, setWeeklyNumbers] = useState({});
    const [allWeeks, setAllWeeks] = useState([]); 

    const reworkData = () => {
        let weeklyNumbers_tmp = {};
        let allWeeks_tmp = []
        for (let value of props.data) {
            let time = moment(value.timestamp);
            let week = time.isoWeek().toString();
            if (!allWeeks_tmp.includes(week)) {
                allWeeks_tmp.push(week);
            }
            let user = value.userId;
            if (value.creatorId) {
                user = value.creatorId;
            }
            for (let userProfile of props.allUsers) {
                if (userProfile.userId === user) {
                    user = userProfile.firstname + " " + userProfile.lastname;
                }
            }

            if (user in weeklyNumbers_tmp) {
                weeklyNumbers_tmp[user][week] = week in weeklyNumbers_tmp[user] ? weeklyNumbers_tmp[user][week] + 1 : 1;
            } else {
                weeklyNumbers_tmp[user] = {
                    [week]: 1
                }
            }
        }
        setWeeklyNumbers(weeklyNumbers_tmp);
        allWeeks_tmp.sort();
        setAllWeeks(allWeeks_tmp);
    }

    useEffect(() => {
        reworkData();
    }, [])

    const createData = () => {

        let data = [];

        for (let i = 0; i < allWeeks.length; i++) {
            let dataRow = {"week": "Week " + allWeeks[i]};
            for (const [key, value] of Object.entries(weeklyNumbers)) {
                if (allWeeks[i] in value) {
                    dataRow[key] = value[allWeeks[i]];
                }
            }
            data[i] = dataRow;
        }
        return data;
    }

    const renderAreas = () => {
        const fills = ["#8884d8", "#82ca9d", "#ffc658", "#eb1c31"];
        let ctr = 0;
        let areas = [];
        for (const [key, ] of Object.entries(weeklyNumbers)) {
            areas.push(
                <Area key={key} type="monotone" dataKey={key} stackId="1" stroke={fills[ctr]} fill={fills[ctr]} />
            )
            if (ctr < 4){
                ctr++;
            } else {
                ctr = 0;
            }
        }
        return (
            areas
        )
    }

    return (
        <div>
            <h2>{props.title}</h2>
            <AreaChart
                width={500}
                height={400}
                data={createData()}
                stackOffset="expand"
                margin={{
                    top: 10, right: 30, left: 0, bottom: 0,
                }}
                >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="week" >
                    <Label value="Week of the year 2021" offset={0} position="insideBottom" style={{marginTop: "2rem"}}/>
                </XAxis>
                <YAxis tickFormatter={toPercent} />
                {renderAreas()}
                <Tooltip/>
                <Legend />
            </AreaChart>
        </div>
    );
}

export default ProjectStatistics;