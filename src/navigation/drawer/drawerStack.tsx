import {
  ImageBackground,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import {
  createDrawerNavigator,
  DrawerContentComponentProps,
} from '@react-navigation/drawer';
import HomeScreen from '../../screens/app/Home/HomeScreen';
import {Text} from 'react-native-gesture-handler';

const Drawer = createDrawerNavigator();

const CustomDrawerContent = ({navigation}: DrawerContentComponentProps) => {
  const menuItems = [
    // { name: 'Home', label: 'Home', icon: Icons.Home },
    // { name: 'Microns', label: 'Microns', icon: Icons.Analytics },
    {
      name: 'TermsAndConditions',
      label: 'Terms & conditions',
      //   icon: Icons.Terms,
    },
    {name: 'PrivacyPolicy', label: 'Privacy & policy'},
    {name: 'ContactUs', label: 'Contact us'},
  ];

  return (
    <View style={styles.drawerContainer}>
      <View style={styles.header}>
        {/* <Image source={Icons.Logo} style={styles.logo} /> */}
        <Text style={styles.headerText}>SOLART</Text>
      </View>

      <View style={styles.menuContainer}>
        {menuItems.map(item => (
          <TouchableOpacity
            key={item.name}
            style={styles.menuItem}
            onPress={() => navigation.navigate(item.name)}>
            {/* <Image source={item.icon} style={styles.menuIcon} /> */}
            <Text style={styles.menuText}>{item.label}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <TouchableOpacity
        style={styles.logoutButton}
        onPress={() => navigation.navigate('Login')}>
        {/* <Image source={Icons.Logout} style={styles.menuIcon} /> */}
        <Text style={styles.logoutText}>Logout</Text>
      </TouchableOpacity>
    </View>
  );
};

const MyDrawer = () => {
  return (
    <Drawer.Navigator
      drawerContent={props => <CustomDrawerContent {...props} />}
      initialRouteName="Home"
      screenOptions={{
        drawerType: 'slide',
        overlayColor: 'transparent',
        drawerStyle: {
          width: '60%',
          backgroundColor: 'transparent',
        },
      }}>
      {/* Screens */}
      <Drawer.Screen
        name="Home"
        component={HomeScreen}
        options={{headerShown: false}}
      />
    </Drawer.Navigator>
  );
};

export default MyDrawer;

const styles = StyleSheet.create({
  drawerContainer: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#D0DAEE',
  },
  logo: {
    width: 40,
    height: 40,
    marginRight: 10,
  },
  headerText: {
    fontFamily: 'Urbanist-Bold',
    fontSize: 22,
    color: '#4E008E',
  },
  menuContainer: {
    flex: 1,
    paddingTop: 20,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    paddingHorizontal: 25,
  },
  menuIcon: {
    width: 24,
    height: 24,
    marginRight: 15,
    tintColor: '#5B6E95',
  },
  menuText: {
    fontFamily: 'Urbanist-Medium',
    fontSize: 16,
    color: '#5B6E95',
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 25,
    borderTopWidth: 1,
    borderTopColor: '#D0DAEE',
  },
  logoutText: {
    fontFamily: 'Urbanist-SemiBold',
    fontSize: 16,
    color: '#4E008E',
    marginLeft: 15,
  },
});
