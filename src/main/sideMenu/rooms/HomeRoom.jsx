import HomeIcon from '@mui/icons-material/Home';
import { useParams } from "react-router-dom";
import Room from './Room';
import { useTranslation } from 'react-i18next';

export default () => {
    const { room } = useParams();
    const { t } = useTranslation(["main"]);
    return (
        <Room
            icon={<HomeIcon style={{ width: 30, height: 30 }} />}
            text={t("home")}
            link={"/"}
            selected={!room}
        />
    )
}