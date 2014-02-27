package com.garytse89.share;
import org.apache.cordova.CallbackContext;
import org.apache.cordova.CordovaPlugin;
import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import android.content.Intent;
import android.app.Activity;

public class ShareText extends CordovaPlugin {
	public static final String SHARE_TEXT = "shareText";
	
	@Override
	public boolean execute(String action, JSONArray args, CallbackContext callbackContext) throws JSONException {
		try {
		    if (SHARE_TEXT.equals(action)) { 
		             JSONObject arg_object = args.getJSONObject(0);
		             Intent sendIntent = new Intent();
		             sendIntent.setAction(Intent.ACTION_SEND);
		             sendIntent.putExtra(Intent.EXTRA_TEXT, "This is my text to send.");
		             sendIntent.setType("text/plain");
		             // startActivity(sendIntent); // use below
		 
		       this.cordova.getActivity().startActivity(sendIntent);
		       callbackContext.success();
		       return true;
		    }
		    callbackContext.error("Invalid action");
		    return false;
		} catch(Exception e) {
		    System.err.println("Exception: " + e.getMessage());
		    callbackContext.error(e.getMessage());
		    return false;
		} 
	}
}
