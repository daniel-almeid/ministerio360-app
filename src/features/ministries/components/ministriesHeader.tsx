import { View, TextInput, Pressable, Text, StyleSheet } from "react-native";
import { Feather } from "@expo/vector-icons";

type Props = {
    searchTerm: string;
    onChangeSearch: (v: string) => void;
    onNewPress: () => void;
};

export function MinistriesHeader({ searchTerm, onChangeSearch, onNewPress }: Props) {
    return (
        <View style={styles.container}>
            <View style={styles.searchWrap}>
                <Feather name="search" size={18} color="#9CA3AF" style={styles.searchIcon} />
                <TextInput
                    value={searchTerm}
                    onChangeText={onChangeSearch}
                    placeholder="Pesquisar ministério..."
                    placeholderTextColor="#9CA3AF"
                    style={styles.searchInput}
                />
            </View>

            <Pressable style={styles.newButton} onPress={onNewPress}>
                <Feather name="plus-circle" size={18} color="#FFFFFF" />
                <Text style={styles.newButtonText}>Novo Ministério</Text>
            </Pressable>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: "row",
        gap: 12,
        alignItems: "center",
        marginBottom: 12,
    },
    searchWrap: {
        flex: 1,
        backgroundColor: "#FFFFFF",
        borderRadius: 12,
        borderWidth: 1,
        borderColor: "#E5E7EB",
        paddingHorizontal: 12,
        height: 44,
        flexDirection: "row",
        alignItems: "center",
    },
    searchIcon: {
        marginRight: 8,
    },
    searchInput: {
        flex: 1,
        color: "#111827",
        fontSize: 14,
    },
    newButton: {
        height: 44,
        paddingHorizontal: 12,
        borderRadius: 12,
        backgroundColor: "#38B2AC",
        flexDirection: "row",
        alignItems: "center",
        gap: 8,
    },
    newButtonText: {
        color: "#FFFFFF",
        fontSize: 14,
        fontWeight: "600",
    },
});
