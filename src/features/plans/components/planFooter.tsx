import { View, Pressable, Text, StyleSheet } from "react-native";
import * as WebBrowser from "expo-web-browser";

const MANAGE_SUBSCRIPTION_URL = "https://ministerio360.vercel.app/planos/assinatura";

export default function PlanFooter() {
    return (
        <View style={styles.container}>
            <Pressable
                onPress={() => WebBrowser.openBrowserAsync(MANAGE_SUBSCRIPTION_URL)}
                style={styles.button}
            >
                <Text style={styles.text}>Gerenciar assinatura</Text>
            </Pressable>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { marginTop: 30, alignItems: "center" },
    button: { backgroundColor: "#0d9488", paddingVertical: 12, paddingHorizontal: 30, borderRadius: 12 },
    text: { color: "#fff", fontWeight: "600" },
});