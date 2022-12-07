import { Alert, Box, Button, Chip, Snackbar, Stack, TextField, Typography } from '@mui/material';
import { NoteAdd, MoreHoriz, Check, Delete } from '@mui/icons-material/';
import { DataGrid, GridActionsCellItem } from '@mui/x-data-grid';
import { useMemo, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';

import Status from './components/Status';

export default function ToDo() {
    const columns = [
        {
            field: 'no',
            headerName: 'No.',
            filterable: false,
            sortable: false,
            disableColumnMenu: true,
            renderCell: (params) => params.api.getRowIndex(params.id) + 1
        },
        {
            field: 'task',
            headerName: 'Task',
            width: 300,
            editable: true,
            align: 'left',
            headerAlign: 'center',
            hideable: false
        },
        {
            field: 'status',
            headerName: 'Status',
            width: 150,
            editable: false,
            align: 'center',
            headerAlign: 'center',
            sortable: false,
            filterable: false,
            hideable: false,
            disableColumnMenu: true,
            renderCell: (params) => {
                return params.value === 'Pending' ? (
                    <Status icon={<MoreHoriz />} label="Pending" color="warning" />
                ) : (
                    <Status icon={<Check />} label="Completed" color="success" />
                );
            }
        },
        {
            field: 'created_at',
            headerName: 'Created At',
            width: 200,
            editable: false,
            align: 'center',
            headerAlign: 'center',
            renderCell: (params) => {
                return new Date(params.value).toLocaleString('vi', {
                    dateStyle: 'short',
                    timeStyle: 'medium'
                });
            }
        },
        {
            field: 'actions',
            type: 'actions',
            headerName: 'Actions',
            width: 100,
            hideable: false,
            getActions: ({ id }) => {
                return [
                    <GridActionsCellItem
                        icon={<Check />}
                        label="Done"
                        onClick={() => handleCompletedTask(id)}
                        color="success"
                    />,
                    <GridActionsCellItem
                        icon={<Delete />}
                        label="Delete"
                        onClick={() => handleDeleteTask(id)}
                        color="error"
                    />
                ];
            }
        }
    ];

    // States
    const [filter, setFilter] = useState('All');
    const [taskList, setTaskList] = useState(
        (() => {
            return JSON.parse(localStorage.getItem('todo')) ?? [];
        })()
    );
    const [task, setTask] = useState('');
    const [pageSize, setPageSize] = useState(5);
    const [toast, setToast] = useState({
        show: true,
        message: '',
        color: 'success'
    });

    // Function handler
    const handleAddTask = () => {
        if (task) {
            const newTask = {
                id: uuidv4(),
                task,
                status: 'Pending',
                created_at: new Date().toJSON()
            };
            localStorage.setItem('todo', JSON.stringify([...taskList, newTask]));
            setTaskList([...taskList, newTask]);
            setTask('');
        }
    };

    const filterTaskList = useMemo(
        () => (filter === 'All' ? taskList : taskList.filter((item) => item.status === filter)),
        [taskList, filter]
    );

    const handleDeleteTask = (id) => {
        const tasks = taskList.filter((task) => task.id !== id);
        localStorage.setItem('todo', JSON.stringify(tasks));
        setTaskList(tasks);
    };

    const handleCompletedTask = (id) => {
        const tasks = JSON.parse(localStorage.getItem('todo'));
        const task = tasks.find((task) => task.id === id);
        if (task.status === 'Pending') {
            task.status = 'Completed';
            localStorage.setItem('todo', JSON.stringify(tasks));
            setTaskList([...tasks]);
        }
    };

    const handelEditTask = (params) => {
        const tasks = JSON.parse(localStorage.getItem('todo'));
        const task = tasks.find((task) => task.id === params.id);
        task[params.field] = params.value;
        localStorage.setItem('todo', JSON.stringify(tasks));
        setTaskList([...tasks]);
    };

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
                    onChange={(e) => {
                        setTask(e.target.value);
                    }}
                    onKeyDown={(e) => {
                        if (e.code === 'Enter') {
                            handleAddTask();
                        }
                    }}
                />
                <Button variant="contained" endIcon={<NoteAdd />} onClick={handleAddTask}>
                    Add
                </Button>
            </Box>
            <Box sx={{ mt: 5 }}>
                <Typography variant="h5" component={'h2'}>
                    Task list
                </Typography>
                <Stack direction="row" spacing={1} sx={{ my: 2 }}>
                    {['All', 'Pending', 'Completed'].map((item) => (
                        <Chip
                            key={item}
                            label={item}
                            variant={'filled'}
                            color={filter === item ? 'primary' : 'default'}
                            onClick={() => {
                                setFilter(item);
                            }}
                        />
                    ))}
                </Stack>
                <Box sx={{ width: '100%' }}>
                    <DataGrid
                        rows={filterTaskList}
                        columns={columns}
                        density={'standard'}
                        pageSize={pageSize}
                        rowsPerPageOptions={[5, 10, 25, 50]}
                        onPageSizeChange={(newPageSize) => setPageSize(newPageSize)}
                        autoHeight
                        editMode={'cell'}
                        onCellEditCommit={(params) => handelEditTask(params)}
                    />
                </Box>
            </Box>
            {/* <Snackbar
                open={toast.show}
                autoHideDuration={6000}
                onClose={() => setToast({ ...toast, show: false, message: '' })}
            >
                <Alert
                    onClose={() => setToast({ ...toast, show: false, message: '' })}
                    severity={toast.color}
                    sx={{ width: '100%' }}
                >
                    {toast.message}
                </Alert>
            </Snackbar> */}
        </>
    );
}
