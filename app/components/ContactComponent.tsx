import React, { useContext, useEffect, useState } from 'react';
import { View, Text } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { MessageData } from '../cryptography/message';
import { Contact, ContactsContext } from '../providers/ContactsProvider';
import { MessagesContext } from '../providers/MessagesProvider';
import Colors from '../styles/Colors';
import Styles from '../styles/Styles';
import { ContactNameCircleComponent } from './ContactNameCircle';

function contactLastMessageTime(timestamp: number): string {
  const date = new Date(timestamp);

  var hours: string = date.getHours().toString();
  hours = hours.length < 2 ? '0' + hours : hours;

  var minutes: string = date.getMinutes().toString();
  minutes = minutes.length < 2 ? '0' + minutes : minutes;

  return `${hours}:${minutes}`;
}

export function ContactComponent({
  contact,
  onPress,
}: {
  contact: Contact;
  onPress: () => void;
}) {
  const { setContact } = useContext(ContactsContext);
  const { getContactMessages, messagesChanged } = useContext(MessagesContext);
  const [latestMessage, setLatestMessage] = useState<MessageData | undefined>();

  useEffect(() => {
    const messages = getContactMessages(contact);

    if (messages.length > 0) {
      setLatestMessage(messages[messages.length - 1]);
      contact.unreadMessages++;
    }
  }, [messagesChanged]);

  useEffect(() => {}, [contact.name, contact.unreadMessages]);

  return (
    <TouchableOpacity
      style={{
        width: '90%',
        alignSelf: 'center',
        flexDirection: 'row',
        marginTop: 3,
        marginBottom: 3,
      }}
      onPress={onPress}
    >
      <View style={{ flex: 1, marginRight: 10 }}>
        <ContactNameCircleComponent contact={contact} />
      </View>
      <View
        style={{
          flex: 5,
          borderBottomWidth: 1,
          borderBottomColor: Colors.lightGray,
        }}
      >
        <Text
          style={[
            Styles.title,
            {
              marginBottom: 0,
              color: Colors.darkBlue,
              fontSize: Styles.text.fontSize,
            },
          ]}
        >
          {contact.name}
        </Text>
        <Text style={[Styles.text, { fontSize: 13 }]}>
          {latestMessage?.text.slice(0, 30)}
        </Text>
      </View>

      <View>
        {contact.unreadMessages > 0 && (
          <Text
            style={{
              textAlign: 'center',
              justifyContent: 'center',
              alignItems: 'center',
              color: Colors.white,
              backgroundColor: Colors.blue,
              padding: 1,
              borderStyle: 'solid',
              borderColor: Colors.blue,
              borderWidth: 2,
              borderRadius: 90,
              marginRight: 10,
            }}
          >
            {contact.unreadMessages}
          </Text>
        )}
      </View>

      <View style={{ flex: 1 }}>
        <View
          style={{
            flex: 1,
            alignContent: 'flex-start',
          }}
        >
          <Text style={[Styles.text]}>
            {latestMessage
              ? contactLastMessageTime(latestMessage.timestamp)
              : ''}
          </Text>
        </View>
        <View
          style={{
            flex: 1,
            alignContent: 'flex-start',
          }}
        ></View>
      </View>
    </TouchableOpacity>
  );
}
