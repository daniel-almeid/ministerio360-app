import { useState } from "react";
import { Linking } from "react-native";
import type { Visitor } from "../types/visitors";
import { setVisitorFollowupStatus } from "../services/visitors";
import {
    notifySuccess,
    notifyError,
    notifyWarning,
    notifyLoading,
    dismissToast,
} from "../../../shared/ui/toast";

export function useFollowup() {
    const [processingId, setProcessingId] = useState<string | null>(null);

    async function handleFollowup(v: Visitor) {
        try {
            setProcessingId(v.id);
            notifyLoading("Iniciando acompanhamento...");

            await setVisitorFollowupStatus(v.id, "em_andamento");

            if (!v.phone) {
                dismissToast();
                notifyWarning(
                    "Este visitante não possui telefone cadastrado"
                );
                return { ...v, followup_status: "em_andamento" as const };
            }

            const phone = v.phone.replace(/\D/g, "");
            const visitDate = v.visit_date
                ? new Date(v.visit_date).toLocaleDateString("pt-BR")
                : "data não informada";

            const msg = `Olá ${v.name}!\nAqui é da nossa igreja. Ficamos muito felizes com sua visita no dia ${visitDate}.\nGostaríamos de manter contato e saber como foi sua experiência conosco.\nDeus abençoe você e sua família!`;

            const url = `https://wa.me/${phone}?text=${encodeURIComponent(
                msg
            )}`;

            await Linking.openURL(url);

            dismissToast();
            notifySuccess("Acompanhamento iniciado");

            return { ...v, followup_status: "em_andamento" as const };
        } catch {
            dismissToast();
            notifyError("Erro ao iniciar acompanhamento");
        } finally {
            setProcessingId(null);
        }
    }

    async function handleFinish(v: Visitor) {
        try {
            setProcessingId(v.id);
            notifyLoading("Finalizando acompanhamento...");

            await setVisitorFollowupStatus(v.id, "concluido");

            dismissToast();
            notifySuccess(`Follow-up de ${v.name} concluído`);

            return { ...v, followup_status: "concluido" as const };
        } catch {
            dismissToast();
            notifyError("Erro ao finalizar acompanhamento");
        } finally {
            setProcessingId(null);
        }
    }

    return { processingId, handleFollowup, handleFinish };
}
