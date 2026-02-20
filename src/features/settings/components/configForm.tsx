import { useState } from "react";
import {
    View,
    Text,
    StyleSheet,
    Pressable,
    Platform,
} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";

import { useChurchConfig } from "../hooks/useChurchConfig";
import InputField from "./inputField";
import SelectField from "./selectField";
import TextareaField from "./textAreaField";
import Loading from "../../../shared/ui/loading";

function formatBR(date: Date) {
    const d = String(date.getDate()).padStart(2, "0");
    const m = String(date.getMonth() + 1).padStart(2, "0");
    const y = date.getFullYear();
    return `${d}/${m}/${y}`;
}

function toISO(date: Date) {
    const d = String(date.getDate()).padStart(2, "0");
    const m = String(date.getMonth() + 1).padStart(2, "0");
    const y = date.getFullYear();
    return `${y}-${m}-${d}`;
}

export default function ConfigForm() {
    const { formData, handleChange, loading, saving, saveChurchData } =
        useChurchConfig();

    const [showDatePicker, setShowDatePicker] = useState(false);

    if (loading) {
        return <Loading visible />;
    }

    const selectedDate = formData.foundation_date
        ? new Date(formData.foundation_date)
        : new Date();

    function handleDateChange(_: any, date?: Date) {
        setShowDatePicker(false);

        if (!date) return;

        handleChange("foundation_date", toISO(date));
    }

    return (
        <View>
            <View style={styles.form}>
                <InputField
                    label="Razão Social"
                    name="corporate_name"
                    value={formData.corporate_name}
                    onChange={handleChange}
                />

                <InputField
                    label="Nome Fantasia"
                    name="trade_name"
                    value={formData.trade_name}
                    onChange={handleChange}
                />

                <InputField
                    label="CNPJ"
                    name="cnpj"
                    value={formData.cnpj}
                    onChange={handleChange}
                    placeholder="00.000.000/0000-00"
                />

                <View>
                    <Text style={styles.label}>Data de Fundação</Text>

                    <Pressable
                        onPress={() => setShowDatePicker(true)}
                        style={styles.dateInput}
                    >
                        <Text style={styles.dateValue}>
                            {formData.foundation_date
                                ? formatBR(selectedDate)
                                : "Selecionar data"}
                        </Text>
                    </Pressable>

                    {showDatePicker && (
                        <DateTimePicker
                            value={selectedDate}
                            mode="date"
                            maximumDate={new Date()}
                            display={
                                Platform.OS === "ios"
                                    ? "spinner"
                                    : "default"
                            }
                            onChange={handleDateChange}
                        />
                    )}
                </View>

                <SelectField
                    label="Situação Cadastral"
                    name="status"
                    value={formData.status}
                    options={["Ativa", "Inativa"]}
                    onChange={handleChange}
                />

                <InputField
                    label="Denominação / Cobertura Ministerial"
                    name="denomination"
                    value={formData.denomination}
                    onChange={handleChange}
                />

                <TextareaField
                    label="Propósito ou Lema Institucional"
                    name="purpose"
                    value={formData.purpose}
                    onChange={handleChange}
                />

                <TextareaField
                    label="Endereço Completo"
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                />

                <InputField
                    label="Telefone / WhatsApp"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                />

                <InputField
                    label="E-mail Institucional"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    keyboardType="email-address"
                />

                <InputField
                    label="Site Oficial"
                    name="website"
                    value={formData.website}
                    onChange={handleChange}
                />

                <InputField
                    label="Redes Sociais"
                    name="social_media"
                    value={formData.social_media}
                    onChange={handleChange}
                />
            </View>

            <View style={styles.footer}>
                <Pressable
                    onPress={saveChurchData}
                    disabled={saving}
                    style={[
                        styles.button,
                        saving && styles.buttonDisabled,
                    ]}
                >
                    <Text style={styles.buttonText}>
                        {saving ? "Salvando..." : "Salvar Alterações"}
                    </Text>
                </Pressable>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    form: {
        gap: 12,
    },
    label: {
        fontSize: 13,
        color: "#4B5563",
        marginBottom: 4,
    },
    dateInput: {
        borderWidth: 1,
        borderColor: "#D1D5DB",
        borderRadius: 8,
        paddingHorizontal: 12,
        paddingVertical: 12,
        justifyContent: "center",
    },
    dateValue: {
        fontSize: 14,
        color: "#111827",
    },
    footer: {
        marginTop: 20,
        alignItems: "flex-end",
    },
    button: {
        backgroundColor: "#0d8d87",
        paddingHorizontal: 20,
        paddingVertical: 12,
        borderRadius: 8,
    },
    buttonDisabled: {
        opacity: 0.7,
    },
    buttonText: {
        color: "#fff",
        fontWeight: "600",
    },
});
