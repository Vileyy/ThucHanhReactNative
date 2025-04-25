import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  ActivityIndicator,
  StatusBar,
  Dimensions,
  SafeAreaView,
} from "react-native";
import { fetchContacts } from "../../utils/api";
import ContactThumbnail from "../../components/ContactThumbnail";
import colors from "../../utils/colors";

const { width } = Dimensions.get("window");
const COLUMN_COUNT = 2;
const THUMBNAIL_SIZE = 60;

const keyExtractor = ({ phone }) => phone;

const Favorites = ({ navigation }) => {
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    fetchContacts()
      .then((contacts) => {
        setContacts(contacts);
        setLoading(false);
        setError(false);
      })
      .catch((e) => {
        setLoading(false);
        setError(true);
      });
  }, []);

  const renderFavoriteThumbnail = ({ item, index }) => {
    const { avatar, name, phone } = item;
    
    // Format phone number for better readability
    const formattedPhone = phone.replace(/(\d{3})(\d{3})(\d{4})/, "$1-$2-$3");
    
    return (
      <View style={[
        styles.contactCard,
        index % 2 === 0 ? { marginRight: 8 } : { marginLeft: 8 }
      ]}>
        <View style={styles.contactContent}>
          <ContactThumbnail
            avatar={avatar}
            name={name}
            phone={phone}
            onPress={() => navigation.navigate("Profile", { contact: item })}
            size={THUMBNAIL_SIZE}
          />
          <View style={styles.contactInfo}>
            <Text style={styles.name} numberOfLines={1}>
              {name}
            </Text>
            <Text style={styles.phone} numberOfLines={1}>
              {formattedPhone}
            </Text>
          </View>
        </View>
      </View>
    );
  };

  const favorites = contacts.filter((contact) => contact.favorite);
  const emptyList = !loading && !error && favorites.length === 0;

  const renderHeader = () => {
    return (
      <View style={styles.header}>
        <Text style={styles.headerText}>Favorites</Text>
        <Text style={styles.subHeaderText}>{favorites.length} contacts</Text>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.background || "#fff"} />
      
      {loading && (
        <View style={styles.centerContent}>
          <ActivityIndicator size="large" color={colors.primary || "#007AFF"} />
          <Text style={styles.loadingText}>Loading your favorites...</Text>
        </View>
      )}
      
      {error && (
        <View style={styles.centerContent}>
          <View style={styles.errorIconContainer}>
            <Text style={styles.errorIcon}>!</Text>
          </View>
          <Text style={styles.errorText}>Unable to load contacts</Text>
          <Text style={styles.errorSubText}>Please check your connection and try again</Text>
        </View>
      )}
      
      {emptyList && (
        <View style={styles.centerContent}>
          <Text style={styles.emptyText}>No favorites yet</Text>
          <Text style={styles.emptySubText}>Mark contacts as favorites to see them here</Text>
        </View>
      )}
      
      {!loading && !error && favorites.length > 0 && (
        <FlatList
          data={favorites}
          keyExtractor={keyExtractor}
          numColumns={COLUMN_COUNT}
          contentContainerStyle={styles.list}
          renderItem={renderFavoriteThumbnail}
          ListHeaderComponent={renderHeader}
          showsVerticalScrollIndicator={false}
          columnWrapperStyle={styles.columnWrapper}
        />
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.background || "#f8f9fa",
    flex: 1,
  },
  list: {
    paddingHorizontal: 12,
  },
  columnWrapper: {
    justifyContent: "space-between",
    marginBottom: 16,
  },
  centerContent: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 30,
  },
  contactCard: {
    flex: 1,
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
    marginBottom: 0,
  },
  contactContent: {
    flexDirection: "column",
    alignItems: "center",
  },
  contactInfo: {
    marginTop: 8,
    width: "100%",
    alignItems: "center",
  },
  name: {
    fontSize: 14,
    fontWeight: "600",
    color: colors.textPrimary || "#212529",
    marginTop: 6,
    textAlign: "center",
  },
  phone: {
    fontSize: 12,
    color: colors.textSecondary || "#6c757d",
    marginTop: 2,
    textAlign: "center",
  },
  header: {
    paddingVertical: 20,
    paddingHorizontal: 4,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.border || "#E1E1E1",
    marginBottom: 16,
  },
  headerText: {
    fontSize: 26,
    fontWeight: "bold",
    color: colors.textPrimary || "#000",
  },
  subHeaderText: {
    fontSize: 15,
    color: colors.textSecondary || "#666",
    marginTop: 5,
  },
  errorIconContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "#fee5e5",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
  },
  errorIcon: {
    fontSize: 32,
    color: colors.error || "#FF3B30",
    fontWeight: "bold",
  },
  errorText: {
    color: colors.error || "#FF3B30",
    fontSize: 18,
    fontWeight: "500",
    marginTop: 5,
  },
  errorSubText: {
    color: colors.textSecondary || "#666",
    fontSize: 14,
    textAlign: "center",
    marginTop: 5,
  },
  loadingText: {
    marginTop: 10,
    color: colors.textSecondary || "#666",
    fontSize: 16,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: "500",
    color: colors.textPrimary || "#000",
  },
  emptySubText: {
    fontSize: 14,
    color: colors.textSecondary || "#666",
    textAlign: "center",
    marginTop: 5,
  },
});

export default Favorites;