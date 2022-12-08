import { Alert, Box, Button, Chip, Snackbar, Stack, TextField, Tooltip, Typography } from '@mui/material';
import { NoteAdd, MoreHoriz, Check, Delete } from '@mui/icons-material/';
import { DataGrid, GridActionsCellItem } from '@mui/x-data-grid';
import { useMemo, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';

import Status from './components/Status';

export default function ToDo() {
    const columns = useMemo(
        () => [
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
                            icon={
                                <Tooltip title="Mark As Complete">
                                    <Check />
                                </Tooltip>
                            }
                            label="Done"
                            onClick={() => handleCompletedTask(id)}
                            color="success"
                        />,
                        <GridActionsCellItem
                            icon={
                                <Tooltip title="Delete">
                                    <Delete />
                                </Tooltip>
                            }
                            label="Delete"
                            onClick={() => handleDeleteTask(id)}
                            color="error"
                        />
                    ];
                }
            }
        ],
        // eslint-disable-next-line
        []
    );

    // States
    const [filter, setFilter] = useState('All');
    const [task, setTask] = useState('');
    const [pageSize, setPageSize] = useState(5);
    const [taskList, setTaskList] = useState(
        (() => {
            return JSON.parse(localStorage.getItem('todo')) ?? [];
        })()
    );
    const [toast, setToast] = useState({
        show: false,
        message: '',
        color: 'success',
        undo: null
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
            setToast({ ...toast, show: true, message: 'Add new task successfully!', color: 'success', undo: null });
        }
    };

    const filterTaskList = useMemo(
        () => (filter === 'All' ? taskList : taskList.filter((item) => item.status === filter)),
        [taskList, filter]
    );

    const handleDeleteTask = (id) => {
        const tasks = taskList.filter((task) => task.id !== id);
        const undoTasks = JSON.parse(JSON.stringify(taskList));
        localStorage.setItem('todo', JSON.stringify(tasks));
        setTaskList(tasks);
        setToast({
            ...toast,
            show: true,
            message: 'Delete task successfully!',
            color: 'success',
            undo: () => {
                handleHideToast();
                localStorage.setItem('todo', JSON.stringify(undoTasks));
                setTaskList([...undoTasks]);
            }
        });
    };

    const handleCompletedTask = (id) => {
        const tasks = JSON.parse(localStorage.getItem('todo'));
        const task = tasks.find((task) => task.id === id);
        if (task.status === 'Pending') {
            const undoTasks = JSON.parse(JSON.stringify(tasks));
            task.status = 'Completed';
            localStorage.setItem('todo', JSON.stringify(tasks));
            setTaskList([...tasks]);
            setToast({
                ...toast,
                show: true,
                message: 'Congratulation! Your task is completed. 🎉',
                color: 'success',
                undo: () => {
                    handleHideToast();
                    localStorage.setItem('todo', JSON.stringify(undoTasks));
                    setTaskList([...undoTasks]);
                }
            });
        }
    };

    const handelEditTask = (params) => {
        const tasks = JSON.parse(localStorage.getItem('todo'));
        const task = tasks.find((task) => task.id === params.id);
        task[params.field] = params.value;
        localStorage.setItem('todo', JSON.stringify(tasks));
        setTaskList([...tasks]);
    };

    const handleHideToast = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }

        setToast({
            ...toast,
            show: false,
            message: '',
            color: 'success',
            undo: null
        });
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
                <Button variant="contained" startIcon={<NoteAdd />} onClick={handleAddTask}>
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
                        initialState={{
                            sorting: {
                                sortModel: [{ field: 'created_at', sort: 'desc' }]
                            }
                        }}
                        editMode={'cell'}
                        onCellEditCommit={(params) => handelEditTask(params)}
                    />
                </Box>
            </Box>
            <Snackbar open={toast.show} autoHideDuration={5000} onClose={handleHideToast}>
                <Alert
                    onClose={handleHideToast}
                    severity={toast.color}
                    variant="filled"
                    action={
                        toast.undo ? (
                            <Button color="inherit" size="small" onClick={toast.undo}>
                                UNDO
                            </Button>
                        ) : null
                    }
                    sx={{ width: '100%' }}
                >
                    {toast.message}
                </Alert>
            </Snackbar>
        </>
    );
}
