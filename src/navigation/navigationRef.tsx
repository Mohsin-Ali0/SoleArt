import {createNavigationContainerRef} from '@react-navigation/native';

export const navigationRef = createNavigationContainerRef<any>();

export function navigate(name: string, params?: object) {
  if (navigationRef.isReady()) {
    navigationRef.navigate(name, params);
  }
}

export function reset(routes: Array<{name: string}>) {
  if (navigationRef.isReady()) {
    navigationRef.resetRoot({
      index: 0,
      routes,
    });
  }
}

export function navigateNested(root: string, screen: string) {
  if (navigationRef.isReady()) {
    navigationRef.navigate(root, {screen});
  }
}

export function goBack() {
  if (navigationRef.isReady()) {
    navigationRef.goBack();
  }
}
