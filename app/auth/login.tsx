import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
    ActivityIndicator,
    KeyboardAvoidingView,
    Platform,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";
import { supabase } from "../../src/lib/supabase";

export default function LoginScreen() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Carregar e-mail salvo
  useEffect(() => {
    (async () => {
      const savedEmail = await AsyncStorage.getItem("rememberedEmail");
      if (savedEmail) {
        setEmail(savedEmail);
        setRemember(true);
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

      // Atualiza claims (igual ao web)
      await supabase.rpc("refresh_church_claim", {
        p_user_id: data.user.id,
      });

      if (remember) {
        await AsyncStorage.setItem("rememberedEmail", email);
      } else {
        await AsyncStorage.removeItem("rememberedEmail");
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

        <TouchableOpacity
          onPress={() => setRemember(!remember)}
          style={styles.rememberRow}
        >
          <View
            style={[
              styles.checkbox,
              remember && styles.checkboxChecked,
            ]}
          />
          <Text style={styles.rememberText}>Lembrar meus dados</Text>
        </TouchableOpacity>

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
  },
  checkbox: {
    width: 18,
    height: 18,
    borderWidth: 1,
    borderColor: "#9CA3AF",
    borderRadius: 4,
  },
  checkboxChecked: {
    backgroundColor: "#38B2AC",
    borderColor: "#38B2AC",
  },
  rememberText: {
    color: "#374151",
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
});
