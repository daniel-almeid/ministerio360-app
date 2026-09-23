import { useState } from "react";
import { useRouter } from "expo-router";
import {
    ActivityIndicator,
    KeyboardAvoidingView,
    Modal,
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
import { CardForm, CardFormValues } from "../../src/features/plans/components/cardForm";
import { tokenizeCard } from "../../src/features/plans/services/cardTokenService";

type PlanSlug = "free" | "standard" | "premium";

const PLANS: { slug: PlanSlug; name: string; price: string; description: string }[] = [
    { slug: "free", name: "Grátis", price: "R$ 0/mês", description: "Recursos básicos" },
    { slug: "standard", name: "Padrão", price: "R$ 49,90/mês", description: "Funcionalidades avançadas" },
    { slug: "premium", name: "Premium+", price: "R$ 89,90/mês", description: "Acesso completo" },
];

const PLAN_FEATURES: Record<PlanSlug, string[]> = {
    free: ["Dashboard", "Controle financeiro", "Cadastro de membros"],
    standard: [
        "Dashboard",
        "Cadastro de membros",
        "Cadastro de visitantes",
        "Cadastro financeiro",
        "Relatórios",
    ],
    premium: [
        "Dashboard",
        "Cadastro de membros",
        "Cadastro de visitantes",
        "Cadastro financeiro",
        "Cadastro de ministérios",
        "Cadastro de eventos",
        "Cadastro de escalas",
        "Relatórios",
        "Suporte prioritário",
    ],
};

function validatePassword(pwd: string) {
    return {
        minLength: pwd.length >= 8,
        hasUpper: /[A-Z]/.test(pwd),
        hasLower: /[a-z]/.test(pwd),
        hasNumber: /[0-9]/.test(pwd),
        hasSpecial: /[^A-Za-z0-9]/.test(pwd),
    };
}

const API_BASE_URL =
    process.env.EXPO_PUBLIC_API_BASE_URL || "https://ministerio360.vercel.app";

async function createSubscriptionForNewAccount(params: {
    planSlug: PlanSlug;
    cardToken: string;
    email: string;
    name: string;
    document: string;
    phone: { area_code: string; number: string };
    address: { line_1: string; zip_code: string; city: string; state: string };
}) {
    const res = await fetch(`${API_BASE_URL}/api/pagarme/create-subscription`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            plan_slug: params.planSlug,
            card_token: params.cardToken,
            email: params.email,
            name: params.name,
            document: params.document,
            phone: params.phone,
            address: params.address,
        }),
    });

    const json = await res.json();

    if (!res.ok || !json?.success) {
        throw new Error(json?.error || "Erro ao criar assinatura.");
    }

    return json;
}

// ===== Modal de benefícios do plano =====

