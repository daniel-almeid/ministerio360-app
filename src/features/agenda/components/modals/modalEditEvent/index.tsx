import { EventItem } from "../../../types/agenda";
import ModalNewEvent from "../modalNewEvent";

type Props = {
    open: boolean;
    event: EventItem | null;
    onClose: () => void;
    onSuccess: () => void;
};

export default function ModalEditEvent({
    open,
    event,
    onClose,
    onSuccess,
}: Props) {
    if (!open || !event) return null;

    return (
        <ModalNewEvent
            eventData={event}
            onClose={onClose}
            onSuccess={onSuccess}
        />
    );
}
