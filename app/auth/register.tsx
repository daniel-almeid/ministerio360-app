import { useState } from "react";
import { useRouter } from "expo-router";
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import { supabase } from "../../src/lib/supabase";
import { notifySuccess } from "../../src/shared/ui/toast";

type PlanSlug = "free" | "standard" | "premium";

const PLANS: { slug: PlanSlug; name: string; price: string; description: string }[] = [
  { slug: "free", name: "Grátis", price: "R$ 0/mês", description: "Recursos básicos" },
  { slug: "standard", name: "Padrão", price: "R$ 49,90/mês", description: "Funcionalidades avançadas" },
  { slug: "premium", name: "Premium+", price: "R$ 89,90/mês", description: "Acesso completo" },
];

function validatePassword(pwd: string) {
  return {
    minLength: pwd.length >= 8,
    hasUpper: /[A-Z]/.test(pwd),
    hasLower: /[a-z]/.test(pwd),
    hasNumber: /[0-9]/.test(pwd),
    hasSpecial: /[^A-Za-z0-9]/.test(pwd),
  };
}

export default function RegisterScreen() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [plan, setPlan] = useState<PlanSlug>("free");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const pwdCheck = validatePassword(password);

  async function handleRegister() {
    setError("");

    if (!name.trim() || !email.trim() || !password) {
      setError("Preencha todos os campos obrigatórios.");
      return;
    }

    if (password !== confirmPassword) {
      setError("As senhas não coincidem.");
      return;
    }

    if (!Object.values(pwdCheck).every(Boolean)) {
      setError("A senha não atende aos requisitos de segurança.");
      return;
    }

    setLoading(true);

    const { error: signUpError } = await supabase.auth.signUp({
      email: email.trim(),
      password,
      options: {
        data: {
          church_name: name.trim(),
          plan_slug: plan,
        },
      },
    });

    setLoading(false);

    if (signUpError) {
      setError("Erro ao criar conta: " + signUpError.message);
      return;
    }

    notifySuccess("Conta criada! Verifique seu e-mail para confirmar o cadastro.");
    router.replace("/auth/login");
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      style={styles.container}
    >
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.card}>
          <Pressable onPress={() => router.replace("/auth/login")} style={styles.backRow}>
            <Feather name="arrow-left" size={16} color="#38B2AC" />
            <Text style={styles.backText}>Voltar ao login</Text>
          </Pressable>

          <View style={styles.header}>
            <Text style={styles.title}>
              Ministério<Text style={styles.highlight}>360</Text>
            </Text>
            <Text style={styles.subtitle}>Crie sua conta</Text>
          </View>

          <View style={styles.field}>
            <Text style={styles.label}>Nome da igreja</Text>
            <TextInput
              value={name}
              onChangeText={setName}
              placeholder="Exemplo: Igreja Vida Nova"
              placeholderTextColor="#9CA3AF"
              style={styles.input}
            />
          </View>

          <View style={styles.field}>
            <Text style={styles.label}>E-mail</Text>
            <TextInput
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              placeholder="seuemail@exemplo.com"
              placeholderTextColor="#9CA3AF"
              style={styles.input}
            />
          </View>

          <View style={styles.field}>
            <Text style={styles.label}>Senha</Text>
            <TextInput
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              placeholder="Crie uma senha forte"
              placeholderTextColor="#9CA3AF"
              style={styles.input}
            />
          </View>

          <View style={styles.field}>
            <Text style={styles.label}>Confirmar senha</Text>
            <TextInput
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              secureTextEntry
              placeholder="Repita sua senha"
              placeholderTextColor="#9CA3AF"
              style={styles.input}
            />
          </View>

          <View style={styles.rules}>
            <Text style={[styles.ruleText, pwdCheck.minLength && styles.ruleOk]}>• Mínimo de 8 caracteres</Text>
            <Text style={[styles.ruleText, pwdCheck.hasUpper && styles.ruleOk]}>• Pelo menos 1 letra maiúscula</Text>
            <Text style={[styles.ruleText, pwdCheck.hasLower && styles.ruleOk]}>• Pelo menos 1 letra minúscula</Text>
            <Text style={[styles.ruleText, pwdCheck.hasNumber && styles.ruleOk]}>• Pelo menos 1 número</Text>
            <Text style={[styles.ruleText, pwdCheck.hasSpecial && styles.ruleOk]}>• Pelo menos 1 caractere especial</Text>
          </View>

          <Text style={styles.label}>Plano</Text>
          <View style={styles.plans}>
            {PLANS.map((p) => {
              const selected = plan === p.slug;
              return (
                <Pressable
                  key={p.slug}
                  onPress={() => setPlan(p.slug)}
                  style={[styles.planCard, selected && styles.planCardSelected]}
                >
                  <Text style={styles.planName}>{p.name}</Text>
                  <Text style={styles.planDescription}>{p.description}</Text>
                  <Text style={styles.planPrice}>{p.price}</Text>
                </Pressable>
              );
            })}
          </View>

          {error ? <Text style={styles.errorText}>{error}</Text> : null}

          <Pressable disabled={loading} onPress={handleRegister} style={styles.primaryButton}>
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.primaryButtonText}>Criar conta</Text>
            )}
          </Pressable>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#E5E7EB" },
  scrollContent: { flexGrow: 1, justifyContent: "center", padding: 24 },
  card: { backgroundColor: "#FFFFFF", borderRadius: 16, padding: 24, gap: 16, elevation: 4 },
  backRow: { flexDirection: "row", alignItems: "center", gap: 6 },
  backText: { color: "#38B2AC", fontWeight: "600" },
  header: { alignItems: "center", marginBottom: 4 },
  title: { fontSize: 28, fontWeight: "800", color: "#1F2937" },
  highlight: { color: "#38B2AC" },
  subtitle: { marginTop: 6, color: "#6B7280" },
  field: {},
  label: { color: "#374151", marginBottom: 6, fontWeight: "600" },
  input: {
    borderWidth: 1,
    borderColor: "#D1D5DB",
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: "#fff",
  },
  rules: { gap: 2 },
  ruleText: { fontSize: 12, color: "#EF4444" },
  ruleOk: { color: "#15803D" },
  plans: { gap: 10 },
  planCard: { borderWidth: 1, borderColor: "#D1D5DB", borderRadius: 12, padding: 14 },
  planCardSelected: { borderColor: "#38B2AC", backgroundColor: "#F0FDFA" },
  planName: { fontSize: 15, fontWeight: "700", color: "#1F2937" },
  planDescription: { fontSize: 12, color: "#6B7280", marginTop: 2 },
  planPrice: { fontSize: 14, fontWeight: "700", color: "#1F2937", marginTop: 6 },
  errorText: { color: "#EF4444", textAlign: "center" },
  primaryButton: { backgroundColor: "#38B2AC", borderRadius: 12, paddingVertical: 16, alignItems: "center", marginTop: 4 },
  primaryButtonText: { color: "#FFFFFF", fontSize: 16, fontWeight: "600" },
});