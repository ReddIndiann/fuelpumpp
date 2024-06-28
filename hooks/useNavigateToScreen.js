// useNavigateToScreen.js
import { useNavigation } from '@react-navigation/native';

export const useNavigateToScreen = () => {
  const navigation = useNavigation();

  const navigateToScreen = (screenName) => {
    navigation.navigate(screenName);
  };

  return navigateToScreen;
};
