import { Button, Stack } from '@mui/joy';
import { Delete, FileUpload, FileDownload, PhotoSizeSelectLarge } from '@mui/icons-material';
import { useState } from 'react';
import axios from 'axios';
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
            for (const file of uploadedFiles) {
                if (file.name === uploadingFile.name && file.size === uploadingFile.size) {
                    isExists = true;
                    break;
                }
            }
            if (!isExists) {
                uploadedFiles.push(uploadingFile);
            }
        }
        if (uploadedFiles.length !== selectedFiles.length) {
            setSelectedFiles(uploadedFiles);
        }
    };

    const handleRemoveImage = (file) => {
        const index = selectedFiles.findIndex((item) => item.name === file.name && item.size === file.size);

        const uploadedFiles = [...selectedFiles.slice(0, index), ...selectedFiles.slice(index + 1)];

        setSelectedFiles(uploadedFiles);
    };

    const handleOptimize = async () => {
        // const data = JSON.stringify({
        //     source: {
        //         url: 'https://i.imgur.com/zDad6bb.jpg'
        //     }
        // });

        // const config = {
        //     headers: {
        //         'Content-Type': 'application/json'
        //     },
        //     withCredentials: false,
        //     auth: {
        //         username: 'api',
        //         password: process.env.REACT_APP_TINIFY_API_KEY
        //     }
        // };

        // axios
        //     .post('https://api.tinify.com/shrink', data, config)
        //     .then((res) => console.log(res))
        //     .catch((error) => console.log(error));

        const file = selectedFiles[0];
        // const fileReader = new FileReader();
        // fileReader.onload = () => {
        //     console.log(fileReader.result);
        // };
        // fileReader.readAsArrayBuffer(file);
        console.log(URL.createObjectURL(file));
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
                                <TableRow key={item.name + item.size}>
                                    <TableCell>{item.name}</TableCell>
                                    <TableCell>{numberWithSizeUnit(item.size)}</TableCell>
                                    <TableCell>Not optimize</TableCell>
                                    <TableCell>
                                        <IconButton size="small" color="primary">
                                            <FileDownload />
                                        </IconButton>
                                        <IconButton size="small" color="error" onClick={() => handleRemoveImage(item)}>
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
