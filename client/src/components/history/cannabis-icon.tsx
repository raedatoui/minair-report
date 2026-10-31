import SvgIcon, { SvgIconProps } from '@mui/material/SvgIcon';
import { CDN, logo as logoPath } from '../../constants';

export default function CannabisIcon(props: SvgIconProps) {
    return (
        <SvgIcon {...props} viewBox="0 0 24 24">
            <image href={`${CDN}${logoPath}cannabis-leaf.png`} width="24" height="24" preserveAspectRatio="xMidYMid meet" />
        </SvgIcon>
    );
}
