## iOS Click Bug repro

INSTRUCTIONS:

Open repro.html in iOS simulator. You will see a list. Try scrolling it:

* Put your mouse on one list element
* Press mouse button
* Move mouse some distance up or down to drag the list (scroll by more than one row, but stay within bounds of the list)
* **Remain motionless with the mouse for some time** (quite a lot of time is required on iOS6, try a couple of seconds, but on iOS7 almost no time is required)
* Release the mouse button. 

Notice the following:

* Sometimes (not always) a click event will be generated when you do this ( in this demo you will see an alert whenever this happens. In a real app it may be navigation to a completely different page, etc)
* Notice that the app becomes completely unusable on iOS7. Almost any attempt to simply scroll will generate click events.
* Notice the number on the alert - it won't match the number of the row your mouse cursor (or finger) is on! The click event is generated *at the physical coordinates where you started the scroll*.

