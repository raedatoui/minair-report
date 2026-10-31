import SvgIcon, { SvgIconProps } from '@mui/material/SvgIcon';

export default function CannabisIcon(props: SvgIconProps) {
    return (
        <SvgIcon {...props} viewBox="0 0 24 24">
            <image href="/images/cannabis-leaf.png" width="24" height="24" preserveAspectRatio="xMidYMid meet" />
        </SvgIcon>
    );
}
