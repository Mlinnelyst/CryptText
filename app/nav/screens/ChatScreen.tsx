import React, { useContext, useEffect, useRef, useState } from "react";
import {
  Animated,
  Button,
  FlatList,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Keyboard,
  Platform,
  Modal,
} from "react-native";
import Colors from "../../styles/Colors";
import { MessageComponent } from "../../components/MessageComponent";
import { useFirstRender } from "../../components/useFirstRender";
import { MessageData } from "../../cryptography/message";
import { ClientKeyContext } from "../../providers/ClientKeyProvider";
import { MessagesContext } from "../../providers/MessagesProvider";
import { ContactsContext } from "../../providers/ContactsProvider";
import Styles, { transitionDuration } from "../../styles/Styles";
import {
  hookTransitionEvents,
  unHookTransitionEvents,
} from "../../utility/transitionEventHooks";
import { MainNavProps } from "../MainParamList";
import { MaterialCommunityIcons } from "@expo/vector-icons";

export function ChatScreen({ navigation, route }: MainNavProps<"Chat">) {
  const { client } = useContext(ClientKeyContext);
  const { sendMessage, messagesChanged, getContactMessages } =
    useContext(MessagesContext);
  const transitionEvents = hookTransitionEvents(navigation);
  const { contacts, setContact } = useContext(ContactsContext);

  var messages = getContactMessages(route.params.contact);

  const [text, onChangeText] = React.useState("Write a reply...");
  const [modalText, onChangeModalText] = React.useState("Contact Name");
  const [modalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    navigation.setOptions({
      headerTitle: route.params.contact.name,
      headerRight: () => (
        <TouchableOpacity
          onPress={() => {
            setModalVisible(true);
          }}
        >
          <MaterialCommunityIcons
            name="pencil"
            size={24}
            color={Colors.gray}
            style={{
              flex: 1,
              color: Colors.gray,
              alignSelf: "flex-end",
              textAlignVertical: "center",
              marginRight: 10,
            }}
          />
        </TouchableOpacity>
      ),
    });

    return () => {
      unHookTransitionEvents(navigation, transitionEvents);
    };
  }, []);

  useEffect(() => {
    //setMessages(getContactMessages(route.params.contact));
    messages = getContactMessages(route.params.contact);
    setTimeout(() => {
      list?.scrollToEnd({ animated: true });
    }, 100);
  }, [messagesChanged]);

  const [list, setList] = useState<FlatList<MessageData> | null>(null);

  useEffect(() => {
    if (list != null) {
      setTimeout(() => {
        list?.scrollToEnd({ animated: false });
      }, transitionDuration / 2);

      //setTimeout(() => {
      //setMessages(getContactMessages(route.params.contact));
      //}, transitionDuration);
    }
  }, [list]);

  return (
    <View style={Styles.view}>
      <Modal animationType="slide" transparent={true} visible={modalVisible}>
        <View
          style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
            marginTop: 22,
          }}
        >
          <View
            style={{
              margin: 20,
              backgroundColor: "white",
              borderRadius: 20,
              padding: 35,
              alignItems: "center",
              shadowColor: "#000",
              shadowOffset: {
                width: 0,
                height: 2,
              },
              shadowOpacity: 0.25,
              shadowRadius: 4,
              elevation: 5,
            }}
          >
            <Text>New Contact Name:</Text>
            <TextInput
              maxLength={12}
              style={{
                height: 40,
                width: "85%",
                margin: 10,
                padding: 5,
                backgroundColor: Colors.lightGray,
              }}
              onChangeText={onChangeModalText}
              value={modalText}
            />
            <Button
              title="Done"
              onPress={() => {
                var contacts = route.params.contact;
                contacts.name = modalText;
                setContact(contacts);
                navigation.setOptions({
                  headerTitle: route.params.contact.name,
                });
                setModalVisible(!modalVisible);
              }}
            ></Button>
          </View>
        </View>
      </Modal>
      <Animated.View
        style={[
          Styles.roundCardView,
          {
            backgroundColor: "white",
          },
        ]}
      >
        <FlatList
          ref={(list) => {
            setList(list);
          }}
          data={messages}
          keyExtractor={(message) => {
            return message.timestamp.toString();
          }}
          style={{
            margin: 10,

            flex: 1,
          }}
          renderItem={(info) => (
            <MessageComponent
              message={info.item}
              transitionEvents={transitionEvents}
              sentByUser={client.publicKey == info.item.senderPublicKey}
              previousMessageSentBySameUser={
                info.index == 0
                  ? false
                  : messages[info.index].senderPublicKey ==
                    messages[info.index - 1].senderPublicKey
              }
            />
          )}
          showsVerticalScrollIndicator={true}
          contentContainerStyle={{
            justifyContent: "flex-end",
          }}
          scrollEnabled={true}
          initialNumToRender={messages.length}
        />

        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          keyboardVerticalOffset={80}
          style={{
            flexDirection: "row",
            backgroundColor: "white",
          }}
        >
          <TextInput
            clearTextOnFocus={true}
            style={{
              height: 40,
              width: "80%",
              margin: 5,
              padding: 10,
            }}
            onChangeText={onChangeText}
            value={text}
          />

          <TouchableOpacity
            style={{
              width: "20%",
              height: 60,
              flexDirection: "row",
              alignContent: "stretch",
            }}
            onPress={() => {
              //Keyboard.dismiss;
              sendMessage(route.params.contact, `${text}`);
            }}
          >
            <MaterialCommunityIcons
              name="send"
              size={40}
              color="blue"
              style={{
                alignSelf: "center",
                textAlignVertical: "center",
                paddingLeft: 10,
              }}
            />
          </TouchableOpacity>
        </KeyboardAvoidingView>
      </Animated.View>
    </View>
  );
}
