import BoltIcon from '@mui/icons-material/Bolt';
import MoodIcon from '@mui/icons-material/Mood';
import TranslateIcon from '@mui/icons-material/Translate';
import { useMediaQuery, useTheme } from '@mui/material';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import { useTranslation } from 'react-i18next';

function ContentBlock({ IconComponent, text, title, flat }) {
    if (flat)
        return (
            <Stack direction="row" sx={{ justifyContent: "space-between" }}>
                <IconComponent color="primary" style={{ height: 75, width: 75 }} />
                <Stack sx={{ alignItems: "end" }}>
                    <Typography sx={{ fontWeight: "bold" }}>
                        {title}
                    </Typography>
                    <Typography sx={{ textAlign: "end" }}>
                        {text}
                    </Typography>
                </Stack>
            </Stack>
        )

    return (
        <Stack sx={{ alignItems: "center", flexBasis: 1, flexGrow: 1, flexShrink: 1 }}>
            <IconComponent color="primary" style={{ height: 75, width: 75 }} />
            <Typography sx={{ fontWeight: "bold" }}>
                {title}
            </Typography>
            <Typography sx={{ textAlign: "center" }}>
                {text}
            </Typography>
        </Stack>
    )
}

function ContentBlocks() {
    const theme = useTheme();
    const column = useMediaQuery(theme.breakpoints.down(600));
    const { t } = useTranslation("welcome");

    return (
        <Stack
            direction={column ? "column" : "row"}
            sx={{ justifyContent: "space-evenly", p: 2 }}
            spacing={3}
            divider={<Divider orientation={column ? "horizontal" : "vertical"} flexItem />}
        >
            <ContentBlock
                IconComponent={BoltIcon}
                title={t("blocks.realtime.title")}
                text={t("blocks.realtime.desc")}
                flat={column}
            />
            <ContentBlock
                IconComponent={MoodIcon}
                title={t("blocks.simple.title")}
                text={t("blocks.simple.desc")}
                flat={column}
            />
            <ContentBlock
                IconComponent={TranslateIcon}
                title={t("blocks.multilingular.title")}
                text={t("blocks.multilingular.desc")}
                flat={column}
            />
        </Stack>
    )
}

export default ContentBlocks;