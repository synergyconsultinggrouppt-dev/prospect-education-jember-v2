/**
 * Android Native Bridge Configuration & Communication Handler
 * LKP Prospect Education Jember
 * 
 * Provides bi-directional JavaScript <-> Android Native WebView communication for:
 * 1. Android Native Camera Permissions & Hardware Capture (MediaStore / CameraX)
 * 2. OAuth Authentication Redirects & Custom Tabs (avoiding 403 disallowed_useragent)
 * 3. Geolocation & GPS Tracking for Student Attendance
 * 4. Native Push Notifications (FCM) & Deep Linking
 * 5. Device Biometrics, Haptics, and File Downloads / PDF Printing
 */

export interface AndroidBridgeConfig {
  appName: string;
  packageName: string;
  customScheme: string;
  oauthRedirectUri: string;
  version: string;
  apiVersion: number;
  features: {
    nativeCamera: boolean;
    oauthCustomTabs: boolean;
    biometrics: boolean;
    pushNotifications: boolean;
    gpsGeolocation: boolean;
    pdfDownloadHelper: boolean;
  };
}

export const ANDROID_BRIDGE_CONFIG: AndroidBridgeConfig = {
  appName: 'LKP Prospect Education',
  packageName: 'com.lkp.prospect.education',
  customScheme: 'lkp-prospect',
  oauthRedirectUri: 'lkp-prospect://oauth/callback',
  version: '1.0.0',
  apiVersion: 1,
  features: {
    nativeCamera: true,
    oauthCustomTabs: true,
    biometrics: true,
    pushNotifications: true,
    gpsGeolocation: true,
    pdfDownloadHelper: true,
  },
};

export type CameraPermissionStatus = 'granted' | 'denied' | 'prompt' | 'restricted' | 'unknown';

export interface NativeCameraOptions {
  facing?: 'front' | 'back';
  aspectRatio?: '3:4' | '1:1' | '35:45';
  quality?: number; // 0 - 100
  title?: string;
}

export interface NativeCameraResult {
  success: boolean;
  base64Data?: string;
  filePath?: string;
  mimeType?: string;
  error?: string;
}

export interface OAuthRedirectPayload {
  provider: 'google' | 'facebook' | 'apple' | 'custom';
  code?: string;
  token?: string;
  state?: string;
  error?: string;
  errorDescription?: string;
}

export interface NativeDeviceInfo {
  isNativeWrapper: boolean;
  platform: 'android' | 'web';
  appVersion?: string;
  androidSdk?: number;
  deviceModel?: string;
  fcmToken?: string;
  hasCamera?: boolean;
  hasGps?: boolean;
}

// Declaration of Native Android Interface exposed by WebView JavascriptInterface
export interface AndroidNativeInterface {
  // Camera & Permissions
  requestCameraPermission?: () => void;
  checkCameraPermission?: () => string; // returns 'granted' | 'denied' | 'prompt'
  launchNativeCamera?: (optionsJson: string) => void;

  // OAuth & Custom Tabs
  openOAuthInCustomTab?: (authUrl: string, redirectUri: string) => void;
  postOAuthResult?: (resultJson: string) => void;

  // Device & System
  getDeviceInfo?: () => string;
  vibrate?: (milliseconds: number) => void;
  showToast?: (message: string) => void;
  openNativePdf?: (url: string, title: string) => void;
  shareContent?: (title: string, text: string, url: string) => void;
  
  // Generic message channel
  postMessage?: (messageJson: string) => void;
}

type BridgeEventListener = (data: any) => void;
const eventListeners: Map<string, Set<BridgeEventListener>> = new Map();

/**
 * Checks if the current web app is running inside the Native Android WebView wrapper
 */
export function isAndroidApp(): boolean {
  if (typeof window === 'undefined') return false;
  
  const hasInterface = !!(
    (window as any).AndroidInterface ||
    (window as any).AndroidBridge ||
    (window as any).LkpAndroidBridge
  );

  const isAndroidUserAgent =
    typeof navigator !== 'undefined' &&
    /LkpProspectAndroid|AndroidAppWrapper|wv/i.test(navigator.userAgent);

  return hasInterface || isAndroidUserAgent;
}

/**
 * Returns the active Android Native Interface instance if available
 */
function getNativeInterface(): AndroidNativeInterface | null {
  if (typeof window === 'undefined') return null;
  return (
    (window as any).AndroidInterface ||
    (window as any).AndroidBridge ||
    (window as any).LkpAndroidBridge ||
    null
  );
}

