import { useEffect, useState } from 'react';
import axios from 'axios';
import { Chart } from 'react-google-charts';
import { Grid, Paper } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import { Button, Divider, Tab, tabClasses, TabList, TabPanel, Tabs, Typography } from '@mui/joy';

const columns = [
    { field: 'name', headerName: 'Tỉnh/Thành phố', headerAlign: 'center', align: 'left', flex: 1 },
    { field: 'cases', headerName: 'Tổng số ca mắc', headerAlign: 'center', align: 'center', flex: 1 },
    { field: 'casesToday', headerName: 'Số ca mắc mới', headerAlign: 'center', align: 'center', flex: 1 },
    { field: 'death', headerName: 'Số ca tử vong', headerAlign: 'center', align: 'center', flex: 1 }
];

export default function Covid19() {
    const [covidData, setCovidData] = useState({});
    const [pageSize, setPageSize] = useState(10);

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
            <Grid container spacing={0}>
                {/* Today */}
                <Typography level="h4" component="h2" sx={{ mb: 1 }} color="primary">
                    Tình hình dịch bệnh
                </Typography>
                <Grid item xs={12} sx={{ mb: 10 }}>
                    <Tabs
                        size="sm"
                        defaultValue={0}
                        sx={(theme) => ({
                            '--Tabs-gap': '0px',
                            boxShadow: 'sm',
                            border: `1px solid ${theme.vars.palette.divider}`
                        })}
                    >
                        <TabList
                            sx={{
                                '--List-item-radius': '0px',
                                borderRadius: 0,
                                [`& .${tabClasses.root}`]: {
                                    fontWeight: 'lg',
                                    flex: 1,
                                    bgcolor: 'background.body',
                                    position: 'relative',
                                    [`&.${tabClasses.selected}`]: {
                                        color: 'primary.500'
                                    },
                                    [`&.${tabClasses.selected}:before`]: {
                                        content: '""',
                                        display: 'block',
                                        position: 'absolute',
                                        bottom: -1,
                                        width: '100%',
                                        height: 2,
                                        bgcolor: 'primary.400'
                                    },
                                    [`&.${tabClasses.focusVisible}`]: {
                                        outlineOffset: '-3px'
                                    }
                                }
                            }}
                        >
                            <Tab>Việt Nam</Tab>
                            <Tab>Thế giới</Tab>
                        </TabList>
                        <TabPanel value={0} sx={{ p: 3 }}>
                            <Grid container spacing={2}>
                                <Grid item xs={12} md={4}>
                                    <Button
                                        variant="soft"
                                        color="warning"
                                        size="lg"
                                        startDecorator={'Ca nhiễm:'}
                                        fullWidth
                                        component="div"
                                    >
                                        {covidData.total?.internal.cases}
                                    </Button>
                                </Grid>
                                <Grid item xs={12} md={4}>
                                    <Button
                                        variant="soft"
                                        color="success"
                                        size="lg"
                                        startDecorator={'Hồi phục:'}
                                        fullWidth
                                        component="div"
                                    >
                                        {covidData.total?.internal.recovered}
                                    </Button>
                                </Grid>
                                <Grid item xs={12} md={4}>
                                    <Button
                                        variant="soft"
                                        color="danger"
                                        size="lg"
                                        startDecorator={'Tử vong:'}
                                        fullWidth
                                        component="div"
                                    >
                                        {covidData.total?.internal.death}
                                    </Button>
                                </Grid>
                            </Grid>
                        </TabPanel>
                        <TabPanel value={1} sx={{ p: 3 }}>
                            <Grid container spacing={2}>
                                <Grid item xs={12} md={4}>
                                    <Button
                                        variant="soft"
                                        color="warning"
                                        size="lg"
                                        startDecorator={'Ca nhiễm:'}
                                        fullWidth
                                        component="div"
                                    >
                                        {covidData.total?.world.cases}
                                    </Button>
                                </Grid>
                                <Grid item xs={12} md={4}>
                                    <Button
                                        variant="soft"
                                        color="success"
                                        size="lg"
                                        startDecorator={'Hồi phục:'}
                                        fullWidth
                                        component="div"
                                    >
                                        {covidData.total?.world.recovered}
                                    </Button>
                                </Grid>
                                <Grid item xs={12} md={4}>
                                    <Button
                                        variant="soft"
                                        color="danger"
                                        size="lg"
                                        startDecorator={'Tử vong:'}
                                        fullWidth
                                        component="div"
                                    >
                                        {covidData.total?.world.death}
                                    </Button>
                                </Grid>
                            </Grid>
                        </TabPanel>
                    </Tabs>
                </Grid>

                {/* Total */}

                {/* Overview 7 days */}
                <Typography level="h4" component="h2" sx={{ mb: 1 }} color="primary">
                    Diễn biến 7 ngày gần đây
                </Typography>
                <Grid container sx={{ mb: 10 }}>
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
                </Grid>

                {/* Data by locations */}
                <Typography level="h4" component="h2" sx={{ mb: 1 }} color="primary">
                    Tình hình dịch bệnh tại địa phương
                </Typography>
                <Grid item xs={12}>
                    <DataGrid
                        rows={locationsData(covidData?.locations)}
                        columns={columns}
                        density="compact"
                        autoHeight
                        initialState={{
                            sorting: {
                                sortModel: [{ field: 'casesToday', sort: 'desc' }]
                            }
                        }}
                        disableSelectionOnClick
                        pageSize={pageSize}
                        rowsPerPageOptions={[10, 20, 50]}
                        onPageSizeChange={(value) => setPageSize(value)}
                        getRowClassName={(params) => (params.indexRelativeToCurrentPage % 2 === 0 ? 'even' : 'odd')}
                        sx={{
                            '.even': {
                                backgroundColor: '#0000000a'
                            },
                            '.MuiDataGrid-row:hover': {
                                backgroundColor: '#b9e0ff42'
                            }
                        }}
                    />
                </Grid>
            </Grid>
        </>
    );
}
