import { useState } from "react";
import { ScrollView, View, Text, StyleSheet } from "react-native";
import * as WebBrowser from "expo-web-browser";
import { usePlan } from "@/src/features/plans/hook/usePlan";
import PlanCard from "../../../src/features/plans/components/planCard";
import PlanFooter from "../../../src/features/plans/components/planFooter";
import { createCheckoutOrder } from "../../../src/features/plans/services/subscriptionService";
import Loading from "../../../src/shared/ui/loading";
import { notifyError } from "../../../src/shared/ui/toast";
import { PLANS } from "../../../src/features/plans/constants";
import type { PlanSlug } from "../../../src/features/plans/types/plans";

export default function PlansScreen() {
    const { loading, currentPlan, active } = usePlan();
    const [processing, setProcessing] = useState(false);

    async function handleSubscribe(slug: PlanSlug) {
        if (processing) return;
        setProcessing(true);

        try {
            const checkoutUrl = await createCheckoutOrder(slug);
            await WebBrowser.openBrowserAsync(checkoutUrl);
        } catch (err: any) {
            notifyError(err.message || "Erro ao processar pagamento.");
        } finally {
            setProcessing(false);
        }
    }

    return (
        <View style={{ flex: 1 }}>
            <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 32 }}>
                <Text style={styles.title}>Escolha seu plano</Text>
                <Text style={styles.subtitle}>
                    Atualize seu plano para desbloquear mais funcionalidades no Ministério360.
                </Text>

                {PLANS.map((p) => (
                    <PlanCard
                        key={p.slug}
                        slug={p.slug}
                        name={p.name}
                        price={p.price}
                        features={p.features}
                        current={currentPlan}
                        active={active && currentPlan === p.slug}
                        processing={processing}
                        onSubscribe={() => handleSubscribe(p.slug)}
                    />
                ))}

                <PlanFooter />
            </ScrollView>

            <Loading visible={loading} />
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, padding: 16, backgroundColor: "#F9FAFB" },
    title: { fontSize: 22, fontWeight: "800", color: "#1F2937", textAlign: "center", marginBottom: 8 },
    subtitle: { fontSize: 14, color: "#6B7280", textAlign: "center", marginBottom: 20 },
});