function PlanDetailsModal({
    slug,
    onClose,
}: {
    slug: PlanSlug | null;
    onClose: () => void;
}) {
    if (!slug) return null;

    const plan = PLANS.find((p) => p.slug === slug)!;

    return (
        <Modal visible={!!slug} transparent animationType="fade" onRequestClose={onClose}>
            <View style={styles.detailsBackdrop}>
                <View style={styles.detailsCard}>
                    <Text style={styles.detailsTitle}>Benefícios do plano {plan.name}</Text>
                    <Text style={styles.detailsPrice}>{plan.price}</Text>

                    <View style={styles.detailsList}>
                        {PLAN_FEATURES[slug].map((f) => (
                            <View key={f} style={styles.detailsRow}>
                                <Feather name="check" size={16} color="#38B2AC" />
                                <Text style={styles.detailsText}>{f}</Text>
                            </View>
                        ))}
                    </View>

                    <Pressable onPress={onClose} style={styles.detailsCloseButton}>
                        <Text style={styles.detailsCloseText}>Fechar</Text>
                    </Pressable>
                </View>
            </View>
        </Modal>
    );
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
    const [detailsPlan, setDetailsPlan] = useState<PlanSlug | null>(null);

    const [accountCreated, setAccountCreated] = useState(false);
    const [showCardForm, setShowCardForm] = useState(false);
    const [paying, setPaying] = useState(false);
    const [paidSuccessfully, setPaidSuccessfully] = useState(false);

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

        setAccountCreated(true);
    }

    async function confirmarAssinatura(values: CardFormValues) {
        setPaying(true);
        setError("");

        try {
            const cardToken = await tokenizeCard({
                number: values.number,
                holderName: values.holderName,
                expMonth: values.expMonth,
                expYear: values.expYear,
                cvv: values.cvv,
            });

            const streetLine = `${values.street}, ${values.numberAddress}${
                values.complement ? " - " + values.complement : ""
            }`;

            await createSubscriptionForNewAccount({
                planSlug: plan,
                cardToken,
                email: email.trim(),
                name: name.trim(),
                document: values.document,
                phone: { area_code: values.areaCode, number: values.phoneNumber },
                address: {
                    line_1: streetLine,
                    zip_code: values.zipCode,
                    city: values.city,
                    state: values.state,
                },
            });

            setShowCardForm(false);
            setPaidSuccessfully(true);
        } catch (err: any) {
            setError(err.message || "Erro ao processar pagamento.");
        } finally {
            setPaying(false);
        }
    }

    const selectedPlan = PLANS.find((p) => p.slug === plan)!;
    const isPaidPlan = plan !== "free";

    // ===== Tela de sucesso pós-cadastro =====
    if (accountCreated) {
        return (
            <View style={styles.container}>
                <View style={styles.successCard}>
                    <Feather name="check-circle" size={44} color="#059669" />
                    <Text style={styles.successTitle}>Cadastro realizado com sucesso!</Text>
                    <Text style={styles.successText}>
                        Acesse seu e-mail e confirme sua conta antes de fazer login.
                    </Text>

                    {paidSuccessfully ? (
                        <Text style={[styles.successText, { color: "#059669", fontWeight: "700" }]}>
                            Assinatura confirmada! Assim que confirmar o e-mail e entrar, o plano{" "}
                            {selectedPlan.name} já estará ativo.
                        </Text>
                    ) : isPaidPlan ? (
                        <Text style={styles.successText}>
                            Depois de confirmar, finalize o pagamento abaixo para liberar o plano{" "}
                            {selectedPlan.name}.
                        </Text>
                    ) : null}

                    {error ? <Text style={styles.errorText}>{error}</Text> : null}

                    {isPaidPlan && !paidSuccessfully && (
                        <Pressable onPress={() => setShowCardForm(true)} style={styles.primaryButton}>
                            <Text style={styles.primaryButtonText}>Pagar plano</Text>
                        </Pressable>
                    )}

                    <Pressable
                        onPress={() => router.replace("/auth/login")}
                        style={styles.secondaryButton}
                        hitSlop={10}
                    >
                        <Text style={styles.secondaryButtonText}>Ir para o login</Text>
                    </Pressable>
                </View>

                <CardForm
                    visible={showCardForm}
                    planName={selectedPlan.name}
                    price={selectedPlan.price}
                    loading={paying}
                    onClose={() => setShowCardForm(false)}
                    onSubmit={confirmarAssinatura}
                />
            </View>
        );
    }

    // ===== Formulário de cadastro =====
    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : undefined}
            style={styles.container}
        >
            <ScrollView contentContainerStyle={styles.scrollContent}>
                <View style={styles.card}>
                    <Pressable
                        onPress={() => router.replace("/auth/login")}
                        style={styles.backRow}
                        hitSlop={12}
                    >
                        <Feather name="arrow-left" size={18} color="#38B2AC" />
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
                                <View
                                    key={p.slug}
                                    style={[styles.planCard, selected && styles.planCardSelected]}
                                >
                                    <Pressable onPress={() => setPlan(p.slug)}>
                                        <Text style={styles.planName}>{p.name}</Text>
                                        <Text style={styles.planDescription}>{p.description}</Text>
                                        <Text style={styles.planPrice}>{p.price}</Text>
                                    </Pressable>

                                    <View style={styles.planButtonsRow}>
                                        <Pressable
                                            onPress={() => setPlan(p.slug)}
                                            style={[
                                                styles.planSelectButton,
                                                selected && styles.planSelectButtonActive,
                                            ]}
                                        >
                                            <Text
                                                style={[
                                                    styles.planSelectText,
                                                    selected && styles.planSelectTextActive,
                                                ]}
                                            >
                                                {selected ? "Selecionado" : "Selecionar"}
                                            </Text>
                                        </Pressable>

                                        <Pressable
                                            onPress={() => setDetailsPlan(p.slug)}
                                            style={styles.planDetailsButton}
                                        >
                                            <Text style={styles.planDetailsText}>Ver benefícios</Text>
                                        </Pressable>
                                    </View>
                                </View>
                            );
                        })}
                    </View>

                    {error ? <Text style={styles.errorText}>{error}</Text> : null}

                    <Pressable
                        disabled={loading}
                        onPress={handleRegister}
                        style={({ pressed }) => [
                            styles.primaryButton,
                            pressed && styles.primaryButtonPressed,
                        ]}
                    >
                        {loading ? (
                            <ActivityIndicator color="#fff" />
                        ) : (
                            <>
                                <Feather name="user-plus" size={18} color="#fff" />
                                <Text style={styles.primaryButtonText}>Criar minha conta</Text>
                            </>
                        )}
                    </Pressable>
                </View>
            </ScrollView>

            <PlanDetailsModal slug={detailsPlan} onClose={() => setDetailsPlan(null)} />
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: "#E5E7EB" },
    scrollContent: { flexGrow: 1, justifyContent: "center", padding: 24 },
    card: { backgroundColor: "#FFFFFF", borderRadius: 16, padding: 24, gap: 16, elevation: 4 },
    successCard: {
        backgroundColor: "#FFFFFF",
        borderRadius: 16,
        padding: 28,
        margin: 24,
        gap: 14,
        alignItems: "center",
        elevation: 4,
    },
    backRow: {
        flexDirection: "row",
        alignItems: "center",
        gap: 8,
        alignSelf: "flex-start",
        paddingVertical: 8,
        paddingHorizontal: 10,
        marginLeft: -10,
        borderRadius: 10,
        backgroundColor: "#F0FDFA",
    },
    backText: { color: "#0F766E", fontWeight: "700", fontSize: 14 },
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
    plans: { gap: 12 },
    planCard: { borderWidth: 1, borderColor: "#D1D5DB", borderRadius: 12, padding: 14, gap: 10 },
    planCardSelected: { borderColor: "#38B2AC", backgroundColor: "#F0FDFA" },
    planName: { fontSize: 15, fontWeight: "700", color: "#1F2937" },
    planDescription: { fontSize: 12, color: "#6B7280", marginTop: 2 },
    planPrice: { fontSize: 14, fontWeight: "700", color: "#1F2937", marginTop: 6 },
    planButtonsRow: { flexDirection: "row", gap: 8 },
    planSelectButton: {
        flex: 1,
        paddingVertical: 9,
        borderRadius: 8,
        backgroundColor: "#E5E7EB",
        alignItems: "center",
    },
    planSelectButtonActive: { backgroundColor: "#38B2AC" },
    planSelectText: { fontSize: 12, fontWeight: "700", color: "#374151" },
    planSelectTextActive: { color: "#fff" },
    planDetailsButton: {
        flex: 1,
        paddingVertical: 9,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: "#9CA3AF",
        alignItems: "center",
    },
    planDetailsText: { fontSize: 12, fontWeight: "600", color: "#374151" },
    errorText: { color: "#EF4444", textAlign: "center" },
    primaryButton: {
        backgroundColor: "#0F766E",
        borderRadius: 14,
        paddingVertical: 18,
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "row",
        gap: 8,
        marginTop: 4,
        width: "100%",
        shadowColor: "#0F766E",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 6,
    },
    primaryButtonPressed: { backgroundColor: "#0D5C56" },
    primaryButtonText: { color: "#FFFFFF", fontSize: 17, fontWeight: "800" },
    secondaryButton: { paddingVertical: 12, alignItems: "center", width: "100%" },
    secondaryButtonText: { color: "#6B7280", fontWeight: "600" },
    successTitle: { fontSize: 18, fontWeight: "700", color: "#1F2937", textAlign: "center" },
    successText: { fontSize: 14, color: "#6B7280", textAlign: "center" },

    // Modal de benefícios
    detailsBackdrop: { flex: 1, backgroundColor: "rgba(0,0,0,0.5)", justifyContent: "center", padding: 24 },
    detailsCard: { backgroundColor: "#fff", borderRadius: 16, padding: 24, gap: 14 },
    detailsTitle: { fontSize: 18, fontWeight: "800", color: "#1F2937" },
    detailsPrice: { fontSize: 20, fontWeight: "800", color: "#0F766E" },
    detailsList: { gap: 10 },
    detailsRow: { flexDirection: "row", alignItems: "center", gap: 8 },
    detailsText: { fontSize: 14, color: "#374151" },
    detailsCloseButton: { backgroundColor: "#0F766E", borderRadius: 12, paddingVertical: 14, alignItems: "center", marginTop: 6 },
    detailsCloseText: { color: "#fff", fontWeight: "700", fontSize: 15 },
});