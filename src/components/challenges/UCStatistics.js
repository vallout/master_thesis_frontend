import React, { useState } from 'react';
import { useEffect } from 'react';
import {Row, Col, Input, Button} from 'reactstrap';
import FetchClass from '../../fetching';
import {BarChart, CartesianGrid, XAxis, YAxis, Tooltip, Bar, Label} from 'recharts';

function UCStatistics(props) {

    const [challengeId, setChallengeId] = useState("");

    const renderParticipators = () => {
        let participators_tmp = [];

        for (let participator of props.participators) {
            participators_tmp.push(
                <Col xs="4" key={participator}>
                    <p>{participator}</p>
                </Col>
            )
        }
        return participators_tmp;
    }

    const renderStatistics = () => {
        let statistics_tmp = [];

        for (const [key, value] of Object.entries(statistics)) {
            statistics_tmp.push(
                <Col xs="4" key={key} style={{marginTop: "2rem"}}>
                    <SingleStatistic challengeId={key} data={value}/>
                </Col>
            )
        }

        return statistics_tmp;
    }

    const [statistics, setStatistics] = useState({});

    useEffect(() => {
        FetchClass.getGamificationStatistics().then(
            result => {
                setStatistics(result);
            }
        ).catch(
            error => {
                setStatistics({});
            }
        )
    }, []);

    return (
        <div>
            <h2>Gamification Statistics</h2>
            <Row>
                {renderStatistics()}
            </Row>


            <h2 style={{marginTop: "2rem"}}>Get Users of User Challenges</h2>

            <Input type="text" placeholder="Challenge-ID..." value={challengeId} onChange={event => setChallengeId(event.target.value)}/>
            <Button onClick={() => props.retrieveParticipators(challengeId)}>Get Participators</Button>
            <Row>
                {renderParticipators()}
            </Row>
        </div>
    )
}

function SingleStatistic(props) {

    const [data, setData] = useState([]);

    useEffect(() => {
        let data_tmp = []
        for (const [key, value] of Object.entries(props.data)) {
            data_tmp.push({
                "week": key,
                "number": value
            })
        }
        setData(data_tmp);
    }, [])
    return (
        <div>
            <h5>challenge-ID:</h5>
            <h5>{props.challengeId}</h5>
            <BarChart width={400} height={250} data={data} style={{margin: "auto"}}>
                <CartesianGrid strokeDasharray="3 3" />
                
                <XAxis dataKey="week">
                    <Label value="Week of the year 2021" offset={0} position="insideBottom" style={{marginTop: "2rem"}} />
                </XAxis>
                <YAxis allowDecimals={false} />
                <Tooltip />
                <Bar dataKey="number" fill="#8884d8" />
            </BarChart>
        </div>
    )
}

export default UCStatistics;