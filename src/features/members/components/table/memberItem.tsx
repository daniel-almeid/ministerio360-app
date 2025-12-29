import { View, Text, Pressable, StyleSheet } from "react-native";
import { Feather } from "@expo/vector-icons";
import type { Member } from "../../hooks/useMembersData";

type Props = {
    member: Member;
    onEdit: (member: Member) => void;
    onDelete: (member: Member) => void;
};

export function MemberItem({ member, onEdit, onDelete }: Props) {
    return (
        <View style={styles.card}>
            <View style={styles.row}>
                <Feather name="user" size={20} color="#38B2AC" />
                <Text style={styles.name}>{member.name}</Text>
            </View>

            <Text style={styles.text}>
                <Text style={styles.label}>Ministério: </Text>
                {member.ministry_name ?? (
                    <Text style={styles.muted}>Sem ministério</Text>
                )}
            </Text>

            <Text style={styles.text}>
                <Text style={styles.label}>Status: </Text>
                <Text style={member.is_active ? styles.active : styles.inactive}>
                    {member.is_active ? "Ativo" : "Inativo"}
                </Text>
            </Text>

            <View style={styles.contact}>
                {member.phone ? (
                    <View style={styles.row}>
                        <Feather name="phone" size={16} color="#38B2AC" />
                        <Text style={styles.text}>{member.phone}</Text>
                    </View>
                ) : (
                    <Text style={styles.muted}>Sem telefone</Text>
                )}

                <Text style={styles.email}>{member.email ?? "Sem e-mail"}</Text>
            </View>

            <View style={styles.row}>
                <Feather name="calendar" size={16} color="#38B2AC" />
                <Text style={styles.text}>
                    {member.birth_date
                        ? member.birth_date.split("-").reverse().join("/")
                        : "—"}
                </Text>
            </View>

            <View style={styles.actions}>
                <Pressable onPress={() => onEdit(member)}>
                    <Feather name="edit-2" size={22} color="#059669" />
                </Pressable>

                <Pressable onPress={() => onDelete(member)}>
                    <Feather name="trash-2" size={22} color="#DC2626" />
                </Pressable>
            </View>
        </View>
    );
}


const styles = StyleSheet.create({
    card: {
        backgroundColor: "#fff",
        borderRadius: 14,
        borderWidth: 1,
        borderColor: "#E5E7EB",
        padding: 16,
        marginBottom: 12,
    },
    row: {
        flexDirection: "row",
        alignItems: "center",
        gap: 8,
        marginBottom: 4,
    },
    name: {
        fontSize: 16,
        fontWeight: "600",
        color: "#111827",
        textTransform: "capitalize",
    },
    label: {
        fontWeight: "600",
        color: "#374151",
    },
    text: {
        fontSize: 15,
        color: "#374151",
        marginBottom: 2,
    },
    muted: {
        fontStyle: "italic",
        color: "#9CA3AF",
    },
    active: {
        color: "#15803D",
        fontWeight: "600",
    },
    inactive: {
        color: "#B91C1C",
        fontWeight: "600",
    },
    contact: {
        marginVertical: 4,
    },
    email: {
        fontSize: 12,
        color: "#6B7280",
        marginLeft: 24,
    },
    actions: {
        flexDirection: "row",
        justifyContent: "flex-end",
        gap: 24,
        marginTop: 12,
    },
});
