import { Box, Snackbar } from '@mui/material';
import { NoteAdd, MoreHoriz, Check, Delete, Close } from '@mui/icons-material/';
import { DataGrid, GridActionsCellItem } from '@mui/x-data-grid';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { TextField, Button, Typography, RadioGroup, Chip, Radio, Alert, IconButton, Tooltip } from '@mui/joy';
import moment from 'moment';
// import 'moment/locale/vi';

export default function ToDo() {
    // States
    const [filter, setFilter] = useState('All');
    const [task, setTask] = useState('');
    const [pageSize, setPageSize] = useState(5);
    const [toast, setToast] = useState({});
    const [taskList, setTaskList] = useState([]);

    useEffect(() => {
        setTaskList(JSON.parse(localStorage.getItem('todo')) ?? []);
    }, []);

    const handleAddTask = () => {
        if (task) {
            const newTask = {
                id: uuidv4(),
                task,
                status: 'Pending',
                created_at: new Date().toJSON()
            };

            // Save to local storage
            localStorage.setItem('todo', JSON.stringify([...taskList, newTask]));

            // Update state
            setTaskList([...taskList, newTask]);
            setTask('');

            // Show toast
            setToast({
                show: true,
                title: 'Success',
                message: 'Add new task successfully!',
                color: 'success',
                undo: null
            });
        }
    };

    const handleDeleteTask = useCallback(
        (id) => {
            // Find index of task
            const index = taskList.findIndex((task) => task.id === id);

            // Save task list to undo
            const undoTasks = JSON.parse(JSON.stringify(taskList));

            // Remove item
            const tasks = [...taskList.slice(0, index), ...taskList.slice(index + 1)];

            // Save to local storage
            localStorage.setItem('todo', JSON.stringify(tasks));

            // Update state
            setTaskList(tasks);

            // Show toast
            setToast({
                show: true,
                title: 'Success',
                message: 'Delete task successfully!',
                color: 'success',
                undo: () => {
                    handleHideToast();
                    localStorage.setItem('todo', JSON.stringify(undoTasks));
                    setTaskList(undoTasks);
                }
            });
        },
        [taskList]
    );

    const filterTaskList = useMemo(
        () => (filter === 'All' ? taskList : taskList.filter((item) => item.status === filter)),
        [taskList, filter]
    );

    const handleHideToast = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }

        setToast({
            show: false,
            title: '',
            message: '',
            color: '',
            undo: null
        });
    };

    const handleCompletedTask = useCallback(
        (id, row) => {
            if (row.status === 'Pending') {
                const tasks = taskList.map((task) => {
                    if (task.id === id && task.status === 'Pending') {
                        return { ...task, status: 'Completed' };
                    }
                    return task;
                });

                // Save task list to undo
                const undoTasks = JSON.parse(JSON.stringify(taskList));

                // Save to local storage
                localStorage.setItem('todo', JSON.stringify(tasks));

                // Update state
                setTaskList(tasks);

                // Show toast
                setToast({
                    show: true,
                    title: 'Success',
                    message: 'Congratulation! Your task is completed. 🎉',
                    color: 'success',
                    undo: () => {
                        handleHideToast();
                        localStorage.setItem('todo', JSON.stringify(undoTasks));
                        setTaskList(undoTasks);
                    }
                });
            }
        },
        [taskList]
    );

    const handelEditTask = (id, field, value) => {
        const tasks = taskList.map((task) => {
            if (task.id === id) {
                return { ...task, [field]: value };
            }
            return task;
        });

        // Save to local storage
        localStorage.setItem('todo', JSON.stringify(tasks));

        // Update state
        setTaskList(tasks);
    };

    // Grid col def
    const columns = useMemo(
        () => [
            {
                field: 'no',
                headerName: 'No.',
                flex: 1,
                filterable: false,
                sortable: false,
                disableColumnMenu: true,
                align: 'center',
                headerAlign: 'center',
                renderCell: (params) => params.api.getRowIndex(params.id) + 1
            },
            {
                field: 'task',
                headerName: 'Task',
                flex: 5,
                minWidth: 280,
                editable: true,
                align: 'left',
                headerAlign: 'center',
                hideable: false
            },
            {
                field: 'status',
                headerName: 'Status',
                flex: 2,
                editable: false,
                minWidth: 120,
                align: 'center',
                headerAlign: 'center',
                renderCell: (params) => {
                    return params.value === 'Pending' ? (
                        <Chip startDecorator={<MoreHoriz />} variant="solid" size="sm" color="warning">
                            {'Pending'}
                        </Chip>
                    ) : (
                        <Chip startDecorator={<Check />} variant="solid" size="sm" color="success">
                            {'Completed'}
                        </Chip>
                    );
                }
            },
            {
                field: 'created_at',
                headerName: 'Created At',
                flex: 3,
                minWidth: 180,
                editable: false,
                align: 'center',
                headerAlign: 'center',
                renderCell: (params) => {
                    return (
                        <Tooltip title={moment(params.value).format('DD/MM/YYYY hh:mm:ss')}>
                            <span>{moment(params.value).locale('vi').fromNow()}</span>
                        </Tooltip>
                    );
                }
            },
            {
                field: 'actions',
                type: 'actions',
                headerName: 'Actions',
                flex: 2,
                minWidth: 120,
                hideable: false,
                getActions: ({ id, row }) => {
                    return [
                        <GridActionsCellItem
                            icon={
                                <Tooltip title="Mark As Complete">
                                    <Check />
                                </Tooltip>
                            }
                            label="Done"
                            onClick={() => handleCompletedTask(id, row)}
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
        [handleDeleteTask, handleCompletedTask]
    );

    return (
        <>
            {/* Add new task */}
            <Box>
                <Typography level="h2" fontSize="lg" mb={2}>
                    Create new task
                </Typography>
                <Box display="flex" alignItems="flex-end" gap={2}>
                    <TextField
                        color="primary"
                        required
                        label="Task"
                        value={task}
                        size="sm"
                        fullWidth
                        sx={{ maxWidth: '500px' }}
                        onChange={(e) => {
                            setTask(e.target.value);
                        }}
                        onKeyDown={(e) => {
                            if (e.code === 'Enter') {
                                handleAddTask();
                            }
                        }}
                    />
                    <Button onClick={handleAddTask} startDecorator={<NoteAdd />} size="sm">
                        Add
                    </Button>
                </Box>
            </Box>

            {/* Task list */}
            <Box sx={{ mt: 5 }}>
                {/* Title */}
                <Typography level="h2" fontSize="lg">
                    Task list
                </Typography>

                {/* Filter */}
                <RadioGroup row sx={{ my: 2, gap: 1 }}>
                    {['All', 'Pending', 'Completed'].map((item) => {
                        const checked = filter === item;
                        return (
                            <Chip
                                key={item}
                                variant={checked ? 'solid' : 'soft'}
                                color={checked ? 'primary' : 'neutral'}
                                // size="sm"
                            >
                                <Radio
                                    disableIcon
                                    variant={checked ? 'solid' : 'soft'}
                                    size="sm"
                                    overlay
                                    label={item}
                                    value={item}
                                    checked={checked}
                                    onChange={(event) => {
                                        if (event.target.checked) {
                                            setFilter(item);
                                        }
                                    }}
                                />
                            </Chip>
                        );
                    })}
                </RadioGroup>

                {/* Grid */}
                <DataGrid
                    rows={filterTaskList}
                    columns={columns}
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
                    onCellEditCommit={({ field, value, id }) => handelEditTask(id, field, value)}
                />
            </Box>

            {/* Toast */}
            <Snackbar open={toast.show} autoHideDuration={5000} onClose={handleHideToast} sx={{ maxWidth: '500px' }}>
                <Alert
                    variant="soft"
                    color={toast.color}
                    sx={{ width: '100%' }}
                    endDecorator={
                        <>
                            {/* Undo */}
                            {toast.undo ? (
                                <Button
                                    variant="soft"
                                    size="sm"
                                    color={toast.color}
                                    sx={{ mr: 1 }}
                                    onClick={toast.undo}
                                >
                                    Undo
                                </Button>
                            ) : null}
                            {/* Close */}
                            <IconButton variant="soft" size="sm" color={toast.color} onClick={handleHideToast}>
                                <Close />
                            </IconButton>
                        </>
                    }
                >
                    <div>
                        <Typography fontWeight="lg" mt={0.25}>
                            {toast.title}
                        </Typography>
                        <Typography fontSize="sm" sx={{ opacity: 0.8 }}>
                            {toast.message}
                        </Typography>
                    </div>
                </Alert>
            </Snackbar>
        </>
    );
}