/**
 * Native Device Information
 */
export function getNativeDeviceInfo(): NativeDeviceInfo {
  const nativeInt = getNativeInterface();
  if (!nativeInt || !isAndroidApp()) {
    return {
      isNativeWrapper: false,
      platform: 'web',
      hasCamera: typeof navigator !== 'undefined' && !!navigator.mediaDevices,
      hasGps: typeof navigator !== 'undefined' && !!navigator.geolocation,
    };
  }

  if (nativeInt.getDeviceInfo) {
    try {
      const rawInfo = JSON.parse(nativeInt.getDeviceInfo());
      return {
        isNativeWrapper: true,
        platform: 'android',
        ...rawInfo,
      };
    } catch (e) {
      console.warn('[AndroidBridge] Failed to parse native device info', e);
    }
  }

  return {
    isNativeWrapper: true,
    platform: 'android',
    hasCamera: true,
    hasGps: true,
  };
}

/**
 * =========================================================================
 * 1. CAMERA PERMISSIONS & HARDWARE CAPTURE
 * =========================================================================
 */

/**
 * Check Camera Permission from Native Android or Web standard API
 */
export async function checkCameraPermission(): Promise<CameraPermissionStatus> {
  const nativeInt = getNativeInterface();
  if (nativeInt && nativeInt.checkCameraPermission) {
    const status = nativeInt.checkCameraPermission() as CameraPermissionStatus;
    return status || 'unknown';
  }

  if (typeof navigator !== 'undefined' && navigator.permissions) {
    try {
      const perm = await navigator.permissions.query({ name: 'camera' as PermissionName });
      return perm.state as CameraPermissionStatus;
    } catch (e) {
      return 'unknown';
    }
  }

  return 'prompt';
}

/**
 * Request Native Android Camera Permission
 */
export function requestNativeCameraPermission(): Promise<boolean> {
  return new Promise((resolve) => {
    const nativeInt = getNativeInterface();
    if (nativeInt && nativeInt.requestCameraPermission) {
      // Listen for the native callback event
      const unsubscribe = addBridgeListener('onCameraPermissionResult', (result: { granted: boolean }) => {
        unsubscribe();
        resolve(result?.granted ?? false);
      });

      // Timeout fallback in case native doesn't respond
      setTimeout(() => {
        unsubscribe();
        resolve(false);
      }, 15000);

      nativeInt.requestCameraPermission();
    } else {
      // Web fallback: test getUserMedia
      if (typeof navigator !== 'undefined' && navigator.mediaDevices) {
        navigator.mediaDevices
          .getUserMedia({ video: true })
          .then((stream) => {
            stream.getTracks().forEach((track) => track.stop());
            resolve(true);
          })
          .catch(() => resolve(false));
      } else {
        resolve(false);
      }
    }
  });
}

/**
 * Launch Android Native Camera (CameraX / MediaStore Intent)
 */
export function launchNativeCameraCapture(options: NativeCameraOptions = {}): Promise<NativeCameraResult> {
  return new Promise((resolve) => {
    const nativeInt = getNativeInterface();
    if (nativeInt && nativeInt.launchNativeCamera) {
      const unsubscribe = addBridgeListener('onNativeCameraResult', (result: NativeCameraResult) => {
        unsubscribe();
        resolve(result);
      });

      // 60s timeout for user camera taking
      setTimeout(() => {
        unsubscribe();
        resolve({ success: false, error: 'Camera capture timed out' });
      }, 60000);

      nativeInt.launchNativeCamera(JSON.stringify(options));
    } else {
      resolve({
        success: false,
        error: 'Native camera interface is not available in web browser mode',
      });
    }
  });
}

/**
 * =========================================================================
 * 2. OAUTH REDIRECTS & CHROME CUSTOM TABS
 * =========================================================================
 */

/**
 * Initiates an OAuth flow via Android Custom Tabs or Native intent
 * Avoids Google's WebView 403 "disallowed_useragent" restriction
 */
export function openNativeOAuthCustomTab(authUrl: string, redirectUri = ANDROID_BRIDGE_CONFIG.oauthRedirectUri): void {
  const nativeInt = getNativeInterface();
  if (nativeInt && nativeInt.openOAuthInCustomTab) {
    nativeInt.openOAuthInCustomTab(authUrl, redirectUri);
  } else {
    // Web fallback: open in popup or redirect
    window.location.href = authUrl;
  }
}

