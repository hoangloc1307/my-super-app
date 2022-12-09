import { useEffect, useState } from 'react';
import axios from 'axios';
import { Chart } from 'react-google-charts';
import { Grid, Typography } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';

import style from './Covid19.module.scss';

const columns = [
    { field: 'name', headerName: 'Tỉnh/Thành phố', headerAlign: 'center', align: 'left', flex: 1 },
    { field: 'cases', headerName: 'Tổng số ca mắc', headerAlign: 'center', align: 'center', flex: 1 },
    { field: 'casesToday', headerName: 'Số ca mắc mới', headerAlign: 'center', align: 'center', flex: 1 },
    { field: 'death', headerName: 'Số ca tử vong', headerAlign: 'center', align: 'center', flex: 1 }
];

export default function Covid19() {
    const [covidData, setCovidData] = useState({});
    const [pageSize, setPageSize] = useState(5);

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

    const locationsData = (data) => {
        if (data) {
            return [...data].map((item, index) => ({ ...item, id: index }));
        }
        return [];
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
                <Grid item xs={12} sx={{ mt: 5 }}>
                    <DataGrid
                        rows={locationsData(covidData?.locations)}
                        columns={columns}
                        density="compact"
                        autoHeight
                        initialState={{
                            sorting: {
                                sortModel: [{ field: 'cases', sort: 'desc' }]
                            }
                        }}
                        disableSelectionOnClick
                        pageSize={pageSize}
                        rowsPerPageOptions={[5, 10, 25, 50]}
                        onPageSizeChange={(value) => setPageSize(value)}
                        getRowClassName={(params) => (params.indexRelativeToCurrentPage % 2 === 0 ? style.even : 'odd')}
                    />
                </Grid>
            </Grid>
        </>
    );
}
