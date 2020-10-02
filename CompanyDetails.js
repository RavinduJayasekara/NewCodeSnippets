import React, { useState, useCallback, useEffect } from "react";
import {
  ActivityIndicator,
  Button,
  Platform,
  StyleSheet,
  Text,
  View,
} from "react-native";

import Card from "../../components/UI/Card";
import Colors from "../../constants/Colors";
import { Picker } from "@react-native-community/picker";
import Watch from "../../Links/Watch";
import Links from "../../Links/Links";
import CustomButton from "../../components/UI/CustomButton";
import { color } from "react-native-reanimated";

const generateLink = (sCode) => {
  return (
    Links.mLink +
    "watch?action=getWatchForSecurity&format=json&securityid=" +
    sCode +
    "&exchange=CSE&bookDefId=1"
  );
};

const CompanyDetailsScreen = (props) => {
  const [lastTradedValue, setLastTradedValue] = useState(
    props.route.params.tradeprice
  );
  const [perChange, setPerChange] = useState(props.route.params.netchange);
  const [netChange, setNetChange] = useState(props.route.params.perchange);
  const [highValue, setHighValue] = useState(props.route.params.highpx);
  const [lowValue, setLowValue] = useState(props.route.params.lowpx);
  const [totTurnOver, setTotTurnOver] = useState(
    props.route.params.totturnover
  );
  const [totVolume, setTotVolume] = useState(props.route.params.totvolume);
  const [pickerElements, setPickerElements] = useState([]);
  const [list1, setList1] = useState([]);
  const [list2, setList2] = useState([]);
  const [security, setSecurity] = useState(props.route.params.secCode);
  const [companyName, setCompanyName] = useState(
    props.route.params.companyname
  );
  // const [timePassed, setTimePassed] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [loadingDetails, setLoadingDetails] = useState(false);
  const [timePassed, setTimePassed] = useState(false);

  const getCompanyInfo = useCallback(async (link) => {
    try {
      const response = await fetch(link);

      if (!response.ok) {
        throw new Error("Something went wrong!");
      }

      const resData = await response.text();

      let replaceString = resData.replace(/'/g, '"');
      let object = JSON.parse(replaceString);

      setSecurity(object.data.security);
      setCompanyName(object.data.companyname);
      setLastTradedValue(object.data.tradeprice);
      setPerChange(object.data.perchange);
      setNetChange(object.data.netchange);
      setLowValue(object.data.lowpx);
      setHighValue(object.data.highpx);
      setTotTurnOver(object.data.totturnover);
      setTotVolume(object.data.totvolume);
    } catch (err) {
      throw err;
    }
  }, []);
  const getAllSecurityData = useCallback(async () => {
    try {
      const response = await fetch(Links.mLink + Watch.allSecurityLink);

      const resData = await response.text();

      let replaceString = resData.replace(/'/g, '"');
      let object = JSON.parse(replaceString);

      setPickerElements(object.data.items);
    } catch (err) {
      throw err;
    }
  }, [setPickerElements]);

  const loadAllSecurities = useCallback(async () => {
    setIsLoading(true);
    await getAllSecurityData();
    setIsLoading(false);
  }, [setIsLoading, getAllSecurityData]);

  useEffect(() => {
    loadAllSecurities();
  }, [loadAllSecurities]);

  // const setUpFunc = useCallback(async () => {
  //   const linkUrl = generateLink(security);

  //   setTimeout(() => setTimePassed(!timePassed), 5000);
  //   if (timePassed) {
  //     setLoadingDetails(true);
  //     await getCompanyInfo(linkUrl);
  //     setLoadingDetails(false);
  //     console.log("Yes");
  //   } else {
  //     console.log("No");
  //   }
  // }, [timePassed]);

  // useEffect(() => {
  //   setUpFunc();
  // }, [setUpFunc]);

  useEffect(() => {
    const linkUrl = generateLink(security);

    let cleanUpVal = setTimeout(() => setTimePassed(!timePassed), 5000);
    const setUpFunc = async () => {
      if (timePassed) {
        setLoadingDetails(true);
        await getCompanyInfo(linkUrl);
        setLoadingDetails(false);
        console.log("Yes");
      } else {
        console.log("No");
      }
    };
    setUpFunc();

    return () => clearTimeout(cleanUpVal);
  }, [timePassed]);

  const secChangeHandler = async (itemData) => {
    const linkUrl = generateLink(itemData);
    setSecurity(itemData);
    setLoadingDetails(true);
    await getCompanyInfo(linkUrl);
    setLoadingDetails(false);
  };

  if (isLoading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color={Colors.primary} />
      </View>
    );
  }

  // setTimeout(() => setTimePassed(!timePassed), 5000);
  // if (timePassed) {
  //   console.log(linkUrl);
  //   getCompanyInfo(linkUrl);
  // } else {
  //   console.log("Else " + security);
  // }

  return (
    <View style={styles.container}>
      <View style={styles.pickerContainer}>
        <Picker
          style={{ backgroundColor: "white" }}
          itemStyle={{ height: "100%", fontSize: 15 }}
          onValueChange={secChangeHandler}
          selectedValue={security}
        >
          {pickerElements.map((item, index) => (
            <Picker.Item
              label={item.security}
              value={item.security}
              key={index}
            />
          ))}
        </Picker>
      </View>
      <View style={styles.companyNameContainer}>
        <Text style={styles.companyTitle}>{companyName}</Text>
      </View>
      <View style={styles.lastTradedValue}>
        {loadingDetails ? (
          <View>
            <ActivityIndicator size="small" color={Colors.primary} />
          </View>
        ) : (
          <Text>Last: {lastTradedValue}</Text>
        )}
        {loadingDetails ? (
          <View>
            <ActivityIndicator size="small" color={Colors.primary} />
          </View>
        ) : (
          <Text>
            {netChange}
            <Text>({perChange}%)</Text>
          </Text>
        )}
      </View>
      <View style={styles.buttonContainer}>
        <View style={styles.buttonColumn}>
          <CustomButton
            title="Buy"
            onPress={() => props.navigation.navigate("BuyScreen")}
            buttonColor={Colors.positive}
            style={styles.button}
            textColor={"white"}
          />
          <CustomButton
            title="Trades"
            onPress={() => {}}
            buttonColor={Colors.none}
            style={styles.button}
            textColor={"white"}
          />
        </View>
        <View style={styles.buttonColumn}>
          <CustomButton
            title="Sell"
            onPress={() => props.navigation.navigate("BuyScreen")}
            buttonColor={Colors.negative}
            style={styles.button}
            textColor={"white"}
          />
          <CustomButton
            title="Trades Summary"
            onPress={() => {}}
            buttonColor={Colors.none}
            style={styles.button}
            textColor={"white"}
          />
        </View>
        <View style={styles.buttonColumn}>
          <CustomButton
            title="Market Depth"
            onPress={() => {}}
            buttonColor={Colors.primary}
            style={styles.button}
            textColor={"white"}
          />
          <CustomButton
            title="Chart"
            onPress={() => {}}
            buttonColor={Colors.none}
            textColor="white"
            style={styles.button}
          />
        </View>
        <View style={styles.buttonColumn}>
          <CustomButton
            title="Announcement"
            onPress={() => {}}
            buttonColor={Colors.none}
            style={styles.button}
            textColor={"white"}
          />
          <CustomButton
            title="Watch List"
            onPress={() => {}}
            buttonColor={Colors.none}
            style={styles.button}
            textColor={"white"}
          />
        </View>
      </View>
      <View style={styles.highLowMainContainer}>
        <View style={styles.highLowContainer}>
          <View>
            <Text>High</Text>
            <Text>Turnover</Text>
          </View>
          <View>
            {loadingDetails ? (
              <View>
                <ActivityIndicator size="small" color={Colors.primary} />
              </View>
            ) : (
              <Text>{highValue}</Text>
            )}
            {loadingDetails ? (
              <View>
                <ActivityIndicator size="small" color={Colors.primary} />
              </View>
            ) : (
              <Text>{totTurnOver}</Text>
            )}
          </View>
        </View>
        <View style={styles.highLowContainer}>
          <View>
            <Text>Low</Text>
            <Text>Volume</Text>
          </View>
          <View>
            {loadingDetails ? (
              <View>
                <ActivityIndicator size="small" color={Colors.primary} />
              </View>
            ) : (
              <Text>{lowValue}</Text>
            )}
            {loadingDetails ? (
              <View>
                <ActivityIndicator size="small" color={Colors.primary} />
              </View>
            ) : (
              <Text>{totVolume}</Text>
            )}
          </View>
        </View>
      </View>
      <View style={styles.totBidAskContainer}>
        <View style={styles.bidAskConatiner}>
          <Text>Total Bids: {0}</Text>
        </View>
        <View style={styles.bidAskConatiner}>
          <Text>Total Asks: {0}</Text>
        </View>
      </View>
      <View style={styles.bidAskListContainer}>
        <View style={styles.bidAskList}>
          <View style={styles.list}>
            <Text>Splits</Text>
            <Text>Bid Qty</Text>
            <Text>Bid</Text>
          </View>
          {list1.map((item) => (
            <View style={styles.list1Container}>
              <Text>{item.splits}</Text>
              <Text>{item.bidQty}</Text>
              <Text>{item.bid}</Text>
            </View>
          ))}
        </View>
        <View style={styles.bidAskList}>
          <View style={styles.list}>
            <Text>Splits</Text>
            <Text>Ask Qty</Text>
            <Text>Ask</Text>
          </View>
          {list2.map((item) => (
            <View style={styles.list1Container}>
              <Text>{item.splits}</Text>
              <Text>{item.askQty}</Text>
              <Text>{item.ask}</Text>
            </View>
          ))}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  buttonContainer: {
    flexDirection: "row",
    width: "100%",
    justifyContent: "space-around",

    backgroundColor: "white",
  },
  container: {
    flex: 1,
  },
  buttonColumn: {
    width: "23%",
    marginVertical: 10,
  },
  button: {
    marginVertical: 5,
  },
  pickerContainer: {
    height: Platform.OS === "android" ? "7.5%" : "20%",
    borderRadius: 20,
    overflow: "hidden",
    marginVertical: 15,
  },
  companyNameContainer: {
    height: "4%",
    justifyContent: "center",
    alignItems: "center",
    marginVertical: 10,
  },
  companyTitle: {
    fontSize: 18,
  },
  lastTradedValue: {
    height: "8%",
    flexDirection: "row",
    justifyContent: "space-evenly",
  },
  highLowMainContainer: {
    flexDirection: "row",
    width: "100%",
    marginVertical: 15,
  },
  highLowContainer: {
    width: "48%",
    flexDirection: "row",
    justifyContent: "space-between",
    marginHorizontal: 4,
  },
  totBidAskContainer: {
    flexDirection: "row",
    width: "100%",
    marginVertical: 8,
  },
  bidAskConatiner: {
    width: "48%",
    marginHorizontal: 4,
  },
  bidAskListContainer: {
    flexDirection: "row",
    width: "100%",
  },
  bidAskList: {
    width: "48%",
    marginHorizontal: 4,
  },
  list: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default CompanyDetailsScreen;
