import React, { useState } from "react";
import { StyleProp, StyleSheet, View, ViewStyle } from "react-native";

import { conditionChaining } from "@sendbird/uikit-utils";

import Icon from "../../components/Icon";
import Image from "../../components/Image";
import createStyleSheet from "../../styles/createStyleSheet";
import useUIKitTheme from "../../theme/useUIKitTheme";
import AvatarGroup from "./AvatarGroup";
import AvatarIcon from "./AvatarIcon";

type SubComponents = {
  Group: typeof AvatarGroup;
  Icon: typeof AvatarIcon;
};
type Props = {
  uri?: string;
  size?: number;
  square?: boolean;
  muted?: boolean;
  containerStyle?: StyleProp<ViewStyle>;
};
const Avatar: ((props: Props) => JSX.Element) & SubComponents = ({
  uri,
  square,
  muted = false,
  size = 56,
  containerStyle,
}) => {
  const { colors, palette } = useUIKitTheme();
  const [loadFailure, setLoadFailure] = useState(false);

  return (
    <View
      style={[
        styles.container,
        { width: size, height: size, borderRadius: square ? 0 : size / 2, backgroundColor: palette.background300 },
        containerStyle,
      ]}
    >
      {conditionChaining(
        [Boolean(uri) && !loadFailure],
        [
          <Image
            onError={() => setLoadFailure(true)}
            source={{ uri }}
            resizeMode={"cover"}
            style={StyleSheet.absoluteFill}
          />,
          <Image
            onError={() => setLoadFailure(true)}
            source={{
              uri:
                uri ??
                "https://d37oornn0327yg.cloudfront.net/data/upload/20230323/1fcc015a-fbb2-4c64-91f7-811443ada0b7.png",
            }}
            resizeMode={"cover"}
            style={StyleSheet.absoluteFill}
          />,
        ]
      )}
      {muted && <MutedOverlay size={size} />}
    </View>
  );
};

const MutedOverlay = ({ size }: { size: number }) => {
  const { palette } = useUIKitTheme();
  return (
    <View style={[styles.container, StyleSheet.absoluteFill]}>
      <View style={[StyleSheet.absoluteFill, { backgroundColor: palette.primary300, opacity: 0.5 }]} />
      <Icon color={palette.onBackgroundDark01} icon={"mute"} size={size * 0.72} />
    </View>
  );
};

const styles = createStyleSheet({
  container: {
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
  },
});

Avatar.Group = AvatarGroup;
Avatar.Icon = AvatarIcon;
export default Avatar;
