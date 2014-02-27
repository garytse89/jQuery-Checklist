package io.cordova.hellocordova;

import org.apache.cordova.CallbackContext;
import org.apache.cordova.CordovaPlugin;
import org.json.JSONException;
import org.json.JSONObject;

import android.content.Context;
import android.content.Intent;
import android.net.Uri;
import android.telephony.TelephonyManager;
import android.webkit.WebView;

public class ShareToText extends CordovaPlugin {
	  private WebView mAppView;
	  private HelloCordova mGap;

	  public ShareToText(HelloCordova helloCordova, WebView view)
	  {
	    mAppView = view;
	    mGap = helloCordova;
	  }

	  public String getTelephoneNumber(){
	    TelephonyManager tm = 
	      (TelephonyManager) mGap.getSystemService(Context.TELEPHONY_SERVICE);
	    String number = "6046036962";//tm.getLine1Number();
	    return number;
	  }
	  
	  public String sayHi(){
		  return "Here's my number baby:";
	  }
	  
	  public void sendSMS(){
		  // See http://stackoverflow.com/a/7242594
		 String phoneNumber = "6046036962";
		 String message = "ahahhahaha";
		 System.out.println("Starting SMS app, with number(s): " + phoneNumber + " and message " + message);
				Intent sendIntent = new Intent(Intent.ACTION_VIEW);
				sendIntent.putExtra("sms_body", message);
				sendIntent.putExtra("address", phoneNumber);
				sendIntent.setData(Uri.parse("smsto:" + phoneNumber));
				this.cordova.getActivity().startActivity(sendIntent);
			}

		public boolean execute() throws JSONException {
			try {
	            Intent sendIntent = new Intent();
	            sendIntent.setAction(Intent.ACTION_SEND);
	            sendIntent.putExtra(Intent.EXTRA_TEXT, "This is my text to send.");
	            sendIntent.setType("text/plain");
	            // startActivity(sendIntent); // use below
   		        this.cordova.getActivity().startActivity(sendIntent);
			    return true;
		
			} catch(Exception e) {
			    System.err.println("Exception: " + e.getMessage());
			    return false;
			} 
		}
	  
	  
	  public void shareIt(){
		  Intent sendIntent = new Intent();
          sendIntent.setAction(Intent.ACTION_SEND);
          sendIntent.putExtra(Intent.EXTRA_TEXT, "This is my text to send.");
          sendIntent.setType("text/plain");
          // startActivity(sendIntent); // use below

          this.cordova.getActivity().startActivity(sendIntent);
	  }
}