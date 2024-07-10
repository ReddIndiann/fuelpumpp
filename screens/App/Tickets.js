import React, { useState, useCallback, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  TouchableOpacity,
  Image,
  ImageBackground,
  ActivityIndicator,
  TextInput,
  Alert,
} from "react-native";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { FontAwesome } from "@expo/vector-icons";
import DateTimePicker from "@react-native-community/datetimepicker";

import moment from "moment";
import axios from "axios";
import { Chip, FAB } from "react-native-paper";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { IndexPath, Layout, Select, SelectItem } from "@ui-kitten/components";

const statusOptions = ["paid", "unpaid", "close", "open"];

export default function Tickets() {
  const [tickets, setTickets] = useState([]);
  console.log("🚀 ~ Tickets ~ tickets:", tickets);
  const navigation = useNavigation();
  const [loading, setLoading] = useState(true);
  const [ticketHistory, setTicketHistory] = useState([]);
  console.log("🚀 ~ Tickets ~ ticketHistory:", ticketHistory);
  const [isFromDatePickerVisible, setFromDatePickerVisibility] =
    useState(false);
  const [isToDatePickerVisible, setToDatePickerVisibility] = useState(false);
  // const [selectedStatus, setSelectedStatus] = useState(new IndexPath(0));
  const [selectedStatus, setSelectedStatus] = useState(statusOptions[0]);
  console.log("🚀 ~ Tickets ~ selectedStatus:", selectedStatus);

  const [search, setSearch] = useState("");

  const [fromDate, setFromDate] = useState(
    moment().subtract(7, "days").toDate()
  );
  const [toDate, setToDate] = useState(new Date());

  // const formattedToDate = moment().format("YYYY-MM-DD");
  // const formattedFromDate = moment().subtract(7, "days").format("YYYY-MM-DD");
  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const userInfoString = await AsyncStorage.getItem("userInfo");
        if (userInfoString) {
          const userInfoObject = JSON.parse(userInfoString);
          console.log("🚀 ~ HomeScreendhdhd ~ userInfo:", userInfoObject);
          await fetchTicketHistory(
            userInfoObject.id,
            fromDate,
            toDate,
            search,
            statusOptions[selectedStatus.row]
          );
        }
      } catch (error) {
        console.error("Error fetching user info from AsyncStorage:", error);
      }
    };

    fetchUserInfo();
  }, []);
  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const userInfoString = await AsyncStorage.getItem("userInfo");
        if (userInfoString) {
          const userInfoObject = JSON.parse(userInfoString);
          await fetchTicketHistory(
            userInfoObject.id,
            fromDate,
            toDate,
            search,
            selectedStatus
          );
        }
      } catch (error) {
        console.error("Error fetching user info from AsyncStorage:", error);
      }
    };

    fetchUserInfo();
  }, [fromDate, toDate, search, selectedStatus]);

  const fetchTicketHistory = async (
    agent_id,
    startDate,
    endDate,
    searchTerm,
    status
  ) => {
    setLoading(true);
    try {
      const formattedStartDate = moment(startDate).format("YYYY-MM-DD");
      const formattedEndDate = moment(endDate).format("YYYY-MM-DD");
      const response = await axios.post(
        "https://shaboshabo.wigal.com.gh/api/servicehistory",
        {
          start_date: formattedStartDate,
          end_date: formattedEndDate,
          agent_id: agent_id,
          status: status,
        }
      );

      console.log("PAYLOAD", {
        start_date: formattedStartDate,
        end_date: formattedEndDate,
        agent_id: agent_id,
        status: status,
      });
      const tickets = response?.data?.data || [];
      const filteredTickets = tickets.filter((ticket) => {
        const ticketDate = moment(ticket.service_date);
        const isWithinDateRange = ticketDate.isBetween(
          moment(startDate),
          moment(endDate),
          undefined,
          "[]"
        );
        const matchesSearch = searchTerm
          ? ticket.ticket_number.toString().includes(searchTerm)
          : true;
        return isWithinDateRange && matchesSearch;
      });
      const sortedTickets = filteredTickets
        .sort((a, b) => moment(b.service_date).diff(moment(a.service_date)))
        .slice(0, 10);

      // setTicketHistory(filteredTickets);
      setTickets(sortedTickets);
      setTicketHistory(sortedTickets);
    } catch (error) {
      console.error("Error fetching ticket history:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleFromDateChange = (event, date) => {
    setFromDatePickerVisibility(false);
    if (date) {
      const newFromDate = moment(date);
      const newToDate = moment(toDate);
      if (newToDate.diff(newFromDate, "days") > 7) {
        Alert.alert(
          "Invalid Date Range",
          "The date range cannot exceed 7 days."
        );
      } else {
        setFromDate(date);
      }
    }
  };

  const handleToDateChange = (event, date) => {
    setToDatePickerVisibility(false);
    if (date) {
      const newFromDate = moment(fromDate);
      const newToDate = moment(date);
      if (newToDate.diff(newFromDate, "days") > 7) {
        Alert.alert(
          "Invalid Date Range",
          "The date range cannot exceed 7 days."
        );
      } else {
        setToDate(date);
      }
    }
  };

  // useFocusEffect(
  //   useCallback(() => {
  //     // fetchTicketHistory(fromDate, toDate);
  //   }, [])
  // );

  const handleTicketPress = (ticket) => {
    navigation.navigate("TicketDetail", { ticket });
  };

  const formatDate = (dateString) => {
    return moment(dateString).format("ddd, MMM YYYY.");
  };

  const renderTicketItem = ({ item }) => (
    <TouchableOpacity onPress={() => handleTicketPress(item)}>
      <View style={styles.classItem}>
        <View style={styles.timelineContainer}>
          <View style={styles.timelineDot} />
          <View style={styles.timelineLine} />
        </View>

        <View style={styles.classContent}>
          <View style={styles.classHours}>
            {/* <Text style={styles.startTime}>{item.startTime}</Text>
          <Text style={styles.endTime}>{item.endTime}</Text> */}
            <Text style={styles.startTime}>{item.start_time}</Text>
            <Text style={styles.endTime}>
              {item.end_time ? "Done" : "Ongoing"}
              {/* {item.end_time ? item.end_time : "Ongoing"} */}
            </Text>
          </View>

          <View style={[styles.card, { backgroundColor: "#E0FFFF" }]}>
            <Text style={styles.cardTitle}>{`# ${item.ticket_number}`}</Text>
            <Text
              style={styles.cardDate}
            >{`Car Number: ${item.car_number}`}</Text>
            <Text style={styles.cardDate}>{formatDate(item.service_date)}</Text>
            <Text style={styles.cardDate}>{`Price: ${item.price || 0}`}</Text>
            <Text style={styles.cardDate}>
              {item.payment_status === "Paid" ? (
                <Chip
                  icon='check'
                  style={{ backgroundColor: "#B6F074" }}
                >{`Payment: ${item.payment_status}`}</Chip>
              ) : (
                <Chip icon='close'>{`Payment: ${item.payment_status}`}</Chip>
              )}
            </Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );

  const renderHeader = () => (
    // <View style={styles.card}>
    <ImageBackground
      style={[styles.headerImage, styles.card]}
      source={require("../assets/banner.png")}
    />
    // </View>
  );

  return (
    <View style={styles.container}>
      {loading ? (
        <ActivityIndicator
          size='large'
          color='#0000ff'
          style={{ flex: 1, alignItems: "center", justifyContent: "center" }}
        />
      ) : tickets?.length > 0 ? (
        <>
          <View style={{ padding: 10 }}>
            <TextInput
              placeholder='Search Ticket ID'
              value={search}
              onChangeText={setSearch}
              style={styles.input}
            />
            <View style={styles.dateContainer}>
              <TouchableOpacity
                onPress={() => setFromDatePickerVisibility(true)}
                style={styles.datePicker}
              >
                <Text>From: {moment(fromDate).format("YYYY-MM-DD")}</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => setToDatePickerVisibility(true)}
                style={styles.datePicker}
              >
                <Text>To: {moment(toDate).format("YYYY-MM-DD")}</Text>
              </TouchableOpacity>
            </View>
            <View style={[styles.inputGroup, { gap: 10 }]}>
              <Text>Status Type</Text>
              <Layout
                style={{ flex: 1, height: 0, backgroundColor: "none" }}
                level='1'
              >
                <Select
                  style={{
                    flex: 1,
                    margin: 2,
                    backgroundColor: "transparent",
                  }}
                  selectedIndex={
                    new IndexPath(statusOptions.indexOf(selectedStatus))
                  }
                  onSelect={(index) =>
                    setSelectedStatus(statusOptions[index.row])
                  }
                  value={selectedStatus.toLocaleUpperCase()}
                  size='large'
                >
                  {statusOptions.map((status, index) => (
                    <SelectItem
                      style={{ backgroundColor: "none" }}
                      key={index}
                      title={status.toUpperCase()}
                    />
                  ))}
                </Select>
              </Layout>
            </View>
          </View>
          <FlatList
            contentContainerStyle={{ paddingHorizontal: 16 }}
            data={ticketHistory}
            // data={ticketHistory.slice(0, 10).reverse()}
            ListHeaderComponent={renderHeader}
            renderItem={renderTicketItem}
            keyExtractor={(item) => item.id.toString()}
          />
          {isFromDatePickerVisible && (
            <DateTimePicker
              value={fromDate}
              mode='date'
              display='default'
              onChange={handleFromDateChange}
            />
          )}
          {isToDatePickerVisible && (
            <DateTimePicker
              value={toDate}
              mode='date'
              display='default'
              onChange={handleToDateChange}
            />
          )}
        </>
      ) : (
        <Text style={styles.noTicketsText}>No tickets saved</Text>
      )}
      <FAB
        icon='plus'
        style={styles.fab}
        onPress={() => navigation.navigate("NewTicket")}
        background='#2328a0'
      />
    </View>
  );
}
const styles = StyleSheet.create({
  inputGroup: {
    display: "flex",
    flexDirection: "column",
    height: "13%",
    justifyContent: "space-between",
    width: "100%",
    alignSelf: "center",
    marginBottom: "5%",
  },
  fab: {
    position: "absolute",
    margin: 16,
    right: 0,
    bottom: 0,
  },
  container: {
    flex: 1,
    paddingVertical: 10,
  },
  dateContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  datePicker: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    borderRadius: 5,
    flex: 1,
    marginRight: 5,
    alignItems: "center",
    color: "#000",
    backgroundColor: "#F7F9FC",
  },
  input: {
    marginBottom: 10,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 5,
    padding: 10,
    backgroundColor: "#F7F9FC",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 16,
    marginLeft: 16,
  },
  card: {
    flex: 1,
    backgroundColor: "#ff7f50",
    borderRadius: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
    marginBottom: 16,
    padding: 16,
  },
  headerImage: {
    height: 100,
    flexDirection: "row",
    alignItems: "center",
  },
  header: {
    marginBottom: 8,
  },
  headerTitle: {
    color: "#ffffff",
    fontSize: 18,
    fontWeight: "bold",
  },
  headerSubtitle: {
    fontSize: 12,
    color: "#ffffff",
  },
  body: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 8,
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 8,
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#ffffff",
  },
  userRole: {
    fontSize: 12,
    color: "#ffffff",
  },
  classItem: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  timelineContainer: {
    width: 30,
    alignItems: "center",
  },
  timelineDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: "#ff7f50",
    marginBottom: 8,
  },
  timelineLine: {
    flex: 1,
    width: 2,
    backgroundColor: "#ff7f50",
  },
  classContent: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    marginLeft: 8,
  },
  classHours: {
    marginRight: 8,
    alignItems: "flex-end",
  },
  startTime: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 4,
  },
  endTime: {
    fontSize: 16,
  },
  cardTitle: {
    fontSize: 16,
    color: "#00008B",
    marginBottom: 4,
  },
  cardDate: {
    fontSize: 12,
    color: "#00008B",
    marginBottom: 8,
  },
  studentListContainer: {
    marginRight: 10,
  },
  studentAvatar: {
    width: 30,
    height: 30,
    borderRadius: 15,
    marginLeft: -3,
    borderWidth: 1,
    borderColor: "#fff",
  },
  noTicketsText: {
    textAlign: "center",
    marginTop: 20,
    fontSize: 18,
  },
});