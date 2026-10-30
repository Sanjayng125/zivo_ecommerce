import ScreenWrapper from "@/components/layout/ScreenWrapper";
import { AppButton } from "@/components/ui/AppButton";
import TextField from "@/components/ui/TextField";
import { ColorsType } from "@/constants/colors";
import { spacing } from "@/constants/spacing";
import { typography } from "@/constants/typography";
import { useCart } from "@/hooks/useCart";
import { useColors } from "@/hooks/useColors";
import { useStyles } from "@/hooks/useStyles";
import { api, ApiError, authApi } from "@/lib/api";
import { SignInSchema, SignInSchemaType } from "@/lib/schemas";
import { setToken } from "@/lib/secureStore";
import { useAuthStore } from "@/store/authStore";
import { Ionicons } from "@expo/vector-icons";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { router } from "expo-router";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { Image, StyleSheet, Text, View } from "react-native";
import { toast } from "sonner-native";

const SignIn = () => {
  const { setToken: setStoreToken, setUser } = useAuthStore();
  const { items: guestItems, clearCart } = useCart();
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
      await setToken(data.token);

      if (guestItems.length > 0) {
        await Promise.allSettled(
          guestItems.map((item) =>
            authApi.post("/cart", {
              variant_id: item.variant_id,
              quantity: item.quantity,
            }),
          ),
        );

        clearCart();
      }

      setStoreToken(data.token);
      setUser(data.user);

      router.replace("/(tabs)");
    },
    onError: (error: AxiosError<ApiError>) => {
      const message = error.response?.data?.message ?? "Something went wrong";

      toast.error(message);
    },
  });

  const onSubmit: SubmitHandler<SignInSchemaType> = async (data) =>
    signInMutation(data);

  return (
    <ScreenWrapper edges={["top"]} keyboardAvoiding>
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
      <View style={styles.container}>
        <Text style={styles.title}>Welcome Back</Text>

        <View style={styles.logoContainer}>
          <Image
            source={require("@/assets/images/full_logo.png")}
            style={styles.logo}
          />
        </View>

        <Text style={styles.subtitle}>Sign-In to your account</Text>

        <View style={styles.inputsContainer}>
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
                />
              )}
            />
            {errors.password && (
              <Text style={styles.error}>{errors.password.message}</Text>
            )}
          </View>
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
      </View>
    </ScreenWrapper>
  );
};

const getStyles = (colors: ColorsType) =>
  StyleSheet.create({
    container: {
      flexGrow: 1,
      paddingBottom: spacing.xxxl,
      paddingHorizontal: spacing.xl,
      justifyContent: "center",
    },
    backBtn: {
      position: "absolute",
      top: 10,
      left: 5,
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
    inputsContainer: {
      marginTop: spacing.lg,
      gap: spacing.lg,
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
