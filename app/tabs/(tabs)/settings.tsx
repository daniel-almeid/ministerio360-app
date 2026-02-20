import { View, Text, StyleSheet, ScrollView } from "react-native";
import ConfigForm from "../../../src/features/settings/components/configForm";

export default function SettingsScreen() {
    return (
        <ScrollView contentContainerStyle={styles.container}>
            <View style={styles.wrapper}>
                <Text style={styles.title}>Configurações da Igreja</Text>
                <Text style={styles.subtitle}>
                    Gerencie as informações institucionais, de contato e endereço da igreja.
                </Text>

                <View style={styles.card}>
                    <Text style={styles.sectionTitle}>
                        Informações Gerais da Igreja
                    </Text>

                    <ConfigForm />
                </View>
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        padding: 16,
    },
    wrapper: {
        maxWidth: 900,
        alignSelf: "center",
        width: "100%",
    },
    title: {
        fontSize: 24,
        fontWeight: "700",
        textAlign: "center",
        marginBottom: 4,
    },
    subtitle: {
        fontSize: 14,
        color: "#6B7280",
        textAlign: "center",
        marginBottom: 20,
    },
    card: {
        backgroundColor: "#fff",
        borderRadius: 12,
        padding: 16,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: "600",
        marginBottom: 16,
    },
});
