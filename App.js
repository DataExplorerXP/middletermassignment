import React, { useEffect, useState, createContext, useContext,useRef } from 'react';
import { View, Text, Button, SafeAreaView, ScrollView, StyleSheet, Alert, Image} from 'react-native';
import {getWeather} from './useWeatherAPI';
import{ NavigationContainer} from'@react-navigation/native'; // 네비게이션컨테이너
import{ createDrawerNavigator, DrawerContentScrollView, DrawerItemList, DrawerItem} from'@react-navigation/drawer'; // Drawer 네비게이션
import{ WebView} from'react-native-webview';
import Constants from 'expo-constants';

const P1="오늘의 날씨"
const P2="추천 운동"

function getOnlyTHR(data) {
  values=data.split("\n")[4];
  while(values.indexOf("  ")!=-1){
    values=values.replace("  "," ");
  }
  value_list=values.split(" ")
  ta=value_list[11]; // 기온: C
  hm=value_list[13]; // 습도: %
  rn=value_list[15]; //강수량: mm
  return [ta, hm, rn];
}
// GPT 구간 시작
export const WeatherContext = createContext();
export const WeatherProvider = ({ children }) => {
  const [weather, setWeather] = useState([]);

  const updateWeather = async () => {
    const weatherData = await getWeather(); // 비동기 데이터 가져오기
    setWeather(getOnlyTHR(weatherData.data));      // 가져온 데이터 처리 및 상태 업데이트
  };

  useEffect(() => {
    updateWeather();
    // setWeather([33, 27, -9]); // 테스트
  }, []);

  return (
    <WeatherContext.Provider value={{ weather, setWeather }}>
      {children}
    </WeatherContext.Provider>
  );
};
// gpt 구간 끝

function Page1({navigation}) {
  const { weather } = useContext(WeatherContext);
  const DI=weather[0] - 0.55*( 1 - 0.01 * weather[1] ) * ( weather[0] - 14.5);
  var s_DI;
  if(DI<=21){
    s_DI="모두가 쾌적"
  }else if(DI<=24){
    s_DI="절반 미만이 불쾌"
  }else if(DI<=27){
    s_DI="절반 이상이 불쾌"
  }else if(DI<=32){
    s_DI="대부분이 불쾌"
  }else{
    s_DI="모두가 불쾌"
  }
  const t_DI=<Text style={styles.discomfort_index}>불쾌지수: 한국인 {s_DI}합니다!!</Text>;
  if(weather[2]>0){
    return(
      <View>
        <Image style={styles.recommandImage} source={require("./assets/rain.jpg")}/>
        {t_DI}
        <Text style={styles.recommandText}>비가 내리네요... 감성 충만한 날이니 요가 어떠신가요?</Text>
      </View>
    )
  }else if(weather[0]>=33){
    return(
      <View>
        <Image style={styles.recommandImage} source={require("./assets/tooHot.jpg")}/>
        {t_DI}
        <Text style={styles.alertText}>폭염(33도 이상)입니다!! 야외활동을 삼가시고 물을 자주 마시길 바랍니다!</Text>
      </View>
    )
  }else if(DI<=21){
    return(
      <View>
        <Image style={styles.recommandImage} source={require("./assets/runningman.webp")}/>
        {t_DI}
        <Text style={styles.recommandText}>운동하는 데 있어 최고의 날씨네요! 달리기 어떠신가요?</Text>
      </View>
    );
  }else if(DI<=24){
    return(
      <View>
        <Image style={styles.recommandImage} source={require("./assets/jogging.jpg")}/>
        {t_DI}
        <Text style={styles.recommandText}>운동하기 괜찮은 날씨네요! 조깅 어떠신가요?</Text>
      </View>
    );
  }else if(DI<=27){
    return(
      <View>
        <Image style={styles.recommandImage} source={require("./assets/strolling.jpg")}/>
        {t_DI}
        <Text style={styles.recommandText}>가벼운 운동도 좋을 것 같아요!! 산책 어떠신가요?</Text>
      </View>
    )
  }else if(27<DI){
    return(
      <View>
        <Image style={styles.recommandImage} source={require("./assets/arm.jpg")}/>
        {t_DI}
        <Text style={styles.recommandText}>운동하기 쉽지 않은 날씨네요^^;;... 실내 운동은 어떠신가요?</Text>
      </View>
    );
  }
}
function Page2({ navigation }) {
  const { weather } = useContext(WeatherContext);
  const DI=weather[0] - 0.55*( 1 - 0.01 * weather[1] ) * ( weather[0] - 14.5);
  if(weather[2]>0){
    return(
      <SafeAreaView style={styles.safearea}>
        <WebView style={styles.webview} source={{uri:"https://www.youtube.com/watch?v=OBTl49bVk94"}}/>
      </SafeAreaView>
    )
  }else if(weather[0]>=33){
    return(
      <SafeAreaView style={styles.safearea}>
        <WebView style={styles.webview} source={{uri:"https://www.youtube.com/watch?v=MInkPcfcYG8"}}/>
      </SafeAreaView>
    )
  }else if(DI<=21){
    return(
      <SafeAreaView style={styles.safearea}>
        <WebView style={styles.webview} source={{uri:"https://www.youtube.com/watch?v=jMc_0h9vcN0"}}/>
      </SafeAreaView>
    );
  }else if(DI<=24){
    return(
      <SafeAreaView style={styles.safearea}>
        <WebView style={styles.webview} source={{uri:"https://www.youtube.com/watch?v=C95JX4atgIQ"}}/>
      </SafeAreaView>
    );
  }else if(DI<=27){
    return(
      <SafeAreaView style={styles.safearea}>
        <WebView style={styles.webview} source={{uri:"https://www.youtube.com/watch?v=tva-WJyZoeg"}}/>
      </SafeAreaView>
    )
  }else if(27<DI){
    return(
      <SafeAreaView style={styles.safearea}>
        <WebView style={styles.webview} source={{uri:"https://www.youtube.com/watch?v=-_DUjHxgmWk"}}/>
      </SafeAreaView>
    );
  }
}
function CustomDrawerContent(props) {
  return(
    <DrawerContentScrollView {...props} style={{backgroundColor:"seagreen"}}>
      <DrawerItemList {...props}/>
      <DrawerItem label="Copyright" onPress={() => alert("Copyright 2024. PKNU all right reserved.")} />
    </DrawerContentScrollView>
  );
}
const Drawer= createDrawerNavigator();
const App = () => {
  return (
      <WeatherProvider>
        <NavigationContainer>
          <Drawer.Navigator initialRouteName={P1} drawerContent={(props) => <CustomDrawerContent {...props} />}>
            <Drawer.Screen name={P1} component={Page1} />
            <Drawer.Screen name={P2} component={Page2} />
          </Drawer.Navigator>
        </NavigationContainer>
      </WeatherProvider>
  );
};
const styles = StyleSheet.create({
  recommandImage: {
    resizeMode: 'contain',
    height: 300,
    width: 400,
    alignContent:"center"
  },
  safearea:{
    flex:1
  },
  webview:{
    flex:1
  },
  discomfort_index:{
    fontSize:20,
    fontStyle:"bold",
    color: "#171944",
    alignContent:"center",
    textAlign:"center"
  },
  recommandText:{
    fontSize:18,
    fontStyle:"bold",
    alignContent:"center",
    textAlign:"center"
  },
  alertText:{
    fontSize:18,
    fontStyle:"bold",
    color:"red",
    alignContent:"center",
    textAlign:"center"
  }
});
export default App;
