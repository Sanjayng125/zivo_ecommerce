import { ColorsType } from "@/constants/colors";
import { useStyles } from "@/hooks/useStyles";
import {
  KeyboardAvoidingView,
  Platform,
  RefreshControl,
  ScrollView,
  StyleSheet,
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
}

export default function ScreenWrapper({
  children,
  scrollable = true,
  edges = ["top"],
  refreshing,
  onRefresh,
  keyboardAvoiding = false,
  stickyHeaderIndices,
}: ScreenWrapperProps) {
  const styles = useStyles(getStyles);

  const content = scrollable ? (
    <ScrollView
      style={styles.scrollView}
      contentContainerStyle={styles.contentContainer}
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
    <SafeAreaView style={styles.container} edges={edges}>
      {keyboardAvoiding ? (
        <KeyboardAvoidingView
          style={styles.keyboardAvoiding}
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
