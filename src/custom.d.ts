declare module '*.jpg' {
  const value: string;
  export default value;
}

declare module '*.png' {
  const value: string;
  export default value;
}

declare module '*.svg' {
  const value: string;
  export default value;
}

interface Window {
  AndroidInterface?: any;
  AndroidBridge?: any;
  LkpAndroidBridge?: any;
  LkpWebBridge?: any;
}
