import { useEffect, useState } from 'react';
import axios from 'axios';
import { Chart } from 'react-google-charts';
import { Grid, Typography } from '@mui/material';

export default function Covid19() {
    const [covidData, setCovidData] = useState({});

    useEffect(() => {
        axios
            .get('https://static.pipezero.com/covid/data.json')
            .then((res) => {
                setCovidData(res.data);
            })
            .catch(function (error) {
                console.log(error);
            });
    }, []);

    const overviewData = (data, type) => {
        if (data) {
            let result;
            if (type === 'cases') {
                result = [['Ngày', 'Nhiễm', 'Trung bình 7 ngày']];
                for (const item of data) {
                    const { date, cases, avgCases7day } = item;
                    result = [...result, [date, cases, avgCases7day]];
                }
            }
            if (type === 'recovered') {
                result = [['Ngày', 'Hồi phục', 'Trung bình 7 ngày']];
                for (const item of data) {
                    const { date, recovered, avgRecovered7day } = item;
                    result = [...result, [date, recovered, avgRecovered7day]];
                }
            }
            if (type === 'death') {
                result = [['Ngày', 'Tử vong', 'Trung bình 7 ngày']];
                for (const item of data) {
                    const { date, death, avgDeath7day } = item;
                    result = [...result, [date, death, avgDeath7day]];
                }
            }
            return result;
        }
    };
    return (
        <>
            <Typography></Typography>
            <Grid container spacing={0}>
                {[
                    { type: 'cases', col: 4, title: 'Số ca nhiễm' },
                    {
                        type: 'recovered',
                        col: 4,
                        title: 'Số ca hồi phục'
                    },
                    { type: 'death', col: 4, title: 'Số ca tử vong' }
                ].map((item) => (
                    <Grid key={item.type} item xs={12} md={item.col}>
                        <Chart
                            chartType="ComboChart"
                            data={overviewData(covidData?.overview, item.type)}
                            options={{
                                title: item.title,
                                legend: {
                                    position: 'bottom'
                                },
                                height: 300,
                                seriesType: 'bars',
                                series: {
                                    1: { type: 'line' }
                                }
                            }}
                        />
                    </Grid>
                ))}
                <Grid item xs={12}></Grid>
            </Grid>
        </>
    );
}
