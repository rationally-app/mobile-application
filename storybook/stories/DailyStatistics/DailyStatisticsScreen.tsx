// import React from "react";
// import { storiesOf } from "@storybook/react-native";
// import { View } from "react-native";
// import { DailyStatisticsScreenContainer } from "../../../src/components/DailyStatistics/DailyStatisticsScreen";
// import { navigation } from "../mocks/navigation";
// import { NavigationContainer } from "@react-navigation/native";
// import { createDrawerNavigator } from "@react-navigation/drawer";
// import {
//   createStackNavigator,
//   TransitionPresets,
// } from "@react-navigation/stack";
// import { ThemeContext } from "../../../src/context/theme";
// import { govWalletTheme } from "../../../src/common/styles/themes";
// import { CampaignPolicy } from "../../../src/types";
// import { CampaignConfigContext } from "../../../src/context/campaignConfig";

// const products: CampaignPolicy[] = [
//   {
//     category: "toilet-paper",
//     name: "🧻 Toilet Paper",
//     description: "",
//     order: 1,
//     quantity: {
//       period: 7,
//       limit: 2,
//       default: 1,
//       unit: {
//         type: "POSTFIX",
//         label: " roll(s)",
//       },
//     },
//   },
//   {
//     category: "chocolate",
//     name: "🍫 Chocolate",
//     order: 2,
//     quantity: {
//       period: 7,
//       limit: 15,
//       default: 0,
//       unit: {
//         type: "POSTFIX",
//         label: " bar(s)",
//       },
//     },
//   },
//   {
//     category: "vouchers",
//     name: "🎟 Vouchers",
//     description: "",
//     order: 1,
//     quantity: {
//       period: 1,
//       limit: 1,
//       default: 1,
//       unit: {
//         type: "POSTFIX",
//         label: " qty",
//       },
//     },
//   },
//   {
//     category: "instant-noodles",
//     name: "🍜 Instant Noodles",
//     description: "",
//     order: 1,
//     quantity: {
//       period: 1,
//       limit: 1,
//       default: 1,
//       unit: {
//         type: "POSTFIX",
//         label: " qty",
//       },
//     },
//   },
//   {
//     category: "store",
//     name: "🏢 Store",
//     description: "",
//     order: 1,
//     quantity: {
//       period: 1,
//       limit: 1,
//       default: 1,
//       unit: {
//         type: "POSTFIX",
//         label: " qty",
//       },
//     },
//   },
//   {
//     category: "store",
//     name: "🏢 Store",
//     description: "",
//     order: 1,
//     quantity: {
//       period: 1,
//       limit: 1,
//       default: 1,
//       unit: {
//         type: "POSTFIX",
//         label: " qty",
//       },
//     },
//   },
// ];

// const reactNavigationDecorator = (story: any): JSX.Element => {
//   const Screen = (): any => story();
//   const Stack = createStackNavigator();
//   const stackScreenOptions = {
//     headerShown: false,
//     ...TransitionPresets.SlideFromRightIOS,
//     gestureEnabled: true,
//   };

//   function StoryStack() {
//     return (
//       <Stack.Navigator screenOptions={stackScreenOptions}>
//         <Stack.Screen name="Story" component={Screen} />
//       </Stack.Navigator>
//     );
//   }
//   const Drawer = createDrawerNavigator();
//   const drawerOptions = {
//     drawerPosition: "right",
//     drawerType: "slide",
//   };
//   return (
//     <NavigationContainer>
//       <Drawer.Navigator screenOptions={{
//         drawerStyle:
//       }}>
//         <Drawer.Screen name="Story" component={StoryStack} />
//       </Drawer.Navigator>
//     </NavigationContainer>
//   );
// };

// storiesOf("Statistics", module)
//   .addDecorator((Story: any) => reactNavigationDecorator(Story))
//   .add("Screen", () => (
//     <View style={{ height: "100%" }}>
//       <DailyStatisticsScreenContainer
//         navigation={{
//           ...navigation,
//           ...{ isFocused: () => null, addListener: () => null },
//         }}
//       />
//     </View>
//   ));

// storiesOf("Statistics", module)
//   .addDecorator((Story: any) => {
//     return (
//       <ThemeContext.Provider
//         value={{
//           theme: govWalletTheme,
//           setTheme: () => {},
//         }}
//       >
//         <CampaignConfigContext.Provider
//           value={{
//             policies: products,
//             features: null,
//             c13n: {
//               distributedAmount: "You have recorded",
//               lastDistributedTiming: "Last recorded at %{dateTime}",
//             },
//           }}
//         >
//           {reactNavigationDecorator(Story)}
//         </CampaignConfigContext.Provider>
//       </ThemeContext.Provider>
//     );
//   })
//   .add("Screen (GovWallet)", () => (
//     <View style={{ height: "100%" }}>
//       <DailyStatisticsScreenContainer
//         navigation={{
//           ...navigation,
//           ...{ isFocused: () => null, addListener: () => null },
//         }}
//       />
//     </View>
//   ));
