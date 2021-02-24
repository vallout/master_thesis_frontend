import React, { useState } from 'react';
import { useEffect } from 'react';
import {Row, Col} from 'reactstrap';
import FetchClass from '../../fetching';
import {BarChart, CartesianGrid, XAxis, YAxis, Tooltip, Bar, Label} from 'recharts';
import moment from 'moment';

function UsageStatistics(props) {

    return(
        <div>
            <h2>Usage Statistics</h2>

            <AllStatistics />

        </div>
    );
}

function AllStatistics(props) {

    const [statistics, setStatistics] = useState({});

    useEffect(() => {
        FetchClass.getStatistics().then(
            result => {
                setStatistics(result);
            }
        ).catch(
            error => {
                setStatistics({});
            }
        )
    }, []);

    const renderStatistics = () => {
        let statistics_tmp = [];
        // if (statistics) {
            for (let [key, value] of Object.entries(statistics)) {
                statistics_tmp.push(
                    <Col xs="3" key={key} style={{marginTop: "2rem"}}>
                        <SingleGraph title={key} dataUnstructured={value}/>
                    </Col>
                );
            }
        // }
        return statistics_tmp;
    }

    return(
        <Row>
            {renderStatistics()}
        </Row>
    )
}

function SingleGraph(props) {
    const [data, setData] = useState([]);
    const [weeklyNumbers, setWeeklyNumbers] = useState({});
    const [allWeeks, setAllWeeks] = useState([]); 

    useEffect(() => {
        // console.log(props.dataUnstructured);
        reworkData();
    }, [props.dataUnstructured])

    const reworkData = () => {
        let weeklyNumbers_tmp = {};
        let allWeeks_tmp = []
        for (let value of props.dataUnstructured) {
            let time = moment(value.timestamp);
            let week = time.isoWeek().toString();
            if (!allWeeks_tmp.includes(week)) {
                allWeeks_tmp.push(week);
            }
            weeklyNumbers_tmp[week] = week in weeklyNumbers_tmp ? weeklyNumbers_tmp[week] + 1 : 1;
        }
        setWeeklyNumbers(weeklyNumbers_tmp);
        allWeeks_tmp.sort();
        setAllWeeks(allWeeks_tmp);
    }

    useEffect(() => {
        let data_tmp = [];
        for (let week of allWeeks) {
            data_tmp.push(
                {
                    "week": week,
                    "number": weeklyNumbers[week]
                }
            )
        }
        setData(data_tmp);
    }, [allWeeks])
    return (
        <div>
            <h3>{props.title}</h3>
            <BarChart width={400} height={250} data={data} style={{margin: "auto"}}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="week">
                    <Label value="Week of the year 2021" offset={0} position="insideBottom" style={{marginTop: "2rem"}}/>
                </XAxis>
                <YAxis allowDecimals={false}/>
                <Tooltip />
                <Bar dataKey="number" fill="#8884d8" />
            </BarChart>
        </div>
    )
}

export default UsageStatistics;