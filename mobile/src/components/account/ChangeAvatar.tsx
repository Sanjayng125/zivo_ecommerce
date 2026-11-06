import { radius } from "@/constants/radius";
import { useColors } from "@/hooks/useColors";
import { useStyles, UseStylesContext } from "@/hooks/useStyles";
import { ApiError, authApi } from "@/lib/api";
import { uploadToImageKit } from "@/lib/imagekit";
import { useAuthStore } from "@/store/authStore";
import { Profile } from "@/types";
import { getDefaultAvatar } from "@/utils";
import { Ionicons } from "@expo/vector-icons";
import { useMutation } from "@tanstack/react-query";
import { AxiosError } from "axios";
import * as ImagePicker from "expo-image-picker";
import { useState } from "react";
import { ActivityIndicator, Image, StyleSheet, View } from "react-native";
import { toast } from "sonner-native";
import ActionMenu from "../ui/ActionMenu";

interface ChangeAvatarProps {
  profile: Profile;
  onSuccess?: () => void;
}

export default function ChangeAvatar({
  profile,
  onSuccess,
}: ChangeAvatarProps) {
  const { user } = useAuthStore();
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);

  const styles = useStyles(getStyles);
  const colors = useColors();

  const { mutate: updateAvatarMutation, isPending: isUpdatingAvatar } =
    useMutation({
      mutationFn: async (data: {
        avatar_url: string;
        avatar_file_id: string;
      }) => {
        const res = await authApi.patch("/profile/avatar", data);

        return res.data;
      },
      onSuccess: (data) => {
        onSuccess?.();
        toast.success(data?.message ?? "Avatar updated");
      },
      onError: (error: AxiosError<ApiError>) => {
        const message = error.response?.data?.message ?? "Something went wrong";

        toast.error(message);
      },
      onSettled: () => {
        setIsUploadingAvatar(false);
      },
    });

  const handleAvatarPress = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      toast.error("Permission to access gallery is required");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (result.canceled) return;

    const asset = result.assets[0];

    if (asset.fileSize && asset.fileSize > 5 * 1024 * 1024) {
      toast.error("Image must be under 5MB");
      return;
    }

    setIsUploadingAvatar(true);
    try {
      const fileUri = asset.uri;
      const fileName = fileUri.split("/").pop() || `avatar-${Date.now()}.jpg`;
      const fileMimeType = asset.mimeType ?? "image/jpeg";

      const authRes = await authApi.post("/profile/avatar-upload-auth", {
        fileName,
      });
      const { token, uploadPayload } = authRes.data;

      const file = {
        uri: fileUri,
        name: fileName,
        type: fileMimeType,
      };

      const { url, fileId } = await uploadToImageKit(
        file,
        token,
        uploadPayload,
      );

      updateAvatarMutation({
        avatar_url: url,
        avatar_file_id: fileId,
      });
    } catch (e) {
      toast.error("Failed to update avatar");
      setIsUploadingAvatar(false);
    }
  };

  return (
    <ActionMenu
      title="Change Avatar"
      options={[
        {
          label: "Choose a photo",
          onPress() {
            handleAvatarPress();
          },
          icon: (
            <Ionicons
              name="image-outline"
              size={20}
              color={colors.btnSecondaryText}
            />
          ),
        },
      ]}
      disabled={isUploadingAvatar || isUpdatingAvatar}
    >
      <View style={styles.avatarContainer}>
        <Image
          source={{
            uri: profile?.avatar_url ?? getDefaultAvatar(user?.name ?? "User"),
          }}
          style={styles.avatar}
        />
        {(isUploadingAvatar || isUpdatingAvatar) && (
          <ActivityIndicator
            size={"large"}
            color={colors.text}
            style={styles.loader}
          />
        )}
      </View>
    </ActionMenu>
  );
}

const getStyles = ({ colors }: UseStylesContext) =>
  StyleSheet.create({
    avatarContainer: {
      width: 160,
      aspectRatio: 1 / 1,
      borderRadius: radius.full,
      alignItems: "center",
      justifyContent: "center",
      borderWidth: 2,
      padding: 2,
      borderColor: colors.textSecondary + "70",
      overflow: "hidden",
      position: "relative",
    },
    avatar: {
      width: "100%",
      aspectRatio: 1 / 1,
      borderRadius: radius.full,
    },
    loader: {
      position: "absolute",
    },
  });
