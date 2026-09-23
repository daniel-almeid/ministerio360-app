import { useState } from "react";
import { ScrollView, View, Text, Pressable, StyleSheet } from "react-native";
import { usePlan } from "@/src/features/plans/hook/usePlan";
import { useSubscription } from "../../../src/features/plans/hook/useSubscription";
import PlanCard from "../../../src/features/plans/components/planCard";
import { CurrentPlanCard } from "../../../src/features/plans/components/currentPlanCard";
import { BillingCycle } from "../../../src/features/plans/components/billingCycle";
import { CancelSubscriptionModal } from "../../../src/features/plans/components/cancelSubscriptionModal";
import { CardForm, CardFormValues } from "../../../src/features/plans/components/cardForm";
import { tokenizeCard } from "../../../src/features/plans/services/cardTokenService";
import { createSubscription } from "../../../src/features/plans/services/subscriptionService";
import { supabase } from "../../../src/lib/supabase";
import Loading from "../../../src/shared/ui/loading";
import { notifyError, notifySuccess } from "../../../src/shared/ui/toast";
import { PLANS } from "../../../src/features/plans/constants";
import type { PlanSlug } from "../../../src/features/plans/types/plans";

export default function PlansScreen() {
    const { loading: loadingPlan, currentPlan: selectedPlanForCards, active } = usePlan();
    const {
        loading: loadingSubscription,
        planSlug,
        currentPlan,
        price,
        formattedExpiresOn,
        formattedLastPayment,
        formattedNextPayment,
        progressPercent,
        hasPaidPlan,
        reload,
    } = useSubscription();

    const [processing, setProcessing] = useState(false);
    const [showCancelModal, setShowCancelModal] = useState(false);
    const [cardFormPlan, setCardFormPlan] = useState<PlanSlug | null>(null);

    async function handleConfirmCard(planSlug: PlanSlug, values: CardFormValues) {
        setProcessing(true);

        try {
            const cardToken = await tokenizeCard({
                number: values.number,
                holderName: values.holderName,
                expMonth: values.expMonth,
                expYear: values.expYear,
                cvv: values.cvv,
            });

            const streetLine = `${values.street}, ${values.numberAddress}${values.complement ? " - " + values.complement : ""
                }`;

            await createSubscription({
                planSlug,
                cardToken,
                document: values.document,
                phone: { area_code: values.areaCode, number: values.phoneNumber },
                address: {
                    line_1: streetLine,
                    zip_code: values.zipCode,
                    city: values.city,
                    state: values.state,
                },
            });

            await supabase.auth.refreshSession();
            await reload();

            notifySuccess("Assinatura ativada com sucesso!");
            setCardFormPlan(null);
        } catch (err: any) {
            notifyError(err.message || "Erro ao processar pagamento.");
        } finally {
            setProcessing(false);
        }
    }

    const loading = loadingPlan || loadingSubscription;
    const openPlan = PLANS.find((p) => p.slug === cardFormPlan);

    return (
        <View style={{ flex: 1 }}>
            <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 32 }}>
                <View style={styles.statusCard}>
                    <CurrentPlanCard currentPlan={currentPlan} price={price} formattedExpiresOn={formattedExpiresOn} />

                    <BillingCycle
                        hasPaidPlan={hasPaidPlan}
                        formattedLastPayment={formattedLastPayment}
                        formattedNextPayment={formattedNextPayment}
                        progressPercent={progressPercent}
                    />

                    <View style={styles.footer}>
                        {!hasPaidPlan ? (
                            <Text style={styles.footerText}>
                                Faça um upgrade no seu plano para aproveitar mais funcionalidades do Ministério360.
                            </Text>
                        ) : (
                            <Pressable onPress={() => setShowCancelModal(true)} style={styles.cancelButton}>
                                <Text style={styles.cancelButtonText}>Cancelar assinatura</Text>
                            </Pressable>
                        )}
                    </View>
                </View>

                <Text style={styles.title}>Planos disponíveis</Text>
                <Text style={styles.subtitle}>Compare os planos e escolha o que melhor atende sua igreja.</Text>

                {PLANS.map((p) => (
                    <PlanCard
                        key={p.slug}
                        slug={p.slug}
                        name={p.name}
                        price={p.price}
                        features={p.features}
                        current={planSlug}
                        active={hasPaidPlan ? planSlug === p.slug : selectedPlanForCards === p.slug && active}
                        processing={processing}
                        onSubscribe={() => setCardFormPlan(p.slug)}
                    />
                ))}
            </ScrollView>

            {openPlan && (
                <CardForm
                    visible={!!cardFormPlan}
                    planName={openPlan.name}
                    price={openPlan.price}
                    loading={processing}
                    onClose={() => setCardFormPlan(null)}
                    onSubmit={(values) => handleConfirmCard(openPlan.slug, values)}
                />
            )}

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
    statusCard: { backgroundColor: "#fff", borderRadius: 16, borderWidth: 1, borderColor: "#E5E7EB", padding: 20, marginBottom: 24 },
    footer: { marginTop: 16, paddingTop: 16, borderTopWidth: 1, borderTopColor: "#E5E7EB" },
    footerText: { fontSize: 13, color: "#6B7280", textAlign: "center" },
    cancelButton: { backgroundColor: "#DC2626", borderRadius: 10, paddingVertical: 12, alignItems: "center", alignSelf: "flex-end", paddingHorizontal: 20 },
    cancelButtonText: { color: "#fff", fontWeight: "700", fontSize: 13 },
    title: { fontSize: 20, fontWeight: "800", color: "#1F2937", marginBottom: 4 },
    subtitle: { fontSize: 13, color: "#6B7280", marginBottom: 16 },
});