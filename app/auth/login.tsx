import * as SecureStore from "expo-secure-store";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import { supabase } from "../../src/lib/supabase";

const CREDENTIALS_KEY = "remembered_credentials";

export default function LoginScreen() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Carrega credenciais salvas (criptografadas) ao abrir a tela
  useEffect(() => {
    (async () => {
      try {
        const saved = await SecureStore.getItemAsync(CREDENTIALS_KEY);
        if (saved) {
          const { email: savedEmail, password: savedPassword } = JSON.parse(saved);
          setEmail(savedEmail ?? "");
          setPassword(savedPassword ?? "");
          setRemember(true);
        }
      } catch {
        // Se der erro ao ler (ex: dado corrompido), apenas ignora e segue vazio
      }
    })();
  }, []);

  async function handleLogin() {
    setError("");
    setLoading(true);

    try {
      const { data, error: loginError } =
        await supabase.auth.signInWithPassword({
          email,
          password,
        });

      if (loginError) {
        setError(loginError.message);
        return;
      }

      if (!data?.session || !data?.user) {
        setError("Sessão não criada corretamente.");
        return;
      }

      await supabase.rpc("refresh_church_claim", {
        p_user_id: data.user.id,
      });

      if (remember) {
        await SecureStore.setItemAsync(
          CREDENTIALS_KEY,
          JSON.stringify({ email, password })
        );
      } else {
        await SecureStore.deleteItemAsync(CREDENTIALS_KEY);
      }

      router.replace("/tabs/dashboard");
    } catch (err) {
      console.error(err);
      setError("Erro inesperado ao entrar.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      style={styles.container}
    >
      <View style={styles.card}>
        <View style={styles.header}>
          <Text style={styles.title}>
            Ministério<Text style={styles.highlight}>360</Text>
          </Text>
          <Text style={styles.subtitle}>Acesse sua conta</Text>
        </View>

        <View>
          <Text style={styles.label}>E-mail</Text>
          <TextInput
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            style={styles.input}
          />
        </View>

        <View>
          <Text style={styles.label}>Senha</Text>
          <TextInput
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            style={styles.input}
          />
        </View>

        <Pressable
          onPress={() => setRemember(!remember)}
          style={styles.rememberRow}
          hitSlop={8}
        >
          <View style={[styles.checkbox, remember && styles.checkboxChecked]}>
            {remember && <Feather name="check" size={14} color="#fff" />}
          </View>
          <Text style={styles.rememberText}>Lembrar meus dados</Text>
        </Pressable>

        {error ? (
          <Text style={styles.errorText}>{error}</Text>
        ) : null}

        <TouchableOpacity
          disabled={loading}
          onPress={handleLogin}
          style={styles.primaryButton}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.primaryButtonText}>Entrar</Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => router.push("/auth/reset-password")}
          style={styles.forgotButton}
          hitSlop={10}
        >
          <Text style={styles.forgotText}>Esqueci minha senha</Text>
        </TouchableOpacity>

        <View style={styles.divider} />

        <TouchableOpacity
          onPress={() => router.push("/auth/register")}
          style={styles.createAccountButton}
          hitSlop={6}
        >
          <Feather name="user-plus" size={16} color="#0F766E" />
          <Text style={styles.createAccountText}>Não tem conta? Criar agora</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#E5E7EB",
    justifyContent: "center",
    paddingHorizontal: 24,
  },
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 24,
    gap: 16,
    elevation: 4,
  },
  header: {
    alignItems: "center",
    marginBottom: 8,
  },
  title: {
    fontSize: 32,
    fontWeight: "800",
    color: "#1F2937",
  },
  highlight: {
    color: "#38B2AC",
  },
  subtitle: {
    marginTop: 6,
    color: "#6B7280",
  },
  label: {
    color: "#374151",
    marginBottom: 6,
  },
  input: {
    borderWidth: 1,
    borderColor: "#D1D5DB",
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: "#fff",
  },
  rememberRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    alignSelf: "flex-start",
    paddingVertical: 4,
  },
  checkbox: {
    width: 22,
    height: 22,
    borderWidth: 1.5,
    borderColor: "#9CA3AF",
    borderRadius: 6,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#fff",
  },
  checkboxChecked: {
    backgroundColor: "#38B2AC",
    borderColor: "#38B2AC",
  },
  rememberText: {
    color: "#374151",
    fontSize: 14,
    fontWeight: "500",
  },
  errorText: {
    color: "#EF4444",
    textAlign: "center",
  },
  primaryButton: {
    backgroundColor: "#38B2AC",
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: "center",
    marginTop: 8,
  },
  primaryButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },
  forgotButton: {
    alignSelf: "center",
    paddingVertical: 8,
    paddingHorizontal: 10,
  },
  forgotText: {
    color: "#6B7280",
    fontWeight: "600",
    fontSize: 13,
  },
  divider: {
    height: 1,
    backgroundColor: "#E5E7EB",
  },
  createAccountButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    paddingVertical: 14,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: "#38B2AC",
    backgroundColor: "#F0FDFA",
  },
  createAccountText: {
    color: "#0F766E",
    fontWeight: "700",
    fontSize: 14,
  },
});