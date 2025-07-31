import { CSSProperties } from 'react';

import Asset from '../assets/logo.svg';
import { Avatar } from './catalyst';

export interface LogoProps {
  className?: string;
}

export const Logo = ({ className }: LogoProps) => {
  return <Avatar style={{ '--avatar-radius': 0 } as CSSProperties} src={Asset} square disableOutline className={className} />;
};
