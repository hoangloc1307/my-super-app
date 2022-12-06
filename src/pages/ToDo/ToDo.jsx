import { Box, Button, Chip, Stack, TextField, Typography } from '@mui/material';
import { NoteAdd, MoreHoriz, Check } from '@mui/icons-material/';
import { DataGrid } from '@mui/x-data-grid';
import { useMemo, useState } from 'react';

const columns = [
    {
        field: 'task',
        headerName: 'Task',
        width: 200,
        editable: true
    },
    {
        field: 'status',
        headerName: 'Status',
        width: 150,
        editable: true,
        type: 'singleSelect',
        valueOptions: ['Pending', 'Completed'],
        renderCell: (params) => {
            return params.value === 'Pending' ? (
                <Chip icon={<MoreHoriz />} label="Pending" variant="outlined" color="warning" size="small" />
            ) : (
                <Chip icon={<Check />} label="Completed" variant="outlined" color="success" size="small" />
            );
        }
    }
];

export default function ToDo() {
    const [filter, setFilter] = useState('All');
    const [taskList, setTaskList] = useState([]);
    const [task, setTask] = useState('');

    const handleFilterClick = (filter) => {
        setFilter(filter);
    };

    const handleAddTask = () => {
        setTaskList([
            ...taskList,
            {
                id: Math.random() * 100,
                task,
                status: 'Pending'
            }
        ]);
        setTask('');
    };

    const handleTaskInputChange = (e) => {
        setTask(e.target.value);
    };

    const filterTaskList = useMemo(
        () => (filter === 'All' ? taskList : taskList.filter((item) => item.status === filter)),
        [taskList, filter]
    );

    return (
        <>
            <Box sx={{ display: 'flex', alignItems: 'flex-end', flexWrap: 'wrap', gap: 2 }}>
                <TextField
                    label="Add a new task"
                    variant="standard"
                    required
                    size="small"
                    fullWidth={true}
                    sx={{ maxWidth: '500px' }}
                    value={task}
                    onChange={handleTaskInputChange}
                />
                <Button variant="contained" endIcon={<NoteAdd />} onClick={handleAddTask}>
                    Add
                </Button>
            </Box>
            <Box>
                <Typography variant="h5" component={'h2'} sx={{ mt: 5 }}>
                    Task list
                </Typography>
                <Stack direction="row" spacing={1} sx={{ my: 2 }}>
                    {['All', 'Pending', 'Completed'].map((item) => (
                        <Chip
                            key={item}
                            label={item}
                            variant={filter === item ? 'filled' : 'filled'}
                            color={filter === item ? 'primary' : 'default'}
                            onClick={() => handleFilterClick(item)}
                        />
                    ))}
                </Stack>
                <Box sx={{ width: '100%', maxWidth: '500px' }}>
                    <DataGrid
                        rows={filterTaskList}
                        columns={columns}
                        density={'compact'}
                        pageSize={5}
                        rowsPerPageOptions={[5, 10, 25, 50]}
                        autoHeight
                        checkboxSelection
                        disableSelectionOnClick
                        experimentalFeatures={{ newEditingApi: true }}
                        editMode={'cell'}
                        onCellEditStop={() => console.log('ok')}
                    />
                </Box>
            </Box>
        </>
    );
}
