import { useRef, useState } from "react";
import {
    Modal,
    View,
    Text,
    TextInput,
    Pressable,
    StyleSheet,
    ActivityIndicator,
    ScrollView,
    KeyboardAvoidingView,
    Platform,
} from "react-native";
import { Feather } from "@expo/vector-icons";

export type CardFormValues = {
    number: string;
    holderName: string;
    expMonth: string;
    expYear: string;
    cvv: string;
    document: string;
    areaCode: string;
    phoneNumber: string;
    zipCode: string;
    street: string;
    numberAddress: string;
    complement: string;
    neighborhood: string;
    city: string;
    state: string;
};

type Props = {
    visible: boolean;
    planName: string;
    price: string;
    loading: boolean;
    onClose: () => void;
    onSubmit: (values: CardFormValues) => void;
};

const EMPTY: CardFormValues = {
    number: "",
    holderName: "",
    expMonth: "",
    expYear: "",
    cvv: "",
    document: "",
    areaCode: "",
    phoneNumber: "",
    zipCode: "",
    street: "",
    numberAddress: "",
    complement: "",
    neighborhood: "",
    city: "",
    state: "",
};

function maskCardNumber(v: string) {
    return v
        .replace(/\D/g, "")
        .slice(0, 19)
        .replace(/(\d{4})(?=\d)/g, "$1 ")
        .trim();
}

function maskDocument(v: string) {
    const d = v.replace(/\D/g, "").slice(0, 14);
    if (d.length <= 11) {
        return d
            .replace(/(\d{3})(\d)/, "$1.$2")
            .replace(/(\d{3})(\d)/, "$1.$2")
            .replace(/(\d{3})(\d{1,2})$/, "$1-$2");
    }
    return d
        .replace(/(\d{2})(\d)/, "$1.$2")
        .replace(/(\d{3})(\d)/, "$1.$2")
        .replace(/(\d{3})(\d)/, "$1/$2")
        .replace(/(\d{4})(\d{1,2})$/, "$1-$2");
}

function maskCep(v: string) {
    return v.replace(/\D/g, "").slice(0, 8).replace(/(\d{5})(\d)/, "$1-$2");
}

function maskDigits(v: string, max: number) {
    return v.replace(/\D/g, "").slice(0, max);
}

