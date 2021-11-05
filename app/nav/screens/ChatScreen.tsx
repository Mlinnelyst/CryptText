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
} from "react-native";
import { MessageComponent } from "../../components/MessageComponent";
import { useFirstRender } from "../../components/useFirstRender";
import { MessageData } from "../../cryptography/message";
import { ClientKeyContext } from "../../providers/ClientKeyProvider";
import { MessagesContext } from "../../providers/MessagesProvider";
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

  var messages = getContactMessages(route.params.contact);

  const [text, onChangeText] = React.useState("Write a reply...");

  useEffect(() => {
    navigation.setOptions({
      headerTitle: route.params.contact.name,
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
              Keyboard.dismiss;
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
