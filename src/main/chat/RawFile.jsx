import DownloadIcon from '@mui/icons-material/Download';
import Button from '@mui/material/Button';
import axios from "axios";
import fileDownload from "js-file-download";

export default ({ fileData: { name, public_id } }) => {
    const url = `https://res.cloudinary.com/${cld.getConfig().cloud.cloudName}/raw/upload/v1/${public_id}`;
    const extension = public_id.match(/\.[0-9a-z]+$/i)[0] ?? "";
    const nameWithExtension = name + extension;

    const handleDownload = () => {
        axios
            .get(url, {
                responseType: "blob"
            })
            .then((res) => {
                fileDownload(res.data, nameWithExtension);
            });
    };

    return (
        <Button
            variant="outlined"
            startIcon={<DownloadIcon />}
            onClick={handleDownload}
        >
            {nameWithExtension}
        </Button>
    )
}