export function CardForm({ visible, planName, price, loading, onClose, onSubmit }: Props) {
    const [values, setValues] = useState<CardFormValues>(EMPTY);
    const [error, setError] = useState("");
    const [cepLoading, setCepLoading] = useState(false);

    const refs = {
        holderName: useRef<TextInput>(null),
        expMonth: useRef<TextInput>(null),
        expYear: useRef<TextInput>(null),
        cvv: useRef<TextInput>(null),
        document: useRef<TextInput>(null),
        phoneNumber: useRef<TextInput>(null),
        numberAddress: useRef<TextInput>(null),
    };

    function set<K extends keyof CardFormValues>(key: K, value: string) {
        setValues((prev) => ({ ...prev, [key]: value }));
    }

    function handleCardNumberChange(raw: string) {
        const masked = maskCardNumber(raw);
        set("number", masked);
        if (masked.replace(/\s/g, "").length >= 16) refs.holderName.current?.focus();
    }

    function handleExpMonthChange(raw: string) {
        const v = maskDigits(raw, 2);
        set("expMonth", v);
        if (v.length === 2) refs.expYear.current?.focus();
    }

    function handleExpYearChange(raw: string) {
        const v = maskDigits(raw, 2);
        set("expYear", v);
        if (v.length === 2) refs.cvv.current?.focus();
    }

    function handleAreaCodeChange(raw: string) {
        const v = maskDigits(raw, 2);
        set("areaCode", v);
        if (v.length === 2) refs.phoneNumber.current?.focus();
    }

    async function handleCepChange(raw: string) {
        const masked = maskCep(raw);
        set("zipCode", masked);

        const digits = masked.replace(/\D/g, "");
        if (digits.length === 8) {
            setCepLoading(true);
            try {
                const res = await fetch(`https://viacep.com.br/ws/${digits}/json/`);
                const data = await res.json();

                if (!data.erro) {
                    setValues((prev) => ({
                        ...prev,
                        street: data.logradouro || prev.street,
                        neighborhood: data.bairro || prev.neighborhood,
                        city: data.localidade || prev.city,
                        state: data.uf || prev.state,
                    }));
                    refs.numberAddress.current?.focus();
                }
            } catch {
                // Silencioso — usuário preenche manualmente se a busca falhar
            } finally {
                setCepLoading(false);
            }
        }
    }

    function handleSubmit() {
        setError("");

        const required: (keyof CardFormValues)[] = [
            "number", "holderName", "expMonth", "expYear", "cvv",
            "document", "areaCode", "phoneNumber",
            "zipCode", "street", "numberAddress", "city", "state",
        ];

        for (const key of required) {
            if (!values[key]?.trim()) {
                setError("Preencha todos os campos obrigatórios.");
                return;
            }
        }

        onSubmit(values);
    }

    return (
        <Modal visible={visible} animationType="slide" onRequestClose={onClose}>
            <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : undefined} style={{ flex: 1 }}>
                <ScrollView contentContainerStyle={styles.container}>
                    <View style={styles.headerRow}>
                        <View>
                            <Text style={styles.title}>Assinar {planName}</Text>
                            <Text style={styles.price}>{price}</Text>
                        </View>
                        <Pressable onPress={onClose} style={styles.closeBtn}>
                            <Feather name="x" size={20} color="#6B7280" />
                        </Pressable>
                    </View>

                    <View style={styles.sectionHeader}>
                        <Feather name="credit-card" size={15} color="#38B2AC" />
                        <Text style={styles.sectionTitle}>Dados do cartão</Text>
                    </View>
                    <TextInput
                        placeholder="Número do cartão"
                        keyboardType="number-pad"
                        value={values.number}
                        onChangeText={handleCardNumberChange}
                        style={styles.input}
                    />
                    <TextInput
                        ref={refs.holderName}
                        placeholder="Nome impresso no cartão"
                        autoCapitalize="characters"
                        value={values.holderName}
                        onChangeText={(v) => set("holderName", v.toUpperCase())}
                        style={styles.input}
                    />
                    <View style={styles.row}>
                        <TextInput
                            placeholder="MM"
                            keyboardType="number-pad"
                            maxLength={2}
                            value={values.expMonth}
                            onChangeText={handleExpMonthChange}
                            style={[styles.input, styles.rowInput, styles.center]}
                        />
                        <TextInput
                            ref={refs.expYear}
                            placeholder="AA"
                            keyboardType="number-pad"
                            maxLength={2}
                            value={values.expYear}
                            onChangeText={handleExpYearChange}
                            style={[styles.input, styles.rowInput, styles.center]}
                        />
                        <TextInput
                            ref={refs.cvv}
                            placeholder="CVV"
                            keyboardType="number-pad"
                            maxLength={4}
                            value={values.cvv}
                            onChangeText={(v) => set("cvv", maskDigits(v, 4))}
                            style={[styles.input, styles.rowInput, styles.center]}
                        />
                    </View>

                    <View style={styles.sectionHeader}>
                        <Feather name="user" size={15} color="#38B2AC" />
                        <Text style={styles.sectionTitle}>Dados do titular</Text>
                    </View>
                    <TextInput
                        ref={refs.document}
                        placeholder="CPF ou CNPJ"
                        keyboardType="number-pad"
                        value={values.document}
                        onChangeText={(v) => set("document", maskDocument(v))}
                        style={styles.input}
                    />
                    <View style={styles.row}>
                        <TextInput
                            placeholder="DDD"
                            keyboardType="number-pad"
                            maxLength={2}
                            value={values.areaCode}
                            onChangeText={handleAreaCodeChange}
                            style={[styles.input, styles.rowInput, styles.center]}
                        />
                        <TextInput
                            ref={refs.phoneNumber}
                            placeholder="Telefone"
                            keyboardType="number-pad"
                            value={values.phoneNumber}
                            onChangeText={(v) => set("phoneNumber", maskDigits(v, 9))}
                            style={[styles.input, { flex: 2 }]}
                        />
                    </View>

                    <View style={styles.sectionHeader}>
                        <Feather name="map-pin" size={15} color="#38B2AC" />
                        <Text style={styles.sectionTitle}>Endereço de cobrança</Text>
                        {cepLoading && <ActivityIndicator size="small" color="#38B2AC" />}
                    </View>
                    <TextInput
                        placeholder="CEP"
                        keyboardType="number-pad"
                        value={values.zipCode}
                        onChangeText={handleCepChange}
                        style={styles.input}
                    />
                    <View style={styles.row}>
                        <TextInput
                            placeholder="Rua"
                            value={values.street}
                            onChangeText={(v) => set("street", v)}
                            style={[styles.input, { flex: 2 }]}
                        />
                        <TextInput
                            ref={refs.numberAddress}
                            placeholder="Número"
                            keyboardType="number-pad"
                            value={values.numberAddress}
                            onChangeText={(v) => set("numberAddress", v)}
                            style={[styles.input, styles.rowInput]}
                        />
                    </View>
                    <View style={styles.row}>
                        <TextInput
                            placeholder="Complemento (apto, bloco...)"
                            value={values.complement}
                            onChangeText={(v) => set("complement", v)}
                            style={[styles.input, { flex: 1 }]}
                        />
                        <TextInput
                            placeholder="Bairro"
                            value={values.neighborhood}
                            onChangeText={(v) => set("neighborhood", v)}
                            style={[styles.input, { flex: 1 }]}
                        />
                    </View>
                    <View style={styles.row}>
                        <TextInput
                            placeholder="Cidade"
                            value={values.city}
                            onChangeText={(v) => set("city", v)}
                            style={[styles.input, { flex: 3 }]}
                        />
                        <TextInput
                            placeholder="UF"
                            maxLength={2}
                            autoCapitalize="characters"
                            value={values.state}
                            onChangeText={(v) => set("state", v.toUpperCase())}
                            style={[styles.input, styles.rowInput, styles.center]}
                        />
                    </View>

                    {error ? <Text style={styles.error}>{error}</Text> : null}

                    <Pressable disabled={loading} onPress={handleSubmit} style={styles.button}>
                        {loading ? (
                            <ActivityIndicator color="#fff" />
                        ) : (
                            <Text style={styles.buttonText}>Confirmar assinatura</Text>
                        )}
                    </Pressable>

                    <Text style={styles.disclaimer}>
                        Seus dados de cartão são enviados diretamente e de forma criptografada ao
                        Pagar.me. O Ministério360 não armazena o número do seu cartão.
                    </Text>
                </ScrollView>
            </KeyboardAvoidingView>
        </Modal>
    );
}

