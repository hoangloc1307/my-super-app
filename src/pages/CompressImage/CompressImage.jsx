import { Button, Stack } from '@mui/joy';
import { Delete, FileUpload, FileDownload, PhotoSizeSelectLarge } from '@mui/icons-material';
import { useState } from 'react';
import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';
import { IconButton, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';

import { numberWithSizeUnit } from '~/utils/stringFormat';

const litmitImage = 20;

export default function CompressImage() {
    const [selectedFiles, setSelectedFiles] = useState([]);

    const handleUpload = (event) => {
        const uploadingFiles = [...event.target.files];
        const uploadedFiles = [...selectedFiles];
        while (uploadedFiles.length < litmitImage && uploadingFiles.length > 0) {
            const uploadingFile = uploadingFiles.shift();
            let isExists = false;
            for (const item of uploadedFiles) {
                if (item.file.name === uploadingFile.name && item.file.size === uploadingFile.size) {
                    isExists = true;
                    break;
                }
            }
            if (!isExists) {
                uploadedFiles.push({ id: uuidv4(), file: uploadingFile, status: 'Not optimize' });
            }
        }
        if (uploadedFiles.length !== selectedFiles.length) {
            setSelectedFiles(uploadedFiles);
        }
    };

    const handleRemoveImage = (id) => {
        const index = selectedFiles.findIndex((item) => item.id === id);

        const uploadedFiles = [...selectedFiles.slice(0, index), ...selectedFiles.slice(index + 1)];

        setSelectedFiles(uploadedFiles);
    };

    const handleOptimize = async () => {
        for (const item of selectedFiles) {
            const result = await axios.post('http://localhost:8000/image/compress', item.file, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            console.log(result);
        }
    };

    return (
        <>
            <Stack direction={'row'} spacing={2}>
                <Button component="label" startDecorator={<FileUpload />}>
                    Upload
                    <input hidden accept="image/*" multiple type="file" value={[]} onChange={handleUpload} />
                </Button>
                <Button startDecorator={<PhotoSizeSelectLarge />} loading={false} onClick={handleOptimize}>
                    Optimize
                </Button>
            </Stack>
            {/* List image */}
            <TableContainer component={Paper} sx={{ mt: 3 }}>
                <Table stickyHeader size="small">
                    <TableHead>
                        <TableRow>
                            <TableCell>Name</TableCell>
                            <TableCell>Size</TableCell>
                            <TableCell>Status</TableCell>
                            <TableCell>Action</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {selectedFiles.length > 0 ? (
                            selectedFiles.map((item) => (
                                <TableRow key={item.id}>
                                    <TableCell>{item.file?.name}</TableCell>
                                    <TableCell>{numberWithSizeUnit(item.file?.size)}</TableCell>
                                    <TableCell>{item.status}</TableCell>
                                    <TableCell>
                                        <IconButton size="small" color="primary">
                                            <FileDownload />
                                        </IconButton>
                                        <IconButton
                                            size="small"
                                            color="error"
                                            onClick={() => handleRemoveImage(item.id)}
                                        >
                                            <Delete />
                                        </IconButton>
                                    </TableCell>
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell align="center" colSpan={4}>
                                    Up to {litmitImage} images, no size limit!
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </TableContainer>
        </>
    );
}
