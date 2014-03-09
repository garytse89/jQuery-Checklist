jQuery Mobile Checklist
==================

This is a mobile checklist application built with jQuery Mobile. 

You can create a new checklist, save it as a template, and share it via a custom HTML link to someone using the Android text sharing feature.

I've accidentally included the other unnecessary build folders of the app, but all you need is the www folder.

1) Building: make a new cordova project and put the contents of the www folder inside, then run:

    cordova build
2) cd in the terminal to the root directory of this project and run:
    
    adb install -r platforms/android/bin/HelloCordova-debug.apk
    
3) Connect an Android USB cable and look at the console:

    adb logcat CordovaLog:D *:s