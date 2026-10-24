import { AppButton } from "@/components/ui/AppButton";
import TextField from "@/components/ui/TextField";
import { ColorsType } from "@/constants/colors";
import { spacing } from "@/constants/spacing";
import { typography } from "@/constants/typography";
import { useCart } from "@/hooks/useCart";
import { useColors } from "@/hooks/useColors";
import { useStyles } from "@/hooks/useStyles";
import { api, ApiError } from "@/lib/api";
import { SignInSchema, SignInSchemaType } from "@/lib/schemas";
import { setToken as setSecureStoreToken } from "@/lib/secureStore";
import { useAuthStore } from "@/store/authStore";
import { Ionicons } from "@expo/vector-icons";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { router } from "expo-router";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import {
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Toast from "react-native-toast-message";

const SignIn = () => {
  const { setToken, setUser } = useAuthStore();
  const { clearCart } = useCart();
  const colors = useColors();

  const styles = useStyles(getStyles);

  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<SignInSchemaType>({
    resolver: zodResolver(SignInSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const { mutate: signInMutation, isPending: isSignInPending } = useMutation({
    mutationFn: async ({ email, password }: SignInSchemaType) => {
      const res = await api.post("/auth/sign-in/email", {
        email,
        password,
      });

      return res.data;
    },
    onSuccess: async (data) => {
      await setSecureStoreToken(data.token);
      setToken(data.token);
      setUser(data.user);
      clearCart();

      router.replace("/(tabs)");
    },
    onError: (error: AxiosError<ApiError>) => {
      const message = error.response?.data?.message ?? "Something went wrong";
      Toast.show({
        type: "error",
        text1: message,
      });
    },
  });

  const onSubmit: SubmitHandler<SignInSchemaType> = async (data) =>
    signInMutation(data);

  return (
    <SafeAreaView style={styles.container}>
      {router.canGoBack() && (
        <AppButton
          leftIcon={
            <Ionicons
              name="arrow-back"
              size={30}
              color={colors.btnSecondaryText}
            />
          }
          onPress={() => router.back()}
          style={styles.backBtn}
          size="sm"
          variant="ghost"
        />
      )}
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <ScrollView
          contentContainerStyle={styles.content}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <Text style={styles.title}>Welcome Back</Text>

          <View style={styles.logoContainer}>
            <Image
              source={require("@/assets/images/full_logo.png")}
              style={styles.logo}
            />
          </View>

          <Text style={styles.subtitle}>Sign-In to your account</Text>

          <View>
            <Controller
              control={control}
              name="email"
              render={({ field: { onChange, value } }) => (
                <TextField
                  placeholder="Email"
                  keyboardType="email-address"
                  autoCapitalize="none"
                  value={value}
                  onChangeText={onChange}
                  style={{ marginTop: spacing.xl }}
                />
              )}
            />
            {errors.email && (
              <Text style={styles.error}>{errors.email.message}</Text>
            )}
          </View>

          <View>
            <Controller
              control={control}
              name="password"
              render={({ field: { onChange, value } }) => (
                <TextField
                  placeholder="Password"
                  secureTextEntry
                  value={value}
                  onChangeText={onChange}
                  style={{ marginTop: spacing.xl }}
                />
              )}
            />
            {errors.password && (
              <Text style={styles.error}>{errors.password.message}</Text>
            )}
          </View>

          <AppButton
            title="Sign-In"
            onPress={handleSubmit(onSubmit)}
            disabled={isSignInPending}
            loading={isSignInPending}
            style={{ marginTop: spacing.xl }}
          />

          <View style={styles.footer}>
            <Text style={styles.footerText}>Don't have an account?</Text>
            <AppButton
              title="Sign-Up"
              onPress={() => router.push("/(auth)/sign-up")}
              variant="ghost"
              size="sm"
              style={{ paddingHorizontal: spacing.xs }}
            />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const getStyles = (colors: ColorsType) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
      paddingHorizontal: spacing.xl,
      position: "relative",
    },
    content: {
      flexGrow: 1,
      paddingBottom: spacing.xxxl,
      justifyContent: "center",
    },
    backBtn: {
      position: "absolute",
      top: 16,
      left: 20,
      zIndex: 1,
    },
    logo: {
      width: 260,
      height: 260,
    },
    logoContainer: {
      alignItems: "center",
      justifyContent: "center",
      marginVertical: spacing.xl,
    },
    title: {
      fontSize: typography.title.fontSize,
      fontWeight: typography.title.fontWeight,
      marginTop: spacing.md,
      textAlign: "center",
      color: colors.text,
    },
    subtitle: {
      fontSize: typography.heading.fontSize,
      fontWeight: typography.heading.fontWeight,
      color: colors.text,
      textAlign: "center",
    },
    error: {
      fontSize: typography.caption.fontSize,
      color: colors.error,
      paddingHorizontal: spacing.xs,
    },
    footer: {
      marginTop: spacing.xl,
      flexDirection: "row",
      justifyContent: "center",
      alignItems: "center",
      gap: spacing.md,
    },
    footerText: {
      color: colors.textSecondary,
      fontSize: typography.body.fontSize,
      fontWeight: typography.body.fontWeight,
      textAlign: "center",
    },
  });

export default SignIn;
