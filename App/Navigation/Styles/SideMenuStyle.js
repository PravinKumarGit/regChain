
import { StyleSheet } from 'react-native'
import { Colors } from '../../Themes';

export default StyleSheet.create({
    container: {
      flex: 1
    },
    navItemStyle: {
      padding: 10,
      color:'#000000'
    },
    navItemStyleSeleted:{
      padding: 10,
      color:'#fb6e30'
    },
    navSectionStyle: {
      backgroundColor: 'white',
      paddingHorizontal: 10,
      color:Colors.heading,
      flexDirection:'row',
      justifyContent:'space-between'
    },
    sectionHeadingStyle: {
      paddingTop: 30,
      paddingBottom: 10,
      paddingHorizontal: 20,
      backgroundColor: '#f7f7f7',
      fontSize:18,
      fontWeight:'500',
      color:'#fb6e30'
    },
    footerContainer: {
      padding: 20,
      backgroundColor: 'lightgrey'
    },
    footerBottom:{
     height:'100%',
     width:'100%',
     flex:1
    },
    horizontalLine:{
        height:1,
        width:'100%',
        backgroundColor:'#c8c8c8'
    },
    arrow:{
        height:12,
        width:12,
        marginRight:10,
        marginTop:15
    }
  });
  