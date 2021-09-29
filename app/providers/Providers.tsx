import React from 'react';
import { ClientKeyProvider } from './ClientKeyProvider';
import { ContactsProvider } from './ContactsProvider';
import { Routes } from './Routes';
import { UserDataContext, UserDataProvider } from './UserDataProvider';

interface ProvidersProps {}

export const Providers: React.FC<ProvidersProps> = ({}) => {
	return (
		<ClientKeyProvider>
			<UserDataProvider>
				<ContactsProvider>
					<Routes />
				</ContactsProvider>
			</UserDataProvider>
		</ClientKeyProvider>
	);
};
