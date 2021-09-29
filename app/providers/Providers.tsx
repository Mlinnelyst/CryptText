import React from 'react';
import { ClientKeyProvider } from './ClientKeyProvider';
import { ContactsProvider } from './ContactsProvider';
import { Routes } from './Routes';
import { SocketProvider } from './SocketProvider';
import { UserDataContext, UserDataProvider } from './UserDataProvider';

interface ProvidersProps {}

export const Providers: React.FC<ProvidersProps> = ({}) => {
	return (
		<ClientKeyProvider>
			<SocketProvider>
				<UserDataProvider>
					<ContactsProvider>
						<Routes />
					</ContactsProvider>
				</UserDataProvider>
			</SocketProvider>
		</ClientKeyProvider>
	);
};
