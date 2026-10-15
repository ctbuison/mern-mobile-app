import { useNetInfo } from '@react-native-community/netinfo';

// True only when we are SURE there is no connection. (null means "not known yet", which is not offline.)
export default function useIsOffline() {
  const { isConnected, isInternetReachable } = useNetInfo();
  return isConnected === false || isInternetReachable === false;
}