const styles = StyleSheet.create({
    container: { padding: 20, paddingBottom: 40 },
    headerRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start" },
    closeBtn: { padding: 4 },
    title: { fontSize: 18, fontWeight: "800", color: "#1F2937" },
    price: { fontSize: 22, fontWeight: "800", color: "#0F766E", marginTop: 2 },
    sectionHeader: { flexDirection: "row", alignItems: "center", gap: 6, marginTop: 18, marginBottom: 8 },
    sectionTitle: { fontSize: 12, fontWeight: "700", color: "#6B7280", textTransform: "uppercase" },
    input: {
        borderWidth: 1,
        borderColor: "#D1D5DB",
        borderRadius: 10,
        paddingHorizontal: 14,
        paddingVertical: 12,
        marginBottom: 10,
        backgroundColor: "#fff",
    },
    row: { flexDirection: "row", gap: 10 },
    rowInput: { flex: 1 },
    center: { textAlign: "center" },
    error: { color: "#EF4444", marginBottom: 10, textAlign: "center" },
    button: { backgroundColor: "#38B2AC", borderRadius: 12, paddingVertical: 16, alignItems: "center", marginTop: 8 },
    buttonText: { color: "#fff", fontWeight: "700", fontSize: 15 },
    disclaimer: { fontSize: 11, color: "#9CA3AF", textAlign: "center", marginTop: 12 },
});