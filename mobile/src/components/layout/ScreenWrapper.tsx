import { ColorsType } from "@/constants/colors";
import { useStyles } from "@/hooks/useStyles";
import {
  KeyboardAvoidingView,
  Platform,
  RefreshControl,
  ScrollView,
  StyleProp,
  StyleSheet,
  ViewStyle,
} from "react-native";
import { Edge, SafeAreaView } from "react-native-safe-area-context";

interface ScreenWrapperProps {
  children: React.ReactNode;
  scrollable?: boolean;
  edges?: Edge[];
  refreshing?: boolean;
  onRefresh?: () => void;
  keyboardAvoiding?: boolean;
  stickyHeaderIndices?: number[];
  style?: StyleProp<ViewStyle>;
}

export default function ScreenWrapper({
  children,
  scrollable = true,
  edges = ["top"],
  refreshing,
  onRefresh,
  keyboardAvoiding = false,
  stickyHeaderIndices,
  style,
}: ScreenWrapperProps) {
  const styles = useStyles(getStyles);

  const content = scrollable ? (
    <ScrollView
      style={styles.scrollView}
      contentContainerStyle={[styles.contentContainer, style]}
      showsVerticalScrollIndicator={false}
      keyboardShouldPersistTaps="handled"
      stickyHeaderIndices={stickyHeaderIndices}
      refreshControl={
        onRefresh ? (
          <RefreshControl
            refreshing={refreshing ?? false}
            onRefresh={onRefresh}
          />
        ) : undefined
      }
    >
      {children}
    </ScrollView>
  ) : (
    children
  );

  return (
    <SafeAreaView
      style={[styles.container, !scrollable && !keyboardAvoiding && style]}
      edges={edges}
    >
      {keyboardAvoiding ? (
        <KeyboardAvoidingView
          style={[
            styles.keyboardAvoiding,
            keyboardAvoiding && !scrollable && style,
          ]}
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 24}
        >
          {content}
        </KeyboardAvoidingView>
      ) : (
        content
      )}
    </SafeAreaView>
  );
}

const getStyles = (colors: ColorsType) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    scrollView: {
      flex: 1,
    },
    contentContainer: {
      flexGrow: 1,
    },
    keyboardAvoiding: {
      flex: 1,
    },
  });