/**
 * Handle incoming OAuth deep link callback from Android Native Wrapper
 * URL format: lkp-prospect://oauth/callback?code=...&state=...
 */
export function handleNativeOAuthRedirect(urlOrPayload: string | OAuthRedirectPayload): OAuthRedirectPayload {
  let payload: OAuthRedirectPayload;

  if (typeof urlOrPayload === 'string') {
    try {
      const parsedUrl = new URL(urlOrPayload);
      const searchParams = parsedUrl.searchParams;

      payload = {
        provider: (searchParams.get('provider') as any) || 'google',
        code: searchParams.get('code') || undefined,
        token: searchParams.get('token') || searchParams.get('access_token') || undefined,
        state: searchParams.get('state') || undefined,
        error: searchParams.get('error') || undefined,
        errorDescription: searchParams.get('error_description') || undefined,
      };
    } catch (e) {
      payload = {
        provider: 'custom',
        error: 'invalid_redirect_url',
        errorDescription: 'Could not parse deep link URL',
      };
    }
  } else {
    payload = urlOrPayload;
  }

  // Dispatch to listeners
  dispatchBridgeEvent('onOAuthResult', payload);
  return payload;
}

/**
 * =========================================================================
 * 3. HARDWARE & UTILITY FEATURES (HAPTICS, TOAST, PDF, SHARE)
 * =========================================================================
 */

/**
 * Trigger device vibration / haptic feedback
 */
export function nativeVibrate(durationMs = 50): void {
  const nativeInt = getNativeInterface();
  if (nativeInt && nativeInt.vibrate) {
    nativeInt.vibrate(durationMs);
  } else if (typeof navigator !== 'undefined' && navigator.vibrate) {
    navigator.vibrate(durationMs);
  }
}

/**
 * Display native Android toast
 */
export function nativeShowToast(message: string): void {
  const nativeInt = getNativeInterface();
  if (nativeInt && nativeInt.showToast) {
    nativeInt.showToast(message);
  }
}

/**
 * Open PDF file inside native PDF viewer or download
 */
export function nativeOpenPdf(pdfUrl: string, title = 'Dokumen LKP Prospect'): void {
  const nativeInt = getNativeInterface();
  if (nativeInt && nativeInt.openNativePdf) {
    nativeInt.openNativePdf(pdfUrl, title);
  } else {
    window.open(pdfUrl, '_blank');
  }
}

/**
 * Share document or link via Android Native Share Sheet
 */
export function nativeShare(title: string, text: string, url: string): void {
  const nativeInt = getNativeInterface();
  if (nativeInt && nativeInt.shareContent) {
    nativeInt.shareContent(title, text, url);
  } else if (typeof navigator !== 'undefined' && navigator.share) {
    navigator.share({ title, text, url }).catch(() => {});
  }
}

/**
 * =========================================================================
 * 4. BI-DIRECTIONAL EVENT SYSTEM
 * =========================================================================
 */

/**
 * Add event listener for bridge events
 */
export function addBridgeListener(eventType: string, listener: BridgeEventListener): () => void {
  if (!eventListeners.has(eventType)) {
    eventListeners.set(eventType, new Set());
  }
  eventListeners.get(eventType)!.add(listener);

  return () => {
    eventListeners.get(eventType)?.delete(listener);
  };
}

/**
 * Dispatch an event to registered bridge listeners
 */
export function dispatchBridgeEvent(eventType: string, data: any): void {
  const listeners = eventListeners.get(eventType);
  if (listeners) {
    listeners.forEach((fn) => {
      try {
        fn(data);
      } catch (err) {
        console.error(`[AndroidBridge] Error in listener for ${eventType}:`, err);
      }
    });
  }

  // Also dispatch window custom event for broad integration
  if (typeof window !== 'undefined') {
    const customEvent = new CustomEvent(`AndroidBridge:${eventType}`, { detail: data });
    window.dispatchEvent(customEvent);
  }
}

/**
 * Global Bridge Object exposed on `window` for Android Native Java/Kotlin calling
 */
