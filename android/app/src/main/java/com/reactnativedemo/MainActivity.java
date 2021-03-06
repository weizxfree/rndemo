package com.reactnativedemo;

import android.content.Intent;

import com.facebook.react.ReactActivity;
import com.sensorsdata.analytics.android.sdk.util.SensorsDataUtils;

public class MainActivity extends ReactActivity {

    /**
     * Returns the name of the main component registered from JavaScript.
     * This is used to schedule rendering of the component.
     */
    @Override
    protected String getMainComponentName() {
        return "reactNativeDemo";
    }


    @Override
    public void onNewIntent(Intent intent) {
        super.onNewIntent(intent);
        SensorsDataUtils.handleSchemeUrl(this, intent);
    }
}
