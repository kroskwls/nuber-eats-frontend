import React from 'react';
import logo from '../logo.svg';

interface ILogoProps {
	className?: string
}

export const Logo: React.FC<ILogoProps> = ({ className }) => {
	return <img className={className} src={logo} alt='logo' />;
}