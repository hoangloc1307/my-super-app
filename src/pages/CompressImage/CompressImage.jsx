import { Button, Stack, TextField } from '@mui/joy';
import { FileUpload, PhotoSizeSelectLarge } from '@mui/icons-material';
import { useState } from 'react';
import axios from 'axios';

export default function CompressImage() {
    const [selectedFile, setSelectedFile] = useState({});

    const handleUpload = (event) => {
        setSelectedFile(event.target.files);
    };

    const handleOptimize = () => {
        const data = JSON.stringify({
            source: {
                url: 'https://i.imgur.com/zDad6bb.jpg'
            }
        });

        const config = {
            headers: {
                'Content-Type': 'application/json'
            },
            withCredentials: false,
            auth: {
                username: 'api',
                password: process.env.REACT_APP_TINIFY_API_KEY
            }
        };

        axios
            .post('https://api.tinify.com/shrink', data, config)
            .then((res) => console.log(res))
            .catch((error) => console.log(error));
    };

    return (
        <>
            <Stack direction={'row'}>
                <Button component="label" startDecorator={<FileUpload />}>
                    Upload
                    <input hidden accept="image/*" multiple type="file" onChange={handleUpload} />
                </Button>
                <TextField
                    placeholder="No file choosen..."
                    value={selectedFile[0]?.name || ''}
                    sx={{ ml: 1, mr: 3, width: '200px' }}
                    disabled
                />
                <Button startDecorator={<PhotoSizeSelectLarge />} loading={false} onClick={handleOptimize}>
                    Optimize
                </Button>
            </Stack>
        </>
    );
}
