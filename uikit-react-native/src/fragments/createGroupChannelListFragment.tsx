import React from "react";
import { SwipeListView } from "react-native-swipe-list-view";
import { useGroupChannelList } from "@sendbird/uikit-chat-hooks";
import { PASS, useAppState, useFreshCallback } from "@sendbird/uikit-utils";

import StatusComposition from "../components/StatusComposition";
import GroupChannelPreviewContainer from "../containers/GroupChannelPreviewContainer";
import createGroupChannelListModule from "../domain/groupChannelList/module/createGroupChannelListModule";
import type {
  GroupChannelListFragment,
  GroupChannelListModule,
  GroupChannelListProps,
} from "../domain/groupChannelList/types";
import { useSendbirdChat } from "../hooks/useContext";
import { useColorScheme } from "react-native";
import { useUIKitTheme } from "@sendbird/uikit-react-native-foundation";
import { View, TouchableOpacity, Text } from "react-native";
import { Icon } from "@sendbird/uikit-react-native-foundation";

const createGroupChannelListFragment = (initModule?: Partial<GroupChannelListModule>): GroupChannelListFragment => {
  const GroupChannelListModule = createGroupChannelListModule(initModule);
  return ({
    onPressChannel,
    onPressCreateChannel,
    onDeletedChanel,
    onEnabledNotificationChanel,
    onStartChat,
    queryCreator,
    collectionCreator,
    renderGroupChannelPreview,
    skipTypeSelection = false,
    flatListProps = {},
    menuItemCreator = PASS,
  }) => {
    const { sdk, currentUser, features, markAsDeliveredWithChannel } = useSendbirdChat();
    const { groupChannels, next, loading } = useGroupChannelList(sdk, currentUser?.userId, {
      queryCreator,
      collectionCreator,
      enableCollectionWithoutLocalCache: !queryCreator,
    });

    if (features.deliveryReceiptEnabled) {
      useAppState("change", (status) => {
        if (status === "active") groupChannels.forEach(markAsDeliveredWithChannel);
      });
    }

    // const _renderGroupChannelPreview: GroupChannelListProps['List']['renderGroupChannelPreview'] = useFreshCallback(
    //   (channel, onLongPressChannel) => {
    //     if (renderGroupChannelPreview) return renderGroupChannelPreview(channel, onLongPressChannel);
    //     return (
    //       <GroupChannelPreviewContainer
    //         channel={channel}
    //         onPress={() => onPressChannel(channel)}
    //         onLongPress={() => onLongPressChannel()}
    //       />
    //     );
    //   },
    // );

    const _renderGroupChannelPreview: GroupChannelListProps["List"]["renderGroupChannelPreview"] = useFreshCallback(
      ({ item: channel }, onLongPressChannel) => {
        if (renderGroupChannelPreview) return renderGroupChannelPreview({ item: channel }, onLongPressChannel);
        return (
          <GroupChannelPreviewContainer
            channel={channel}
            onPress={() => onPressChannel(channel)}
            onLongPress={() => {}}
          />
        );
      }
    );

    const isChannelTypeAvailable = features.broadcastChannelEnabled || features.superGroupChannelEnabled;
    const { colors } = useUIKitTheme();
    return (
      <GroupChannelListModule.Provider>
        <GroupChannelListModule.Header />
        <StatusComposition loading={loading} LoadingComponent={<GroupChannelListModule.StatusLoading />}>
          {/* <GroupChannelListModule.List
            menuItemCreator={menuItemCreator}
            renderGroupChannelPreview={_renderGroupChannelPreview}
            groupChannels={groupChannels}
            onLoadNext={next}
            
            flatListProps={{
              ListEmptyComponent: <GroupChannelListModule.StatusEmpty />,
              contentContainerStyle: { flexGrow: 1, backgroundColor: colors.onBackgroundReverse01, paddingTop:16},
              ...flatListProps,
            }}
          /> */}
          {groupChannels.length !== 0 && (
            <SwipeListView
              data={groupChannels}
              renderItem={_renderGroupChannelPreview}
              renderHiddenItem={(data, rowMap) => {
                const channel = data.item;
                return (
                  <View
                    style={{
                      flexDirection: "row",
                      justifyContent: "flex-end",
                      alignItems: "center",
                      height: "100%",
                      padding: 16,
                    }}
                  >
                    {/* <TouchableOpacity
                  style={{ width: 56, justifyContent: 'center', alignItems: 'center', marginRight: 8}}
                  onPress={()=>onPinnedChanel(channel)}
                >
                  <View style={{flexDirection: 'row', justifyContent: 'center', alignItems: 'center',height: 56, width: 56, borderRadius: 26,backgroundColor: '#727476',}}>
                    <Icon icon='pin' color='white'></Icon>
                  </View>
                </TouchableOpacity> */}
                    <TouchableOpacity
                      style={{ width: 56, justifyContent: "center", alignItems: "center", marginRight: 8 }}
                      onPress={() => onEnabledNotificationChanel(channel)}
                    >
                      <View
                        style={{
                          flexDirection: "row",
                          justifyContent: "center",
                          alignItems: "center",
                          height: 56,
                          width: 56,
                          borderRadius: 26,
                          backgroundColor: channel.myPushTriggerOption === "off" ? "#E0B10C" : "#727476",
                        }}
                      >
                        <Icon
                          icon={channel.myPushTriggerOption === "off" ? "bell-enable" : "bell-disable"}
                          color="white"
                        ></Icon>
                      </View>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={{ width: 56, justifyContent: "center", alignItems: "center" }}
                      onPress={() => onDeletedChanel(channel)}
                    >
                      <View
                        style={{
                          flexDirection: "row",
                          justifyContent: "center",
                          alignItems: "center",
                          height: 56,
                          width: 56,
                          borderRadius: 26,
                          backgroundColor: "#27C18A",
                        }}
                      >
                        <Icon icon="bin" color="white"></Icon>
                      </View>
                    </TouchableOpacity>
                  </View>
                );
              }}
              rightOpenValue={-150}
              previewRowKey={"0"}
              previewOpenValue={-40}
              previewOpenDelay={3000}
              style={{ backgroundColor: colors.onBackgroundReverse01, paddingTop: 16 }}
            />
          )}

          {groupChannels.length == 0 && (
            <View
              style={{
                flex: 1,
                flexDirection: "column",
                width: "100%",
                height: "100%",
                justifyContent: "center",
                alignItems: "center",
                backgroundColor: "#010101",
                paddingBottom: 150,
              }}
            >
              <View
                style={{
                  padding: 24,
                  flexDirection: "row",
                  justifyContent: "center",
                  alignItems: "center",
                  borderWidth: 1,
                  borderColor: "#918F9D",
                  borderRadius: 48,
                  marginBottom: 16,
                }}
              >
                <Icon icon="notification" color="white"></Icon>
              </View>

              <Text
                style={{
                  color: "#918F9D",
                  marginBottom: 16,
                }}
              >
                No Message
              </Text>
              <TouchableOpacity
                style={{
                  borderRadius: 20,
                  backgroundColor: colors.primary,
                }}
                onPress={onStartChat}
              >
                <Text
                  style={{
                    color: colors.text,

                    paddingHorizontal: 18,
                    paddingVertical: 8,
                  }}
                >
                  Start Messaging
                </Text>
              </TouchableOpacity>
            </View>
          )}
        </StatusComposition>
        <GroupChannelListModule.TypeSelector
          skipTypeSelection={isChannelTypeAvailable ? skipTypeSelection : true}
          onSelectType={onPressCreateChannel}
        />
      </GroupChannelListModule.Provider>
    );
  };
};

export default createGroupChannelListFragment;
