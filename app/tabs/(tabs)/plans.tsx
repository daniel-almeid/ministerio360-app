import { useState } from "react";
import { ScrollView, View, Text, Pressable, StyleSheet, Linking } from "react-native";
import * as WebBrowser from "expo-web-browser";
import { usePlan } from "@/src/features/plans/hook/usePlan";
import { useSubscription } from "../../../src/features/plans/hook/useSubscription";
import PlanCard from "../../../src/features/plans/components/planCard";
import { CurrentPlanCard } from "../../../src/features/plans/components/currentPlanCard";
import { BillingCycle } from "../../../src/features/plans/components/billingCycle";
import { CancelSubscriptionModal } from "../../../src/features/plans/components/cancelSubscriptionModal";
import Loading from "../../../src/shared/ui/loading";
import { PLANS } from "../../../src/features/plans/constants";
import type { PlanSlug } from "../../../src/features/plans/types/plans";

// A troca/assinatura de plano acontece no site, nunca dentro do app —
// isso evita a exigência do Google Play Billing para compras feitas
// de fato dentro do aplicativo Android.
const WEB_PLANS_URL = "https://ministerio360.vercel.app/planos";

export default function PlansScreen() {
    const { currentPlan: selectedPlanForCards, active } = usePlan();
    const {
        loading,
        planSlug,
        currentPlan,
        price,
        formattedExpiresOn,
        formattedLastPayment,
        formattedNextPayment,
        progressPercent,
        hasPaidPlan,
    } = useSubscription();

    const [showCancelModal, setShowCancelModal] = useState(false);

    async function handleManagePlan() {
        await WebBrowser.openBrowserAsync(WEB_PLANS_URL);
    }

    return (
        <View style={{ flex: 1 }}>
            <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 32 }}>
                <View style={styles.statusCard}>
                    <CurrentPlanCard
                        currentPlan={currentPlan}
                        price={price}
                        formattedExpiresOn={formattedExpiresOn}
                    />

                    <BillingCycle
                        hasPaidPlan={hasPaidPlan}
                        formattedLastPayment={formattedLastPayment}
                        formattedNextPayment={formattedNextPayment}
                        progressPercent={progressPercent}
                    />

                    <View style={styles.footer}>
                        {hasPaidPlan && (
                            <Pressable onPress={() => setShowCancelModal(true)} style={styles.cancelButton}>
                                <Text style={styles.cancelButtonText}>Cancelar assinatura</Text>
                            </Pressable>
                        )}
                    </View>
                </View>

                <Text style={styles.title}>Planos disponíveis</Text>
                <Text style={styles.subtitle}>
                    Compare os planos e assine pelo site — abre no seu navegador.
                </Text>

                {PLANS.map((p) => (
                    <PlanCard
                        key={p.slug}
                        slug={p.slug}
                        name={p.name}
                        price={p.price}
                        features={p.features}
                        current={planSlug}
                        active={hasPaidPlan ? planSlug === p.slug : selectedPlanForCards === p.slug && active}
                        processing={false}
                        onSubscribe={handleManagePlan}
                    />
                ))}

                <Pressable onPress={handleManagePlan} style={styles.webButton}>
                    <Text style={styles.webButtonText}>Gerenciar assinatura no site</Text>
                </Pressable>
            </ScrollView>

            <CancelSubscriptionModal
                visible={showCancelModal}
                formattedExpiresOn={formattedExpiresOn}
                onClose={() => setShowCancelModal(false)}
            />

            <Loading visible={loading} />
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, padding: 16, backgroundColor: "#F9FAFB" },
    statusCard: {
        backgroundColor: "#fff",
        borderRadius: 16,
        borderWidth: 1,
        borderColor: "#E5E7EB",
        padding: 20,
        marginBottom: 24,
    },
    footer: { marginTop: 16, paddingTop: 16, borderTopWidth: 1, borderTopColor: "#E5E7EB" },
    cancelButton: {
        backgroundColor: "#DC2626",
        borderRadius: 10,
        paddingVertical: 12,
        alignItems: "center",
        alignSelf: "flex-end",
        paddingHorizontal: 20,
    },
    cancelButtonText: { color: "#fff", fontWeight: "700", fontSize: 13 },
    title: { fontSize: 20, fontWeight: "800", color: "#1F2937", marginBottom: 4 },
    subtitle: { fontSize: 13, color: "#6B7280", marginBottom: 16 },
    webButton: {
        marginTop: 8,
        backgroundColor: "#0F766E",
        borderRadius: 12,
        paddingVertical: 14,
        alignItems: "center",
    },
    webButtonText: { color: "#fff", fontWeight: "700", fontSize: 14 },
});