if (typeof window !== 'undefined') {
  (window as any).LkpWebBridge = {
    version: ANDROID_BRIDGE_CONFIG.version,
    config: ANDROID_BRIDGE_CONFIG,
    
    // Callbacks from Android Native
    onCameraPermissionResult: (granted: boolean) => {
      dispatchBridgeEvent('onCameraPermissionResult', { granted });
    },
    
    onNativeCameraResult: (resultJsonOrObj: any) => {
      const parsed = typeof resultJsonOrObj === 'string' ? JSON.parse(resultJsonOrObj) : resultJsonOrObj;
      dispatchBridgeEvent('onNativeCameraResult', parsed);
    },
    
    onOAuthRedirect: (urlOrJson: string) => {
      handleNativeOAuthRedirect(urlOrJson);
    },

    onPushNotificationReceived: (notificationData: any) => {
      const parsed = typeof notificationData === 'string' ? JSON.parse(notificationData) : notificationData;
      dispatchBridgeEvent('onPushNotification', parsed);
    },

    onDeepLinkReceived: (deepLinkUrl: string) => {
      dispatchBridgeEvent('onDeepLink', { url: deepLinkUrl });
      if (deepLinkUrl.includes('oauth/callback')) {
        handleNativeOAuthRedirect(deepLinkUrl);
      }
    },
  };
}

/**
 * Reference Android MainActivity Kotlin snippet for the native developer
 */
export const KOTLIN_MAIN_ACTIVITY_SNIPPET = `
package com.lkp.prospect.education

import android.Manifest
import android.content.Intent
import android.content.pm.PackageManager
import android.net.Uri
import android.os.Bundle
import android.webkit.*
import android.widget.Toast
import androidx.activity.result.contract.ActivityResultContracts
import androidx.appcompat.app.AppCompatActivity
import androidx.browser.customtabs.CustomTabsIntent
import androidx.core.content.ContextCompat

class MainActivity : AppCompatActivity() {

    private lateinit var webView: WebView
    private val appUrl = "https://ais-dev-age56q5h7xuuhddpmjgv4r-157252926102.asia-east1.run.app"

    private val cameraPermissionLauncher = registerForActivityResult(
        ActivityResultContracts.RequestPermission()
    ) { isGranted ->
        webView.evaluateJavascript(
            "window.LkpWebBridge?.onCameraPermissionResult(\$isGranted);", null
        )
    }

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_main)

        webView = findViewById(R.id.webView)
        setupWebView()

        handleIntent(intent)
    }

    override fun onNewIntent(intent: Intent) {
        super.onNewIntent(intent)
        handleIntent(intent)
    }

    private fun setupWebView() {
        webView.settings.apply {
            javaScriptEnabled = true
            domStorageEnabled = true
            mediaPlaybackRequiresUserGesture = false
            userAgentString = "\$userAgentString LkpProspectAndroid/1.0"
        }

        webView.webChromeClient = object : WebChromeClient() {
            override fun onPermissionRequest(request: PermissionRequest) {
                // Grant WebRTC camera & microphone permissions to WebView
                request.grant(request.resources)
            }
        }

        webView.addJavascriptInterface(AndroidAppInterface(), "AndroidInterface")
        webView.loadUrl(appUrl)
    }

    private fun handleIntent(intent: Intent?) {
        val data: Uri? = intent?.data
        if (data != null && data.scheme == "lkp-prospect") {
            val deepLink = data.toString()
            webView.evaluateJavascript(
                "window.LkpWebBridge?.onDeepLinkReceived('\$deepLink');", null
            )
        }
    }

    inner class AndroidAppInterface {
        @JavascriptInterface
        fun requestCameraPermission() {
            if (ContextCompat.checkSelfPermission(this@MainActivity, Manifest.permission.CAMERA) == PackageManager.PERMISSION_GRANTED) {
                runOnUiThread {
                    webView.evaluateJavascript("window.LkpWebBridge?.onCameraPermissionResult(true);", null)
                }
            } else {
                cameraPermissionLauncher.launch(Manifest.permission.CAMERA)
            }
        }

        @JavascriptInterface
        fun checkCameraPermission(): String {
            val isGranted = ContextCompat.checkSelfPermission(this@MainActivity, Manifest.permission.CAMERA) == PackageManager.PERMISSION_GRANTED
            return if (isGranted) "granted" else "denied"
        }

        @JavascriptInterface
        fun openOAuthInCustomTab(authUrl: String, redirectUri: String) {
            val customTabsIntent = CustomTabsIntent.Builder().build()
            customTabsIntent.launchUrl(this@MainActivity, Uri.parse(authUrl))
        }

        @JavascriptInterface
        fun showToast(message: String) {
            runOnUiThread {
                Toast.makeText(this@MainActivity, message, Toast.LENGTH_SHORT).show()
            }
        }
    }
}
`;
