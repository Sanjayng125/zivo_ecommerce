import TextField from "@/components/ui/TextField";
import { ColorsType } from "@/constants/colors";
import { useColors } from "@/hooks/useColors";
import { api, ApiError } from "@/lib/api";
import { SignUpSchema, SignUpSchemaType } from "@/lib/schemas";
import { setToken as setSecureStoreToken } from "@/lib/secureStore";
import { useAuthStore } from "@/store/authStore";
import { Ionicons } from "@expo/vector-icons";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { router } from "expo-router";
import { useMemo } from "react";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import {
  ActivityIndicator,
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Toast from "react-native-toast-message";

const SignUp = () => {
  const { setToken, setUser } = useAuthStore();
  const colors = useColors();

  const styles = useMemo(() => getStyles(colors), [colors]);

  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<SignUpSchemaType>({
    resolver: zodResolver(SignUpSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
  });

  const { mutate: signUpMutation, isPending: isSignUpPending } = useMutation({
    mutationFn: async ({ name, email, password }: SignUpSchemaType) => {
      const res = await api.post("/auth/sign-up/email", {
        name,
        email,
        password,
      });

      return res.data;
    },
    onSuccess: async (data) => {
      await setSecureStoreToken(data.token);
      setToken(data.token);
      setUser(data.user);

      router.replace("/(tabs)");
    },
    onError: (error: AxiosError<ApiError>) => {
      const message = error.response?.data?.message ?? "Something went wrong";
      Toast.show({
        type: "error",
        text1: "Error",
        text2: message,
      });
      return error;
    },
  });

  const onSubmit: SubmitHandler<SignUpSchemaType> = async (data) =>
    signUpMutation(data);

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <ScrollView
          contentContainerStyle={styles.content}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {router.canGoBack() && (
            <TouchableOpacity
              activeOpacity={0.8}
              style={styles.backBtn}
              onPress={() => router.back()}
            >
              <Ionicons
                name="arrow-back-sharp"
                size={28}
                color={colors.btnPrimaryText}
              />
            </TouchableOpacity>
          )}

          <View style={styles.logoContainer}>
            <Image
              source={require("@/assets/images/full_logo.png")}
              style={styles.logo}
            />
          </View>

          <Text style={[styles.title, { fontSize: 28 }]}>Welcome</Text>
          <Text style={styles.title}>Create your account to continue</Text>

          <View>
            <Controller
              control={control}
              name="name"
              render={({ field: { onChange, value } }) => (
                <TextField
                  placeholder="Full Name"
                  value={value}
                  onChangeText={onChange}
                  style={{ marginTop: 20 }}
                />
              )}
            />
            {errors.name && (
              <Text style={styles.error}>{errors.name.message}</Text>
            )}
          </View>

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
                  style={{ marginTop: 20 }}
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
                  style={{ marginTop: 20 }}
                />
              )}
            />
            {errors.password && (
              <Text style={styles.error}>{errors.password.message}</Text>
            )}
          </View>

          <TouchableOpacity
            onPress={handleSubmit(onSubmit)}
            disabled={isSignUpPending}
            style={[styles.signUpBtn, isSignUpPending && { opacity: 0.5 }]}
          >
            <Text style={styles.signUpBtnText}>Sign-Up</Text>
            {isSignUpPending && (
              <ActivityIndicator size="small" color={colors.btnPrimaryText} />
            )}
          </TouchableOpacity>

          <View style={styles.footer}>
            <Text style={styles.subtitle}>Already have an account?</Text>
            <TouchableOpacity
              activeOpacity={0.8}
              style={styles.signInBtn}
              onPress={() => router.push("/(auth)/sign-in")}
            >
              <Text style={styles.signInBtnText}>Sign-In</Text>
            </TouchableOpacity>
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
      paddingHorizontal: 20,
    },
    content: {
      flexGrow: 1,
      paddingBottom: 34,
      justifyContent: "center",
    },
    backBtn: {
      marginTop: 20,
      paddingHorizontal: 4,
    },
    logo: {
      width: 300,
      height: 300,
    },
    logoContainer: {
      alignItems: "center",
      justifyContent: "center",
      marginVertical: 20,
    },
    title: {
      fontSize: 24,
      fontWeight: "bold",
      marginTop: 10,
      textAlign: "center",
      color: colors.text,
    },
    subtitle: {
      fontSize: 16,
      fontWeight: "bold",
      color: colors.textSecondary,
    },
    error: {
      fontSize: 12,
      color: colors.error,
      paddingHorizontal: 4,
    },
    signUpBtn: {
      marginTop: 20,
      padding: 12,
      borderRadius: 10,
      backgroundColor: colors.primary,
      justifyContent: "center",
      alignItems: "center",
      flexDirection: "row",
      gap: 8,
      overflow: "hidden",
    },
    signUpBtnText: {
      color: colors.btnPrimaryText,
      fontSize: 18,
      fontWeight: "bold",
    },
    footer: {
      marginTop: 20,
      flexDirection: "row",
      justifyContent: "center",
      alignItems: "center",
      gap: 8,
    },
    signInBtn: {
      justifyContent: "center",
      alignItems: "center",
    },
    signInBtnText: {
      color: colors.primary,
      fontSize: 16,
      fontWeight: "bold",
      textAlign: "center",
    },
  });

export default SignUp;
