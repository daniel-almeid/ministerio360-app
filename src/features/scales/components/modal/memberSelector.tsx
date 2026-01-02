import { View, Text, Pressable, StyleSheet } from "react-native";
import { MinistryLite, MemberLite } from "../../types/scales";

type Props = {
    ministries: MinistryLite[];
    members: MemberLite[];
    form: {
        ministriesSelected: string[];
        assignments: Record<string, string[]>;
    };
    toggleMember: (ministryId: string, memberId: string) => void;
};

export default function MemberSelector({
    ministries,
    members,
    form,
    toggleMember,
}: Props) {
    return (
        <>
            {form.ministriesSelected.map((ministryId) => {
                const ministry = ministries.find((m) => m.id === ministryId);
                const ministryMembers = members.filter(
                    (mem) => mem.ministry_id === ministryId
                );

                const selectedMembers = form.assignments[ministryId] || [];

                return (
                    <View key={ministryId} style={styles.block}>
                        <Text style={styles.title}>{ministry?.name}</Text>

                        <View style={styles.wrap}>
                            {ministryMembers.map((mem) => {
                                const selected = selectedMembers.includes(mem.id);

                                return (
                                    <Pressable
                                        key={mem.id}
                                        onPress={() =>
                                            toggleMember(ministryId, mem.id)
                                        }
                                        style={[
                                            styles.member,
                                            selected && styles.active,
                                        ]}
                                    >
                                        <Text
                                            style={[
                                                styles.memberText,
                                                selected && styles.activeText,
                                            ]}
                                        >
                                            {mem.name}
                                        </Text>
                                    </Pressable>
                                );
                            })}
                        </View>
                    </View>
                );
            })}
        </>
    );
}

const styles = StyleSheet.create({
    block: {
        borderTopWidth: 1,
        borderColor: "#E5E7EB",
        paddingTop: 12,
    },
    title: {
        fontWeight: "700",
        color: "#0d8d87ff",
        marginBottom: 6,
        fontSize: 13,
    },
    wrap: {
        flexDirection: "row",
        flexWrap: "wrap",
        gap: 8,
    },
    member: {
        paddingHorizontal: 10,
        paddingVertical: 6,
        borderRadius: 999,
        borderWidth: 1,
        borderColor: "#D1D5DB",
        backgroundColor: "#F9FAFB",
    },
    active: {
        backgroundColor: "#E6FFFA",
        borderColor: "#81E6D9",
    },
    memberText: {
        fontSize: 12,
        color: "#374151",
    },
    activeText: {
        fontWeight: "700",
        color: "#285E61",
    },
});
